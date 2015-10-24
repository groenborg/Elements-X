(function () {

    var app = angular.module('EX.factories', []);


    app.factory("controllerFactory", ['storageFactory', 'webserviceFactory', function (storageFactory, webserviceFactory) {

        return {

            updateKitchenData: function (callback) {

                webserviceFactory.getKitchenGroups(function (err, data) {
                    if (err) {
                        return callback(err);
                    }
                    for (var i = 0; i < 3; ++i) {
                        var kitchenNumber = data.data[i]._id;
                        var residentList = data.data[i].residents;
                        storageFactory.storeKitchens(kitchenNumber, residentList);
                    }
                    callback(undefined, data);
                });
            },
            onLoad: function (scope, kitchenNumber) {

                if (storageFactory.getKitchen(1).length == 0 &&
                    storageFactory.getKitchen(2).length == 0 &&
                    storageFactory.getKitchen(3).length == 0) {
                    this.updateKitchenData(function (err, data) {
                        if (err) {
                            scope.err = "No residents found"
                        } else {
                            scope.kitchenResidents = storageFactory.getKitchen(kitchenNumber);
                        }
                    });

                } else {
                    scope.kitchenResidents = storageFactory.getKitchen(kitchenNumber);

                }
            }
        }

    }]);

    app.factory('storageFactory', [function () {

        var kitchenGroup = {
            one: [],
            two: [],
            three: []
        };

        var getNumberInString = function (number) {
            switch (parseInt(number)) {
                case 1:
                    return "one";
                case 2:
                    return "two";
                case 3:
                    return "three";
            }
        };

        return {
            getKitchen: function (number) {
                return kitchenGroup[getNumberInString(number)];
            },
            storeKitchens: function (kitchenNumber, residents) {
                kitchenGroup[getNumberInString(kitchenNumber)] = residents;
            },
            getResident: function (kitchenNumber, residentId) {
                var number = getNumberInString(kitchenNumber);
                for (var i = 0; i < kitchenGroup[number].length; ++i) {
                    if (kitchenGroup[number][i].resident_id == residentId) {
                        return kitchenGroup[number][i];
                    }
                }
            },
            savePreferredKitchen: function (key, value) {
                window.localStorage.setItem(key, value)
            },
            clearPreferredKitchen: function () {
             
            }
        }
    }]);


    app.factory('webserviceFactory', ['$http', function ($http) {

        return {
            getOneResident: function (ID, callback) {
                $http({
                    method: 'GET',
                    url: 'api/url' + ID
                }).then(function success() {

                }, function error() {

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
            },
            getKitchenGroups: function (callback) {
                $http({
                    method: 'GET',
                    url: '/api/getKitchenGroups'
                }).then(function success(response) {
                    callback(undefined, response);
                }, function error(response) {
                    callback(response);
                });
            }
        };
    }]);

})();



