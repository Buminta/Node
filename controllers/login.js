module.exports = Controller.extend({
	init: function(req, res){
		this._super(req, res);
		var sess = req.session;
		var _self = this;
		if (sess.loginID != undefined) {
			return res.redirect('/');
		}
		if(req.body.username != undefined){
			this.check(req.body.username, req.body.password, function(result){
				if(result === true){
					_self.getUserID(req.body.username, function(id){
						sess.loginID = id;
						sess.username = req.body.username;
						sess.save();
						if(_self.req.query.goback) return res.redirect(_self.req.query.goback);
						return res.redirect('/');
					});
				}
				else{
					error = result;
					_self.render("login", {title: "Chat real time - login", error: error});
				}
			});
		}
		else{
			this.render("login", {title: "Chat real time - login"});
		}
	},
	getUserID: function(username, callback){
		var model = this.newDB("users");
		model.findUser(username).toArray(function(err, result){
			callback(result[0]._id);
		});
	},
	check: function(username, password, callback){
		var md5 = require('MD5');
		var model = this.newDB("users");
		model.findUser(username, md5(password)).count(function(err, result){
			if(!result) callback("Username or password wrong");
			else callback(true);
		});
		return true;
	}
});