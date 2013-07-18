var demoApp = angular.module('nareshApp');
demoApp.controller('MainController', ['$scope', 'ExampleService', function ($scope, ExampleService) {
    $scope.awesomeThings = [
        'Naresh',
        'NAresh',
        'NAResh'
    ];
    ExampleService.sayHello();
}]);