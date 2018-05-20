
// Factories for Score Model creation
module.exports.validScore = function() {
    return {
        score: 45,
        user: 'Emilio',
        userId: 'dd1212d12d'
    }
}

module.exports.inValidScoreNoUser = function() {
    return {
        score: 45,
        userId: 'dd1212d12d'
    }
}

module.exports.inValidScoreNoUserId = function() {
    return {
        score: 45,
        user: 'Simon'
    }
}

// Factories for User Model creation
module.exports.validUser = function() {
    return {
        email: 'valid_email@bestemail.com',
        name: 'Simon',
        password: 'validpassword'
    }
}

module.exports.inValidUserNoEmail = function() {
    return {
        name: 'Simon',
        password: 'validpassword'
    }
}

module.exports.inValidUserNoName = function() {
    return {
        email: 'valid_email@bestemail.com',
        password: 'validpassword'
    }
}

module.exports.inValidUserNoPassword = function() {
    return {
        email: 'valid_email@bestemail.com',
        name: 'Simon'
    }
}