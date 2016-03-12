var UserController = require('./api/user/user.controller');

var authenticate;

exports.authenticate = authenticate = function(event, context) {
    UserController.login(event.pseudo, event.password, function(err, res) {
        if (err) {
            context.fail(err);
        } else {
            if (res == false) {
                context.succeed({
                    authorized: false,
                    result: 'INVALID_CREDENTIALS'
                })
            } else {
                context.succeed({
                    authorized: true,
                    result: {
                        token: res.token
                    }
                })
            }
        }
    });
}

var ctx = {
	succeed: function(mess){
		console.log(mess);
	},
	fail: function(mess){
		console.log(mess);
	}
}
authenticate({pseudo:'toto',password:'titi'}, ctx);