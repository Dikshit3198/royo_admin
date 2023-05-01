Royo.controller('EventListingCtrl',
    ['$scope', '$rootScope', '$stateParams', 'services', 'API', 'pagerService', 'constants', 'factories', '$state',
        function ($scope, $rootScope, $stateParams, services, API, pagerService, constants, factories, $state) {

            $rootScope.tab = $stateParams.tab;
            $scope.supplier_id = $stateParams.supplierId;
            $rootScope.$broadcast('supplier_id', { supplier_id: $stateParams.supplierId, tab: $stateParams.tab });

            $scope.is_assiging = false;
            $scope.skip = 0;
            $scope.limit = 60;
            $scope.search = '';
            $scope.count = 0;
            $scope.eventsList = [];
            $scope.invitedEventsList = [];
            $scope.suppliersList = [];
            $scope.dataLoaded = false;
            $scope.event_obj = {
                name: '',
                venue_name: '',
                address: '',
                latitude: 0,
                longitude: 0,

                organizer_name: '',
                start_time: '',
                end_time: '',
                description: '',
                type: 1,

                cancellation_policy: '',
                refund_policy: '',
                host_terms_policy: '',

                supplier_id: '',

                invited_vendors: [],
                invited_users: [],
                order_radius: 0,
                tickets: [],

                email: '',
                phone: '',
                browser_link: '',
                facebook_link: '',
                instagram_link: '',

                // is_supplier_participating: 0,

                images: [],
            }


            $scope.ticket_types_obj = {
                name: '',
                price: 0
            }
            $scope.ticket_types = [Object.assign({}, $scope.ticket_types_obj)];
            $scope.invited_user_obj = {
                name: '',
                email: '',
                phone: '',
            }
            $scope.invited_user_list = [];

            $scope.event_time_obj = {
                start_time_t1: '',
                end_time_t1: ''
            }



            $scope.selectedEvent = {};
            $scope.event_images = [];
            $scope.is_updating = false;
            $scope.user_error_msg = false;

            $scope.is_event_item_show = false;
            $scope.eventItemList = [];
            $scope.eventMenuName = "";
            $scope.eventIdForAssignItems = 0;

            $scope.menu_name_obj = {
                name: "",
                id: ""
            }

            var initialize = function () {
                var input = document.querySelector("#sup_phone");
                if (input) {
                    $scope.iti = window.intlTelInput(input, {
                        preferredCountries: [factories.getSettings().adminDetails[0].iso]
                    });
                    var input = document.getElementById('searchTextField');
                    if (google) {
                        var autocomplete = new google.maps.places.Autocomplete(input);
                        autocomplete.addListener('place_changed', function () {
                            var place = autocomplete.getPlace();
                            $scope.event_obj['latitude'] = place.geometry.location.lat();
                            $scope.event_obj['longitude'] = place.geometry.location.lng();
                            $scope.event_obj.address = place.formatted_address;
                        });
                    }
                }
            }
            var initializeUserPhn = function () {
                var input_user = document.querySelector("#sup_phone_user");
                if (input_user) {
                    $scope.iti = window.intlTelInput(input_user, {
                        preferredCountries: [factories.getSettings().adminDetails[0].iso]
                    });
                }
            }

            var datepicker1 = function () {
                var picker = new Lightpick({
                    field: document.getElementById("datepicker_1"),
                    singleDate: true,
                    footer: true,
                    minDate: new Date(),
                    onSelect: function (start, end) {
                        if (start) {
                            $scope.event_obj.start_time = start.format('YYYY-MM-DD');
                            datepicker2();
                        }
                    }
                });
            }
            var datepicker2 = function () {
                var picker = new Lightpick({
                    field: document.getElementById("datepicker_2"),
                    singleDate: true,
                    footer: true,
                    minDate: new Date($scope.event_obj.start_time),
                    onSelect: function (start, end) {
                        if (start) {
                            $scope.event_obj.end_time = start.format('YYYY-MM-DD');
                        }
                    }
                });
            }


            var initPhnCalenders = function () {
                initialize();
                datepicker1();
                datepicker2();
            }


            $scope.changeView = function () {
                initPhnCalenders();
                $scope.is_updating = false;
            }



            var getEventListing = function (page) {
                var data = {
                    limit: $scope.limit,
                    offset: $scope.skip,
                    search: ''

                };
                $scope.dataLoaded = false;

                if ((Number)(localStorage.getItem('supplier_id'))) {
                    data['supplier_id'] = localStorage.getItem('supplier_id') || ''
                }

                var api = API.GET_EVENT_LISTING;

                services.POST_DATA(data, api, function (response) {
                    $scope.eventsList = response.data;
                    $scope.count = response.data.length;
                    $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                    $scope.dataLoaded = true;
                });
            };

            var getEventListing_Id = function (page) {
                var data = {
                    limit: $scope.limit,
                    offset: $scope.skip,
                    search: ''
                };
                $scope.dataLoaded = false;
                $scope.is_assiging = true;

                $scope.eventsList = [];


                if ((Number)($stateParams.supplierId)) {
                    data['supplier_id'] = $stateParams.supplierId
                }

                var api = API.GET_EVENT_LISTING;

                services.POST_DATA(data, api, function (response) {
                    $scope.eventsList = response.data;
                    $scope.count = response.data.length;
                    $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                    $scope.dataLoaded = true;
                });
            };
            var getInvitedEventListing_Id = function (page) {
                var data = {
                    limit: $scope.limit,
                    offset: $scope.skip,
                    search: ''
                };
                $scope.dataLoaded = false;
                $scope.is_assiging = true;

                $scope.eventsList = [];


                if ((Number)($stateParams.supplierId)) {
                    data['supplier_id'] = $stateParams.supplierId
                }

                var api = API.GET_INVITED_EVENT_LISTING;

                services.POST_DATA(data, api, function (response) {
                    $scope.invitedEventsList = response.data;
                    $scope.count = response.data.length;
                    $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                    $scope.dataLoaded = true;
                });
            };

            if ($stateParams.supplierId) {
                getEventListing_Id(1);
                getInvitedEventListing_Id(1);
            }
            else {
                getEventListing(1);
            }

            $scope.setPage = function (page) {
                $scope.currentPage = page;
                $scope.skip = $scope.limit * (page - 1);
                getEventListing(page);
            }

            $scope.getTicketPricing = function (tickets) {
                var pricing = '';
                var min = '';
                var max = '';
                var list = tickets.sort(function (a, b) {
                    return a.price - b.price
                })
                min = list[0];
                max = list[list.length - 1]
                if (list.length > 1) {
                    pricing = `${min.price}-${max.price}`;
                }
                else {
                    pricing = min.price;
                }
                return pricing;
            }


















            $scope.getSuppplierListing = function () {
                var param_data = {};
                param_data.accessToken = constants.ACCESSTOKEN;
                param_data.sectionId = 52;

                services.POST_DATA(param_data, API.LIST_SUPPLIERS_FOR_SETTINGS, function (response) {
                    $scope.suppliersList = response.data || [];
                    $scope.suppliersList.forEach(element => {
                        element['checked'] = false;
                    });

                    if ((Number)(localStorage.getItem('supplier_id'))) {
                        var index = $scope.suppliersList.findIndex(function (sup) {
                            return sup.id === (Number)(localStorage.getItem('supplier_id'));
                        })
                        if (index !== -1) $scope.suppliersList.splice(index, 1);
                    }
                });
            };
            $scope.getSuppplierListing();

            $scope.selectSupplier = function (supplier) {
                supplier.checked = !supplier.checked;
                var findSupplier = $scope.suppliersList.find(x => x.id == supplier.id);
                $scope.suppliersList.forEach(element => {
                    if (element.id == findSupplier.id) {
                        element['checked'] = supplier.checked;
                        if (supplier.checked) {
                            $scope.event_obj.invited_vendors.push(findSupplier.id);
                        }
                        else {
                            const index = $scope.event_obj.invited_vendors.indexOf(findSupplier.id);
                            if (index > -1) {
                                $scope.event_obj.invited_vendors.splice(index, 1);
                            }
                        }
                    }
                });
            }



















            $scope.uploadImage = function (file, callback) {     // Get Image Url
                if (!file) {
                    return callback(null, file)
                }

                const data = {
                    'file': file
                }

                services.POST_FORM_DATA(data, API.UPLOAD_IMAGE, (response) => {
                    if (response && response.data) {
                        return callback(null, response.data)
                    }
                })
            }



            $rootScope.file_to_upload_for_events_refund_policy = function (File) {
                var file = File[0];
                if (constants.FILE_TYPE.includes(file.type)) {
                    if ((file.size / Math.pow(1024, 2)) <= 1) {
                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = function (event) {
                            $scope.$apply(function () {
                                $scope.uploadImage(File[0], function (err, imageUrl) {
                                    $scope.event_obj.refund_policy = imageUrl;
                                })
                            });
                        }
                    } else {
                        factories.invalidDataPop("Image size must be less than 1mb");
                    }
                } else {
                    factories.invalidDataPop("Invalid File Type");
                }
            };
            $rootScope.file_to_upload_for_events_cancellation_policy = function (File) {
                var file = File[0];
                if (constants.FILE_TYPE.includes(file.type)) {
                    if ((file.size / Math.pow(1024, 2)) <= 1) {
                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = function (event) {
                            $scope.$apply(function () {
                                $scope.uploadImage(File[0], function (err, imageUrl) {
                                    $scope.event_obj.cancellation_policy = imageUrl;
                                })
                            });
                        }
                    } else {
                        factories.invalidDataPop("Image size must be less than 1mb");
                    }
                } else {
                    factories.invalidDataPop("Invalid File Type");
                }
            };
            $rootScope.file_to_upload_for_events_host_terms_policy = function (File) {
                var file = File[0];
                if (constants.FILE_TYPE.includes(file.type)) {
                    if ((file.size / Math.pow(1024, 2)) <= 1) {
                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = function (event) {
                            $scope.$apply(function () {
                                $scope.uploadImage(File[0], function (err, imageUrl) {
                                    $scope.event_obj.host_terms_policy = imageUrl;
                                })
                            });
                        }
                    } else {
                        factories.invalidDataPop("Image size must be less than 1mb");
                    }
                } else {
                    factories.invalidDataPop("Invalid File Type");
                }
            };
            $rootScope.file_to_upload_for_events = function (File) {
                var file = File[0];
                if (constants.IMAGE_TYPE.includes(file.type)) {
                    if ((file.size / Math.pow(1024, 2)) <= 1) {
                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = function (event) {
                            $scope.$apply(function () {
                                $scope.uploadImage(File[0], function (err, imageUrl) {
                                    $scope.event_images.push(imageUrl);
                                })
                            });
                        }
                    } else {
                        factories.invalidDataPop("Image size must be less than 1mb");
                    }
                } else {
                    factories.invalidDataPop("Invalid File Type");
                }
            };

            $scope.setEventType = function (type) {
                $scope.event_obj.type = (Number)(type);
                if ($scope.event_obj.type == 2) {
                    setTimeout(() => {
                        initializeUserPhn();
                    }, 2000);
                }
            }





            $scope.addEvent = function (addEventForm) {
                if (addEventForm.$invalid) return;
                if ($scope.event_images.length <= 0) {
                    return;
                }
                if (!$scope.event_obj.refund_policy || !$scope.event_obj.cancellation_policy || !$scope.event_obj.host_terms_policy) {
                    return;
                }
                var addParams = $scope.event_obj;
                $scope.event_images.forEach(element => {
                    addParams['images'].push(element);
                });
                addParams.tickets = $scope.ticket_types;
                addParams.invited_users = $scope.invited_user_list || [];
                // addParams['is_supplier_participating'] = $scope.event_obj.is_supplier_participating ? 1 : 0;

                if ((Number)(localStorage.getItem('supplier_id'))) {
                    addParams.supplier_id = localStorage.getItem('supplier_id') || ''
                }
                else {
                    delete addParams['supplier_id'];
                }

                addParams['start_time'] = addParams['start_time'] + ' ' +
                    moment($scope.event_time_obj.start_time_t1).format('HH:mm:ss A');
                addParams['end_time'] = addParams['end_time'] + ' ' +
                    moment($scope.event_time_obj.end_time_t1).format('HH:mm:ss A');


                var api = '';
                if ($scope.is_updating) {
                    addParams['event_id'] = $scope.selectedEvent.id;
                    api = API.UPDATE_SUPPLIER_EVENT;
                    services.POST_DATA(addParams, api, function (response) {
                        afterAddEdit();
                    });
                }
                else {
                    api = API.SUPPLIER_ADD_EVENT;
                    services.POST_DATA(addParams, api, function (response) {
                        afterAddEdit();
                    });
                }


            }

            afterAddEdit = function () {
                $scope.event_obj = {
                    name: '',
                    venue_name: '',
                    address: '',
                    latitude: 0,
                    longitude: 0,

                    organizer_name: '',
                    start_time: '',
                    end_time: '',
                    description: '',
                    type: 1,

                    cancellation_policy: '',
                    refund_policy: '',
                    host_terms_policy: '',

                    supplier_id: '',

                    invited_vendors: [],
                    invited_users: [],
                    order_radius: 0,
                    tickets: [],

                    email: '',
                    phone: '',
                    browser_link: '',
                    facebook_link: '',
                    instagram_link: '',

                    images: [],
                }
                $scope.dataLoaded = true;
                $("#addEventRef").modal('hide');
                getEventListing(1);
                $scope.message = `Event has been ${$scope.is_updating ? 'Updated' : 'added'}!`;
                services.SUCCESS_MODAL(true);
                $scope.is_updating = false;
            }



            $scope.deleteEvent = function (event) {
                services.CONFIRM('you want to delete this event?',
                    function (isConfirm) {
                        if (isConfirm) {
                            var data = {
                                event_id: event.id
                            }

                            var api = API.DELETE_SUPPLIER_EVENT;

                            services.POST_DATA(data, api, function (response) {
                                getEventListing(1);
                                $scope.dataLoaded = true;
                                $scope.message = `event has been deleted!`;
                                services.SUCCESS_MODAL(true);
                            });
                        }
                    })
            }
            $scope.approveEvent = function (event) {
                services.CONFIRM('Are your sure you want to approve this event?',
                    function (isConfirm) {
                        if (isConfirm) {
                            event.is_approved = !event.is_approved;
                            var data = {
                                event_id: event.id,
                                is_approved: event.is_approved
                            }

                            var api = API.APPROVE_SUPPLIER_EVENT_BY_ADMIN;

                            services.POST_DATA(data, api, function (response) {
                                getEventListing(1);
                                $scope.dataLoaded = true;
                                $scope.message = `event has been approved!`;
                                services.SUCCESS_MODAL(true);
                            });
                        }
                    })
            }
            $scope.removeAllImages = function (event_images) {
                if (event_images.length) {
                    event_images.forEach((element, index) => {
                        if (element.id) {
                            (async () => {
                                await $scope.delay(2000);
                                $scope.deleteEventImage(element, index);
                            })();
                        }
                    });
                }
                $scope.event_images = [];
            }
            $scope.delay = function (ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
            $scope.deleteEventImage = function (eventImage, index) {
                if (eventImage.id) {
                    var data = {
                        id: eventImage.id
                    }
                    var api = '';
                    services.PUT_DATA(data, api, function (response) {
                        if (index > -1) {
                            $scope.event_images.splice(index, 1);
                        }
                        $scope.dataLoaded = true;
                        $scope.message = `Event Image has been deleted!`;
                        services.SUCCESS_MODAL(true);
                    });
                }
                else {
                    if (index > -1) {
                        $scope.event_images.splice(index, 1);
                    }
                }
            }

            $scope.updateEvent = function (event) {
                setEventValues(event);
                $("#addEventRef").modal('show');
            }

            $scope.viewEventDetails = function (event) {
                setEventValues(event);
                $("#viewEventRef").modal('show');
            }

            var setEventValues = function (event) {
                $scope.selectedEvent = event;
                if ($scope.selectedEvent.images && $scope.selectedEvent.images.length) {
                    $scope.event_images = [];
                    $scope.selectedEvent.images.forEach(element => {
                        $scope.event_images.push(element.path);
                    });
                }
                $scope.is_updating = true;
                $scope.event_obj = Object.assign({}, event);
                $scope.event_obj['invited_vendors'] = [];
                $scope.event_obj['invited_users'] = [];
                delete $scope.event_obj['vendors'];
                delete $scope.event_obj['attendees'];

                $scope.ticket_types = event.tickets;
                $scope.invited_user_list = event.attendees || [];

                $scope.setEventType($scope.event_obj.type);

                if (event.vendors) {
                    event.vendors.forEach(element => {
                        var obj = {
                            id: element.supplier_id,
                            checked: false
                        }
                        $scope.selectSupplier(obj);
                    });
                }


                $scope.event_time_obj['start_time_t1'] = new Date(moment(event.start_time.slice(0, -1)).format('YYYY-MM-DD hh:mm a'));
                $scope.event_time_obj['end_time_t1'] = new Date(moment(event.end_time.slice(0, -1)).format('YYYY-MM-DD hh:mm a'));


                $scope.event_obj['start_time'] = moment(event.start_time).format('YYYY-MM-DD');
                $scope.event_obj['end_time'] = moment(event.end_time).format('YYYY-MM-DD');

                initPhnCalenders();
            }


            $scope.addTickets = function () {
                var obj = Object.assign({}, $scope.ticket_types_obj);
                $scope.ticket_types.push(obj);
            }
            $scope.removeTickets = function () {
                $scope.ticket_types.pop();
            }
            $scope.addUser = function () {
                $scope.user_error_msg = false;
                var obj = Object.assign({}, $scope.invited_user_obj);
                if (!obj.name || !obj.email || !obj.phone) {
                    $scope.user_error_msg = true;
                    return;
                }
                $scope.invited_user_list.push(obj);
                $scope.invited_user_obj = {
                    name: '',
                    email: '',
                    phone: '',
                }
            }
            $scope.removeUser = function () {
                $scope.invited_user_list.pop();
            }


            $scope.joinEvent = function (event) {
                services.CONFIRM('you want to join this event?',
                    function (isConfirm) {
                        if (isConfirm) {
                            var data = {
                                supplier_id: $stateParams.supplierId,
                                event_id: event.id
                            }
                            var api = API.JOIN_EVENT_BY_SUPPLIER;
                            services.POST_DATA(data, api, function (response) {
                                $scope.dataLoaded = true;
                                $scope.message = `Event invitation has been accepted!`;
                                services.SUCCESS_MODAL(true);
                                getEventListing_Id(1);
                                getInvitedEventListing_Id(1);
                            });
                        }
                    })
            }

            $scope.getEventItems = function (event) {
                $scope.is_event_item_show = true;
                var data = {
                    supplier_id: $stateParams.supplierId,
                    event_id: event ? event.id : $scope.eventIdForAssignItems
                }
                $scope.eventIdForAssignItems = event ? event.id : $scope.eventIdForAssignItems
                var api = API.EVENT_ITEMS_LISTING;

                $scope.eventItemList = [];

                $scope.menu_name_obj = {
                    name: "",
                    id: ""
                }

                services.POST_DATA(data, api, function (response) {
                    $scope.eventItemList = response.data.products || [];
                    if (response.data && response.data.name) {
                        $scope.menu_name_obj.name = response.data.name || "";
                        $scope.menu_name_obj.id = response.data.id;
                    }
                    $scope.dataLoaded = true;
                });
            }

            $scope.removeMenuItem = function (item) {
                services.CONFIRM('you want to remove this item?',
                    function (isConfirm) {
                        if (isConfirm) {
                            var data = {
                                event_food_id: $scope.menu_name_obj.id,
                                event_id: $scope.eventIdForAssignItems,
                                product_id: item.id
                            }

                            var api = API.REMOVE_EVENT_ITEMS;

                            services.POST_DATA(data, api, function (response) {
                                $scope.getEventItems();
                                $scope.dataLoaded = true;
                                $scope.message = `event menu list has been updated!`;
                                services.SUCCESS_MODAL(true);
                            });
                        }
                    })
            }

            $scope.goToAssignItems = function () {
                let params = {
                    id: $scope.supplier_id,
                    is_event: 1,
                    eventId: $scope.eventIdForAssignItems
                };
                $state.go('events.events-item-assignment', params);
            }

        }]);
