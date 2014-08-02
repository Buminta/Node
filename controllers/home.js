module.exports = Controller.extend({
	init: function(req, res){
		this._super(req, res);
	},
	index: function(){
		var sess = this.req.session;
		if (sess.loginID == undefined) {
			return this.res.redirect('/login');
		}
		this.render("home", {title: "Chat real time", username: this.req.session.username});
	}
});