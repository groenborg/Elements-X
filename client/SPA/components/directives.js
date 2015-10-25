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
})();
