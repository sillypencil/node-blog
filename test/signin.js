var path = require('path');
var assert = require('assert');
var request = require('supertest');
var app = require('../app');
var User = require('../lib/mongo').User;

describe("signin", function(){
	var agent = request.agent(app);
	beforeEach( function(done){
		 // 创建一个用户
		User.create({
		username: 'testUsername@c',
		password: '123456',
		avatar: '',
		gender: 'x',
		bio: ''
		})
		.exec()
		.then(function () {
		done();
		})
		.catch(done);
  	});
	afterEach(function( done ){
		//删除用户
		User.remove({username: "testUsername@c"})
			.exec()
			.then(function(){
				done();
			})
			.catch(done);
	});

	//账号为空
	it("null username", function(done){
		agent
			.post("/signin")
			.type("form")
			.field({ username: '' })
			.redirects()
			.end(function(err, res){
				if( err ) return done(err);
				assert(res.text.match(/用户名不能为空！/), "null username 测试出错" + res.text );
				done();
			});
	})
});