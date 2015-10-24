'use strict';


(function () {

    var app = angular.module('EX.controllers', []);

    app.controller('HomePageCtrl', function ($scope) {


    });

    app.controller('KitchenCtrl', function ($scope) {

    });

    app.controller('UserShoppingCtrl', function ($scope, $rootScope, $routeParams, webserviceFactory) {
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
            webserviceFactory.purchaseTransaction($scope.basket, function (err, data) {
                if (err) {
                    console.log(err);
                }
                balance = $scope.shopper.current_balance;
                $scope.clearBasket();
                console.log(data);
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

    app.controller('ResidentPickerCtrl', ['$scope', function ($scope) {
        $scope.persons = [
            {
                name: "torben",
                balance: 34
            }, {
                name: "Simon",
                balance: 788
            }, {
                name: "Anine",
                balance: 1
            }, {
                name: "jens",
                balance: 23555
            }, {
                name: "Ole",
                balance: 34567
            }, {
                name: "Jørgen",
                balance: 0
            }

        ];


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
})();
