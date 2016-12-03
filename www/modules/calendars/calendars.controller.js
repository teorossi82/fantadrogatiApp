(function(){
    angular.module("calendarsModule")
        .controller("calendarsController",["$rootScope","$scope","$log","$state","mainFactory","calendarsService","teamsService","$ionicActionSheet","$ionicScrollDelegate","userService", calendarsController]);
    function calendarsController($rootScope,$scope,$log,$state,mainFactory,calendarsService,teamsService,$ionicActionSheet,$ionicScrollDelegate,userService){
        var vm = this;
        function render(){
            if(!calendarsService.getCalendars("campionato"))
                getData();
            else{
                initData();
            }
        };
        vm.user = userService.getUser();
        var checkSetUser = $rootScope.$on("userServiceSetUser",function(event,user){
            vm.user = userService.getUser();
        });
        var checkRemoveUser = $rootScope.$on("userServiceRemoveUser",function(event){
            vm.user = userService.getUser();
        });
        var teams;
        var getData = function(){
            mainFactory.getData("calendars.json")
            .then(function(data){
                calendarsService.setCalendars(null,data);
                initData();
            })
            .catch(function(err){
                $log.error(err);
            })
        };
        var initData = function(){
            vm.campionato = calendarsService.getCalendars("campionato");
            vm.coppaitalia = calendarsService.getCalendars("coppaitalia");
            checkGiornataCampActive();
            checkCoppaActive();
            teams=teamsService.getTeams();
            loadGiornate();
            vm.tabActive='next';
            vm.manageCampionato.setFase(1);
        };
        vm.giornataSerieaActive=calendarsService.getGiornataSerieaAttiva();
        vm.giornataCampActive;
        vm.giornataCoppaActive;
        vm.coppaActive;
        var checkCoppaActive = function(){ 
            if(vm.giornataSerieaActive>=vm.coppaitalia.giornate_attive.start && vm.giornataSerieaActive<=vm.coppaitalia.giornate_attive.end){
                vm.coppaActive=vm.coppaitalia;
                vm.giornataCoppaActive=calendarsService.getGiornata("coppaitalia",vm.giornataSerieaActive,false);
            }
        };
        var checkGiornataCampActive = function(){
            vm.giornataCampActive=calendarsService.getGiornata("campionato",vm.giornataSerieaActive,false);
        };
        vm.listaPartite = {
            "campionato":[],
            "coppa":[]
        };
        var loadGiornate = function(){
            _.forEach(vm.giornataCampActive.games,function(value,key){
                var obj={};
                obj.casa = _.find(teams,{id:value.casa}).name;
                obj.trasferta = _.find(teams,{id:value.trasferta}).name;
                vm.listaPartite.campionato.push(obj);
            });
            _.forEach(vm.giornataCoppaActive.games,function(value,key){
                var obj={};
                obj.casa = _.find(teams,{id:value.casa}).name;
                obj.trasferta = _.find(teams,{id:value.trasferta}).name;
                vm.listaPartite.coppa.push(obj);
            });
        };
        vm.showMenuCalendars = function() {
            menuTeam = $ionicActionSheet.show({
                buttons: [
                    { text: '<b>Prossime partite</b>' },
                    { text: '<b>Campionato</b>' },
                    { text: '<b>Coppa Italia</b>' },
                    { text: '<b>Coppa Fantacalcio</b>' },
                    { text: '<b>Champions League</b>' },
                    { text: '<b>Super Campione</b>' }
                ],
                titleText: 'Cosa vuoi vedere',
                cancelText: 'Annulla',
                cancel: function() {
                  // add cancel code..
                },
                buttonClicked: function(index) {
                    if(index===0){
                        vm.tabActive="next";
                    }
                    if(index===1){
                        vm.tabActive="campionato";
                    }
                    $ionicScrollDelegate.scrollTop(true);
                    return true;
                }
           });
        };
        vm.manageCampionato = {
            "tab":1,
            "humanizeGiornate": function(from,to){
                var ar = [];
                var toHumanize=vm.campionato.giornate.slice(from,to);
                _.forEach(toHumanize,function(value){
                    var gior = calendarsService.renderGiornataInHuman(value);
                    ar.push(gior);
                });
                return ar;
            },
            "giornateHumanized":[],
            "setFase":function(tab){
                vm.manageCampionato.tab=tab;
                vm.manageCampionato.giornateHumanized = vm.manageCampionato.humanizeGiornate((tab-1),(tab+10));
                //$ionicScrollDelegate.scrollTop(true);
            }
        }
        $scope.$on("$destroy",function(){
            checkSetUser();
            checkRemoveUser();
        });
        render();
    }
})();