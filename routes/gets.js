var express 	= require("express");
var router 		= express.Router();
var ArticleModel = require("../models/articles");

var checkLogin 	= require("../middlewares/check").checkLogin;

router.get("/", function(req, res){
	// res.send( req.flash());
	res.render("home");
});
//文章列表
router.get("/articles", function(req, res){
	// res.send( req.flash());
	var author = req.query.author;
	ArticleModel.getArticles( author )
		.then(function( articles){
			res.render("articles",{
				articles: articles
			});
		})
		// .catch(next);
	// res.render("articles");
});

// GET /posts/create 发表文章页
router.get('/create', checkLogin, function(req, res, next) {
  // res.send(req.flash());
  res.render("create");
});

// GET /
router.get('/oneArticle/:articleId', function(req, res, next) {
	var articleId = req.params.articleId;
	console.log("articleId: "+ articleId);
	Promise.all([
		ArticleModel.getArticleById( articleId ),
		ArticleModel.incPv( articleId )
	])  
	.then( function( result ){
		var article = result[0];
		if(!article){
			// console.log("文章不存在");
			throw new Error("该文章不存在");
		}
		res.render("articles", {
			articles: [article]
		})
		.catch(next);
	});
});


// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, function(req, res, next) {
  res.send(req.flash());
});



// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, function(req, res, next) {
  res.send(req.flash());
});


// GET /posts/:postId/comment/:commentId/remove 删除一条留言
router.get('/:postId/comment/:commentId/remove', checkLogin, function(req, res, next) {
  res.send(req.flash());
});

module.exports  = router; 
