'use strict'

const User = require('../models/user')

const co = require('co')


exports.logout = (req, res) => {
	req.logout()
	res.redirect('/')
}


exports.index = (req, res) => {
	res.render('index.html', {
		title : '首页',
		user : req.user
	})
}



exports.showLogin = (req, res) => {

	res.render('login.html', {
		title : '登录',
		messages : req.flash('loginMessage')
	})
}


exports.showSignUp = (req, res) => {

	res.render('signup.html', {
		title : '注册',
		messages : req.flash('signUpMessage')
	})
}


exports.profile = (req, res) => {

	res.render('profile.html', {
		title : '用户',
		user : req.user,
		flag : 'profile'
	})
}


exports.userList = (req, res) => {
	co(function* () {

		let users = yield User.find({}).exec()

		res.render('userList.html', {
			titel : '用户列表',
			users : users,
			user : req.user,
			flag : 'userList'
		})
	})
	.catch((err) => {
		console.log(err)
	})
}

exports.deleteUser = (req, res) => {
	co(function* () {
		yield User.findByIdAndRemove(req.params.id).exec()		
		res.redirect('/admin/user/list')
	})
	.catch((err) => {
		console.log(err)
	})
}
