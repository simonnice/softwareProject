// Module for creating my model for
// The databases Users. This will include a hashing function for extra security
// when storing the users password, so that it is not stored in plain text.

// Adding some requirements for each key.
// Including its type,
// if it needs to be unique or not,
// if it is required for a document to be created or not,
// and to trim all unnecesarry whitespace if inputted incorrectly in form.

const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }

})

// Adding a method to the schema by using .statics on mongoose. Calling the method authenticate
// It will hold the logic for authentication when loggin in.
UserSchema.statics.authenticate = async function (name, password, callback) {
  try {
    const user = await User.findOne({name: name})
    bcrypt.compare(password, user.password, function (error, result) {
      if (result === true) {
        return callback(null, user)
      } else {
        return callback(error)
      }
    })
  } catch (err) {
    return callback(err)
  }
}

// Adding bcrypt encryption to new users password before exporting User.
// Utilizing method .pre on UserSchema we can do something with the data before sending it
// First argument 'save' means we want to save the result in this function to the User object.
// using bCrypts hash-method to enable hashing on user.password with 10 runs of the algorithm.
// returns next with error to error middleware or sets user.password to new encrypted
// version in hash and calls next middleware

UserSchema.pre('save', function (next) {
  let user = this
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err)
    } else {
      user.password = hash
      next()
    }
  })
})
// finally, sets User to a model of the UserSchema and exports it
let User = mongoose.model('User', UserSchema)
module.exports = User
