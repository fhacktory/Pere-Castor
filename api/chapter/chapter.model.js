var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-west-2'
});
var db = new AWS.DynamoDB();

var tablename = 'chapters';

var User = {
    getAll: function(code, callback) {
        
    },
    create: function(token, name, index, callback) {
        
    },
    update: function(token, id, name, index, callback){
        
    },
    delete: function(token, id, callback){
        
    }
};

module.exports = User;