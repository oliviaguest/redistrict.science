var map = L.map("map", {
    center: [37.8, -96],
    zoom: 3.4,
    minZoom: 3,
    maxZoom: 16,
    zoomControl: false
})

var map1 = L.map('map1', {
    center: [37.8, -96],
    zoom: 3.4,
    minZoom: 3,
    maxZoom: 16,
    zoomControl: false

});
var options = {
    attribution: '',
    // pane: 'bottom'

};

// https://github.com/mapzen/leaflet-geocoder
L.control.geocoder('mapzen-cykEQVu', options).addTo(map);
L.control.geocoder('mapzen-cykEQVu', options).addTo(map1);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: '',
    id: 'mapbox.light',
    accessToken: 'pk.eyJ1Ijoib2xpdmlhZ3Vlc3QiLCJhIjoiY2oycnhmbmhrMDAxeDJ6cjRlejNlcnc3ayJ9.HF6u5SpQSIrNhuQzdinNsQ'
}).addTo(map);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    id: 'mapbox.light',
    attribution: '',
    accessToken: 'pk.eyJ1Ijoib2xpdmlhZ3Vlc3QiLCJhIjoiY2oycnhmbmhrMDAxeDJ6cjRlejNlcnc3ayJ9.HF6u5SpQSIrNhuQzdinNsQ'
}).addTo(map1);

var scale = chroma.scale('PuBUGn')//['lightblue', 'darkgreen', 'black'])
.domain([...Array(53).keys()]);


// Set the colour for the style of the GeoJSON for each congressional district:
function getColor(d) {
  // f = chroma.scale(['violet', '#501935', 'pink', 'purple', 'lightblue', '#430019', '#d8ffff', 'darkblue', 'hotpink']).mode('lch').domain([0, 78]);
  // f = chroma.scale(['lightblue', 'darkgreen']).mode('lch').domain([0, 55]);
  f = chroma.random();
  return f;
  // return scale(parseInt(d.charAt(2) + d.charAt(3)));
}
// Set the style for each congressional district:
function cong_dist_style(feature) {
    return {
        fillColor: getColor(feature.properties.GEOID),
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.5
    };
}
// Set the style for each cluster:
function cluster_style(feature) {
    return {
        fillColor: 'black',
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '5',
        fillOpacity: 0.5
    };
}
// What style change occurs when hovering:
function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 2,
        color: 'black'
        // dashArray: '0',
        // fillOpacity: 0.1
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}
// How to reset the style after hovering:
function resetHighlight(e) {
    // geojson.resetStyle(e.target);
    var layer = e.target;
    layer.setStyle({
        // weight: 1,
        // opacity: 0.8,
        color: 'white'
        // dashArray: '5',
        // fillOpacity: 0.5
    });
}
// What to do if mouse is clicked:
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
// Add the congressional districts to map:
// map.createPane('middle');
var cong_dist_layer = L.geoJson(null, {
    style: cong_dist_style,
    // onEachFeature: onEachFeature,
    // pane: 'middle'
});
omnivore.topojson('/json/topo/USA.topo.json', null, cong_dist_layer).addTo(map);
// Add the clusters to map1:
// map1.createPane('middle1');
var cluster_layer = L.geoJson(null, {
    style: cluster_style,
    // onEachFeature: onEachFeature,
    // pane: 'middle1'
});
fetch(
    '/json/states_hash.json'
).then(
    function(res) {
        res.json().then(function(dict) {
            console.log(dict);
            for (key in dict) {
                console.log('hello', dict[key], key);
                var value = dict[key];
                try {
                    omnivore.topojson('/json/topo/' + key + '.topo.json', null, cluster_layer).addTo(map1);
                } catch (err) {
                    console.log('');
                }
            }
        });
    }
)
// Add the state outlines to map and map1:
map.createPane('top');
map1.createPane('top');
function state_style(feature) {
    return {
        fillColor: 'white',
        weight: 1.5,
        opacity: 1,
        color: 'white',
        dashArray: '0',
        fillOpacity: 0
    };
}
var outline_layer = L.geoJson(null, {
    style: state_style,
    pane: 'top',
    onEachFeature: onEachFeature,

});
var outline_layer1 = L.geoJson(null, {
    style: state_style,
    pane: 'top',
    onEachFeature: onEachFeature,

});
omnivore.topojson('/json/topo/state_outlines.topo.json', null, outline_layer).addTo(map);
omnivore.topojson('/json/topo/state_outlines.topo.json', null, outline_layer1).addTo(map1);
// now pane order controls layer ordering not the control!
// L.control.layers({
//     'OSM': L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
// }, {
//     'bottom': L.geoJson(geojson, {pane: 'bottom'}),
//     'middle': L.geoJson(geojson, {pane: 'middle'}),
//     'top':  L.geoJson(geojson, {pane: 'top'}),,
// }, {
//     collapsed: false
// }).addTo(map);
// reset zoom from https://github.com/alanshaw/leaflet-zoom-min/
map.addControl(new L.Control.ZoomMin())
map1.addControl(new L.Control.ZoomMin())
// Synchronise two maps;
// https://github.com/jieter/Leaflet.Synchttps://github.com/jieter/Leaflet.Sync
map.sync(map1);
map1.sync(map);
