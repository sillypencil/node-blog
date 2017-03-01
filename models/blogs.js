var marked = require("marked");
var Blogs = require("../lib/mongo").Blogs;
var CommentModel = require("./comments");

module.exports = {
	//创建文章
	create: function create( blog ){
		return Blogs.create( blog ).exec();
	},
	//通过文章Id获取文章
	getBlogById: function getBlogsById( blogId ){
		return Blogs
			.findOne({ _id: blogId})
			.populate({ path: "author", model:"User"})
			.addCreatedAt()
			.addCommentCount()
			.contentToHtml()
			.exec();
	},
	
	//通过文章ID获取一片原生文章(用于编辑)
	getRawBlogById: function getRawBlogById( blogId ) {
		return Blogs
			.findOne({ _id: blogId})
			.populate({ path: "author", model:"User"})
			.exec();
	},

	//更新一篇文章
	updateBlogById: function updateBlogById(blogId ,author){
		return Blogs.update({ author: author, _id: BlogId}, { $set: data}).exec();
	},

	//删除文章
	deleteBlogById: function deleteBlogById(blogId ,author){
		return Blogs.remove({ author: author, _id: blogId }).exec()
			.then(function ( res ){
				if( res.result.ok && res.result.n > 0 ){
					return CommentModel.deleteCommentByBlogId( blogId );
				}
			});
	},

	//按照时间降序获取所有用户文章或者某个特定用户的所有文章
	getBlogs: function getBlogs( author ){
		var query = {};
		if( author ){
			query.author = author;
		}
		return Blogs
			.find(query)
			.sort({ _id: -1})
			.addCreatedAt()
			.addCommentCount()
			.contentToHtml()
			.exec()
	},

	//通过文章id给pv +1
	incPv: function incPv( blogId ){
		return Blogs
			.update({ _id: blogId }, { $inc:{ pv: 1 }})
			.exec();
	},

}

Blogs.plugin("contentToHtml",{
	afterFind: function( blogs ){
		return blogs.map( function(blog){
			blog.content = marked( blog.content );
			return blog;
		});
	},
	afterFindOne: function( blog ){
		if( blog ){
			blog.content = marked( blog.content );
			return blog;
		}
	}
});

Blogs.plugin("addCommentCount", {
	afterFind: function( blogs ) {
		return Promise.all( blogs.map( function(blog){
			return CommentModel.getCommentsCount( blog._id ).then(function(commentsCount){
				blog.commentsCount = commentsCount;
				return blog;
			})
		}));	
	},

	afterFindOne: function( blog ){
		if( blog ){
			return CommentModel.getCommentsCount( blog._id ).then(function( count ){
				blog.commentsCount = count;
				return blog;
			});
		}
		return blog;
	}
})