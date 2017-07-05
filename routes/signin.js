var express = require('express');
var router = express.Router();
var sha1 = require("sha1");

var UserModel = require("../models/users")
var checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signin 登录页
router.get('/', checkNotLogin, function(req, res, next) {
	res.render("signin");
});

// POST /signin 用户登录
router.post('/', checkNotLogin, function(req, res, next) {
	var username = req.fields.username;
	var password = req.fields.password;
	console.dir(req.fields)
	try{
		if( username === "" ) throw new Error("用户名不能为空！");
		if( password === "" ) throw new Error("密码不能为空！");
	} catch( e ){
		req.flash( "error", e.message );
		res.redirect("back");
	}
	UserModel.getUserByUsername( username )
		.then(function( user ){
			// console.dir(user);
			var result = {};
			if( !user ){
				req.flash("error", "用户不存在!");
				console.log("用户不存在!");
				result.error = 1;
				result.message = "用户不存在";
				// res.send( result );
				// return res.redirect("back");
			}

			//密码校验
			else if( sha1(password) !== user.password ){
				req.flash("error", "用户名或密码错误");
				console.log("用户名或密码错误");
				result.error = 1;
				result.message = "用户名或密码错误";
				// res.send( result );
				// return res.redirect("back");
			}
			else{
				req.flash("success", "登陆成功");
				console.log("登陆成功");
				delete user.password;
				req.session.user = user;
				result.error = 0;
				result.message = "登录成功！";
			}
			res.send( result );
		})

		.catch(next);
});

module.exports = router;