Royo.controller('NotificationsCtrl', ['$scope', 'services', 'factories', 'API', 'pagerService', '$rootScope', 'constants',
    function ($scope, services, factories, API, pagerService, $rootScope, constants) {

        $scope.is_add = false;
        $scope.name = '';
        $scope.notificationList = [];
        $scope.selected_count = 0;
        $scope.is_edit = false;
        $scope.dataLoaded = false;
        $scope.message = '';
        $scope.count = 0;
        $scope.skip = 0;
        $scope.limit = 12;
        $scope.currentPage = 1;
        $scope.sort_by = '';


        //Get notification list
        var getNotificationList = function (page) {
            var params = {};
            params.skip = $scope.skip;
            params.limit = $scope.limit;
            params.accessToken = constants.ACCESSTOKEN;

            if ($rootScope.profile !== 'ADMIN') {
                params.supplier_id = $rootScope.active_supplier_id;
            }

            $scope.dataLoaded = false;

            services.GET_DATA(params, API.GET_NOTIFICATIONS(), function (response) {
                $scope.notificationList = response.data.notification;
                $scope.count = response.data.count;
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                $scope.dataLoaded = true;
            });
        };
        getNotificationList(1);

        $scope.setPage = function (page) {
            if ($scope.currentPage !== page) {
                $scope.currentPage = page;
                $scope.skip = $scope.limit * (page - 1);
                getNotificationList(page);
            }
        }

        $scope.selectSortBy = function (sort_by) {
            $scope.sort_by = sort_by;
            $scope.skip = 0;
            getNotificationList(1);
        }
    }
]);
