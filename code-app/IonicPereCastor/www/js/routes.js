angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('menu.home', {
    url: '/home',
    views: {
      'side-menu21': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })

  .state('menu', {
    url: '/side-menu',
    templateUrl: 'templates/menu.html',
    abstract:true
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('menu.signup', {
    url: '/signup',
    views: {
      'side-menu21': {
        templateUrl: 'templates/signup.html',
        controller: 'signupCtrl'
      }
    }
  })

  .state('menu.chapitre', {
    url: '/chapitre',
    views: {
      'side-menu21': {
        templateUrl: 'templates/chapitre.html',
        controller: 'chapitreCtrl'
      }
    }
  })

  .state('menu.story', {
    url: '/story',
    views: {
      'side-menu21': {
        templateUrl: 'templates/story.html',
        controller: 'storyCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/login')

  

});