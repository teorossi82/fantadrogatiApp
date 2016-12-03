(function(){
    'use strict';
    angular.module("mainModule")
    .service('mainService',["$cordovaDevice", function($cordovaDevice) {
        var vm = this;
        vm.loadGS = false;
        var _platform = null;
        vm.setPlatform = function(platform){
            _platform = platform;
        };
        vm.getPlatform = function(){
            return _platform;
        };
    }]);
})();