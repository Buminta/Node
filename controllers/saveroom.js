module.exports = Controller.extend({
	init: function(req, res){
		this._super(req, res);
		var sess = req.session;
		var _self = this;
		if(req.body.room != undefined){
			sess.room = req.body.room
			sess.save();
		}
		this.render("content", {content: "OK"});
	}
});