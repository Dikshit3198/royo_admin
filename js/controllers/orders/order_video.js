Royo.controller('OrderVideoCtrl', ['$scope', 'services', '$stateParams', 'API', 'constants', '$rootScope',
    function ($scope, services, $stateParams, API, constants, $rootScope,$window) {
       console.log('in video')
        $scope.orderId = $stateParams.order_id;
        $scope.receiverId = $stateParams.id;
        $scope.name = $stateParams.name;
        $scope.adminId = localStorage.getItem('profile_type') == 'ADMIN' ? localStorage.getItem('adminId') : localStorage.getItem('supplier_id');

        if (localStorage.getItem('profile_type') == 'ADMIN') {
            $scope.createdId = $stateParams.created_id;
        } else if (localStorage.getItem('profile_type') == 'SUPPLIER') {
            $scope.createdId = $stateParams.created_id ? $stateParams.created_id : '';
        }

        $scope.user_created_id = localStorage.getItem('user_created_id');
        $scope.receiver_type = parseInt($stateParams.type);
        $scope.person_type = $stateParams.receiver_type;
        $scope.type_receiver = 1;

        var getReceiverType = function () {
            switch ($scope.person_type) {
                case 'user':
                    $scope.type_receiver = 1;
                    break;
                case 'supplier': case 'admin':
                    $scope.type_receiver = 3;
                    break;
                case 'agent':
                    $scope.type_receiver = 2;
                    break;
                default:
                    $scope.type_receiver = 1;
            }
        }
        getReceiverType();

        var zoomAuth=function(){
            let params={}
            services.GET_DATA(params,API.ZOOM_AUTH, function (res) {
               if(res.status==200){
               createZoomMeeting(res.data)
               }
            });
        }
        zoomAuth()
         
        var createZoomMeeting = function(auth_value){
            var data = {
                zoom_email: auth_value.zoom_email,
                token: auth_value.token,
                topic: 'Order Meeting',
                type: 5,
                start_time: "2021-08-11T12:09:00Z",
                duration: 60,
                end_date_time: "2021-08-12T12:09:00Z",
                agenda:"test",
                // order_id:$stateParams.order_id
                order_id:'132'
              }
              services.POST_DATA(data, API.CREATE_ZOOM_MEETING, function (response){
                console.log(response)
                if(response.status == 200){
                // services.toast('Zoom meeting created')

                 joinZoomMeeting(response.data.start_url)
                }
              })
        }

        var joinZoomMeeting = function(zoom_url){
            console.log(zoom_url)

                window.open(zoom_url, "_blank")
        }

        //         $scope.openInNewWindow = function (index) {
        //     $window.open($scope.messages[index].image_url);
        // }

    }]);
