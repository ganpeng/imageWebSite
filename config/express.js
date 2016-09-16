'use strict'

const compression = require('compression')
const express = require('express')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const nunjucks = require('nunjucks')
const moment = require('moment')
const multer = require('multer')


const config = require('./')


const accessLogStream = fs.createWriteStream(path.join(config.root, 'logs/access.log'), { flags: 'a' })

const publicDir = path.join(config.root, 'public')

module.exports = (app, passport) => {

    let env = app.get('env')

    app.use(compression())

    app.use(express.static(publicDir))


    nunjucks.configure(path.join(config.root, 'app/views'), {
        autoescape : true,
        express : app,
        noCache : true
    })



    if (env === 'development') {
        app.use(morgan('dev'))
    } else if (env === 'production') {
        app.use(morgan('combined', { stream: accessLogStream }))
    }

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    app.use(cookieParser())

    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        store : new MongoStore({
        	url : config.db 
        })
    }))


    // passport认证登录
    app.use(passport.initialize())
    app.use(passport.session())

    app.use(flash())

   	if (env === 'development') {
   		app.locals.pretty = true
   	} 

    // 挂载库
    app.locals.moment = moment
    app.locals.stringify = JSON.stringify
    app.locals.parse = JSON.parse

}
