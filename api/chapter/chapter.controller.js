var jwt = require('jsonwebtoken');

var Chapter = require('./chapter.model');

exports.getList = function(token, story, callback) {
    var credentials = verifyJWT(token);
    var code = [credentials.pseudo, story].join('|');
    Chapter.getFor(code, function(err, data) {
        if (err) {
            callback(err);
        }
        else {
            callback(data);
        }
    });
};

function verifyJWT(token, callback) {
    var decoded = jwt.verify(token, '§%p3r3c4570r§%');
    return decoded;
}