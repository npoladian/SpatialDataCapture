// Setting bounds for the leaflet map
// Based on rob.m advice on stack overflow
// https://stackoverflow.com/questions/22155017/can-i-prevent-panning-leaflet-map-out-of-the-worlds-edge
var southWest = L.latLng(-89.98155760646617, -180),
    northEast = L.latLng(89.99346179538875, 180);
var bounds = L.latLngBounds(southWest, northEast);


// feature1
var map1 = L.map('Map1', {
	center: [45, 0],
	zoom: 1.5,
	scrollWheelZoom:true,
	zoomControl:false,
	maxBounds: bounds, 
	maxBoundsViscosity: 1.0,
	minZoom:2
});


L.tileLayer('https://api.mapbox.com/styles/v1/{username}/{id}/tiles/{tilesize}/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '&copy<a href="https://www.openstreetmap.org/">OpenStreetMap</a>  &copy<a href="https://www.mapbox.com/">Mapbox</a> &copy<a href="https://d3js.org/">D3</a>',
	maxZoom: 14,
	username: 'reeply',
	id: 'ck8nyguh6022j1iru356j2ufq',
    tilesize: 512,
	zoomOffset: 0,
    accessToken: 'pk.eyJ1IjoicmVlcGx5IiwiYSI6ImNpaGZtd29yZzBtNDh2ZmtsY3ozY3lkNjEifQ.Ab5WiJwK8sa0kQhOKhi78g'
}).addTo(map1);




// feature2
var map2 = L.map('Map2', {
	center: [45, 0],
	zoom: 1.5,
	scrollWheelZoom:true,
	zoomControl:false,
	maxBounds: bounds, 
	maxBoundsViscosity: 1.0,
	minZoom:2
});

L.tileLayer('https://api.mapbox.com/styles/v1/{username}/{id}/tiles/{tilesize}/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '&copy<a href="https://www.openstreetmap.org/">OpenStreetMap</a>  &copy<a href="https://www.mapbox.com/">Mapbox</a> &copy<a href="https://d3js.org/">D3</a>',
	maxZoom: 14,
	username: 'reeply',
	id: 'ck8nyguh6022j1iru356j2ufq',
    tilesize: 512,
	zoomOffset: 0,
    accessToken: 'pk.eyJ1IjoicmVlcGx5IiwiYSI6ImNpaGZtd29yZzBtNDh2ZmtsY3ozY3lkNjEifQ.Ab5WiJwK8sa0kQhOKhi78g'
}).addTo(map2);




// feature3
var map3 = L.map('Map3', {
	center: [45, 0],
	zoom: 1.5,
	scrollWheelZoom:false,
	zoomControl:false,
	maxBounds: bounds, 
	maxBoundsViscosity: 1.0,
	minZoom:2
});

L.tileLayer('https://api.mapbox.com/styles/v1/{username}/{id}/tiles/{tilesize}/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '&copy<a href="https://www.openstreetmap.org/">OpenStreetMap</a>  &copy<a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 14,
	username: 'reeply',
	id: 'ck8nyguh6022j1iru356j2ufq',
    tilesize: 512,
	zoomOffset: 0,
    accessToken: 'pk.eyJ1IjoicmVlcGx5IiwiYSI6ImNpaGZtd29yZzBtNDh2ZmtsY3ozY3lkNjEifQ.Ab5WiJwK8sa0kQhOKhi78g'
}).addTo(map3);






