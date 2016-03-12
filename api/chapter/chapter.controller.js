var jwt = require('jsonwebtoken');

var Chapter = require('./chapter.model');

exports.getList = function(token, story, callback) {
    var code = getCode(token, story);
    if (!code) {
        callback(null, false);
    }
    else {
        Chapter.getFor(code, function(err, data) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, data);
            }
        });
    }
};

exports.createChapter = function(token, story, name, index, image, callback) {
    var code = getCode(token, story);
    if (!code) {
        callback(null, false);
    }
    else {
        Chapter.create(code, name, index, image, function(err, data) {
            if (err) {
                callback(err);
            }
            else {
                callback(null);
            }
        });
    }
};

exports.updateChapter = function(token, story, id, name, index, image, callback) {
    var code = getCode(token, story);
    if (!code) {
        callback(null, false);
    }
    else {
        Chapter.update(code, id, name, index, image, function(err, data) {
            if (err) {
                callback(err);
            }
            else {
                callback(null);
            }
        });
    }
};

exports.deleteChapter = function(token, story, id, callback) {
    var code = getCode(token, story);
    if (!code) {
        callback(null, false);
    }
    else {
        Chapter.delete(code, id, function(err, data) {
            if (err) {
                callback(err);
            }
            else {
                callback(null);
            }
        });
    }
};

function getCode(token, story) {
    var decoded = jwt.verify(token, '§%p3r3c4570r§%');
    if (!decoded.pseudo) {
        return null;
    }
    var code = [decoded.pseudo, story].join('|');
    return code;
}