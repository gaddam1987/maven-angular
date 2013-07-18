angular.module('nareshApp')
    .service('ExampleService', function () {
        console.log('Service called');
        this.sayHello = function(name) {
        console.log(name);
        };
    });