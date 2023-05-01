Royo.controller('paymentSuccessCtrl', ['$scope', 'services', '$stateParams', 'API', 'constants', '$rootScope', '$location',
    function ($scope, services, $stateParams, API, constants, $rootScope, $location) {

        $scope.selectedPlan = {}
        $scope.payment_source
        var purchasePlan = function () {

            const params = {
                plan_id: $scope.selectedPlan.id,
                current_period_start: new Date().getTime().toString(),
                current_period_end: new Date(moment().add(1, $scope.selectedPlan.type)).getTime().toString(),
                payment_source: $scope.payment_source,
                supplier_id: $rootScope.active_supplier_id,
                reciept_url: $scope.payment_source == 'knet' ? $scope.urlData.tranid : $scope.payment_source
            }

            services.POST_DATA(params, API.SUPPLIER_BUY_SUBSCRIPTION, function (response) {
                if (response && response.data) {
                    localStorage.removeItem('selectedPlan')
                    localStorage.removeItem('selectedPaymentSource')
                }

            })
        }

        if ($stateParams) {
            let data = {
                ...$location.search()
            }
            $scope.urlData = data
            console.log($scope.urlData)
            $scope.selectedPlan = localStorage.getItem('selectedPlan')
            $scope.payment_source = JSON.parse(localStorage.getItem('selectedPaymentSource'))

            if ($scope.selectedPlan) {
                $scope.selectedPlan = JSON.parse($scope.selectedPlan)
            }
            purchasePlan()

        }



        var afterLogout = function () {
            constants.ACCESSTOKEN = "";
            localStorage.removeItem('RoyoAccessToken');
            localStorage.removeItem('section_data');
            localStorage.removeItem('adminId');
            localStorage.removeItem('is_superAdmin');
            localStorage.removeItem('profile_type');
            localStorage.removeItem('supplier_id');
            localStorage.removeItem('is_branch');
            localStorage.removeItem('branch_type');
            localStorage.removeItem('user_image');
            localStorage.removeItem('supplierSubscription');
            $state.go('login');
        }

        $scope.Logout = function () {
            services.CONFIRM('You want to logout from this panel.',
                function (isConfirm) {
                    if (isConfirm) {
                        let type = localStorage.getItem('profile_type');
                        if (type === 'ADMIN') {
                            services.PUT_DATA({}, API.ADMIN_LOGOUT, function (response) {
                                afterLogout();
                            });
                        } else if (type === 'SUPPLIER') {
                            let param_data = {
                                languageId: 14,
                                accessToken: localStorage.getItem('RoyoAccessToken')
                            }
                            services.POST_DATA(param_data, API.SUPPLIER_LOGOUT, function (response) {
                                afterLogout();
                            });
                        } else if (type === 'BRANCH') {
                            let param_data = {
                                languageId: 14,
                                accessToken: localStorage.getItem('RoyoAccessToken')
                            }
                            services.POST_DATA(param_data, API.BRANCH_LOGOUT, function (response) {
                                afterLogout();
                            });
                        } else if (type === 'SHIPPING') {
                            let param_data = {
                                languageId: 14,
                                accessToken: localStorage.getItem('RoyoAccessToken')
                            }
                            services.POST_DATA(param_data, API.SHIPPING_LOGOUT, function (response) {
                                afterLogout();
                            });
                        }
                    }
                });
        }




    }])