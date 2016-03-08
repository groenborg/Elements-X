(function () {

    var app = angular.module('EX.security', []);


    function base64Decode(str) {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
        }
        return window.atob(output);
    }


    app.controller('AppCtrl', ['$scope', '$rootScope', '$window', '$location', 'webserviceFactory', 'notificationService', function ($scope, $rootScope, $window, $location, webserviceFactory, notificationService) {
        //Declarative variables
        $scope.admin = {
            first_name: "",
            email: "",
            access_level: 0
        };
        $scope.signInObject = {};
        $rootScope.admin = {};
        var message = new notificationService();

        ($scope.refresh = function () {
            if ($window.sessionStorage.token) {
                var encodedProfile = $window.sessionStorage.token.split('.')[1];
                var profile = JSON.parse(base64Decode(encodedProfile));
                $scope.admin.first_name = profile.first_name;
                $scope.admin.email = profile.email;
                $scope.admin.access_level = profile.access_level;
                $scope.admin.resident_id = profile.resident_id;
                $rootScope.admin.first_name = profile.first_name;
                $rootScope.admin.email = profile.email;
                $rootScope.admin.access_level = profile.access_level;
                $rootScope.admin.resident_id = profile.resident_id;
            }
        })();

        $scope.login = function () {
            webserviceFactory.loginRequest($scope.signInObject, function (err, data) {
                if (err) {
                    message.notify('Error', err.data.err, 'error');
                    return;
                }
                var encodedProfile = data.data.token.split('.')[1];
                var profile = JSON.parse(base64Decode(encodedProfile));
                $window.sessionStorage.token = data.data.token;
                $window.sessionStorage.al = profile.access_level;
                $scope.admin.first_name = profile.first_name;
                $scope.admin.email = profile.email;
                $scope.admin.access_level = profile.access_level;
                $scope.admin.resident_id = profile.resident_id;
                $rootScope.admin.first_name = profile.first_name;
                $rootScope.admin.email = profile.email;
                $rootScope.admin.access_level = profile.access_level;
                $rootScope.admin.resident_id = profile.resident_id;

                message.greetings($scope.admin.first_name);
                if ($scope.admin.access_level > 1) {
                    $location.path("/dashboard");
                } else if ($scope.admin.access_level == 1) {
                    $location.path("/bar");
                }
            });
        };


        $scope.logOut = function () {
            message.farewell($scope.admin.first_name);
            $scope.admin.first_name = "";
            $scope.admin.email = "";
            $scope.admin.access_level = 0;
            $scope.admin.resident_id = null;
            $rootScope.admin.first_name = null;
            $rootScope.admin.email = null;
            $rootScope.admin.access_level = null;
            $rootScope.admin.resident_id = null;
            delete $window.sessionStorage.token;
            delete $window.sessionStorage.al; // access_level
            $location.path("/home");
        };


        $scope.isVisible = function (visibilityLevel) {
            return $scope.admin.access_level >= visibilityLevel;
        };

    }]);


})();
