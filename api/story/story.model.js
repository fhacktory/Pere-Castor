var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-west-2'
});
var db = new AWS.DynamoDB();
var shortid = require('shortid');

var Story = {
    list: function(pseudo, callback) {
        var params = {
            ExpressionAttributeValues: {
                ":code": {
                    S: pseudo
                }
            },
            KeyConditionExpression: 'code=:code',
            TableName: 'stories'
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
    get: function(pseudo, id, callback) {
        var params = {
            Key: {
                code: {
                    S: pseudo
                },
                id: {
                    S: id
                }
            },
            TableName: 'stories'
        };
        db.getItem(params, function(err, data) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, data);
            }
        });
    },
    add: function(pseudo, name, isPublic, callback) {
        var params = {
            Item: {
                id: {
                    S: shortid.generate()
                },
                code: {
                    S: pseudo
                },
                storyName: {
                    S: name
                },
                public: {
                    BOOL: isPublic
                },
                date: {
                    N: Date.now().toString()    
                }
            },
            TableName: 'stories',
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
    update: function(pseudo, id, storyName, isPublic, callback) {
        var params = {
            Key: {
                code: {
                    S: pseudo
                },
                id: {
                    S: id
                }
            },
            TableName: 'stories',
            AttributeUpdates: {
                storyName: {
                    Action: "PUT",
                    Value: {
                        S: storyName
                    }
                },
                public: {
                    Action: "PUT",
                    Value: {
                        BOOL: isPublic
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
    delete: function(pseudo, id, callback) {
        var params = {
            Key: {
                code: {
                    S: pseudo
                },
                id: {
                    S: id
                }
            },
            TableName: 'stories'
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
}

module.exports = Story;