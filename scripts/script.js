var map, currentLatLng, marker;
var timerMap, isAnimationInProgress = false;
var geocoder;
var address = "";
var request;
/* var googleSearchString = ""; */

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
		service.nearbySearch(request, callback);
		//map.setCenter(marker.getPosition());
		});
	
	map.addListener('mouseover', expandMap);
	map.addListener('mouseout', collapseMap);
	

}

function callback(results, status) {
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			var place = results[i];
			/* createMarker(results[i]); */
			//console.log("places      ",results[i]);
			if(results[i].types.indexOf("point_of_interest")!=-1){
				console.log(results[i].name, i);
				address += " \"" + results[i].name + "\"";
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
			service.nearbySearch(request, callback);
	    });
/* 	console.log(currentLatLng.lat, currentLatLng.lng);
	geocodeLatLng(geocoder, map);
	request.location = currentLatLng;
	service.nearbySearch(request, callback); */
	/* document.getElementById('submit').addEventListener('click', function() {
			geocodeLatLng(geocoder, map);
			
			}); */
			
}

$(document).ready(function(){
	$('.searchResult__header_tab_information').on("click", googleSearchInformation); 
	$('.searchResult__header_tab_images').on("click", googleSearchImages);
	$('.searchResult__header_tab_video').on("click", youtubeSearchVideo); 
});

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
			/* searchGCSE(); */
			
			googleSearchInformation();
					
		}
		else {
			console.log('Geocoder failed due to: ' + status);
			}
	});
}

var nextPageToken, prevPageToken;
var firstPage=true; 
 // Helper function to display JavaScript value on HTML page.
function showResponse(response) {	
    var responseString = JSON.stringify(response, '', 2);
	var resultCount = response.pageInfo.totalResults;
    nextPageToken = response.result.nextPageToken;
    prevPageToken = response.result.prevPageToken; 

	$("#searchQuery").text("Search " + resultCount + " results for " + address);
	
	// Only show pagination buttons if there is a pagination token for the next or previous page of results.
    var nextVis = nextPageToken ? 'visible' : 'hidden';
    $('#nextPageButton').css('visibility', nextVis);
    
    var prevVis = prevPageToken ? 'visible' : 'hidden';
    $('#prevPageButton').css('visibility', prevVis);

    var videoItems = response.result.items;
		if (videoItems.length>0) {
			$('#response').html("");
			$.each(videoItems, function(index, item) {
				v = new Video(item, "#response");
				v.showInfo();
			});
		} 
		else {
			$('#response').html("");
			$('#response').text("Sorry, no videos found");
		}	
}

function Video (item, idTag){
	var v = this;
	//store each JSON value in a variable
	v.publishedAt			=item.snippet.publishedAt;
	v.channelId				=item.snippet.channelId;
	v.title					=item.snippet.title;
	v.description			=item.snippet.description;
	v.thumbnails_default	=item.snippet.thumbnails.default.url;
	v.thumbnails_medium		=item.snippet.thumbnails.medium.url;
	v.thumbnails_high		=item.snippet.thumbnails.high.url;
	v.channelTitle			=item.snippet.channelTitle;
	v.liveBroadcastContent	=item.snippet.liveBroadcastContent;
	v.videoID				=item.id.videoId;
	v.videoURL				="//www.youtube.com/embed/" + v.videoID + "?autoplay=1";
	console.log(v.title);
	
	//print the stored variables in a div idTag element
	v.showInfo = function(){
		$(idTag).append("<div class=\"response__video\"><div class=\"response__video_thumbnail\"><a id=\"response__video_thumbnail_"+v.videoID +"\" href='www.youtube.com/watch?v="+v.videoID+"'><img src=\""+v.thumbnails_medium+"\"/></a></div><div id=\"response__video_title\"><h3>"+v.title+"</h3></div><div id=\"response__video_channel\">"+v.channelTitle+"</div></div>"); 
		
		$("#response__video_thumbnail_" + v.videoID).click(v.playVideo); 
	}
	
	v.playVideo = function(event){	
		event.preventDefault();  
		$('#videoPlayer, #overlay').fadeIn('slow'); 
		$('#videoPlayer').addClass("videoPlayer");
		$('#videoPlayer').attr("src", v.videoURL);
	}
	return v;
}

