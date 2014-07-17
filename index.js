var express = require("express");
var session = require('express-session');
var mongo = require('mongodb'),
  Server = mongo.Server,
  Db = mongo.Db;

var server = new Server('127.0.0.1', 27017, {auto_reconnect: true});
var db = new Db('chatnode', server, {safe:false});

const KEY = 'express.sid'
  , SECRET = '1234567890QWERTY';

var app = express();

var port = 3000;
var fs = require('fs');
function include(file_) {
    with (global) {
        eval(fs.readFileSync(file_) + '');
    };
};

db.open(function(err, db) {
	db = db;
});

include(__dirname + '/libs/class.js');
include(__dirname + '/libs/controller.js');
include(__dirname + '/libs/model.js');

app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
app.use(session({secret: SECRET}));
app.use(function(req,res,next){
	req.db = db;
   	next();
});


var controllerFolder = "/controllers/";
 
app.set('views', __dirname + '/views');
app.set('view engine', "jade");
app.engine(	'jade', require('jade').__express);

app.all(["/", "/:controller"], function(req, res){
	var controller = req.param('controller');
	
	if(controller == undefined || controller == "/" || controller == ""){
		controller = "home";
	}
	try{
		var classController = require(__dirname + controllerFolder + controller +".js");
		return new classController(req, res);
	}
	catch(err){
		console.log(err);
		res.render("error", {code: "404"});
	}
});

var io = require('socket.io').listen(app.listen(port));

var rooms = ['Begining'];

io.sockets.on('connection', function (socket) {
	socket.username = "No name";
	socket.on('addroom', function(data){
		var newroom = "Room by "+ socket.username;
		if (rooms.indexOf(newroom) == -1) rooms.push(newroom);
		io.sockets.emit('updaterooms', rooms, socket.room);
	});

	socket.on('sendchat', function (data) {
		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
	});
	
	socket.on('switchRoom', function(username, newroom){
		socket.username = username;
		socket.leave(socket.room);
		socket.join(newroom);
		socket.emit('updatechat', 'SERVER', {msg: 'you have connected to '+ newroom});
		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', {msg: socket.username+' has left this room'});
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('updatechat', 'SERVER', {msg: socket.username+' has joined this room'});
		socket.emit('updaterooms', rooms, newroom);
	});
	socket.on('disconnect', function(){
		
	});
});