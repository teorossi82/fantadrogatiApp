// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova','LocalStorageModule','angularMoment','ng-iscroll','mainModule','utilsModule','teamsModule','teamModule','calendarsModule','accountModule','userModule','boxErrorModule','formazioneModule','setFormazioneModule','votiModule'])
  .config(function($stateProvider,localStorageServiceProvider,$ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.navBar.alignTitle('center')
    $stateProvider
      .state('index', {
        url: '/',
        controller:'mainController'
      })
      .state('account', {
        url: '/account',
        templateUrl: 'modules/account/account.html',
        controller:'accountController',
        controllerAs:'accountCtrl'
      })
      .state('setFormazione', {
        url: '/setFormazione?uuid,id',
        templateUrl: 'modules/setFormazione/setFormazione.html',
        controller:'setFormazioneController',
        controllerAs:'vm'
      })
      .state('teams', {
        url: '/teams',
        templateUrl: 'modules/teams/teams.html',
        controller:'teamsController',
        controllerAs:'vm'
      })
      .state('team', {
        url: '/team?id',
        templateUrl: 'modules/team/team.html',
        controller:'teamController',
        controllerAs:'vm'
      })
      .state('calendars', {
        url: '/calendars',
        templateUrl: 'modules/calendars/calendars.html',
        controller:'calendarsController',
        controllerAs:'vm'
      });
    localStorageServiceProvider
      .setPrefix('fantadrogati');
  })
  .constant("AppConfig",{
      server:"http://192.168.1.8:3000"
  })

.run(function($ionicPlatform,$state) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    $state.go("index");
  });
})
