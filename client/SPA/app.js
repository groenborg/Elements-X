(function () {

    var app = angular.module('EXApp', [
        'ngRoute',
        'EX.controllers',
        'EX.directives',
        'EX.factories'
    ]);

    app.config(function ($routeProvider) {
        $routeProvider.when('/kitchen', {
            templateUrl: 'views/kitchenPage.html',
            controller: 'KitchenCtrl'
        }).when('/buy', {
            templateUrl: 'views/beveragePage.html',
            controller: 'BuyCtrl'
        }).when('/residents', {
            templateUrl: 'views/residentPickerPage.html',
            controller: 'ResidentPickerCtrl'
        }).when('/dashboard', {
            templateUrl: 'views/adminDashboard.html',
            controller: ''
        }).when('/picker/:kitchenNumber', {
            templateUrl: 'views/userCardPickerPage.html',
            controller: 'UserCardPickerCtrl'
        }).when('/buy/:kitchenNumber/:residentId', {
            templateUrl: 'views/beveragePage.html',
            controller: 'BuyCtrl'
        }).otherwise({
            templateUrl: 'views/frontPage.html'
        });

    });

})();


