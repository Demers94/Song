$(function(){

	var socket = io();

	$('form').on('submit', function(){
		var $url = $('#url');
		var $title = $('#title');
		var $artist = $('#artist');

		// Get the inputs values.
		var url = $url.val();
		var title = $title.val();
		var artist = $artist.val();

		// Make sure that we have something to send to the converter.
		if(!url.length || !title.length){
			return false;
		}

		// Clear the inputs for the next song.
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

	// A download has finished, show the notification.
	socket.on('download finished', function(data){
		notify('The song "' + data.title + '" has finished downloading');
	});

	/**
	 * Create a Web Notification to tell the user the download is complete.
	 * @param  {string} message 
	 * @return {void}         
	 */
	function notify(message){
		Notification.requestPermission().then(function(result) {
			if(!result == 'granted'){
				return;
			}

			var notification = new Notification('Download complete', {
				body: message,
				icon: 'http://www.freeiconspng.com/uploads/accept-tick-icon-12.png',
			});
		});
	}
});