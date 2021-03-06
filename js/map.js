var map;
var bounds;
var markers = [];
var busPolyLine;
var stopSequence;
var direction = 1;
var infowindow;
var base_url = window.location.origin;

var markerIcons = {
  'green':'/markers/marker_rounded_green.png',
  'red':'/markers/marker_rounded_red.png',
  'blue':'/markers/marker_rounded_blue.png'
};

function initialize() {        
  var transitLayer = new google.maps.TransitLayer();
  infowindow = new google.maps.InfoWindow();
  bounds = new google.maps.LatLngBounds();

  var mapOptions = {
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  transitLayer.setMap(map);

  $(window).resize(function () {
    var h = $(window).height(),
        offsetTop = 60; // Calculate the top offset

      $('#map_canvas').css('height', (h - offsetTop));
  }).resize();

  zeroMap();
}

function zeroMap(){
  var topLeft = new google.maps.LatLng(51.587683, -0.287018);
  var bottomRight = new google.maps.LatLng(51.439831, 0.098877);

  bounds.extend(topLeft);  
  bounds.extend(bottomRight);

  map.fitBounds(bounds);
}

function placeMarkers(data){
  stopSequence = data['_runs'][direction];
  
  var polyRoute = [];    

  clearRoute();

  for (var i = 0; i < stopSequence.length; i++) {

    var stopData = stopSequence[i];

    var title = stopData['_name'];
    var lat = stopData['_latitude'];
    var lon = stopData['_longitude'];

    polyRoute.push(new google.maps.LatLng(lat,lon));

    if (i === 0) {
      buildMarker(title, lat, lon, markerIcons.green);
    } else if (i === stopSequence.length - 1) {
      buildMarker(title, lat, lon, markerIcons.red);
    } else {
      buildMarker(title, lat, lon, markerIcons.blue);
    }
  }

  buildPolyline(polyRoute);

  map.fitBounds(bounds);
}

function resizeMap(){
  $('#mapcontainer').stop().animate({
    scrollTop: $("#mapcontainer")[0].scrollHeight
  }, 800);
}

function buildMarker(title, lat, lon, icon) {

  var marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat,lon),
      map: map,
      title: title,
      icon: icon
  });

  google.maps.event.addListener(marker, 'click', (function(marker) {
    return function() {
      infowindow.setContent(title);
      infowindow.open(map, marker);
    }
  })(marker));

  bounds.extend(marker.position);

  markers.push(marker);

}

function buildPolyline(route) {

  busPolyLine = new google.maps.Polyline({
    path: route,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 3
  });

  busPolyLine.setMap(map);
}

function clearRoute(){

  if(busPolyLine)
    busPolyLine.setMap(null);

  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }

  markers = [];
  busPolyLine = {}; 
  map.fitBounds(bounds);
  bounds = new google.maps.LatLngBounds();
}

google.maps.event.addDomListener(window, 'load', initialize);
