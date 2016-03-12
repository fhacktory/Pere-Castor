var jwt = require('jsonwebtoken');

var User = require('./user.model');

exports.login = function(pseudo, mdp, callback) {
    User.get(pseudo, checkCredentials(mdp, callback));
};

function checkCredentials(password, callback) {
    return function(err, data) {
        if (err) {
            callback(err);
        }
        else {
            if (data && data.password == password) {
                signJWT(data.pseudo, callback);
            }
            else {
                callback(null, 0);
            }
        }
    };
}

exports.signup = function(pseudo, password, email, mainStory, callback) {
    User.create(pseudo, password, email, mainStory, checkInscription(pseudo, callback));
};

function checkInscription(pseudo, callback) {
    return function(err, data) {
        if (err) {
            if (err.code == 'ConditionalCheckFailedException') {
                callback(null, 1);
            }
            else {
                callback(err);
            }
        }
        else {
            signJWT(pseudo, callback);
        }
    };
}

function signJWT(pseudo, callback) {
    var token = jwt.sign({
        pseudo: pseudo
    }, '§%p3r3c4570r§%');
    callback(null, {
        token: token
    });
}