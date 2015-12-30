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
            templateUrl: 'views/userKitchenSelectionPage.html',
            controller: 'KitchenCtrl'
        }).when('/buy', {
            templateUrl: 'views/userShoppingPage.html',
            controller: 'UserShoppingCtrl'
        }).when('/residents', {
            templateUrl: 'views/barSelectionPage.html',
            controller: 'BarSelectionCtrl'
        }).when('/dashboard', {
            templateUrl: 'views/adminDashboard.html',
            controller: 'DashboardCtrl'
        }).when('/dashboard/kitchen/:kitchenNumber', {
            templateUrl: "views/adminDashboardKitchen.html",
            controller: "DashBoardKitchenCtrl"
        }).when('/inventory',{
            templateUrl:"views/adminInventory.html",
            controller:"InventoryCtrl"
        }).when('/picker/:kitchenNumber', {
            templateUrl: 'views/userSelectionPage.html',
            controller: 'UserCardPickerCtrl'
        }).when('/buy/:kitchenNumber/:residentId', {
            templateUrl: 'views/userShoppingPage.html',
            controller: 'UserShoppingCtrl'
        }).when('/login',{
            templateUrl:"views/login.html",
            controller:""
        }).otherwise({
            templateUrl: 'views/userKitchenSelectionPage.html',
            controller: 'KitchenCtrl'
        });

    });

})();


