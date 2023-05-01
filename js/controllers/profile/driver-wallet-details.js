Royo.controller('DriverWalletCtrl', ['$scope', '$rootScope', '$stateParams', 'services', 'API', 'pagerService', 'constants', 'factories',
    function ($scope, $rootScope, $stateParams, services, API, pagerService, constants, factories) {


        $scope.skip = 0;
        $scope.limit = 20;
        $scope.search = '';
        $scope.count = 0;
        $scope.transactions = [];
        $scope.dataLoaded = false;
        $scope.user = {};
        $scope.user_id = '';
        $scope.money = {
            amount: 0,
            comment: ''
        }

        if ($stateParams.user_id) {
            $scope.user_id = $stateParams.user_id;
        }

        $scope.changeView = function (val) {
            $scope.money = {
                amount: 0,
                comment: ''
            }
        }


        var getTransactionsData = function (page) {
            var data = {};
            data.user_id = $scope.user_id;
            data.skip = $scope.skip;
            data.limit = $scope.limit;
            $scope.dataLoaded = false;
            services.GET_DATA(data, API.ADMIN_AGENT_WALLET_TXN_LIST, function (response) {
                $scope.count = response.data.count;
                $scope.transactions = response.data.transactions;
                $scope.user = response.data.userDetails;
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                $scope.dataLoaded = true;
            });
        };
        getTransactionsData(1);


        $scope.setPage = function (page) {
            $scope.currentPage = page;
            $scope.skip = $scope.limit * (page - 1);
            getTransactionsData(page);
        }

        var afterSubmit = function (is_edit) {
            $scope.money = {
                amount: 0,
                comment: '',
            };
            $scope.is_edit = false;
            $scope.skip = 0;
            getTransactionsData(1);
            $scope.message = `Money Successfully Added`;
            services.SUCCESS_MODAL(true);
        }

        $scope.addMoney = function (addMoneyForm) {
            if (addMoneyForm.$invalid) return;

            const payload = {
                amount: $scope.money.amount,
                comment: $scope.money.comment,
                user_id: $scope.user_id,
                languageId: localStorage.getItem('lang'),
                currency: $rootScope.currency
            }

            services.POST_DATA(payload, API.ADMIN_ADD_MONEY_TO_AGENT_WALLET, function (response) {
                $("#addMoney").modal('hide');
                afterSubmit(false);
            });

        }

    }]);
