(function () {

    var app = angular.module('EX.factories', []);


    app.factory("controllerFactory", ['storageFactory', 'webserviceFactory', function (storageFactory, webserviceFactory) {

        return {

            updateKitchenData: function (callback) {

                webserviceFactory.getKitchenGroups(function (err, data) {
                    if (err) {
                        return callback(err);
                    }
                    for (var i = 0; i < data.data.length; ++i) {
                        var kitchenNumber = data.data[i]._id;
                        var residentList = data.data[i].residents;
                        storageFactory.storeKitchens(kitchenNumber, residentList);
                    }
                    callback(undefined, data);
                });
            },
            onLoad: function (scope, kitchenNumber) {

                if (storageFactory.isKitchensStored()) {
                    scope.kitchenResidents = storageFactory.getKitchen(kitchenNumber);
                } else {
                    this.updateKitchenData(function (err, data) {
                        if (err) {
                            scope.err = "No residents found"
                        } else {
                            scope.kitchenResidents = storageFactory.getKitchen(kitchenNumber);
                        }
                    });
                }
            },
            onLoadKitchens: function (one, two, three, scope, callback) {
                if (storageFactory.isKitchensStored()) {
                    scope[one] = storageFactory.getKitchen(1);
                    scope[two] = storageFactory.getKitchen(2);
                    scope[three] = storageFactory.getKitchen(3);
                    callback();
                } else {
                    this.updateKitchenData(function (err) {
                        if (err) return callback(err);
                        scope[one] = storageFactory.getKitchen(1);
                        scope[two] = storageFactory.getKitchen(2);
                        scope[three] = storageFactory.getKitchen(3);
                        callback()
                    });
                }
            },
            onLoadAssortment: function (keyProperty, scope, callback) {
                if (storageFactory.getAssortmentItems().length != 0) {
                    scope[keyProperty] = storageFactory.getAssortmentItems();
                } else {

                    webserviceFactory.getAllAssortmentItems(function (err, data) {
                        if (err) {
                            return callback(err);
                        }
                        scope[keyProperty] = data.data;
                        storageFactory.storeAssortmentItems(data.data);
                        return callback(undefined, data)
                    });
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

        var assortmentItems = [];

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
            isKitchensStored: function () {
                return kitchenGroup.one.length != 0 &&
                    kitchenGroup.two.length != 0 &&
                    kitchenGroup.three.length != 0;
            },
            getAssortmentItems: function () {
                return assortmentItems;
            },
            storeAssortmentItems: function (assortmentItemObj) {
                assortmentItems = assortmentItemObj;
            }

        }
    }]);

    app.factory('adminFactory', ['webserviceFactory', 'storageFactory', function (webserviceFactory, storageFactory) {
        return {

            onLoadTransactions: function (errorProperty, dataProperty, scope, callback) {
                webserviceFactory.getAllAssortmentItems(function (err, data) {
                    if (err) {
                        return scope[errorProperty] = {error: "An error occured"};
                    }
                    scope[dataProperty] = data.data;
                    if (callback) return callback();
                });
            },
            onLoadGetPurchase: function (callback) {
                webserviceFactory.getAllTransactions(callback);
            },
            refillTransaction: function (refill, callback) {
                webserviceFactory.refillTransaction(refill, callback);
            },
            createResident: function (residentDTO, callback) {
                webserviceFactory.createResidentRequest(residentDTO, callback);
            },
            createAssortmentItem: function (item, callback) {
                webserviceFactory.createAssortmentRequest(item, callback);
            }
        }
    }]);

    app.factory('webserviceFactory', ['$http', function ($http) {

        return {
            getAllResidents: function (callback) {
                $http({
                    method: 'GET',
                    url: 'api/getResidents'
                }).then(function success(response) {
                    callback(undefined, response);
                }, function error(response) {
                    callback(response);
                });
            },
            getKitchenGroups: function (callback) {
                $http({
                    method: 'GET',
                    url: '/api/getKitchenGroups'
                }).then(function success(response) {
                    console.log(response);
                    callback(undefined, response);
                }, function error(response) {
                    callback(response);
                });
            },
            getAllAssortmentItems: function (callback) {
                $http({
                    method: 'GET',
                    url: '/api/assortment/all'
                }).then(function success(data) {
                    callback(undefined, data)
                }, function error(data) {
                    callback(data)
                });
            },
            getAllTransactions: function (callback) {
                $http({
                    method: 'GET',
                    url: 'admin/transaction/get/10'
                }).then(function success(data) {
                    callback(undefined, data)
                }, function error(data) {
                    callback(data)
                });
            },
            purchaseTransaction: function (purchase, callback) {
                $http({
                    method: 'POST',
                    url: '/api/user/purchase',
                    data: purchase
                }).then(function success(response) {
                    callback(undefined, response);
                }, function error(response) {
                    callback(response);
                });
            },
            refillTransaction: function (refill, callback) {
                $http({
                    method: 'POST',
                    url: '/admin/resident/refill',
                    data: refill
                }).then(function success(data) {
                    callback(undefined, data);
                }, function error(data) {
                    callback(data);
                });
            },
            createResidentRequest: function (newResident, callback) {
                $http({
                    method: 'POST',
                    url: '/admin/resident/create',
                    data: newResident
                }).then(function success(data) {
                    callback(undefined, data);
                }, function error(data) {
                    callback(data);
                });
            },
            createAssortmentRequest: function (item, callback) {
                $http({
                    method: 'POST',
                    url: '/admin/assortment/create',
                    data: item
                }).then(function success(data) {
                    callback(undefined, data);
                }, function error(data) {
                    callback(data);
                });
            },
            loginRequest: function (user, callback) {
                $http({
                    method: 'POST',
                    url: 'api/authenticate',
                    data: user
                }).then(function success(data) {
                    callback(undefined, data)
                }, function error(data) {
                    callback(data);
                });
            }
        }
    }]);

    app.factory('authInspector', function ($location, $window) {

        return {
            authBar: function () {
                if ($window.sessionStorage.token == undefined) {
                    $location.path('/login');
                }
            },
            authAdmin: function () {
                if ($window.sessionStorage.token == undefined) {
                    $location.path('/login')
                } else {
                    if ($window.sessionStorage.al <= 1) {
                        $location.path('/login');
                    }
                }
            }
        }
    });

    app.factory('authInterceptor', function ($rootScope, $q, $window) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                if ($window.sessionStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                }
                return config;
            },
            responseError: function (rejection) {
                if (rejection.status === 401) {
                    // handle the case where the user is not authenticated
                }
                return $q.reject(rejection);
            }
        };
    });

})();



