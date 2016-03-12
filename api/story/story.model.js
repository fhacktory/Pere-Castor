var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-west-2'
});
var db = new AWS.DynamoDB();

var Story = {
    list: function(pseudo, callback) {
        var params = {
            Key: {
                code: {
                    S: pseudo
                }
            },
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
    add: function(pseudo, name, isPublic,callback) {
        var params = {
            Key: {
                code: {
                    S: pseudo
                },
                name: {
                    S: name
                },
                public:{
                    BOOL:isPublic
                },
                date:{
                    N:Date.now()
                }
            },
            TableName: 'stories'
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
}

module.export = Story;