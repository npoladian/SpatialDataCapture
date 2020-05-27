$(document).ready(function () {
    var Countries = [
        'United States', 'France', 'Germany', 'United Kingdom', 'Spain', 'Italy', 'Russia', 'Japan', 'Switzerland', 'Netherlands',
        'Argentina', 'Belgium', 'Mexico', 'Austria', 'Canada', 'Brazil', 'Hungary', 'Colombia', 'Czech Republic', 'Chile'
    ];

    var Series = [];
    $.getJSON("http://dev.spatialdatacapture.org:8709/Assessment/Country/All/All", function (data) {
        var temp1 = [];
        $.each(data, function (i, v) {

            if ($.inArray(v.CountryName, Countries) != -1) { temp1.push(v); console.log(v.CountryName) };
        });
        var temp2 = [];
        $.each(temp1, function (i, v) {
            if (temp1[i + 1] != undefined && temp1[i + 1].CountryName == temp1[i].CountryName) { temp2.push(v.Quantity); }
            else { temp2.push(v.Quantity); Series.push({ name: v.CountryName, data: temp2 }); temp2 = []; };
        });
        Highcharts.chart({

            chart: {
                renderTo: 'Stream',
                type: 'streamgraph',
                marginBottom: 30,
                zoomType: 'x',
                backgroundColor: "transparent",
                style: {
                    fontFamily: "Abhaya Libre",
                }
            },

            colors: [
                "#99b4ce", "#a36a6f", "#bad792", "#dda575", "#9194d8", "#d8748c", "#dbc94c",
                "#6c9796", "#db7474", "#90d2cc", "#bad792", "#a36a6f", "#99b4ce", "#dda575",
                "#9194d8", "#d8748c", "#dbc94c", "#6c9796", "#db7474", "#90d2cc", "#99b4ce",
                "#a36a6f"
            ],

            title: {
                text: ""//'Museum of Modern Art Collection: The Quantity of Art',
            },

            subtitle: {
                // text: 'Source: <a href="https://github.com/MuseumofModernArt/collection"> Museum of Modern Art </a>',
            },

            xAxis: {
                maxPadding: 0,
                type: 'category',
                crosshair: false,
                categories: [
                    '1800s', '1810s', '1820s', '1830s', '1840s', '1850s', '1860s', '1870s', '1880s', '1890s', '1900s',
                    '1910s', '1920s', '1930s', '1940s', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s',
                ],

                labels: {
                    align: 'left',
                    reserveSpace: false,
                    rotation: 270,
                    style: {
                        color: '#f1ece4'
                    }
                },

                lineWidth: 0,
                margin: 20,
                tickWidth: 0
            },



            yAxis: {
                visible: false,
                startOnTick: false,
                endOnTick: false
            },


            legend: {
                enabled: false
            },

            plotOptions: {

                series: {

                    label: {
                        minFontSize: 5,
                        maxFontSize: 15,
                        style: {
                            color: '#f1ece4'
                        }
                    }
                }
            },
            exporting: { enabled: false },
            series: Series
        });
    });
});

