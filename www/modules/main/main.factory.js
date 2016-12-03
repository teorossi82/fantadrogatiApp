(function(){
    'use strict';
    angular.module("mainModule")    
    .factory('mainFactory', function ($q,AppConfig,$http) {
        return {
            getData: function (type) {
                var deferred = $q.defer();
                var promise = $http({
                    cache: false,
                    url: AppConfig.server + "/data/"+type, 
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