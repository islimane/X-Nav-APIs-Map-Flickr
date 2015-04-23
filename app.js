var map;

jQuery(document).ready(function() {
	map = L.map('map').locate({setView: true, maxZoom: 16});

	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 18
	}).addTo(map);

	function onLocationFound(e) {
		var radius = e.accuracy / 2;

		L.marker(e.latlng).addTo(map)
		    .bindPopup("You are within " + radius + " meters from this point").openPopup();

		console.log(e.latlng);

		L.circle(e.latlng, radius).addTo(map);
	}

	map.on('locationfound', onLocationFound);

	function onLocationError(e) {
		alert(e.message);
	}

	map.on('locationerror', onLocationError);

	$( "#text" ).keyup(function( event ) {
		var items = [];
		$(".suggestions").empty();
		var place = $("#text").val();
		var url = "http://nominatim.openstreetmap.org/search?format=json&limit=5&q=" + place;
		$.getJSON(url, function(data){
			for (i in data) {
				var tag = '"' + data[i].display_name + '"';
				$("<li><a class='location' href='#' onclick='setMarker(" + data[i].lat + "," + data[i].lon + "); getPictures(" + tag + ")'>" + data[i].display_name + "</a></li>").appendTo(".suggestions");
			}
		});
	});
});

function setMarker(lat, lng){
	L.marker([lat, lng]).addTo(map);
	var location = new L.LatLng(lat, lng);
    map.panTo(location);
    map.setZoom(20);

};

function getPictures(tag){
	$("#images").empty();
	console.log("getPictures");
  	var about = tag;
	var tags = tag;

	console.log(tag);

	var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?tags=" + about + "&tagmode=any&format=json&jsoncallback=?";
	$.getJSON( flickerAPI, {
		tags: tags,
		tagmode: "any",
		format: "json"
	})
	.done(function( data ) {
		$.each( data.items, function( i, item ) {
			console.log("new Picture");
			$("<img src=" + item.media.m  + ">").appendTo( "#images" );
			if ( i === 3 ) {
				return false;
			}
		});
	});
  };