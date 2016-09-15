'use strict'

const config = require('../')

const path = require('path')
const co = require('co')

const User = require(path.join(config.root, 'app/models/user'))
const FacebookStrategy = require('passport-facebook').Strategy


module.exports = new FacebookStrategy(

	{
		clientID : config.facebook.clientID,
		clientSecret : config.facebook.clientSecret,
		callbackURL : config.facebook.callbackURL
	},

	(accessToken, refreshToken, profile, done) => {
		co(function* () {

			console.log(accessToken)
			console.log(refreshToken)
			console.log(profile)

			let user = yield User.findOne({ 'facebook.id': profile.id }).exec(),
				newUser;

			if (!user) {
				newUser = new User()
				newUser.facebook.id = profile.id
		        newUser.facebook.name = profile.displayName
		        newUser.facebook.email = profile.emails[0].value
		        newUser.facebook.token = accessToken
		        yield newUser.save()
		        return done(null, newUser)
			}

			return done(null, user)

		})
		.catch((err) => {
			return done(err)
		})
	}

)

