module.exports = Controller.extend({
	init: function(req, res){
		this._super(req, res);
		var sess = req.session;
		if (sess.loginID != undefined) {
			return res.redirect('/');
		}
		error = false;
		var _self = this;
		if(req.body.username != undefined){
			_self.check(req.body, function(result){
				if(result === true){
					_self.addUser(req.body.username, req.body.password);
					return res.redirect('/login');
				}
				else{
					error = result;
					return _self.render("register", {title: "Chat real time - register", error: error});
				}
			});
		}
		else{
			return _self.render("register", {title: "Chat real time - register", error: error});
		}
	},
	addUser: function(user, pass){
		var md5 = require('MD5');
		var model = this.newDB('users');
		return model.addUser({username: user, password: md5(pass)});
	},
	check: function(vars, callback){
		var msg = false;
		if(vars.username.length <=0) msg = "Missing username!";
		else if(vars.password != vars.cf_password) msg = "Password wrong!";
		else if(vars.password.length <= 0) msg = "Password length >= 1";
		var model = this.newDB('users');
		model.findUser(vars.username).count(function(err, result){
			if(result) msg =  "Username is used";
			else msg = true;
			callback(msg);
		});
		return true;
	}
});