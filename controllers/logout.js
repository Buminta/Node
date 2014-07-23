module.exports = Controller.extend({
	init: function(req, res){
		this._super(req, res);
	},
	index: function(){
		var sess = this.req.session;
		sess.destroy();
		return this.res.redirect('/login');
	}
});