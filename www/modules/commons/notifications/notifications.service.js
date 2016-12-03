(function(){
    'use strict';
    angular.module("notificationsModule")
        .service('notificationsService', function(AppConfig,localStorageService,$rootScope,$cordovaPush,$http,$log) {
        var that=this;
        this.initIdentifierOperation = false;
        this.getIdentifier = function(){
            var identifier = localStorageService.get("not.identifier");
            return identifier;
        };
        this.setIdentifier = function(identifier,emit){
            localStorageService.set("not.identifier",identifier);
            if(emit)
                $rootScope.$broadcast('notificationsServiceSetIdentifier',identifier);
        };
        this.removeIdentifier = function(emit){
            localStorageService.remove("not.identifier");
            if(emit)
                $rootScope.$broadcast('notificationsServiceRemoveIdentifier');
        };
        this.initIdentifier = function(platform,emit){
            var iosConfig = {
                "badge": true,
                "sound": true,
                "alert": true,
            };
            var androidConfig = {
                "senderID": "314091998234",
            };
            var config = platform === "ios" ? iosConfig : androidConfig;
            $cordovaPush.register(config).then(function(deviceToken) {
                var oldToken = that.getIdentifier();
                if(oldToken===deviceToken)
                    return;
                that.initIdentifierOperation=true;
                if(emit)
                    $rootScope.$broadcast('notificationsServiceInitIdentifier',deviceToken);
            }, function(err) {
                that.initIdentifierOperation=true;
                that.removeIdentifier(true);
            });
        };
        this.postIdentifier = function(user,identifier,so,nazione){
            var promise = $http({
                cache: false,
                url: AppConfig.server + "/api/index.php?cmd=set_device&id_user=" + user + "&id=" + identifier + "&so=" + so + "&nazione=" + nazione,
                method: "GET"
            });
            return promise;
            /*promise.then(
                function(data){
                    $log.info(data);
                    loading.hide();
                    if(data.data && data.data!=="false"){
                        
                    }
                }
            )
                .catch(
                function(err){
                    $log.error(err);
                    return;
                }
            );*/
        };
    });
})()