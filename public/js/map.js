var tileUrl = 'http://{s}.tiles.mapbox.com/v3/mapofmine.20e17b27/{z}/{x}/{y}.png';

function loadMap(userId, userName){
  var map = L.map('map', {
    center: [51.505, -0.09],
    zoom: 7
  });

  L.tileLayer(tileUrl, {
    detectRetina: true,
    noWrap: false
  }).addTo(map);

  $.ajax('/pictures/'+userId+'/'+userName)
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
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      animateAddingMarkers: true,
    zoomToBoundsOnClick: false,
      spiderfyDistanceMultiplier: 5,
      iconCreateFunction: function(cluster) {
        return new L.DivIcon({ html: '<div class="stack">'+
                              '<div class="bgLayer bgLayerOne"></div>'+
                              '<div class="bgLayer bgLayerTwo"></div>'+
                              '<div class="bgLayer bgLayerThree"></div>'+
                              '<div class="image">'+
                              '<img src="'+cluster.getAllChildMarkers()[0].options.icon.options.iconUrl+'"></img>'+
                              '</div><div class="iconCount">' + cluster.getChildCount() + '</div></div>' });
      }
    });
  markers.on('clusterclick', function (a) {
			a.layer.zoomToBounds();
		});

  for(var i = 0; i < results.length; i++){
    var width = 70,
        height = 70;

    if(results[i].location){
      var myIcon = L.icon({
        iconUrl: results[i].images.thumbnail.url,
        iconRetinaUrl: results[i].images.standard_resolution.url,
        iconSize: [width, height],
        iconAnchor: [width/ 2, height],
        className: 'single-photo'
      });

      var latlng = {
        lat: results[i].location.latitude,
        lng: results[i].location.longitude
      };
      
      var icon = L.marker(latlng, {
        icon : myIcon,
        markerZoomAnimation : true
      });
     
      markers.addLayer(icon);
      
      icon.on('click',openModal.bind(null, results[i]));

      //Available for fitbounds
      bounds.push(latlng);
    }
    
  }
  
  map.addLayer(markers);
  map.fitBounds(bounds, {animate: true});

}

function openModal(data,e){
    console.log(data,e);
  debugger
  $('.modal .modal-content  ').html(_.template(templateModal, {
    imageSrc: data.images.standard_resolution.url ,
    imageHref: data.link,
    numberLikes : data.likes.count,
    numberComments : data.comments.count
  }));
  
  $('.modal .close').on('click', function(){
    $('.modal').addClass('hidden');
  })
  $('.modal').removeClass('hidden');
  

}