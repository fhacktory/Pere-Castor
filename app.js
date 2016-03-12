var UserController = require('./api/user/user.controller');
var StoryController = require('./api/story/story.controller');

var authenticate,getUserStories;

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
                        stories: res.stories
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

authenticate({
    pseudo: 'toto',
    password: 'titi'
}, ctx);


getUserStories({
    pseudo: 'toto',
    password: 'titi'
}, ctx);