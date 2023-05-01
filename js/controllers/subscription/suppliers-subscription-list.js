Royo.controller('SuppliersSubscriptionListCtrl', ['$scope', 'services', '$stateParams', 'factories', 'API', 'pagerService', '$rootScope', 'constants',
    function ($scope, services, $stateParams, factories, API, pagerService, $rootScope, constants) {

        $scope.is_add = false;

        $scope.purchasedPlanList = [];
        $scope.selected_count = 0;
        $scope.is_edit = false;
        $scope.dataLoaded = false;
        $scope.message = '';
        $scope.count = 0;
        $scope.skip = 0;
        $scope.limit = 12;
        $scope.currentPage = 1;
        $scope.sort_by = '';

        $scope.filter = {
            name: '',
            period: '',
            status: ''
        }

        $scope.fromDate = ''
        $scope.toDate = ''


        var datepicker = function () {
            setTimeout(() => {
                var picker = new Lightpick({
                    field: document.getElementById("datepicker_dasboard"),
                    singleDate: false,
                    startDate: $scope.fromDate,
                    endDate: $scope.toDate,
                    lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en',
                    format: 'DD.MM.YYYY',
                    onSelect: function (start, end) {
                        if (start && end) {
                            $scope.fromDate = start.format('YYYY-MM-DD');
                            $scope.toDate = end.format('YYYY-MM-DD');
                        }
                    }
                });
            }, 500);
        }
        datepicker();


        $scope.getPurchasedPlanList = function (page) {
            var params = {};
            params.offset = $scope.skip;
            params.limit = $scope.limit;
            if (($scope.filter.name).trim()) {
                params.name = ($scope.filter.name).trim();
            }
            if ($scope.filter.period) {
                params.period = $scope.filter.period;
            }
            if ($scope.filter.status) {
                params.status = $scope.filter.status;
            }
            if ($scope.sort_by) {
                params.order_by = $scope.sort_by;
            }

            if ($scope.fromDate) {
                params.fromDate = $scope.fromDate;
            }
            if ($scope.toDate) {
                params.toDate = $scope.toDate;
            }

            $scope.dataLoaded = false;

            services.GET_DATA(params, API.ADMIN_SUPPLIER_SUBSCRIPTIONS, function (response) {
                $scope.purchasedPlanList = response.data.list;
                $scope.count = response.data.count;
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                $scope.dataLoaded = true;
            });
        };
        $scope.getPurchasedPlanList(1);

        $scope.oxxo_request = {};
        $scope.viewPaymentreceipt = function (plan) {
            $scope.oxxo_request = plan;
            $("#oxxo_confirmation").modal('show');
        }

        $scope.approvePlan = function (Id) {
            services.CONFIRM(`You want to approve this subscription request`,
                function (isConfirm) {
                    if (isConfirm) {
                        var params = {};
                        params.id = Id;
                        services.POST_DATA(params, API.APPROVE_SUPPLIER_SUBSCRIPTION, function (response) {
                            $("#oxxo_confirmation").modal('hide');
                            $scope.message = 'Subscription request approved successfully';
                            services.SUCCESS_MODAL(true);
                            $scope.getPurchasedPlanList($scope.currentPage);
                        });
                    }
                });
        };

        $scope.deletePlan = function (Id) {
            services.CONFIRM(`You want to delete this promo`,
                function (isConfirm) {
                    if (isConfirm) {
                        var params = {};
                        params.plan_id = Id;
                        services.POST_DATA(params, API.ADMIN_DELETE_SUBSCRIPTION_PLAN, function (response) {
                            $scope.message = 'Subscription Plan deleted successfully';
                            services.SUCCESS_MODAL(true);
                            $scope.skip = 0;
                            $scope.getPurchasedPlanList(1);
                        });
                    }
                });
        };

        $scope.setPage = function (page) {
            if ($scope.currentPage !== page) {
                $scope.currentPage = page;
                $scope.skip = $scope.limit * (page - 1);
                $scope.getPurchasedPlanList(page);
            }
        }

        $scope.searchPlan = function (keyEvent) {
            if (keyEvent.which === 13) {
                $scope.name = keyEvent.target.value;
                $scope.skip = 0;
                $scope.getPurchasedPlanList(1);
            }
        }

        $scope.periodFilter = function (period) {
            $scope.filter.period = period;
        }
        $scope.statusFilter = function (period) {
            $scope.filter.status = period;
        }
        var filterByUrl = function () {
            if ($stateParams.filterby) {
                $scope.statusFilter($stateParams.filterby);
                $scope.getPurchasedPlanList(1);
            }
        }
        filterByUrl();

        $scope.selectSortBy = function (sort_by) {
            $scope.sort_by = sort_by;
            $scope.skip = 0;
            $scope.getPurchasedPlanList(1);
        }

        $scope.changeFilter = function () {
            $scope.skip = 0;
            $scope.getPurchasedPlanList(1);
        }

        $scope.clearFilter = function () {
            $scope.filter = {
                name: '',
                period: '',
                status: ''
            }
            $scope.skip = 0;
            $scope.getPurchasedPlanList(1);
        }




        $scope.downloadCSV = function () {
            var params = {};
            params.offset = $scope.skip;
            params.limit = $scope.limit;
            if (($scope.filter.name).trim()) {
                params.name = ($scope.filter.name).trim();
            }
            if ($scope.filter.period) {
                params.period = $scope.filter.period;
            }
            if ($scope.filter.status) {
                params.status = $scope.filter.status;
            }
            if ($scope.sort_by) {
                params.order_by = $scope.sort_by;
            }
            $scope.dataLoaded = false;
            params.is_download = 1;

            if ($scope.fromDate) {
                params.fromDate = $scope.fromDate;
            }
            if ($scope.toDate) {
                params.toDate = $scope.toDate;
            }

            services.GET_DATA(params, API.ADMIN_SUPPLIER_SUBSCRIPTIONS, function (response) {
                let dwnld_link = response.data;
                services.DOWNLOAD_CSV(dwnld_link, 'subscribe plans');
            });
        };


    }
]);
