'use strict'

const config = require('./')
const path = require('path')
const uuid = require('node-uuid')

const user = require(path.join(config.root, 'app/controllers/user'))
const image = require(path.join(config.root, 'app/controllers/image'))
const auth = require('./middleware/userAuth')


const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/upload');
  },
  filename: function (req, file, cb) {
      let ext = path.extname(file.originalname),
          newName = uuid() + ext;

    cb(null, newName);
  }
});
const upload = multer({ storage: storage });


module.exports = (app, passport) => {


	app.all('*', (req, res, next) => {


		res.header('Access-Control-Allow-Origin', '*')
		next()

	})

	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*')
		next()
	})

	const pauth = passport.authenticate.bind(passport);

	app.get('/', user.index)

	app.get('/login', user.showLogin)

	app.get('/signUp', user.showSignUp)

	app.post('/signUp', 
		pauth('local-signup',
			{
				successRedirect : '/profile',
				failureRedirect : '/signUp',
				failureFlash : true
			}	
		)
	)

	app.post('/login',
		pauth('local-login', 
			{
				successRedirect : '/profile',
				failureRedirect : '/login',
				failureFlash : true
			}
		)
	)

	app.get('/auth/facebook',
		pauth('facebook',
			{
		      	scope: [ 'email', 'user_about_me'],
				successRedirect : '/profile',
		      	failureRedirect: '/login'
			}
		)
	)

	app.get('/auth/facebook/callback',
		pauth('facebook',
			{
				successRedirect : '/profile',
				failureRedirect : '/login'	
			}
		)

	)

	app.get('/auth/google',
		pauth('google',
			{
		      	scope: ['profile', 'email'],
				successRedirect : '/profile',
		      	failureRedirect: '/login'
			}
		)
	)

	app.get('/auth/google/callback',
		pauth('google',
			{
				successRedirect : '/profile',
				failureRedirect : '/login'	
			}
		)

	)

	app.get('/profile',
		auth.isLogedIn,
		user.profile
	)

	app.get('/logout', user.logout)

	app.get('/admin/user/list', auth.isLogedIn, auth.isAdmin, user.userList)

	app.get('/admin/user/delete/:id', auth.isLogedIn, auth.isAdmin, user.deleteUser)


	app.get('/image/list', auth.isLogedIn, image.list)

    app.route('/image/create')  
        .post(upload.single('imagefile'), image.createImage)

    app.get('/image/delete/:id', auth.isLogedIn, image.delete)


    app.get('/images', image.images)

}