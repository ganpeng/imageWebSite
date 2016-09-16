'use strict'
const Promise = require('bluebird');
const fs = require('fs');
const unlink = Promise.promisify(fs.unlink);
const exists = Promise.promisify(fs.exists);
const co = require('co')
const sizeOf = require('image-size');

const Image = require('../models/image')
const Tag = require('../models/tag')

exports.list = (req, res) => {

	co(function*() {

		let images = yield Image.find({ creator : req.user._id }).exec(),
			tags = yield Tag.find({}).exec()

		res.render('imageList.html', {
			user : req.user,
			flag : 'imageList',
			images : images,
			tags : tags
		})	

	})
	.catch((err) => {
		console.log(err)
	})

}



exports.createImage = (req, res) => {
	co(function*() {
		let image = new Image(),
			relateUrl = `${__dirname}/../../public/upload/${req.file.filename}`

		image.creator = req.body.creator
		image.title = req.body.title
		image.desc = req.body.desc
		image.tag = req.body.tag
		image.url = req.file.filename
		image.width = (yield promiseSizeOf(relateUrl)).width
		image.height = (yield promiseSizeOf(relateUrl)).height

		yield image.save()

		res.redirect('/image/list')

	})
	.catch((err) => {
		console.log(err)
	})
}


exports.delete = (req, res) => {

	co(function*() {
        let id = req.params.id,
            image = yield Image.findOne({ _id : id}).exec(),
            imageUrl = image.url,
            relateUrl = `${__dirname}/../../public/upload/${imageUrl}`,
            fileExists = yield promiseExists(relateUrl);

        if (fileExists) {
            yield unlink(relateUrl);
        }
        yield Image.findByIdAndRemove({ _id : id }).exec();
        res.redirect('/image/list');
	})
	.catch((err) => {
		console.log(err)
	})
}

exports.images = (req, res) => {

	co(function*() {

		let images = yield Image.find({}).exec()


		res.json({
			success : 0,
			data : {
				images : images
			}
		})
	})
	.catch((err) => {
		console.log(err)
	})

}



function promiseExists(path) {
    return new Promise((resolve, reject) => {
        fs.exists(path, (e) => {
            console.log(e);
            resolve(e);
        })
    })
}


function promiseSizeOf(path) {
	return new Promise((resolve, reject) => {
		sizeOf(path, (err, dimensions) => {
			if (err) {
				reject(err)
			}
			resolve(dimensions)
		})
	})
}