var map, currentLatLng, marker;
var address = "";
var request;
var service = null;

$(document).ready(function(){
	$('.searchResult__header_tab_information').on("click", googleSearchInformation); 
	$('.searchResult__header_tab_images').on("click", googleSearchImages);
	$('.searchResult__header_tab_video').on("click", youtubeSearchVideo); 
	$('.searchResult__header_tab_places').on("click", googleSearchPlaces); 
});


