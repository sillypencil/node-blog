var fs = require("fs");
var path = require("path");
var sha1 = require("sha1");
var express = require('express');
var router = express.Router();

var UserModel = require("../models/users");

var checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signup 注册页
router.get('/', checkNotLogin, function(req, res, next) {
  res.render("signup");
  // res.send("req.flash()");
});

// POST /signup 用户注册
router.post('/', checkNotLogin, function(req, res, next) {
  // res.send(req.flash());
  var result={error:null,success:null,message:null};
  var fields = req.fields;
  var username = fields.username;
  var nickName = fields.nickName;
  // var gender = fields.gender;
  // var bio = fields.bio;
  // var avatar = req.files.avatar.path.split(path.sep).pop();
  var password = fields.password;
  var repassword = fields.repassword;

  //参数校验
  try{
  	if(!(username.length > 0 && username.length <= 16 )){
  		throw new Error("账号长度限制在1-16个字符");
  	}
  	if(nickName.length === 0){
		nickName = "";
	}
  	/*
	 if(["m", "f", "x"].indexOf(gender) === -1 ){
	 throw new Error("性别只能选择“男，“女”或者“保密”" );
	 }
	 if( bio && bio.length > 140 ){
	 throw new Error("个人简介请限制在140字符以内");
	 }
	 */
	  if(password.length < 6){
  		throw new Error("密码至少6个字符");
  	}
  	if(password != repassword ){
  		throw new Error("两次输入密码不一致");
  	}
  } catch( e ){
  	// fs.unlink(req.files.avatar.path);
  	console.log(e.message);
  	req.flash("error", e.message);
    result.error = 1;
    result.message = e.message;
    return res.send(result);
  	// return res.redirect("/signup");
    // return res.send(e.message);
  }

  //密码加密
  password = sha1(password);

  //整理数据
  var user = {
  	username: username,
	nickName: nickName,
  	password: password,
  	// gender: gender,
  	// bio: bio,
  	// avatar: avatar
  }

  //写入数据库
  UserModel.create(user)
  	.then(function( result ){
  		//将user修改为插入mongodb后的值，包含 _id
  		user = result.ops[0];
  		delete user.password;
  		req.session.user = user;
  		req.flash("success", "注册成功");

  		res.redirect("/home");
  	})
  	.catch(function(e){
		console.dir(e);
  		// fs.unlink(req.files.avatar.path);
  		//用户名被占用则跳回注册页，而不是错误页
  		if( e.message.match("E11000 duplicate key")) {
  			req.flash("error", "用户名已被占用");
            var result = { error: 1, message: "用户名已被占用！" };
  			// return res.redirect("/signup");
            return res.send( result );
  		}
  		next( e );
  	})

});

module.exports = router;