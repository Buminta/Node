module.exports = {
	init: function(req, res){
		var sess = req.session;
		if (sess.loginID == undefined) {
			return res.redirect('/login');
		}
		res.render("home", {title: "Chat real time", username: Usersname[sess.loginID]});
	}
}