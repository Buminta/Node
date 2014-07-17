module.exports = Controller.extend({
	init: function(req, res){
		this._super(req, res);
		var sess = req.session;
		if (sess.loginID != undefined) {
			return res.redirect('/');
		}
		if(req.query.username != undefined){
			var result = this.check(req.query.username, req.query.password);
			if(result === true){
				sess.loginID = this.getUserID(req.query.username);
				sess.save();
				return res.redirect('/');
			}
			else error = result;
		}
		this.render("login", {title: "Chat real time - login"});
	},
	getUserID: function(username){
		var result = Usersname.indexOf(username);
		return result;
	},
	check: function(username, password){
		var md5 = require('MD5');
		var result = Usersname.indexOf(username);
		if(result == -1) return "Username wrong";
		else if(Usersinfo[result].password != md5(password)) return "Password wrong";
		return true;
	}
});