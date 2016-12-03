(function(){
    'use strict';
    angular.module("utilsModule",[
    ])    
    .factory('sharedProperties', function () {
        var property = {};
        return {
            getProperty: function (key) {
                return property[key];
            },
            setProperty: function(key,value) {
                property[key] = value;
            }
        };
    })
    .factory('getAllByKey', function() {
        return function(input, key, value) {
            var len=input.length, arObj = [];
            for (var i=0; i<len; i++) {
                if (input[i][key] == value) {
                    arObj.push(input[i]);
                }
            }
            return arObj;
        };
    })
    .factory('getByKey', function() {
        return function(input, key, value) {
            var len=input.length, arObj = [];
            for (var i=0; i<len; i++) {
                if (input[i][key] == value) {
                    return input[i];
                }
            }
            return false;
        };
    })
    .factory('getByDoubleKey', function() {
        return function(input, key1, value1, key2, value2) {
            var len=input.length;
            for (var i=0; i<len; i++) {
                if (input[i][key1] === value1 && input[i][key2] === value2) {
                    return input[i];
                }
            }
            return false;
        };
    })
    .service('serviceUUID', function() {
        this.create = function() {
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
            uuid = uuid.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
            return uuid;
        };
    })
    .factory('getUrlParamByName', function(){
        return function (name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.href);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        };
    })
    .factory('getSecondsFromMilliseconds', function(){
        return function(init){
            var now = new Date().getTime();
            var delta = now - init;
            var seconds = parseInt(delta/1000);
            return seconds;
        };
    })
    .filter('linkyWithHtml', function($filter) {
        return function(value) {
            if(!value)
                return false;
            var linked = $filter('linky')(value);
            console.log(linked);
            var replaced = linked.replace(/\&gt;/g, '>');
            console.log(replaced);
            return replaced;
        };
    })
    .directive('loadSrc', function() {
        return {
            link: function(scope, element, attrs) {
                var tmpImg = new Image() ;
                tmpImg.src = attrs.loadSrc;
                tmpImg.onload = function() {
                    if (attrs.src != attrs.loadSrc) {
                        attrs.$set('src', attrs.loadSrc);
                    }
                } ;
            }
        };
    })
    .directive('errSrc', function() {
        return {
            link: function(scope, element, attrs) {
                element.bind('error', function(event) {
                    if (attrs.src != attrs.errSrc) {
                        console.log(event);
                        attrs.$set('src', attrs.errSrc);
                    }
                });
            }
        };
    })
    .filter('normalizeData', function($filter) {
        return function(value,style) {
            var data = new Date(value.replace(" ","T"));
            var normalized = $filter('date')(data, style);
            return normalized;
        };
    })
    .service('loading', function($ionicLoading){
        var loading = {
            show: function() {
                $ionicLoading.show({
                    template: '<ion-spinner icon="crescent"></ion-spinner> Caricamento dati...',
                    noBackdrop:true
                });
            },
            hide: function(){
                $ionicLoading.hide();
            }
        };
        return loading;
    })
    .service('openBrowser', function($cordovaInAppBrowser,$log){
        return function(url,target,loc,toolbar){
            var options = {
                location: loc,
                clearcache: 'yes',
                toolbar: toolbar
            };
            $cordovaInAppBrowser.open(url, target, options)
                .then(function(event) {
                    $log.info(event);
                })
                .catch(function(event) {
                    $log.error(event);
                });  
        };
    })
    .filter('addServerUrl', function(AppConfig) {
        return function(value) {
            var url = AppConfig.server + "/admin/" + value;
            return url;
        };
    })
    .service('transformTeams', function(){
        return function(){
            _.forEach(teams,function(team,key){
                _.forEach(team.rosa,function(value,key){
                    var name=value.giocatore.toLowerCase().replace(".","");
                    _.forEach(players,function(value1,key){
                        if(value1.giocatore.toLowerCase().indexOf(name)!==-1){
                            if(value.ruolo[0]===value1.ruolo.toLowerCase()){
                                value.name=value1.giocatore;
                                value.team=value1.squadra;
                                value1.uuid=value.uuid;
                            }
                        }
                    })
                })
             })
        }
    })
})();