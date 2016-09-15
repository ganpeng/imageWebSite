'use strict'

const path = require('path')

module.exports = {
	root : path.join(__dirname, '..'),
	db : 'mongodb://localhost/loveDr',
	facebook : {
		clientID : '625181637651072',
		clientSecret : '63a096b18d03f01e01d8a8b54236404a',
		callbackURL : 'http://localhost:5250/auth/facebook/callback'
	},
	google : {
		clientID : '690368314471-3c6cbf9fn4ugv7hik055iq7k8fa9hml7.apps.googleusercontent.com',
		clientSecret : 'eFYrvHjhdSCE2mo2H3lUE-Js',
		callbackURL : 'http://localhost:5250/auth/google/callback'
	}
	// weibo : {
	// 	clientID : '',
	// 	clientSecret : '',
	// 	callbackURL : 'http://localhost:5250/auth/weibo/callback'
	// }
}