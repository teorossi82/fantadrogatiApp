(function(){
    'use strict';
    angular.module("votiModule")    
    .factory('votiFactory', function ($q,AppConfig,$http) {
        return {
            getVoti: function (giornata) {
                var deferred = $q.defer();
                var url = "http://www.gazzetta.it/calcio/fantanews/voti/serie-a-2016-17/giornata-"+giornata;
                var promise = $http({
                    cache: false,
                    url: url, 
                    method: "GET",
                    headers:{}
                });
                promise.then(
                    function(data){
                        deferred.resolve(data.data); 
                    }
                )
                .catch(
                    function(err){
                        deferred.reject(err);
                    }
                );
                return deferred.promise;
            }
        };
    });
})();