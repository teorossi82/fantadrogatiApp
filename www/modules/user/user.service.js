(function(){
    'use strict';
    angular.module("userModule")
    .service('userService', function(localStorageService,$rootScope) {
        this.getUser = function(){
            var user = localStorageService.get("user") || {"username":"cingleoros","password":"password","_id":1,"id":1,"nome":"Cingolani Leoni Rossi"};
            return user;
        };
        this.setUser = function(user,emit){
            localStorageService.set("user",user);
            if(emit)
                $rootScope.$broadcast('userServiceSetUser',user);
        };
        this.removeUser = function(emit){
            localStorageService.remove("user");
            if(emit)
                $rootScope.$broadcast('userServiceRemoveUser');
        };
    });
})()