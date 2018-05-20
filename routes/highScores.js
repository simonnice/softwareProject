const express = require('express')
const router = express.Router()
let User = require('../models/user')
let Score = require('../models/score')

router.post('/', function(req, res) {
    console.log('Highscores called')
    res.send('Whats up')
})

router.get('/', async function (req, res) {
    let highScoreList = await Score.displayGlobalHighScore()
    console.log(`HighScore in route ${highScoreList}`)
    return res.render('highScore', {title: 'High Score', highScoreList: highScoreList})
})
   




module.exports = router