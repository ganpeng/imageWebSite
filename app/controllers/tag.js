'use strict'

const Promise = require('bluebird')
const fs = require('fs')
const unlink = Promise.promisify(fs.unlink);
const exists = Promise.promisify(fs.exists);
const co = require('co')

const Tag = require('../models/tag')



exports.tagList = (req, res) => {

	co(function*() {

		let tags = yield Tag.find({}).exec()

		res.render('tagList.html', {
			user : req.user,
			flag : 'tagList',
			tags : tags
		})	

	})
	.catch((err) => {
		console.log(err)
	})

}

exports.createTag = (req, res) => {
	co(function*() {
		let tag = new Tag()

		tag.title = req.body.title
		tag.desc = req.body.desc
		tag.poster = req.file.filename

		yield tag.save()

		res.redirect('/tag/list')

	})
	.catch((err) => {
		console.log(err)
	})
}

exports.tagDelete = (req, res) => {

	co(function*() {
        let id = req.params.id,
            tag = yield Tag.findOne({ _id : id}).exec(),
            tagUrl = tag.poster,
            relateUrl = `${__dirname}/../../public/upload/${tagUrl}`,
            fileExists = yield promiseExists(relateUrl);

        if (fileExists) {
            yield unlink(relateUrl);
        }
        yield Tag.findByIdAndRemove({ _id : id }).exec();
        res.redirect('/tag/list');
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