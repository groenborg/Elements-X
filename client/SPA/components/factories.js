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
            onLoadProducts: function (keyProperty, scope, callback) {
                webserviceFactory.getAllProducts(function (err, data) {
                    if (err) {
                        return callback(err);
                    }
                    scope[keyProperty] = data;
                    return callback(undefined, data)
                });
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

            onLoadProducts: function (errorProperty, dataProperty, scope, callback) {
                webserviceFactory.getAllProducts(function (err, data) {
                    if (err) {
                        return scope[errorProperty] = {error: "An error occurred"};
                    }
                    scope[dataProperty] = data;
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
            updateResident: function (resident, callback) {
                webserviceFactory.updateResident(resident, callback);
            },
            createProduct: function (item, callback) {
                webserviceFactory.createProductRequest(item, callback);
            },
            updateProduct: function (item, callback) {
                webserviceFactory.updateProductRequest(item, callback);
            },
            deleteProduct: function (item, callback) {
                webserviceFactory.deleteProductRequest(item, callback);
            },
            purchaseStorageTransaction: function (purchase, callback) {
                webserviceFactory.purchaseStorageTransaction(purchase, callback);
            },
            restockProduct: function (item, callback) {
                webserviceFactory.restockProduct(item, callback);
            },
            getResidentHistory: function (residentId, callback) {
                webserviceFactory.getResidentHistory(residentId, callback);
            },
            updateAvailableProducts: function (dto, callback) {
                webserviceFactory.updateAvailableProducts(dto, callback);
            },
            purchaseFromStock: function (dto, callback) {
                webserviceFactory.purchaseFromStock(dto, callback);
            },
            withdrawFromCBS: function (dto, callback) {
                webserviceFactory.withdrawFromCBS(dto, callback);
            }
        }
    }]);

    app.factory('accountFactory', ['webserviceFactory', function (webserviceFactory) {

        var accounts = [];

        function update(callback) {
            webserviceFactory.getAllAccounts(function (err, data) {
                callback(err, data)
            });
        }


        function getOne(id) {
            for (var i = 0; i < accounts.length; ++i) {
                if (accounts[i].account_id == id) {
                    return accounts[i];
                }
            }
        }

        return {
            getAccounts: function (callback) {
                if (accounts.length == 0) {
                    update(callback)
                } else {
                    callback(undefined, accounts);
                }
            },
            getAccount: function (id, callback) {
                if (accounts.length == 0) {
                    update(function (err, data) {
                        if (err) {
                            return callback(err)
                        } else {
                            accounts = data;
                            return callback(undefined, getOne(id));
                        }
                    })
                } else {
                    return callback(undefined, getOne(id));
                }
            },
            getAccountHistory: function (accountId, callback) {
                webserviceFactory.getAccountHistory(accountId, function (err, data) {
                    callback(err, data);
                });
            }
        }

    }]);

    app.factory('webserviceFactory', ['$http', function ($http) {

        return {
            withdrawFromCBS: function (dto, callback) {
                $http({
                    method: "PUT",
                    url: '/admin/cbs/withdraw',
                    data: dto
                }).then(function success(res) {
                    callback(undefined, res);
                }, function error(res) {
                    callback(undefined, res);
                });
            },
            purchaseFromStock: function (dto, callback) {
                $http({
                    method: "PUT",
                    url: 'admin/account/purchase',
                    data: dto
                }).then(function success(res) {
                    callback(undefined, res);
                }, function error(res) {
                    callback(undefined, res);
                });
            },
            updateAvailableProducts: function (dto, callback) {
                $http({
                    method: "PUT",
                    url: 'admin/account/upavail',
                    data: dto
                }).then(function success(res) {
                    callback(undefined, res);
                }, function error(res) {
                    callback(undefined, res);
                });
            },
            getResidentHistory: function (residentId, callback) {
                $http({
                    method: "GET",
                    url: 'admin/resident/history/' + residentId
                }).then(function success(res) {
                    callback(undefined, res);
                }, function error(res) {
                    callback(undefined, res);
                });
            },
            updateResident: function (resident, callback) {
                $http({
                    method: "PUT",
                    url: 'admin/resident/update',
                    data: resident
                }).then(function success(res) {
                    callback(undefined, res);
                }, function error(res) {
                    callback(undefined, res);
                });
            },
            restockProduct: function (item, callback) {
                $http({
                    method: "PUT",
                    url: 'admin/product/restock',
                    data: item
                }).then(function success(res) {
                    callback(undefined, res);
                }, function error(res) {
                    callback(undefined, res);
                });
            },
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
            getAllAccounts: function (callback) {
                $http({
                    method: 'GET',
                    url: '/api/account/all'
                }).then(function success(response) {
                    callback(undefined, response.data);
                }, function error(response) {
                    callback(response);
                });
            },
            getAccountHistory: function (accountId, callback) {
                $http({
                    method: 'GET',
                    url: '/api/account/history/' + accountId
                }).then(function success(response) {
                    callback(undefined, response.data);
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
            getAllProducts: function (callback) {
                $http({
                    method: 'GET',
                    url: '/api/product/all'
                }).then(function success(data) {
                    callback(undefined, data.data)
                }, function error(data) {
                    callback(data)
                });
            },
            userPurchaseTransaction: function (purchase, callback) {
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
            createProductRequest: function (item, callback) {
                $http({
                    method: 'POST',
                    url: '/admin/product/create',
                    data: item
                }).then(function success(data) {
                    callback(undefined, data);
                }, function error(data) {
                    callback(data);
                });
            },
            updateProductRequest: function (updatedProduct, callback) {
                $http({
                    method: 'PUT',
                    url: '/admin/product/update',
                    data: updatedProduct
                }).then(function success(data) {
                    callback(undefined, data);
                }, function error(data) {
                    callback(data);
                });
            },
            deleteProductRequest: function (product, callback) {
                $http({
                    method: 'DELETE',
                    url: '/admin/product/delete',
                    data: product,
                    headers: {
                        "Content-Type": "application/json"
                    }
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



