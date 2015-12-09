(function () {

    var app = angular.module('EX.services', []);

    app.service('purchaseService', ['webserviceFactory', function (webserviceFactory) {

        return function PurchaseService(resident, purchaseObj) {

            purchaseObj.purchase_items = [];
            purchaseObj.total_price = 0;
            purchaseObj.items_count = 0;
            purchaseObj.resident_id = undefined;
            purchaseObj.current_balance = 0;


            this.clearBasket = function () {
                purchaseObj.purchase_items = [];
                purchaseObj.total_price = 0;
                purchaseObj.items_count = 0;
            };

            this.addToBasket = function (item, price) {
                purchaseObj.purchase_items.push(item);
                purchaseObj.total_price += parseFloat(price);
                purchaseObj.total_price = parseFloat(purchaseObj.total_price.toFixed(2));
                purchaseObj.items_count = purchaseObj.purchase_items.length;
                console.log(purchaseObj.total_price);
            };


            this.buy = function (callback) {
                purchaseObj.resident_id = resident.resident_id;
                purchaseObj.current_balance = parseFloat((resident.current_balance - purchaseObj.total_price).toFixed(2));
                console.log(purchaseObj);
                webserviceFactory.purchaseTransaction(purchaseObj, function (err, transactionData) {
                    if (err) {
                        return callback(err);
                    }

                    console.log(purchaseObj);
                    //Update the customer with the real balance on purchase success
                    resident.current_balance = purchaseObj.current_balance;
                    return callback(undefined, transactionData);
                });
            };


            this.quickBuy = function (item, price, callback) {
                this.addToBasket(item, price);

                purchaseObj.resident_id = resident.resident_id;
                purchaseObj.current_balance = parseFloat((resident.current_balance - purchaseObj.total_price).toFixed(2));

                webserviceFactory.purchaseTransaction(purchaseObj, function (err, data) {
                    if (err) {
                        return callback(err);
                    }
                    //Update the customer with the real balance on purchase success
                    resident.current_balance = purchaseObj.current_balance;
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
                    " item(s) for " + totalPrice + " dkr", "Purchase Successful " + name);
            }
        };

    });

})();


