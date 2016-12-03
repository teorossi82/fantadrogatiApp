(function(){
    'use strict';
    angular.module("mainModule")
    .service('accountService',["teamsService","localStorageService", function(teamsService,localStorageService) {
        var vm = this;
        var _formazioneTipo = localStorageService.get("formazione") || {};
        vm.setFormazioneTipo = function(type,formazione){
            if(!type){
               _formazioneTipo = formazione;
            }
            else{
                _formazioneTipo[type]=formazione;
            }
            localStorageService.set("formazione",_formazioneTipo);
        };
        vm.getFormazioneTipo = function(type){
            if(!type){
               return _formazioneTipo;
            }
            else{
                return _formazioneTipo[type];
            }
        };
        vm.clearFormazioneTipo = function(){
            localStorageService.remove("formazione")
        };
        var _giornateSaved = localStorageService.get("giornateSaved") || [];
        vm.setGiornata = function(formazione){
            var exist=_.find(_giornateSaved,{uuid:formazione.uuid});
            if(exist){
                exist=formazione;
            }
            else{
                _giornateSaved.push(formazione);
            }
            localStorageService.set("giornateSaved",_giornateSaved);
        };
        vm.getGiornata = function(id){
            var formazione = _.find(_giornateSaved,{id:id});
            return formazione;
        };
        vm.getGiornataByUuid = function(uuid){
            var formazione = _.find(_giornateSaved,{uuid:uuid});
            return formazione;
        };
    }]);
})();