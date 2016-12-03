(function(){
    'use strict';
    angular.module("teamModule")
    .service('teamService',["$cordovaDevice", function($cordovaDevice) {
        var vm = this;
        var _teams = teams;
        var _players = players;
        vm.getTeams = function(){
            return _teams;
        };
        vm.getPlayers = function(){
            return _players;
        }
    }]);
})();