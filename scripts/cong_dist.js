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

};
// https://github.com/mapzen/leaflet-geocoder
L.control.geocoder('mapzen-cykEQVu', options).addTo(map);
L.control.geocoder('mapzen-cykEQVu', options).addTo(map1);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: '',// 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    // maxZoom: 18,
    // id: 'mapbox.streets',
    id: 'mapbox.light',
    accessToken: 'pk.eyJ1Ijoib2xpdmlhZ3Vlc3QiLCJhIjoiY2oycnhmbmhrMDAxeDJ6cjRlejNlcnc3ayJ9.HF6u5SpQSIrNhuQzdinNsQ'

}).addTo(map);


// Set the colour for the style of the GeoJSON
function getColor(d) {
    // var r = Math.random();
    // f = chroma.scale('OrRd').domain([0,49]);
    f = chroma.scale(['violet', '#501935', 'pink', 'purple', 'lightblue', '#430019', '#d8ffff', 'darkblue', 'hotpink']).mode('lch').domain([0,78]);
    console.log('hello', d.charAt(0)+d.charAt(1), f(parseInt(d.charAt(0)+d.charAt(1))));

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
        weight: 1.5,
        color: '#000',
        dashArray: '',
        fillOpacity: 0.1
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
omnivore.topojson('/json/topo/USA_3.min.topo.json', null, cong_dist_layer).addTo(map);


var cluster_layer = L.geoJson(null, {onEachFeature: onEachFeature});
omnivore.topojson('/json/topo/KS.min.topo.json', null, cluster_layer).addTo(map1);


// geocoder from https://github.com/perliedman/leaflet-control-geocoder
// L.Control.geocoder().addTo(map);

// reset zoom from https://github.com/alanshaw/leaflet-zoom-min/
map.addControl(new L.Control.ZoomMin())
map1.addControl(new L.Control.ZoomMin())

// Synchronise two maps;
// https://github.com/jieter/Leaflet.Synchttps://github.com/jieter/Leaflet.Sync


// var map2 = L.map('map2', {
//     // layers: [layer2],
//     center: [59.336, 5.967],
//     zoom: 14,
//     zoomControl: false
// });
// var layer1 = L.tileLayer('http://opencache.statkart.no/gatekeeper/gk/...');
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    // maxZoom: 18,
    // id: 'mapbox.streets',
    id: 'mapbox.light',
    attribution: '',
    accessToken: 'pk.eyJ1Ijoib2xpdmlhZ3Vlc3QiLCJhIjoiY2oycnhmbmhrMDAxeDJ6cjRlejNlcnc3ayJ9.HF6u5SpQSIrNhuQzdinNsQ'

}).addTo(map1);

// geocoder from https://github.com/perliedman/leaflet-control-geocoder
// L.Control.geocoder().addTo(map1);

// reset zoom from https://github.com/alanshaw/leaflet-zoom-min/
//
// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
//     // maxZoom: 18,
//     // id: 'mapbox.streets',
//     id: 'mapbox.light',
//     attribution: '',
//
//     accessToken: 'pk.eyJ1Ijoib2xpdmlhZ3Vlc3QiLCJhIjoiY2oycnhmbmhrMDAxeDJ6cjRlejNlcnc3ayJ9.HF6u5SpQSIrNhuQzdinNsQ'
//
// }).addTo(map2);

// var layer2 = L.tileLayer('http://opencache.statkart.no/gatekeeper/gk/...', {
    // attribution: '© Kartverket'
// });



map.sync(map1);
// map.sync(map2);
map1.sync(map);
// map1.sync(map2);
// map2.sync(map);
// map2.sync(map1);
