(function(){
    angular.module("teamModule")
        .controller("teamController",["$scope","$log","$state","teamsService","$stateParams","$ionicActionSheet","$ionicHistory", teamController]);
    function teamController($scope,$log,$state,teamsService,$stateParams,$ionicActionSheet,$ionicHistory){
        var vm = this;
        function render(){
        	vm.teams = teamsService.getTeams();
        	vm.team = _.find(vm.teams,{id:parseInt($stateParams.id)});
        	if(!vm.team)
        		return;
        };
        vm.back=function(){
        	$state.go("teams");
        };
        vm.backUrl = function(){
            $ionicHistory.goBack();
        };
        var menuTeam;
        vm.showMenuTeam = function(teamId) {
			menuTeam = $ionicActionSheet.show({
		    	buttons: [
		       		{ text: '<b>Rosa</b>' },
		       		{ text: 'Info' }
		     	],
		     	titleText: 'Cosa vuoi fare',
		     	cancelText: 'Annulla',
		     	cancel: function() {
		          // add cancel code..
		        },
		     	buttonClicked: function(index) {
		     		if(index===0){
		     			$state.go("team",{id:teamId});
		     		}
		     		if(index===1){
		     			console.log("info")
		     		}
		       		return true;
		     	}
		   });
		};
		vm.checkChangeRole = function(index,role){
			var next = vm.team.rosa[index-1];
			if(next && (next.ruolo!==role))
				return true;
			return false;
		};
        render();
    }
})();