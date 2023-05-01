Royo.controller('VehicleCategoryCtrl', ['$scope', '$rootScope', '$stateParams', 'services', 'API', 'pagerService', 'constants', 'factories',
    function ($scope, $rootScope, $stateParams, services, API, pagerService, constants, factories) {


        $scope.skip = 0;
        $scope.limit = 20;
        $scope.search = '';
        $scope.count = 0;
        $scope.vehicleCatList = [];
        $scope.dataLoaded = false;
        $scope.user = {};
        $scope.user_id = '';
        $scope.vehicle = {
            name: '',
            type: ''
        }

        var getVehicleCatList = function () {
            var data = {};
            $scope.dataLoaded = false;
            services.GET_DATA(data, API.LIST_VEHICLE_CATEGORY, function (response) {
                $scope.vehicleCatList = response.data;
                $scope.dataLoaded = true;
            });
        };
        getVehicleCatList();



        $scope.addVehicleCategory = function (addVehicleCatForm) {
            if (addVehicleCatForm.$invalid) return;
            var addParams = {};
            addParams.type = $scope.vehicle.type;
            addParams.name = $scope.vehicle.name;
            services.POST_DATA(addParams, API.ADD_VEHICLE_CATEGORY, function (response) {
                $scope.dataLoaded = true;
                $("#addVehicleCat").modal('hide');
                getVehicleCatList();
                $scope.message = `Vehicle Category Has Been Added!`;
                $scope.vehicle.name = '';
                $scope.vehicle.type = '';
                addVehicleCatForm.$submitted = false;
                services.SUCCESS_MODAL(true);
            });
        }



        $scope.deleteVehicleCategory = function (vehicle) {
            var data = {
                id: vehicle.id
            }
            services.POST_DATA(data, API.DELETE_VEHICLE_CATEGORY, function (response) {
                getVehicleCatList();
                $scope.dataLoaded = true;
                $scope.message = `Category has been deleted!`;
                services.SUCCESS_MODAL(true);
            });
        }


    }]);
