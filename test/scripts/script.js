var map, currentLatLng, marker;
var timerMap, isAnimationInProgress = false;

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
			scrollwheel: false
			});
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
	map.addListener('click', function(e) {
	currentLatLng.lat = e.latLng.lat();
	currentLatLng.lng = e.latLng.lng();
	console.log(currentLatLng.lat, currentLatLng. lng);
	placeMarkerAndPanTo(e.latLng, map);
	//map.setCenter(marker.getPosition());
	});
	
	map.addListener('mouseover', expandMap);
	map.addListener('mouseout', collapseMap);
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
			//console.log(currentLatLng.lat, currentLatLng. lng);
			map.setCenter(marker.getPosition());
	    });
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