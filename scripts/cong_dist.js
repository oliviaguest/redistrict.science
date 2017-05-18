/* Snippet below from:
https://gist.github.com/brendanvinson/0e3c3c86d96863f1c33f55454705bca7
The MIT License (MIT)
Copyright (c) 2016 Brendan Vinson
*/
L.TopoJSON = L.GeoJSON.extend({
    addData: function(data) {
        var geojson, key;
        if (data.type === "Topology") {
            for (key in data.objects) {
                if (data.objects.hasOwnProperty(key)) {
                    geojson = topojson.feature(data, data.objects[key]);
                    L.GeoJSON.prototype.addData.call(this, geojson);
                }
            }

            return this;
        }

        L.GeoJSON.prototype.addData.call(this, data);

        return this;
    }
});

L.topoJson = function(data, options) {
    return new L.TopoJSON(data, options);
};

// same geoJSON as before
// var RI = 'http://127.0.0.1:4000/geojson/RI.geojson'

// var mymap = L.map('mapid').setView([41.76517, -431.62545], 13);
var mymap = L.map('mapid').setView([37.8, -96], 4);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    // id: 'mapbox.streets',
    id: 'mapbox.light',
    accessToken: 'pk.eyJ1Ijoib2xpdmlhZ3Vlc3QiLCJhIjoiY2oycnhmbmhrMDAxeDJ6cjRlejNlcnc3ayJ9.HF6u5SpQSIrNhuQzdinNsQ'
}).addTo(mymap);

var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}

mymap.on('click', onMapClick);

mymarker = L.marker([41.56614, -71.67489]);
mymarker.addTo(mymap);

var latlngs = [
    [41.91863, -71.67214],
    [41.50652, -71.48538],
    [41.4592, -71.65017]
];
var polyline = L.polyline(latlngs, {
    color: 'red'
}).addTo(mymap);
// mymap.fitBounds(polyline.getBounds());

L.featureGroup([mymarker, polyline])
    .bindPopup('Hello world!')
    .on('click', function() {
        alert('Clicked on a member of the group!');
    })
    .addTo(mymap);

var topoLayer = new L.TopoJSON();

$.getJSON('http://127.0.0.1:4000/topojson/USA.topojson')
    .done(addTopoData);

function addTopoData(topoData) {
    topoLayer.addData(topoData);
    topoLayer.addTo(mymap);
}

// var USA = 'http://127.0.0.1:4000/topojson/USA.topojson'
// fetch(
//     USA
// ).then(
//     res => res.json()
// ).then(
//   // data => L.geoJSON(data).addTo(mymap)
//   data => addTopoData(data)
// )
