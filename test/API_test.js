
const request = require('supertest')
const { expect } = require('chai')

const server = request.agent('http://localhost:3000')

// Send empty request expecting failure
describe('POST /register', () => {
    it('Responds with error', done => {
        server
          .post('/register')
          .set('Accept', 'application/json')
          .send({})
          .end((err, response) => {
              if(err) console.log(err)
              expect(response.status).to.equal(401)
              done()
          })
    })

    it('Responds with error text: Passwords do not match!', done => {
        server
          .post('/register')
          .set('Accept', 'application/json')
          .send({
             
              email: 'test@test.com',
              username: 'testuser',
              password: 'testpass',
              confirmPassword: 'testpassIncorrect' // incorrect password match
              
          })
          .end((err, response) => {
              if(err) console.log(err)
              expect(response.text).to.equal(`{"error":"Passwords do not match!"}`)
              done()
          })
    })

    it('Responds with error text: Invalid email!', done => {
        server
          .post('/register')
          .set('Accept', 'application/json')
          .send({
             
              email: 'testtest.com', // Invalid email
              username: 'testuser',
              password: 'testpass',
              confirmPassword: 'testpass'
              
          })
          .end((err, response) => {
              if(err) console.log(err)
              expect(response.text).to.equal(`{"error":"Invalid email!"}`)
              done()
          })
    })

    it('Responds with error text: A user with that username or email already exists. ', done => {
        server
          .post('/register')
          .set('Accept', 'application/json')
          .send({
             
              email: 'test@test.com',
              username: 'testuser',
              password: 'testpass',
              confirmPassword: 'testpass'
              
          })
          .end((err, response) => {
              if(err) console.log(err)
              expect(response.text).to.equal(`{"error":"A user with that username or email already exists."}`)
              done()
          })
    })
})

describe('POST /submitScore', () => {
    it('Responds with error', done => {
        server
          .post('/submitScore')
          .set('Accept', 'application/json')
          .send({})
          .end((err, response) => {
              if(err) console.log(err)
              expect(response.status).to.equal(401)
              done()
          })
    })
})

describe('POST /login', () => {
    it('Responds with error', done => {
        server
          .post('/login')
          .set('Accept', 'application/json')
          .send({})
          .end((err, response) => {
              if(err) console.log(err)
              expect(response.status).to.equal(401)
              done()
          })
    })
    
    it('Responds with 302 redirect', done => {
        server
          .post('/login')
          .set('Accept', 'application/json')
          .send({
              username: 'testuser',
              password: 'testpass'
          })
          .end((err, response) => {
              if(err) console.log(err)
              expect(response.status).to.equal(302)
              done()
          })
    })

    it('Responds with error text: Wrong username or password.', done => {
        server
          .post('/login')
          .set('Accept', 'application/json')
          .send({
              username: 'testuserWrong', // incorrect username input
              password: 'testpass'
          })
          .end((err, response) => {
              if(err) console.log(err)
              expect(response.text).to.equal(`{"error":"Wrong username or password."}`)
              done()
          })
    })

    it('Responds with error text: Wrong username or password.', done => {
        server
          .post('/login')
          .set('Accept', 'application/json')
          .send({
              username: 'testuser',
              password: 'testpassWrong' // incorrect password input
          })
          .end((err, response) => {
              if(err) console.log(err)
              expect(response.text).to.equal(`{"error":"Wrong username or password."}`)
              done()
          })
    })
    
})