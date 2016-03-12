var dbUtils = require('../../lib/dynamoUtils');
var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-west-2'
});
var db = new AWS.DynamoDB();

var tablename = 'users';

var User = {
    get: function(pseudo, callback) {
        var params = {
            Key: {
                pseudo: {
                    S: pseudo
                }
            },
            TableName: tablename
        };
        db.getItem(params, function(err, data) {
            if (err) {
                callback(err);
            }
            else {
                var obj = {};
                dbUtils.decodeValues(obj, data.Item);
                callback(null, obj);
            }
        });
    },
    create: function(pseudo, password, email, mainStory, callback) {
        var params = {
            Item: {
                pseudo: {
                    S: pseudo
                },
                password: {
                    S: password
                },
                email: {
                    S: email
                },
                mainStory: {
                    S: mainStory
                }
            },
            TableName: tablename,
            ConditionExpression: 'attribute_not_exists(pseudo)'
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
};

module.exports = User;