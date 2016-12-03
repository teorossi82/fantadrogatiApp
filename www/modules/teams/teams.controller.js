(function(){
    angular.module("teamsModule")
        .controller("teamsController",["$scope","$log","$state","teamsService","mainFactory","$ionicActionSheet", teamsController]);
    function teamsController($scope,$log,$state,teamsService,mainFactory,$ionicActionSheet){
        var vm = this;
        function render(){
            if(!teamsService.getTeams())
                getData();
            else
                initData();
        };
        var getData = function(){
            mainFactory.getData("teams.json")
            .then(function(data){
                teamsService.setTeams(data);
                initData();
            })
            .catch(function(err){
                $log.err(err);
            })
        };
        var initData = function(){
            vm.teams = teamsService.getTeams();
        }
        vm.openTeam = function(teamId){
        	$state.go("team",{id:teamId});
        };
        render();
    }
})();