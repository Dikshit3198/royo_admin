Royo.controller('DriversSettlementCtrl', ['$scope', '$rootScope', 'constants', 'services', 'API', 'pagerService', '$translate', 'factories', '$window',
    function ($scope, $rootScope, constants, services, API, pagerService, $translate, factories, $window) {

        $rootScope.active_account_tab = 4;

        $scope.filter = {
            status: 2,
            supplier: '',
            startDate: '',
            agentId: '',
            endDate: ''
        };
        $scope.selected_supplier;
        $scope.suppliers = [];
        $scope.agents = [];
        $scope.selected_agent;
        $scope.account_data = [];
        $scope.account_total = {};
        $scope.dataLoaded = false;
        $scope.payable_data = [];
        $scope.receivable_data = [];
        $scope.message = '';
        $scope.skip = 0;
        $scope.limit = 20;
        $scope.count = 0;
        $scope.search = '';
        $scope.payment_type = 0;

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
        } else {
            $scope.filter.supplier = $rootScope.active_supplier_id;
        }

        $scope.changeSupplier = function (supplier) {
            if (!supplier) {
                $scope.filter.supplier = '';
            } else {
                $scope.filter.supplier = supplier.id;
            }
        }



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

        $scope.changeFilter = function () {
            switch (parseInt($scope.filter.status)) {
                case 2: //All
                    if ($rootScope.profile === 'ADMIN') {
                        if ($scope.active_settelment_tab == 2) $scope.received_text = `TO ADMIN FOR CASH ORDERS`;
                        if ($scope.active_settelment_tab == 1) $scope.amount_paid = `TO ${factories.localisation().supplier} FOR ONLINE ORDERS`;
                    } else {
                        if ($scope.active_settelment_tab == 2) $scope.received_text = `TO ${factories.localisation().supplier} FOR ONLINE ORDERS`;
                        if ($scope.active_settelment_tab == 1) $scope.amount_paid = `TO ADMIN FOR CASH ORDERS`;
                    }
                    break;

                case 1: //Received
                    if ($rootScope.profile === 'ADMIN') {
                        if ($scope.active_settelment_tab == 2) $scope.received_text = `RECEIVED BY ADMIN`;
                        if ($scope.active_settelment_tab == 1) $scope.amount_paid = `ALREADY PAID TO THE ${factories.localisation().supplier} BY ADMIN`;
                    } else {
                        if ($scope.active_settelment_tab == 2) $scope.received_text = `RECEIVED BY ${factories.localisation().supplier}`;
                        if ($scope.active_settelment_tab == 1) $scope.amount_paid = `RECEIVED BY ADMIN`;
                    }
                    break;

                case 0: //Outstanding
                    if ($rootScope.profile === 'ADMIN') {
                        if ($scope.active_settelment_tab == 2) $scope.received_text = `TO BE RECEIVED BY ADMIN`;
                        if ($scope.active_settelment_tab == 1) $scope.amount_paid = `TO BE PAID BY ADMIN`;
                    } else {
                        if ($scope.active_settelment_tab == 2) $scope.received_text = `TO BE RECEIVED BY ${factories.localisation().supplier}`;
                        if ($scope.active_settelment_tab == 1) $scope.amount_paid = `TO BE PAID TO ADMIN`;
                    }
                    break;
            }
            $scope.skip = 0;
            getAccountData(1);
        }

        $scope.changeTab = function (tab) {
            $scope.account_data = [];
            $scope.active_settelment_tab = tab;
            $scope.filter.status = 2;
            defaultText();
            $scope.search = '';
            if (tab == 1) {
                $scope.account_data = $scope.payable_data;
                getAccountData(1);
            } else if (tab == 2) {
                $scope.account_data = $scope.receivable_data;
                getAccountData(1);
            }
            $scope.dataLoaded = true;
        }

        $scope.changepaymentStatus = function (status) {
            $scope.filter.status = status;
        }

        $scope.clearFilter = function () {
            $window.location.reload();
        }

        var getAccountData = function (page) {
            $scope.account_data = [];
            $scope.dataLoaded = false;
            var param_data = {};
            param_data.accessToken = constants.ACCESSTOKEN;
            param_data.authSectionId = 42;
            param_data.supplier = $scope.filter.supplier;
            param_data.startDate = $scope.filter.startDate;
            param_data.endDate = $scope.filter.endDate;
            if ($scope.filter.status != 2) {
                param_data.status = $scope.filter.status;
            }
            if ($scope.filter.agentId) {
                param_data.agentId = $scope.filter.agentId;
            }
            param_data.offset = $scope.skip;
            param_data.limit = $scope.limit;
            param_data.search = ($scope.search).trim() ? $scope.search : '';

            if (!!localStorage.getItem('data_country')) {
                let country_data = localStorage.getItem('data_country').split(',');
                param_data.country_code = country_data[0];
                param_data.country_code_type = country_data[1];
            }

            services.POST_DATA(param_data, API.DRIVER_ACCOUNT_PAYABLE_LIST(), function (response) {
                let data = response.data;
                $scope.amount_total = data.totals[0] || {};
                $scope.payable_data = data.data;
                $scope.count = data.count;
                if ($scope.payable_data.length) {
                    $scope.payable_data.map(data => {
                        data['checked'] = false;
                    });
                    $scope.account_data = $scope.payable_data;
                }
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                $scope.dataLoaded = true;
            });
        };
        getAccountData(1);

        $scope.check = function (order) {
            order.checked = !order.checked;
            $scope.marking_all = false;
        }

        $scope.payUser = function () {
            let JSON_DATA = [];
            $scope.account_data.forEach(element => {
                if (element['checked']) {
                    JSON_DATA.push({
                        orderId: element.order_id,
                        amount: element.total_amount,
                        user_id: element.agent_id,
                        transaction_mode: $scope.payment_type
                    });
                }
            });

            if (JSON_DATA.length <= 0) {
                factories.invalidDataPop($translate.instant('Please select orders'));
                return;
            }
            services.CONFIRM('You pay to the drivers?',
                function (isConfirm) {
                    if (isConfirm) {
                        var param_data = {};
                        param_data.accessToken = constants.ACCESSTOKEN;
                        param_data.authSectionId = 41;
                        param_data.transactionData = JSON_DATA;

                        services.POST_DATA(param_data, API.DRIVER_PAY__ACCOUNT(), function (response) {
                            $scope.skip = 0;
                            getAccountData(1);
                            $scope.message = 'Payment status updated';
                            services.SUCCESS_MODAL(true);
                        });
                    }
                })
        };

        $scope.searchOrder = function (keyEvent) {
            if (keyEvent.which === 13) {
                $scope.skip = 0;
                getAccountData(1);
            }
        }

        $scope.setPage = function (page) {
            $scope.currentPage = page;
            $scope.skip = $scope.limit * (page - 1);
            getAccountData(page);
        }

        $scope.downloadCSV = function () {
            $scope.account_data = [];
            var param_data = {};
            param_data.accessToken = constants.ACCESSTOKEN;
            param_data.authSectionId = 42;
            param_data.supplier = $scope.filter.supplier;
            param_data.startDate = $scope.filter.startDate;
            param_data.endDate = $scope.filter.endDate;
            if ($scope.filter.status != 2) {
                param_data.status = $scope.filter.status;
            }
            if ($scope.filter.agentId) {
                param_data.agentId = $scope.filter.agentId;
            }
            param_data.offset = $scope.skip;
            param_data.limit = $scope.limit;
            param_data.search = ($scope.search).trim() ? $scope.search : '';
            param_data.is_download = 1;

            if (!!localStorage.getItem('data_country')) {
                let country_data = localStorage.getItem('data_country').split(',');
                param_data.country_code = country_data[0];
                param_data.country_code_type = country_data[1];
            }

            services.POST_DATA(param_data, API.DRIVER_ACCOUNT_PAYABLE_LIST(), function (response) {
                let dwnld_link = response.data.csvFileLink;
                services.DOWNLOAD_CSV(dwnld_link, 'settlement');
            });
        };

        $scope.changePaymentMode = function (payment_type) {
            $scope.payment_type = payment_type;
        }


        $scope.markAllRows = function () {
            if (!$scope.marking_all) {
                $scope.account_data.forEach(element => {
                    element['checked'] = false;
                });
            }
            $scope.marking_all = true;
            $scope.account_data.forEach(element => {
                element['checked'] = !element['checked'];
                if (!element['checked']) {
                    $scope.marking_all = false;
                }
            });
        }

        $scope.getPaytoRestaurant = function (order) {
            var amount = 0;
            if (order) {
              var restpay = (order.sub_total * order.admin_commission) / 100;
              amount = (Number)((order.sub_total - restpay).toFixed(2));
            }
            return amount;
          }
      
          $scope.getPaytoCompnay = function (order) {
            var amount = 0;
            if (order) {
              amount = ((order.sub_total * order.admin_commission) / 100) -(order.loyality_point_discount + order.promo_discount);
              amount = (Number)(amount.toFixed(2));
            }
            return amount;
        }

    }]);
