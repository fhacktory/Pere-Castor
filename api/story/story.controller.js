var Story = require('./story.model');
var jwt = require('jsonwebtoken');

function getCode(token) {
    try {
        var decoded = jwt.verify(token, '§%p3r3c4570r§%');
    }
    catch (e) {
        return null;
    }
    if (!decoded.pseudo) {
        return null;
    }
    var code = [decoded.pseudo].join('|');
    return code;
}

exports.getUserStories = function(token, callback) {
    var pseudo = getCode(token);
    if (pseudo) {
        Story.list(pseudo, callback);
    }
    else {
        callback(null, 0);
    }
};


exports.getStory = function(token, id, callback) {
    var pseudo = getCode(token);
    if (pseudo) {
        Story.get(pseudo, id, callback);
    }
    else {
        callback(null, 0);
    }
};

exports.addStory = function(token, name, isPublic, index, callback) {
    var pseudo = getCode(token);

    if (pseudo && name) {
        Story.add(pseudo, name, isPublic, index, checkAdd(callback));
    }
    else {
        callback(null, 0);
    }
};

function checkAdd(callback) {
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
            callback(null, data);
        }
    };
}

exports.updateStory = function(token, id, name, isPublic, index, callback) {
    var pseudo = getCode(token);

    if (pseudo && id) {
        Story.update(pseudo, id, name, isPublic, index, callback);
    }
    else {
        callback(null, 0);
    }
};

exports.deleteStory = function(token, id, callback) {
    var pseudo = getCode(token);
    if (pseudo && id) {
        Story.delete(pseudo, id, callback);
    }
    else {
        callback(null, 0);
    }
};
