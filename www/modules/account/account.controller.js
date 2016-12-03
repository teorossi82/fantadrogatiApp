(function(){
    angular.module("accountModule",[])
        .controller("accountController",["$scope","$rootScope","$log","$http","AppConfig","$timeout","userService","loading","$ionicActionSheet","$state","accountService","teamsService","calendarsService","localStorageService","serviceUUID","$cordovaClipboard","$cordovaSocialSharing","votiService", accountController]);
    function accountController($scope,$rootScope,$log,$http,AppConfig,$timeout,userService,loading,$ionicActionSheet,$state,accountService,teamsService,calendarsService,localStorageService,serviceUUID,$cordovaClipboard,$cordovaSocialSharing,votiService){
        var vm=this;
        vm.error = null;
        vm.feedback = null;
        var render = function(){
            if(vm.user._id){
                vm.team = teamsService.getTeam(vm.user.id);
                vm.formazione.team=vm.team;
                //vm.formazione.formazioneTipo = Object.keys(accountService.getFormazioneTipo()).length === 0 && accountService.getFormazioneTipo().constructor === Object ? initFormazione(vm.formazione.formazioneTipo) : accountService.getFormazioneTipo();
                checkGiornataCampActive();
                checkCoppaActive();
                getLastGiornate();
            }
        };
        vm.closeFeedback = function(){
            if(vm.feedback.clb)
                vm.feedback.clb();
            vm.feedback = null;
        };
        vm.user = userService.getUser();
        var checkSetUser = $rootScope.$on("userServiceSetUser",function(event,user){
            vm.user = userService.getUser();
        });
        var checkRemoveUser = $rootScope.$on("userServiceRemoveUser",function(event){
            vm.user = userService.getUser();
        });
        var login = function(username,psw){
            var promise = $http({
                cache: false,
                url: AppConfig.server + "/utente",
                params:{
                    username:username,
                    password:psw
                },
                method: "GET"
            });
            promise.then(
                function(data){
                    $log.info(data);
                    loading.hide();
                    if(!data.data || data.data=="false"){
                        vm.error = {
                            "title":"Attenzione",
                            "msg":"Accesso negato. Controlla che i dati inseriti siano corretti"
                        };
                        return;
                    }
                    data.data.email = vm.user.username;
                    data.data.password = vm.user.password;
                    userService.setUser(data.data,true);
                    render();
                }
            )
                .catch(
                function(err){
                    $log.error(err);
                    loading.hide();
                    vm.error = {
                        "title":"Attenzione",
                        "msg":"C'è stato un errore, ti preghiamo di riprovare più tardi."
                    };
                    return;
                }
            );
        };
        vm.prepareLogin = function(){
            if(!vm.user.username || !vm.user.password){
                vm.error = {
                    "title":"Attenzione",
                    "msg":"Devi inserire username e password"
                };
                return;
            }
            loading.show();
            $timeout(function(){
                login(vm.user.username,vm.user.password);
            },500);  
        };
        vm.logout = function(){
            userService.removeUser(true);  
        };
        var menuAccount;
        vm.showMenuAccount = function() {
            menuAccount = $ionicActionSheet.show({
                buttons: [
                    { text: '<b>La tua rosa</b>' }
                ],
                titleText: 'Cosa vuoi fare',
                cancelText: 'Annulla',
                cancel: function() {
                  // add cancel code..
                },
                buttonClicked: function(index) {
                    if(index===0){
                        $state.go("team",{id:vm.user.id});
                    }
                    return true;
                }
           });
        };
        vm.goToTeam = function(id){
            $state.go("team",{id:id});
        };
        vm.goToSetFormazione = function(uuid,id){
            $state.go("setFormazione",{uuid:uuid,id:id});
        };
        var calcFormHeight=function(){
            var head = angular.element("ion-header-bar").height();
            var tabs = angular.element(".tab-nav.tabs").height();
            return window.innerHeight-head-tabs-50;
        };
        vm.formazione = {
            options:{
                height:calcFormHeight(),
                view:{
                    moduli:false,
                    menu:false,
                    panca:true
                },
                state:"vedi"
            }
        };
        var initFormazione = function(id){
            var team = teamsService.getTeam(id);
            var getPlayers = function(role,num,from){
                var p = _.filter(team.rosa,{ruolo:role});
                p = p.splice(from,num);
                return p;
            };
            var getPanca = function(){
                var p = getPlayers('portiere',1,1);
                p = p.concat(getPlayers('attaccante',2,3));
                p = p.concat(getPlayers('centrocampista',3,4));
                p = p.concat(getPlayers('difensore',3,3));
                return p;
            };
            form = {};
            form.modulo = "3-4-3";
            form.campo = {
                "p":getPlayers('portiere',1,0),
                "d":getPlayers('difensore',3,0),
                "c":getPlayers('centrocampista',4,0),
                "a":getPlayers('attaccante',3,0)
            };
            form.panca = getPanca();
            return form;
        };
        var initFormazioneOptions=function(){
            var options={
                height:calcFormHeight(),
                view:{
                    moduli:false,
                    menu:false,
                    panca:true
                },
                state:"vedi"
            }
            return options;
        };
        vm.setFormState = function(games,state){
            games.formazioneOpts.state=state;
            games.formazioneOpts.view.menu= state==="imposta" ? true : false;
            games.formazioneOpts.view.moduli= state==="imposta" ? true : false;
        };

        var getFormToSend = function(form){
            var arR = ["p","d","c","a"];
            var string ="";
            for(var i=0;i<arR.length;i++){
                for(var p=0; p<form.campo[arR[i]].length;p++){
                    string+=form.campo[arR[i]][p].name+", ";
                }
            }
            string = string.slice(0, -2);
            string+=".\n";
            string+="Panchina: ";
            for(var p=0; p<form.panca.length;p++){
                string+=form.panca[p].name+", ";
            }
            string = string.slice(0, -2);
            string+=".";
            return string;
        };

        vm.giornateSaved = localStorageService.get("giornateSaved");
        vm.giornataSerieaActive=calendarsService.getGiornataSerieaAttiva();
        vm.campionato = calendarsService.getCalendars("campionato");
        vm.coppaitalia = calendarsService.getCalendars("coppaitalia");
        vm.nextGames = [];
        var checkCoppaActive = function(){ 
            if(vm.giornataSerieaActive>=vm.coppaitalia.giornate_attive.start && vm.giornataSerieaActive<=vm.coppaitalia.giornate_attive.end){
                var exist = accountService.getGiornata("coppa_"+vm.giornataSerieaActive);
                if(!exist){
                    vm.coppaActive=vm.coppaitalia;
                    var giornataCoppaActive=calendarsService.getGiornata("coppaitalia",vm.giornataSerieaActive,true,vm.user.id);
                    if(!giornataCoppaActive)
                        return;
                    giornataCoppaActive.label="Coppa Italia";
                    giornataCoppaActive.id="coppa_"+vm.giornataSerieaActive;
                    giornataCoppaActive.uuid=serviceUUID.create();
                    var formazione1=initFormazione(giornataCoppaActive.casaId);
                    formazione1.id=giornataCoppaActive.casaId;
                    giornataCoppaActive.formazione=[];
                    giornataCoppaActive.formazione.push(formazione1);
                    var formazione2=initFormazione(giornataCoppaActive.trasfertaId);
                    formazione2.id=giornataCoppaActive.trasfertaId;
                    giornataCoppaActive.formazione.push(formazione2);
                    giornataCoppaActive.formazioneOpts=initFormazioneOptions();
                    accountService.setGiornata(giornataCoppaActive);
                }
                else{
                    giornataCoppaActive=exist;
                }
            }
            vm.nextGames.push(giornataCoppaActive);
        };
        var checkGiornataCampActive = function(){
            var exist = accountService.getGiornata("campionato_"+vm.giornataSerieaActive);
            if(!exist){
                var giornataCampActive=calendarsService.getGiornata("campionato",vm.giornataSerieaActive,true,vm.user.id);
                giornataCampActive.label="Campionato";
                giornataCampActive.id="campionato_"+vm.giornataSerieaActive;
                giornataCampActive.uuid=serviceUUID.create();
                var formazione1=initFormazione(giornataCampActive.casaId);
                formazione1.id=giornataCampActive.casaId;
                giornataCampActive.formazione=[];
                giornataCampActive.formazione.push(formazione1);
                var formazione2=initFormazione(giornataCampActive.trasfertaId);
                formazione2.id=giornataCampActive.trasfertaId;
                giornataCampActive.formazione.push(formazione2);
                giornataCampActive.formazioneOpts=initFormazioneOptions();
                accountService.setGiornata(giornataCampActive);
            }
            else{
                giornataCampActive=exist;
            }
            vm.nextGames.push(giornataCampActive);
        };

        vm.lastGames = [];
        var getLastGiornate = function(){
            var lastGamesCamp = accountService.getGiornata("campionato_"+(vm.giornataSerieaActive-1));
            vm.lastGames.push(lastGamesCamp);
            var lastGamesCoppa = accountService.getGiornata("coppa_"+(vm.giornataSerieaActive-1));
            if(lastGamesCoppa)
                vm.lastGames.push(lastGamesCoppa);
            votiService.getVoti(vm.lastGames[0].id.split("_")[1])
            .then(function(data){
                for(var i=0;i<vm.lastGames.length;i++){
                    checkGiornataVoti(vm.lastGames[i]);
                }
            })
            .catch(function(err){
                console.log(err);
            });
        };
        var checkGiornataVoti = function(giornata){
            var arR = ["p","d","c","a"];
            var giorSerieA = giornata.id.split("_")[1];
            _.forEach(giornata.formazione,function(form){
                for(var i=0;i<arR.length;i++){
                    for(var p=0; p<form.campo[arR[i]].length;p++){
                        var pl = {
                            nome:form.campo[arR[i]][p].name,
                            team:form.campo[arR[i]][p].team.toLowerCase()
                        };
                        var voto = votiService.getVotiPlayer(pl);
                        console.log(voto);
                    }
                }
            });
        };
        var getVoto = function(player){
            var pl = {
                nome:player.name,
                team:player.team.toLowerCase()
            };
            var voto = votiService.getVotiPlayer(vm.giornataSerieaActive,pl);
            voto.then(function(data){
                return data;
            })
            .catch(function(err){
                return err;
            });
            return voto;
        };

        $scope.$on("$destroy",function(){
            checkSetUser();
            checkRemoveUser();
        });

        render();
    }
})()