var UserController = require('./api/user/user.controller');
var StoryController = require('./api/story/story.controller');

var authenticate, getUserStories, addStory, updateStory, deleteStory;

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
                    result: 'STORY_EXISTS'
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

exports.updateStory = updateStory = function(event, context) {
    StoryController.updateStory(event.token, event.id, event.name, event.isPublic, function(err, res) {
        if (err) {
            context.fail(err);
        }
        else {
            if (res == false) {
                context.succeed({
                    authorized: false,
                    result: 'NO_STORY_PSEUDO_ID'
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

exports.deleteStory = deleteStory = function(event, context) {
    StoryController.deleteStory(event.token, event.id, function(err, res) {
        if (err) {
            context.fail(err);
        }
        else {
            if (res == false) {
                context.succeed({
                    authorized: false,
                    result: 'NO_STORY_PSEUDO_ID'
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

updateStory({
    token: token,
    id: "41XZXL63l",
    name: "myStoryEdited",
    isPublic: false
}, ctx);

getUserStories({
    token: token,
}, ctx);

deleteStory({
    token: token,
    id: "N1_9bHanl"
}, ctx);





var PageController = require('./api/page/page.controller');

var getPages, addPage, updatePage, deletePage;

exports.getPages = getPages = function(event, context) {
    PageController.getPages(event.token, event.story, event.chapter, function(err, res) {
        if (err) {
            context.fail(err);
        }
        else {
            if (res == false) {
                context.succeed({
                    authorized: false,
                    result: 'NO_PAGE_CODE_CHAPTER'
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
};

exports.addPage = addPage = function(event, context) {
    PageController.addPage(event.token, event.story, event.chapter, event.title, event.description, event.text, event.image, function(err, res) {
        if (err) {
            context.fail(err);
        }
        else {
            if (res == false) {
                context.succeed({
                    authorized: false,
                    result: 'PAGE_EXISTS'
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
};

exports.updatePage = updatePage = function(event, context) {
    PageController.updatePage(event.token, event.story, event.chapter, event.id, event.title, event.description, event.text, event.image, function(err, res) {
        if (err) {
            context.fail(err);
        }
        else {
            if (res == false) {
                context.succeed({
                    authorized: false,
                    result: 'PAGE_NOT_EXISTS'
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
};

exports.deletePage = deletePage = function(event, context) {
    PageController.deletePage(event.token, event.story, event.chapter, event.id, function(err, res) {
        if (err) {
            context.fail(err);
        }
        else {
            if (res == false) {
                context.succeed({
                    authorized: false,
                    result: 'PAGE_NOT_EXISTS'
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
};



addPage({
    token: token,
    story: "story",
    chapter: "chapter",
    title: "titre",
    description: "desc",
    text: "text",
    image: null
}, ctx);

addPage({
    token: token,
    story: "story2",
    chapter: "chapter2",
    title: "titre",
    description: "desc",
    text: "text",
    image: null
}, ctx);

getPages({
    token: token,
    story: "story",
    chapter: "chapter",
}, ctx);

deletePage({
    token: token,
    story: "story",
    chapter: "chapter",
    id:"VyezCFDTnl"
}, ctx);

updatePage({
    token: token,
    story: "story",
    chapter: "chapter",
    id:"Vkx2B3w63l",
    title: "titreEdit",
    description: "descEdit",
    text: "textEdit",
    image: null
}, ctx);
