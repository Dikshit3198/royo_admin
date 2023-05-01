Royo.controller('SupplierPayoutRequestCtrl', ['$scope', '$rootScope', 'constants', 'services', 'API', 'pagerService', 'factories', '$window', '$translate',
    function ($scope, $rootScope, constants, services, API, pagerService, factories, $window, $translate) {

        $scope.filter = {
            status: 3,
            supplierId: '',
            paymentSource: ''
        };
        $scope.selected_supplier;
        $scope.suppliers = [];
        $scope.amount_receivable = 0;
        $scope.amount_payable = 0;
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

        if ($rootScope.profile === 'ADMIN') {
            getHomeData();
        }

        $scope.changeSupplier = function (supplier) {
            $scope.filter.supplierId = supplier.id;
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
            if ($rootScope.enable_search_filter_in_supplier_payout) {
                param_data.search = ($scope.search.text).trim() ? $scope.search.text : $scope.search.text;
            }


            if ($scope.filter.status != 3) {
                param_data.request_status = $scope.filter.status;
            }
            if ($scope.filter.supplierId) {
                param_data.supplier_id = $scope.filter.supplierId;
            }

            services.GET_DATA(param_data, API.SUPPLIER_PAYOUT_REQUEST_LIST, function (response) {
                if (response && response.data) {
                    $scope.count = response.data.count;
                    $scope.payoutRequestList = response.data.data;
                    $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                }
                $scope.dataLoaded = true;
            });
        };
        getRequestData(1);

        $scope.check = function (request) {
            request.checked = !request.checked;
        }

        $scope.payUser = function () {
            let JSON_DATA = [];
            $scope.payoutRequestList.forEach(element => {
                if (element['checked']) {
                    JSON_DATA.push({
                        orderId: element.order_id,
                        amount: element.payable_amount,
                        supplierId: element.agent_supplier_id,
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
            if ($rootScope.profile === 'ADMIN') {
                param_data.accountType = 0;
            } else {
                param_data.accountType = 1;
            }

            services.POST_DATA(param_data, API.PAY_AMOUNT(), function (response) {
                if (response && response.data && response.data.length) {
                    const orderIds = response.data.map(item => item.orderId)
                    let message = `${orderIds.length > 1 ? factories.localisation().orders : factories.localisation().order} (${orderIds}) ${orderIds.length > 1 ? 'are' : 'is'} not paid through online because the ${orderIds.length > 1 ? factories.localisation().suppliers : factories.localisation().supplier} do not register with stripe account`
                    factories.invalidDataPop(message);
                    return;
                }

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

        $scope.changePaymentMode = function (payment_type) {
            $scope.payment_type = payment_type;
        }

    }]);
