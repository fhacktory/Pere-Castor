var dbUtils = require('../../lib/dynamoUtils');
var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-west-2'
});
var db = new AWS.DynamoDB();

var tablename = 'chapters';

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
    create: function(token, name, index, callback) {
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
    },
    update: function(token, id, name, index, callback) {

    },
    delete: function(token, id, callback) {

    }
};

module.exports = User;

User.getFor('toto');