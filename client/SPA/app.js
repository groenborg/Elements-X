(function () {

    var app = angular.module('ERPApp', [
        'ngRoute',
        'ERPApp.controllers',
        'ERPApp.directives'
    ]);

    app.config(function ($routeProvider) {
        $routeProvider.when('/kitchen', {
            templateUrl: 'views/kitchenPage.html',
            controller: 'KitchenCtrl'
        }).when('/buy', {
            templateUrl: 'views/beveragePage.html',
            controller: 'BuyCtrl'
        }).otherwise({
            templateUrl: 'views/frontPage.html'
        });

    });

})();


