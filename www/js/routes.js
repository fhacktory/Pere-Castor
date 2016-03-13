angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

  .state('stories', {
    url: '/stories',
    templateUrl: 'templates/stories.html',
    controller: 'storiesCtrl'
  })

  .state('chapters', {
    url: '/chapters',
    templateUrl: 'templates/chapters.html',
    controller: 'chaptersCtrl'
  })

  .state('pages', {
    url: '/page',
    templateUrl: 'templates/pages.html',
    controller: 'pagesCtrl'
  })

$urlRouterProvider.otherwise('/login')

  

});