$(document).on('touchend, mouseup', function(e) {
	if (!$('#videoPlayer').is(e.target)) {
		$('#videoPlayer, #overlay').fadeOut('slow');
		$('#videoPlayer').attr('src', '');
		$('#videoPlayer').removeClass('videoPlayer');
	}
});

// Retrieve the next page of videos in the playlist.
function nextPage() {
  searchYouTubeApi(nextPageToken);
}

// Retrieve the previous page of videos in the playlist.
function previousPage() {
  searchYouTubeApi(prevPageToken);
}

// Called automatically when JavaScript client library is loaded.
function onClientLoad() {
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}

// Called automatically when YouTube API interface is loaded 
function onYouTubeApiLoad() {
    gapi.client.setApiKey('AIzaSyAZsHM9KOhcIx3wBMx9d51ceekkaTxltQk');  
}

function youtubeSearchVideo(){
	$(".searchResult__results_info").css("display", "none");
	$(".searchResult__results_images").css("display", "none");
	$(".searchResult__results_video").css("display", "block");
	searchYouTubeApi();
}

function searchYouTubeApi(pageToken) {
    // Use the JavaScript client library to create a search.list() API call.
	
	$("#response").html("");
	var requestOptions = {
		q: address,
		part: 'snippet',
        maxResults: 12
	};
		if (pageToken) {
			requestOptions.pageToken = pageToken;
		}
	var request = gapi.client.youtube.search.list(requestOptions);
    request.execute(onSearchResponse);
}

// Called automatically with the response of the YouTube API request.
function onSearchResponse(response) {
	
    showResponse(response);
	
}

var s = "";	
/* function hndlr(response) {

    }
 */
	
function googleSearchInformation(){
	$(".searchResult__results_info").css("display", "block");
	$(".searchResult__results_images").css("display", "none");
	$(".searchResult__results_video").css("display", "none");
	
	googleSearchString = address;
	googleSearchString.replace(" ","+");
 	$.get( "https://www.googleapis.com/customsearch/v1?key=AIzaSyARpX6PpI6Q3GvvAORTRV3ktRZT1h2M9JU&cx=009405490577163904846:fpuq3tzttf8&q="
	+googleSearchString+"&filter=1&num=5", function( response ) {
		  
		for (var i = 0; i < response.items.length; i++) {
			var item = response.items[i];
	 
			s += "<div class=\'results__item\'><h3><a href=\'" + item.link + "\'>"+ item.title +"</a></h3>"
				+"<div class=\'anchor\'>" + item.displayLink + "</div>" + "<div class=\'snippet\'>" + item.snippet + "</div></div>";
		}
		$( "#results_info" ).html(s); 
	});  
	s="";
}

function googleSearchImages(){
	$(".searchResult__results_images").css("display", "block");
	$(".searchResult__results_info").css("display", "none");
	$(".searchResult__results_video").css("display", "none");
	googleSearchString = address;
	googleSearchString.replace(" ","+");

	$.get( "https://www.googleapis.com/customsearch/v1?key=AIzaSyARpX6PpI6Q3GvvAORTRV3ktRZT1h2M9JU&cx=009405490577163904846:fpuq3tzttf8&q="
	+googleSearchString+"&filter=1&num=5&searchType=image", function( response ) {
		  
		for (var i = 0; i < response.items.length; i++) {
			var item = response.items[i];
	 
			s += "<div class=\'results__item_img\'><a href=" + item.image.contextLink + "><img id=\'" + i + "\'src=\'" + item.link + "\'></img></a></div>";  
		}
		$( "#results_images" ).html(s);
		for (var i = 0; i < response.items.length; i++) {
			imageResize(i, response.items[i].image.height, response.items[i].image.width);
		}
	});
	s="";
}

function imageResize(imgId, height, width){
	
	var img = document.getElementById(imgId); 
	console.log(img);
	console.log(imgId, width, height);
	var ratio = 0;
	var maxWidth = 300;
	var maxHeight = 200;

	if ( width > maxWidth ) {
		ratio = maxWidth / width;
		$(img).css( "width", maxWidth );
		$(img).css( "height", height * ratio );
	}

	if ( height > maxHeight ) {
		ratio = maxHeight / height;
		$(img).css( "height", maxHeight );
		$(img).css( "width", width * ratio );
	}

}
