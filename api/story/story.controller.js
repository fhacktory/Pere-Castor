var Story = require('./story.model');
var jwt = require('jsonwebtoken');

function getPseudoFromToken(token) {
    var decoded = jwt.verify(token, '§%p3r3c4570r§%');
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
}


exports.getStory = function(token, id, callback) {
    var pseudo = getPseudoFromToken(token);
    if (pseudo) {
        Story.get(pseudo, id, callback);
    }
}

exports.addStory = function(token, name, isPublic, callback) {
    var pseudo = getPseudoFromToken(token);
    if (pseudo) {
        Story.add(pseudo, name, isPublic, callback);
    }
}