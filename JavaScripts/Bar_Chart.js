$(document).ready(function () {
    var Continent = [
        'South America', 'Australia', 'Africa', 'Asia',
        'Central America', 'Europe', 'North America'
    ];
    var options = {
        chart: {
            renderTo: 'Bar',
            type: 'column',
            backgroundColor: "transparent",
            style: {
                fontFamily: "Abhaya Libre",
            }
        },
        title: {
            text: ''
        },
        colors: ["#99b4ce","#a55407"],

        xAxis: {
            gridLineColor: 'transparent',
            lineColor: '#a55407',
            labels: {
                style: {
                    color: '#f1ece4'
                }
            },
            categories: Continent
        },
        yAxis: {
            gridLineColor: 'transparent',
            min: 0,
            title: {
                text: 'Total Number',
                style: {
                    color: '#f1ece4'
                }
            },
            labels: {
                style: {
                    color: '#f1ece4'
                }
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    textOutline: 'none',
                    color: '#f1ece4'
                }
            }
        },
        legend: {
            align: 'right',
            x: -30,
            verticalAlign: 'top',
            y: 0,
            floating: true,
            backgroundColor: 'transparent',
            itemStyle: {
                color: '#f1ece4'
            },
            itemHoverStyle: {
                color: '#a55407'
            },
            itemHiddenStyle: {
                color: '#a55407'
            },
            borderColor: '#f1ece4',
            borderWidth: 0,
            shadow: false
        },
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y} <br/>Total: {point.stackTotal}'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    style: {
                        color: '#f1ece4',
                        textOutline: 'none',
                        fontWeight: 'normal'
                    }
                }
            }
        },
        exporting: { enabled: false },
        series: []
    };

    var Gender = ["Male", "Female"];
    var Series = [];

    $.each(Gender, function (i0, v) {
        
        $.ajax({
            url: "http://dev.spatialdatacapture.org:8709/Assessment/Quantity/All/All/" + v, success: function (data) {
                temp = [0, 0, 0, 0, 0, 0, 0];
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < 7; j++) {
                        if (data[i].Continent == Continent[j]) { temp[j] += data[i].Quantity; };
                    };
                };
                Series.push({ name: v, data: temp })
                refresher.value = v;
            }
        })
    });

    options.series = Series;
    var refresher = { 'value': "" };
    Object.defineProperty(refresher, 'value', {
        get: function (value) {
            // get method
            return value;
        },
        set: function (newvalue) {
            // when the value is set, execute the following
            value = newvalue;
            if (newvalue == "Female") {
                Highcharts.chart(options);
            };
        }
    });

});
