(function () {

    var app = angular.module('EX.services', []);

    app.service('purchaseService', ['webserviceFactory', function (webserviceFactory) {

        return function Basket(referencedBasket) {

            var basket = referencedBasket;
            var totalPrice = 0;

            this.contains = function (productId) {
                if (productId != null) {
                    for (var i = 0; i < basket.length; ++i) {
                        if (basket[i].product_id == productId) {
                            return i;
                        }
                    }
                }
                return -1;
            };

            this.summmarizePrice = function (price) {
                totalPrice += parseFloat(price);
                totalPrice = parseFloat(totalPrice.toFixed(2));
            };

            this.addToBasket = function (name, productId, price) {
                var index = this.contains(productId);
                if (index != -1) {
                    basket[index].name = name;
                    basket[index].amount += 1;
                } else {
                    basket.push({
                        name: name,
                        product_id: productId,
                        amount: 1
                    });
                }
                this.summmarizePrice(price);
            };


            this.clearBasket = function () {
                basket.splice(0, basket.length);
            };

            this.getPrice = function () {
                return totalPrice;
            };

            this.isEmpty = function () {
                return basket.length == 0;
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

        return function NotificationChannel() {

            this.balanceTooLow = function () {
                toastr.warning('Balance is too low!')
            };


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


