var path = require('path');
var assert = require('assert');
var request = require('supertest');
var app = require('../app');
var User = require('../lib/mongo').User;

describe('signup', function() {
  describe('POST /signup', function() {
    var agent = request.agent(app);//persist cookie when redirect
    beforeEach(function (done) {
      // 创建一个用户
      User.create({
        username: 'testUsername',
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

    afterEach(function (done) {
      // 清空 users 表
      User.remove({username: { $in:["testUsername","nswbm"]}})
        .exec()
        .then(function () {
          done();
        })
        .catch(done);
    });

    // 用户名错误的情况
    it.skip('wrong name', function(done) {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'a.jpg'))
        .field({ username: '' })
        .redirects()
        .end(function(err, res) {
          if (err) return done(err);
          assert(res.text.match(/账号长度限制在1-16个字符/), "wrong nam 测试出错" + res.text);
          done();
        });
    });

    // 性别错误的情况
    it.skip('wrong gender', function(done) {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'a.jpg'))
        .field({ username: 'testUsername', gender: 'a' })
        .redirects()
        .end(function(err, res) {
          if (err) return done(err);
          assert(res.text.match(/性别只能选择“男，“女”或者“保密”/), "wrong gender 测试出错" + res.text);
          done();
        });
    });
    // 个人简介大于140个字符
    it.skip("bio too long", function( done ){
    	agent
    		.post("/signup")
    		.type("form")
    		.attach("avatar", path.join(__dirname, "a.jpg"))
    		.field( {username:"testUsername", gender: "m", bio:"qwertyuiopasdfghjklz qwertyuiopasdfghjklz qwertyuiopasdfghjklz qwertyuiopasdfghjklz qwertyuiopasdfghjklz qwertyuiopasdfghjklz qwertyuiopasdfghjklz qwertyuiopasdfghjklz " })
    		.redirects()
    		.end(function( err, res ){
    			if( err ) return done( err );
    			assert( res.text.match(/个人简介请限制在140字符以内/), "bio too long 测试出错" + res.text);
    			done();
    		});
    });

    //密码太短
    it.skip("password too short", function( done ){
    	agent
	        .post("/signup")
			.type("form")
			.attach("avatar", path.join(__dirname, "a.jpg"))
			.field( {username:"testUsername", gender: "m", bio:"noder", password:"123" })
			.redirects()
	        .end(function(err, res) {
				if (err) return done(err);
				assert(res.text.match(/密码至少6个字符/), "password too short 测试出错" + res.text);
				done();
        });
    });

    //两次输入密码不一致
    it.skip("repassword differ from password", function( done ){
    	agent
	        .post("/signup")
			.type("form")
			.attach("avatar", path.join(__dirname, "a.jpg"))
			.field( {username:"testUsername", gender: "m", bio:"noder", password:"123456", repassword: "1234567" })
			.redirects()
      .end(function(err, res) {
				if (err) return done(err);
				assert(res.text.match(/两次输入密码不一致/), "repassword differ from password 测试出错" + res.text);
				done();
        });
    });

    // 用户名被占用的情况
    it.skip("duplicate username", function( done ){
      agent
          .post("/signup")
      .type("form")
      .attach("avatar", path.join(__dirname, "a.jpg"))
      .field( {username:"testUsername", gender: "m", bio:"noder", password:"123456", repassword: "123456" })
      .redirects()
      .end(function(err, res) {
        if (err) return done(err);
        assert(res.text.match(/用户名已被占用/), "duplicate username 测试出错" + res.text);
        done();
        });
    });

    注册成功的情况
    it.skip('success', function(done) {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'a.jpg'))
        .field({ username: 'nswbm', gender: 'm', bio: 'noder', password: '123456', repassword: '123456' })
        .redirects()
        .end(function(err, res) {
          if (err) return done(err);
          assert(res.text.match(/注册成功/), "success 测试出错"+ res.text);
          done();
        });
    });
  });
});