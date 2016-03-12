var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-west-2'
});
var db = new AWS.DynamoDB();

var User = {
    get: function(pseudo, callback) {
        var params = {
            Key: {
                pseudo: {
                    S: pseudo
                }
            },
            TableName: 'users'
        };
        db.getItem(params, function(err, data) {
            if (err) {
                callback(err);
            } else {
                callback(null, data);
            }
        });
    }
}

module.export = User;