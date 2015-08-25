'use strict';


(function () {

    var app = angular.module('ERPApp.controllers', []);

    app.controller('HomePageCtrl', function ($scope) {


    });

    app.controller('KitchenCtrl', function ($scope) {

    });

    app.controller('BuyCtrl', function ($scope) {
        $scope.drinks = [
            {
                name: "beer",
                price: '4,45'
            },
            {
                name: "beer",
                price: '4,45'
            },
            {
                name: "beer",
                price: '4,45'
            },
            {
                name: "beer",
                price: '4,45'
            },
            {
                name: "beer",
                price: '4,45'
            },
            {
                name: "beer",
                price: '4,45'
            },
            {
                name: "beer",
                price: '4,45'
            },
            {
                name: "beer",
                price: '4,45'
            },
            {
                name: "beer",
                price: '4,45'
            },
            {
                name: "beer",
                price: '4,45'
            }
        ];


        $scope.basket = {
            summarizedPrice: 0,
            items: []
        };

        $scope.addToBasket = function (item, price) {

        };


        $scope.clearBasket = function () {
            $scope.basket = {
                summarizedPrice: 0,
                items: []
            }
        }

    });


})();

