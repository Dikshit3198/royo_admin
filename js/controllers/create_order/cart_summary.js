Royo.controller('CartSummaryCtrl', ['$scope', '$stateParams', 'services', 'factories', 'API', '$rootScope', '$translate', 'constants', '$state',
    function ($scope, $stateParams, services, factories, API, $rootScope, $translate, constants, $state) {
        $scope.cart = JSON.parse(localStorage.getItem('cart'));


        $scope.localization = factories.localisation();
        $scope.delivery_max_time;

        initLoc = function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {

                    $scope.position = { ...position.coords };
                });
            }
        }
        decimalRoundOff = function (num) {
            return Math.round(num * 100 + Number.EPSILON) / 100;
        }

        $scope.calculateProductHourlyPrice = function (product) {
            if (product['price_type']) {
                if (product['is_product']) {
                    $rootScope.timeInterval = 60;
                }

                product['hourly_price'].forEach(element => {
                    if (product['selectedQuantity'] * $rootScope.timeInterval >= element['min_hour'] && product['selectedQuantity'] * $rootScope.timeInterval < element['max_hour']) {
                        if (product['discount'] == 1 && element['discount_price']) {
                            product['fixed_price'] = parseFloat(element['discount_price']);
                            product['display_price'] = parseFloat(element['price_per_hour']);
                        } else {
                            product['fixed_price'] = parseFloat(element['price_per_hour']);
                        }
                    }
                });
                // return product;
                // product = $scope.calcAgentSvcPrice(product);
            }
        }

        checkCartUpdate = function () {
            const product_ids = $scope.cart.map((product) => product['product_id']);
            const payload = {
                product_ids: product_ids,
                // latitude: $scope.position.latitude,
                // longitude: $scope.position.longitude
                latitude: 30.7333148,
                longitude: 76.7794179
            }

            services.POST_DATA(payload, API.CHECK_PRODUCT_LIST, function (response) {

                let products = response.data.result;

                if (!products || !products.length) { return; };


                $scope.cart.forEach(cart_item => {
                    products.forEach(element => {
                        if (cart_item['product_id'] == element['product_id']) {
                            if (element.quantity > 0 && element.purchased_quantity < element.quantity) {
                                $scope.delivery_max_time = element['delivery_max_time'];
                                cart_item['price_type'] = element['price_type'];
                                cart_item['quantity'] = element['quantity'];
                                cart_item['purchased_quantity'] = element['purchased_quantity'];
                                if (element['quantity'] < cart_item['selectedQuantity']) {
                                    cart_item['selectedQuantity'] = 1;
                                }
                                if ($rootScope.is_loyality_enable == 1) {
                                    cart_item['perProductLoyalityDiscount'] = element['perProductLoyalityDiscount'];
                                }
                                cart_item['latitude'] = element['latitude'];
                                cart_item['longitude'] = element['longitude'];
                                cart_item['handling_supplier'] = element['handling_supplier'];
                                cart_item['handling_admin'] = element['handling_admin'];
                                cart_item['delivery_charges'] = element['delivery_charges'];
                                cart_item['radius_price'] = element['radius_price'];
                                cart_item['is_product'] = element['is_product'];
                                cart_item['distance_value'] = element['distance_value'];
                                cart_item['base_delivery_charges'] = element['base_delivery_charges'];
                                cart_item['base_delivery_charges_array'] = element['base_delivery_charges_array'];
                                cart_item['user_service_charge'] = element['user_service_charge'];
                                cart_item['duration'] = element['duration'];

                                if (cart_item['discount'] == element['discount']) {
                                    cart_item['isOutOfStock'] = false;

                                    if (cart_item['price_type']) {
                                        cart_item['hourly_price'] = element['hourly_price']
                                        $scope.calculateProductHourlyPrice(cart_item);
                                    } else {
                                        cart_item['fixed_price'] = parseFloat(element['fixed_price']);
                                        if ($rootScope.loyality_discount_on_product_listing == 1) {
                                            if (!!element['perProductLoyalityDiscount']) {
                                                cart_item.fixed_price = cart_item.fixed_price - (element['perProductLoyalityDiscount'] || 0);
                                            }
                                        }
                                        cart_item['display_price'] = parseFloat(element['display_price']);
                                    }
                                    // if (cart_item['customization'] && cart_item['customization'].length) {
                                    //   let addons = $scope.makeAddOnModel(cart_item['customization']);
                                    //   element.adds_on.forEach(addon => {
                                    //     (addon.value).forEach(type => {
                                    //       addons.forEach(cart_type => {
                                    //         if (cart_type['type_id'] == type['type_id']) {
                                    //           cart_type['price'] = type['price'];
                                    //           cart_type['type_name'] = type['type_name'];
                                    //         }
                                    //       })
                                    //     });
                                    //   });
                                    // }
                                }
                                cart_item['isOutOfStock'] = false;
                            } else {
                                cart_item['isOutOfStock'] = true;
                            }
                            // localStorage.setItem('cart', JSON.stringify($scope.cart))
                            $scope.setCart();
                        }
                    });
                });
            });

        }

        // initLoc();

        if ($scope.cart && $scope.cart.length) {
            $scope.userData = { ...$scope.cart[0].user_data };
            checkCartUpdate();
        }



        $scope.add = function (product, index) {

            if ($rootScope.enable_in_out_network) {
                if (product.is_out_network) {
                    if (product.selectedQuantity >= 1) {
                        factories.invalidDataPop($translate.instant('Maximum Limit Reached'))
                        return
                    }
                }
            }
            if (product['customization'] && product['customization'].length) {
                // return $scope.openAddOnDialog(product);
            } else {
                if ((product.selectedQuantity >= (Number(product.quantity) - Number(product.purchased_quantity))) ||
                    product.selectedQuantity * $rootScope.timeInterval >= product.maxHour) {
                    factories.invalidDataPop($translate.instant('Maximum Limit Reached'))
                    return;
                }
                if (product['price_type']) {
                    product.selectedQuantity += product.duration / $rootScope.timeInterval;
                    $scope.calculateProductHourlyPrice(product);
                } else {
                    if ($rootScope.is_decimal_quantity_allowed == 1) {
                        $scope.cart[index].selectedQuantity = $scope.decimalRoundOff($scope.cart[index].selectedQuantity + $rootScope.decimalQuantityStep);
                    } else {
                        $scope.cart[index].selectedQuantity++;
                    }
                }
                $scope.setCart();
            }
        }

        $scope.mins = function (product, index) {

            const minQty = product['price_type'] ? product.duration / $rootScope.timeInterval :
                ($rootScope.is_decimal_quantity_allowed == 1 ? $rootScope.decimalQuantityStep : 1);
            if (product.selectedQuantity > minQty) {
                if (product['customization'] && product['customization'].length) {
                    return $scope.openAddOnDialog(product);
                } else {
                    if (product['price_type']) {
                        product.selectedQuantity -= product.duration / $rootScope.timeInterval;
                        $scope.calculateProductHourlyPrice(product);
                    } else {
                        if ($rootScope.is_decimal_quantity_allowed == 1) {
                            $scope.cart[index].selectedQuantity = $scope.decimalRoundOff($scope.cart[index].selectedQuantity - $scope.decimalQuantityStep);
                        } else {
                            $scope.cart[index].selectedQuantity--;
                        }
                    }
                    $scope.setCart();
                }
            } else {
                services.CONFIRM(`${$translate.instant('This')} ${$scope.localization.product} ${$translate.instant('Will Get Removed From The Cart')}.`,
                    function (isConfirm) {
                        if (isConfirm) {
                            if ($rootScope.is_decimal_quantity_allowed == 1) {
                                $scope.cart[index].selectedQuantity = $scope.decimalRoundOff($scope.cart[index].selectedQuantity - $rootScope.decimalQuantityStep);
                            } else {
                                $scope.cart[index].selectedQuantity -= minQty;
                            }
                            if ($scope.cart[index].selectedQuantity == 0) {

                                $scope.cart.splice(index, 1);

                                $scope.$apply();
                            }

                            localStorage.removeItem('ques_data')
                            $scope.setCart();
                        }
                    });


            }
        }

        $scope.removeFromCart = function (index, custom, custId) {
            services.CONFIRM(`${$translate.instant('This')} ${$scope.localization.product} ${$translate.instant('Will Get Removed From The Cart')}.`,
                function (isConfirm) {
                    if (isConfirm) {
                        if (custom) {
                            let product = $scope.cart[index];
                            let ind = product.customization.findIndex(item => item.id == custId);
                            if (ind > -1) {
                                if (product.customization.length > 1) {
                                    product.selectedQuantity = product.selectedQuantity - product.customization[ind].quantity;
                                    product.customization.splice(ind, 1);
                                } else {
                                    $scope.cart.splice(index, 1);
                                }
                            }
                        } else {
                            $scope.cart.splice(index, 1);
                        }
                        $scope.$apply();
                        $scope.setCart();
                        localStorage.removeItem('ques_data');
                    }
                });
        }
        $scope.setCart = function () {
            $scope.getTotal();
            localStorage.setItem('cart', JSON.stringify($scope.cart))
        }




        // Price Calculation

        $scope.priceObj = {
            discount: 0,
            questionPrice: 0,
            agent_tip: 0,
            serviceCharge: 0,
            slot_price: 0,
        };

        $scope.questions = [];
        $scope.selfPickup = 0;
        $scope.is_dinin = 0;
        $scope.supplier_express_delivery_provide_objj = {};

        $scope.calulateProductPrice = function (product) {
            let netPrice = 0;

            if (product.customization && product.customization.length) {
                product.customization.forEach(item => {
                    let addOnPrice = 0;
                    item.data.forEach(i => {
                        i.value.forEach(type => {
                            addOnPrice += Number(type.price) * Number(type.adds_on_type_quantity);
                        })
                    })
                    netPrice += (parseFloat(product.fixed_price) + addOnPrice) * item.quantity;
                })
            } else if (product['price_type']) {
                netPrice = parseFloat(product.fixed_price);
            } else {
                netPrice = parseFloat(product.fixed_price) * product.selectedQuantity;
            }

            return netPrice;
        }

        $scope.calulateLiquorProductPrice = function (product) {
            let netPrice = 0;

            if (product.customization && product.customization.length) {
                product.customization.forEach(item => {
                    let addOnPrice = 0;
                    item.data.forEach(i => {
                        i.value.forEach(type => {
                            addOnPrice += Number(type.bottle_price) * Number(type.adds_on_type_quantity);
                        })
                    })
                    netPrice += addOnPrice * item.quantity;
                })
            } else {
                netPrice = $rootScope.liquor_bottle_tax * product.selectedQuantity;
            }

            return netPrice;
        }

        $scope.getTotal = function () {
            // const promo: PromoModel = new PromoModel($scope.promoModel);
            // promo.code = $scope.promoCode;
            // $scope.priceObj = new CartPriceModel({ ...$scope.priceObj, promo, walletAmount: $scope.walletAmount });

            if ($scope.cart && $scope.cart.length) {
                let totalAdminHandling = 0;
                let maxSupplierHandling = 0;
                let maxDeliveryCharges = 0;
                $scope.priceObj.amount = 0;
                for (let i = 0; i < $scope.cart.length; i++) {
                    const productAmount = $scope.calulateProductPrice($scope.cart[i]);

                    if (!$scope.cart[i].is_out_network) {
                        $scope.priceObj.amount += productAmount;
                    }

                    if ($scope.cart[i].is_liquor) {
                        $scope.priceObj.bottle_deposit_price += $scope.calulateLiquorProductPrice($scope.cart[i]);
                        $scope.priceObj.plt_tax += (productAmount * $rootScope.plt_liquor_tax) / 100;
                    }

                    if (maxDeliveryCharges < $scope.cart[i].delivery_charges) {
                        maxDeliveryCharges = $scope.cart[i].delivery_charges;
                    }

                    if ($scope.cart[i].handling_admin && $rootScope.disable_tax == 0) {
                        if ($rootScope.enable_custom_gst == 0) {
                            totalAdminHandling += (productAmount * $scope.cart[i].handling_admin) / 100;
                        } else {
                            totalAdminHandling += (productAmount * $rootScope.custom_tax_value) / 100;
                        }
                    }

                    if ($rootScope.enable_custom_tax_static) {
                        totalAdminHandling += (productAmount * $rootScope.custom_tax_static_value) / 100;
                    }

                    if (maxSupplierHandling < $scope.cart[i].handling_supplier) {
                        maxSupplierHandling = $scope.cart[i].handling_supplier;
                    }

                    if (!$scope.cart[i].is_out_network) {
                        $scope.is_any_in_network = true;
                    }
                }


                $scope.calculateQuestionPrice();
                if ($scope.priceObj.questionPrice && $rootScope.disable_tax == 0) {   // calculate taxes on question price (Addons Charges)
                    if ($rootScope.enable_custom_gst == 0) {
                        totalAdminHandling += ($scope.priceObj.questionPrice * $scope.cart[0].handling_admin) / 100;
                    } else {
                        totalAdminHandling += ($scope.priceObj.questionPrice * $rootScope.custom_tax_value) / 100;
                    }
                }

                $scope.priceObj.deliveryCharges = $rootScope.app_type == 1 || ($rootScope.app_type == 2 && $rootScope.ecom_agent_module == 1) ? $scope.delivery_charge : ($rootScope.app_type == 8 ? 0 : maxDeliveryCharges);
                $scope.priceObj.handlingAdmin = totalAdminHandling;
                $scope.priceObj.handlingSupplier = maxSupplierHandling;
                $scope.priceObj.handingCharges = totalAdminHandling;

                if ($scope.activePlan) {
                    if ($scope.priceObj.amount > $scope.activePlan.min_order_amount) {
                        $scope.priceObj.deliveryCharges = 0;
                    }
                }



                if ($rootScope.is_delivery_charge_weight_wise_enable) {
                    setTimeout(() => {
                        if ($scope.product_weight_list.length > 0) {
                            var self = $scope;
                            var availablePrice;
                            $scope.product_weight_list.sort(function (a, b) { return b.weight - a.weight });
                            $scope.product_weight_list.every(function (weight) {
                                if (weight.weight <= self.total_product_weight) {
                                    availablePrice = weight;
                                    return false;
                                }
                                return true;
                            });
                            if (availablePrice) {
                                $scope.priceObj.deliveryCharges = availablePrice.delivery_charge;
                            }
                            else {
                                $scope.priceObj.deliveryCharges = $rootScope.app_type == 1 || ($rootScope.app_type == 2 && $rootScope.ecom_agent_module == 1) ? $scope.delivery_charge : ($rootScope.app_type == 8 ? 0 : maxDeliveryCharges);
                            }
                        }
                    }, 500);
                }
            }


            // $scope.getDeliveryChargesByMinOrderAmt();

            // if ($rootScope.enable_mosich_delivery_charge_algo) {
            //     $scope.getDeliveryChargesForMosich();
            // }

            if (!!$scope.promoModel && !!$scope.promoModel.id) {
                if ($scope.priceObj.amount < $scope.promoModel['minOrder']) {
                    if ($scope.cart && $scope.cart.length)
                        $scope.message.toast('info', `${$scope.translate.instant('Your Cart Total Must Be Greater Than')} ${$scope.currency}${$scope.promoModel.minOrder}`);
                    $scope.promoModel = null;

                    $scope.applyDiscount();
                } else {
                    $scope.calDiscountAmount();
                }
            } else {
                $scope.applyDiscount();
            }


        }

        $scope.calDiscountAmount = function () {
            let cart_total = 0;
            let discount_amount = 0;

            $scope.is_voucher_applied = false;
            $scope.cart.forEach(product => {

                if ($scope.promoModel.discountType != 2) {
                    if ($scope.promoModel['categoryIds'].length) {
                        $scope.promoModel['categoryIds'].forEach(element => {
                            if (element == product.categoryId) {
                                cart_total += $scope.calulateProductPrice(product);
                            }
                        });
                    } else if ($scope.promoModel['supplierIds'].length) {
                        $scope.promoModel['supplierIds'].forEach(element => {
                            if (element == product.supplier_id) {
                                cart_total += $scope.calulateProductPrice(product);
                            }
                        });
                    }
                }

                if ($scope.promoModel.discountType === 2) {
                    $scope.promoModel.discountPrice = 0;


                    if ($scope.promoModel.product_ids) {
                        const productArray = $scope.promoModel.product_ids.split(',');

                        // if ($scope.promoModel.discountType === 2) { // buy some get some free
                        // $scope.cart.forEach((element,index) => {
                        if (productArray.includes(typeof product.productId !== 'string' ? JSON.stringify(product.productId) : product.productId)) {

                            if (product.selectedQuantity >= $scope.promoModel.promo_buy_x_quantity) {
                                // tslint:disable-next-line: radix
                                const productsFree = $scope.promoModel.promo_get_x_quantity - $scope.promoModel.promo_buy_x_quantity;
                                let freeQuantity = Math.floor(product.selectedQuantity / productsFree) * productsFree;
                                freeQuantity = (freeQuantity > $scope.promoModel.max_buy_x_get) ? $scope.promoModel.max_buy_x_get : freeQuantity;


                                $scope.priceObj.freeQuantity = $scope.priceObj.freeQuantity + freeQuantity;
                                // $scope.cart[index]['freeQuantity'] =  freeQuantity;

                                product['freeQuantity'] = freeQuantity;
                                $scope.promoModel.discountPrice += (product['freeQuantity'] * product.fixed_price);

                                discount_amount = $scope.promoModel.discountPrice >= cart_total ? cart_total : $scope.promoModel.discountPrice;

                            } else {
                                product['freeQuantity'] = 0;
                            }
                        }

                        if ($scope.priceObj.freeQuantity > 0) {
                            $scope.is_voucher_applied = true;
                        }
                    }
                }
            });
            if (cart_total > 0) {
                if ($scope.promoModel.discountType) {
                    discount_amount = cart_total * ($scope.promoModel.discountPrice / 100);
                } else {
                    discount_amount = $scope.promoModel.discountPrice >= cart_total ? cart_total : $scope.promoModel.discountPrice;
                }
            }
            $scope.priceObj.discount = discount_amount > 0 ? discount_amount : 0;


            if ($rootScope.is_enable_max_discount_value) {
                if ($scope.promoModel.max_discount_value > 0 && $scope.priceObj.discount > $scope.promoModel.max_discount_value) {
                    $scope.priceObj.discount = $scope.promoModel.max_discount_value;
                }
            }
            $scope.applyDiscount();
        }

        $scope.calculateGST = function () {
            if ($rootScope.enable_custom_gst == 1) {
                $scope.priceObj.handlingAdmin += (($scope.priceObj.deliveryCharges + $scope.priceObj.serviceCharge) * $rootScope.custom_tax_value) / 100;
                $scope.priceObj.handingCharges += (($scope.priceObj.deliveryCharges + $scope.priceObj.serviceCharge) * $rootScope.custom_tax_value) / 100;
            }
        }

        $scope.serviceChargeCalculation = function () {
            if ($rootScope.enable_flat_user_service_charge) {
                $scope.priceObj.flat_user_service_charges = [];
                $scope.rest_user_service_charges.forEach(element => {
                    var prods = $scope.cart.filter(x => x.supplier_id == element.supplier_id);
                    element['product_amount'] = prods.reduce(function (a, b) {
                        return a + (parseFloat(b.fixed_price) * parseInt(b.selectedQuantity))
                    }, 0);
                    if (element.is_user_service_charge_flat) {
                        $scope.priceObj.flat_user_service_charges.push({ supplier_id: element.supplier_id, serviceCharge: element.user_service_charge });
                        $scope.priceObj.serviceCharge += element.user_service_charge;
                    }
                    else {
                        var perCharge = (element.user_service_charge / 100) * element.product_amount;
                        $scope.priceObj.flat_user_service_charges.push({ supplier_id: element.supplier_id, serviceCharge: perCharge });
                        $scope.priceObj.serviceCharge += perCharge;
                    }
                });
            }
            else {
                if ($rootScope.supplier_service_fee == 1 && $scope.priceObj.supplier_service_charge && $rootScope.vendor_status == 0) {
                    $scope.priceObj.serviceCharge = ($scope.priceObj.supplier_service_charge / 100) * $scope.priceObj.amount;
                } else if ($rootScope.supplier_service_fee == 1 && $scope.rest_user_service_charges) {
                    $scope.priceObj.serviceCharge = 0;
                    let supplier_wise_data = $scope.util.groupBy($scope.rest_user_service_charges, 'supplier_id');
                    Object.values(supplier_wise_data).forEach((products) => {
                        products.forEach(product => {
                            const productAmount = $scope.calulateProductPrice(product);
                            $scope.priceObj.serviceCharge += (product.user_service_charge / 100) * productAmount;
                        });
                    });
                }
            }
        }

        $scope.applyDiscount = function () {
            $scope.serviceChargeCalculation();
            if ($rootScope.enable_custom_gst == 1) {
                $scope.calculateGST();
            }

            if ($scope.promoModel && $scope.promoModel.discountType === 2) {
                $scope.cart.forEach(ele => {
                    if (!$scope.priceObj.freeQuantity) {
                        ele.freeQuantity = 0;
                    }
                });

                $scope.cartUpdated.emit($scope.cart);

            }
            let subtotal = 0
            if ($scope.applyWalletDiscount && $rootScope.payment_through_wallet_discount) {
                $scope.priceObj.walletDiscountAmount = ($scope.priceObj.amount / 100) * $rootScope.payment_through_wallet_discount;
                if ($scope.priceObj.walletAmount >= $scope.priceObj.walletDiscountAmount) {
                    subtotal = $scope.priceObj.amount - $scope.priceObj.walletDiscountAmount;
                } else {
                    subtotal = $scope.priceObj.amount;
                    // $scope.message.toast('info', `${$scope.translate.instant('Your Wallet Total Must Be Greater Than')} ${$scope.currency}${$scope.promoModel.minOrder}`);
                }
            } else {
                $scope.priceObj.walletAmount = 0;
                subtotal = $scope.priceObj.amount >= $scope.priceObj.discount ? $scope.priceObj.amount - $scope.priceObj.discount : 0;

            }
            $scope.priceObj.netTotal = subtotal + $scope.priceObj.questionPrice + $scope.priceObj.deliveryCharges + $scope.priceObj.handingCharges + $scope.priceObj.agent_tip + $scope.priceObj.serviceCharge + $scope.priceObj.slot_price;

            //To Display Calculations
            $scope.priceObj.displayNetTotal = $scope.priceObj.netTotal;
            if (!!$scope.priceObj.perProductLoyalityDiscount && !$rootScope.loyality_discount_on_product_listing) {
                $scope.priceObj.displayNetTotal -= $scope.priceObj.productLoyaltyDiscountAmount;
            }
            if ($scope.priceObj.displayNetTotal >= $scope.priceObj.referral_amount) {
                $scope.priceObj.displayNetTotal -= $scope.priceObj.referral_amount
            }

            if ($scope.priceObj.appliedLoyaltyAmount && !$rootScope.loyality_discount_on_product_listing) {
                if ($scope.priceObj.displayNetTotal >= $scope.priceObj.totalLoyaltyAmount) {
                    $scope.priceObj.displayNetTotal -= $scope.priceObj.appliedLoyaltyAmount;
                    $scope.priceObj.netTotal = $scope.priceObj.displayNetTotal;
                } else {
                    $scope.priceObj.displayNetTotal = 0;
                }
            }

            if ($rootScope.is_currency_exchange_rate == 1 && $scope.priceObj.currency_exchange_rate) {
                $scope.priceObj.displayNetTotal = $scope.priceObj.displayNetTotal * $scope.priceObj.currency_exchange_rate;
            }


            if ($rootScope.enable_tax_on_total_amt && $scope.cart.length > 0) {
                $scope.priceObj.displayNetTotal -= $scope.priceObj.handlingAdmin;
                $scope.priceObj.handlingAdmin = ($scope.priceObj.displayNetTotal * $scope.cart[0].handling_admin) / 100;
                $scope.priceObj.handingCharges = $scope.priceObj.handlingAdmin;
                $scope.priceObj.displayNetTotal += $scope.priceObj.handingCharges;
            }

            if ($scope.is_out_network && !$scope.is_any_in_network) {
                $scope.priceObj.displayNetTotal -= $scope.priceObj.handingCharges;
                $scope.priceObj.handingCharges = 0;
                $scope.priceObj.handlingAdmin = 0;
            }

            if ($scope.table_booking_details) {
                if ($scope.table_booking_details.table_booking_price) {
                    if (!$rootScope.table_book_mac_theme) {
                        $scope.priceObj.netTotal += $scope.table_booking_details.table_booking_price;
                    }
                    $scope.priceObj.displayNetTotal = $scope.priceObj.netTotal;
                }
            }

            if ($rootScope.enable_liquor_popup) {
                $scope.priceObj.netTotal += $scope.priceObj.plt_tax + $scope.priceObj.bottle_deposit_price;
                $scope.priceObj.displayNetTotal = $scope.priceObj.netTotal;
            }

            if ($rootScope.enable_supplier_express_schedule_delivery_provide) {
                $scope.priceObj.netTotal += $scope.supplier_express_delivery_provide_objj.express_delivery_charges || 0;
                $scope.priceObj.displayNetTotal = $scope.priceObj.netTotal;
            }

            // $scope.priceDetail.emit($scope.priceObj);
        }


        $scope.calculateQuestionPrice = function () {
            if ($scope.questions.length && $rootScope.app_type == 8) {
                $scope.questions.forEach(question => {
                    question.optionsList.forEach(option => {
                        if (option.valueChargeType == 1) {
                            $scope.priceObj.questionPrice += option.flatValue;
                        } else {
                            let percentageValue = ($scope.priceObj.amount * option.percentageValue) / 100;
                            $scope.priceObj.questionPrice += percentageValue;
                        }
                    });
                });
            }
        }




        // order place
        $scope.cartModel = {};
        $scope.updateCartModel = {};
        $scope.deliveryType = 0;
        $scope.paymentType = '0';

        $scope.placeOrder = function () {
            $scope.makeModelData();
        }

        $scope.CartProductModel = function (product) {
            return _(product).pick('handling_admin', 'handling_supplier', 'price_type',
                'supplier_branch_id', 'supplier_id', 'quantity', 'productId', 'category_id', 'agent_type', 'price', 'perProductLoyalityDiscount', 'duration', 'tax');
        }
        $scope.makeModelData = function () {
            if(!$scope.userData.address_id) {
                factories.invalidDataPop($translate.instant("User haven't added any address"));
                return false;
            }

            $scope.cartModel.accessToken = constants.ACCESSTOKEN;
            $scope.cartModel.userId = $scope.userData.id;
            $scope.cartModel.supplierBranchId = $scope.cart[0].supplier_branch_id;
            $scope.cartModel.supplier_id = $scope.cart[0].supplier_id;

            $scope.cartModel.order_time = moment().format('HH:mm:ss');
            let day = [6, 0, 1, 2, 3, 4, 5];
            $scope.cartModel.order_day = day[(new Date()).getDay()];

            $scope.cartModel.deviceId = '0';
            $scope.cartModel.cartId = '0';
            $scope.cartModel.addOn = 0
            $scope.cartModel.questions = [];

            $scope.cartModel.adds_on = [];
            $scope.cartModel.variants = [];
            $scope.cartModel.productList = [];

            for (let i = 0; i < $scope.cart.length; i++) {
                $scope.cart[i].productId = $scope.cart[i].product_id;
                $scope.cart[i].price = $scope.cart[i].fixed_price;
                $scope.cart[i].agent_type = 1;
                let model = { ...$scope.CartProductModel($scope.cart[i]) }; // new CartProductModel($scope.cart[i]);

                if ($scope.cart[i].cartVariants && $scope.cart[i].cartVariants.length) {
                    $scope.cartModel.variants.push(...$scope.cart[i].cartVariants);
                }

                // $scope.cartModel.adds_on.push(...$scope.makeAddOnModel($scope.cart[i]['customization']));
                model['category_id'] = $scope.cart[i].categoryId || $scope.cart[i].category_id;
                model['agent_type'] = $scope.cart[i].agent_list && $scope.cart[i].is_agent ? 1 : 0;
                model.quantity = $scope.cart[i]['price_type'] ? 1 : $scope.cart[i].selectedQuantity;
                model['freeQuantity'] = $scope.cart[i].freeQuantity || 0;
                model.productDurations = this.cart[i]['price_type'] ? $scope.cart[i].selectedQuantity * $rootScope.timeInterval : 0;

                if ($scope.cart[i].is_out_network) {
                    $scope.is_out_network = true;
                    model['product_dimensions'] = $scope.cart[i].product_dimensions;
                    model['product_owner_name'] = $scope.cart[i].product_owner_name;
                    model['product_reference_id'] = $scope.cart[i].product_reference_id;
                    model['product_upload_reciept'] = $scope.cart[i].product_upload_reciept;
                } else {

                    model['product_reference_id'] = '';
                }

                if ($rootScope.enable_product_special_instruction == 1) {
                    if ($scope.cart[i]['customization'] && $scope.cart[i]['customization'].length) {
                        let instructions = [];
                        instructions.push(...$scope.makeSpecialInstructionModel($scope.cart[i]['customization'], $scope.cart[i]['productId']));

                        if (instructions.length) {
                            $scope.cartModel['special_instructions'] = instructions;
                        }
                    } else if ($scope.cart[i].special_instructions) {
                        model['special_instructions'] = $scope.cart[i].special_instructions;
                    }
                }

                if ($scope.cart[i].agentBufferPrice) {
                    model['agentBufferPrice'] = $scope.cart[i].agentBufferPrice
                }

                if ($rootScope.enable_multi_supplier_delivery_charge_distance_wise && $rootScope.delivery_charge_type == 0) {
                    model['delivery_charge'] = $scope.cart[i].delivery_charges;
                } else if ($rootScope.delivery_charge_type == 1) {
                    model['delivery_charge'] = $scope.cart[i].radius_price;
                }

                if ($rootScope.enable_flat_user_service_charge && $scope.priceObj.flat_user_service_charges.length) {
                    model['handling_supplier'] = $scope.priceObj.flat_user_service_charges.find(x => x.supplier_id == $scope.cart[i].supplier_id).serviceCharge;
                } else if ($rootScope.vendor_status == 1) {
                    let supplier_data = [...new Map($scope.cart.map(item => [item['supplier_id'], item])).values()];
                    if (supplier_data.length > 1) {
                        model['tax'] = ($scope.cart[i].handling_admin / 100) * ($scope.cart[i].fixed_price * $scope.cart[i].selectedQuantity);
                        model['handling_supplier'] = ($scope.cart[i].user_service_charge / 100) * $scope.cartService.calulateProductPrice($scope.cart[i]);
                    }
                }

                $scope.cartModel.productList.push(model);
            }

            // update cart model data

            $scope.updateCartModel.accessToken = constants.ACCESSTOKEN;
            $scope.updateCartModel.userId = $scope.userData.id;
            $scope.updateCartModel.currencyId = '1'; //$scope.util.handler.currencyId;
            $scope.updateCartModel.languageId = '14'; //$scope.util.handler.languageId;
            $scope.updateCartModel.deliveryType = $scope.deliveryType.toString();
            $scope.updateCartModel.deliveryCharges = $scope.priceObj.deliveryCharges.toString();
            $scope.updateCartModel.handlingAdmin = $scope.priceObj.handlingAdmin.toString();
            $scope.updateCartModel.handlingSupplier = $scope.priceObj.handlingSupplier.toString();
            $scope.updateCartModel.netAmount = $scope.priceObj.netTotal;

            $scope.updateCartModel.liquor_bottle_deposit_tax = $scope.priceObj.bottle_deposit_price;
            $scope.updateCartModel.liquor_plt_deposit_tax = $scope.priceObj.plt_tax;

            $scope.updateCartModel.delivery_max_time = $scope.pickUp_dateTime ? moment($scope.pickUp_dateTime['date_time']).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
            let date = moment();
            if ($scope['delivery_max_time']) {
                date = date.add($scope['delivery_max_time'], 'minutes');
            }

            if ($scope.deliveryType == 1) {
                date = date.add($scope.addressDetail['urgent_delivery_time'], 'minutes');
                $scope.updateCartModel.urgentPrice = $scope.urgentPrice;
            }

            $scope.updateCartModel.deliveryDate = $scope.pickUp_dateTime ? moment($scope.pickUp_dateTime['date_time']).format('YYYY-MM-DD') : date.format('YYYY-MM-DD');
            $scope.updateCartModel.deliveryTime = $scope.pickUp_dateTime ? moment($scope.pickUp_dateTime['date_time']).format('HH:mm') : date.format('HH:mm');
            $scope.updateCartModel.day = $scope.pickUp_dateTime ? moment($scope.pickUp_dateTime['date_time']).day() : new Date().getDay();

            // $scope.addressDetail.free_delivery_amount
            if ($scope.priceObj.amount + $scope.priceObj.handlingSupplier + $scope.priceObj.handlingAdmin >= 0) {
                $scope.updateCartModel.minOrderDeliveryCrossed = 1;
            } else {
                $scope.updateCartModel.minOrderDeliveryCrossed = 0;
            }

            if ($scope.self_pickup == 1) {
                $scope.updateCartModel.deliveryId = '0';
            } else {
                $scope.cartModel.latitude = $scope.cart[0].latitude; // $scope.addressDetail.address.latitude;
                $scope.cartModel.longitude = $scope.cart[0].longitude; // $scope.addressDetail.address.longitude;
                $scope.updateCartModel.deliveryId = $scope.userData.address_id; //$scope.addressDetail.address.id;
            }

            if ($rootScope.app_type == 8 && $scope.questions.length) {
                $scope.cartModel.questions = $scope.questions.slice();
                $scope.cartModel.addOn = $scope.priceObj.questionPrice;
                $scope.updateCartModel.questions = $scope.questions.slice();
                $scope.updateCartModel.addOn = $scope.priceObj.questionPrice;
            }

            $scope.addToCart();
            // $scope.afterUpdateCart();
        }


        $scope.addToCart = function () {
            // $scope.isLoading = true;
            services.POST_DATA($scope.cartModel, API.ADD_TO_CART, function (response) {
                if (!!response && response.data) {
                    $scope.updateCartModel.cartId = response.data.cartId;
                    $scope.updateCart();
                }
            });
        }


        $scope.updateCart = function () {
            services.POST_DATA($scope.updateCartModel, API.UPDATE_CART_INFO, function (response) {
                if (!!response && response.data) {
                    $scope.afterUpdateCart();
                } else {
                    $scope.isLoading = false;
                }
            });
        }


        var datepicker = function () {
            $scope.showSlots = false;
            setTimeout(() => {
                $scope.order_date = moment();
                var picker = new Lightpick({
                    field: document.getElementById("datepicker_order"),
                    minDate: moment(),
                    startDate: moment(),
                    onSelect: function (start) {

                        if (start) {
                            $scope.order_date = start.format('YYYY-MM-DD');
                        } else if (!start) {

                            picker.hide();
                            $scope.order_date = '';
                        }
                    }
                });
            }, 500);
        }

        $scope.afterUpdateCart = function () {
            // if (!$scope.is_service || ((!$scope.is_agent || $scope.cart[0].agent_slot) && $rootScope.hideAgentList == 0) || $scope.isBookNow || $scope.serviceDateTime) {
            //     $scope.generateOrder();
            // } else {
            let serviceIds = [];
            $scope.cart.forEach(data => {
                serviceIds.push(data.productId);
            });
            localStorage.setItem('cart_id', JSON.stringify({ id: $scope.updateCartModel.cartId, service_ids: serviceIds }));
            $scope.cartDateTimeData = {
                is_open: true,
                cart: $scope.cart,
                priceObj: $scope.priceObj,
                data: {
                    service_ids: serviceIds.join(),
                    cart_id: $scope.updateCartModel.cartId,
                    isPkg: '0',
                    payType: $scope.paymentType,
                    promo: ($scope.priceObj.promo && $scope.priceObj.promo.code) ? $scope.priceObj.promo.code : null,
                    discount: $scope.priceObj.discount,
                    promoId: ($scope.priceObj.promo && $scope.priceObj.promo.id) ? $scope.priceObj.promo.id : null,
                }
            }

            if ($rootScope.extra_instructions == 1) {
                $scope.cartDateTimeData.data['parking_instructions'] = $scope.parking_instruction;
                $scope.cartDateTimeData.data['area_to_focus'] = $scope.area_to_focus;
            }

            $("#cart_date_time").modal('show');
            $scope.getAgentKeys();
            datepicker();
            $scope.isLoading = false;
            // }
        }



        // Agent Slots
        $scope.headers = {};
        $scope.getAgentKeys = function () {
            var data = {};
            services.POST_DATA({}, API.GET_AGENT_KEYS, function (response) {
                if (!!response && response.data) {
                    // $scope.headers = response.data;
                    response.data.forEach(element => {
                        $scope.headers[element.key] = element.value;
                    });

                }
            });
        };


        $scope.orderDateSelected = function () {


            $scope.showSlots = true;
            $scope.getSlots();
        }

        $scope.getSlots = function () {

            var data = {
                date: moment($scope.order_date).format('YYYY-MM-DD'),
                offset: moment().format('Z'),
            };
            services.GET_AGENT_DATA(data, API.GET_AGENT_SLOTS, $scope.headers, function (response) {
                if (!!response && response.data) {

                    let slots = response.data;
                    if (moment($scope.date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
                        slots = _.filter(slots, (slot) => moment(moment($scope.date).format('YYYY-MM-DD') + ' ' + slot).isAfter(moment(), 'minutes'));
                    }
                    slots = _.sortBy(slots, (o) => { return o; });
                    if (slots.length) {
                        $scope.slotData = {
                            Morning: [],
                            Afternoon: [],
                            Evening: [],
                            Night: []
                        }
                        slots.forEach(function (time) {
                            switch (true) {
                                case $scope.getHours(time) >= 0 && $scope.getHours(time) < 12:
                                    $scope.slotData.Morning.push($scope.timeFormat(time));
                                    break;
                                case $scope.getHours(time) >= 12 && $scope.getHours(time) < 16:
                                    $scope.slotData.Afternoon.push($scope.timeFormat(time));
                                    break;
                                case $scope.getHours(time) >= 16 && $scope.getHours(time) < 21:
                                    $scope.slotData.Evening.push($scope.timeFormat(time));
                                    break;
                                case $scope.getHours(time) >= 21 && $scope.getHours(time) < 24:
                                    $scope.slotData.Night.push($scope.timeFormat(time));
                                    break;
                            }
                        });

                    } else {
                        $scope.slotData = {
                            Morning: [],
                            Afternoon: [],
                            Evening: [],
                            Night: []
                        }
                    }
                    $scope.noData = true;

                }
            });
        };

        $scope.getHours = function (time) {
            return moment.duration(time).asHours();
        }

        $scope.timeFormat = function (time) {
            return moment(time, ["HH:mm:ss"]).format('h:mm A');
        }

        $scope.selectSlot = function (slot) {


            $scope.slotTime = slot;
            $scope.time = moment(slot, ["h:mm A"]).format('HH:mm:ss');
        }



        $scope.submitSLots = function () {
            if (!$scope.time) {
                $scope.message.toast("error", "Please select the slot time");
                return;
            }
            if ($scope.cart.length) {

                $scope.cart_date_time_obj = {};
                $scope.cart_date_time_obj['date_time'] = moment($scope.date).format('YYYY-MM-DD') + ' ' + $scope.time;

                $scope.generateOrder();

                $("#cart_date_time").modal('hide');


            }
        }

        $scope.generateOrder = function () {
            let offset = moment().format('Z');
            let obj = {};
            obj.cartId = $scope.cartDateTimeData.data.cart_id;
            obj.languageId = '14'; // $scope.util.handler.languageId;
            obj.isPackage = '0';
            obj.paymentType = $scope.paymentType;
            obj.accessToken = constants.ACCESSTOKEN;

            obj.userId = $scope.userData.id;
            obj.offset = offset;
            obj.date_time = $scope.cart_date_time_obj.date_time;
            obj.type = $rootScope.app_type;
            obj.service_pickup = 0;
            if ($rootScope.is_laundry_theme == '1') {
                obj.drop_off_date = $scope.cart_date_time_obj.drop_off_date
            }

            if ($scope.cartDateTimeData.data.promo) {
                obj['promoCode'] = $scope.cartDateTimeData.data.promo;
                obj['discountAmount'] = $scope.priceObj.discountAmount || $scope.priceObj.discount;
                obj['promoId'] = $scope.cartDateTimeData.data.promoId;
            }

            if ($rootScope.extra_instructions == 1) {
                obj['parking_instructions'] = $scope.cartDateTimeData.data.parking_instruction;
                obj['area_to_focus'] = $scope.cartDateTimeData.data.area_to_focus;
            }

            obj['duration'] = 0;
            $scope.cart.forEach(data => {
                if (data['price_type']) {
                    obj['duration'] += ($rootScope.timeInterval * data['selectedQuantity']);
                } else {
                    obj['duration'] += (data['duration'] * data['selectedQuantity']);
                }
            });

            $scope.isLoading = true;

            services.POST_DATA(obj, API.GENERATE_ORDER, function (response) {
                if (!!response && response.data) {

                    $state.go('orders.ordersDescription', { order_id: response.data, tab: 0 })
                    // $scope.setCart([]);
                    setTimeout(() => {
                        factories.successActionPop($scope.localization.order + ` ${$translate.instant('Placed Successfully')}!`)
                    }, 800);
                    $scope.emptyCart();
                }
                $scope.isLoading = false;

            });
        }

        $scope.emptyCart = function () {
            localStorage.setItem('cart', JSON.stringify([]))
            localStorage.removeItem('cart_id');
            localStorage.removeItem('ques_data');
        }

        $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {            
            if (toState.name != 'cart.summary') {
                $scope.emptyCart();
            }
        });
    }]);