Royo.controller('PostReportCtrl', ['$scope', '$rootScope', '$stateParams', 'services', 'API', 'pagerService', 'constants', 'factories',
    function ($scope, $rootScope, $stateParams, services, API, pagerService, constants, factories) {


        $scope.skip = 0;
        $scope.limit = 20;
        $scope.search = '';
        $scope.count = 0;
        $scope.reports = [];
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


        var getReportsList = function (page) {
            var data = {};
            data.offset = $scope.skip;
            data.limit = $scope.limit;


            $scope.dataLoaded = false;
            services.GET_DATA(data, API.ADMIN_REPORT_LIST, function (response) {
                $scope.count = response.data.count;
                $scope.reports = response.data.list;
                $scope.user = response.data.userDetails;
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                $scope.dataLoaded = true;
            });
        };
        getReportsList(1);


        $scope.setPage = function (page) {
            $scope.currentPage = page;
            $scope.skip = $scope.limit * (page - 1);
            getReportsList(page);
        } 

        $scope.deletePost = function (postId) {
            var data = {
                id: postId
            }
            services.PUT_DATA(data, API.ADMIN_POST_DELETE, function (response) {
                getReportsList();
                $scope.dataLoaded = true;
                $scope.message = `Post has been deleted!`;
                services.SUCCESS_MODAL(true);
            });
        }

    }]);
