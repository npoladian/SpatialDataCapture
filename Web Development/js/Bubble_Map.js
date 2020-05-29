// Add a scale for bubble size
var colorsize = d3.scaleLinear()
    .domain([1, 10000])  // What's in the data
    .range([100000, 3000000]);  // Size in pixel

var text1size = d3.scaleLinear()
    .domain([1, 500])  // What's in the data
    .range([13, 16]);  // Size in pixel

var text2size = d3.scaleLinear()
    .domain([1, 500])  // What's in the data
    .range([10, 12]);  // Size in pixel

var Circles = new L.layerGroup().addTo(map1);
var circling = function(CapitalLat,CapitalLon,Quantity,CountryName){
    var Circle = L.circle([CapitalLat, CapitalLon], {
        color: '#454a64',
        weight: 1,
        fillColor: '#454a64',
        fillOpacity: 0.5,
        radius: colorsize(Quantity)
    }).bindTooltip("<b>" + CountryName + "</b>", { className: 'Tooltip' });

    Circles.addLayer(Circle);

    
};


// Mapping function
var Bubble_Mapping = function (Year, Gender) {

    d3.json("http://dev.spatialdatacapture.org:8709/Assessment/Quantity/" + Year + "/All/" + Gender, function (data) {

        Circles.clearLayers()
        $.each(data, function (i, v) {
            circling(
                v.CapitalLat,
                v.CapitalLon,
                v.Quantity,
                v.CountryName)
                
        });


        d3.select("#Map1").selectAll("text.text1").remove();
        d3.select("#Map1")
            .select("svg")
            .selectAll()
            .data(data)
            .enter()
            .append("text")
            .attr("class", "text1")
            .attr("x", function (d) { return map1.latLngToLayerPoint([d.CapitalLat, d.CapitalLon]).x })
            .attr("y", function (d) { return map1.latLngToLayerPoint([d.CapitalLat, d.CapitalLon]).y + 0.15 *text1size(d.Quantity)})
            .text(function (d) { return d.Quantity; })
            .style("font-family", "Abhaya Libre")
            .attr("font-size", function (d) { return text1size(d.Quantity)  })
            .attr("text-anchor", "middle")
            .style("text-shadow", "1.5px 1.5px #454a64")
            .attr("fill", "#f1ece4");


        // Function that update circle position if something change
        function update() {
            d3.select("#Map1").selectAll("text.text1")
                .attr("x", function (d) { return map1.latLngToLayerPoint([d.CapitalLat, d.CapitalLon]).x })
                .attr("y", function (d) { return map1.latLngToLayerPoint([d.CapitalLat, d.CapitalLon]).y + 0.15 *text1size(d.Quantity) });
            // d3.selectAll("circle").transition().duration(2000).attr("r",14);
        };

        // If the user change the map (zoom or drag), I update circle position:
        map1.on("moveend", update);

    });

}


Bubble_Mapping(2000, "All");

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
var GenderList = [["#A", "All"], ["#M", "Male"], ["#F", "Female"]];
$(document).ready(function () {
    $.each(GenderList, function (i1, v1) {

        $(v1[0])[0].addEventListener("click", function () {
            //The selected
            Gender = v1[1];
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



