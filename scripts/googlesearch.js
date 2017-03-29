var s = "";	
	
function googleSearchInformation(){
	$(".searchResult__results_info").css("display", "block");
	$(".searchResult__results_images").css("display", "none");
	$(".searchResult__results_video").css("display", "none");
	$(".searchResult__results_places").css("display", "none");
	
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
		$("#searchQuery").html("Search " + response.items.length + " results for <b>" + address + "</b>");	
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
		$("#searchQuery").html("Search " + response.items.length + " results for <b>" + address + "</b>");	
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