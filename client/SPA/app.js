(function () {

    var app = angular.module('EXApp', [
        'ngRoute',
        'toastr',
        'chart.js',
        'EX.controllers',
        'EX.directives',
        'EX.factories',
        'EX.services'

    ]);

    app.config(function ($routeProvider) {
        $routeProvider.when('/kitchen', {
            templateUrl: 'views/kitchenPage.html',
            controller: 'KitchenCtrl'
        }).when('/buy', {
            templateUrl: 'views/userShoppingPage.html',
            controller: 'UserShoppingCtrl'
        }).when('/residents', {
            templateUrl: 'views/residentPickerPage.html',
            controller: 'ResidentPickerCtrl'
        }).when('/dashboard', {
            templateUrl: 'views/adminDashboard.html',
            controller: 'DashboardCtrl'
        }).when('/picker/:kitchenNumber', {
            templateUrl: 'views/userCardPickerPage.html',
            controller: 'UserCardPickerCtrl'
        }).when('/buy/:kitchenNumber/:residentId', {
            templateUrl: 'views/userShoppingPage.html',
            controller: 'UserShoppingCtrl'
        }).otherwise({
            templateUrl: 'views/kitchenPage.html',
            controller: 'KitchenCtrl'
        });

    });

})();


