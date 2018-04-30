// Declaring server variables
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const flash = require('connect-flash')
const bodyParser = require('body-parser')
const session = require('express-session')
const ExpressValidator = require('express-validator')

// Declaring helper variables
const path = require('path')

// Adding a route for static files
app.use(express.static(path.join(__dirname, '/public')))

// Use Express Session Middleware for storing session!
app.use(session({
  secret: 'examination-2',
  resave: true,
  saveUninitialized: false
}))

// Adding Connect Flash Middleware
app.use(flash())

// Adding Express Messages Middleware
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// Express Validator Middleware
app.use(ExpressValidator({
  errorFormatter: function (param, msg, value) {
    let namespace = param.split('.')
    let root = namespace.shift()
    let formParam = root

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']'
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    }
  }

}))

// Declaring a variable through res.locals that will be accessible in all views.
// This currentUser variable will be used to define certain layouts depending on
// if user is a registered user or not. I will be using the previously set session.userId as a reference.
// Doing the same with currentUserName variable to hold username

app.use(function (req, res, next) {
  res.locals.currentUser = req.session.userId
  res.locals.currentUserName = req.session.userName
  next()
})

// Parsing incoming requests
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// Declaring parameter for port
const port = 3000

// Testing mongoDB connection to my cloud server
mongoose.connect('mongodb://sb22ix:flippanmymmlan15@ds161833.mlab.com:61833/softwareproject')
let db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
console.log(mongoose.connection.readyState)

// Setting up view engine
// and 'views' to represent '/root/views'
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, '/views'))

// Including routes
let routes = require('./routes/index')
let loginRoute = require('./routes/login')
let logoutRoute = require('./routes/logout')
let gameRoute = require('./routes/game')
let registerRoute = require('./routes/register')

// Use routes
app.use('/', routes)
app.use('/game', gameRoute)
app.use('/register', registerRoute)
app.use('/login', loginRoute)
app.use('/logout', logoutRoute)

// Adding 404 error catcher
app.use(function (req, res, next) {
  let err = new Error('File Not Found')
  err.status = 404
  next(err)
})

// 500 general error catcher
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}

  })
})

app.listen(port, function () {
  console.log('Server is running at port 3000')
})
