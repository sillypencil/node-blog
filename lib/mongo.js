var config = require("config-lite");
var Mongolass = require("mongolass");
var mongolass = new Mongolass();
var moment = require("moment");
var objectIdToTimestamp = require("objectid-to-timestamp");
mongolass.connect(config.mobgodb);

exports.User = mongolass.model("User",{
	username	: { type: "string" },
	nickName 	: { type: "string" },
	password	: { type: "string" },
	avator		: { type: "string" },
	gender 		: { type: "string", enum: ["m", "f", "x"] },
	bio 		: { type: "string" }	
});
// exports.User.index({ username: 1}, { unique: true }).exec();//根据用户名找到用户，用户名全局唯一

exports.Article = mongolass.model("Article",{
	author: { type: Mongolass.Types.ObjectId },
	title: { type: "string" },
	content: { type: "string" },
	pv: { type: "number" },
});
// exports.Article.index({ author: 1, _id: -1 }).exec() //按创建时间降序查看用户的文章列表

exports.Blogs = mongolass.model("Blogs",{
	author: { type: Mongolass.Types.ObjectId },
	authorName: { type: "string" },
	title: { type: "string" },
	content: { type: "string" },
	createTime: { type: "string"},
	updateTime: { type: "string"},
	thumbnail: { type: "string"},
	pv: { type: "number" },
});

exports.Comment = mongolass.model("Comment", {
	author: { type: Mongolass.Types.ObjectId },
	content: { type: "string"},
	blogId: { type: Mongolass.Types.ObjectId }
});

exports.Comment.index({ blogId: 1, _id: 1}).exec(); //通过文章Id获取该文章所有留言，按创建时间升序
exports.Comment.index({ author: 1, _id: 1}).exec(); //通过用户id和留言id删除留言


//添加插件，根据id生成创建时间created_at
mongolass.plugin("addCreatedAt",{
	afterFind: function( results ){
		results.forEach(function( item ){
			item.created_at = moment(objectIdToTimestamp(item._id)).format("YYYY-MM-DD HH:mm");
		});
		return results;
	},
	afterFindOne: function( result ){
		if(result){
			result.created_at = moment(objectIdToTimestamp(result._id)).format("YYYY-MM-DD HH:mm");
		}
		return result;		
	}
})

exports.User.index({ username: 1}, { unique: true }).exec();//根据用户名找到用户，用户名全局唯一
// exports.Article.index({ author: 1, _id: -1 }).exec() //按创建时间降序查看用户的文章列表
exports.Blogs.index({ author: 1, _id: -1 }).exec() //按创建时间降序查看用户的文章列表
