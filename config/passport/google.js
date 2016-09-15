'use strict'

const config = require('../')
const path = require('path')

const User = require(path.join(config.root, 'app/models/user'))
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy




module.exports = new GoogleStrategy(
	{
		clientID : config.google.clientID,
		clientSecret : config.google.clientSecret,
		callbackURL : config.google.callbackURL
	},

	(accessToken, refreshToken, profile, done) => {

		process.nextTick(() => {


			User.findOne({ 'google.id' : profile.id }, (err, user) => {

				if (err) {
					return done(err)
				}

				if (user) {
					return done(null, user)
				}

				var newUser = new User()

				newUser.google.id = profile.id
				newUser.google.token = accessToken
				newUser.google.email = profile.email[0].value
				newUser.google.name = profile.displayName


				newUser.save((err) => {

					if (err) {
						return done(err)
					}

					return done(null, newUser)
				})

				console.log(profile)
			})

		})

	}
)