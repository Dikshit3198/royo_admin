Royo.controller('ProductsRatingsCtrl', ['$scope', '$rootScope', 'constants', 'services', 'API', 'pagerService', 'factories', '$window',
    function ($scope, $rootScope, constants, services, API, pagerService, factories, $window) {

        $scope.productRatingList = [];
        $scope.currentPage = 1;
        $scope.skip = 0;
        $scope.limit = 20;
        $scope.count = 0;

        $rootScope.active_rating_tab = 1;

        var getProductsRatingsData = function (page) {

            var param_data = {};
            param_data.offset = $scope.skip;
            param_data.limit = $scope.limit;
            $scope.dataLoaded = false;

            if (!!localStorage.getItem('data_country')) {
                let country_data = localStorage.getItem('data_country').split(',');
                param_data.country_code = country_data[0];
                param_data.country_code_type = country_data[1];
            }

            services.GET_DATA(param_data, API.ADMIN_PRODUCT_RATING_LIST(), function (response) {
                let data = response.data;
                $scope.productRatingList = data.data;
                $scope.count = data.totalCount;
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                $scope.dataLoaded = true;
            });
        };

        getProductsRatingsData($scope.currentPage);

        $scope.setPage = function (page) {
            $scope.currentPage = page;
            $scope.skip = $scope.limit * (page - 1);
            getProductsRatingsData(page);
        }

        $scope.blockUnblockRating = function (item) {
            var payload = {
                is_approved: item.is_approved == 0 ? 1 : 0,
                id: item.id
            }
            $scope.dataLoaded = false;

            services.PUT_DATA(payload, API.BLOCK_PRODUCT_RATING(), function (response) {
                $scope.dataLoaded = true;
                getProductsRatingsData($scope.currentPage);
            })
        }

    }]);
