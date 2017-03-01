var marked = require("marked");
var Comment = require("../lib/mongo").Comment;

Comment.plugin("contentToHtml", {
	afterFind: function( comments ){
		return comments.map( function( comment ){
			comment.content = marked( comment.content );
			return comment;
		});
	}
});

module.exports = {
	create: function create( comment ){
		return Comment.create( comment ).exec();
	},
	//通过一条评论的Id删除该评论
	deleteCommentById: function deleteCommentById( commentId, author ){
		return Comment.remove({ author: author, _id: commentId }).exec();
	},
	//删除一篇文章下的所有评论
	deleteCommentByBlogId: function deleteCommentByBlogId( blogId ){
		return Comment.remove({ blogId: blogId }).exec();
	},
	//获取一篇文章下的所有评论
	getComments: function getComments( blogId ){
		return Comment
			.find( { blogId: blogId })
			.populate({ path: "author", model: "User" })
			.sort({ _id: 1 })
			.addCreatedAt()
			.contentToHtml()
			.exec();
	},
	//获取评论数
	getCommentsCount: function getCommentsCount( blogId ){
		return Comment.count({ blogId: blogId }).exec();
	}
}