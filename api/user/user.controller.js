var jwt = require('jsonwebtoken');

var User = require('./user.model');

exports.login = function(pseudo, mdp, callback) {
    User.get(pseudo, verifyCredentials(mdp, callback));
}

function verifyCredentials(password, callback) {
    return function(err, data) {
        if (err) {
            callback(err);
        } else {
            if (data && data.password == password) {
            	// sign with default (HMAC SHA256) ->>>>> TODO use key file
                var token = jwt.sign({
                	pseudo: data.pseudo
                }, '§%p3r3c4570r§%');
                callback(null, {
                    token: token
                });
            } else {
                callback(null, false);
            }
        }
    }
}