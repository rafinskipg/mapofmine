var tileUrl = 'http://{s}.tiles.mapbox.com/v3/mapofmine.20e17b27/{z}/{x}/{y}.png';

function loadMap(userId){
  var map = L.map('map', {
    center: [51.505, -0.09],
    zoom: 18
  });

  L.tileLayer(tileUrl, {
    detectRetina: true,
    noWrap: false
  }).addTo(map);

  $.ajax('/pictures/'+userId)
  .then(function(result){
    paintResults(result, map);
  })
  .fail(function(err){
    console.log('error');
  });
}

function paintResults(results, map){
  var bounds = [];
  var markers = new L.MarkerClusterGroup({
    iconCreateFunction: function(cluster) {
      return new L.DivIcon({ html: '<div class="stack"><div class="image">'+
                            '<img src="'+cluster.getAllChildMarkers()[0].options.icon.options.iconUrl+'"></img>'+
                            '</div><div class="iconCount">' + cluster.getChildCount() + '</div></div>' });
    }
  });

  for(var i = 0; i < results.length; i++){
    var width = results[i].images.thumbnail.width;
    var height = results[i].images.thumbnail.height;

    var myIcon = L.icon({
      iconUrl: results[i].images.thumbnail.url,
      iconRetinaUrl: results[i].images.standard_resolution.url,
      iconSize: [width, height],
      iconAnchor: [width/ 2, height]
    });
    var latlng = {
      lat: results[i].location.latitude,
      lng: results[i].location.longitude
    };
    
    markers.addLayer(new L.Marker(latlng, {
      icon : myIcon
    }));
    
    bounds.push(latlng);
  }
  
  map.addLayer(markers);
  map.fitBounds(bounds);

}
