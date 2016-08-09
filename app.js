var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

var fs = require('fs');
var ytdl = require('ytdl-core');
var ffmpeg = require('fluent-ffmpeg');
var ffmetadata = require("ffmetadata");

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/download', function(req, res){
	var url = req.body.url;
	var title = req.body.title;
	var artist = req.body.artist;

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
				res.sendStatus(200);
			});			
		})
		.save(filepath);
});

app.listen(7777);