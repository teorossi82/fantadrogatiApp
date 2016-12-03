(function(){
    angular.module("boxErrorModule")
    .directive("boxError",function (){
        return {
            restrict:'E',
            scope: {
                options: '='
            },
            templateUrl:'modules/commons/boxError/boxError.html',
            controller:boxErrorController,
            controllerAs: 'boxErrorCtrl'
        };
    });
    function boxErrorController($scope){
        var vm = this;
        vm.error = $scope.options;
        $scope.$watch('options',function(newVal,oldVal){
            vm.error =newVal;
        }, true);
        vm.closeError = function(){
            $scope.options=null;
        };
    };
})();