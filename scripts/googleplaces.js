function googleSearchPlaces(){
	$(".searchResult__results_info").css("display", "none");
	$(".searchResult__results_images").css("display", "none");
	$(".searchResult__results_video").css("display", "none");
	$(".searchResult__results_places").css("display", "block");
	searchPlacesApi();
}

function searchPlacesApi(){
	request = {
			location: currentLatLng,
			radius: '10'
			/* types: ['store'] */
			};
		
	service = new google.maps.places.PlacesService(map);

	request.location = currentLatLng;
	service.nearbySearch(request, searchPlaces);
}		

function searchPlaces(results, status) {
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		var placeCounter = 0;
		for (var i = 0; i < results.length; i++) {
			var place = results[i];
			if(place.types.indexOf("point_of_interest")!=-1){
				placeCounter ++;
				var stars = getPlaceRating(place);
				$("#results_places").append(
											"<div class=\"results__item_place\" id=\""+ place.place_id +"\"><img class=\"results__item_place__img_type\"  src=\"" +place.icon+"\"></img>"  +
											"<span class=\"results__item_place__name\">" + place.name +"</span>" +
											stars+
											place.vicinity  + "</div>"
											);
			} 
		}
		$("#searchQuery").html("Search " + placeCounter + " places for <b>" + address + "</b>");	
		$('.results__item_place').bind("click", getPlaceInfo); 
	}
}

function getPlaceInfo(){
	var id = $(this).attr("id");
	var request = {
		placeId: id
	};
	service.getDetails(request, callbackInfo); 

}

function getPlaceRating(place){
	var stars = "<div class=\"rating\">";
	if(place.rating){
		for(j=0; j<5; j++){
			if(j<Math.round(place.rating))
				stars+= "<span>&#9733</span>";
			else
				stars+= "<span>&#9734</span>";
		}
	}
	else{
		stars+= "<span>&#9734</span><span>&#9734</span><span>&#9734</span><span>&#9734</span><span>&#9734</span>";
	}
	stars += "</div>";
	return stars;
}

function callbackInfo(place, status) {
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		showPlaceInfo(place);	
		$(".searchResult__results_placeDetails").fadeIn('fast');
		$('#overlay1').fadeIn('fast'); 
		$('body').css('overflow','hidden');
		$(".searchResult__results_placeDetails").center();
	}
	else{
		$("#searchQuery").html("No places were found for <b>" + address + "</b>");	
	}
} 

jQuery.fn.center = function () {
	this.css("position","absolute");
	this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px");
	this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
	return this;
}
		
/* function showPlaceInfo(place){

	var placeHolder = $(".searchResult__results_placeDetails");
	placeHolder.empty();
	
	var line, lineIcon;
	
	for (var i=0; i<10; i++){
		line = document.createElement('div');
		line.className = "searchResult__results_placeDetails__line";
		placeHolder.append(line);
	}
	var  photoPlace 	= $(placeHolder.children(".searchResult__results_placeDetails__line")[0])
		,namePlace 		= $(placeHolder.children(".searchResult__results_placeDetails__line")[1])
		,phonePlace 	= $(placeHolder.children(".searchResult__results_placeDetails__line")[2])
		,sitePlace 		= $(placeHolder.children(".searchResult__results_placeDetails__line")[3])
		,ratingPlace 	= $(placeHolder.children(".searchResult__results_placeDetails__line")[4])
		,vicinityPlace 	= $(placeHolder.children(".searchResult__results_placeDetails__line")[5])
		,hoursPlace 	= $(placeHolder.children(".searchResult__results_placeDetails__line")[6])
		,reviewsPlace 	= $(placeHolder.children(".searchResult__results_placeDetails__line")[7])
		,morePlace 		= $(placeHolder.children(".searchResult__results_placeDetails__line")[8])
		;
	
	if(place.photos){
		photoPlace.html("<img src=\"" + place.photos[0].getUrl({'maxWidth': 408, 'maxHeight': 256}) +"\"></img>");
	}
	else
	{
		photoPlace.html("<img src=\"images/notfound.jpg\">");
	}
	namePlace.text(place.name);
	phonePlace.text(place.international_phone_number);
	if(typeof place.website != 'undefined'){
		alert("!");
		sitePlace.text(place.website);
	}

	ratingPlace.html(getPlaceRating(place));
	vicinityPlace.text(place.vicinity);
	hoursPlace.text(place.opening_hours.open_now?"open now":"closed");	//сделать по ховеру див с часами работы
	//reviewsPlace.text(place.reviews[0].text);		//аккордеон для отзывов
	morePlace.text(place.url);
	
	alert(placeHolder.children(".searchResult__results_placeDetails__line").length);
	var shift = 0;
 	placeHolder.children(".searchResult__results_placeDetails__line").each(function( index ) {
		if(index>1){
			lineIcon = document.createElement('span');
			lineIcon.className = "searchResult__results_placeDetails__line_icon";
			$(lineIcon).css("background-position-x", shift);
			shift -= 24;
			$( this ).prepend(lineIcon);
		}
	});  
		
	photoPlace.addClass("searchResult__results_placeDetails_photos");
 	namePlace.find("span").addClass("searchResult__results_placeDetails_name");
	phonePlace.find("span").addClass("searchResult__results_placeDetails_website");
	sitePlace.find("span").addClass("searchResult__results_placeDetails_rating");
	ratingPlace.find("span").addClass("searchResult__results_placeDetails_address");
	vicinityPlace.find("span").addClass("searchResult__results_placeDetails_phone");
	hoursPlace.find("span").addClass("searchResult__results_placeDetails_hours");
	reviewsPlace.find("span").addClass("searchResult__results_placeDetails_reviews");
	morePlace.find("span").addClass("searchResult__results_placeDetails_more"); 
	
	
	if(typeof place.website == 'undefined'){
		placeHolder.remove(".searchResult__results_placeDetails_website");
		//sitePlace.remove();
	}
} */

