function youtubeSearchVideo(){
	$(".searchResult__results_info").css("display", "none");
	$(".searchResult__results_images").css("display", "none");
	$(".searchResult__results_video").css("display", "block");
	$(".searchResult__results_places").css("display", "none");
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
    request.execute(showResponse);
}

var nextPageToken, prevPageToken;
var firstPage=true; 
// Called automatically with the response of the YouTube API request.
// Helper function to display JavaScript value on HTML page.
function showResponse(response) {	
    var responseString = JSON.stringify(response, '', 2);
	var resultCount = response.pageInfo.totalResults;
    nextPageToken = response.result.nextPageToken;
    prevPageToken = response.result.prevPageToken; 

	$("#searchQuery").html("Search " + resultCount + " videos for <b>" + address + "</b>");
	
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
		$('#videoPlayer,#overlay').fadeIn('slow'); 
		$('#videoPlayer').addClass("videoPlayer");
		$('#videoPlayer').attr("src", v.videoURL);
		$('body').css('overflow','hidden');
	}
	return v;
}

$(document).on('touchend, mouseup', function(e) {
	if ($('#overlay').is(e.target)) {
		$('#videoPlayer, #overlay').fadeOut('slow');
		$('#videoPlayer').attr('src', '');
		$('#videoPlayer').removeClass('videoPlayer');
		$('body').css('overflow', 'inherit');
	}
});