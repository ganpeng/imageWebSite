'use strict'

const config = require('../')
const path = require('path')
const co = require('co')

const User = require(path.join(config.root, 'app/models/user'))

exports.isLogedIn = (req, res, next) => {

	if (req.isAuthenticated()) {
		return next()
	}

	res.redirect('/login')
}

exports.isAdmin = (req, res, next) => {

	if (req.user.role === 0) {
		return next()
	}

	res.redirect('/login')
}