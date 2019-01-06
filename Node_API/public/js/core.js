var app=angular.module('scotchEffort', ['effortController', 'effortService','ngRoute','uigridCtrl']);
app.config([ '$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.when('/success', {
            templateUrl : 'hello.html',
            controller : 'uigridEffortCtrl'
        })
        $routeProvider.when('/effortgrid', {
            templateUrl : 'effortgrid.html',
            controller : 'mainController'
        })
        $routeProvider.when('/login', {
            templateUrl : 'login.html',
            controller : 'mainController'
        })
            $routeProvider.when('/addProject', {
                templateUrl : 'addProject.html',
                controller : 'mainController'
            }) 
             $routeProvider.when('/admin', {
                templateUrl : 'admin.html'
            })
        $routeProvider.when('/', {
            templateUrl : 'login.html',
            controller : 'mainController'
        }).otherwise({
            redirectTo : 'index.html'
        });
        //$locationProvider.html5Mode(true); //Remove the '#' from URL.
    }
]);
