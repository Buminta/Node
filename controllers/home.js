module.exports = Controller.extend({
	init: function(req, res){
		this._super(req, res);
		var sess = req.session;
		if (sess.loginID == undefined) {
			return res.redirect('/login');
		}
		this.render("home", {title: "Chat real time", username: sess.username});
	}
});