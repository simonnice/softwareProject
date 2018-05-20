// Module for creating my model for
// The databases personal high scores. 

// Adding some requirements for each key.
// Including its type,
// if it needs to be unique or not,
// if it is required for a document to be created or not,
// and to trim all unnecesarry whitespace if inputted incorrectly in form.

const mongoose = require('mongoose')
const scoreSchema = new mongoose.Schema({
  score: {
    type: Number,
    required: true,
    trim: true
  },

  user: {
      type: String,
      required: true
  },
  userId: {
      type: String,
      required: true
  }
})

scoreSchema.statics.findUserHighScore = async function(userId, callback) {
    let score = await Score.find({userId: userId})
    return score
}

scoreSchema.statics.displayGlobalHighScore = async function() {
   const scores = await Score.find({})

   scores.sort((a, b) => b.score - a.score)

   return scores
}

// Adding a method to the schema by using .statics on mongoose. Calling the method validateScore
// It will hold the logic for checking if user already has a highScore when logging a new one
scoreSchema.statics.validateScore = async function (userId, score, callback) {
    try {
      const name = await Score.findOne({userId: userId})

      console.log(`Logging name in validateScore ${name.user}`)
      
        if ( name.userId === userId ) {
            return callback(null, name)
          
        } else {
            return callback(error)
        }

    } catch (err) {
      return callback(err)
    }
  }

  scoreSchema.statics.updateHighestScore = async function(newScore, userId, callback) {
      try {
          const oldScore = await Score.findOne({userId: userId})

          console.log(oldScore.user)
          console.log(`Logging new score ${newScore} `)
          console.log(`Logging old score ${oldScore.score} `)
          

        if (oldScore.score < newScore) {
            console.log(`Finding the old score document and setting ${newScore}`)
            
            await Score.findOneAndUpdate({userId: userId}, { $set: { score: newScore }}, {new: true}, function(err, doc) {
                if(err){
                    console.log('Something wrong when updating data!')
                }
                console.log(`Score after findOneAndUpdate ${doc}`)
                return callback(null, doc)
            })
            
        } else {
            return callback(null, oldScore.score)
        }

        

      } catch (err) {
          return callback(err)
      }
  }


// finally, sets User to a model of the UserSchema and exports it
let Score = mongoose.model('Score', scoreSchema)
module.exports = Score