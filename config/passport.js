'use strict'

const config = require('./')
const path = require('path')


const User = require(path.join(config.root, 'app/models/user')) 

const local = require('./passport/local')
const facebook = require('./passport/facebook')
const google = require('./passport/google')
// const weibo = require('./passport/weibo')



module.exports = (passport) => {

	passport.serializeUser((user, cb) => cb(null, user.id))
	passport.deserializeUser((id, cb) => User.findById(id, cb))


	passport.use('local-signup', local.localSignUp)

	passport.use('local-login', local.localLogin)

	passport.use(facebook)
	passport.use(google)
	// passport.use(weibo)

}
