// Declaring server startup variables
const express = require('express')
const router = express.Router()
let mid = require('../middleware/index')

// Route for index view
router.get('/', function (req, res, next) {
  return res.render('index', {title: 'Home'})
})

// Adding route for Profile view
router.get('/profile', mid.requiresLogin, async function (req, res, next) {
  try {
    res.render('profile', {title: 'Profile'})
  } catch (err) {
    return next(err)
  }
})

module.exports = router
