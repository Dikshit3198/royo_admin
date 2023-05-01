Royo.controller('SubscriptionPlanCtrl', ['$scope', 'services', 'factories', 'API', 'pagerService', '$rootScope', 'constants',
    function ($scope, services, factories, API, pagerService, $rootScope, constants) {

        $scope.is_add = false;
        $scope.name = '';
        $scope.permissionList = [];
        $scope.planList = [];
        $scope.selected_count = 0;
        $scope.is_edit = false;
        $scope.is_edit_details = false;
        $scope.dataLoaded = false;
        $scope.message = '';
        $scope.count = 0;
        $scope.skip = 0;
        $scope.limit = 12;
        $scope.currentPage = 1;
        $scope.sort_by = '';

        $scope.plan = {
            type: '',
            name: '',
            price: '',
            is_block: '',
            commission: '',
            description: '',
            is_on_top_priority: '0',
            banner_limit: '0'
        };

        $scope.changeView = function (val) {
            $scope.is_add = val;
            $scope.is_edit = false;
            $scope.is_edit_details = false;
            if (val) {
                $scope.plan = {
                    name: '',
                    type: '',
                    description: '',
                    price: '',
                    commission: '',
                    is_on_top_priority: '0',
                    banner_limit: ''
                };
                $scope.mark_all = false;
                if ($scope.permissionList.length) {
                    $scope.permissionList.map(permission => {
                        permission['checked'] = false;
                        permission.permissionTypes.map(type => type.is_active = false);
                    });
                }
            }
        }


        //Get promo code list
        var getPlanList = function (page) {
            var params = {};
            params.offset = $scope.skip;
            params.limit = $scope.limit;
            params.name = ($scope.name).trim() ? $scope.name : '';
            if ($scope.sort_by) {
                params.order_by = $scope.sort_by;
            }
            if ($scope.start_date_filter && $scope.end_date_filter) {
                params.startDate = $scope.start_date_filter;
                params.endDate = $scope.end_date_filter;
            }
            $scope.dataLoaded = false;

            services.GET_DATA(params, API.ADMIN_LIST_SUBSCRIPTION_PLANS, function (response) {
                $scope.planList = response.data.plans;
                $scope.count = response.data.count;
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                $scope.dataLoaded = true;
            });
        };
        getPlanList(1);


        $scope.openEditPlan = function () {
            $scope.is_edit_details = true;
        }


        $scope.editPlan = function (plan) {
            $scope.is_edit = true;
            $scope.is_add = true;
            $scope.plan_id = plan.id;
            $scope.plan = {
                type: plan.type,
                name: plan.name,
                price: plan.price,
                is_block: plan.is_block,
                commission: plan.admin_commission.toString(),
                description: plan.description,
                is_on_top_priority: plan.is_on_top_priority ? plan.is_on_top_priority.toString() : '0',
                banner_limit: plan.banner_limit ? plan.banner_limit : 0
            };

            $scope.permissionList = plan.permissions;

            $scope.permissionList.forEach((permission) => {
                let planPermission = plan.permissions.find(pp => pp.id == permission.id);
                if (planPermission) {
                    permission['checked'] = planPermission.permissionTypes.every(type => type.is_active == 1);
                }
            })

        }

        $scope.changePlanStatus = function (isBlock) {
            $scope.plan.is_block = isBlock == 0 ? 1 : 0;
        }

        $scope.getPermissionList = function (change) {
            var params = {};
            params.accessToken = constants.ACCESSTOKEN;
            // params.sectionId = 40;


            services.GET_DATA(params, API.ADMIN_ALL_PERMISSIONS, function (sup_response) {
                $scope.permissionList = sup_response.data;
                if ($scope.permissionList.length) {
                    $scope.permissionList.map(supp => {
                        supp['checked'] = false;
                    });
                }
                if ($scope.is_edit && !change && $rootScope.app_type != 1) {
                    $scope.selected_count = 0;
                    $scope.details.forEach(el => {
                        $scope.suppliers.forEach(supplier => {
                            if (el.supplierId == supplier.id) {
                                supplier.checked = true;
                                $scope.selected_count++;
                            }
                        });
                    });
                }
            });
        };

        // $scope.getPermissionList();


        $scope.selectAllPermission = function (permission) {
            permission.checked = !permission.checked;
            permission.permissionTypes.map(el => el.is_active = permission.checked);
        }

        $scope.selectPermissionType = function (permissionType) {
            permissionType.is_active = +!permissionType.is_active;
        }

        var afterSubmit = function (is_edit) {
            $scope.plan = {
                name: '',
                type: '',
                price: '',
                commission: '',
                is_on_top_priority: '0',
                banner_limit: ''
            };
            $scope.is_edit = false;
            $scope.is_edit_details = false;
            $scope.skip = 0;
            getPlanList(1);
            $scope.message = `Subscription Plan ${is_edit ? 'updated' : 'created'} successfully`;
            services.SUCCESS_MODAL(true);
        }

        $scope.addPlan = function (addPlanForm) {
            if (addPlanForm.$invalid) return;
            var addParams = {};
            addParams.type = $scope.plan.type;
            addParams.name = $scope.plan.name;
            addParams.price = Number($scope.plan.price);
            addParams.description = $scope.plan.description;
            addParams.admin_commission = Number($scope.plan.commission);
            addParams.is_on_top_priority = Number($scope.plan.is_on_top_priority);
            addParams.banner_limit = Number($scope.plan.banner_limit);

            addParams.permission_ids = [];

            $scope.permissionList.forEach(permission => {
                (permission.permissionTypes).forEach(permissionType => {
                    if (!!permissionType.is_active) {
                        addParams.permission_ids.push(permissionType.id);
                    }
                });
            });

            // if (permission_ids.length) {
            //     // factories.warningDataPop('Please select permissions');
            //     // return;
            //     addParams.permission_ids = permission_ids;
            // }

            if ($scope.is_edit || $scope.is_edit_details) {
                addParams.id = $scope.plan_id;
                addParams.is_block = $scope.plan.is_block;
                services.PUT_DATA(addParams, API.ADMIN_UPDATE_SUBSCRIPTION_PLAN, function (response) {
                    $("#addPlan").modal('hide');
                    afterSubmit(true);
                });
            } else {
                services.POST_DATA(addParams, API.ADMIN_CREATE_SUBSCRIPTION_PLAN, function (response) {
                    $("#addPlan").modal('hide');
                    afterSubmit(false);
                });
            }
        }

        $scope.deletePlan = function (Id) {
            services.CONFIRM(`${factories.localisation().You_want_to_delete_this_promo}`,
                function (isConfirm) {
                    if (isConfirm) {
                        var params = {};
                        params.plan_id = Id;
                        if($rootScope.enable_paystack_gatway_for_deletesubscription == 1){
                            params.payment_method='paystack';
                        }
                        services.POST_DATA(params, API.ADMIN_DELETE_SUBSCRIPTION_PLAN, function (response) {
                            $scope.message = 'Promo code deleted successfully';
                            services.SUCCESS_MODAL(true);
                            $scope.skip = 0;
                            getPlanList(1);
                        });
                    }
                });
        };

        $scope.setPage = function (page) {
            if ($scope.currentPage !== page) {
                $scope.currentPage = page;
                $scope.skip = $scope.limit * (page - 1);
                getPlanList(page);
            }
        }

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

        $scope.onClose = function () {
            $scope.is_edit_details = false;
            $scope.is_edit = false;
        }


    }
]);
