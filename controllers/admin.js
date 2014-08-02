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
	},
	managerusers: function(){
		var _self = this;
		var auth = new Auth(this.req, this.res);
		return auth.permission('admin', 'managerusers', function(results){
			if(results){
				var model = _self.newDB("users");
				if(_self.req.query.delete){
					model.deleteUser(_self.req.query.delete);
					return _self.res.redirect('/admin/managerusers');
				}
				if(_self.req.query.user, _self.req.query.password){
					var md5 = require('MD5');
					model.updateUser({id: _self.req.query.user, password: md5(_self.req.query.password)});
					return _self.res.redirect('/admin/managerusers');
				}
				model.getAllUser(function(results){
					return _self.render("admin_managerusers", {title: "Chat real time - admin", menu: _self.menu, list: results});
				});
			}
			else return _self.res.redirect("/error");
		});
	},
	managerrooms: function(){
		var _self = this;
		var auth = new Auth(this.req, this.res);
		return auth.permission('admin', 'managerrooms', function(results){
			if(results){
				var model = _self.newDB("rooms");
				if(_self.req.query.delete){
					model.deleteRoom(_self.req.query.delete);
					return _self.res.redirect('/admin/managerrooms');
				}
				if(_self.req.query.delete_msg){
					var manager = _self.req.query.delete_msg.split("_")[0];
					var id = _self.req.query.delete_msg.split("_")[1];
					model.findRoom(manager, function(results){

						var msgs = results.msgs;
						msgs.splice(id, 1);
						model.updateRoom(manager, msgs);
						return _self.res.redirect('/admin/managerrooms?manager='+manager);
					});
				}
				if(_self.req.query.manager){
					model.findRoom(_self.req.query.manager, function(results){
						return _self.render("admin_managerrooms_msgs", {title: "Chat real time - admin", menu: _self.menu, room: _self.req.query.manager, list: results.msgs});
					});
				}
				if(_self.req.query.new_room  && _self.req.query.new_room != ""){
					model.addRoom({name: _self.req.query.new_room, msgs: []}, function(){
						return _self.res.redirect('/admin/managerrooms');
					});
				}
				else model.findRoom(false, function(results){
					return _self.render("admin_managerrooms", {title: "Chat real time - admin", menu: _self.menu, list: results});
				});
			}
			else return _self.res.redirect("/error");
		});
	},
	filter: function(){
		var _self = this;
		var auth = new Auth(this.req, this.res);
		return auth.permission('admin', 'filter', function(results){
			if(results){
				var model = _self.newDB("filter");
				if(_self.req.query.delete){
					model.deleteFilter(_self.req.query.delete);
					return _self.res.redirect('/admin/filter');
				}
				else if(_self.req.query.new_filter && _self.req.query.new_filter != ""){
					model.addFilter({word: _self.req.query.new_filter});
					return _self.res.redirect('/admin/filter');
				}
				else model.findFilter(function(results){
					_self.render("admin_filter", {title: "Chat real time - admin", menu: _self.menu, list: results});
				});
			}
		});
	}
});