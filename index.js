var express = require("express");
var mongo = require('mongodb'),
Server = mongo.Server,
Db = mongo.Db;



var server = new Server('127.0.0.1', 27017, {auto_reconnect: true});
var db = new Db('chatnode', server, {safe:false});

const KEY = 'express.sid'
, SECRET = '1234567890QWERTY';

var parseCookie = express.cookieParser(SECRET);
var MemoryStore = express.session.MemoryStore;
var store = new MemoryStore();

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
include(__dirname + '/libs/auth.js');

app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
app.configure(function () {
	app.use(express.cookieParser());
	app.use(express.session({store: store, secret: SECRET, key: KEY}));
});
app.use(function(req,res,next){
	req.db = db;
	next();
});


var controllerFolder = "/controllers/";

app.set('views', __dirname + '/views');
app.set('view engine', "jade");
app.engine(	'jade', require('jade').__express);

app.all("/", function(req, res){
	controller = "home";
	try{
		var classController = require(__dirname + controllerFolder + controller +".js");
		var control = new classController(req, res);
		return control.index();
	}
	catch(err){
		console.log(err.message, err.stack);
		res.render("error", {code: "404"});
	}
});

app.all("/:controller", function(req, res){
	var controller = req.params.controller;
	if(controller == undefined || controller == "/" || controller == ""){
		controller = "home";
	}
	try{
		var classController = require(__dirname + controllerFolder + controller +".js");
		var control = new classController(req, res);
		return control.index();
	}
	catch(err){
		console.log(err.message, err.stack);
		res.render("error", {code: "404"});
	}
});

app.all("/:controller/:action", function(req, res){
	var controller = req.params.controller;
	var action = req.params.action;
	console.log(controller, action);
	
	if(controller == undefined || controller == "/" || controller == ""){
		controller = "home";
	}
	try{
		var classController = require(__dirname + controllerFolder + controller +".js");
		var control = new classController(req, res);
		return control[action]();
	}
	catch(err){
		console.log(err.message, err.stack);
		res.render("error", {code: "404"});
	}
});

app.all("/:controller/:action/:id", function(req, res){
	var controller = req.params.controller;
	var action = req.params.action;
	
	if(controller == undefined || controller == "/" || controller == ""){
		controller = "home";
	}
	try{
		var classController = require(__dirname + controllerFolder + controller +".js");
		var control = new classController(req, res);
		return control[action]();
	}
	catch(err){
		console.log(err.message, err.stack);
		res.render("error", {code: "404"});
	}
});


var io = require('socket.io').listen(app.listen(port));


io.set('authorization', function(handshake, callback) {
	if (handshake.headers.cookie) {
		parseSession(handshake, function(config){
			if(config){
				callback(null, true);
			}
			else{
				callback("Not session.", false);
			}
		});
	} else {
		return callback('No session.', false);
	}
});

function parseSession(handshake, callback){
	parseCookie(handshake, null, function(err) {
		handshake.sessionID = handshake.signedCookies[KEY];
		store.get(handshake.sessionID, function (err, session) {
			if (err || !session) {
				callback(false);
			} else {
				callback(session);
			}
		});	
	});
}

io.sockets.on('connection', function (socket) {
	var hs = socket.handshake;
	parseSession(hs, function(session){
		var tmp = require(__dirname + "/models/rooms.js");
		var roomModel = new tmp(db);
		if(!session.room){
			session.room = "Begining";
		}
		socket.room = session.room;
		socket.join(socket.room);
		roomModel.findRoom(null, function(rooms){
			rooms = [{_id: "Begining", name: "Begining", msgs: []}].concat(rooms);
			roomModel.findRoom(socket.room, function(room){
				var msgs = null;
				if(room) msgs = room.msgs;
				socket.emit('updaterooms', rooms, socket.room, msgs);
			});
		});
		socket.on('addroom', function(data){
			var newroom = "Room by "+ session.username;
			roomModel.findRoom(newroom, function(rooms){
				if (!rooms) {
					roomModel.addRoom({name: newroom, msgs: []}, function(){
						io.sockets.emit('updaterooms', rooms, socket.room, [], false);
					});
				}
				else{
					roomModel.findRoom(null, function(rooms){
						rooms = [{_id: "Begining", name: "Begining", msgs: []}].concat(rooms);
						io.sockets.emit('updaterooms', rooms, socket.room, [], true);
					});
				}
			}, true);
		});

		socket.on('sendchat', function (data) {
			var tmp = require(__dirname + "/models/filter.js");
			var filterModel = new tmp(db);
			filterModel.replaceWord(data.msg, function(msg){
				data.msg = msg;
				io.sockets.in(socket.room).emit('updatechat', session.username, data);
				roomModel.updateMSGRoom(socket.room, {username: session.username, msg: data});
			});
		});
		
		socket.on('switchRoom', function(newroom){
			socket.leave(socket.room);
			socket.join(newroom);
			roomModel.findRoom(newroom, function(room){
				if(room){
					socket.emit('updatechat', 'SERVER', {msg: 'you have connected to '+ room.name});
				}
				else{
					socket.emit('updatechat', 'SERVER', {msg: 'Not find room'});
				}
			});
			socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', {msg: session.username+' has left this room'});
			socket.room = newroom;
			socket.broadcast.to(newroom).emit('updatechat', 'SERVER', {msg: session.username+' has joined this room'});
			roomModel.findRoom(null, function(rooms){
				rooms = [{_id: "Begining",name: "Begining", msgs: []}].concat(rooms);
				roomModel.findRoom(socket.room, function(room){
					var msgs = null;
					if(room) msgs = room.msgs;
					socket.emit('updaterooms', rooms, socket.room, msgs);
				});
			});
		});
		socket.on('disconnect', function () {
			//socket.emit('disconnect');
		});
	});
});