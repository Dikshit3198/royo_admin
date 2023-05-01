Royo.controller('TrackAgentsCtrl', ['$scope', '$rootScope', '$stateParams', 'API', 'services', 'factories',
    function ($scope, $rootScope, $stateParams, API, services, factories,) {

        $scope.suppliers = [];
        $scope.selected_supplier;
        $scope.is_admin = 0;
        $scope.selected_supplier_filter = null;
        $scope.settings = factories.getSettings();
        $scope.dataLoaded = false;
        $scope.search_agent = '';

        var getSuppliers = function () {
            let params = {
                limit: 0,
                offset: 0,
                is_active: 1,
                search: '',
                is_desc: 0,
                order_by: 0
            }

            if (!!localStorage.getItem('data_country')) {
                let country_data = localStorage.getItem('data_country').split(',');
                params.country_code = country_data[0];
                params.country_code_type = country_data[1];
            }

            services.GET_DATA(params, API.SUPPLIER_LIST, function (response) {
                $scope.suppliers = response.data.suppliersList;
            });
        };
        if ($rootScope.profile === 'ADMIN' && $scope.settings.screenFlow[0].is_single_vendor == 0) {
            getSuppliers();
        }

        $scope.changeSupplier = function (supplier) {
            $scope.selected_supplier_filter = supplier;
            getAgentList();
        }

        $scope.toggleAdmin = function (is_admin) {
            $scope.is_admin = +!is_admin;
            $scope.selected_supplier_filter = '';
            getAgentList();
        }

        $scope.searchAgent = function (keyEvent) {
            if (keyEvent.which === 13) {
                $scope.search_agent = keyEvent.target.value;
                getAgentList();
            }
        }

        var markersArray = [];

        var getAgentList = function () {
            let param_data = {};
            param_data.sectionId = 63;
            param_data.offset = 0;
            param_data.limit = 200;
            param_data.search = ($scope.search_agent).trim() ? $scope.search_agent : '';
            if ($rootScope.profile === 'ADMIN') {
                if ($scope.selected_supplier_filter) {
                    param_data.supplierId = $scope.selected_supplier_filter.id;
                }
                param_data.is_admin = $scope.is_admin;

                if (!!localStorage.getItem('data_country')) {
                    let country_data = localStorage.getItem('data_country').split(',');
                    param_data.country_code = country_data[0];
                    param_data.country_code_type = country_data[1];
                }
            }
            $scope.dataLoaded = false;
            services.GET_DATA(param_data, API.GET_AGENT_LIST(), function (response) {
                if (!!response && response.data) {
                    let agents = response.data.AgentList;
                    if (markersArray.length) {
                        markersArray.forEach(marker => {
                            marker.setMap(null);
                            markersArray = [];
                        });
                    }

                    agents.map((agent, index) => {
                        if (agent.latitude && agent.longitude) {

                            let contentString = `
                                <div class="agent-info">
                                    <ul>
                                        <li><b>Name: </b> ${agent.name}</li>
                                        <li><b>Phone No: </b> ${agent.country_code} ${agent.phone_number}</li>
                                        <li><b>Email: </b> ${agent.email}</li>
                                        <li><b>Occupation: </b> ${agent.occupation ? agent.occupation : 'NA'}</li>
                                        <li><b>Revenue: </b> ${agent.revenue}</li>
                                        <li><b>Active Orders: </b> ${agent.active_orders || 0}</li>
                                    </ul>
                                    <div class="link">
                                        <a href="${window.location.origin}/#!/profile-setup/agent-profile?edit=1&id=${agent.id}">Edit</a>
                                        &nbsp;
                                        <a href="${window.location.origin}/#!/orders/order-manager?status=1&agent_id=${agent.id}">View Orders</a>
                                    </div>
                                </div>
                            `;

                            let info = new google.maps.InfoWindow({
                                content: contentString
                            });

                            let marker = new google.maps.Marker({
                                position: { lat: agent.latitude, lng: agent.longitude },
                                map: map,
                                title: agent.name
                            });

                            marker.addListener('click', function () {
                                info.open(map, marker);
                            });

                            markersArray.push(marker);

                            if (index == 0) {
                                let latLng = new google.maps.LatLng(agent.latitude, agent.longitude); //Makes a latlng
                                map.panTo(latLng);
                            }
                        }
                    });
                }
                $scope.dataLoaded = true;
            });
        }

        var map;
        var initMap = function () {
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 10
            });

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    map.setCenter(pos);
                }, function () {
                    handleLocationError(true, infoWindow, map.getCenter());
                });
            } else {
                handleLocationError(false, infoWindow, map.getCenter());
            }
        }

        $scope.$on('google_map_loaded', loadeMap);
        function loadeMap($event, data) {
            if (data) {
                setTimeout(() => {
                    initMap();
                    getAgentList();
                }, 550);
            }
        }

        if (!!localStorage.getItem('google_map_loaded')) {
            setTimeout(() => {
                initMap();
                getAgentList();
            }, 300);
        }


    }]);
