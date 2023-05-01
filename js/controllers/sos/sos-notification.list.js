Royo.controller('SOSNotificationCtrl', ['$scope', '$rootScope', '$stateParams', 'services', 'API', 'pagerService', 'constants', 'factories',
    function ($scope, $rootScope, $stateParams, services, API, pagerService, constants, factories) {


        $scope.skip = 0;
        $scope.limit = 20;
        $scope.search = '';
        $scope.count = 0;
        $scope.sosList = [];
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


        var getSOSList = function (page) {
            var data = {};
            data.offset = $scope.skip;
            data.limit = $scope.limit;
            $scope.dataLoaded = false;
            services.GET_DATA(data, API.ADMIN_SOS_LIST, function (response) {
                $scope.count = response.data.count;
                $scope.sosList = response.data.list;
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                $scope.dataLoaded = true;
            });
        };
        getSOSList(1);


        $scope.setPage = function (page) {
            $scope.currentPage = page;
            $scope.skip = $scope.limit * (page - 1);
            getSOSList(page);
        }

        $scope.deleteSOS = function () {
            var data = {
                id: 0
            }
            services.PUT_DATA(data, API.ADMIN_POST_DELETE, function (response) {
                getSOSList(1);
                $scope.dataLoaded = true;
                $scope.message = `Post has been deleted!`;
                services.SUCCESS_MODAL(true);
            });
        }

        $scope.changeSOSStatus = function (sos, status) {
            services.CONFIRM('You want to change SOS status to Action Taken.',
                function (isConfirm) {
                    if (isConfirm) {
                        var data = {
                            id: sos.id,
                            status: status
                        }
                        services.POST_DATA(data, API.CHANGE_SOS_STATUS, function (response) {
                            getSOSList(1);
                            $scope.dataLoaded = true;
                            $scope.message = `Status has been updated!`;
                            services.SUCCESS_MODAL(true);
                        });
                    }
                });
        }

    }]);
