(function(){
    angular.module("boxAdvertisingMdl")
    .directive("boxAdvertising",function (){
        return {
            restrict:'E',
            scope: {
                options: '='
            },
            templateUrl:'module/commons/boxAdvertising/boxAdvertising.html',
            controller:boxAdvertisingController,
            controllerAs: 'boxAdvertising'
        };
    });
    function boxAdvertisingController($log,$http,AppConfig,$timeout){
        var vm = this;
        vm.advertisings = null;
        vm.eleActive = null;
        var render = function(){
            getAdvertising();  
        };
        var getAdvertising = function(){
            var promise = $http({
                cache: false,
                url: AppConfig.server + "/api/index.php?cmd=get_banner", 
                method: "GET"
            });
            promise.then(
                function(data){
                    $log.info(data);
                    if(!data.data || data.data=="false"){
                        return;
                    }
                    vm.advertisings = data.data;
                    loadBanner(0);
                }
            )
                .catch(
                function(err){
                    $log.error(err);
                    
                }
            );  
        };
        function loadBanner(num){
            if(!vm.advertisings[num]){
                return;
            }
            vm.eleActive = {
                img: "http://www.youdisco.it/admin/" + vm.advertisings[num].img,
                link: vm.advertisings[num].link
            };
            if((num+1)>=vm.advertisings.length)
                var newNum = 0;
            else
                var newNum = num+1;
            $timeout(function(){
                loadBanner(newNum)
            },3000);
        }
        render();
    };
})();