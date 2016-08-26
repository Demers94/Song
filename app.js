var express = require('express');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

// Packages for the download/conversion
var fs = require('fs');
var ytdl = require('ytdl-core');
var ffmpeg = require('fluent-ffmpeg');
var ffmetadata = require("ffmetadata");

// BodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//---------------------------------------------------------
// Socket IO.
//---------------------------------------------------------
io.on('connection', function(socket){

	socket.on('download song', function(data){
		var url = data.url;
		var title = data.title;
		var artist = data.artist;

		if(!title || !title.length || typeof title == 'undefined'){
			title = 'default_name_' + (new Date().getTime());
		}

		var stream = ytdl(url);	
		var filepath = __dirname + '/songs/' + title + '.mp3';

		ffmpeg(stream)
			.format('mp3')
			.on('end', function(){
				var data = {
					artist: artist,
				};

				ffmetadata.write(filepath, data, function(err) {
					socket.emit('download finished', {title: title});
				});			
			})
			.save(filepath);
	});
});

server.listen(7777);