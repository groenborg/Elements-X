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
                        var id = data.data[i]._id;
                        var residentList = data.data[i].residents;
                        console.log(residentList);

                        switch (id) {
                            case 1:
                                storageFactory.storeKitchens("one", residentList);
                                break;
                            case 2:
                                storageFactory.storeKitchens("two", residentList);
                                break;
                            case 3:
                                storageFactory.storeKitchens("three", residentList);
                        }
                    }
                    callback(undefined);
                });
            },
            isLoaded: function () {
                return (storageFactory.getKitchen("one").length != 0 &&
                storageFactory.getKitchen("two").length != 0 &&
                storageFactory.getKitchen("three").length != 0);
            }
        }

    }]);

    app.factory('storageFactory', [function () {

        var kitchenGroup = {
            one: [],
            two: [],
            three: []
        };

        return {
            getKitchen: function (number) {
                return kitchenGroup[number];
            },
            storeKitchens: function (kitchenNumber, residents) {
                switch (kitchenNumber) {
                    case "one":
                        kitchenGroup[kitchenNumber] = residents;
                        break;
                    case "two":
                        kitchenGroup[kitchenNumber] = residents;
                        break;
                    case "three":
                        kitchenGroup[kitchenNumber] = residents;
                        break;
                }
            },
            getResident: function (kitchenNumber, residentId) {
                for (var i = 0; i < kitchenGroup["three"].length; ++i) {
                    if (kitchenGroup["three"][i].resident_id == residentId) {
                        return kitchenGroup["three"][i];
                    }
                }
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



