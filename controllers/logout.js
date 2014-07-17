module.exports = Controller.extend({
	init: function(req, res){
		this._super(req, res);
		var sess = req.session;
		sess.destroy();
		return res.redirect('/login');
	},
});