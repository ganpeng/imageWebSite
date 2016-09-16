'use strict'

const Tag = require('../models/tag')
const Image = require('../models/image')
const co = require('co')

exports.index = (req, res) => {
	co(function* () {
		let tags = yield Tag.find({}).exec(),

		tagPromiseAll =  tags.map((tag) => {
			return Image.find({ tag : tag._id}).count().exec()
		}),

		tagImages =  yield Promise.all(tags.map((tag) => {
			return Image.find({ tag : tag._id}).exec()
		})),

		tagImagesCount = yield Promise.all(tagPromiseAll)

		res.render('index.html', {
			tags : tags,
			tagCount : tagImagesCount,
			tagImages : tagImages,
			user : req.user,
			title : '首页'
		})

	})
	.catch((err) => {
		console.log(err)
	})
}