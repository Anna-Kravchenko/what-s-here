var timerMap, isAnimationInProgress = false;
var geocoder;

function initMap() {
	var defaultLatLng = {
			  lat: 50.4501,
			  lng: 30.5234
			};
	currentLatLng = defaultLatLng;
	map = new google.maps.Map(document.getElementById('map'), {
			center: currentLatLng,
			zoom: 12,
			streetViewControl: false,
			rotateControl: true,
			mapTypeControl: false,
			//scrollwheel: false
			});
			
	geocoder = new google.maps.Geocoder;
	// Try HTML5 geolocation.
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			currentLatLng = {
			  lat: position.coords.latitude,
			  lng: position.coords.longitude
			};
			map.setCenter(currentLatLng);
		});
	}
		
	request = {
		location: currentLatLng,
		radius: '10'
		/* types: ['store'] */
		};

	service = new google.maps.places.PlacesService(map);
	
	map.addListener('click', function(e) {
		currentLatLng.lat = e.latLng.lat();
		currentLatLng.lng = e.latLng.lng();
		//console.log(currentLatLng.lat, currentLatLng. lng);
		placeMarkerAndPanTo(e.latLng, map);
		
		geocodeLatLng(geocoder, map);
		request.location = currentLatLng;
		service.nearbySearch(request, callbackPlaces);
		//map.setCenter(marker.getPosition());
		});
	
	map.addListener('mouseover', expandMap);
	map.addListener('mouseout', collapseMap);
}

function callbackPlaces(results, status) {
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			var place = results[i];
			/* createMarker(results[i]); */
			//console.log("places      ",results[i]);
			if(results[i].types.indexOf("point_of_interest")!=-1){
				console.log(results[i].name, i);
				address += ", \"" + results[i].name + "\"";
				return;
			}
		}
	}
}

function placeMarkerAndPanTo(latLng, map) {
	if(marker!=null){
			marker.setMap(null);
			marker = null;
			}
			
	var img = 'images/icons/pin.png';
	marker = new google.maps.Marker({
		position: latLng,
		map: map,
		draggable: true,
		animation: google.maps.Animation.DROP,
		icon: img
		});
	map.panTo(latLng);
	
	marker.addListener('dragend', function(e) {
			currentLatLng.lat = e.latLng.lat();
			currentLatLng.lng = e.latLng.lng();
			console.log(currentLatLng.lat, currentLatLng.lng);
			geocodeLatLng(geocoder, map);
			map.setCenter(marker.getPosition());
			request.location = currentLatLng;
			service.nearbySearch(request, callbackPlaces);
	    });
/* 	console.log(currentLatLng.lat, currentLatLng.lng);
	geocodeLatLng(geocoder, map);
	request.location = currentLatLng;
	service.nearbySearch(request, callbackPlaces); */
			
}


function expandMap(){
	if(isAnimationInProgress) return;
	isAnimationInProgress = true;
	
	timerMap = setInterval(updateMap, 50);
    $("#mapWrap").animate({height: "800px", width: "800px"}, 200, "linear", function() {
		timerMap = clearInterval(timerMap);
		isAnimationInProgress = false;
    }); 
}

function updateMap() {
    var center = (marker!=null)? marker.getPosition() : currentLatLng;
    google.maps.event.trigger(map, "resize");
    map.setCenter(center);
}

function collapseMap(){
	if(isAnimationInProgress) return;
	isAnimationInProgress = true;

	timerMap = setInterval(updateMap, 50);
	$("#mapWrap").animate({height: "300px", width: "300px"}, 200, "linear", function() {
		timerMap = clearInterval(timerMap);
		isAnimationInProgress = false;
    });
}

function geocodeLatLng(geocoder, map) {
    geocoder.geocode({'location': currentLatLng}, function(results, status) {
		var detalisationLevel = 0;
		address = "";
		console.log(results);
		
		if(map.zoom>=0  && map.zoom<6) detalisationLevel = 0;
		if(map.zoom>=6  && map.zoom<10) detalisationLevel = 1;
		if(map.zoom>=10 && map.zoom<12) detalisationLevel = 2;
		if(map.zoom>=12 && map.zoom<17) detalisationLevel = 3;
		if(map.zoom>=17 && map.zoom<=21) detalisationLevel = 4;
		
		if   ( results == null || results.length < 6
			||(detalisationLevel == 0 && results.length >=6 &&results[6] == null)
			||(detalisationLevel == 1 && results[5] == null)
			||(detalisationLevel == 2 && results[1] == null)
			||(detalisationLevel == 3 && (results[1] == null || results[0] == null))
			||(detalisationLevel == 4 && results[0] == null)
			){
				$('#response').html("");
				$('#prevPageButton').css('visibility', 'hidden');
				$('#nextPageButton').css('visibility', 'hidden');
				$("#searchQuery").text("No results found");
				console.log('No results found');
				console.log(detalisationLevel);
				return;
		}
		if (status == 'OK' ){ 
			switch(detalisationLevel){
				case 0: 
					address = results[6].formatted_address;
					break;
				case 1:
					address = results[5].formatted_address;
					break;
				case 2:
					address = results[1].formatted_address;
					break;
				case 3:
					address = results[0].formatted_address,results[1].formatted_address;
					break;
				case 4:
					address = results[0].formatted_address;
					break;
			}	
			console.log(address);
			console.log(map.zoom);
			googleSearchInformation();	
		}
		else {
			console.log('Geocoder failed due to: ' + status);
			}
	});
}
