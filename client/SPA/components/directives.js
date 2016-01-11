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
            controller: function ($scope, adminFactory, notificationService) {
                //Two way binded model
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

                var msgService = notificationService;

                $scope.createResident = function () {

                    if ($scope.resident.room_number == null || $scope.resident.kitchen_number == null) {
                        msgService.notify('', 'Fields are missing', 'warning')
                    } else {
                        adminFactory.createResident($scope.resident, function (err, data) {
                            if (err) {
                                msgService.notify('error in request', 'Canceled', 'error')
                            }
                            msgService.notify('resident successfully created: id = ' + data.data.resident_id, 'Created', 'success');
                        });
                    }
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
                    msgService.notify('', 'Cleared', 'info');
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
