(function () {

    var app = angular.module('EXApp', [
        'ngRoute',
        'toastr',
        'chart.js',
        'EX.controllers',
        'EX.security',
        'EX.directives',
        'EX.factories',
        'EX.services',
        'EX.constants'
    ]);

    app.config(function ($routeProvider) {
        $routeProvider.when('/kitchen', {
            templateUrl: 'views/userKitchenSelectionPage.html',
            controller: 'KitchenCtrl'
        }).when('/buy', {
            templateUrl: 'views/userShoppingPage.html',
            controller: 'UserShoppingCtrl'
        }).when('/picker/:kitchenNumber', {
            templateUrl: 'views/userSelectionPage.html',
            controller: 'UserCardPickerCtrl'
        }).when('/buy/:kitchenNumber/:residentId', {
            templateUrl: 'views/userShoppingPage.html',
            controller: 'UserShoppingCtrl'
        }).when('/login', {
            templateUrl: "views/login.html"
        }).when('/bar', {
            templateUrl: 'views/barSelectionPage.html',
            controller: 'BarSelectionCtrl',
            resolve: {
                auth: function (authInspector) {
                    authInspector.authBar();
                }
            }
        }).when('/history/:residentId', {
            templateUrl: 'views/adminHistoryView.html',
            controller: 'HistoryCtrl',
            resolve: {
                auth: function (authInspector) {
                    authInspector.authBar();
                }
            }
        }).when('/dashboard', {
            templateUrl: 'views/adminDashboard.html',
            controller: 'DashboardCtrl',
            resolve: {
                auth: function (authInspector) {
                    authInspector.authAdmin();
                }
            }
        }).when('/dashboard/:resident', {
            templateUrl: 'views/adminDashboard.html',
            controller: 'DashboardCtrl',
            resolve: {
                auth: function (authInspector) {
                    authInspector.authAdmin();
                }
            }
        }).when('/dashboard/kitchen/:kitchenNumber', {
            templateUrl: "views/adminDashboardKitchen.html",
            controller: "DashBoardKitchenCtrl",
            resolve: {
                auth: function (authInspector) {
                    authInspector.authAdmin();
                }
            }
        }).when('/accounts', {
            templateUrl: "views/adminAccounts.html",
            controller: "AccountCtrl",
            resolve: {
                auth: function (authInspector) {
                    authInspector.authAdmin();
                }
            }
        }).when('/products', {
            templateUrl: "views/adminProductView.html",
            controller: "AccountCtrl",
            resolve: {
                auth: function (authInspector) {
                    authInspector.authAdmin();
                }
            }
        }).otherwise({
            templateUrl: 'views/userKitchenSelectionPage.html',
            controller: 'KitchenCtrl'
        });

    });

    app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    }])

})();


