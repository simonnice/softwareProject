let expect = require('chai').expect;
 
let User = require('../models/user');

let factories = require('./factories')
 
describe('Testing User model validation', function() {
    it('should be invalid if email is empty', function(done) {
        let emailInvalidNoEmail = new User(factories.inValidUserNoEmail());
      
        emailInvalidNoEmail.validate(function(err) {
            expect(err.errors.email).to.exist;
            done();
        });
    });

    it('should be invalid if name is empty', function(done) {
        let emailInvalidNoName = new User(factories.inValidUserNoName());
      
        emailInvalidNoName.validate(function(err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });

    it('should be invalid if password is empty', function(done) {
        let emailInvalidNoPassword = new User(factories.inValidUserNoPassword());
      
        emailInvalidNoPassword.validate(function(err) {
            expect(err.errors.password).to.exist;
            done();
        });
    });
})

