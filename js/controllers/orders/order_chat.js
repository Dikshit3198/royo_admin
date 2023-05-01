Royo.controller('OrderChatCtrl', ['$scope', 'services', '$stateParams', 'API', 'constants', '$rootScope',
    function ($scope, services, $stateParams, API, constants, $rootScope) {

        $scope.orderId = $stateParams.order_id;
        $scope.receiverId = $stateParams.id;
        $scope.name = $stateParams.name;
        $scope.message_id = $stateParams.message_id; // localStorage.getItem('profile_type') == 'ADMIN' ? $stateParams.message_id : localStorage.getItem('message_id');
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
            var receiverTypeSpell = $scope.person_type.toLowerCase();
            switch (receiverTypeSpell) {
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

        var socket = io.connect(constants.BASEURL + `?id=${$scope.adminId}&userType=${localStorage.getItem('profile_type') == 'ADMIN' ? '4' : '3'}&secretdbkey=${localStorage.getItem('dbKey')}`);
        console.log('socket', socket);
        $scope.messages = [];
        $scope.msgText = '';
        $scope.chatPersons = [];
        $scope.isNothing = false;

        var scrollBottom = function () {
            setTimeout(() => {
                var objDiv = document.getElementById("chatBox");
                if (objDiv) {
                    objDiv.scrollTop = objDiv.scrollHeight;
                }
            }, 200);
        }

        var joinRoom = function () {
            let payload = {
                message_id: $scope.message_id ? $scope.message_id : '',
                username: localStorage.getItem('user_name')
            }
            console.log(payload)
            socket.emit('join_room', payload, (response) => { console.log(response) });
        }

        var fetchConversation = function () {
            const query = {
                limit: 200,
                skip: 0,
                userType: $rootScope.profile == 'ADMIN' ? '4' : '3',
                order_id: $scope.orderId ? $scope.orderId : '',
                receiver_created_id: $scope.createdId ? $scope.createdId : '',
                accessToken: localStorage.getItem('RoyoAccessToken'),
                message_id: $scope.message_id ? $scope.message_id : ''
            }
            if (!$scope.createdId && !$scope.message_id && $scope.receiver_type != 4) {
                $scope.isNothing = true;
            }
            if (localStorage.getItem('profile_type') == 'ADMIN') {
                query.message_id = $scope.message_id ? $scope.message_id : '';
            }
            services.GET_DATA(query, API.GET_CHAT, function (response) {
                $scope.messages = response.data.reverse();
                $scope.messages.forEach(element => {
                    var localDateTime = new Date(element['sent_at'] + ' ' + 'UTC');
                    element['sent_at'] = localDateTime.toString();
                });
                scrollBottom();
                if (([2, 3].includes($scope.receiver_type) && localStorage.getItem('profile_type') == 'ADMIN') || ([4].includes($scope.receiver_type) && localStorage.getItem('profile_type') == 'SUPPLIER')) {
                    console.log('swswwwwad');
                    joinRoom();
                    $scope.isNothing = false;
                }
            });
        }

        var geMessageId = function () {
            let params = {
                userType: localStorage.getItem('profile_type') == 'SUPPLIER' ? 'Supplier' : 'Admin',
                user_created_id: $scope.user_created_id
            }
            if (localStorage.getItem('profile_type') == 'ADMIN' || (localStorage.getItem('profile_type') == 'SUPPLIER')) {
                console.log('dfghgjh');
                params['receiver_created_id'] = $scope.createdId
            }
            services.GET_DATA(params, API.GET_MESSAGE_ID, function (response) {
                if (response.data.message_id) {
                    $scope.message_id = response.data.message_id;
                }
                fetchConversation();
            });
        }

        if (localStorage.getItem('profile_type') == 'ADMIN' || (localStorage.getItem('profile_type') == 'SUPPLIER' && !!$scope.createdId)) {
            geMessageId();
        }

        $scope.sendMessage = function (text, type, keyEvent) {
            if (!text || (!!keyEvent && keyEvent.which !== 13 && type == 1)) return;

            const msg = {
                text: text,
                chat_type: 'text',
                type: $scope.receiver_type,
                sent_at: new Date(),
                offset: moment().format('Z'),
                receiver_created_id: $scope.createdId ? $scope.createdId : '',
                order_id: $scope.orderId,
                sender_created_id: $scope.user_created_id
            }
            if ($scope.message_id) {
                msg.message_id = $scope.message_id;
            } else {
                msg.message_id = $scope.receiver_type == 4 ? '' : 0;
            }
            if ($rootScope.profile === 'ADMIN') {
                msg.sender_type = 4;
            }
            else {
                msg.sender_type = 3;
            }
            const payload = new Object({
                detail: msg
            });
            socket.emit('sendMessage', payload, (response) => {
                console.log(response)
                $scope.message_id = response.data.detail.message_id;
            });

            $scope.messages.push({
                c_id: 0,
                sent_at: msg.sent_at,
                send_by: $scope.user_created_id,
                send_to: $scope.createdId,
                chat_type: msg.chat_type,
                message_id: $scope.message_id ? $scope.message_id : '',
                order_id: $scope.orderId,
                text: msg.text
            });

            $scope.msgText = '';
            document.getElementById('msgInput').value = '';

            scrollBottom();

            $scope.chatPersons.forEach(chat => {
                if (chat.message_id == $scope.message_id) {
                    chat.last_text = msg.text;
                }
            })
        }


        var getMessage = function () {
            socket.on('receiveMessage', (data) => {
                console.log('receiveMessage', data);
                $scope.$apply(function () {
                    let c = 0;
                    $scope.chatPersons.forEach(chat => {
                        if (chat.user_created_id == data.detail.sent_by) {
                            chat.last_text = data.detail.text;
                            c++;
                        }
                        if ($scope.createdId == chat.user_created_id) {
                            chat.last_text = data.detail.text;
                            $scope.messages.push(data.detail);
                            scrollBottom();
                        }
                    })

                    if (c == 0) {
                        let chat_data = { ...data.detail };
                        chat_data.name = chat_data.sender_name;
                        chat_data.last_text = chat_data.text;
                    }
                    // $scope.chatPersons.sort(function (a, b) { return new Date(a.sent_at) - new Date(b.sent_at) });
                });

            });
        }
        getMessage();

        $scope.$on('$destroy', function () {
            socket.on('disconnect', function () { });
            socket.close();
        });


        var getChatPersonList = function () {
            const query = {
                limit: 200,
                skip: 0,
                type: $scope.type_receiver, // $scope.receiver_type,
                accessToken: localStorage.getItem('RoyoAccessToken')
            }
            services.GET_DATA(query, API.GET_CHAT_LIST(), function (response) {

                $scope.chatPersons = response.data;

                // $scope.chatPersons.sort(function (a, b) { return new Date(a.sent_at) - new Date(b.sent_at) });

                if (localStorage.getItem('profile_type') == 'SUPPLIER' && !$scope.createdId) {
                    $scope.createdId = response.data[0].user_created_id; // uid
                    console.log('eerfe');
                    geMessageId();
                }
            });
        }
        getChatPersonList();

        $scope.openInNewWindow = function (index) {
            $window.open($scope.messages[index].image_url);
        }

    }]);
