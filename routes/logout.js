
const express = require('express')
const router = express.Router()

// Adding GET route for logout
// Checks if a session exists and destroys it if so.
// then returns user to home page
router.get('/', function (req, res, next) {
  if (req.session) {
    req.session.destroy(function (err) {
      if (err) {
        return next(err)
      } else {
        return res.redirect('/')
      }
    })
  }
})

module.exports = router
