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
            } else {
                callback(null, data);
            }
        });
    }
    get:function(){

    }
}

module.export = Story;