var dbUtils = require('../../lib/dynamoUtils');
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
                callback(null, data.Items.map(function(i) {
                    var obj = {};
                    dbUtils.decodeValues(obj, i);
                    return obj;
                }));
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
    add: function(pseudo, name, isPublic, index, callback) {
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
                },
                index: {
                    N: index.toString()
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
    update: function(pseudo, id, storyName, isPublic, index, callback) {
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
        };
        if (storyName) {
            params.AttributeUpdates.storyName = {
                Action: 'PUT',
                Value: {
                    S: storyName
                }
            };
        }
        if (index) {
            params.AttributeUpdates.index = {
                Action: 'PUT',
                Value: {
                    N: index.toString()
                }
            };
        }if (isPublic) {
            params.AttributeUpdates.public = {
                Action: 'PUT',
                Value: {
                    BOOL: isPublic
                }
            };
        }
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
};

module.exports = Story;