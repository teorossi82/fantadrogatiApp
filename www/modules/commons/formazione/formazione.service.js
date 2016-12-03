(function(){
    'use strict';
    angular.module("formazioneModule")
    .service('formazioneService',["teamsService","localStorageService", function(teamsService,localStorageService) {
        var vm = this;
        var _moduli = ["3-4-3","4-3-3","4-4-2","3-5-2","5-3-2","5-4-1","4-5-1","3-6-1"];
        vm.getModuli=function(){
        	return _moduli;
        }
    }]);
})();