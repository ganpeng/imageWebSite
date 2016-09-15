'use strict'

const LocalStrategy = require('passport-local').Strategy
const co = require('co')
const config = require('../')
const path = require('path')
const User = require(path.join(config.root, 'app/models/user'))



exports.localSignUp = new LocalStrategy(
	{
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	},

	(req, email, password, done) => {
		co(function* () {


			let emailExists = yield User.findOne({ email : email }).exec(),
				usernameExists = yield User.findOne({ username : req.body.username }).exec(),
				newUser;

			if (emailExists) {
				return done(null, false, req.flash('signUpMessage', '邮箱已经被注册了'))
			}

			if (usernameExists) {
				return done(null, false, req.flash('signUpMessage', '用户名已经存在了'))	
			}

			newUser = new User()
			newUser.email = email
			newUser.username = req.body.username
			newUser.password = yield newUser.encryptPassword(password, (yield newUser.makeSalt()))

			yield newUser.save()

			return done(null, newUser)
		})
		.catch((err) => {
			return done(err)
		})


	}
)


exports.localLogin = new LocalStrategy(


	{
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true

	},

	(req, email, password, done) => {
		co(function* () {
			let user = yield User.findOne({ email : email }).exec();

			if (!user) {
				return done(null, false, req.flash('loginMessage', '用户不存在'))
			}

			if (!(yield user.comparePassword(password, user.password))) {
				return done(null, false, req.flash('loginMessage', '用户密码错误'))
			}

			return done(null, user)
		})
		.catch((err) => {
			return done(err)
		})
	}

)

