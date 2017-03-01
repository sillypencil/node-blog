var express = require("express");
var checkLogin = require("../middlewares/check").checkLogin;
var CommentModel = require("../models/comments");
var router 		= express.Router();

router.post("/add/:blogId", checkLogin, function( req, res, next ){
	var author = req.session.user._id;
	var blogId = req.params.blogId;
	var content = req.fields.content;
	var comment = {
		author: author,
		blogId: blogId,
		content: content
	};

	CommentModel.create( comment )
		.then( function(){
			req.flash("success", "评论成功!");
			//跳回上一页
			res.redirect("back");
		})
		.catch( next );
})

//删除评论
router.get("/remove/:commentId", function(req, res, next){
	var commentId = req.params.commentId;
	var author = req.session.user._id;

	CommentModel.deleteCommentById( commentId, author )
		.then( function(){
			req.flash("success", "删除评论成功！");
			res.redirect("back");
		})
		.catch( next );
})


module.exports = router;
