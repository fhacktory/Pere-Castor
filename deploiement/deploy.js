var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-west-2'
});

var lambda= new AWS.Lambda();

var params = {
  Marker: 'STRING_VALUE',
  MaxItems: 0
};
lambda.listFunctions(params, function(err, data) {
	if (err) {
		console.log(err, err.stack); 
	}
	else{
		for(var i in data){
			console.log(i);
		}
	}     
});

