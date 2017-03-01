var marked = require("marked");
var Article = require("../lib/mongo").Article;

module.exports = {
	//创建文章
	create: function create( article ){
		return Article.create( article ).exec();
	},
	//通过文章Id获取文章
	getArticleById: function getArticleById( id ){
		return Article
			.findOne({ _id: id})
			.populate({ path: "author", model:"User"})
			.addCreatedAt()
			.contentToHtml()
			.exec();
	},
	//按照时间降序获取所有用户文章或者某个特定用户的所有文章
	getArticles: function getArticles( author ){
		var query = {};
		if( author ){
			query.author = author;
		}
		return Article
			.find(query)
			.sort({ _id: -1})
			.addCreatedAt()
			.contentToHtml()
			.exec()
	},

	//通过文章id给pv +1
	incPv: function incPv( articleId ){
		return Article
			.update({ _id: articleId }, { $inc:{ pv: 1 }})
			.exec();
	}
}

Article.plugin("contentToHtml",{
	afterFind: function( articles ){
		return articles.map( function(article){
			article.content = marked( article.content );
			return article;
		});
	},
	afterFindOne: function( article ){
		if( article ){
			article.content = marked( article.content );
			return article;
		}
	}
})