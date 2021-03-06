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

            // Arnold Schwarzenegger was terminating here

            this.userDisabled = function () {
                toastr.info("User was disabled")
            };

            this.balanceTooLow = function () {
                toastr.warning('Balance is too low!')
            };

            this.basketIsEmpty = function () {
                toastr.warning('Basket is empty')
            };

            this.transactionTerminated = function () {
                toastr.error('transactionManager terminated', 'Transaction Terminated');
            };

            this.refillTerminated = function () {
                toastr.error('refill not possible', 'Refill Terminated');
            };
            this.refillApproved = function (name, amount) {
                toastr.success(name + " added " + amount + " to account", "Refill Successful");
            };

            this.transactionApproved = function (name, price) {
                toastr.success(name + " bought for " + price + " dkr ", "purchase success");
            };

            this.farewell = function (name) {
                toastr.info("you are now logged out", "goodbye " + name);
            };

            this.greetings = function (name) {
                toastr.info("", "Welcome " + name);
            };

            this.notAuthorized = function () {
                toastr.warning("username or password are invalid", "Not Authorized");
            };

            this.invalidFields = function () {
                toastr.warning("Fields are invalid or missing", "Error");
            };

            this.userCreated = function (userId) {
                toastr.success("user " + userId + " created", "User created");
            };

            this.creationTerminated = function () {
                toastr.error("User could not be created", "Creation terminated");
            };

            this.productCreationTerminated = function () {
                toastr.error("Product could not be created", "Creation terminated");
            };

            this.productCreationApproved = function (name) {
                toastr.success("Item successfully created: " + name, "Product Created");
            };

            this.clearFields = function () {
                toastr.warning("fields cleared");
            };

            this.productUpdateTerminated = function () {
                toastr.error("Product could not be updated", "Update terminated");
            };

            this.productUpdated = function () {
                toastr.success("product was updated", "Update Accepted");
            };
            this.couldNotDeleteProduct = function () {
                toastr.error("Product could not be deleted", "Deletion terminated");
            };

            this.productDeletionApproved = function () {
                toastr.success("Product was deleted", "Deletion Approved");
                toastr.info("please refresh page");
            };

            this.productNotChosen = function () {
                toastr.warning("A product must be chosen");
            };

            this.restockTerminated = function () {
                toastr.error("Product could not be restocked", "Restock transactionManager terminated");
            };

            this.restockApproved = function (amount) {
                toastr.success("product was restocked with " + amount, "Restock approved");
            };

            this.userUpdated = function (userId) {
                toastr.success("user " + userId + " updated", "Update Approved");
            };

            this.updateTerminated = function () {
                toastr.error("User could not be updated", "Update Terminated");
            };

            this.accountAvailableUpdated = function () {
                toastr.success("available products was updated", "Update Approved");
            };

            this.accountAvailableTerminated = function () {
                toastr.error("available products could not be updated", "Update Terminated");
            };
            this.accountPurchaseApproved = function (account, price) {
                toastr.success(account + " purchased for " + price, "Purchase Approved");
            };

            this.accountPurchaseTerminated = function () {
                toastr.error("error in purchase", "Purchase Terminated");
            };

            this.withdrawApproved = function (amount) {
                toastr.success(amount + " was withdrawn from account", "Withdraw Approved");
            };

            this.withdrawTerminated = function () {
                toastr.error("could not withdraw", "withdraw Terminated");
            };
        };

    });

})();


