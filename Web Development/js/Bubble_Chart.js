$(document).ready(function () {
    var options = {
        chart: {
            renderTo: 'Bubble',
            type: 'packedbubble',
            height: '40%',
            backgroundColor: "transparent",
            style: {
                fontFamily: "Abhaya Libre",
            }
        },
        colors: [
            "#99b4ce", "#a36a6f", "#bad792", "#dda575", "#9194d8", "#d8748c", "#dbc94c",
            "#6c9796", "#db7474", "#90d2cc"
        ],
        title: {
            text: ''
        },
        tooltip: {
            useHTML: true,
            pointFormat: '<b>{point.name}:</b> {point.value} Pieces'
        },
        legend: {
            backgroundColor: 'transparent',
            itemStyle: {
                color: '#f1ece4'
            },
            itemHoverStyle: {
                color: '#a55407'
            },
            itemHiddenStyle: {
                color: '#a55407'
            }
        },
        exporting: { enabled: false },
        plotOptions: {

            packedbubble: {
                minSize: '5%',
                maxSize: '200%',
                zMin: 0,
                zMax: 1000,
                layoutAlgorithm: {
                    gravitationalConstant: 0.05,
                    splitSeries: true,
                    seriesInteraction: false,
                    dragBetweenSeries: true,
                    parentNodeLimit: true
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.name}',
                    filter: {
                        property: 'y',
                        operator: '>',
                        value: 250
                    },
                    style: {
                        color: '#454a64',
                        textOutline: 'none',
                        fontWeight: 'normal'
                    }
                }
            }
        },
        series: [],
    };
    var Classification = [
        'Video', 'Sculpture', 'Print', 'Photograph', 'Painting', 'Architecture',
        'Mies van der Rohe Archive', 'Illustrated Book', 'Drawing', 'Design',
    ];

    var Series = [];

    $.each(Classification, function (i, v) {
        var temp = [];


        // Something about asynchronous somthing, make it wait until finished downloading 
        $.ajax({
            url: "http://dev.spatialdatacapture.org:8709/Assessment/Quantity/All/" + v + "/" + "Female", success: function (data) {

                for (var j = 0; j < 10; j++) {
                    if (data[j] != undefined) {
                        temp.push({ name: data[j].CountryName, value: data[j].Quantity });
                    }
                    else {
                        break;
                    };
                };
                refresher.value = v;
            }
        });

        Series.push({ name: v, data: temp });

    });
    options.series = Series;

    // Dear! What a miraculous object!
    var refresher = { 'value': "" };
    Object.defineProperty(refresher, 'value', {
        get: function (value) {
            // get method
            return value;
        },
        set: function (newvalue) {
            // when the value is set, execute the following
            value = newvalue;
            if (newvalue == "Design") {
                Highcharts.chart(options);
            };
        }
    });
});
