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
                callback(null, {
                    token: '1d56f1v6f5d1v56'
                });
            } else {
                callback(null, false);
            }
        }
    }
}