/* jshint unused:false, camelcase:false */
/* global google */

function geocode(address, cb){
  'use strict';
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({address:address}, function(results, status){
    var name = results[0].formatted_address,
        lat  = results[0].geometry.location.lat(),
        lng  = results[0].geometry.location.lng();

    cb(name, lat, lng);
  });
}

function createMap(selector, lat, lng, zoom){
  'use strict';
    var styles     = [{'featureType':'landscape','stylers':[{'hue':'#00dd00'}]},{'featureType':'road','stylers':[{'hue':'#dd0000'}]},{'featureType':'water','stylers':[{'hue':'#000040'}]},{'featureType':'poi.park','stylers':[{'visibility':'off'}]},{'featureType':'road.arterial','stylers':[{'hue':'#ffff00'}]},{'featureType':'road.local','stylers':[{'visibility':'off'}]}],
        mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP, styles:styles},
               map = new google.maps.Map(document.getElementById(selector), mapOptions);

  return map;
}

function addMarker(map, lat, lng, name, icon){
  'use strict';
  var latLng = new google.maps.LatLng(lat, lng);
  new google.maps.Marker({map: map, position: latLng, title: name, animation: google.maps.Animation.DROP, icon: icon});
}
