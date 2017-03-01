var express = require('express');
var router = express.Router();
var ArticleModel = require("../models/articles");

var checkLogin = require('../middlewares/check').checkLogin;

// POST /posts 发表一篇文章
router.post('/newArticle', checkLogin, function(req, res, next) {
  // res.send(req.flash());
  var author = req.session.user._id;
  var title = req.fields.title;
  var content = req.fields.content;

  try{
  	if(!title.length){
  		throw new Error("请填写标题");
  	}
  	if(!content.length){
  		throw new Error("请填写内容")
  	} 
  }catch( e ){
  	req.flash("error", e.message );
  }
  var article = {
  	author: author,
  	title: title,
  	content: content,
  	pv: 0
  }
  ArticleModel.create( article )
  	.then(function( result ){
  		post = result.ops[0];
  		console.log("发表成功！")
  		req.flash("success", "发表成功！");
  		res.redirect( `/gets/oneArticle/${article._id}` );
  	})
  	.catch( next );
});


// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, function(req, res, next) {
  res.send(req.flash());
});


// POST /posts/:postId/comment 创建一条留言
router.post('/:postId/comment', checkLogin, function(req, res, next) {
  res.send(req.flash());
});


module.exports = router;