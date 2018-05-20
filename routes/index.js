// Declaring server startup variables
const express = require('express')
const router = express.Router()
let mid = require('../middleware/index')
let Score = require('../models/score')

// Route for index view
router.get('/', function (req, res, next) {
  return res.render('index', {title: 'Home'})
})

// Adding route for Profile view
router.get('/profile', mid.requiresLogin, async function (req, res, next) {
  try {
    let userScore = await Score.findUserHighScore(req.session.userId)
    console.log(userScore.length)

    if(userScore.length === 0) {
      res.render('profile', {title: 'Profile'})
    } else {
      res.render('profile', {title: 'Profile', highScore: userScore})
    }
    
  } catch (err) {
    return next(err)
  }
})

module.exports = router
