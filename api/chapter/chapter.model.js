var dbUtils = require('../../lib/dynamoUtils');
var utils = require('../../lib/utils');

var shortid = require('shortid');
var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-west-2'
});
var db = new AWS.DynamoDB();
var s3 = new AWS.S3();

var tablename = 'chapters';
var s3Bucket = 'perecastor-files';

var User = {
    getFor: function(code, callback) {
        var params = {
            TableName: tablename,
            ExpressionAttributeValues: {
                ":code": {
                    S: code
                }
            },
            KeyConditionExpression: 'code=:code'
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
    create: function(code, name, index, image, callback) {
        if (image) {
            var imageBuffer = utils.decodeBase64Image(image);
        }
        var chapterId = shortid.generate();
        var params = {
            Item: {
                code: {
                    S: code
                },
                id: {
                    S: chapterId
                },
                chapterName: {
                    S: name
                },
                index: {
                    N: index.toString()
                }
            },
            TableName: tablename,
            ConditionExpression: 'attribute_not_exists(pseudo)'
        };
        if (image) {
            var paramsS3 = {
                Bucket: s3Bucket,
                ACL: 'public-read',
                Key: code + '/backgrounds/' + chapterId + '.' + imageBuffer.type.substring(imageBuffer.type.indexOf('/') + 1),
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
                            callback(null);
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
                    callback(null);
                }
            });
        }
    },
    update: function(code, id, name, index, image, callback) {
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
        if (name) {
            params.AttributeUpdates.chapterName = {
                Action: 'PUT',
                Value: {
                    S: name
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
        }
        if (image) {
            var paramsS3 = {
                Bucket: s3Bucket,
                ACL: 'public-read',
                Key: code + '/backgrounds/' + id + '.' + imageBuffer.type.substring(imageBuffer.type.indexOf('/') + 1),
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
            db.putItem(params, function(err, data) {
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
                callback(null);
            }
        });
    }
};

module.exports = User;