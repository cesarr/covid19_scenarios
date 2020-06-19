window.addEventListener('load', (event) => {
    var map = L.map('map-container').setView([30.445, -84.35], 10);
      
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', 
    {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap<\/a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA<\/a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox<\/a>',
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1
    }).addTo(map);

    var geojson;
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      geojson = JSON.parse(this.responseText);
      L.geoJSON(geojson, {
        style: function(feature) {
          return {
            color: '#5DADE2',
            fillColor: '#5DADE2',
            fillOpacity: 0.1
          };
        }
      }).bindPopup(function(layer) {
        // return layer.feature.properties.description;
      }).addTo(map);
    }
    };
    xmlhttp.open("GET", "/static/data/leon-county-census-tracts.geojson", true);
    xmlhttp.send();

    var popup = L.popup();

    function onMapClick(e) {
    var message = "Latitude: " + e.latlng.lat + " Longitude:" + e.latlng.lng;

    popup
      .setLatLng(e.latlng)
      .setContent(message)
      .openOn(map);
    }

    map.on('click', onMapClick);
});


// window.onload = function(){ 
//     var map = L.map('leaflet-container').setView([30.445, -84.35], 10);
    
//     L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', 
//     {
//       maxZoom: 18,
//       attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap<\/a> contributors, ' +
//         '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA<\/a>, ' +
//         'Imagery © <a href="https://www.mapbox.com/">Mapbox<\/a>',
//       id: 'mapbox/streets-v11',
//       tileSize: 512,
//       zoomOffset: -1
//     }).addTo(map);

//   var geojson;
//   var xmlhttp = new XMLHttpRequest();

//   xmlhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//       geojson = JSON.parse(this.responseText);
//       L.geoJSON(geojson, {
//         style: function(feature) {
//           return {
//             color: '#5DADE2',
//             fillColor: '#5DADE2',
//             fillOpacity: 0.1
//           };
//         }
//       }).bindPopup(function(layer) {
//         // return layer.feature.properties.description;
//       }).addTo(map);
//     }
//   };
//   xmlhttp.open("GET", "/static/data/leon-county-census-tracts.geojson", true);
//   xmlhttp.send();

//   var popup = L.popup();

//   function onMapClick(e) {
//     var message = "Latitude: " + e.latlng.lat + " Longitude:" + e.latlng.lng;
    
//     popup
//       .setLatLng(e.latlng)
//       .setContent(message)
//       .openOn(map);
//   }

//   map.on('click', onMapClick);
// };