(function () {

    var app = angular.module('EX.factories', []);

    app.factory('residentRestFactory', ['$http', function ($http) {

        // reserved space for volatile variables

        var residentCache = {};

        return {
            getOneResident: function (ID, callback) {
                $http.get('url'+ID).success(function (data) {

                }).error(function (err) {

                });
            }
        }

    }]);

})();



