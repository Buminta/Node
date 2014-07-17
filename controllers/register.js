module.exports = Controller.extend({
	init: function(req, res){
		this._super(req, res);
		var sess = req.session;
		if (sess.loginID != undefined) {
			return res.redirect('/');
		}
		error = false;
		if(req.query.username != undefined){
			var result = this.check(req.query);
			if(result === true)
				if(this.addUser(req.query.username, req.query.password)) return res.redirect('/login');
			else error = result
		}
		this.render("register", {title: "Chat real time - register", error: error});
	},
	addUser: function(user, pass){
		var md5 = require('MD5');
		var model = this.newDB('users');
		model.addUser({username: user, password: md5(pass)});
		return false;
	},
	check: function(vars){
		var model = this.newDB('users');
		if(vars.username.length <=0) return "Missing username!";
		if(model.findUser(vars.username)) return "Username is used";
		if(vars.password != vars.cf_password) return "Password wrong!";
		else if(vars.password.length <= 0) return "Password length >= 1";
		return true;
	}
});