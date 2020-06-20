window.addEventListener('load', (event) => {
    var map = L.map('map-container').setView([30.445, -84.35], 10);
    GLOBAL_MAP = map;
      
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
    var tractsRequest = new XMLHttpRequest();

    tractsRequest.onreadystatechange = function() {
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
    tractsRequest.open("GET", "./static/data/leon-county-census-tracts.geojson", true);
    tractsRequest.send();

    var popup = L.popup();

    function onMapClick(e) {
    var message = "Latitude: " + e.latlng.lat + " Longitude:" + e.latlng.lng;
    popup
      .setLatLng(e.latlng)
      .setContent(message)
      .openOn(map);
    }

    map.on('click', onMapClick);

    var agentsRequest = new XMLHttpRequest();
    
    agentsRequest.onreadystatechange = function(){
      
      if (this.readyState == 4 && this.status == 200) {
        result = JSON.parse(this.responseText);
        drawAgents(result["agents"])
        // document.getElementById("run-button").disabled = false;
        // var mapSlider = document.getElementById("map-slider");
        // mapSlider.max = result.agents[0].states.length - 1;
        // mapSlider.disabled = false;
      } 
      else {
        // TODO Error Handling
      }
    };
	
// 	var mapSlider = document.getElementById("map-slider");
// 	var mapSliderLabel = document.getElementById("map-slider-label");
// 	mapSlider.value = 0
// 	mapSliderLabel.innerHTML = "&nbsp;Day " + 0;
// 	mapSlider.disabled = true;
	
    agentsRequest.open("POST", "./agents");
    agentsRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    
    var parameters = {population: 2380};
    parametersJson = JSON.stringify(parameters);
    agentsRequest.send(parametersJson);
});

function drawAgents(agents) {
	var agent;
	var circle;
	var state;
  var style;
  var map = GLOBAL_MAP;
	
	if (typeof(GLOBAL_AGENTS) == "undefined") {
    for (var i = 0; i < agents.length; i++) {
      agent = agents[i];
      circle = L.circle([agent.lat, agent.lng], {radius: 1});
      state = agent.states[0];
      style = provideStyle(state);
      circle.setStyle(style);		
      circle.addTo(map);
      agents[i].circle = circle;
    }
  }
  else {
    for (var i = 0; i < GLOBAL_AGENTS.length; i++) {
			agent = GLOBAL_AGENTS[i];
			agent.circle.remove();
		}
  }

	GLOBAL_AGENTS = agents;
}

function updateAgents(step) {
	var agents = GLOBAL_AGENTS;
	var circle;
	var state;
	var style;
	
	for (var i = 0; i < agents.length; i++) {
		agent = agents[i];
		state = agent.states[step];
		style = provideStyle(state);
		agent.circle.setStyle(style);
	}
	
	agent.circle.redraw();
}

function provideStyle(state) {
	var style;
	
	switch(state) {
	  case "S":
		  style = {color: 'green'};
		  break;
      case "I":
	      style = {color: 'orange'};
	      break;
  	  case "R":
		  style = {color: 'blue'};
    	  break;
  	  case "H":
		  style = {color: 'red'};
		  break;
      case "D":
		  style = {color: 'purple'};
		  break;
	  default:
		  style = {color: 'blue'};
	}
	
	return style
}

/* globals Chart:false, feather:false */

// (function() {
// 	'use strict'

// 	feather.replace()
// }())

// $(function () {
//   $('[data-toggle="tooltip"]').tooltip()
// })

// window.onload = function() {
// 	var canvas1 = document.getElementById('canvas-1').getContext('2d');
// 	var canvas2 = document.getElementById('canvas-2').getContext('2d');

// 	// These variables are global. Need to find a way to encapsulate them.
// 	GLOBAL_SIR_CHART = new Chart(canvas1, sriChartConfig);
// 	GLOBAL_CENSUS_CHART = new Chart(canvas2, censusChartConfig);
// 	GLOBAL_AGENTS = undefined;
	
// 	configureParameterInputs()
// };

//////////////// Map ///////////////////

// var map = L.map('map-1').setView([30.445, -84.35], 10);

// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
// 	maxZoom: 18,
// 	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap<\/a> contributors, ' +
// 		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA<\/a>, ' +
// 		'Imagery © <a href="https://www.mapbox.com/">Mapbox<\/a>',
// 	id: 'mapbox/streets-v11',
// 	tileSize: 512,
// 	zoomOffset: -1
// }).addTo(map);

// var geojson;
// var xmlhttp = new XMLHttpRequest();

// xmlhttp.onreadystatechange = function() {
// 	if (this.readyState == 4 && this.status == 200) {
// 		geojson = JSON.parse(this.responseText);
// 		L.geoJSON(geojson, {
// 			style: function(feature) {
// 				return {
// 					color: '#5DADE2',
// 					fillColor: '#5DADE2',
// 					fillOpacity: 0.1
// 				};
// 			}
// 		}).bindPopup(function(layer) {
// 			// return layer.feature.properties.description;
// 		}).addTo(map);
// 	}
// };
// xmlhttp.open("GET", "./static/data/leon-county-census-tracts.geojson", true);
// xmlhttp.send();

// var popup = L.popup();

// function onMapClick(e) {
// 	var message = "Latitude: " + e.latlng.lat + " Longitude:" + e.latlng.lng;
	
// 	popup
// 		.setLatLng(e.latlng)
// 		.setContent(message)
// 		.openOn(map);
// }

// map.on('click', onMapClick);



////////////// Charts /////////////////

// var sriChartConfig = {
// 	type: 'line',
// 	data: {
// 		labels: [],
// 		datasets: [{
// 			label: 'Infected',
// 			backgroundColor: window.chartColors.orange,
// 			borderColor: window.chartColors.orange,
// 			data: [],
// 			fill: false,
// 		}, {
// 			label: 'Susceptible',
// 			fill: false,
// 			backgroundColor: window.chartColors.green,
// 			borderColor: window.chartColors.green,
// 			data: [],
// 		}, {
// 			label: 'Recovered',
// 			fill: false,
// 			backgroundColor: window.chartColors.blue,
// 			borderColor: window.chartColors.blue,
// 			data: [],
// 		}, {
// 			label: 'Deceased',
// 			fill: false,
// 			backgroundColor: window.chartColors.black,
// 			borderColor: window.chartColors.black,
// 			data: [],
// 		}]
// 	},
// 	options: {
// 		responsive: true,
// 		title: {
// 			display: true,
// 			text: 'SIR Chart'
// 		},
// 		tooltips: {
// 			mode: 'index',
// 			intersect: false
// 		},
// 		hover: {
// 			mode: 'nearest',
// 			intersect: true
// 		},
// 		scales: {
// 			xAxes: [{
// 				display: true,
// 				scaleLabel: {
// 					display: true,
// 					labelString: 'Time (days)'
// 				}
// 			}],
// 			yAxes: [{
// 				display: true,
// 				scaleLabel: {
// 					display: true,
// 					labelString: 'Number of People'
// 				}
// 			}]
// 		}
// 	}
// };

// var censusChartConfig = {
// 	type: 'line',
// 	data: {
// 		labels: [],
// 		datasets: [{
// 			label: 'Hospitalized',
// 			backgroundColor: window.chartColors.red,
// 			borderColor: window.chartColors.red,
// 			data: [],
// 			fill: false,
// 		}]
// 	},
// 	options: {
// 		responsive: true,
// 		title: {
// 			display: true,
// 			text: 'Hospital Census Chart'
// 		},
// 		tooltips: {
// 			mode: 'index',
// 			intersect: false
// 		},
// 		hover: {
// 			mode: 'nearest',
// 			intersect: true
// 		},
// 		scales: {
// 			xAxes: [{
// 				display: true,
// 				scaleLabel: {
// 					display: true,
// 					labelString: 'Time (days)'
// 				}
// 			}],
// 			yAxes: [{
// 				display: true,
// 				scaleLabel: {
// 					display: true,
// 					labelString: 'Number of People'
// 				}
// 			}]
// 		}
// 	}
// };

// function updateSirChart(result) {
// 	var value;
// 	var chart = GLOBAL_SIR_CHART;
	
// 	chart.data.labels.length = 0;
// 	chart.data.datasets.forEach((dataset) => {
// 		dataset.data.length = 0;
// 	});
// 	chart.update();

// 	for (key in result.susceptible) {
// 		chart.data.labels.push(key);

// 		value = result.susceptible[key];
// 		chart.data.datasets[1].data.push(value);

// 		value = result.infected[key];
// 		chart.data.datasets[0].data.push(value);

// 		value = result.recovered[key];
// 		chart.data.datasets[2].data.push(value);
		
// 		value = result.dead[key];
// 		chart.data.datasets[3].data.push(value);
// 	}
	
// 	chart.update();
// }

// function updateHospitalCensusChart(result) {
// 	chart = GLOBAL_CENSUS_CHART;
	
// 	chart.data.labels.length = 0;
// 	chart.data.datasets.forEach((dataset) => {
// 		dataset.data.length = 0;
// 	});
// 	chart.update();

// 	for (key in result["severe_cases"]) {
// 		chart.data.labels.push(key);

// 		value = result["severe_cases"][key];
// 		chart.data.datasets[0].data.push(value);
// 	}

// 	chart.update();
// }


/////////// Control Panel /////////////


// function configureParameterInputs() {
// 	var input;
// 	var label;

// 	for (var i = 1; i <= 17; i++) {
// 		input = document.getElementById("input-" + i);
// 		label = document.getElementById("input-label-" + i);
		
// 		if(label != undefined){
// 			label.innerHTML = input.value;
// 		}
		
// 		input.oninput = function() {
// 			var tokens = this.id.split("-");  // Creates two tokens from the input ID
// 			var number = tokens[1]; // Retrieves the number in the id
// 			var id = "input-label-" + number;
// 			var label = document.getElementById(id);
			
// 			if(label != undefined){
// 				label.innerHTML = this.value;
// 			}
// 		}
// 	}
// }

// function gatherParameters() {
// 	var input;
// 	var parameters = {};
// 	var paramId;

// 	for (var i = 1; i <= 15; i++) {
// 		input = document.getElementById("input-" + i);
// 		paramId = input.dataset.paramId;
// 		parameters[paramId] = input.value;
// 	}
	
// 	return parameters;
// }

// // Run Button 
// var run_button = document.getElementById("run-button");

// run_button.onclick = function() {
// 	var parameters = gatherParameters();
// 	var mapSlider = document.getElementById("map-slider");
// 	var mapSliderLabel = document.getElementById("map-slider-label");
	
// 	this.disabled = true;
// 	mapSlider.value = 0;
// 	mapSlider.disabled = true;
// 	mapSliderLabel.value = 0;
// 	runSimulation(parameters);
// }

// function runSimulation(parameters) {
// 	var xmlhttp = new XMLHttpRequest();
// 	var parametersJson;
		
// 	xmlhttp.onreadystatechange = function(){
// 		if (this.readyState == 4 && this.status == 200) {
// 			result = JSON.parse(this.responseText);
// 			updateSirChart(result["sir"])
// 			updateHospitalCensusChart(result["sir"])
// 			drawAgents(result["agents"])
// 			document.getElementById("run-button").disabled = false;
// 			var mapSlider = document.getElementById("map-slider");
// 			mapSlider.max = result.agents[0].states.length - 1;
// 			mapSlider.disabled = false;
// 		} 
// 		else {
// 			// TODO Error Handling
// 		}
// 	};
	
// 	var mapSlider = document.getElementById("map-slider");
// 	var mapSliderLabel = document.getElementById("map-slider-label");
// 	mapSlider.value = 0
// 	mapSliderLabel.innerHTML = "&nbsp;Day " + 0;
// 	mapSlider.disabled = true;
	
// 	xmlhttp.open("POST", "./solver");
// 	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
// 	parametersJson = JSON.stringify(parameters);
// 	xmlhttp.send(parametersJson);
// }

// var mapSlider = document.getElementById("map-slider");
// var mapSliderLabel = document.getElementById("map-slider-label");
// mapSliderLabel.innerHTML = "&nbsp;Day " + mapSlider.value;

// mapSlider.oninput = function() {
// 	var step = this.value;
// 	var mapSliderLabel = document.getElementById("map-slider-label");
	
// 	mapSliderLabel.innerHTML = "&nbsp;Day " + this.value;
// 	updateAgents(step);
// }


