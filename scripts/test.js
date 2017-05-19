
//d3 code stolen from http://bost.ocks.org/mike/leaflet/#init
var geoJsonObject;


map = new L.Map('mapcanvas');
var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
var osm = new L.TileLayer(osmUrl, {attribution: osmAttrib});
map.setView(new L.LatLng(36.788283, -119.805891),6);
map.addLayer(osm);
var svg = d3.select(map.getPanes().overlayPane).append("svg"),
g = svg.append("g").attr("class", "leaflet-zoom-hide");
d3.json("http://127.0.0.1:4000/json/topo/USA.topo.json", function(collection) {
  collection = topojson.feature(collection, collection.objects.township)
  var transform = d3.geo.transform({point: projectPoint}),
  path = d3.geo.path().projection(transform);
  var feature = g.selectAll("path")
  .data(collection.features)
  .enter().append("path");
//d3 code stolen from http://bost.ocks.org/mike/leaflet/#init
  map.on("viewreset", reset);
  reset();
  function reset() {
    var bounds = path.bounds(collection),
    topLeft = bounds[0],
    bottomRight = bounds[1];
    svg .attr("width", bottomRight[0] - topLeft[0])
    .attr("height", bottomRight[1] - topLeft[1])
    .style("left", topLeft[0] + "px")
    .style("top", topLeft[1] + "px");
    g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
    feature.attr("d", path);
  }
  function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
  }
});
