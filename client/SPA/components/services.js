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

            this.summarizePrice = function (price) {
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
                this.summarizePrice(price);
            };


            this.clearBasket = function () {
                basket.splice(0, basket.length);
                totalPrice = 0;
            };

            this.getPrice = function () {
                return totalPrice;
            };

            this.isEmpty = function () {
                return basket.length == 0;
            };

            this.purchase = function (accountId, userId, callback) {
                var purchase = {
                    account_id: accountId,
                    resident_id: userId,
                    purchase_items: basket,
                    total_price: totalPrice
                };

                console.log(purchase);
                webserviceFactory.userPurchaseTransaction(purchase, function (err, data) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(undefined, data);
                    }
                });
            };


            this.quickBuy = function (name, price, productId, accountId, userId, callback) {
                this.addToBasket(name, productId, price);
                var purchase = {
                    account_id: accountId,
                    resident_id: userId,
                    purchase_items: basket,
                    total_price: totalPrice
                };
                webserviceFactory.userPurchaseTransaction(purchase, function (err, data) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(undefined, data);
                    }
                });
            };
        };
    }]);


    app.service('notificationService', function (toastr) {

        return function NotificationChannel() {

            this.balanceTooLow = function () {
                toastr.warning('Balance is too low!')
            };

            this.basketIsEmpty = function () {
                toastr.warning('Basket is empty')
            };

            this.transactionTerminated = function () {
                toastr.error('transaction terminated', 'Transaction Terminated');
            };

            this.refillTerminated = function () {
                toastr.error('refill not possible', 'Refill Terminated');
            };
            this.refillApproved = function (name, amount) {
                toastr.success(name + " added " + amount + " to account", "Refill Successful");
            };

            this.transactionApproved = function (name, price) {
                toastr.success(name + " bought for " + price + " dkr ", "purchase success");
            }
        };

    });

})();


