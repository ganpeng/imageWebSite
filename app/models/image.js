'use strict'

const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId


const ImageSchema = new Schema({
	creator : {
		type : ObjectId,
		ref : 'User'
	},

	title : {
		type : String,
		// required : true,
		trim : true
	},
	width : {
		type : Number
	},

	height : {
		type : Number
	},

	desc : {
		type : String,
		trim : true,
		default : ''
	},

	url : {
		type : String,
		// required : true,
		trim : true
	},

	tag : {
		type : Schema.Types.ObjectId,
		ref : 'Tag'
	},

	createAt : {
        type : Date,
        default : Date.now
    },

    updateAt : {
        type : Date,
        default : Date.now
    }
})


ImageSchema.pre('save', (next) => {
	if (this.isNew) {
		this.createAt = this.updateAt = Date.now
	} else {
		this.updateAt = Date.now
	}
	next()
})


const Image = mongoose.model('Image', ImageSchema)


module.exports = Image
