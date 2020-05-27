

// Years
// When the document is ready, send an API call to
// identify which columns in the database represent years
// the values in these columns represent the number of collaborations
// between each pair of countries for each year
var edgeArray = [];

// Setting bounds for the leaflet map
// Based on rob.m advice on stack overflow
// https://stackoverflow.com/questions/22155017/can-i-prevent-panning-leaflet-map-out-of-the-worlds-edge



// Using jQuery to fadeout the MoMA logo on zoomstart event
map2.on('zoomstart', function () {
    $("#mainTitle").fadeOut("slow", function () {
    });
});

// creating an empty array of edges
var edgeArray = [];

function fillChart(pathID) {
    /**
 * Populates the chart div based on a path id.
 * @param  {int} pathID  The Path's identifier.
 */
    Highcharts.chart({

        chart: {
            renderTo: 'Line',
            type: 'line',
            backgroundColor: "#454a6467",
            style: {
                fontFamily: "Abhaya Libre",
            }
        },

        colors: ["#d38236"],

        title: {
            // the chart title is set to the name of countries in each pair
            text: '{0}-{1}'.replace('{0}', edgeArray[pathID]['options']['country1']).replace('{1}', edgeArray[pathID]['options']['country2']),
            style: {
                color: '#f1ece4',
                fontSize: "15px"
            }
        },
        subtitle: {
            // the chart subtitle is set to the total number of collaboration of each pair
            text: '{0} Collaborations'.replace('{0}', edgeArray[pathID]['options']['Total']),
            style: {
                color: '#f1ece4',
                fontSize: "10px"
            }
        },

        plotOptions: {
            series: {
                label: {
                    enabled: false
                },
                // the point start is set to the earliest year in the dataset
                pointStart: edgeArray[pathID]['options']['pointStart']
            }
        },
        legend: {
            enabled: false
        },

        yAxis: {
            title: {
                text: 'Number of Collaborations',
                style: {
                    color: '#f1ece4',
                }
            },
            labels: {
                style: {
                    color: '#f1ece4'
                }
            }
        },
        xAxis: {
            title: {
                text: 'Year',
                style: {
                    color: '#f1ece4',
                }
            },
            labels: {
                style: {
                    color: '#f1ece4'
                }
            }
        },
        series: [{
            name: 'Collaborations',
            // data is set to the dataSeries attribute of each path object
            data: edgeArray[pathID]['options']['dataSeries']


        }],

        exporting: {
            enabled: false
        },

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }

    });
}


// API URL
var collabURL = 'http://dev.spatialdatacapture.org:8709/Assessmen/Collaboration/Collab';
var collabYearURL = 'http://dev.spatialdatacapture.org:8709/Assessmen/Collaboration/CollabYears';

var edges = new L.layerGroup().addTo(map2);

// Get JSON based on the API call
var CollaborationPlotting = function () {
    edges.clearLayers()
    $.getJSON(collabURL, function (data) {
        // iterate over each element in the respone
        $.each(data, function (k, v) {
            // creating empty arrays for years and data series, extracting the keys from each element in the response
            var yearsArray = [];
            var dataSeriesValues = [];
            var fields = Object.keys(v);

            // iterate over each element in the object keys
            // push the column name to the years array if it's a number
            for (var i = 0; i < fields.length; i++) {
                if (!isNaN(fields[i])) {
                    yearsArray.push(parseInt(fields[i]));
                }
            }

            // iterating over the range of years from the minimum to maximum
            // when the api response contains a value for a year, we push this value to the dataSeriesValues array
            // when it doesn't, we push the value 0
            var dataSeriesValues = [];
            for (i = Math.min(...yearsArray); i <= Math.max(...yearsArray); i++) {
                var collabVal = v[i];
                if (collabVal === undefined) {
                    dataSeriesValues.push(0);
                }
                else {
                    dataSeriesValues.push(collabVal)
                }
            }

            // setting the path options and attributes
            var pathOptions = {
                color: '#454a646c',
                weight: v.scaledTotal,
                pathID: v.collab_id,
                country1: v.country1,
                country2: v.country2,
                dataSeries: dataSeriesValues,
                pointStart: Math.min(...yearsArray),
                Total: v.Total
            }

            // setting the animation for the paths
            if (typeof document.getElementById('Map2').animate === "function") {
                var durationBase = 9000;
                pathOptions.animate = {
                    duration: durationBase,
                    easing: 'ease-in-out',
                    direction: 'alternate'
                }
            }

            // creating a new curve object
            var curvedPath = L.curve(
                [
                    'M', [v.country1_lat, v.country1_lon],
                    'Q', [v.midpoint_lat, v.midpoint_lon],
                    [v.country2_lat, v.country2_lon]
                ], pathOptions).bindTooltip("<b>" + v.country1 + "----" + v.country2 + "</b><br>" + "Collaboration Times: " + v.Total, { className: 'Tooltip' });;

            // setting a mouseover event
            curvedPath.on('mouseover', function (e) {
                // bring the path to the front
                this.bringToFront();

                // change the opacity of all of the paths in the edges array to 0.1 (almost transparent)
                edges.eachLayer(function (layer) {
                    layer.setStyle({
                        color: '#454a6465'
                    });

                });

                // change the opacity of this specific path to 1 (totally opaque)
                this.setStyle({
                    color: '#a5540780'
                });

                // storing the path id for easy access
                var thisPath = this['options']['pathID'];

                // creating a popup which is located on the mouseover event latlng location
                // the popup centent is the names of the countries in each pair
                // var popup = L.popup()
                //     .setLatLng(e.latlng)
                //     .setContent('<p class="popuplink" onclick="fillChart({2})">{0}-{1}</p>'.replace('{0}', this['options']['country1']).replace('{1}', this['options']['country2']).replace('{2}', thisPath))
                //     .openOn(map2);
            });

            // setting a click event
            // calling the fill chart function to populate the chart
            curvedPath.on('click', function () {
                fillChart(this['options']['pathID']);
            })

            // setting a mouseout event to reset the opacity of the edges in the edges array
            curvedPath.on('mouseout', function () {
                edges.eachLayer(function (layer) {
                    layer.setStyle({
                        color: '#454a646c'
                    });

                });
            });

            // Pushing the newly created path to the edge array
            edgeArray.push(curvedPath);
            edges.addLayer(curvedPath)
        });

        // Creating a layergroup based on the edge array and add it to the map

    });
};









