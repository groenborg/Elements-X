(function () {

    var app = angular.module('EX.services', []);

    app.service('purchaseItemService', function () {

    });


    app.service('notificationService', function (toastr) {

        return new function NotificationChannel() {
            this.notifySuccess = function (message, title) {
                if (title) {
                    toastr.success(message, title);
                    return;
                }
                toastr.success(message);
            };

            this.notifyClear = function (message, title) {
                if (title) {
                    toastr.warning(message, title);
                    return;
                }
                toastr.warning(message);
            };

            this.notify = function (message, title, type) {
                toastr[type](message, title)
            };


            this.notifyTransactionSuccess = function (itemCount, totalPrice, name) {
                toastr.success("you bought " + itemCount +
                    " for " + totalPrice + " dkr", "Purchase Successful " + name);
            }
        };

    });

})();


