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


    app.controller('AppCtrl', ['$scope', '$window', '$location', 'webserviceFactory', 'notificationService', function ($scope, $window, $location, webserviceFactory, notificationService) {
        //Declarative variables
        $scope.admin = {
            first_name: "",
            email: "",
            access_level: 0
        };
        $scope.signInObject = {};

        var msgService = notificationService;

        ($scope.refresh = function () {
            if ($window.sessionStorage.token) {
                var encodedProfile = $window.sessionStorage.token.split('.')[1];
                var profile = JSON.parse(base64Decode(encodedProfile));
                $scope.admin.first_name = profile.first_name;
                $scope.admin.email = profile.email;
                $scope.admin.access_level = profile.access_level;
            }
        })();

        $scope.login = function () {
            webserviceFactory.loginRequest($scope.signInObject, function (err, data) {
                if (err) {
                    msgService.notify('Error', err.data.err, 'error');
                    return;
                }
                var encodedProfile = data.data.token.split('.')[1];
                var profile = JSON.parse(base64Decode(encodedProfile));
                $window.sessionStorage.token = data.data.token;
                $window.sessionStorage.al = profile.access_level;
                $scope.admin.first_name = profile.first_name;
                $scope.admin.email = profile.email;
                $scope.admin.access_level = profile.access_level;

                msgService.notify($scope.admin.first_name, 'Welcome', "success");
                if ($scope.admin.access_level > 1) {
                    $location.path("/dashboard");
                } else if ($scope.admin.access_level == 1) {
                    $location.path("/bar");
                }
            });
        };


        $scope.logOut = function () {
            $scope.admin.first_name = "";
            $scope.admin.email = "";
            $scope.admin.access_level = 0;
            delete $window.sessionStorage.token;
            delete $window.sessionStorage.al; // access_level
            msgService.notifySuccess("Logged Out");
            $location.path("/home");
        };


        $scope.isVisible = function (visibilityLevel) {
            return $scope.admin.access_level >= visibilityLevel;
        };

    }]);


})();
