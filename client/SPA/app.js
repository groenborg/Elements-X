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
        }).otherwise({
            templateUrl: 'views/frontPage.html'
        });

    });

})();


