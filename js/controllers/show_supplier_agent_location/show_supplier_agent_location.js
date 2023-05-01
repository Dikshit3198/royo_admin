Royo.controller('SupplierAgentLocationCtrl', ['$scope', '$stateParams', 'services', 'factories', 'API', '$rootScope', '$translate', 'constants', '$state', 'pagerService',
    function ($scope, $stateParams, services, factories, API, $rootScope, $translate, constants, $state, pagerService) {

        $scope.skip = 0;
        $scope.limit = 10;
        $scope.count = 0;
        $scope.currentPage = 1;
        $scope.products = [];
        $scope.search = '';
        $scope.filter_by = 0;

        $scope.is_add = false;
        $scope.localisation = factories.localisation();

        var map;
        var agent_icon;

        $scope.filterBYWhom = [`${$scope.localisation.suppliers} & ${$scope.localisation.agents}`, `${$scope.localisation.suppliers}`, `${$scope.localisation.agents}`];

        var initMap = function () {
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 2,
                center: {
                    lat: 0,
                    lng: 0
                    // lat: 30.9098886,
                    // lng: 75.8737968

                }
            });

            directionsService = new google.maps.DirectionsService();
            directionsDisplay = new google.maps.DirectionsRenderer(
                {
                    map: map,
                    suppressMarkers: true
                }
            );
            directionsDisplay.setMap(map);
        }


    var supplierMarker = function (data) {
        let suppLatLng = new google.maps.LatLng({
            lat: (data.latitude),
            lng: (data.longitude)
          });
        $scope.supplier_marker = new google.maps.Marker({
          position: suppLatLng,
          map: map,
          title: data.name,
        });
      }
  
      var agentMarker = function (data) {
        let LatLng = new google.maps.LatLng({
            lat: (data.latitude),
            lng: (data.longitude)
          });
        $scope.agent_maker = new google.maps.Marker({
          position: LatLng,
          map: map,
          title: data.name,
          icon: agent_icon
        });
        $scope.agent_maker.setMap(map);
      }


      setMapDetails = function() {
        agent_icon = {
            url: "/img/v1_images/agent.png", // url
            scaledSize: new google.maps.Size(50, 50), // scaled size
            rotation: $scope.bearing
          };

        initMap();
      }
      
        $scope.getSupplierAgentLocation = function () {
            let param_data = {};
            if ($scope.filter_by || $scope.filter_by == 0)
                param_data.filter = $scope.filter_by;

            $scope.dataLoaded = false;

            services.GET_DATA(param_data, API.GET_ALL_SUPPLIER_AGENT_LOCATION, function (response) {

                setMapDetails();
                if (!!response && response.data && response.data.results) {
                    let details = response.data.results;

                    if (!!details.agent_list) {
                        details.agent_list.forEach(col => {
                            agentMarker(col); 
                        })
                    }

                    if (details.supplier_list) {
                        details.supplier_list.forEach(col => {
                            supplierMarker(col); 
                        })
                    }
                }
                $scope.dataLoaded = true;
            });
        }



        $scope.$on('settingsLoaded', load);
        function load($event, data) {
            console.log('data', data);
            if (data) {
                $scope.getSupplierAgentLocation(1);
            }
        }

        $scope.changeFilterBy = function (filter) {
            $scope.filter_by = filter;
            $scope.getSupplierAgentLocation();
        }

    }]);    