angular.module('nareshApp',[])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {templateUrl: 'resources/templates/main.html', controller: 'MainController'})
            .otherwise({ redirectTo: '/' });
    }]);