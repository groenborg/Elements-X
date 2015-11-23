'use strict';

(function () {

    var app = angular.module('EX.directives', []);

    app.directive('navigation', function () {
        return {
            restrict: 'A',
            templateUrl: '../SPA/directives/navigation.html'
        }
    });

    app.directive('footer', function () {
        return {
            restrict: 'A',
            templateUrl: '../SPA/directives/footer.html'
        }
    });

    app.directive('dashboardSidebar', function () {
        return {
            restrict: 'A',
            templateUrl: '../SPA/directives/dashboardSidebar.html'
        }
    });


    app.directive('createResidentForm', function () {
        return {
            restrict: 'EA',
            templateUrl: "../SPA/directives/adminCreateResidentForm.html",
            scope: false,
            controller: function ($scope) {

            },
            link: function ($scope, element, attributes) {

            }
        }
    });


    app.directive('createAssortmentForm', function () {
        return {
            restrict: 'EA',
            templateUrl: "../SPA/directives/adminCreateAssortmentForm.html",
            scope: false,
            controller: function ($scope) {

            },
            link: function ($scope, element, attributes) {

            }
        }
    });


    app.directive('adminDashboardMain', function () {
        return {
            restrict: "EA",
            templateUrl: "../SPA/directives/adminDashboardMain.html",
            scope: false,
            controller: function ($scope) {

            },
            link: function ($scope, element, attributes) {

            }
        }
    });

})();
