$(function(){

	var socket = io();

	$('form').on('submit', function(){
		var $url = $('#url');
		var $title = $('#title');
		var $artist = $('#artist');

		var url = $url.val();
		var title = $title.val();
		var artist = $artist.val();

		$url.val('');
		$title.val('');
		$artist.val('');

		socket.emit('download song', {
			url: url,
			title: title,
			artist: artist,
		});

		return false;
	});

	socket.on('download finished', function(data){
		var $notification = $('.notification');
		$notification.text('The song "' + data.title + '" has finished downloading.');

		$notification.fadeIn();
		setTimeout(function(){
			$notification.fadeOut();
		}, 4000);
	});
});