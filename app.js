var UserController = require('./api/user/user.controller');

exports.authenticate = function(event, context) {
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