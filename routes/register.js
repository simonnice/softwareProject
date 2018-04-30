const express = require('express')
const router = express.Router()

let User = require('../models/user')

// Adding route for Register / Sign up view
router.get('/', function (req, res, next) {
  return res.render('register', {title: 'Sign up'})
})

// Adding POST route for Register when adding user
router.post('/', function (req, res, next) {
  // Using express validator to check if fields are filled in
  req.checkBody('email', 'Email is required!').notEmpty()
  req.checkBody('username', 'User name is required!').notEmpty()
  req.checkBody('password', 'Password is required!').notEmpty()
  req.checkBody('confirmPassword', 'Confirm your password!').notEmpty()

  // Get the errors
  let errors = req.validationErrors()

  // If there are errors, make this exception
  if (errors) {
    res.render('register', {
      errors: errors
    })
  }
  // Check for if passwords match
  if (req.body.password !== req.body.confirmPassword) {
    let err = new Error('Passwords do not match!')
    err.status = 400
    return next(err)
  }
  // Regex check for valid email
  if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email)) {
    let err = new Error('Invalid email!')
    err.status = 400
    return next(err)
  }

  // Else, creating an object with the form input to send into my model creator
  // in user.js. This basically represents the document in Mongo.
  let userData = {
    email: req.body.email,
    name: req.body.username,
    password: req.body.password
  }

  // Using mongoose create() method to insert document into mongo.
  // Redirecting to profile page when successful.
  User.create(userData, function (error, user) {
    if (error) {
      error = new Error('A user with that username or email already exists.')
      error.status = 400
      return next(error)
    } else {
      req.session.userId = user._id
      req.session.userName = user.name
      req.flash('Success', 'User created!')
      return res.redirect('/profile')
    }
  })
})

module.exports = router
