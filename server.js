var express = require('express');  
var mongoose = require('mongoose');
var app = express();
var _ = require('underscore');

mongoose.connect('mongodb://localhost/library');


app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});
app.use(app.router);
app.use(express.static('app'));
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));


var VideosSchema = new mongoose.Schema({
	videoSrc: String,
	name: String,
	list: [{ name: String, time: Number, duration: Number, confidence: Number } ]
});

var Videos = mongoose.model('Videos', VideosSchema, 'videos'); 

app.get('/transcription/', function(req, res) {
	return Videos.find({}, 'name id', function(err, video) {
		return (!err && video) ? res.send(video) : console.log(err);
	}, {_id: 1});
})

app.get('/transcription/:id', function(req, res) {
	return Videos.findById(req.params.id, function(err, video) {
		return (!err && video) ? res.send(video.list) : console.log(err);
	});
})

app.put('/transcription/:id', function(req, res) {
	Videos.findById(req.params.id, function (err, video) {
		video.list = req.body;
		return video.save(function (err) { 
			return (err) ? console.log(err) : console.log("saved")
		});
	});
})

app.get('/video/:id', function(req, res) {
	return Videos.findOne({_id: req.params.id}, 'videoSrc', function(err, video) {
		console.log(video);
		return (!err && video) ? res.send(video) : console.log(err);
	});
});

app.post('/video/:id', function(req, res) {
	Videos.findById(req.params.id, function (err, video) {
		video.videoSrc = req.body.videoSrc;
		console.log(req.body);
		console.log(video.videoSrc)
		return video.save(function (err) { 
			return (err) ? console.log(err) : console.log("saved")
		});
	});
})


console.log("Server listening on port 4000");
app.listen(4000);
