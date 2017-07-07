var express 	= require("express");
var router 		= express.Router();
var BlogModel = require("../models/blogs");
var CommentModel = require("../models/comments");

var checkLogin 	= require("../middlewares/check").checkLogin;

//文章列表
router.get("/", function(req, res){
	// res.send( req.flash());
	var author = req.query.author;
	BlogModel.getBlogs( author )
		.then(function( blogs){
			res.render("blogs",{
				blogs: blogs
			});
		})
		// .catch(next);
	// res.render("blogs");
});

// GET /posts/create 发表文章页
router.get('/create', checkLogin, function(req, res, next) {
  // res.send(req.flash());
  res.render("create");
});

// GET /获取某一篇文章
router.get('/one/:blogId', function(req, res, next) {
	var blogId = req.params.blogId;
	// console.log("blogId: "+ blogId);
	Promise.all([
		BlogModel.getBlogById( blogId ),
		CommentModel.getComments( blogId ), //获取该文章所有留言
		BlogModel.incPv( blogId )  //pv+1
	])  
	.then( function( result ){
		var blog = result[0];
		var comments = result[1];
		if(!blog){
			// console.log("文章不存在");
			throw new Error("该文章不存在");
		}
		res.render("oneBlog", {
			blog: blog,
			comments: comments
		})
		.catch(next);
	});
});

router.post("/create", checkLogin, function(req, res, next){
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
  var blog = {
  	author: author,
  	title: title,
  	content: content,
  	pv: 0
  }
  BlogModel.create( blog )
  	.then(function( result ){
  		post = result.ops[0];
  		console.log("发表成功！");
  		req.flash("success", "发表成功！");
  		res.redirect( `/blogs/one/${blog._id}` );
  	})
  	.catch( next );
});

//跳转到修改文章页面
router.get("/edit/:blogId", checkLogin, function(req, res, next){
	// res.send("get edit");
	var blogId = req.params.blogId;
	var author = req.session.user._id;
	BlogModel.getRawBlogById( blogId )
		.then(function( blog ){
			if(! blog ){
				throw new Error("该文章不存在");
			}
			if( author.toString() !== blog.author._id.toString() ){
				throw new Error("您不是本文章的作者，无法对此文章进行修改 ！");
			}
			res.render("edit", {
				blog: blog
			});
		})
		.catch(next);
});

//更新文章
router.post("/edit/:blogId", checkLogin, function(req, res, next){
	// res.send("post edit");
	var blogId = req.params.blogId;
	var author = req.session.user._id;
	var title = req.fields.title;
	var content = req.fields.content;

	BlogModel.updateBlogById( blogId, author, {title:title, content: content})
		.then(function(){
			req.flash("success", "文章编辑成功!");
			res.redirect(`/blogs/${blogId}`);
		})
		.catch(next);
});

router.get("/remove/:blogId", checkLogin, function(req, res, next){
	var blogId = req.params.blogId;
	var author = req.session.user._id;

	BlogModel.deleteBlogById(blogId, author)
		.then(function(result){
			// console.dir(result);
			req.flash("success", "删除文章成功!");
			res.redirect("/blogs");
		})
		.catch(next);
});

module.exports  = router; 