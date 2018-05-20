const express = require('express')
const router = express.Router()
let Score = require('../models/score')

router.post('/', function(req, res, next) {
    if (!req.body.score) {
            console.log('No score')
            let err = new Error('No score in req body')
            err.status = 401
            return next(err)
        
    }

    let score = parseInt(req.body.score)

    let scoreData = {
        score : score, 
        user : req.session.userName,
        userId: req.session.userId
    }

    Score.validateScore(req.session.userId, score, async function(error, name) {
        if (name) {
            
            console.log('User already has a previous score')
            console.log('Sending latest score' + score)
            await Score.updateHighestScore(score, req.session.userId, function(error, latestScore){
                console.log('Done!')
                
            })

        } else {
            
            console.log('User is new, adding a new score!')
            Score.create(scoreData, function (error, score) {

                if (score.user = null){
                    console.log('No valid user logged in')
                }
                if (error) {
                  error = new Error('Error')
                  error.status = 400
                  return next(error)
                } else {
                
                  console.log('Score submitted to mongo DB')
                  res.send({success: true})
                } 
            })
        }
    })

    
}) 
   




module.exports = router