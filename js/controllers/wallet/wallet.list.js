Royo.controller('WalletCtrl', ['$scope', '$rootScope', '$stateParams', 'services', 'API', 'pagerService', 'constants', 'factories',
    function ($scope, $rootScope, $stateParams, services, API, pagerService, constants, factories) {


        $scope.offset = 0;
        $scope.limit = 10;
        $scope.status = 0;
        $scope.search = '';
        $scope.count = 0;
        $scope.request_id = 0;
        $scope.amount = 0;
        $scope.message = 0;
        $scope.walletList = [];
        $scope.dataLoaded = false;
        $scope.user = {};
        $scope.user_id = 0;
        $scope.rejectMessage = {
            message: ''
        }


        $scope.changeTab = function (status) {
            $scope.status = status;
            $scope.offset = 0;
            getWalletList(1);


        }

        $scope.changeView = function (val) {
            $scope.rejectMessage = {
                message: ''
            }
        }


        var getWalletList = function (page) {
            var data = {};
            data.status = $scope.status;
            data.offset = $scope.offset;
            data.limit = $scope.limit;


            $scope.dataLoaded = false;
            services.GET_DATA(data, API.CUSTOMER_WITHDRAW_REQUEST_LIST, function (response) {

                $scope.walletList = response.data.data;
                $scope.count = response.data.count;
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                $scope.dataLoaded = true;
            });
        };
        getWalletList(1);

        $scope.setPage = function (page) {
            $scope.currentPage = page;
            $scope.offset = $scope.limit * (page - 1);
            getWalletList(page);
        }

        var afterSubmit = function (is_edit) {
            $scope.rejectMessage = {
                message: '',
            };
            $scope.is_edit = is_edit;
            $scope.offset = 0;
            getWalletList(1);
            if (is_edit == 1) {
                $scope.message = `Request Reject Successfully`;
                services.SUCCESS_MODAL(true);
            }
            else {

                $scope.message = `Request Approve Successfully`;
                services.SUCCESS_MODAL(true)
            }

        }


        $scope.addMessage = function (addMessageForm, request_id, user_id, amount) {
            if (addMessageForm.$invalid) return;
            $scope.user_id = user_id;
            $scope.request_id = request_id;
            $scope.amount = parseInt(amount, 10);
            const payload = {
                amount: $scope.amount,
                message: $scope.rejectMessage.message,
                user_id: $scope.user_id,
                request_id: $scope.request_id,
                status: 2
            }

            services.POST_DATA(payload, API.CUSTOMER_WITHDRAW_REQUEST_ACTION, function (response) {
                $(`#rejectionAddMessage${request_id}`).modal('hide');
                afterSubmit(1);
            });

        }


        $scope.approveTransaction = function (request_id, user_id, amount) {
            $scope.user_id = user_id;
            $scope.request_id = request_id;
            $scope.amount = parseInt(amount, 10);

            const payload = {
                amount: $scope.amount,
                message: 'Approve',
                user_id: $scope.user_id,
                request_id: $scope.request_id,
                status: 1
            }
            services.POST_DATA(payload, API.CUSTOMER_WITHDRAW_REQUEST_ACTION, function (response) {

                $(`#ApproveAddMessage${request_id}`).modal('hide');
                afterSubmit(2);
            });
        }

    }]);