function showPlaceInfo(place){

	var placeHolder = $(".searchResult__results_placeDetails");
	placeHolder.empty();
	
	var line, lineIcon;
	
	var photoPlace = generateItem("searchResult__results_placeDetails_photos", placeHolder)
		,header = generateItem("searchResult__results_placeDetails__header", placeHolder)
		,namePlace = generateItem("searchResult__results_placeDetails_name", header)
		,ratingPlace = generateItem("searchResult__results_placeDetails_rating", header)
		,body = generateItem("searchResult__results_placeDetails__body", placeHolder)
		,phonePlace = generateItem("searchResult__results_placeDetails_phone", body)
		,sitePlace = generateItem("searchResult__results_placeDetails_website", body)
		,vicinityPlace = generateItem("searchResult__results_placeDetails_address", body)
		,hoursPlace = generateItem("searchResult__results_placeDetails_hours", body)
		,reviewsPlace = generateItem("searchResult__results_placeDetails_reviews", body)
		,morePlace = generateItem("searchResult__results_placeDetails_more", body)
		;
		
	if(place.photos){
		photoPlace.html("<img src=\"" + place.photos[0].getUrl({'maxWidth': 408, 'maxHeight': 258}) +"\"></img>");
	}
	else
	{
		photoPlace.html("<img src=\"images/notfound.jpg\">");
	}
	namePlace.text(place.name);
	if(place.international_phone_number){
		phonePlace.text(place.international_phone_number);
	}
	else{
		placeHolder.find(".searchResult__results_placeDetails_phone").css("display", "none");
	}
	ratingPlace.html(getPlaceRating(place));
	vicinityPlace.text(place.vicinity);
	if(typeof place.opening_hours != 'undefined'){
		
		hoursPlace.text(place.opening_hours.open_now?"open now":"closed");	//сделать по ховеру див с часами работы
	}
	else{
		placeHolder.find(".searchResult__results_placeDetails_hours").css("display", "none");
	}
	morePlace.html("<a href=\"" + place.url + "\" target=\"_blank\">more information...</a>");
	
	if(typeof place.website != 'undefined'){
		
		sitePlace.text(place.website);
	}
	else{
		placeHolder.find(".searchResult__results_placeDetails_website").css("display", "none");
	}
	
	if(typeof place.reviews != 'undefined' || !place.reviews){
		//$("#reviewsList").html(place.reviews[0].text);
		$("#reviewsList").html(place.reviews[0].text);	
		reviewsPlace.html("<a id=\"reviews\" href=\"#reviewsList\" >more information...</a>");	//аккордеон для отзывов
		$('#reviews').click(function(){
			$('.searchResult__results_placeDetails__body').html($("#reviewsList").html());
		});
	}
	else{
		placeHolder.find(".searchResult__results_placeDetails_reviews").css("display", "none");
	}
	
	phonePlace.prepend(generateIcon(0));
	sitePlace.prepend(generateIcon(-24));
	vicinityPlace.prepend(generateIcon(-24*2));
	hoursPlace.prepend(generateIcon(-24*3));
	reviewsPlace.prepend(generateIcon(-24*4));
	morePlace.prepend(generateIcon(-24*5));
}

    
function generateItem(className, placeHolder){
	var newItem = document.createElement('div');
	newItem.className = "searchResult__results_placeDetails__line " + className;
	placeHolder.append(newItem);
	return $(newItem);
}

function generateIcon(shift){
	lineIcon = document.createElement('span');
	lineIcon.className = "searchResult__results_placeDetails__line_icon";
	$(lineIcon).css("background-position-x", shift);
	return $(lineIcon);
}

$(document).on('touchend, mouseup', function(e) {
	e.stopPropagation();
	console.log(e.currentTarget);
	console.log(e.target);
	console.log("this", this);

	if (($('#overlay1').is(e.target)
		/* || 
		$('.searchResult__results_placeDetails').is($(e.target).parent()) */
		
		)) {
		$('#overlay1').fadeOut('fast');
		$(".searchResult__results_placeDetails").fadeOut('fast');
		$('body').css('overflow', 'inherit');
	}
});