Royo.controller('SuppliersRatingsCtrl', ['$scope', '$rootScope', 'constants', 'services', 'API', 'pagerService', 'factories', '$window',
    function ($scope, $rootScope, constants, services, API, pagerService, factories, $window) {

        $scope.supplierRatingList = [];
        $scope.skip = 0;
        $scope.limit = 20;
        $scope.count = 0;
        $scope.search = {
            text: ''
        };

        $rootScope.active_rating_tab = 2;

        var getProductsRatingsData = function (page) {

            var param_data = {};
            param_data.offset = $scope.skip;
            param_data.limit = $scope.limit;
            $scope.dataLoaded = false;
            if ($rootScope.enable_search_filter_in_supplier_ratings) {
                param_data.search = ($scope.search.text).trim() ? $scope.search.text : $scope.search.text;
            }

            if (!!localStorage.getItem('data_country')) {
                let country_data = localStorage.getItem('data_country').split(',');
                param_data.country_code = country_data[0];
                param_data.country_code_type = country_data[1];
            }

            services.GET_DATA(param_data, API.ADMIN_SUPPLIER_RATING_LIST, function (response) {
                let data = response.data;
                $scope.supplierRatingList = data.data;
                $scope.count = data.totalCount;
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                $scope.dataLoaded = true;
            });
        };

        getProductsRatingsData(1);

        $scope.searchOrder = function (keyEvent) {
            if (keyEvent.which === 13) {
                $scope.skip = 0;
                getProductsRatingsData(1);
            }
        }

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

            services.PUT_DATA(payload, API.ADMIN_BLOCK_SUPPLIER_RATING, function (response) {
                $scope.dataLoaded = true;
                getProductsRatingsData($scope.currentPage);
            });
        }


    }]);
