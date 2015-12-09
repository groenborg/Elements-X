(function () {

    var app = angular.module('EX.services', []);

    app.service('purchaseService', ['webserviceFactory', function (webserviceFactory) {

        return function PurchaseService(resident, purchaseObj) {

            purchaseObj.purchase_items = [];
            purchaseObj.total_price = 0;
            purchaseObj.items_count = 0;
            purchaseObj.resident_id = undefined;
            purchaseObj.current_balance = 0;

            var balance = resident.current_balance;

            this.clearBasket = function () {
                purchaseObj.purchase_items = [];
                purchaseObj.total_price = 0;
                purchaseObj.items_count = 0;
                resident.current_balance = balance;
            };

            this.addToBasket = function (item, price) {
                resident.current_balance -= parseFloat(price);
                resident.current_balance = parseFloat(resident.current_balance.toFixed(2));
                purchaseObj.purchase_items.push(item);
                purchaseObj.total_price += parseFloat(price);
                purchaseObj.total_price = parseFloat(purchaseObj.total_price.toFixed(2));
                purchaseObj.items_count = purchaseObj.purchase_items.length;
            };


            this.buy = function (callback) {
                purchaseObj.resident_id = resident.resident_id;
                purchaseObj.current_balance = resident.current_balance;

                webserviceFactory.purchaseTransaction(purchaseObj, function (err, data) {
                    if (err) {
                        resident.current_balance = balance;
                        return callback(err);
                    }
                    return callback(undefined, data);
                });
            };


            this.quickBuy = function (item, price, callback) {
                this.addToBasket(item, price);

                purchaseObj.resident_id = resident.resident_id;
                purchaseObj.current_balance = resident.current_balance;

                webserviceFactory.purchaseTransaction(purchaseObj, function (err, data) {
                    if (err) {
                        //Resets the balance if an error occurs
                        resident.current_balance = balance;
                        return callback(err);
                    }
                    return callback(undefined, data);
                });
            };
        };
    }]);


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


