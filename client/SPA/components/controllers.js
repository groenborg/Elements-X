'use strict';


(function () {

    var app = angular.module('EX.controllers', []);

    app.controller('HomePageCtrl', function ($scope) {


    });

    app.controller('KitchenCtrl', function ($scope) {

    });

    app.controller('BuyCtrl', function ($scope, $routeParams) {
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
            summarizedPrice: 0,
            items: []
        };


        $scope.addToBasket = function (item, price) {
            $scope.basket.summarizedPrice = parseFloat($scope.basket.summarizedPrice);
            $scope.basket.summarizedPrice += parseFloat(price);
            $scope.basket.summarizedPrice = $scope.basket.summarizedPrice.toFixed(2);

            $scope.basket.items.push(item);

        };


        // items must be listed xNum when the same items is repeated

        $scope.clearBasket = function () {
            $scope.basket = {
                summarizedPrice: 0,
                items: []
            }
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

    app.controller('UserCardPickerCtrl', ['$scope', 'controllerFactory', 'storageFactory', function ($scope, controllerFactory, storageFactory) {
        $scope.kitchenResidents = [];
        $scope.error = null;

        if (!controllerFactory.isLoaded()) {
            controllerFactory.updateKitchenData(function (err) {
                if (err) {
                    $scope.err = "no residents found - error"
                } else {
                    $scope.kitchenResidents = storageFactory.getKitchen("three");
                }
            });
        } else {
            $scope.kitchenResidents = storageFactory.getKitchen("three");
        }

        //get number based on kitchenPage


    }]);
})();

