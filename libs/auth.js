Auth = Class.extend({
	init: function(req, res){
		this.db = req.db;
		this.req = req;
		this.res = res;
	},
	permission: function(controller, action, callback){
		var _self = this;
		if(!this.req.session.loginID) return this.res.redirect("/login?goback=/admin");
		return this.getPremission(controller, action, function(results){
			return callback(results)
		});
	},
	getPremission: function(controller, action, callback){
		var _self = this;
		var tmp = require(__dirname + "/models/membership.js");
		var membershipModel = new tmp(this.db);
		var tmp = require(__dirname + "/models/permissions.js");
		var permissionModel = new tmp(this.db);
		return membershipModel.findMembership(this.req.session.loginID, function(groups){
			if(groups){
				var group = groups[0];
				return permissionModel.checkPermission(group.group_id, {controller: controller, action: action}, function(results){
					return callback(results);
				});
			}
			else{
				return callback(false);
			}
		});
	}
});