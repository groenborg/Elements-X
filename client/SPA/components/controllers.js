'use strict';

(function () {

    var app = angular.module('EX.controllers', []);

    app.controller('HomePageCtrl', function ($scope) {


    });

    app.controller('KitchenCtrl', function ($scope) {


    });

    app.controller('UserShoppingCtrl', function ($scope, $rootScope, $routeParams, webserviceFactory, notificationService) {
        $scope.drinks = [
            {
                name: "Guld",
                price: '4.45'
            },
            {
                name: "Classic",
                price: '4.45'
            },
            {
                name: "Cider",
                price: '4.45'
            },
            {
                name: "Export",
                price: '4.45'
            },
            {
                name: "Red",
                price: '4.45'
            },
            {
                name: "Nestea",
                price: '4.45'
            },
            {
                name: "Cola",
                price: '4.45'
            },
            {
                name: "7Up",
                price: '4.45'
            },
            {
                name: "Squash",
                price: '4.45'
            },
            {
                name: "Minto",
                price: '4.45'
            }
        ];
        $scope.basket = {
            purchase_items: [],
            total_price: 0,
            items_count: 0
        };

        $scope.shopper = $rootScope.shopper;

        var balance = $rootScope.shopper.current_balance;

        $scope.addToBasket = function (item, price) {
            $scope.basket.total_price = parseFloat($scope.basket.total_price);
            $scope.basket.total_price += parseFloat(price);
            $scope.basket.total_price = $scope.basket.total_price.toFixed(2);
            $scope.shopper.current_balance -= parseFloat(price);
            $scope.shopper.current_balance = $scope.shopper.current_balance.toFixed(2);
            $scope.basket.purchase_items.push(item);
        };


        // items must be listed xNum when the same items is repeated
        $scope.buyItems = function () {
            $scope.basket.items_count = $scope.basket.purchase_items.length;
            $scope.basket.resident_id = $scope.shopper.resident_id;
            $scope.basket.current_balance = $scope.shopper.current_balance;
            webserviceFactory.purchaseTransaction($scope.basket, function (err, data) {
                if (err) {
                    console.log(err);
                }
                balance = $scope.shopper.current_balance;
                notificationService.notifySuccess("you bought " + $scope.basket.items_count +
                    " for " + $scope.basket.total_price + " dkr", "Purchase Successful " + $scope.shopper.first_name);
                $scope.clearBasket();
            });


        };

        $scope.clearBasket = function () {
            $scope.basket = {
                total_price: 0,
                purchase_items: []
            };
            $scope.shopper.current_balance = balance;
        }

    });

    app.controller('BarSelectionCtrl', ['$scope', 'controllerFactory', 'storageFactory', function ($scope, controllerFactory, storageFactory) {
        $scope.kitchenOne = storageFactory.getKitchen(1);
        $scope.kitchenTwo = storageFactory.getKitchen(2);
        $scope.kitchenThree = storageFactory.getKitchen(3);

        controllerFactory.updateKitchenData(function (err, data) {
            $scope.kitchenOne = storageFactory.getKitchen(1);
            $scope.kitchenTwo = storageFactory.getKitchen(2);
            $scope.kitchenThree = storageFactory.getKitchen(3);
        });


    }]);

    app.controller('UserCardPickerCtrl', ['$scope', '$rootScope', 'controllerFactory', 'storageFactory', '$location', '$routeParams', function ($scope, $rootScope, controllerFactory, storageFactory, $location, $routeParams) {
        $scope.kitchenResidents = [];
        $scope.error = null;
        $scope.kitchenNumber = $routeParams.kitchenNumber;

        controllerFactory.onLoad($scope, $scope.kitchenNumber);

        $scope.changeView = function (kitchenNumber, residentId) {
            console.log(kitchenNumber);
            $rootScope.shopper = storageFactory.getResident(kitchenNumber, residentId);
            $location.path("/buy/" + kitchenNumber + "/" + residentId);
        };

    }]);

    app.controller('DashboardCtrl', ['$scope', function ($scope) {

        $scope.storeChart = {
            labels: ["Beer", "minto", "nestea", "cola", "fanta", "classic", "guld"],
            data: [
                [65, 59, 80, 81, 56, 55, 40]
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
        }
    }]);

    app.controller('InventoryCtrl', ["$scope", function ($scope) {
        

    }]);

})();
