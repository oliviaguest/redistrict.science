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

// var map = L.map('mapid').setView([41.76517, -431.62545], 13);
var map = L.map('mapid').setView([37.8, -96], 4);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    // id: 'mapbox.streets',
    id: 'mapbox.light',
    accessToken: 'pk.eyJ1Ijoib2xpdmlhZ3Vlc3QiLCJhIjoiY2oycnhmbmhrMDAxeDJ6cjRlejNlcnc3ayJ9.HF6u5SpQSIrNhuQzdinNsQ'
}).addTo(map);


// Omnivore will AJAX-request this file behind the scenes and parse it:
// note that there are considerations:
// - The file must either be on the same domain as the page that requests it,
//   or both the server it is requested from and the user's browser must
//   support CORS.

// Internally this function uses the TopoJSON library to decode the given file
// into GeoJSON.
// var topoLayer = omnivore.topojson('http://127.0.0.1:4000/json/topo/USA.min.topo.json');
// topoLayer.addTo(map);



// This creates a popup which tells the user te lat/lon where they have clicked
// var popup = L.popup();
// function onMapClick(e) {
//     popup
//         .setLatLng(e.latlng)
//         .setContent("You clicked the map at " + e.latlng.toString())
//         .openOn(map);
// }
// map.on('click', onMapClick);

// This creates a marker on the map (in RI)
// mymarker = L.marker([41.56614, -71.67489]);
// mymarker.addTo(map);

// This creates a polyline on RI atm
// var latlngs = [
//     [41.91863, -71.67214],
//     [41.50652, -71.48538],
//     [41.4592, -71.65017]
// ];
// var polyline = L.polyline(latlngs, {
//     color: 'red'
// }).addTo(map);
// This makes the map zoom to the polyline:
// map.fitBounds(polyline.getBounds());

/*
var topoLayer = new L.TopoJSON();
$.getJSON('http://127.0.0.1:4000/json/topo/USA.topo.json')
    .done(addTopoData);
function addTopoData(topoData) {
    topoLayer.addData(topoData);
    topoLayer.addTo(map);
}*/




// Add GeoJSON to map:
// var usa = 'http://127.0.0.1:4000/json/geo/USA.geo.json';
// Set the colour for the style of the GeoJSON
function getColor(d) {
    // var r = Math.random();
    // window.alert(parseInt(d.charAt(2)+d.charAt(3))/10);
    // console.log('hello', r, d);
    // f = chroma.scale('OrRd').domain([0,49]);
    f = chroma.scale(['violet', '#501935', 'pink', 'purple', 'lightblue', '#430019', '#d8ffff', 'skyblue', 'hotpink']).mode('lch').domain([0,78]);

    return f(parseInt(d.charAt(0)+d.charAt(1)));
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
        opacity: 0.8,
        color: 'white',
        // dashArray: '3',
        fillOpacity: 0.5
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 2,
        color: '#000',
        dashArray: '',
        fillOpacity: 0.9
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
    // geojson.resetStyle(e.target);
    var layer = e.target;

    layer.setStyle({
      weight: 1,
      opacity: 0.8,
      color: 'white',
      // dashArray: '3',
      fillOpacity: 0.5
    });
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

var cong_dist_layer = L.geoJson(null, {style: style, onEachFeature: onEachFeature});
omnivore.topojson('/json/topo/USA_2.min.topo.json', null, cong_dist_layer).addTo(map);

// geocoder from https://github.com/perliedman/leaflet-control-geocoder

L.Control.geocoder().addTo(map);
