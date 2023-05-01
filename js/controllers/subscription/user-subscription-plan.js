Royo.controller('UserSubscriptionCtrl', ['$scope', 'services', 'factories', 'API', 'pagerService', '$rootScope', '$stateParams', 'constants',
    function ($scope, services, factories, API, pagerService, $rootScope, $stateParams, constants) {

        $scope.is_add = false;
        $scope.name = '';
        $scope.permissionList = [];
        $scope.planList = [];
        $scope.benefitList = [];
        $scope.assignBenefitList = [];
        $scope.unassignBenefitList = [];
        $scope.selected_count = 0;
        $scope.is_edit = false;
        $scope.dataLoaded = false;
        $scope.message = '';
        $scope.count = 0;
        $scope.skip = 0;
        $scope.limit = 12;

        $scope.sort_by = '';
        $scope.validity = '';
        $scope.start_date_filter = '';
        $scope.end_date_filter = '';
        $scope.plan_id = '';
        $scope.files = [];
        var fileArr = [];

        $scope.currentPage = $stateParams.page ? parseInt($stateParams.page) : 1;

        $scope.selectedPaymentType = 'Stripe';

        var checkOtherPaymentGateways = function () {
            const razor_pay = $rootScope.paymentGateways.find(gateway => (gateway.name).toLowerCase() == 'razor pay');
            if (!!razor_pay) {
                $scope.selectedPaymentType = 'razorpay';
                console.log('$scope.selectedPaymentType 111', $scope.selectedPaymentType);
            }
        }


        $scope.$on('settingsLoaded', load);
        function load($event, data) {
            if (data) {       
                checkOtherPaymentGateways();
            }
        }

        $scope.setPage = function (page) {
            $scope.currentPage = page;
            $scope.skip = $scope.limit * (page - 1);
            location.replace(`${window.origin}/#!/subscription/user-plans?page=${$scope.currentPage}`);
            getPlanList(page);
        }

        $scope.changeView = function (val) {
            $scope.is_add = val;
            $scope.is_edit = false;
            if (val) {
                $scope.plan = {
                    name: '',
                    description: '',
                    price: '',
                    type: ''
                };
                $scope.product_img1 = '';
                $scope.mark_all = false;
                $scope.unassignBenefitList = $scope.benefitList;

                // checkOtherPaymentGateways();
            }
        }

        $scope.$on("fileSelected", function (event, args) {
            $scope.$apply(function () {
                $scope.files.push(args.file);
            });
        });

        $scope.file_to_upload_for_image = function (File, order) {
            var file = File[0];
            if (constants.IMAGE_TYPE.includes(file.type)) {
                if ((file.size / Math.pow(1024, 2)) <= 7) {
                    $scope.image_file = File[0];
                    var Obj = {};
                    $scope.image = File[0];
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        $scope.$apply(function () {
                            $scope.product_img1 = e.target.result;
                        });
                    }
                } else {
                    factories.invalidDataPop("Image size must be less than 7mb");
                }
            } else {
                factories.invalidDataPop("Invalid File Type");
            }
        };

        $scope.selectBenefit = function (benefit) {
            $scope.selected_count = 0;
            benefit.checked = !benefit.checked;
            $scope.unassignBenefitList.forEach(benefit => {
                if (benefit.checked) {
                    $scope.selected_count++;
                }
            });
        }

        $scope.markAll = function (mark_all) {
            $scope.mark_all = mark_all;
            $scope.selected_count = 0;
            $scope.unassignBenefitList.forEach(benefit => {
                benefit.checked = mark_all;
                if (mark_all) {
                    $scope.selected_count++;
                }
            });
        }

        var getBenefits = function () {
            const params = {
                limit: 100,
                offset: 0
            }
            services.GET_DATA(params, API.GET_USER_SUBSCRIPTION_BENEFITS, function (response) {
                if (response && response.data) {
                    $scope.benefitList = [];
                    (response.data.plans).forEach(el => {
                        if (el.id != 2) {
                            $scope.benefitList.push(el);
                        }
                    });
                }
            })
        }

        getBenefits();

        var getPlanList = function (page) {
            var params = {};
            params.offset = $scope.skip;
            params.limit = $scope.limit;
            params.name = ($scope.name).trim() ? $scope.name : '';
            if ($scope.sort_by) {
                params.order_by = $scope.sort_by;
            }
            $scope.dataLoaded = false;

            services.GET_DATA(params, API.GET_USER_SUBSCRIPTION_PLANS(), function (response) {
                $scope.planList = response.data.plans;
                $scope.count = response.data.count;
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                $scope.dataLoaded = true;
            });
        };
        $scope.setPage($scope.currentPage);


        var getPlanBenefits = function (plan_id) {
            $scope.dataLoaded = false;
            const params = {};
            params.offset = 0;
            params.limit = 100;
            params.id = plan_id;
            services.GET_DATA(params, API.GET_USER_SUBSCRIPTION_BENEFITS, function (response) {
                $scope.plan.benefits = response.data.plans || [];
                $scope.unassignBenefitList = [];
                $scope.benefitList.forEach((item) => {
                    if (!$scope.plan.benefits.find((benefit) => benefit.id == item.id)) {
                        item.checked = false;
                        $scope.unassignBenefitList.push(item);
                    }
                })
                $scope.dataLoaded = true;
            })
        }

        $scope.editPlan = function (plan) {
            $scope.is_edit = true;
            $scope.is_add = true;
            $scope.plan_id = plan.id;
            $scope.plan = {
                name: plan.name || plan.title,
                description: plan.description,
                price: plan.price,
                type: plan.type,
                image: plan.image,
                is_blocked: plan.is_blocked || 0,
                min_order_amount: plan.min_order_amount || 0
            };
            $scope.product_img1 = plan.image;
            // checkOtherPaymentGateways();
            getPlanBenefits(plan.id);
        }

        $scope.changePlanStatus = function (isBlock) {
            $scope.plan.is_block = isBlock == 0 ? 1 : 0;
        }

        var afterSubmit = function (is_edit) {
            $scope.plan = {
                name: '',
                type: '',
                price: '',
                description: ''
            };
            $scope.is_edit = false;
            $scope.is_add = false;
            $scope.skip = 0;
            $scope.selected_count = 0;
            getPlanList(1);
            $scope.message = `Subscription Plan ${is_edit ? 'updated' : 'created'} successfully`;
            services.SUCCESS_MODAL(true);
        }

        var assignBenefitsToPlan = function (planId, is_edit) {
            const benefitIds = $scope.unassignBenefitList.map((benefit) => {
                if (benefit.checked) {
                    return benefit.id
                }
            }).toString();

            if (!benefitIds) {
                afterSubmit(is_edit);
                return;
            }

            const payload = {
                plan_id: planId,
                benefit_ids: benefitIds
            }
            services.POST_DATA(payload, API.ADMIN_ASSIGN_BENEFITS_TO_PLAN(), function (response) {
                afterSubmit(is_edit);
            })
        }

        $scope.addPlan = function (addPlanForm) {
            if (addPlanForm.$invalid) return;
            var addParams = {};
            addParams.title = $scope.plan.name;
            addParams.price = $scope.plan.price;
            addParams.description = $scope.plan.description;
            addParams.type = $scope.plan.type;
            addParams.image = $scope.image || $scope.plan.image;
            addParams.min_order_amount = $scope.plan.min_order_amount;

            console.log('$scope.selectedPaymentType2222', $scope.selectedPaymentType);

            if($scope.selectedPaymentType != 'Stripe') {
                addParams.unique_id = $scope.selectedPaymentType;
            }

            if ($scope.is_edit) {
                addParams.id = $scope.plan_id;
                addParams.is_blocked = $scope.plan.is_blocked;
                addParams.stripe_plan_id = $scope.plan.stripe_plan_id;

                services.POST_FORM_DATA(addParams, API.UPDATE_USER_SUBSCRIPTION_PLAN(), function (response) {
                    assignBenefitsToPlan($scope.plan_id, true);
                });
            } else {
                services.POST_FORM_DATA(addParams, API.CREATE_USER_SUBSCRIPTION_PLAN(), function (response) {
                    assignBenefitsToPlan(response.data, false);
                });
            }
        }

        $scope.deleteBenefitPlan = function (planId, benefitId) {
            services.CONFIRM(`You want to delete this plan benefit`,
                function (isConfirm) {
                    if (isConfirm) {
                        var params = {};
                        params.plan_id = planId;
                        params.benefit_id = benefitId;
                        services.POST_DATA(params, API.ADMIN_REMOVE_BENEFITS_FROM_PLAN, function (response) {
                            $scope.message = 'Benefit code deleted successfully';
                            services.SUCCESS_MODAL(true);
                            $scope.plan.benefits = $scope.plan.benefits.filter(benefit => benefit.id != benefitId);
                            $scope.unassignBenefitList = [];
                            $scope.benefitList.forEach((item) => {
                                if (!$scope.plan.benefits.find((benefit) => benefit.id == item.id)) {
                                    item.checked = false;
                                    $scope.unassignBenefitList.push(item);
                                }
                            })
                        });
                    }
                });
        }

        $scope.deletePlan = function (plan) {
            services.CONFIRM(`You want to delete this plan`,
                function (isConfirm) {
                    if (isConfirm) {
                        var params = {};
                        params.id = plan.id;
                        params.title = plan.title;
                        params.description = plan.description;
                        params.image = plan.image;
                        params.price = plan.price;
                        params.type = plan.type;
                        params.is_blocked = 1;
                        params.stripe_plan_id = plan.stripe_plan_id;

                        if($scope.selectedPaymentType != 'Stripe') {
                            params.unique_id = $scope.selectedPaymentType;
                        }

                        services.POST_DATA(params, API.UPDATE_USER_SUBSCRIPTION_PLAN(), function (response) {
                            $scope.message = 'Plan code deleted successfully';
                            services.SUCCESS_MODAL(true);
                            $scope.skip = 0;
                            getPlanList(1);
                        });
                    }
                });
        };



        $scope.searchPlan = function (keyEvent) {
            if (keyEvent.which === 13) {
                $scope.name = keyEvent.target.value;
                $scope.skip = 0;
                getPlanList(1);
            }
        }

        $scope.selectSortBy = function (sort_by) {
            $scope.sort_by = sort_by;
            $scope.skip = 0;
            getPlanList(1);
        }
    }
]);
