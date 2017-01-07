const socket = io();

document.querySelector('form').addEventListener('submit', (e) => {

	e.preventDefault();

	let $url = document.querySelector('#url');
	let $title = document.querySelector('#title');
	let $artist = document.querySelector('#artist');

	let url = $url.value;
	let title = $title.value;
	let artist = $artist.value;

	// We need the URL of the video
	if(!url || !url.length || !url.trim().length){
		return;
	}

	$url.value = '';
	$title.value = '';
	$artist.value = '';

	socket.emit('download song', {
		url: url,
		title: title,
		artist: artist,
	});
});

socket.on('download finished', data => {
	notify('The song "' + data.title + '" has finished downloading.');
});

function notify(message){
	Notification.requestPermission().then(result => {
		if(!result == 'granted'){
			console.error('You must accept the notifications.')
			return;
		}

		let notification = new Notification('Download complete', {
			body: message,
			icon: 'http://www.freeiconspng.com/uploads/accept-tick-icon-12.png',
		});
	});
}