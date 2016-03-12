var dbUtils = require('../../lib/dynamoUtils');
var utils = require('../../lib/utils');

var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-west-2'
});
var db = new AWS.DynamoDB();
var s3 = new AWS.S3();
var shortid = require('shortid');

var tablename = 'pages';
var s3Bucket = 'perecastor-files';

var Page = {
    list: function(code, callback) {
        var params = {
            ExpressionAttributeValues: {
                ":code": {
                    S: code
                }
            },
            KeyConditionExpression: 'code=:code',
            TableName: tablename
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
    add: function(code, title, description, text, image, callback) {
        if (image) {
            var imageBuffer = utils.decodeBase64Image(image);
        }
        var pageId = shortid.generate();
        var params = {
            Item: {
                id: {
                    S: pageId
                },
                code: {
                    S: code
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
            TableName: tablename,
            ConditionExpression: 'attribute_not_exists(code) and attribute_not_exists(storyName)'
        };
        if (image) {
            var paramsS3 = {
                Bucket: s3Bucket,
                ACL: 'public-read',
                Key: code + '/' + pageId + '.' + imageBuffer.type.substring(imageBuffer.type.indexOf('/') + 1),
                Body: imageBuffer.data
            };
            s3.upload(paramsS3, function(err, data) {
                if (err) {
                    callback(err);
                }
                else {
                    params.Item.image = {
                        S: data.Location
                    };
                    db.putItem(params, function(err, data) {
                        if (err) {
                            callback(err);
                        }
                        else {
                            callback(null, data);
                        }
                    });
                }
            });
        }
        else {
            db.putItem(params, function(err, data) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, data);
                }
            });
        }

    },
    update: function(code, id, title, description, text, image, callback) {
        if (image) {
            var imageBuffer = utils.decodeBase64Image(image);
        }
        var params = {
            Key: {
                code: {
                    S: code
                },
                id: {
                    S: id
                }
            },
            TableName: tablename,
            AttributeUpdates: {}
        };
        if (title) {
            params.AttributeUpdates.title = {
                Action: "PUT",
                Value: {
                    S: title
                }
            };
        }
        if (text) {
            params.AttributeUpdates.text = {
                Action: "PUT",
                Value: {
                    S: text
                }
            };
        }
        if (image) {
            var paramsS3 = {
                Bucket: s3Bucket,
                ACL: 'public-read',
                Key: code + '/' + id + '.' + imageBuffer.type.substring(imageBuffer.type.indexOf('/') + 1),
                Body: imageBuffer.data
            };
            s3.upload(paramsS3, function(err, data) {
                if (err) {
                    callback(err);
                }
                else {
                    params.AttributeUpdates.image = {
                        Action: 'PUT',
                        Value: {
                            S: data.Location
                        }
                    };
                    db.updateItem(params, function(err, data) {
                        if (err) {
                            callback(err);
                        }
                        else {
                            callback(null);
                        }
                    });
                }
            });
        }
        else {
            db.updateItem(params, function(err, data) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null);
                }
            });
        }
    },
    delete: function(code, id, callback) {
        var params = {
            Key: {
                code: {
                    S: code
                },
                id: {
                    S: id
                }
            },
            TableName: tablename
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