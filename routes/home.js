var express 	= require("express");
var router 		= express.Router();
// var ArticleModel = require("../models/articles");

// var checkLogin 	= require("../middlewares/check").checkLogin;

router.get("/", function(req, res){
	// res.send( req.flash());
	req.flash("success","首页");
	res.render("home");
});

module.exports = router;