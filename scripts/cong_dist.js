/* Snippet below from:
https://gist.github.com/brendanvinson/0e3c3c86d96863f1c33f55454705bca7
The MIT License (MIT)
Copyright (c) 2016 Brendan Vinson
*/
// L.TopoJSON = L.GeoJSON.extend({
//     addData: function(data) {
//         var geojson, key;
//         if (data.type === "Topology") {
//             for (key in data.objects) {
//                 if (data.objects.hasOwnProperty(key)) {
//                     geojson = topojson.feature(data, data.objects[key]);
//                     L.GeoJSON.prototype.addData.call(this, geojson);
//                 }
//             }
//
//             return this;
//         }
//
//         L.GeoJSON.prototype.addData.call(this, data);
//
//         return this;
//     }
// });
//
// L.topoJson = function(data, options) {
//     return new L.TopoJSON(data, options);
// };

/* end snippet */


// same geoJSON as before
// var RI = 'http://127.0.0.1:4000/geojson/RI.geojson'

// var mymap = L.map('mapid').setView([41.76517, -431.62545], 13);
var mymap = L.map('mapid').setView([37.8, -96], 4);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    // id: 'mapbox.light',
    accessToken: 'pk.eyJ1Ijoib2xpdmlhZ3Vlc3QiLCJhIjoiY2oycnhmbmhrMDAxeDJ6cjRlejNlcnc3ayJ9.HF6u5SpQSIrNhuQzdinNsQ'
}).addTo(mymap);


// Omnivore will AJAX-request this file behind the scenes and parse it:
// note that there are considerations:
// - The file must either be on the same domain as the page that requests it,
//   or both the server it is requested from and the user's browser must
//   support CORS.

// Internally this function uses the TopoJSON library to decode the given file
// into GeoJSON.
// var topoLayer = omnivore.topojson('http://127.0.0.1:4000/json/topo/USA.min.topo.json');
// topoLayer.addTo(mymap);



// This creates a popup which tells the user te lat/lon where they have clicked
var popup = L.popup();
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}
mymap.on('click', onMapClick);

// This creates a marker on the map (in RI)
// mymarker = L.marker([41.56614, -71.67489]);
// mymarker.addTo(mymap);

// This creates a polyline on RI atm
// var latlngs = [
//     [41.91863, -71.67214],
//     [41.50652, -71.48538],
//     [41.4592, -71.65017]
// ];
// var polyline = L.polyline(latlngs, {
//     color: 'red'
// }).addTo(mymap);
// This makes the map zoom to the polyline:
// mymap.fitBounds(polyline.getBounds());

/*
var topoLayer = new L.TopoJSON();
$.getJSON('http://127.0.0.1:4000/json/topo/USA.topo.json')
    .done(addTopoData);
function addTopoData(topoData) {
    topoLayer.addData(topoData);
    topoLayer.addTo(mymap);
}*/




// Add GeoJSON to map:
// var usa = 'http://127.0.0.1:4000/json/geo/USA.geo.json';
// Set the colour for the style of the GeoJSON
function getColor(d) {
    // window.alert(parseInt(d.charAt(2)+d.charAt(3))/10);
    var c = chroma('pink').darken().saturate(2).hex();// chroma.scale(0.0);
    return c;
    //chroma.scale(parseInt(d.charAt(2)+d.charAt(3))/10);
    // return d.charAt(3) == '1' ? chroma('pink').darken().saturate(2).hex() :
    //        d.charAt(3) == '2' ? '#FF0000' :
    //        d.charAt(3) == '3' ? '#00FF00' :
    //        d.charAt(3) == '4' ? '#0000FF' :
    //                   '#FFF';
}
// Set the style of the GeoJSON
function style(feature) {
    return {
        fillColor: getColor(feature.properties.GEOID),
        weight: 1,
        opacity: 1,
        color: 'white',
        // dashArray: '3',
        fillOpacity: 0.5
    };
}
// // Get the data from the GeoJSON
// fetch(
//   usa
// ).then(
//   res => res.json()
// ).then(
//   data => L.geoJSON(data, {style: style}).addTo(mymap)
// )
// End add GeoJSON to map
var customLayer = L.geoJson(null, {style: style});
omnivore.topojson('http://127.0.0.1:4000/json/topo/USA.min.topo.json', null, customLayer).addTo(mymap);
