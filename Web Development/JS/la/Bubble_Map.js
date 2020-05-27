// Add a scale for bubble size
var colorsize = d3.scaleLinear()
    .domain([1, 500])  // What's in the data
    .range([4, 12]);  // Size in pixel

var text1size = d3.scaleLinear()
    .domain([1, 500])  // What's in the data
    .range([13, 17]);  // Size in pixel

var text2size = d3.scaleLinear()
    .domain([1, 500])  // What's in the data
    .range([10, 12]);  // Size in pixel


// Mapping function
var Bubble_Mapping = function (Year,Gender) {
    
    d3.json("http://dev.spatialdatacapture.org:8709/Assessment/Quantity/" + Year + "/All/" + Gender, function (data) {

        // Remove the svg after renew
        d3.select("#Map1").select("svg").remove();

        // Add a svg layer to the map 
        L.svg().addTo(map1);

        // Select the svg area and add circles:
        d3.select("#Map1")
            .select("svg")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return map1.latLngToLayerPoint([d.CapitalLat, d.CapitalLon]).x })
            .attr("cy", function (d) { return map1.latLngToLayerPoint([d.CapitalLat, d.CapitalLon]).y })
            .attr("r", function (d) { return colorsize(d.Quantity) })
            .style("fill", "#454a64")
            .attr("stroke", "#454a64")
            .attr("stroke-width", 1)
            .attr("fill-opacity", .4);

        L.svg().addTo(map1);
        d3.select("#Map1")
            .select("svg")
            .selectAll()
            .data(data)
            .enter()
            .append("text")
            .attr("class", "text1")
            .attr("x", function (d) { return map1.latLngToLayerPoint([d.CapitalLat, d.CapitalLon]).x })
            .attr("y", function (d) { return map1.latLngToLayerPoint([d.CapitalLat, d.CapitalLon]).y })
            .text(function (d) { return d.Quantity; })
            .style("font-family", "Abhaya Libre")
            .style("font-size", function (d) { return text1size(d.Quantity) })
            .attr("text-anchor", "middle")
            .style("text-shadow", "0.4px 0.4px #f1ece4")
            .attr("fill", "#a55407");

        L.svg().addTo(map1);
        d3.select("#Map1")
            .select("svg")
            .selectAll()
            .data(data)
            .enter()
            .append("text")
            .attr("class", "text2")
            .attr("x", function (d) { return map1.latLngToLayerPoint([d.CapitalLat, d.CapitalLon]).x })
            .attr("y", function (d) { return map1.latLngToLayerPoint([d.CapitalLat, d.CapitalLon]).y + text2size(d.Quantity) })
            .text(function (d) { return d.CountryName; })
            .style("font-family", "Abhaya Libre")
            .style("font-size", function (d) { return text2size(d.Quantity) })
            .attr("text-anchor", "middle")
            .style("text-shadow", "0.4px 0.4px #f1ece4")
            .attr("fill", "#a55407");


        // Function that update circle position if something change
        function update() {
            d3.select("#Map1").selectAll("circle")
                .attr("cx", function (d) { return map1.latLngToLayerPoint([d.CapitalLat, d.CapitalLon]).x })
                .attr("cy", function (d) { return map1.latLngToLayerPoint([d.CapitalLat, d.CapitalLon]).y });


            d3.select("#Map1").selectAll("text.text1")
                .attr("x", function (d) { return map1.latLngToLayerPoint([d.CapitalLat, d.CapitalLon]).x })
                .attr("y", function (d) { return map1.latLngToLayerPoint([d.CapitalLat, d.CapitalLon]).y });

            d3.select("#Map1").selectAll("text.text2")
                .attr("x", function (d) { return map1.latLngToLayerPoint([d.CapitalLat, d.CapitalLon]).x })
                .attr("y", function (d) { return map1.latLngToLayerPoint([d.CapitalLat, d.CapitalLon]).y + text2size(d.Quantity) });


            // d3.selectAll("circle").transition().duration(2000).attr("r",14);
        };

        // If the user change the map (zoom or drag), I update circle position:
        map1.on("moveend", update);

    });
    
}


Bubble_Mapping(2000,"All");

// Listener to slider
var Year = 2000;
var Gender = "All";

$(document).ready(function () {
    $('#slider')[0]
        .addEventListener('input', function (Y) {

            Year = parseInt(Y.target.value);
            // Change the time labe 
            $("#time").text(Year + "s");

            Bubble_Mapping(Year, Gender);
        });
});




//Listener to Gender
var GenderList = [["#A","All"], ["#M","Male"], ["#F","Female"]];
$(document).ready(function () {
    $.each(GenderList, function (i1, v1) {

        $(v1[0])[0].addEventListener("click", function () {
            //The selected
            $(v1[0]).css({ "background": "linear-gradient(to right, #454a64 30%, #454a6400)", "text-shadow": "1.5px 1.5px #a55407" });

            Bubble_Mapping(Year, v1[1]);

            // the rest
            $.each($.grep(GenderList, function (temp) {
                return temp != v1;
            }), function (i2, v2) {
                $(v2[0]).css({ "background": "linear-gradient(to right, #a55407 30%, #454a6400)", "text-shadow": "1.5px 1.5px #454a64" });
            });

        });
    });
});



