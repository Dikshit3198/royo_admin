Royo.controller('OrderDistanceCtrl', ['$scope', '$rootScope', '$stateParams', 'services', 'API', 'pagerService', 'constants', 'factories',
    function ($scope, $rootScope, $stateParams, services, API, pagerService, constants, factories) {


        $rootScope.tab = $stateParams.tab;
        $scope.supplier_id = $stateParams.supplierId;
        $rootScope.$broadcast('supplier_id', { supplier_id: $stateParams.supplierId, tab: $stateParams.tab });


        $scope.skip = 0;
        $scope.limit = 20;
        $scope.search = '';
        $scope.count = 0;
        $scope.orderDistanceList = [];
        $scope.dataLoaded = false;
        $scope.supplier_id = '';
        $scope.order_distance = {
            distance: '',
            min_amount: ''
        }

        $scope.is_updating = false;

        var getOrderDistance = function () {
            $stateParams
            var data = {
                supplier_id: $stateParams.supplierId
            };
            $scope.dataLoaded = false;
            services.GET_DATA(data, API.GET_ORDER_DISTANCE_LIST, function (response) {
                $scope.orderDistanceList = response.data;
                $scope.dataLoaded = true;
            });
        };
        getOrderDistance();



        $scope.addOrderDistance = function (addOrderDistanceForm) {
            if (addOrderDistanceForm.$invalid) return;
            var addParams = {};
            addParams.distance = $scope.order_distance.distance;
            addParams.min_amount = $scope.order_distance.min_amount;
            addParams.supplier_id = $stateParams.supplierId;

            if ($scope.is_updating) {
                addParams['id'] = $scope.selectedOrderDistance.id;
            }

            services.POST_DATA(addParams, API.ADD_ORDER_DISTANCE, function (response) {
                $scope.is_updating = false;
                $scope.dataLoaded = true;
                $("#addOrderDistanceRef").modal('hide');
                getOrderDistance();
                $scope.message = `Distance has been added!`;
                $scope.order_distance.distance = '';
                $scope.order_distance.min_amount = '';
                addOrderDistanceForm.$submitted = false;
                services.SUCCESS_MODAL(true);
            });
        }



        $scope.deleteOrderDistance = function (distance) {
            var data = {
                id: distance.id
            }
            services.POST_DATA(data, API.DELETE_ORDER_DISTANCE, function (response) {
                getOrderDistance();
                $scope.dataLoaded = true;
                $scope.message = `Distance has been deleted!`;
                services.SUCCESS_MODAL(true);
            });
        }


        $scope.updateOrderDistance = function (distance) {
            $scope.selectedOrderDistance = distance;
            $scope.is_updating = true;
            $scope.order_distance = {
                distance: distance.distance,
                min_amount: distance.min_amount
            }
            $("#addOrderDistanceRef").modal('show');

        }


    }]);
