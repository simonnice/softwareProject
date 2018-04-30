// Declaring server startup variables
const express = require('express')
const router = express.Router()

// Route for game view
router.get('/', function (req, res, next) {
  return res.render('game', {title: 'Game'})
})

module.exports = router
