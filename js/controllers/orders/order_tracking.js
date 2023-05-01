Royo.controller('TrackOrderCtrl', ['$scope', '$stateParams', 'constants', '$rootScope',
  function ($scope, $stateParams, constants, $rootScope) {

    $scope.orderId = $stateParams.order_id;
    // let url = constants.BASEURL + `?user_id=${$stateParams.user_id}&type=${$rootScope.profile}&secretdbkey=${localStorage.getItem('dbKey')}/websocket`;
    // var socket = io.connect(url);
    var socket = io.connect(`${constants.BASEURL}?id=${$stateParams.user_id}&type=${localStorage.getItem('profile_type')}&secretdbkey=${localStorage.getItem('dbKey')}`);
    var directionsService;
    var directionsDisplay;
    $scope.bearing = 0;


    var agent_icon = {};

    var destinationMarker = function (position) {
      $scope.destination_marker = new google.maps.Marker({
        position: position,
        map: map,
        title: 'Destination',
      });
    }

    var supplierMarker = function (position) {
      $scope.supplier_marker = new google.maps.Marker({
        position: position,
        map: map,
        title: $stateParams.supp_name,
      });
    }

    var agentMarker = function (position) {
      $scope.agent_maker = new google.maps.Marker({
        position: position,
        map: map,
        title: 'Agent',
        icon: agent_icon
      });
      $scope.agent_maker.setMap(map);
    }

    var map;
    console.log($stateParams)
    var initMap = function () {
      map = new google.maps.Map(document.getElementById('map2'), {
        zoom: 14,
        center: {
          // lat: Number($stateParams.lat||0),
          // lng: Number($stateParams.lng||0)
          lat: Number($stateParams.lat|| $stateParams.supp_lat || 0),
           lng: Number($stateParams.lng|| $stateParams.supp_lng || 0)
          
        }
      });
      // if (navigator.geolocation) {
      //   navigator.geolocation.getCurrentPosition(function (position) {
      //     var pos = {
      //       lat: position.coords.latitude,
      //       lng: position.coords.longitude
      //     };
      //     map.setCenter(pos);
      //   }, function () {
      //     handleLocationError(true, infoWindow, map.getCenter());
      //   });
      // } else {
      //   handleLocationError(false, infoWindow, map.getCenter());
      // }

      if($stateParams.lat && $stateParams.lng) {
        let LatLng = new google.maps.LatLng({
          lat: Number($stateParams.lat),
          lng: Number($stateParams.lng)
        });
  
        agentMarker(LatLng);
      }


      if($stateParams.supp_lat && $stateParams.supp_lng) {
        let suppLatLng = new google.maps.LatLng({
          lat: Number($stateParams.supp_lat),
          lng: Number($stateParams.supp_lng)
        });
  
        supplierMarker(suppLatLng);
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

    var track = function () {
      agent_icon = {
        url: "/img/v1_images/agent.png", // url
        scaledSize: new google.maps.Size(50, 50), // scaled size
        rotation: $scope.bearing
      };
      initMap();

      socket.on('order_location', function (data) {

        if (data.order_id == $scope.orderId) {
          $scope.$apply(function () {
            $scope.socketData = data;
            $scope.bearing = data.bearing;
          });

          let agent = new google.maps.LatLng(parseFloat(data.latitude), parseFloat(data.longitude));
          let destination = new google.maps.LatLng(parseFloat((data.address[0]).latitude), parseFloat((data.address[0]).longitude));
          
          let request = {
            origin: agent,
            destination: destination,
            optimizeWaypoints: true,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
          };
          if (!!$scope.agent_maker) {
            $scope.agent_maker.setMap(null);
          }

          directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
              directionsDisplay.setDirections(response);
              var route = response.routes[0].legs[0];
              destinationMarker(route.end_location);
              agentMarker(route.start_location);
            }
          });
        }
      });
    }

    $scope.$on('google_map_loaded', loadeMap);
    function loadeMap($event, data) {
      if (data) {
        setTimeout(() => {
          track();
        }, 550);
      }
    }

    if (!!localStorage.getItem('google_map_loaded')) {
      setTimeout(() => {
        track();
      }, 300);
    }

    $scope.$on('$destroy', function () {
      socket.on('disconnect', function () { });
    });

  }]);
