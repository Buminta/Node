Chat = {
	username: undefined,
	socket: io.connect('http://localhost:3000'),
	init: function(username){
		var _self = this;
		this.socket.on('connect', function(){
			_self.updateRoom();
			_self.updateChat();
			_self.switchRoom("Begining");
		});
		this.username = username;
	},
	updateRoom: function(){
		this.socket.on('updaterooms', function(rooms, current_room) {
			$('#rooms').empty();
			$.each(rooms, function(key, value) {
				if(value == current_room){
					$('#rooms').append('<div>' + value + '</div>');
				}
				else {
					$('#rooms').append('<div><a href="#" onclick="Chat.switchRoom(\''+value+'\')">' + value + '</a></div>');
				}
			});
		});
	},
	switchRoom: function(room){
		$('#content').html('');
		this.socket.emit('switchRoom', this.username, room);
	},
	updateChat: function(){
		this.socket.on('updatechat', function (username, data) {
			$('#content').append('<b>'+username + ':</b> <span style="color: '+data.color+'; font-weight: '+data.style+'">' + data.msg + '</span><br>');
		});
	},
	addRoom: function(){
		this.socket.emit('addroom', null);
	},
	send: function(message){
		this.socket.emit('sendchat', message);
	}
}