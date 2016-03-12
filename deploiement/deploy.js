var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-west-2'
});
var fs = require('fs');

var zip;

var lambda = new AWS.Lambda();

var params = {};
lambda.listFunctions(params, function(err, data) {
    if (err) {
        console.log(err, err.stack);
    }
    else {
        zip = new Buffer(fs.readFileSync('./deploiement.zip')).toString('base64');

        for (var i in data.Functions) {
            var fn = data.Functions[i];


            params = {
                FunctionName: fn.FunctionName,
                S3Bucket: "deploiement",
                S3Key:"deploiement.zip"
            };
            /* Récupérer infos dans fichier config à partir du nom de la fonction */

            lambda.updateFunctionCode(params, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else console.log(data); // successful response
            });
            console.log(data.Functions[i]);
        }
    }
});
