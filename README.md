Node listening with port 3000
```
Chat Real time with NodeJS, Socket.IO, ExpressJS, Jade Template
Create room chat and join to any room
Using demo MVC lite, with Express JS
```

Listening MongoDB
``` javascript
var server = new Server('127.0.0.1', 27017, {auto_reconnect: true});
var db = new Db('chatnode', server, {safe:false});
```

Restore database MongoDB for demo
```
	from "./database/chatnode"
	user/password: admin/123456
```