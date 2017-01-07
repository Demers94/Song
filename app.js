const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

// Packages for the download/conversion
const fs = require('fs');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmetadata = require("ffmetadata");

// BodyParser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//---------------------------------------------------------
// Socket IO.
//---------------------------------------------------------
io.on('connection', function(socket){

	socket.on('download song', function(data){
		let url = data.url;
		let title = data.title;
		let artist = data.artist;

		if(!title || !title.length || typeof title == 'undefined'){
			title = 'Song_' + (new Date().getTime());
		}

		let stream = ytdl(url);	
		let filepath = __dirname + '/songs/' + title + '.mp3';

		ffmpeg(stream)
			.format('mp3')
			.on('end', function(){
				let data = {
					artist: artist,
				};

				ffmetadata.write(filepath, data, (err) => {
					socket.emit('download finished', {title: title});
				});			
			})
			.save(filepath);
	});
});

server.listen(7777);