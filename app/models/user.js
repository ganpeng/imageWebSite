'use strict'


const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const Promise  = require('bluebird')
const bcrypt = require('bcryptjs')

const genSalt = Promise.promisify(bcrypt.genSalt)
const compare = Promise.promisify(bcrypt.compare)
const hash = Promise.promisify(bcrypt.hash)

const Schema = mongoose.Schema

const UserSchema = new Schema({

	username : {
		type : String,
		required : true,
		trim : true,
		unique : true
	},

	password : {
		type : String,
		required : true
	},

	email : {
		type : String,
		required : true,
		unique : true
	},

	headerIcon : {
		type : String,
		default : ''
	},
	// 用户角色
	// 0 : 普通用户
	// 10 : 管理员
	role : {
		type : Number,
		default : 0
	},

	createAt : {
		type : Date,
		default : Date.now
	},

	facebook : {
		id : {
			type : String,
			default : ''
		},

		email : {
			type : String,
			default : ''
		},

		name : {
			type : String,
			default : ''
		},

		token : {
			type : String,
			default : ''
		}
	},

	google : {
		id : {
			type : String,
			default : ''
		},

		email : {
			type : String,
			default : ''
		},

		name : {
			type : String,
			default : ''
		},

		token : {
			type : String,
			default : ''
		}
	},

	weibo : {
		id : {
			type : String,
			default : ''
		},

		
	}
})


UserSchema.methods = {

	encryptPassword(password, salt) {
		return hash(password, salt)
	},

	makeSalt() {
		return genSalt(10)
	},

	comparePassword(password, hash) {
		return compare(password, hash)
	}

}


const User = mongoose.model('User', UserSchema)

module.exports = User

