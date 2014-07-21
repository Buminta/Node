module.exports = Controller.extend({
	init: function(req, res){
		this._super(req, res);
		var _self = this;
		this.menu = [];
		var auth = new Auth(this.req, this.res);
		if (this.req.session.loginID) auth.listPermisstion(function(results){
			if(results){
				_self.menu = results;
			}
		});
	},
	index: function(){
		var _self = this;
		var auth = new Auth(this.req, this.res);
		return auth.permission('admin', 'index', function(results){
			if(results){
				return _self.render("admin", {title: "Chat real time - admin", menu: _self.menu});
			}
			else return _self.res.redirect("/error");
		});
	}
});