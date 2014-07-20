module.exports = Controller.extend({
	init: function(req, res){
		this._super(req, res);
		var _self = this;
		var auth = new Auth(req, res);
		return auth.permission('admin', 'index', function(results){
			if(results){
				return _self.render("admin", {title: "Chat real time - admin"});
			}
			return res.redirect("/error");
		});
	}
});