var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;

// GET /signout 登出
router.get('/', checkLogin, function(req, res, next) {
	//清空session
	delete req.session.user;
	req.flash("success", "登出成功");
	console.log("登出成功");
	res.redirect("/gets");
});

module.exports = router;