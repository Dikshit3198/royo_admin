Royo.controller('OrderWeightCtrl', ['$scope', '$rootScope', '$stateParams', 'services', 'API', 'pagerService', 'constants', 'factories',
    function ($scope, $rootScope, $stateParams, services, API, pagerService, constants, factories) {


        $rootScope.tab = $stateParams.tab;
        $scope.supplier_id = $stateParams.supplierId;
        $rootScope.$broadcast('supplier_id', { supplier_id: $stateParams.supplierId, tab: $stateParams.tab });


        $scope.skip = 0;
        $scope.limit = 20;
        $scope.search = '';
        $scope.count = 0;
        $scope.orderWeightList = [];
        $scope.dataLoaded = false;
        $scope.supplier_id = '';
        $scope.order_weight = {
            delivery_charge: '',
            supplier_id: '',
            weight: ''
        }

        $scope.selectedOrderWeight = {};
        $scope.is_updating = false;

        var getOrderWeight = function (page) {
            $stateParams
            var data = {
                supplier_id: $stateParams.supplierId,
                limit: $scope.limit,
                skip: $scope.skip

            };
            $scope.dataLoaded = false;
            services.GET_DATA(data, API.GET_ORDER_WEIGHT_LIST, function (response) {
                $scope.orderWeightList = response.data.list;
                $scope.count = response.data.count;
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                $scope.dataLoaded = true;
            });
        };
        getOrderWeight(1);

        $scope.setPage = function (page) {
            $scope.currentPage = page;
            $scope.skip = $scope.limit * (page - 1);
            getOrderWeight(page);
        }



        $scope.addOrderWeight = function (addOrderWeightForm) {
            if (addOrderWeightForm.$invalid) return;
            var addParams = {};
            addParams.weight = $scope.order_weight.weight;
            addParams.delivery_charge = $scope.order_weight.delivery_charge;
            addParams.supplier_id = $stateParams.supplierId;

            if ($scope.is_updating) {
                addParams.id = $scope.selectedOrderWeight.id;
            }

            services.POST_DATA(addParams, API.ADD_ORDER_WEIGHT, function (response) {
                $scope.is_updating = false;
                $scope.dataLoaded = true;
                $("#addOrderWeightRef").modal('hide');
                getOrderWeight(1);
                $scope.message = `Order weight has been added!`;
                $scope.order_weight.weight = '';
                $scope.order_weight.delivery_charge = '';
                addOrderWeightForm.$submitted = false;
                services.SUCCESS_MODAL(true);
            });
        }



        $scope.deleteOrderWeight = function (weight) {
            var data = {
                id: weight.id
            }
            services.POST_DATA(data, API.DELETE_ORDER_WEIGHT, function (response) {
                getOrderWeight(1);
                $scope.dataLoaded = true;
                $scope.message = `Weight has been deleted!`;
                services.SUCCESS_MODAL(true);
            });
        }

        $scope.updateOrderWeight = function (weight) {
            $scope.selectedOrderWeight = weight;
            $scope.is_updating = true;
            $scope.order_weight = {
                delivery_charge: weight.delivery_charge,
                supplier_id: $scope.supplierId,
                weight: weight.weight
            }
            $("#addOrderWeightRef").modal('show');

        }


    }]);
