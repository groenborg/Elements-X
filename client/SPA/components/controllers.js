'use strict';

(function () {

    var app = angular.module('EX.controllers', []);

    app.controller('HomePageCtrl', function ($scope) {


    });

    app.controller('KitchenCtrl', function ($scope) {


    });

    app.controller('UserShoppingCtrl', function ($scope, $rootScope, $routeParams, webserviceFactory, notificationService, adminFactory) {
        //Declarative variables
        $scope.drinks = [];
        $scope.basket = {
            purchase_items: [],
            total_price: 0,
            items_count: 0
        };

        $scope.shopper = $rootScope.shopper;

        //On load functions
        adminFactory.onLoadTransactions('error', 'drinks', $scope);
        var balance = $rootScope.shopper.current_balance;

        $scope.addToBasket = function (item, price) {
            if ($scope.shopper.current_balance < 0 && $scope.basket.purchase_items.length == 0) {
                notificationService.notify('','balance too low','warning');
                return;
            }

            if (($scope.shopper.current_balance - parseFloat(price)) > -100) {
                $scope.basket.total_price += parseFloat(price);
                $scope.basket.total_price = parseFloat($scope.basket.total_price.toFixed(2));
                $scope.shopper.current_balance -= parseFloat(price);
                $scope.shopper.current_balance = parseFloat($scope.shopper.current_balance.toFixed(2));
                $scope.basket.purchase_items.push(item);
            } else {
                notificationService.notifyClear('purchase limit reached!', 'Balance too low', "warning");
            }
        };


        // items must be listed xNum when the same items is repeated
        $scope.buyItems = function () {
            if ($scope.basket.purchase_items.length == 0) {
                notificationService.notify('', 'Basket is empty', 'info');
                return;
            }

            $scope.basket.items_count = $scope.basket.purchase_items.length;
            $scope.basket.resident_id = $scope.shopper.resident_id;
            $scope.basket.current_balance = $scope.shopper.current_balance;
            webserviceFactory.purchaseTransaction($scope.basket, function (err, data) {
                if (err) {
                    notificationService.notify('transaction terminated', 'Transaction canceled', "error");
                } else {
                    balance = $scope.shopper.current_balance;
                    notificationService.notifyTransactionSuccess($scope.basket.items_count,
                        $scope.basket.total_price, $scope.shopper.first_name);
                    $scope.clearBasket();
                }
            });
        };

        $scope.clearBasket = function () {
            $scope.basket = {
                total_price: 0,
                purchase_items: []
            };
            $scope.shopper.current_balance = balance;
        };

        $scope.balanceOk = function () {
            return false;
        }

    });

    app.controller('BarSelectionCtrl', ['$scope', 'controllerFactory', 'storageFactory', function ($scope, controllerFactory, storageFactory) {
        //Declarative object
        $scope.selectedKitchen = [];
        $scope.kitchens = {
            one: [],
            two: [],
            three: []
        };

        //Hides elements on error
        $scope.err = {
            error: false,
            message: "No available data for residents - contact system administrator"
        };

        //On Load data
        controllerFactory.onLoadKitchens("one", "two", "three", $scope.kitchens, function (err) {
            if (err) {
                err.error = true;
            } else {
                $scope.selectedKitchen = $scope.kitchens.one;
            }
        });


        $scope.changeKitchen = function (number) {
            $scope.selectedKitchen = $scope.kitchens[number];
        }

    }]);

    app.controller('UserCardPickerCtrl', ['$scope', '$rootScope', 'controllerFactory', 'storageFactory', '$location', '$routeParams', function ($scope, $rootScope, controllerFactory, storageFactory, $location, $routeParams) {
        $scope.kitchenResidents = [];
        $scope.error = null;
        $scope.kitchenNumber = $routeParams.kitchenNumber;

        controllerFactory.onLoad($scope, $scope.kitchenNumber);


        $scope.changeView = function (kitchenNumber, residentId) {
            $rootScope.shopper = storageFactory.getResident(kitchenNumber, residentId);
            $location.path("/buy/" + kitchenNumber + "/" + residentId);
        };

    }]);

    app.controller('DashboardCtrl', ['$scope', "adminFactory", function ($scope, adminFactory) {
        //Declarative variables
        $scope.assortmentItems = {};
        var labels = [];
        var supply = [];

        //On load functions
        adminFactory.onLoadTransactions('error', 'assortmentItems', $scope, function () {
            for (var i = 0; i < $scope.assortmentItems.length; ++i) {
                labels.push($scope.assortmentItems[i].name);
                supply.push($scope.assortmentItems[i].supply);
            }
        });


        $scope.storeChart = {
            labels: labels,
            data: [
                supply
            ],
            options: {
                scaleShowGridLines: false
            },
            colours: [{
                fillColor: 'rgb(76,76,76)',
                strokeColor: 'rgb(76,76,76)',
                highlightFill: 'rgb(76,76,76)',
                highlightStroke: 'rgb(76,76,76)'
            }]
        };
        $scope.activeForms = {
            resident: false,
            assortment: false,
            main: true

        };

        $scope.showForm = function (formKey) {
            for (var prop in $scope.activeForms) {
                if ($scope.activeForms.hasOwnProperty(prop)) {
                    $scope.activeForms[prop] = prop == formKey;
                }
            }
        };

    }]);

    app.controller('DashBoardKitchenCtrl', ["$scope", "$routeParams", "storageFactory", "controllerFactory", function ($scope, $routeParams, storageFactory, controllerFactory) {
        //Load in necessary data
        $scope.kitchenNumber = $routeParams.kitchenNumber;

        //Controller from here
        controllerFactory.onLoad($scope, $scope.kitchenNumber);


        $scope.deposit = function (resident) {
            console.log(resident);
        };

        $scope.summarizedBalance = function () {
            var sum = 0;
            for (var i = 0; i < $scope.kitchenResidents.length; ++i)
                sum += $scope.kitchenResidents[i].current_balance;
            return sum.toFixed(2);
        }

    }]);

    app.controller('InventoryCtrl', ["$scope", "adminFactory", function ($scope, adminFactory) {
        //Declarative literal initialization of assortment item
        $scope.assortmentItems = {};

        //OnLoad
        adminFactory.onLoadTransactions('error', 'assortmentItems', $scope);


    }]);

})();
