module.exports = {
	init: function(req, res){
		var sess = req.session;
		sess.destroy();
		return res.redirect('/login');
	},
}