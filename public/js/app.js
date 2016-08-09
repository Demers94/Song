$(function(){
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

		$.post('/download', {
			url: url,
			title: title,
			artist: artist,
		}, function(res){
			console.log(res);
		});

		return false;
	});
});