(function () {

    var app = angular.module('ERPApp', [
        'ngRoute',
        'EXApp.controllers',
        'EXApp.directives',
        'EXApp.factories'
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
        }).otherwise({
            templateUrl: 'views/frontPage.html'
        });

    });

})();


