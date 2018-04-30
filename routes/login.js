const express = require('express')
const router = express.Router()
let User = require('../models/user')

// Adding route for login view
router.get('/', function (req, res, next) {
  return res.render('login', {title: 'Login'})
})

// Adding POST route for passing user credentials for logging in.
router.post('/', function (req, res, next) {
  // First we check if email and password is filled in.
  req.checkBody('username', 'User name is required!').notEmpty()
  req.checkBody('password', 'Password is required!').notEmpty()

  // Get the errors
  let errors = req.validationErrors()

  // If there are errors, make this exception
  if (errors) {
    res.render('login', {
      errors: errors
    })
  }
  // Else, If they match, we call the authenticate method on the User.
  User.authenticate(req.body.username, req.body.password, function (error, user) {
    // If error or not a legit user we pass an error
    if (error || !user) {
      let err = new Error('Wrong email or password.')
      err.status = 401
      return next(err)
      // else we set the sessions userID to match the _id of the mongo user
    } else {
      req.session.userId = user._id
      req.session.userName = user.name
      req.flash('Success', `You are logged in as ${req.session.userName}`)
      return res.redirect('/profile')
    }
  })
})

module.exports = router
