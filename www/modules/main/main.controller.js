(function(){
    angular.module("mainModule")
        .controller("mainController",["$scope","$log","$state","mainService", mainController]);
    function mainController($scope,$log,$state,mainService){
        var vm = this;
        function render(){
            $state.go("account");
        }
        render();
    }
})();