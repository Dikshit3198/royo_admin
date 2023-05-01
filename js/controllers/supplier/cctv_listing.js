Royo.controller('CCTVListingCtrl', ['$scope', '$rootScope', '$stateParams', 'services', 'API', 'pagerService', 'constants', 'factories',
    function ($scope, $rootScope, $stateParams, services, API, pagerService, constants, factories) {


        $rootScope.tab = $stateParams.tab;
        $scope.supplier_id = $stateParams.supplierId;
        $rootScope.$broadcast('supplier_id', { supplier_id: $stateParams.supplierId, tab: $stateParams.tab });


        $scope.skip = 0;
        $scope.limit = 20;
        $scope.search = '';
        $scope.count = 0;
        $scope.cctvList = [];
        $scope.dataLoaded = false;
        $scope.supplier_id = '';
        $scope.cctv_obj = {
            id: '',
            title: '',
            url: '',
            supplier_id: '',
        }

        $scope.is_updating = false;

        var getCCTVListing = function () {
            var data = {
                supplier_id: $stateParams.supplierId
            };
            $scope.dataLoaded = false;
            services.GET_DATA(data, API.CCTC_LISTING, function (response) {
                $scope.cctvList = response.data.list;
                $scope.dataLoaded = true;
            });
        };
        getCCTVListing();



        $scope.addCCTV = function (addCCTVForm) {
            if (addCCTVForm.$invalid) return;
            var addParams = {};
            addParams.title = $scope.cctv_obj.title;
            addParams.url = $scope.cctv_obj.url;
            addParams.supplier_id = $stateParams.supplierId;

            if ($scope.is_updating) {
                addParams['id'] = $scope.cctv_obj.id;
            }

            services.POST_DATA(addParams, API.ADD_UPDATE_CCTV, function (response) {
                $scope.is_updating = false;
                $scope.dataLoaded = true;
                $("#addCCTVRef").modal('hide');
                getCCTVListing();
                $scope.message = `CCTV has been added!`;
                $scope.cctv_obj = {
                    id: '',
                    title: '',
                    url: '',
                    supplier_id: '',
                }
                addCCTVForm.$submitted = false;
                services.SUCCESS_MODAL(true);
            });
        }



        $scope.deleteCCTV = function (cctv) {
            var data = {
                id: cctv.id
            }
            services.POST_DATA(data, API.DELETE_CCTV, function (response) {
                getCCTVListing();
                $scope.dataLoaded = true;
                $scope.message = `CCTV has been deleted!`;
                services.SUCCESS_MODAL(true);
            });
        }


        $scope.updateCCTV = function (cctv) {
            $scope.is_updating = true;
            $scope.cctv_obj = Object.assign({}, cctv);
            $("#addCCTVRef").modal('show');

        }


    }]);
