'use strict'

const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const Schema = mongoose.Schema
const config = require('../../config')
const path = require('path')


const TagSchema = new Schema({
	title : {
		type : String,
		required : true,
		uniqued : true,
		trim : true
	},

	desc : {
		type : String,
		default : ''
	},

	poster : {
		type : String,
		default : '/images/tagDefaultImage.png'
		// required : true
	},

	createAt : {
		type : Date,
		default : Date.now
	}
})



const Tag = mongoose.model('Tag', TagSchema)

module.exports = Tag