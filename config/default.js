module.exports = {
	port: 3000,
	session: {
		secret: "qs123456",
		key: "node-blog",
		maxAge: 2562000000
	},
	mongodb: "mongodb://localhost:27017/node-blog"
}