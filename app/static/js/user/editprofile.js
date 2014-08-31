/* global geocode */

(function(){
  'use strict';

  $(document).ready(function(){
    $('#locName').blur(geocodeLoc);

  });


  function geocodeLoc(){
    var origin = $('#locName').val();
    geocode(origin, function(locName, locLat, locLng){
      $('#locName').val(locName);
      $('#locLat').val(locLat);
      $('#locLng').val(locLng);
    });
  }
})();
