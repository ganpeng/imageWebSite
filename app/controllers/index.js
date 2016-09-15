'use strict'

const Tag = require('../models/tag')
const co = require('co')

exports.index = (req, res) => {
	co(function* () {
		let tags = yield Tag.find({}).exec()

		res.render('index.html', {
			tags : tags,
			user : req.user,
			title : '首页'
		})

	})
	.catch((err) => {
		console.log(err)
	})
}