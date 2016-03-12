var UserController = require('./api/user/user.controller');
var StoryController = require('./api/story/story.controller');

var authenticate, getUserStories, addStory;

exports.authenticate = authenticate = function(event, context) {
    UserController.login(event.pseudo, event.password, function(err, res) {
        if (err) {
            context.fail(err);
        }
        else {
            if (res == false) {
                context.succeed({
                    authorized: false,
                    result: 'INVALID_CREDENTIALS'
                })
            }
            else {
                context.succeed({
                    authorized: true,
                    result: {
                        token: res.token
                    }
                })
            }
        }
    });
}

exports.getUserStories = getUserStories = function(event, context) {
    StoryController.getUserStories(event.token, function(err, res) {
        if (err) {
            context.fail(err);
        }
        else {
            if (res == false) {
                context.succeed({
                    authorized: false,
                    result: 'NO_STORIES_FOR_USER'
                })
            }
            else {
                context.succeed({
                    authorized: true,
                    result: {
                        stories: res
                    }
                })
            }
        }
    });
}

exports.addStory = addStory = function(event, context) {
    StoryController.addStory(event.token, event.name, event.isPublic, function(err, res) {
        if (err) {
            context.fail(err);
        }
        else {
            if (res == false) {
                context.succeed({
                    authorized: false,
                    result: 'NO_STORIES_FOR_USER'
                })
            }
            else {
                context.succeed({
                    authorized: true,
                    result: {
                        stories: res
                    }
                })
            }
        }
    });
}

var ctx = {
    succeed: function(mess) {
        console.log(mess);
    },
    fail: function(mess) {
        console.log(mess);
    }
};

/* TESTS */
var jwt = require('jsonwebtoken');
var token = jwt.sign({
    pseudo: "toto"
}, '§%p3r3c4570r§%');

console.log(token);
authenticate({
    pseudo: 'toto',
    password: 'titi'
}, ctx);


addStory({
    token: token,
    name: "myStory",
    isPublic: true
}, ctx);

getUserStories({
    token: token,
}, ctx);

addStory({
    token: token,
    oldName: "myStory",
    newName: "myStoryEdited",
    isPublic: false
}, ctx);

getUserStories({
    token: token,
}, ctx);