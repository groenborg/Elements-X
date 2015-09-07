'use strict';


(function () {

    var app = angular.module('EX.controllers', []);

    app.controller('HomePageCtrl', function ($scope) {


    });

    app.controller('KitchenCtrl', function ($scope) {

    });

    app.controller('BuyCtrl', function ($scope) {
        $scope.drinks = [
            {
                name: "beer",
                price: '4.45'
            },
            {
                name: "beer",
                price: '4.45'
            },
            {
                name: "beer",
                price: '4.45'
            },
            {
                name: "beer",
                price: '4.45'
            },
            {
                name: "beer",
                price: '4.45'
            },
            {
                name: "beer",
                price: '4.45'
            },
            {
                name: "beer",
                price: '4.45'
            },
            {
                name: "beer",
                price: '4.45'
            },
            {
                name: "beer",
                price: '4.45'
            },
            {
                name: "beer",
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
            $scope.basket.summarizedPrice = $scope.basket.summarizedPrice.toFixed(2)

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
        $scope. person = "name";


    }]);


})();

