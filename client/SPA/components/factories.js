(function () {

    var app = angular.module('EX.factories', []);


    app.factory('residentRestFactory', ['$http', function ($http) {

        return {
            getOneResident: function (ID, callback) {
                $http.get('url' + ID).success(function (data) {

                }).error(function (err) {

                });
            },
            getAllResidents: function (callback) {
                $http({
                    method: 'GET',
                    url: 'api/getResidents'
                }).then(function success(response) {
                    callback(response);
                }, function error(response) {
                    callback(response);
                });
            }
        };


    }]);

})();



