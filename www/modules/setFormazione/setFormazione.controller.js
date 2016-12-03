(function(){
    angular.module("setFormazioneModule",[])
        .controller("setFormazioneController",["$scope","$stateParams","teamsService","accountService","$ionicHistory", setFormazioneController]);
    function setFormazioneController($scope,$stateParams,teamsService,accountService,$ionicHistory){
        var vm=this;
        var render = function(){
            vm.id=parseInt($stateParams.id);
            vm.uuid=$stateParams.uuid;
            vm.team = teamsService.getTeam(vm.id);
            vm.giornata=accountService.getGiornataByUuid(vm.uuid);
            vm.formazione=_.find(vm.giornata.formazione,{id:vm.id});
        };
        vm.backUrl = function(){
            $ionicHistory.goBack();
        };
        var calcFormHeight=function(){
            var head = angular.element("ion-header-bar").height();
            var tabs = angular.element(".tab-nav.tabs").height();
            return window.innerHeight-head-tabs-15;
        };
        vm.formazioneOpts = {
            height:calcFormHeight(),
            view:{
                moduli:true,
                menu:true,
                panca:true
            },
            state:"imposta"
        };
        $scope.$on("formazione:save",function(e,uuid,form){
            //vm.giornata.formazione=form;
            accountService.setGiornata(vm.giornata);
            vm.backUrl();
        });

        $scope.$on("formazione:copy",function(e,uuid,form){
            var toSend = getFormToSend(form);
            $cordovaClipboard
            .copy(toSend)
            .then(function () {
              console.log("ok")
            }, function () {
              console.log("ko")
            });
        });

        $scope.$on("formazione:share",function(e,uuid,form){
            var toSend = getFormToSend(form);
            $cordovaSocialSharing
            .shareViaSMS(toSend, null)
            .then(function(result) {
              console.log(result)
            }, function(err) {
              console.log(err)
            });
        });
        render();
    }
})()