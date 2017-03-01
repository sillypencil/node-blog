// module.exports = {
// 	checkLogin: function checkLogin(req, res, next ){
// 		if( !req.session.user ){
// 			req.flash("error", "未登录！");
// 			return res.redirect("/signin");
// 		}
// 		next();
// 	},

// 	checkNotLogin: function checkNotLogin( req, res, next ){
// 		if( req.session.user ){
// 			req.flash("error", "已登录！");
// 			return res.redirect("back"); //返回之前的页面
// 		}
// 		next();
// 	}
// }
module.exports = {
  checkLogin: function checkLogin(req, res, next) {
    if ( req && !req.session.user) {
      req.flash('error', '未登录');
      console.dir({error:"isNotLognin", message:"用户未登录，将重定向至登陆页"}) 
      return res.redirect('/gets');
    }
    next();
  },

  checkNotLogin: function checkNotLogin(req, res, next) {
    if (req && req.session.user) {
      console.dir({error:"isLognin", message:"用户已登录，重定向至上一个页面"})
      req.flash('error', '已登录'); 
      return res.redirect('back');//返回之前的页面
    }
    next();
  }
};