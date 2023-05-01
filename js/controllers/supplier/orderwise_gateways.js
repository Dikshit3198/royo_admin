Royo.controller('OrderwiseGatewaysCtrl', ['$scope', '$rootScope', '$stateParams', 'services', 'API', 'pagerService', 'constants', 'factories',
    function ($scope, $rootScope, $stateParams, services, API, pagerService, constants, factories) {


        $rootScope.tab = $stateParams.tab;
        $scope.supplier_id = $stateParams.supplierId;
        $rootScope.$broadcast('supplier_id', { supplier_id: $stateParams.supplierId, tab: $stateParams.tab });
        $scope.is_dine_in = $stateParams.dine_in;

        $scope.orderWiseGateways = [];
        $scope.dataLoaded = false;
        $scope.supplier_id = '';
        $scope.orderwise_gateways = {
            supplier_id: '',
            order_type: '0',
            payment_gateways: []
        }
        $scope.selected_orderwise_gateways = {};

        $scope.all_payment_gateways = [];

        $scope.is_updating = false;

        var getOrderwiseGateways = function (page) {
            $stateParams
            var data = {
                supplier_id: $stateParams.supplierId,
            };
            $scope.dataLoaded = false;
            services.GET_DATA(data, API.GET_ORDERWISE_GATEWAYS, function (response) {
                $scope.orderWiseGateways = response.data;
                $scope.dataLoaded = true;

                $scope.orderWiseGateways.forEach(element => {
                    element.payment_gateways = element.payment_gateways.replace(/#/g, ',');
                });
                $scope.changeView(true);
            });
        };
        getOrderwiseGateways(1);

        $scope.changeView = function (value) {
            setTimeout(() => {
                $scope.resetData();
                $rootScope.all_payment_gateways = $rootScope.all_payment_gateways.filter((gateway) => gateway.is_active == 1);
                let cod_index = $rootScope.all_payment_gateways.findIndex(el => el.name.toLowerCase() === 'cod');
                if (cod_index <= -1) {
                    $rootScope.all_payment_gateways.push({ name: 'cod' });
                }
                $rootScope.all_payment_gateways.forEach(element => {
                    element['checked'] = false;
                });
                $scope.all_payment_gateways = $rootScope.all_payment_gateways;
            }, 2000);
        }

        $scope.resetData = function () {
            $scope.orderwise_gateways = {
                supplier_id: '',
                order_type: '0',
                payment_gateways: []
            }
            $scope.selected_orderwise_gateways = {};

            $scope.all_payment_gateways = [];
        }

        $scope.addOrderwiseGateways = function (addOrderwiseGatewaysForm) {
            if (addOrderwiseGatewaysForm.$invalid) return;
            var addParams = {};
            addParams.order_type = $scope.orderwise_gateways.order_type;
            addParams.payment_gateways = $scope.orderwise_gateways.payment_gateways.join("#");
            addParams.supplier_id = $stateParams.supplierId;

            var api = API.ADD_ORDERWISE_GATEWAYS;
            if ($scope.is_updating) {
                addParams.id = $scope.selected_orderwise_gateways.id;
                api = API.UPDATE_ORDERWISE_GATEWAYS;
                delete addParams.supplier_id;
                delete addParams.order_type;
            }

            services.POST_DATA(addParams, api, function (response) {
                $scope.dataLoaded = true;
                $("#addOrderwiseGatewaysRef").modal('hide');
                getOrderwiseGateways(1);
                $scope.message = `Orderwise gateways has been added!`;
                $scope.orderwise_gateways.order_type = '';
                $scope.orderwise_gateways.payment_gateways = [];
                addOrderwiseGatewaysForm.$submitted = false;
                services.SUCCESS_MODAL(true);
            });
        }



        $scope.deleteOrderwiseGateways = function (data) {
            var data = {
                id: data.id
            }
            services.POST_DATA(data, API.DELETE_ORDERWISE_GATEWAYS, function (response) {
                getOrderwiseGateways(1);
                $scope.dataLoaded = true;
                $scope.message = `Orderwise gatways has been deleted!`;
                services.SUCCESS_MODAL(true);
            });
        }


        $scope.updateOrderwiseGateways = function (data) {
            $scope.is_updating = true;
            $scope.orderwise_gateways.payment_gateways.push(...data.payment_gateways.split(','));
            $("#addOrderwiseGatewaysRef").modal('show');
            $scope.selected_orderwise_gateways = data;
            $scope.orderwise_gateways.order_type = data.order_type.toString();

            $scope.all_payment_gateways.forEach(element => {
                $scope.orderwise_gateways.payment_gateways.forEach(ele => {
                    if (ele.toLowerCase() == element.name.toLowerCase()) {
                        element['checked'] = true;
                    }
                });
            });
        }

        $scope.selectGateway = function (gateway) {
            gateway.checked = !gateway.checked;
            var findGateway = $scope.all_payment_gateways.find(x => x.name == gateway.name);
            $scope.all_payment_gateways.forEach(element => {
                if (element.name == findGateway.name) {
                    element['checked'] = gateway.checked;
                    if (gateway.checked) {
                        $scope.orderwise_gateways.payment_gateways.push(findGateway.name.toLowerCase());
                    }
                    else {
                        const index = $scope.orderwise_gateways.payment_gateways.indexOf(findGateway.name.toLowerCase());
                        if (index > -1) {
                            $scope.orderwise_gateways.payment_gateways.splice(index, 1);
                        }
                    }
                }
            });
        }


    }]);
