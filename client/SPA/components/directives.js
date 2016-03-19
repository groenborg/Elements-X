'use strict';

(function () {

    var app = angular.module('EX.directives', []);

    app.directive('navigation', function () {
        return {
            restrict: 'A',
            templateUrl: '../SPA/directives/navigation.html',
            scope: false
        }
    });

    app.directive('footer', function () {
        return {
            restrict: 'A',
            templateUrl: '../SPA/directives/footer.html'
        }
    });

    app.directive('dashboardSidebar', function () {
        return {
            restrict: 'A',
            templateUrl: '../SPA/directives/dashboardSidebar.html'
        }
    });


    app.directive('createResidentForm', function () {
        return {
            restrict: 'EA',
            templateUrl: "../SPA/directives/adminCreateResidentForm.html",
            scope: false,
            controller: function ($scope, adminFactory, notificationService, accountFactory) {
                $scope.accountsForUserCreation = [];
                $scope.resident = {
                    first_name: null,
                    last_name: "",
                    room_number: null,
                    kitchen_number: null,
                    current_balance: null,
                    deposit: 100,
                    phone: null,
                    email: null,
                    access_level: 0,
                    password: null,
                    active: true,
                    quick_buy: null
                };
                $scope.accessLevels = [0, 1, 2];

                var message = new notificationService();

                accountFactory.getAccounts(function (err, data) {
                    if (err) {

                    } else {
                        $scope.accountsForUserCreation = data;
                    }
                });


                $scope.createResident = function () {
                    console.log($scope.resident);
                    if (checkValues() == false) {
                        message.invalidFields();
                    } else {
                        adminFactory.createResident($scope.resident, function (err, data) {
                            if (err) {
                                message.creationTerminated();
                            } else {
                                console.log(data);
                                message.userCreated(data.resident_id);
                            }
                        });
                    }
                };


                function checkValues() {
                    for (var prop in $scope.resident) {
                        if ($scope.resident.hasOwnProperty(prop)) {
                            if ($scope.resident[prop] == null) {
                                return false;
                            }
                        }
                    }
                    return true;
                }

                $scope.accountVisibilityFilter = function (item) {
                    return item.user_visible;
                };

                $scope.clearForms = function () {
                    $scope.resident = {
                        first_name: null,
                        last_name: "",
                        room_number: null,
                        kitchen_number: null,
                        current_balance: null,
                        deposit: 100,
                        phone: null,
                        email: null,
                        access_level: 0,
                        password: null,
                        active: true,
                        quick_buy: null
                    };
                    message.clearFields();
                };


            },
            link: function ($scope, element, attributes) {

            }
        }
    });


    app.directive('createAssortmentForm', function () {
        return {
            restrict: 'EA',
            templateUrl: "../SPA/directives/adminCreateProductForm.html",
            scope: false,
            controller: function ($scope, adminFactory, notificationService) {
                //Declarative variables
                $scope.item = {
                    name: null,
                    description: null,
                    in_stock: null,
                    purchase_price: null,
                    retail_price: [],
                    box: false,
                    box_size: null,
                    bottle: false
                };
                $scope.products = [];
                $scope.isEditing = false;
                $scope.priceObject = {
                    account_id: null,
                    price: null
                };
                var message = new notificationService();

                adminFactory.onLoadProducts('loadProductsError', 'products', $scope, function (err, data) {

                });

                $scope.pushToPrices = function () {
                    var exists = null;
                    $scope.item.retail_price.forEach(function (element, index) {
                        if (element.account_id == $scope.priceObject.account_id) {
                            exists = index;
                        }
                    });

                    if (exists !== null) {
                        $scope.item.retail_price.splice(exists, 1);
                    }
                    $scope.item.retail_price.push(JSON.parse(JSON.stringify($scope.priceObject)));
                    $scope.priceObject.account_id = null;
                    $scope.priceObject.price = null;
                };

                $scope.createAssortmentItem = function () {
                    if ($scope.item.name == null || $scope.item.in_stock == null || $scope.item.retail_price.length != 4) {
                        message.invalidFields();
                    } else {
                        adminFactory.createProduct($scope.item, function (err, data) {
                            if (err) {
                                message.productCreationTerminated();
                            } else {
                                message.productCreationApproved(data.data.name);
                                $scope.clearItemForm();
                            }
                        });
                    }
                };


                $scope.updateProduct = function () {
                    if ($scope.item.name == null || $scope.item.in_stock == null || $scope.item.retail_price.length != 4) {
                        message.invalidFields();
                    } else {
                        adminFactory.updateProduct($scope.item, function (err, data) {
                            if (err) {
                                message.productUpdateTerminated();
                            } else {
                                message.productUpdated();
                                $scope.clearItemForm();
                            }
                        });
                    }
                };


                $scope.deleteProduct = function () {
                    adminFactory.deleteProduct({product_id: $scope.item.product_id}, function (err, data) {
                        if (err) {
                            message.couldNotDeleteProduct();
                        } else {
                            message.productDeletionApproved();
                        }
                    })
                };


                $scope.editProduct = function (product) {
                    $scope.isEditing = true;
                    $scope.item = product;
                };


                $scope.cbsFilter = function (item) {
                    return item.account_name != "CBS";
                };

                $scope.clearItemForm = function () {
                    $scope.item = {
                        name: null,
                        description: null,
                        in_stock: null,
                        purchase_price: null,
                        retail_price: [],
                        box: false,
                        box_size: null,
                        bottle: false
                    };
                    $scope.isEditing = false;
                    message.clearFields();
                }
            },
            link: function ($scope, element, attributes) {

            }
        }
    });


    app.directive('adminDashboardMain', function () {
        return {
            restrict: "EA",
            templateUrl: "../SPA/directives/adminDashboardMain.html",
            scope: false,
            controller: function ($scope) {

            },
            link: function ($scope, element, attributes) {

            }
        }
    });

})();
