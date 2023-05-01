Royo.controller('TrackOrderUserCtrl', ['$scope', '$stateParams', 'constants', '$rootScope',
    function ($scope, $stateParams, constants, $rootScope) {

        $scope.orderId = $stateParams.order_id;
        // let url = constants.BASEURL + `?user_id=${$stateParams.user_id}&type=${$rootScope.profile}&secretdbkey=${localStorage.getItem('dbKey')}/websocket`;
        // var socket = io.connect(url);
        var socket = io.connect(constants.BASEURL + `?id=${$stateParams.user_id}&userType=2&secretdbkey=${localStorage.getItem('dbKey')}`);
        var directionsService;
        var directionsDisplay;
        $scope.bearing = 0;

        var destinationMarker = function (position) {
            $scope.destination_marker = new google.maps.Marker({
                position: position,
                map: map,
                title: 'Destination',
            });
        }

        var user_icon = {
            url: "/img/v1_images/user.png", // url
            scaledSize: new google.maps.Size(50, 50), // scaled size
            rotation: $scope.bearing
        };

        var userMarker = function (position) {
            $scope.user_maker = new google.maps.Marker({
                position: position,
                map: map,
                title: 'User',
                icon: user_icon
            });
            $scope.user_maker.setMap(map);
        }

        var map;
        var initMap = function () {
            map = new google.maps.Map(document.getElementById('map3'), {
                zoom: 14
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

            // destinationMarker({ lat: parseFloat(latlng[0]), lng: parseFloat(latlng[1]) })
            // destination = new google.maps.LatLng(parseFloat(latlng[0]), parseFloat(latlng[1])); //Makes a latlng
            // map.panTo(destination);

            directionsService = new google.maps.DirectionsService();
            directionsDisplay = new google.maps.DirectionsRenderer(
                {
                    map: map,
                    suppressMarkers: true
                }
            );
            directionsDisplay.setMap(map);
        }
        $scope.$on('google_map_loaded', loadeMap);
        function loadeMap($event, data) {
            if (data) {
                setTimeout(() => {
                    initMap();
                }, 250);
            }
        }

        socket.on('user_location', function (data) {

            if (data.order_id == $scope.orderId) {
                $scope.$apply(function () {
                    $scope.socketData = data;
                    $scope.bearing = data.bearing;
                });

                let agent = new google.maps.LatLng(parseFloat(data.latitude), parseFloat(data.longitude));
                let destination = new google.maps.LatLng(parseFloat(data.branch_latitude), parseFloat(data.branch_longitude));

                let request = {
                    origin: agent,
                    destination: destination,
                    optimizeWaypoints: true,
                    travelMode: google.maps.DirectionsTravelMode.DRIVING
                };
                if (!!$scope.user_maker) {
                    $scope.user_maker.setMap(null);
                }

                directionsService.route(request, function (response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(response);
                        var route = response.routes[0].legs[0];
                        destinationMarker(route.end_location);
                        userMarker(route.start_location);
                    }
                });
            }
        });

        if (!!localStorage.getItem('google_map_loaded')) {
            setTimeout(() => {
                initMap();
            }, 300);
        }

        $scope.$on('$destroy', function () {
            socket.on('disconnect', function () { });
        });

    }]);
