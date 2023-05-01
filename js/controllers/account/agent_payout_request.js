Royo.controller('AgentPayoutRequestCtrl', ['$scope', '$rootScope', 'constants', 'services', 'API', 'pagerService', 'factories', '$window', '$translate',
    function ($scope, $rootScope, constants, services, API, pagerService, factories, $window, $translate) {

        $scope.filter = {
            status: 3,
            supplier: '',
            agentId: ''
        };
        $scope.selected_supplier;
        $scope.suppliers = [];
        $scope.agents = [];
        $scope.selected_agent;
        $scope.amount_receivable = 0;
        $scope.amount_payable = 0;
        $scope.account_data = [];
        $scope.dataLoaded = false;
        $scope.payoutRequestList = [];
        $scope.message = '';
        $scope.skip = 0;
        $scope.limit = 20;
        $scope.count = 0;
        $scope.search = {
            text: ''
        };
        $scope.payment_type = 0;

        $scope.showWithdrawal = false;

        var datepicker = function () {
            setTimeout(() => {
                var picker = new Lightpick({
                    field: document.getElementById("datepicker_settelment"),
                    singleDate: false,
                    onSelect: function (start, end) {
                        if (start && end) {
                            $scope.filter.startDate = start.format('YYYY-MM-DD');
                            $scope.filter.endDate = end.format('YYYY-MM-DD');
                        }
                    }
                });
            }, 200);
        }
        datepicker();

        //Call Get Home Page Data Service
        var getHomeData = function () {
            let params = {
                limit: 0,
                offset: 0,
                is_active: 1,
                search: '',
                is_desc: 0,
                order_by: 0
            }

            if (!!localStorage.getItem('data_country')) {
                let country_data = localStorage.getItem('data_country').split(',');
                params.country_code = country_data[0];
                params.country_code_type = country_data[1];
            }
            services.GET_DATA(params, API.SUPPLIER_LIST, function (response) {
                $scope.suppliers = response.data.suppliersList;
            });
        };


        var getAgentList = function () {
            let param_data = {
                limit: 1000,
                offset: 0,
                search: '',
                is_desc: 0,
                order_by: 0,
                sectionId: 63
            }
            if ($rootScope.profile === 'ADMIN') {
                param_data.is_admin = $scope.is_admin;

                if (!!localStorage.getItem('data_country')) {
                    let country_data = localStorage.getItem('data_country').split(',');
                    param_data.country_code = country_data[0];
                    param_data.country_code_type = country_data[1];
                }
            }
            $scope.dataLoaded = false;

            services.GET_DATA(param_data, API.GET_AGENT_LIST(), function (response) {
                if (!!response && response.data) {
                    $scope.agents = response.data.AgentList;
                }
                $scope.dataLoaded = true;
            });
        }
        getAgentList();

        $scope.changeAgent = function (agent) {
            if (!agent) {
                $scope.filter.agentId = '';
            } else {
                $scope.filter.agentId = agent.id;
            }
        }

        $scope.changeSupplier = function (supplier) {
            $scope.filter.supplier = supplier.id;
        }

        $scope.changeFilter = function () {
            $scope.skip = 0;
            getRequestData(1);
        }

        $scope.clearFilter = function () {
            $window.location.reload();
        }

        var getRequestData = function (page) {
            $scope.dataLoaded = false;
            var param_data = {};
            param_data.accessToken = constants.ACCESSTOKEN;
            param_data.authSectionId = 42;
            param_data.offset = $scope.skip;
            param_data.limit = $scope.limit;
            if ($rootScope.enable_search_filter_in_driver_payout) {
                param_data.search = ($scope.search.text).trim() ? $scope.search.text : $scope.search.text;
            }

            if ($scope.filter.status != 3) {
                param_data.request_status = $scope.filter.status;
            }
            if ($scope.filter.agentId) {
                param_data.agent_id = $scope.filter.agentId;
            }

            services.GET_DATA(param_data, API.AGENT_PAYOUT_REQUEST_LIST, function (response) {
                if (response && response.data) {
                    $scope.count = response.data.count;
                    $scope.payoutRequestList = response.data.data;
                    $scope.payoutRequestList.forEach(element => {
                        element['payable_amount'] = (Number(element['payable_amount'])).toFixed(2);
                    });
                    $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                }
                $scope.dataLoaded = true;
            });
        };
        getRequestData(1);

        $scope.check = function (order) {
            order.checked = !order.checked;
        }

        $scope.withdrawalRequest = function () {
            const order_ids = $scope.account_data.filter(element => {
                if (element['checked']) return element;
            }).map((element) => element.order_id);

            if (order_ids.length <= 0) {
                factories.invalidDataPop("Please select orders");
                return;
            }

            var param_data = {};
            param_data.accessToken = constants.ACCESSTOKEN;
            param_data.authSectionId = 41;
            param_data.order_ids = order_ids.toString();

            services.POST_DATA(param_data, API.SUPPLIER_PAYOUT_REQUEST, function (response) {
                if (response) {
                    getRequestData(1, $scope.active_settelment_tab);
                    $scope.message = 'Payment withdrawal request created';
                    services.SUCCESS_MODAL(true);
                }
            })
        }

        $scope.payUser = function () {
            let JSON_DATA = [];
            $scope.payoutRequestList.forEach(element => {
                if (element['checked']) {
                    JSON_DATA.push({
                        orderId: element.order_id,
                        amount: element.payable_amount,
                        user_id: element.agent_supplier_id,
                        transaction_mode: $scope.payment_type
                    });
                }
            });

            if (JSON_DATA.length <= 0) {
                factories.invalidDataPop("Please select orders");
                return;
            }

            var param_data = {};
            param_data.accessToken = constants.ACCESSTOKEN;
            param_data.authSectionId = 41;
            param_data.transactionData = JSON_DATA;

            services.POST_DATA(param_data, API.DRIVER_PAY__ACCOUNT(), function (response) {
                $scope.skip = 0;
                getRequestData(1);
                $scope.message = 'Payment status updated';
                services.SUCCESS_MODAL(true);
            });
        };

        $scope.acceptReject = function (requestId, status) {

            const payload = {
                status: status,
                authSectionId: 42,
                accessToken: constants.ACCESSTOKEN,
                request_id: requestId
            }
            services.POST_DATA(payload, API.ADMIN_ACCEPT_REJECT_PAYOUT_REQUEST, function (response) {
                $scope.skip = 0;
                getRequestData(1);
                $scope.message = 'Request status updated';
                services.SUCCESS_MODAL(true);
            });
        }


        $scope.searchOrder = function (keyEvent) {
            if (keyEvent.which === 13) {
                $scope.skip = 0;
                getRequestData(1);
            }
        }

        $scope.setPage = function (page) {
            $scope.currentPage = page;
            $scope.skip = $scope.limit * (page - 1);
            getRequestData(page);
        }


    }]);
