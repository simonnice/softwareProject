let expect = require('chai').expect;
 
let Score = require('../models/score');

let factories = require('./factories')

let sinon = require('sinon')
 
describe('Testing Score model validation', function() {
    it('should be invalid if score is empty', function(done) {
        let scoreInvalidEmpty = new Score();
      
        scoreInvalidEmpty.validate(function(err) {
            expect(err.errors.score).to.exist;
            done();
        });
    });

    it('should be invalid if user is empty', function(done) {
        let mockModelScoreNoUser = factories.inValidScoreNoUser()
        let scoreInvalid = new Score(mockModelScoreNoUser)
        

        scoreInvalid.validate(function(err){
            expect(err.errors.user).to.exist
            done()
        })
    }),


    it('should be invalid if userId is empty', function(done) {
        let mockModelScoreNoUserId = factories.inValidScoreNoUserId()
        let scoreInvalid = new Score(mockModelScoreNoUserId)
        

        scoreInvalid.validate(function(err){
            expect(err.errors.userId).to.exist
            done()
        })
    })

});




