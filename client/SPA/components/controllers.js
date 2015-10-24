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
            summarizedPrice: 0,
            items: []
        };

        $scope.shopper = $rootScope.shopper;


        $scope.addToBasket = function (item, price) {
            $scope.basket.summarizedPrice = parseFloat($scope.basket.summarizedPrice);
            $scope.basket.summarizedPrice += parseFloat(price);
            $scope.basket.summarizedPrice = $scope.basket.summarizedPrice.toFixed(2);

            $scope.basket.items.push(item);

        };


        // items must be listed xNum when the same items is repeated
        $scope.buyItems = function () {
            

        };

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
