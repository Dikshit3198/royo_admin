Royo.controller('DriversStatementCtrl', ['$scope', '$rootScope', 'constants', 'services', 'API', 'pagerService', '$window',
    function ($scope, $rootScope, constants, services, API, pagerService, $window) {

        $rootScope.active_account_tab = 3;

        $scope.filter = {
            supplier: '',
            agentId: '',
            startDate: '',
            endDate: '',
            status: '',
            transaction_mode: ''
        };
        $scope.total_amount = 0;
        $scope.suppliers = [];
        $scope.statement_data = [];
        $scope.agents = [];
        $scope.selected_supplier;
        $scope.selected_agent;
        $scope.dataLoaded = false;
        $scope.search = '';
        $scope.skip = 0;
        $scope.limit = 20;
        $scope.count = 0;


        var datepicker = function () {
            setTimeout(() => {
                var picker = new Lightpick({
                    field: document.getElementById("datepicker_statement"),
                    singleDate: false,
                    onSelect: function (start, end) {
                        if (start && end) {
                            $scope.filter.startDate = start.format('YYYY-MM-DD');
                            $scope.filter.endDate = end.format('YYYY-MM-DD');
                        }
                    }
                });
            }, 500);
        }
        datepicker();

        var getDriversAccountStatementData = function (page) {
            var param_data = {};
            param_data.accessToken = constants.ACCESSTOKEN;
            param_data.authSectionId = 41;
            param_data.supplier = $scope.filter.supplier;
            if ($scope.filter.startDate) {
                param_data.startDate = $scope.filter.startDate;
            }
            if ($scope.filter.endDate) {
                param_data.endDate = $scope.filter.endDate;
            }
            if ($scope.filter.agentId) {
                param_data.agentId = $scope.filter.agentId;
            }
            param_data.transaction_mode = $scope.filter.transaction_mode;
            param_data.offset = $scope.skip;
            param_data.limit = $scope.limit;
            param_data.search = ($scope.search).trim() ? $scope.search : '';

            if (!!localStorage.getItem('data_country')) {
                let country_data = localStorage.getItem('data_country').split(',');
                param_data.country_code = country_data[0];
                param_data.country_code_type = country_data[1];
            }

            $scope.dataLoaded = false;

            services.POST_DATA(param_data, API.DRIVER_ACCOUNT_STATEMENT_LIST(), function (response) {
                let data = response.data;
                $scope.statement_data = data.statement ? data.statement : data.data;
                $scope.count = data.count;
                $scope.total_amount = data.totals && data.totals.length ? data.totals[0].total_amount : 0;
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                $scope.dataLoaded = true;
            });
        };

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
                if ($scope.suppliers.length != 0) {
                    getDriversAccountStatementData(1);
                }
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
            // param_data.supplier = $scope.filter.supplier;
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

        $scope.searchOrder = function (keyEvent) {
            if (keyEvent.which === 13) {
                $scope.skip = 0;
                getDriversAccountStatementData(1);
            }
        }

        if ($rootScope.profile === 'ADMIN') {
            getHomeData();
        } else {
            $scope.filter.supplier = $rootScope.active_supplier_id;
            getDriversAccountStatementData(1);
        }

        $scope.changepaymentStatus = function (status) {
            $scope.filter.transaction_mode = status;
        }

        $scope.changeSupplier = function (supplier) {
            if (!supplier) {
                $scope.filter.supplier = '';
            } else {
                $scope.filter.supplier = supplier.id;
            }
        }

        $scope.changeAgent = function (agent) {
            if (!agent) {
                $scope.filter.agentId = '';
            } else {
                $scope.filter.agentId = agent.id;
            }
        }

        $scope.resetFilter = function () {
            $window.location.reload();
        };

        $scope.selectFilter = function () {
            $scope.skip = 0;
            getDriversAccountStatementData(1);
        };

        $scope.setPage = function (page) {
            $scope.currentPage = page;
            $scope.skip = $scope.limit * (page - 1);
            getDriversAccountStatementData(page);
        }

        $scope.downloadCSV = function () {
            var param_data = {};
            param_data.accessToken = constants.ACCESSTOKEN;
            param_data.authSectionId = 41;
            param_data.supplier = $scope.filter.supplier;
            if ($scope.filter.startDate) {
                param_data.startDate = $scope.filter.startDate;
            }
            if ($scope.filter.endDate) {
                param_data.endDate = $scope.filter.endDate;
            }
            param_data.transaction_mode = $scope.filter.transaction_mode;
            param_data.offset = $scope.skip;
            param_data.limit = $scope.limit;
            param_data.search = ($scope.search).trim() ? $scope.search : '';
            param_data.is_download = 1;

            if (!!localStorage.getItem('data_country')) {
                let country_data = localStorage.getItem('data_country').split(',');
                param_data.country_code = country_data[0];
                param_data.country_code_type = country_data[1];
            }

            services.POST_DATA(param_data, API.DRIVER_ACCOUNT_STATEMENT_LIST(), function (response) {
                let dwnld_link = response.data.csvFileLink;
                services.DOWNLOAD_CSV(dwnld_link, 'statement');
            });
        };


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
