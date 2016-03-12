var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-west-2'
});
var db = new AWS.DynamoDB();
var shortid = require('shortid');

var Page = {
    list: function(pseudo, story, chapter, callback) {
        var params = {
            ExpressionAttributeValues: {
                ":code": {
                    S: pseudo + '|' + story + '|' + chapter
                }
            },
            KeyConditionExpression: 'code=:code',
            TableName: 'pages'
        };
        db.query(params, function(err, data) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, data);
            }
        });
    },
    add: function(pseudo, story, chapter, title, description, text, image, callback) {
        var params = {
            Item: {
                id: {
                    S: shortid.generate()
                },
                code: {
                    S: pseudo + '|' + story + '|' + chapter
                },
                title: {
                    S: title
                },
                description: {
                    S: description
                },
                text: {
                    S: text
                },
                date: {
                    N: Date.now().toString()
                }
            },
            TableName: 'pages',
            ConditionExpression: 'attribute_not_exists(code) and attribute_not_exists(storyName)'
        };
        db.putItem(params, function(err, data) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, data);
            }
        });
    },
    update: function(pseudo, story, chapter, id, title, description, text, image, callback) {
        var params = {
            Key: {
                code: {
                    S: pseudo + '|' + story + '|' + chapter
                },
                id: {
                    S: id
                }
            },
            TableName: 'pages',
            AttributeUpdates: {
                title: {
                    Action: "PUT",
                    Value: {
                        S: title
                    }
                },
                description: {
                    Action: "PUT",
                    Value: {
                        S: description
                    }
                },
                text: {
                    Action: "PUT",
                    Value: {
                        S: text
                    }
                }
            }
        };
        db.updateItem(params, function(err, data) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, data);
            }
        });
    },
    delete: function(pseudo, story, chapter, id, callback) {
        var params = {
            Key: {
                code: {
                    S: pseudo + '|' + story + '|' + chapter
                },
                id: {
                    S: id
                }
            },
            TableName: 'pages'
        };
        db.deleteItem(params, function(err, data) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, data);
            }
        });
    }
};

module.exports = Page;