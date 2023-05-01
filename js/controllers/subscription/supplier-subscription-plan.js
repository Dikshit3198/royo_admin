Royo.controller('SupplierSubscriptionPlanCtrl', ['$scope', 'services', 'factories', 'API', 'pagerService', '$rootScope', 'constants',

    function ($scope, services, factories, API, pagerService, $rootScope, constants) {

        $scope.is_add = false;
        $scope.name = '';
        $scope.planList = [];
        $scope.selected_count = 0;
        $scope.isPlanActive = false;
        $scope.dataLoaded = false;
        $scope.message = '';
        $scope.count = 0;
        $scope.skip = 0;
        $scope.limit = 12;
        $scope.currentPage = 1;
        $scope.sort_by = '';

        $scope.isMultiplePaymentGateway = false;
        $scope.selectedPaymentType = 'Stripe';
        $scope.planToPurchase = {};

        $scope.Receipt_url = null;
        $scope.Receipt_url_toView = '';

        const initStripe = function () {
            const stripeGateway = $rootScope.paymentGateways.find(gateway => (gateway.name).toLowerCase() == 'stripe')
            const stripeConfig = stripeGateway.key_value_front.find(config => config.for_front == 1);
            $scope.stripe = window.Stripe(stripeConfig.value);
        }

        var checkOtherPaymentGateways = function () {
            const oxxo = $rootScope.paymentGateways.find(gateway => (gateway.name).toLowerCase() == 'oxxo');
            if (!!oxxo) {
                // $scope.oxxo_detail = {...oxxo};
                let oxxo_name = oxxo.key_value_front.find(o => o.key == 'oxxo_name').value;
                let oxxo_account = oxxo.key_value_front.find(o => o.key == 'oxxo_account_id').value;
                $scope.oxxo_detail = {
                    oxxo_name,
                    oxxo_account
                }
                console.log($scope.oxxo_detail);
                $scope.isMultiplePaymentGateway = true;
            }
        }


        $scope.getPlanList = function (page) {
            const params = {
                supplier_id: $rootScope.active_supplier_id
            }

            services.GET_DATA(params, API.SUPPLIER_SUBSCRIPTION_PLANS, function (response) {
                $scope.planList = response.data;
                $scope.count = response.data.count;
                $scope.isPlanActive = response.data.some(item => item.is_active == 1);
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                if (!localStorage.getItem('supplierSubscription') && $scope.isPlanActive) {
                    const activePlan = response.data.find(item => item.is_active == 1);
                    localStorage.setItem('supplierSubscription', JSON.stringify([activePlan]));
                }

                checkOtherPaymentGateways();
                $scope.dataLoaded = true;
            })
        }

        $scope.getPlanList(1);

        $scope.selectPayment = function (value) {
            $scope.selectedPaymentType = value;
        }

        $scope.openPaymentSteps = function () {
            $("#selectGateway").modal('hide');
            if ($scope.selectedPaymentType == 'Stripe') {
                $scope.purchasePlan($scope.planToPurchase);
            } else {
                $scope.Receipt_url_toView = '';
                $scope.Receipt_url = null;
                $("#uploadReceipt").modal('show');
            }
        }

        $scope.checkPaymentGateway = function (plan) {
            if ($scope.isMultiplePaymentGateway) {

                $scope.selectedPaymentType = 'Stripe';
                $("#selectGateway").modal('show');
                $scope.planToPurchase = { ...plan };
            } else {
                $scope.purchasePlan(plan);
            }
        }

        $scope.purchasePlan = function (plan) {
            // debugger
            if($rootScope.enable_paystack_gatway_for_supplier_addsubscription == 1){
                paystackGatway(plan);
            }
            else{              
            if (!$scope.stripe) {
                initStripe();
            }

            const params = {
                plan_id: plan.id,
                stripe_plan_id: plan.plan_id,
                supplier_id: $rootScope.active_supplier_id,
                type: 'card',
                successUrl: `${window.location.origin}/#!/success`,
                failureUrl: `${window.location.origin}/#!/failure`
            }

            services.GET_DATA(params, API.SUPPLIER_STRIP_SESSIONID, function (response) {
                $scope.stripe.redirectToCheckout({ sessionId: response.data.id }, function (response) {
                    console.log(response);
                });
            })
        }
            
        }

        $scope.purchasePlanOxxo = function (plan) {

            if (!$scope.Receipt_url_toView) {
                factories.invalidDataPop("Please upload receipt image");
                return;
            }

            const params = {
                plan_id: plan.id,
                current_period_start: new Date().getTime().toString(),
                current_period_end: new Date(moment().add(1, plan.type)).getTime().toString(),
                payment_source: 'oxxo',
                supplier_id: $rootScope.active_supplier_id,
                reciept_url: $scope.Receipt_url_toView
            }
            console.log('dweudhe', params);

            services.POST_DATA(params, API.SUPPLIER_BUY_SUBSCRIPTION, function (response) {

                $scope.Receipt_url = null;
                $scope.planToPurchase = {};
                $scope.Receipt_url_toView = '';
                $("#uploadReceipt").modal('hide');
                $scope.getPlanList(1);
            })
        }


        $scope.file_to_upload_for_doc = function (File, type) {
            var file = File[0];
            if (constants.IMAGE_TYPE.includes(file.type)) {
                if ((file.size / Math.pow(1024, 2)) <= 7) {
                    $scope.image_file = File[0];
                    var Obj = {};
                    Obj.image = File[0];
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        $scope.$apply(function () {
                            $scope.uploadImage(File[0], function (err, imageUrl) {
                                $scope.Receipt_url_toView = imageUrl;
                            })
                            $scope.Receipt_url = File[0];
                        });
                    }
                } else {
                    factories.invalidDataPop("Image size must be less than 7mb");
                }
            } else {
                factories.invalidDataPop("Invalid File Type");
            }
        };

        $scope.uploadImage = function (file, callback) {     // Get Image Url
            if (!file) {
                return callback(null, file)
            }

            const data = {
                'file': file
            }

            services.POST_FORM_DATA(data, API.UPLOAD_IMAGE, (response) => {
                if (response && response.data) {
                    return callback(null, response.data)
                }
            })
        }

        // paystack implement
    var paystackGatway = function(plan){
            var key;

            const paystackGateway = $rootScope.paymentGateways.find(gateway => (gateway.name).toLowerCase() == 'paystack')
            const paystackConfig = paystackGateway.key_value_front.find(config => config.for_front == 1);
             key = paystackConfig.value;

        var handler = PaystackPop.setup({
      key: key || '',
      email: plan.supplier_email,
      amount: Math.round(((Number)(plan.price*100))),
      currency: 'NGN',
      metadata:{'detail':'text'},
      callback: (response) => {
          console.log(response)
        if (response.status === 'success') {
            const params = {
                plan_id: plan.id,
                current_period_start: new Date().getTime().toString(),
                current_period_end: new Date(moment().add(1, plan.type)).getTime().toString(),
                payment_source: 'paystack',
                supplier_id: $rootScope.active_supplier_id,
                reciept_url: 'test'
            }
            console.log('dweudhe', params);

            services.POST_DATA(params, API.SUPPLIER_BUY_SUBSCRIPTION, function (response) {
             
                $scope.Receipt_url = null;
                $scope.planToPurchase = {};
                $scope.Receipt_url_toView = '';
                $("#uploadReceipt").modal('hide');
                $scope.getPlanList(1);
            })
          
        } else {
            factories.invalidDataPop("payment failed !");
        }
      },
      onClose: () => {
        
      }
    });
    handler.openIframe();
            
        }


        $scope.cancelSubscription = function (plan) {
            services.CONFIRM(`You want to cancel this subscription`,
                function (isConfirm) {
                    if (isConfirm) {
                        var params = {};
                        params.sub_id = plan.subscription_id;
                        if (plan.payment_source == 'oxxo') {
                            params.payment_source = plan.payment_source;
                        }
                        else if(plan.payment_source == 'paystack')
                        {
                            params.payment_source = plan.payment_source;
                        }
                        services.POST_DATA(params, API.SUPPLIER_SUBSCRIPTION_CANCEL, function (response) {
                            $scope.message = 'Subscription Cancelled Successfully';
                            services.SUCCESS_MODAL(true);
                            $scope.skip = 0;
                            $scope.getPlanList(1);
                            localStorage.removeItem('supplierSubscription');
                        });
                    }
                });
        }
    }
])
