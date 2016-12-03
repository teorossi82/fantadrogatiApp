(function(){
    angular.module("formazioneModule")
    .directive("formazione",function (){
        return {
            restrict:'E',
            scope: {
                options: '=',
                team:'=',
                uuid:'=',
                formazione1:'=',
                formazione2:'='
            },
            templateUrl:'modules/commons/formazione/formazione.html',
            controller:formazioneController,
            controllerAs: 'vm'
        };
    });
    function formazioneController($scope,$ionicPopover,$timeout,formazioneService,$ionicModal){
        var vm = this;

        var render = function(){
        };
        var uuid=$scope.uuid;
        vm.options=$scope.options;
        var setCampoHeight = function(){
            vm.campoHeight = vm.options && vm.options.height || 500;
            vm.campoHeight = vm.options && vm.options.view.moduli ? vm.campoHeight-30 : vm.campoHeight;
            vm.campoHeight = vm.options && vm.options.view.menu ? vm.campoHeight-30 : vm.campoHeight;
        };
        vm.campoMarginRight = vm.options && vm.options.view.panca ? 50 : 0;

        vm.formazione1=$scope.formazione1;
        vm.formazione2=$scope.formazione2;

        vm.formHeight = vm.formazione2 ? "50%" : "100%";

        vm.getImagePlayer = function(play){
            var img = play && play.team ? "<img src='img/maglie/" + play.team + ".jpg' />" : "<span class='ion-android-contact'></span>";
            return img;
        };

        var popoverName;
        vm.openPopoverName = function(ev,player){
            var popoverNameTpl = '<ion-popover-view class="nome-giocatore-popover"><ion-content><b>'+player.name+'</b><br/><img src="img/teams/' + player.team + '.jpg" />'+player.team+'</ion-content></ion-popover-view>';
            popoverName = $ionicPopover.fromTemplate(popoverNameTpl, {
                scope: $scope
            });
            popoverName.show(ev);
        };

        var clickPlayerFunctions = {
            "vedi":function(ev,player,position){vm.openPopoverName(ev,player,position)},
            "imposta":function(ev,player,position){
                vm.manageModalTeam.openModal(player,position);
            }
        };

        vm.onClickPlayer = function(ev,player,position){
            clickPlayerFunctions[vm.options.state](ev,player,position);
        };

        var refreshiScroll = function (wrapper,time){
            $timeout(function(){
                if($scope.myScroll[wrapper])
                    $scope.myScroll[wrapper].refresh();
            },time);
        };

        $scope.$watch('vm.options.state',function(newValue,oldValue){
            setCampoHeight();
            if(newValue==='imposta'){
                $scope.myScrollOptions = {
                    'wrapper-moduli': {
                        scrollX:true
                    }
                };
            }
            if($scope.myScroll){
                refreshiScroll('wrapper-panca-1',400);
                refreshiScroll('wrapper-panca-2',400);
            }
        });

        vm.moduli = formazioneService.getModuli();

        vm.setModulo = function(mod){
            vm.formazione1.modulo=mod;
            var arR=[{corto:"d",lungo:"difensore"},{corto:"c",lungo:"centrocampista"},{corto:"a",lungo:"attaccante"}];
            for(var i=0;i<3;i++){
                var numR=parseInt(vm.formazione1.modulo.split("-")[i]);
                var rol=arR[i];
                if(vm.formazione1.campo[rol.corto].length!==numR){
                    if(vm.formazione1.campo[rol.corto].length<numR){
                        var newP=_.filter(vm.formazione1.panca,{ruolo:arR[i].lungo});
                        newP = newP.slice(0,(numR-vm.formazione1.campo[rol.corto].length));
                        _.pullAll(vm.formazione1.panca,newP);
                        vm.formazione1.campo[rol.corto] = vm.formazione1.campo[rol.corto].concat(newP);
                        var allRuolo = _.filter(team.rosa,{ruolo:arR[i].lungo});
                        var allInPanca = _.filter(vm.formazione1.panca,{ruolo:arR[i].lungo});
                        var allInCampo = vm.formazione1.campo[rol.corto].concat(allInPanca);
                        _.pullAll(allRuolo,allInCampo);
                        var toPanca = allRuolo.splice(0,newP.length);
                        var indexPanca = _.findIndex(vm.formazione1.panca,{ruolo:arR[i].lungo});
                        _.forEach(toPanca,function(value,key){
                            vm.formazione1.panca.splice(indexPanca+key,0,value);
                        })
                    }
                    else{
                        var exceded = vm.formazione1.campo[rol.corto].length-numR;
                        var oldP = vm.formazione1.campo[rol.corto].splice(vm.formazione1.campo[rol.corto].length-exceded,exceded);
                        //var newP = _.filter(vm.formazione1.panca,{ruolo:arR[i].lungo});
                        _.forEach(oldP,function(value,key){
                            var changed=false;
                            for(var i=0;i<vm.formazione1.panca.length;i++){
                                if(!changed && vm.formazione1.panca[i].ruolo===value.ruolo){
                                    vm.formazione1.panca.splice(i,0,value);
                                    changed=true;
                                }
                                else{
                                    if(changed && (vm.formazione1.panca[i-1].ruolo!==vm.formazione1.panca[i].ruolo || (i===vm.formazione1.panca.length-1))){
                                        vm.formazione1.panca.splice(i-1,1);
                                        return;
                                    }
                                }
                            }
                        });
                    }
                }
            }
        };

        vm.save = function(){
            $scope.$emit("formazione:save",uuid,vm.formazione1);
        };

        vm.copy = function(){
            $scope.$emit("formazione:copy",uuid,vm.formazione1);
        };

        vm.share = function(){
            $scope.$emit("formazione:share",uuid,vm.formazione1);
        };

        var team = $scope.team;
        var modalTeam;
        $ionicModal.fromTemplateUrl('modal-team.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            modalTeam = modal;
        });

        vm.manageModalTeam = {
            openModal: function(player,position) {
                vm.manageModalTeam.playerActive=player;
                vm.manageModalTeam.positionPlayerActive=position;
                vm.manageModalTeam.lista=[];
                var disponibili = position==="campo" ? _.filter(team.rosa,{'ruolo':player.ruolo}) : team.rosa;
                disponibili = _.clone(disponibili);
                var itSelf = _.findIndex(disponibili,{"uuid":player.uuid});
                if(itSelf!==-1)
                    disponibili.splice(itSelf,1);
                _.forEach(disponibili,function(value){
                    var exist = _.find(vm.formazione1.campo[value.ruolo[0]],{uuid:value.uuid})
                    if(!exist){
                        //if(position==='campo')
                            vm.manageModalTeam.lista.push(value);
                        // else{
                        //     var existInPanca = _.find(vm.formazione1.panca,{uuid:value.uuid})
                        //     if(!existInPanca)
                        //         vm.manageModalTeam.lista.push(value);
                        // }
                    }
                })
                modalTeam.show();
            },
            closeModal: function() {
                modalTeam.hide();
            },
            playerActive:null,
            positionPlayerActive:null,
            lista:[],
            setGiocatore:function(player){
                schieraPlayer(player,vm.manageModalTeam.playerActive,vm.manageModalTeam.positionPlayerActive);
                vm.manageModalTeam.closeModal();
            }
        };

        var schieraPlayer = function(newP,oldP,position){
            var arr = position==="campo" ? vm.formazione1.campo[oldP.ruolo[0]] : vm.formazione1.panca;
            var index = _.findIndex(arr,{uuid:oldP.uuid});
            var inPanca = _.findIndex(vm.formazione1.panca,{uuid:newP.uuid});
            arr.splice(index, 1, newP);
            if(inPanca!==-1)
                vm.formazione1.panca.splice(inPanca,1,oldP);
        };

        $scope.$on('$destroy', function() {
            if(popoverName)
                popoverName.remove();
        });

        render();
    };
})();