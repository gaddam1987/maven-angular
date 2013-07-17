var demoApp = angular.module('nareshApp.Controller',[]);
demoApp.controller('MainController', ['$scope', function($scope) {
    $scope.awesomeThings = [
        'Naresh',
        'NAresh',
        'NAResh'
    ];
}]);