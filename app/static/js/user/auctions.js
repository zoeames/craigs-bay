/* global google:true */

(function(){
  'use strict';

  var map;

  $(document).ready(function(){
    initMap(0, 0, 2);
    var positions = getPositions();
    //forEach method to loop over an array in this case each treasure//
    positions.forEach(function(pos){
      addMarker(pos.lat, pos.lng, pos.name);
    });
  });

  function addMarker(lat, lng, name){
    var latLng = new google.maps.LatLng(lat, lng);
    new google.maps.Marker({map: map, position: latLng, title: name, animation: google.maps.Animation.DROP, icon: '/img/chest.gif'});
  }

  function getPositions(){
    var positions = $('table tbody tr').toArray().map(function(tr){
      var name = $(tr).attr('data-name'),
          lat  = $(tr).attr('data-lat'),
          lng  = $(tr).attr('data-lng'),
          pos  = {name:name, lat:parseFloat(lat), lng:parseFloat(lng)};
      return pos;
    });
    return positions;
  }

  function initMap(lat, lng, zoom){
    var styles     = [{'featureType':'water','elementType':'geometry','stylers':[{'color':'#ffdfa6'}]},{'featureType':'landscape','elementType':'geometry','stylers':[{'color':'#b52127'}]},{'featureType':'poi','elementType':'geometry','stylers':[{'color':'#c5531b'}]},{'featureType':'road.highway','elementType':'geometry.fill','stylers':[{'color':'#74001b'},{'lightness':-10}]},{'featureType':'road.highway','elementType':'geometry.stroke','stylers':[{'color':'#da3c3c'}]},{'featureType':'road.arterial','elementType':'geometry.fill','stylers':[{'color':'#74001b'}]},{'featureType':'road.arterial','elementType':'geometry.stroke','stylers':[{'color':'#da3c3c'}]},{'featureType':'road.local','elementType':'geometry.fill','stylers':[{'color':'#990c19'}]},{'elementType':'labels.text.fill','stylers':[{'color':'#ffffff'}]},{'elementType':'labels.text.stroke','stylers':[{'color':'#74001b'},{'lightness':-8}]},{'featureType':'transit','elementType':'geometry','stylers':[{'color':'#6a0d10'},{'visibility':'on'}]},{'featureType':'administrative','elementType':'geometry','stylers':[{'color':'#ffdfa6'},{'weight':0.4}]},{'featureType':'road.local','elementType':'geometry.stroke','stylers':[{'visibility':'off'}]}],
    mapOptions     = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.HYBRID, styles:styles};
    map            = new google.maps.Map(document.getElementById('map'), mapOptions);
  }
})();
