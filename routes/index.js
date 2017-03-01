module.exports = function( app ){
	app.get("/", function(req, res){
		res.redirect("/home");
	});
	app.use("/signup", require("./signup"));
	app.use("/signin", require("./signin"));
	app.use("/signout", require("./signout"));
	app.use("/posts", require("./posts"));
	app.use("/gets", require("./gets"));
	app.use("/blogs", require("./blogs"));
	app.use("/home", require("./home"));
	app.use("/comments", require("./comments"));

	//404 page
	app.use(function(req, res, next){
		res.status(404);
		if(!res.headersSent){
			res.render("404");
		}
		next();
	});
}