var Story = require('./story.model');
var jwt = require('jsonwebtoken');

function getPseudoFromToken(token) {
    var decoded;
    if (token) {
        decoded = jwt.verify(token, '§%p3r3c4570r§%');
    }
    if (decoded && decoded.pseudo) {
        return decoded.pseudo;
    }
    return null;
}

exports.getUserStories = function(token, callback) {
    var pseudo = getPseudoFromToken(token);
    if (pseudo) {
        Story.list(pseudo, callback);
    }
};


exports.getStory = function(token, id, callback) {
    var pseudo = getPseudoFromToken(token);
    if (pseudo) {
        Story.get(pseudo, id, callback);
    }
};

exports.addStory = function(token, name, isPublic, callback) {
    var pseudo = getPseudoFromToken(token);
    if (pseudo && name) {
        Story.add(pseudo, name, isPublic, checkAdd(callback));
    }
};

function checkAdd(callback) {
    return function(err, data) {
        if (err) {
            if (err.code == 'ConditionalCheckFailedException') {
                callback(null, false);
            }
            else {
                callback(err);
            }
        }
        else {
            callback(null, data);
        }
    };
}

exports.updateStory = function(token, id, name, isPublic, callback) {
    var pseudo = getPseudoFromToken(token);
    if (pseudo && id) {
        Story.update(pseudo, id, name, isPublic, callback);
    }
};

exports.deleteStory = function(token, id, callback) {
    var pseudo = getPseudoFromToken(token);
    if (pseudo && id) {
        Story.delete(pseudo, id, callback);
    }
};
