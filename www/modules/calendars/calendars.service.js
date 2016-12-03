(function(){
    'use strict';
    angular.module("calendarsModule")
    .service('calendarsService',["teamsService","localStorageService", function(teamsService,localStorageService) {
        var vm = this;
        var _arGiornateSeriea = [
            "20/08/2016",
            "23/08/2016",
            "06/09/2016",
            "13/09/2016",
            "20/09/2016",
            "23/09/2016",
            "27/09/2016",
            "05/10/2016",
            "18/10/2016",
            "25/10/2016",
            "28/10/2016",
            "01/11/2016",
            "15/11/2016",
            "22/11/2016",
            "29/11/2016",
            "06/12/2016",
            "13/12/2016",
            "20/12/2016",
            "27/12/2016",
            "10/01/2017",
            "17/01/2017",
            "24/01/2017",
            "31/01/2017",
            "07/02/2017",
            "14/02/2017",
            "21/02/2017",
            "28/02/2017",
            "07/03/2017",
            "14/03/2017",
            "28/03/2017",
            "04/04/2017",
            "11/04/2017",
            "18/04/2017",
            "25/04/2017",
            "02/05/2017",
            "09/05/2017",
            "16/05/2017",
            "23/05/2017"
        ]
        var _giornataSerieaAttiva;
        vm.getGiornataSerieaAttiva = function(){
            var giornata;
            var oggi = moment();
            _.forEach(_arGiornateSeriea,function(value,key){
                var gior = moment(value, "DD/MM/YYYY");
                if(oggi._d<gior._d){
                    giornata=key;
                    return false;
                }
            });
            return giornata;
        };
        var _calendars = localStorageService.get("calendars") || calendars;
        vm.setCalendars = function(type,data){
            if(!type)
                _calendars=data;
            else
                _calendars[type]=data;
            localStorageService.set("calendars",_calendars);
        };
        vm.getCalendars = function(type){
            if(!_calendars)
                return false;
            var cal = type ? _calendars[type] : _calendars;
            return cal;
        };
        vm.getGiornata = function(type,giornata,humanize,user){    
            var cal = type ? _calendars[type] : _calendars["campionato"];
            var giorScelta = _.find(cal.giornate,{"giornata":giornata});
            if(humanize){
                var giornToReturn = vm.renderGiornataInHuman(giorScelta,user);
                return giornToReturn;
            }
            else{
                return giorScelta;
            }
        };
        vm.renderGiornataInHuman = function(giornata,user){
            var teams = teamsService.getTeams();
            var giornToReturn = [];
            var giornUserToReturn;
             _.forEach(giornata.games,function(value,key){
                var obj={};
                obj.casa = _.find(teams,{id:value.casa}).name;
                obj.casaId = _.find(teams,{id:value.casa}).id;
                obj.trasferta = _.find(teams,{id:value.trasferta}).name;
                obj.trasfertaId = _.find(teams,{id:value.trasferta}).id;
                giornToReturn.push(obj);
                if(value.casa===user || value.trasferta===user){
                    giornUserToReturn=obj;
                    giornUserToReturn.num = giornata.id
                }
            });
            if(user)
                return giornUserToReturn;
            return giornToReturn;
        }
    }]);
})();