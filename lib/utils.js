exports.decodeBase64Image = function(dataString) {
    var matches = dataString.match(/^(.*base64,)/),
        response = {};

    response.header = matches[1];
    response.data = new Buffer(dataString.replace(matches[1], ""), 'base64');

    return response;
};