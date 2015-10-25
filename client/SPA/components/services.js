(function () {

    var app = angular.module('EX.services', []);

    app.service('purchaseItemService', function () {

    });


    app.service('notificationService', function (toastr) {
        this.notifySuccess = function (message, title) {
            if (title) {
                toastr.success(message, title);
                return;
            }
            toastr.success(message);
        }

    });

})();


