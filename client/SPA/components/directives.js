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
                    if (checkValues() == false) {
                        message.invalidFields();
                    } else {

                        adminFactory.createResident($scope.resident, function (err, data) {
                            if (err) {
                                message.creationTerminated();
                            }
                            message.userCreated(data.data.resident_id);
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
                        first_name: "",
                        last_name: "",
                        room_number: null,
                        kitchen_number: null,
                        current_balance: null,
                        deposit: 100,
                        phone: "",
                        email: "",
                        access_level: 0,
                        password: "",
                        active: true
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
            templateUrl: "../SPA/directives/adminCreateAssortmentForm.html",
            scope: false,
            controller: function ($scope, adminFactory, notificationService) {
                //Declarative variables
                $scope.item = {
                    name: null,
                    supply: 0,
                    item_size: 0,
                    description: null,
                    one_price: 0,
                    two_price: 0,
                    three_price: 0,
                    bar_price: 0
                };
                var msgService = notificationService;


                $scope.createAssortmentItem = function () {
                    if ($scope.item.name == null || $scope.item.supply == null || $scope.item.one_price == 0) {
                        msgService.notifyClear("All fields must be valid", "Invalid action")
                    } else {
                        adminFactory.createAssortmentItem($scope.item, function (err, data) {
                            if (err) {
                                msgService.notify("Could not be created", "Error", "error")
                            } else {
                                msgService.notify("Item successfully created: " + data.data.name, "Success", "success");
                                $scope.clearItemForm();
                            }
                        });
                    }
                };


                $scope.clearItemForm = function () {
                    $scope.item = {
                        name: null,
                        supply: 0,
                        item_size: 0,
                        description: null,
                        one_price: 0,
                        two_price: 0,
                        three_price: 0,
                        bar_price: 0
                    };
                    msgService.notifyClear("fields emptied", "Clear")
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
