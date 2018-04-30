// Middleware folder holds the custom middleware I need to perform
// some different functions. This will for example contain a function
// Checking if a person is logged in or not to let them access different parts
// of the page.

function requiresLogin (req, res, next) {
  if (req.session.userId && req.session) {
    return next()
  } else {
    let err = new Error('You do not have access to this page')
    err.status = 403
    return next(err)
  }
}

module.exports.requiresLogin = requiresLogin
