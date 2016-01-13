'use strict';

(function () {

    var app = angular.module('EX.controllers', []);

    app.controller('AppCtrl', function ($scope) {
    });

    app.controller('KitchenCtrl', function ($scope) {


    });

    app.controller('UserShoppingCtrl', function ($scope, $rootScope, $routeParams, webserviceFactory, notificationService, adminFactory) {
        //Declarative variables
        $scope.assortmentItems = [];
        $scope.basket = {
            purchase_items: [],
            total_price: 0,
            items_count: 0
        };
        $scope.shopper = $rootScope.shopper;

        //On load functions
        adminFactory.onLoadTransactions('error', 'assortmentItems', $scope);
        var balance = $rootScope.shopper.current_balance;
        var msgService = notificationService;


        $scope.addToBasket = function (item, price) {
            if ($scope.shopper.current_balance < 0 && $scope.basket.purchase_items.length == 0) {
                msgService.notify('', 'balance too low', 'warning');
                return;
            }

            if (($scope.shopper.current_balance - parseFloat(price)) > -100) {
                $scope.basket.total_price += parseFloat(price);
                $scope.basket.total_price = parseFloat($scope.basket.total_price.toFixed(2));
                $scope.shopper.current_balance -= parseFloat(price);
                $scope.shopper.current_balance = parseFloat($scope.shopper.current_balance.toFixed(2));
                $scope.basket.purchase_items.push(item);
            } else {
                msgService.notifyClear('purchase limit reached!', 'Balance too low', "warning");
            }
        };


        // items must be listed xNum when the same items is repeated
        $scope.buyItems = function () {
            if ($scope.basket.purchase_items.length == 0) {
                msgService.notify('', 'Basket is empty', 'info');
                return;
            }

            $scope.basket.items_count = $scope.basket.purchase_items.length;
            $scope.basket.resident_id = $scope.shopper.resident_id;
            $scope.basket.current_balance = $scope.shopper.current_balance;
            webserviceFactory.purchaseTransaction($scope.basket, function (err, data) {
                if (err) {
                    msgService.notify('transaction terminated', 'Transaction canceled', "error");
                } else {
                    balance = $scope.shopper.current_balance;
                    msgService.notifyTransactionSuccess($scope.basket.items_count, $scope.basket.total_price, $scope.shopper.first_name);
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

    app.controller('BarSelectionCtrl', ['$scope', 'adminFactory', 'controllerFactory', 'storageFactory', 'purchaseService', 'notificationService', function ($scope, adminFactory, controllerFactory, storageFactory, purchaseService, notificationService) {
        //Declarative object
        $scope.selectedKitchen = [];
        $scope.assortmentItems = [];
        $scope.kitchens = {
            one: [],
            two: [],
            three: []
        };

        $scope.currentBuyer = null;
        $scope.currentTransactionBasket = {};
        $scope.refillValue = "";

        var currentTransaction = null;
        var msgService = notificationService;
        var currentQuickBy = null;

        //Hides elements on error
        $scope.err = {
            error: false,
            aError: false,
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
        controllerFactory.onLoadAssortment('assortmentItems', $scope, function (err, data) {
            if (err) {
                $scope.err.aError = true;
            }
        });

        //Controller functions
        $scope.addItem = function (item, price) {
            if ($scope.currentBuyer.current_balance - ($scope.currentTransactionBasket.total_price + parseFloat(price)) < -100) {
                msgService.notify('The balance is too low', 'Purchase not available', 'warning');
                return;
            }
            currentTransaction.addToBasket(item, price);
        };

        $scope.buy = function () {


            if ($scope.currentTransactionBasket.total_price == 0) {
                msgService.notify('invalid action', 'Basket is empty', 'warning');
                return;
            }
            currentTransaction.buy(function (err, data) {
                if (err) {

                    msgService.notify('error in transaction', 'purchase canceled', 'error');
                } else {
                    msgService.notifyTransactionSuccess($scope.currentTransactionBasket.purchase_items.length,
                        $scope.currentTransactionBasket.total_price, $scope.currentBuyer.first_name);
                    $scope.currentBuyer = null;
                    $scope.currentTransactionBasket = {};
                    currentTransaction = null;
                }
            });

        };

        $scope.refill = function () {
            var amount = parseFloat($scope.refillValue);
            if (!isNaN(amount) && amount > 0) {
                adminFactory.refillTransaction({
                    resident_id: $scope.currentBuyer.resident_id,
                    insert_amount: amount
                }, function (err, data) {
                    if (err) {
                        msgService.notify('error in transaction', 'refill canceled', 'error');
                        $scope.refillValue = "";
                    } else {
                        //set customer balance
                        $scope.currentBuyer.current_balance = data.data.current_balance;
                        //empty balance from  model
                        $scope.refillValue = "";
                        msgService.notify($scope.currentBuyer.first_name + ' added ' + amount + ' to account', 'Transaction success', 'success')
                    }
                });
            } else {
                msgService.notify('not a valid refill value', 'refill canceled', 'warning');
            }
        };


        $scope.clearBasket = function () {

            if ($scope.currentTransactionBasket.purchase_items.length == 0) {
                msgService.notify('', 'Basket already empty', 'warning');
                return;
            }
            msgService.notify('', 'Basket cleared', 'info');
            currentTransaction.clearBasket();
        };

        $scope.quickBuy = function (resident) {
            var item = $scope.assortmentItems[0].name;
            var price = $scope.assortmentItems[0].one_price;

            if (resident.current_balance - price < -100) {
                msgService.notify('The balance is too low', 'Purchase not available', 'warning');
                return;
            }

            if (resident.quickBuy === undefined) {
                if (currentQuickBy == null) currentQuickBy = resident;

                if (currentQuickBy.resident_id != resident.resident_id) {
                    currentQuickBy.quickBuy = undefined;
                    currentQuickBy = resident;
                }
                resident.quickBuy = {
                    transaction: new purchaseService(resident, {}),
                    authorize: true
                };
            } else {
                resident.quickBuy.transaction.quickBuy(item, price, function (err, data) {
                    if (err) {
                        msgService.notify('error in transaction', 'purchase canceled', 'warning');
                    } else {
                        msgService.notifyTransactionSuccess(1, price, resident.first_name)
                    }
                    resident.quickBuy = undefined;
                });

            }
        };

        $scope.setCurrentBuyer = function (resident) {

            if ($scope.currentBuyer == resident) {
                $scope.currentBuyer = null;
                $scope.currentTransactionBasket = {};
                currentTransaction = null;
            } else {
                //first click
                $scope.currentBuyer = resident;
                currentTransaction = new purchaseService(resident, $scope.currentTransactionBasket);
            }
        };

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
        $scope.assortmentItems = [];
        $scope.activeForms = {
            resident: false,
            assortment: false,
            main: true
        };
        $scope.transactionPurchase = {
            item: null,
            total_price: null,
            resident_id: null,
            amount: null
        };
        $scope.allTransactions = {
            err: false,
            data: null
        };
        var labels = [];
        var supply = [];

        //On load functions
        adminFactory.onLoadTransactions('error', 'assortmentItems', $scope, function () {
            for (var i = 0; i < $scope.assortmentItems.length; ++i) {
                labels.push($scope.assortmentItems[i].name);
                supply.push($scope.assortmentItems[i].supply);
            }
            console.log($scope.assortmentItems);
        });

        adminFactory.onLoadGetPurchase(function (err, data) {
            console.log(data);
            if (err) {
                $scope.allTransactions.err = true;
            } else {
                $scope.allTransactions.data = data.data;
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

        $scope.showForm = function (formKey) {
            for (var prop in $scope.activeForms) {
                if ($scope.activeForms.hasOwnProperty(prop)) {
                    $scope.activeForms[prop] = prop == formKey;
                }
            }
        };


    }]);

    app.controller('DashBoardKitchenCtrl', ["$scope", "$routeParams", "controllerFactory", "adminFactory", "notificationService", function ($scope, $routeParams, controllerFactory, adminFactory, notificationService) {
        //Declarative variables
        $scope.kitchenNumber = $routeParams.kitchenNumber;
        $scope.deposit = "";


        //On load functionality
        controllerFactory.onLoad($scope, $scope.kitchenNumber);
        var msgService = notificationService;


        $scope.deposit = function (resident) {
            var amount = parseFloat(resident.refillValue);


            if (!isNaN(amount) && amount > 0) {
                adminFactory.refillTransaction({
                    resident_id: resident.resident_id,
                    insert_amount: amount
                }, function (err, data) {
                    if (err) {
                        msgService.notify('error in transaction', 'refill canceled', 'error');
                        resident.refillValue = undefined;
                    } else {
                        //set customer balance
                        resident.current_balance = data.data.current_balance;
                        //empty balance from  model
                        resident.refillValue = undefined;
                        msgService.notify(resident.first_name + ' added ' + amount + ' to account', 'Transaction success', 'success')
                    }
                });
            } else {
                msgService.notify('not a valid refill value', 'refill canceled', 'warning');
            }
        };


        $scope.summarizedBalance = function () {
            var sum = 0;
            if ($scope.kitchenResidents) {
                for (var i = 0; i < $scope.kitchenResidents.length; ++i)
                    sum += $scope.kitchenResidents[i].current_balance;
                return sum.toFixed(2);
            }
        }

    }]);

    app.controller('InventoryCtrl', ["$scope", "adminFactory", function ($scope, adminFactory) {
        //Declarative literal initialization of assortment item
        $scope.assortmentItems = {};

        //OnLoad
        adminFactory.onLoadTransactions('error', 'assortmentItems', $scope);


    }]);

})();
