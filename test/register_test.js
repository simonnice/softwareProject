let expect = require('chai').expect

// Test suite
describe('User.create', function () {
  // Import UserSchema
  let User = require('../models/user')

  // Dummy user register data
  let userData = {
    email: 'baathen_swe@hotmail.com',
    name: 'Simon',
    password: 'password'
  }

  // Test spec (unit test)
  it('should return true if proper register input', function () {
    expect(User.create(userData, function (error, user) {
      if (error) {
        error = new Error('A user with that username or email already exists.')
        error.status = 400
        return error
      } else {
        return true
      }
    })).to.be.true
  })
})
