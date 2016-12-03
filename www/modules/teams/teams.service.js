(function(){
    'use strict';
    angular.module("teamsModule")
    .service('teamsService',["localStorageService", function(localStorageService) {
        var vm = this;
        var _teams = teams || localStorageService.get("teams");
        var _players = players;
        vm.setTeams = function(data){
            _teams = data;
            localStorageService.set("teams",_teams);
        };
        vm.getTeams = function(){
            return _teams;
        };
        vm.getPlayers = function(){
            return _players;
        };
        vm.getTeam = function(id){
            var team = _.find(_teams,{id:id});
            return team;
        };
    }]);
})();