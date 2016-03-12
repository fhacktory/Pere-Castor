var user = {};

angular.module('app.controllers', [])

.controller('homeCtrl', function($scope) {

})

.controller('loginCtrl', function($scope, $state, $http) {
    $scope.user = {
        pseudo: "",
        password: ""
    };

    $scope.login = function() {
        $http({
                method: 'POST',
                url: 'http://private-efb1b-perecastor.apiary-mock.com/auth/',
                data: JSON.stringify($scope.user), // pass in data as strings
                headers: {
                    'Content-Type': 'application/json'
                } // set the headers so angular passing info as form data (not request payload)
            })
            .success(function(data) {
                user.pseudo = $scope.user.pseudo;
                user.token = data.result.token;
                $state.go("menu.home");
            });
    };
})

.controller('signupCtrl', function($scope) {

})

.controller('chapitreCtrl', function($scope) {

})

.controller('storyCtrl', function($scope) {

})