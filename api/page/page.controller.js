var Page = require('./page.model');
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

exports.getPages = function(token, story, chapter, callback) {
    var pseudo = getPseudoFromToken(token);
    if (pseudo) {
        Page.list(pseudo, story, chapter, callback);
    }
}

exports.addPage = function(token, story, chapter, title, description, text, image, callback) {
    var pseudo = getPseudoFromToken(token);
    if (pseudo) {
        Page.add(pseudo, story, chapter, title, description, text, image, callback);
    }
}


exports.updatePage = function(token, story, chapter, id, title, description, text, image, callback) {
    var pseudo = getPseudoFromToken(token);
    if (pseudo && id) {
        Page.update(pseudo, story, chapter,id, title, description, text, image, callback);
    }
}

exports.deletePage = function(token, story, chapter, id, callback) {
    var pseudo = getPseudoFromToken(token);
    if (pseudo && id) {
        Page.delete(pseudo, story, chapter, id, callback);
    }
}