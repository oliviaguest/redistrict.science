---
# You don't need to edit this file, it's empty on purpose.
# Edit theme's home layout instead if you wanna make some changes
# See: https://jekyllrb.com/docs/themes/#overriding-theme-defaults
layout: default
---
<div id="mapid"></div>
<script>


// same geoJSON as before
var RI = 'http://127.0.0.1:4000/geojson_results/RI_0.geojson'



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
var polyline = L.polyline(latlngs, {color: 'red'}).addTo(mymap);
// mymap.fitBounds(polyline.getBounds());

L.featureGroup([mymarker, polyline])
    .bindPopup('Hello world!')
    .on('click', function() { alert('Clicked on a member of the group!'); })
    .addTo(mymap);


fetch(
  RI
).then(
  res => res.json()
).then(
  data => L.geoJSON(data).addTo(mymap)
)

</script>
