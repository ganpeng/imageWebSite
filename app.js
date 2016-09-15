'use strict'


const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const path = require('path')

const config = require('./config')
const port = process.env.PORT || 5250
const env = process.env.NODE_ENV || 'development'


const app = express()


app.set('env', env)

require('./config/passport')(passport)
require('./config/express')(app, passport)
require('./config/router')(app, passport)



connect()
	.on('error', console.log)
	.on('disconnected', connect)
	.once('open', listen)


function listen() {
	app.listen(port, () => {
		console.log(`server started on port ${port}`)
	})
}


function connect() {
	let options = { server: { socketOptions: { keepAlive: 1 } } };
	return mongoose.connect(config.db, options).connection
}


