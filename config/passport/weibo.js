'use strict'


const config = require('../')
const path = require('path')


const User = require(path.join(config.root, 'app/models/user'))
const WeiboStrategy = require('passport-weibo').Strategy



module.exports = new WeiboStrategy(
	{

		clientID : config.weibo.clientID,
		clientSecret : config.weibo.clientSecret,
		callbackURL : config.weibo.callbackURL
	},

	(accessToken, refreshToken, profile, done) => {

		User.findOne({ 'weibo.id' : profile.id }, (err, user) => {
			if (err) {
				return done(err)
			}

			if (user) {
				return done(null, user)
			}

			var newUser = new User()

			newUser.weibo.id = profile.id


			newUser.save((err) => {
				if (err) {
					return done(err)
				}

				return done(null, newUser)
			})

			console.log(profile)
		})

	}
)