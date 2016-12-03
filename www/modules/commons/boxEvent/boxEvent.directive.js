(function(){
    angular.module("boxEventModule")
    .directive("boxEvent",function (){
        return {
            restrict:'E',
            scope: {
                event: '=',
                disco: '='
            },
            templateUrl:'module/commons/boxEvent/boxEvent.html',
            controller:boxEventController,
            controllerAs: 'boxEventCtrl',
            bindToController:true
        };
    });
    function boxEventController($scope,$state,$cordovaSocialSharing,AppConfig,discoDetService){
        var vm = this;
        var render = function(){
        };
        vm.shareEvent = function(idEvent,file){
            $cordovaSocialSharing
                .share(AppConfig.server + "/scheda_evento.php?id_evento=" + idEvent, null, null, file) // Share via native share sheet
                .then(function(result) {
                console.log(result);
            }, function(err) {
                console.log(err);
            });
        };
        vm.attivaDisco = function(){
            discoDetService.setDiscoAttiva(vm.disco);
            $state.go("discoDet");
        };
        render();
    };
})();