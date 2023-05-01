Royo.controller('AgentRatingsCtrl', ['$scope', '$rootScope', 'constants', 'services', 'API', 'pagerService', 'factories', '$window',
    function ($scope, $rootScope, constants, services, API, pagerService, factories, $window) {

        $scope.agentRatingList = [];
        $scope.skip = 0;
        $scope.limit = 20;
        $scope.count = 0;

        $rootScope.active_rating_tab = 3;

        var getAgentRatingsData = function (page) {

            var param_data = {};
            param_data.offset = $scope.skip;
            param_data.limit = $scope.limit;
            $scope.dataLoaded = false;

            if (!!localStorage.getItem('data_country')) {
                let country_data = localStorage.getItem('data_country').split(',');
                param_data.country_code = country_data[0];
                param_data.country_code_type = country_data[1];
            }

            services.POST_DATA(param_data, API.ADMIN_AGENT_RATING_LIST, function (response) {
                let data = response.data;
                $scope.agentRatingList = data.agentRatingData;
                $scope.count = data.count;
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                $scope.dataLoaded = true;
            });
        };


        if($rootScope.profile == 'SUPPLIER') {
            window.history.back();
        } else {
            getAgentRatingsData(1);
        }

        $scope.setPage = function (page) {
            $scope.currentPage = page;
            $scope.skip = $scope.limit * (page - 1);
            getAgentRatingsData(page);
        }

        $scope.blockUnblockRating = function (item, index) {
            var payload = {
                status: item.is_block == 0 ? 1 : 0,
                review_id: item.review_id
            }
            $scope.dataLoaded = false;

            services.POST_DATA(payload, API.ADMIN_BLOCK_AGENT_RATING, function (response) {
                $scope.dataLoaded = true;

                $scope.agentRatingList[index].is_block = !$scope.agentRatingList[index].is_block;
                // getAgentRatingsData($scope.currentPage);
            });
        }

    }]);
