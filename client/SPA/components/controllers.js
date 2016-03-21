'use strict';

(function () {

    var app = angular.module('EX.controllers', []);

    app.controller('AppCtrl', function ($scope) {
    });

    app.controller('KitchenCtrl', ['$scope', 'accountFactory', function ($scope, accountFactory) {


        accountFactory.getAccounts(function (err, data) {
            $scope.accounts = data;
        });


        $scope.accountVisibilityFilter = function (item) {
            return item.user_visible;
        }

    }]);

    app.controller('UserShoppingCtrl', ["$scope", "$rootScope", "$location", "$routeParams", "webserviceFactory", "notificationService", "accountFactory", "purchaseService", function ($scope, $rootScope, $location, $routeParams, webserviceFactory, notificationService, accountFactory, purchaseService) {
        //Declarative variables
        $scope.products = [];
        $scope.shopper = $rootScope.shopper;
        $scope.basket = [];
        $scope.account = {};
        $scope.totalPrice = 0;

        var basket = new purchaseService($scope.basket);
        var message = new notificationService();

        (function () {
            if ($scope.shopper == undefined) {
                $location.path('picker/' + $routeParams.kitchenNumber);
            } else {
                accountFactory.getAccount($scope.shopper.kitchen_number, function (err, account) {
                    if (err) {

                    } else {
                        $scope.products = account.available_products;
                        $scope.account = account;
                    }
                });
            }
        })();

        //On load functions


        $scope.addToBasket = function (name, productId, price) {
            if ($scope.shopper.current_balance <= 0 && basket.isEmpty()) {
                message.balanceTooLow();
            } else {
                if ($scope.shopper.current_balance - basket.getPrice() < -80) {
                    message.balanceTooLow();
                } else {

                    basket.addToBasket(name, productId, price);
                    $scope.totalPrice = basket.getPrice();
                }
            }
        };

        $scope.clearBasket = function () {
            basket.clearBasket();
            $scope.totalPrice = basket.getPrice();
        };

        $scope.buyItems = function () {
            if (basket.isEmpty()) {
                message.basketIsEmpty();
                return;
            }

            basket.purchase($scope.account.account_id, $scope.shopper.resident_id, function (err, data) {
                if (err) {
                    message.transactionTerminated();
                } else {
                    $scope.shopper.current_balance -= basket.getPrice();
                    message.transactionApproved($scope.shopper.first_name, basket.getPrice());
                    basket.clearBasket();
                    $scope.totalPrice = basket.getPrice();
                }
            });
        };

        $scope.balanceOk = function () {
            return false;
        }

    }]);

    app.controller('BarSelectionCtrl', ['$scope', 'adminFactory', 'controllerFactory', 'storageFactory', 'purchaseService', 'notificationService', 'accountFactory', 'bar', function ($scope, adminFactory, controllerFactory, storageFactory, purchaseService, notificationService, accountFactory, bar) {
        //Declarative object
        $scope.selectedKitchen = [];
        $scope.products = [];
        $scope.kitchens = {
            one: [],
            two: [],
            three: []
        };
        $scope.barAccount = {};
        $scope.currentBuyer = null;
        $scope.currentTransactionReferencedBasket = [];
        $scope.refillValue = "";
        $scope.currentTransactionPrice = 0;

        var currentTransaction = null;
        var message = new notificationService();
        var currentQuickBy = null;

        //Hides elements on error
        $scope.err = {
            error: false,
            aError: false,
            message: "No available data for residents - contact system administrator"
        };

        function merge(account, residents) {
            for (var i = 0; i < residents.length; ++i) {
                var resident = residents[i];
                for (var j = 0; j < account.available_products.length; ++j) {
                    if (resident.quick_buy == account.available_products[j].product_id) {
                        resident.quick_buy = JSON.parse(JSON.stringify(account.available_products[j]))
                    }
                }
            }
        }

        //On Load data
        controllerFactory.onLoadKitchens("one", "two", "three", $scope.kitchens, function (err) {
            if (err) {
                err.error = true;
            } else {
                accountFactory.getAccount(bar, function (err, barAccount) {
                    if (err) {

                    } else {
                        $scope.selectedKitchen = $scope.kitchens.one;
                        $scope.products = barAccount.available_products;
                        $scope.barAccount = barAccount;
                        merge($scope.barAccount, $scope.kitchens.one);
                        merge($scope.barAccount, $scope.kitchens.two);
                        merge($scope.barAccount, $scope.kitchens.three);
                    }
                });
            }
        });


        //Controller functions

        $scope.refill = function () {
            var amount = parseFloat($scope.refillValue);
            if (!isNaN(amount) && amount > 0) {
                adminFactory.refillTransaction({
                    resident_id: $scope.currentBuyer.resident_id,
                    insert_amount: amount
                }, function (err, data) {
                    if (err) {
                        message.refillTerminated();
                        $scope.refillValue = "";
                    } else {
                        //set customer balance
                        $scope.currentBuyer.current_balance = data.data.current_balance;
                        //empty balance from  model
                        $scope.refillValue = "";
                        message.refillApproved($scope.currentBuyer.first_name, amount);
                    }
                });
            } else {
                message.refillTerminated();
            }
        };


        $scope.addItem = function (name, productId, price) {
            if ($scope.currentBuyer.current_balance - (currentTransaction.getPrice() + parseFloat(price)) < -100) {
                message.balanceTooLow();
            } else {
                currentTransaction.addToBasket(name, productId, price);
                $scope.currentTransactionPrice = currentTransaction.getPrice();
            }
        };

        $scope.buy = function () {
            if (currentTransaction.isEmpty()) {
                message.basketIsEmpty();
                return;
            }
            currentTransaction.purchase($scope.barAccount.account_id, $scope.currentBuyer.resident_id, function (err, data) {
                if (err) {
                    message.transactionTerminated();
                } else {
                    message.transactionApproved($scope.currentBuyer.first_name, currentTransaction.getPrice());
                    $scope.currentBuyer.current_balance -= currentTransaction.getPrice();
                    $scope.currentBuyer = null;
                    $scope.currentTransactionReferencedBasket = [];
                    currentTransaction = null;
                    $scope.currentTransactionPrice = 0;
                }
            });

        };

        $scope.clearBasket = function () {
            currentTransaction.clearBasket();
            $scope.currentTransactionPrice = 0;
        };

        $scope.quickBuy = function (resident) {
            if (resident.quick_buy != null) {
                if (resident.current_balance - resident.quick_buy.retail_price.price < -100) {
                    message.balanceTooLow();
                    return;
                }
                if (resident.activeQuickBuy == undefined) {
                    if (currentQuickBy == null) currentQuickBy = resident;

                    if (currentQuickBy.resident_id != resident.resident_id) {
                        currentQuickBy.activeQuickBuy = undefined;
                        currentQuickBy = resident;
                    }
                    resident.activeQuickBuy = {
                        transaction: new purchaseService([]),
                        authorize: true
                    };
                } else {
                    var product = resident.quick_buy;
                    resident.activeQuickBuy.transaction.quickBuy(product.name, product.retail_price.price,
                        product.product_id, $scope.barAccount.account_id, resident.resident_id, function (err, data) {
                            if (err) {
                                message.transactionTerminated();
                            } else {
                                message.transactionApproved(resident.first_name, product.retail_price.price);
                                resident.activeQuickBuy = undefined;
                                resident.current_balance -= product.retail_price.price;
                            }
                        });
                }
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
                currentTransaction = new purchaseService($scope.currentTransactionReferencedBasket);
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

    app.controller('DashboardCtrl', ['$scope', '$rootScope', "$routeParams", "adminFactory", "notificationService", function ($scope, $rootScope, $routeParams, adminFactory, notificationService) {
        //Declarative variables
        $scope.products = [];
        $scope.accountsForUserCreation = [];
        $scope.activeForms = {
            resident: false,
            product: false,
            main: true
        };
        $scope.stockPurchase = {
            resident_id: $rootScope.admin.resident_id,
            account_id: null,
            purchase: [],
            total_price: 0
        };
        $scope.withdrawAmount = 0;
        $scope.latestHistory = null;
        var labels = [];
        var supply = [];
        var message = new notificationService();


        adminFactory.onLoadProducts('error', 'products', $scope, function () {
            for (var i = 0; i < $scope.products.length; ++i) {
                labels.push($scope.products[i].name);
                supply.push($scope.products[i].in_stock);
            }
        });

        adminFactory.getLatestStockHistory(function (err, data) {
            if (!err) {
                $scope.latestHistory = data;
            }
        });

        $scope.withDraw = function () {
            if ($scope.withdrawAmount != 0) {
                adminFactory.withdrawFromCBS({amount: $scope.withdrawAmount}, function (err, data) {
                    if (err) {
                        message.withdrawTerminated();
                    } else {
                        message.withdrawApproved($scope.withdrawAmount);
                    }
                });
            } else {
                message.invalidFields();
            }
        };

        $scope.addToBasket = function (item) {
            var productIndex = -1;
            $scope.stockPurchase.purchase.forEach(function (element, index) {
                if (element.product_id == item.product_id) {
                    productIndex = index;
                }
            });

            var product = {
                product_id: item.product_id,
                name: item.name,
                amount: 1
            };

            if (productIndex == -1) {
                $scope.stockPurchase.purchase.push(product);
                $scope.stockPurchase.total_price += item.purchase_price;
            } else {
                $scope.stockPurchase.purchase[productIndex].amount += 1;
                $scope.stockPurchase.total_price += item.purchase_price;
            }
        };

        $scope.purchaseStock = function () {
            if ($scope.stockPurchase.account_id == null || $scope.stockPurchase.purchase.length == 0) {
                message.invalidFields();
            } else {
                adminFactory.purchaseFromStock($scope.stockPurchase, function (err, data) {
                    if (err) {
                        message.accountPurchaseTerminated();
                    } else {
                        message.accountPurchaseApproved($scope.stockPurchase.account_id, $scope.stockPurchase.total_price);
                    }
                });
            }
        };

        $scope.clearBasket = function () {
            $scope.stockPurchase.purchase = [];
            $scope.stockPurchase.total_price = 0;
        };

        $scope.showForm = function (formKey) {
            for (var prop in $scope.activeForms) {
                if ($scope.activeForms.hasOwnProperty(prop)) {
                    $scope.activeForms[prop] = prop == formKey;
                }
            }
        };

        (function () {
            if ($routeParams.resident) {
                $scope.showForm('resident');
            }
        })();

        $scope.storeChart = {
            labels: labels,
            data: [
                supply
            ],
            options: {
                scaleShowGridLines: false
            },
            colours: [{
                fillColor: 'rgb(242,186,97)',
                strokeColor: 'rgb(242,186,97)',
                highlightFill: 'rgb(253,197,108)',
                highlightStroke: 'rgb(242,186,97)'
            }]
        };

    }]);

    app.controller('DashBoardKitchenCtrl', ["$scope", "$rootScope", "$routeParams", "$location", "controllerFactory", "adminFactory", "notificationService", function ($scope, $rootScope, $routeParams, $location, controllerFactory, adminFactory, notificationService) {
        //Declarative variables
        $scope.kitchenNumber = $routeParams.kitchenNumber;
        $scope.deposit = "";

        //On load functionality
        controllerFactory.onLoad($scope, $scope.kitchenNumber);
        var message = new notificationService();

        $scope.deposit = function (resident) {
            var amount = parseFloat(resident.refillValue);


            if (!isNaN(amount)) {
                adminFactory.refillTransaction({
                    resident_id: resident.resident_id,
                    insert_amount: amount
                }, function (err, data) {
                    if (err) {
                        message.refillTerminated();
                        resident.refillValue = undefined;
                    } else {
                        //set customer balance
                        resident.current_balance = data.data.current_balance;
                        //empty balance from  model
                        resident.refillValue = undefined;
                        message.refillApproved(resident.first_name, amount);
                    }
                });
            } else {
                message.refillTerminated();
            }
        };


        $scope.summarizedBalance = function () {
            var sum = 0;
            if ($scope.kitchenResidents) {
                for (var i = 0; i < $scope.kitchenResidents.length; ++i)
                    sum += $scope.kitchenResidents[i].current_balance;
                return sum.toFixed(2);
            }
        };

        $scope.changeView = function (resident) {
            $rootScope.editResident = resident;
            $location.path("/dashboard/" + resident.resident_id);
        };

        $scope.viewHistory = function (resident_id) {
            $location.path('/history/' + resident_id);
        }

    }]);

    app.controller('AccountCtrl', ["$scope", "$location", "adminFactory", 'accountFactory', 'notificationService', function ($scope, $location, adminFactory, accountFactory, notificationService) {
        //Declarative literal initialization of assortment item
        $scope.accounts = [];
        $scope.products = [];
        $scope.loadProductsError = false;
        $scope.chosenAccount = null;
        //OnLoad

        var message = new notificationService();

        accountFactory.getAccounts(function (err, data) {
            $scope.accounts = data;
        });

        adminFactory.onLoadProducts('loadProductsError', 'products', $scope, function (err, data) {

        });

        $scope.addToChosenAccount = function (item) {
            var localIndex = -1;
            $scope.chosenAccount.available_products.forEach(function (element, index, array) {
                if (element.product_id == item.product_id) {
                    localIndex = index;
                }
            });
            if (localIndex != -1) {
                $scope.chosenAccount.available_products.splice(localIndex, 1);
            } else {
                $scope.chosenAccount.available_products.push(item);
            }
        };

        $scope.selectAccount = function (account) {
            if ($scope.chosenAccount == null) {
                $scope.chosenAccount = account;
            } else if ($scope.chosenAccount.account_id == account.account_id) {
                $scope.chosenAccount = null;
            } else {
                $scope.chosenAccount = account;
            }
        };

        $scope.clearAccount = function () {
            $scope.chosenAccount = null;
        };

        $scope.updateAvailableProducts = function () {
            var dto = {
                account_id: $scope.chosenAccount.account_id,
                available_products: []
            };
            $scope.chosenAccount.available_products.forEach(function (element, index, array) {
                dto.available_products.push(element.product_id);
            });

            adminFactory.updateAvailableProducts(dto, function (err, data) {
                if (err) {
                    message.accountAvailableTerminated();
                } else {
                    message.accountAvailableUpdated();
                    $scope.chosenAccount = null;
                }
            });
        };

        $scope.getHistory = function (accountId) {
            $location.path("/accountHistory/" + accountId);
        }

    }]);

    app.controller('InventoryCtrl', ["$scope", "adminFactory", "notificationService", function ($scope, adminFactory, notificationService) {
        //Declarative literal initialization of assortment item
        $scope.products = [];
        $scope.loadProductsError = false;
        $scope.chosenProduct = null;
        $scope.restockData = {
            product_id: null,
            amount: null
        };

        var message = new notificationService();
        adminFactory.onLoadProducts('loadProductsError', 'products', $scope, function (err, data) {
        });

        $scope.setChosenProduct = function (product) {

            if ($scope.chosenProduct == null) {
                $scope.chosenProduct = product;
            } else if ($scope.chosenProduct.product_id == product.product_id) {
                $scope.chosenProduct = null;
            } else {
                $scope.chosenProduct = product;
            }
        };

        $scope.restock = function () {
            if ($scope.chosenProduct != null) {
                $scope.restockData.product_id = $scope.chosenProduct.product_id;
                adminFactory.restockProduct($scope.restockData, function (err, data) {
                    if (err != null) {
                        message.restockTerminated();
                        $scope.clear();
                    } else {
                        message.restockApproved($scope.restockData.amount);
                        $scope.chosenProduct.in_stock += $scope.restockData.amount;
                        $scope.clear();
                    }
                });
            } else {
                message.productNotChosen();
            }
        };


        $scope.clear = function () {
            $scope.chosenProduct = null;
            $scope.restockData = {
                product_id: null,
                amount: null
            };
        }

    }]);

    app.controller('HistoryCtrl', ["$scope", "adminFactory", "$routeParams", function ($scope, adminFactory, $routeParams) {
        $scope.resident = null;
        $scope.error = false;
        $scope.accountHistory = null;
        $scope.account = $routeParams.accountId;

        var residentId = $routeParams.residentId;
        //$routeParams.residentId
        ///accountHistory/:accountId

        (function () {
            if (residentId != undefined) {
                adminFactory.getResidentHistory(residentId, function (err, data) {
                    if (err) {
                        $scope.error = true;
                    } else {
                        $scope.resident = data.data;
                    }
                });
            }
        })();

        (function () {
            if ($scope.account != undefined) {
                adminFactory.getAccountHistory($scope.account, function (err, data) {
                    $scope.accountHistory = data.data;
                    console.log(data);
                });
            }
        })();


    }]);

})();
