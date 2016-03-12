var Page = require('./page.model');
var jwt = require('jsonwebtoken');

function getCode(token, story, chapter) {
    try {
        var decoded = jwt.verify(token, '§%p3r3c4570r§%');
    }
    catch (e) {
        return null;
    }
    if (!decoded.pseudo) {
        return null;
    }
    var code = [decoded.pseudo, story, chapter].join('|');
    return code;
}

exports.getPages = function(token, story, chapter, callback) {
    var code = getCode(token, story, chapter);
    if (code) {
        Page.list(code, callback);
    }
    else {
        callback(null, 0);
    }
};

exports.addPage = function(token, story, chapter, title, description, text, image, callback) {
    var code = getCode(token, story, chapter);
    if (code) {
        Page.add(code, title, description, text, image, callback);
    }
    else {
        callback(null, 0);
    }
};

exports.updatePage = function(token, story, chapter, id, title, description, text, image, callback) {
    var code = getCode(token, story, chapter);
    if (code && id) {
        Page.update(code, id, title, description, text, image, callback);
    }
    else {
        callback(null, 0);
    }
};

exports.deletePage = function(token, story, chapter, id, callback) {
    var code = getCode(token, story, chapter);
    if (code && id) {
        Page.delete(code, id, callback);
    }
    else {
        callback(null, 0);
    }
};