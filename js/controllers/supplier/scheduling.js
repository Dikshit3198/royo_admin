
Royo.controller('SchedulingCtrl', ['$scope', 'services', '$stateParams', 'API', 'factories', '$translate','pagerService', 'constants', '$rootScope',
    function ($scope, services, $stateParams, API, factories, $translate, pagerService, constants, $rootScope) {

        $scope.tabStatus = 1;
        $rootScope.tab = $stateParams.tab;
        $scope.supplierId = $stateParams.id;
        $scope.branchId = $stateParams.b_id;
        $scope.is_dine_in = $stateParams.dine_in;

        $rootScope.$broadcast('supplier_id', { supplier_id: $stateParams.id, tab: $stateParams.tab });

        $scope.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var today = new Date();
        var year = today.getFullYear();
        var month = today.getMonth();
        var date = today.getDate();
        $scope.message = '';
        $scope.slotArr = [];
        $scope.selectedDate = '';
        $scope.multiple = false;
        $scope.selectedSlots = [];
        $scope.selectedDays = {};
        $scope.slot_mode = 0;
        $scope.supplier_location_id = 0;
        $scope.slot_interval = { time: '' };
        // $scope.show_slot_interval = true;
        $scope.geofence_slot_view = 0;

        $scope.slotDuration = factories.getSettings().bookingFlow[0].interval;
        $scope.error = false;

        $scope.daysArr = [];
        var week = [' ', ' ', ' ', ' ', ' ', ' ', ' '];


        $scope.is_hide_delivery = false;
        $scope.is_hide_pickup = false;
        $scope.is_hide_dinin = false;


        $scope.refreshAva = function () {
            week = [' ', ' ', ' ', ' ', ' ', ' ', ' '];
            $scope.daysArr = [];
            getSlots();
        }



        $scope.setOrderTypeClientWise = function () {
            if ($rootScope.dynamic_order_type_client_wise) {
                var isTabChange = false;
                if ($rootScope.dynamic_order_type_client_wise_delivery != 1) {
                    $scope.is_hide_delivery = true;
                }
                else {
                    isTabChange = true;
                    $scope.changeTab(1);
                }
                if ($rootScope.dynamic_order_type_client_wise_pickup != 1) {
                    $scope.is_hide_pickup = true;
                }
                else {
                    if (!isTabChange) {
                        $scope.changeTab(2);
                    }
                }
                if ($rootScope.dynamic_order_type_client_wise_dinein != 1) {
                    $scope.is_hide_dinin = true;
                }
                else {
                    if (!isTabChange) {
                        $scope.changeTab(3);
                    }
                }
            }
        }

        setTimeout(() => {
            $scope.setOrderTypeClientWise();
        }, 5000);




        $scope.changeTab = function (tab) {
            $scope.tabStatus = tab;
            if (tab == 2) {
                $scope.supplier_location_id = 0;
            }
            $scope.refreshAva();
        }

        var getSlots = function () {
            let param_data = {
                supplier_id: $scope.supplierId,
                date_order_type: $scope.tabStatus,
                supplier_location_id: $scope.supplier_location_id
            };

            services.GET_DATA(param_data, API.GET_SCHEDULING_SLOTS(), function (response) {
                $scope.slot_interval.time = !!response.data && response.data.supplier_slots_interval ? response.data.supplier_slots_interval : '';
                $scope.availability = response.data;
                slotData();
            });
        }
        getSlots();

        var slotData = function () {
            for (let i = 0; i < 30; i++) {
                let day = new Date(year, month, date + i);
                if (day.getDay() < 6) {
                    dayData(day);
                    if (i === 29) {
                        $scope.daysArr.push(week);
                    }
                } else {
                    dayData(day);
                    $scope.daysArr.push(week);
                    week = [' ', ' ', ' ', ' ', ' ', ' ', ' '];
                }
            }
        }

        var dayData = function (day) {
            week[day.getDay()] = {
                date: day,
                day: $scope.days[day.getDay()],
                slots: []
            };
            if ($scope.availability) {
                $scope.availability.supplier_timings.forEach(time => {
                    $scope.availability.supplier_available_dates.forEach(date => {
                        if (moment(date.from_date).format('YYYY-MM-DD') === moment(day).format('YYYY-MM-DD')) {
                            if (date.id === time.date_id) {
                                week[day.getDay()].slots.push(time);
                            }
                        }
                    });
                    if ((day.getDay() === time.day_id) && $scope.availability.weeks_data[day.getDay()].status) {
                        week[day.getDay()].slots.push(time);
                    }
                console.log('qqqqq', week);
                });
                console.log('wwwwww', week);
                week[day.getDay()].slots = _.uniq(week[day.getDay()].slots.slice(), false, slot => { return slot.start_time && slot.end_time });
            }
        }

        var setSlots = function () {
            $scope.slotArr = [];
            let day = 0;
            while (day <= 6) {
                $scope.formData.weeks_data.push({
                    day_id: day,
                    status: 0
                });
                day++;
            }

            if ($scope.availability) {
                $scope.availability.weeks_data.forEach(day => {
                    // if (day.status) {
                    //     $scope.selectedDays[day.day_id] = true;
                    //     $scope.formData.weeks_data[day.day_id].status = 1;
                    // }
                    $scope.formData.weeks_data[day.day_id].id = day.id;
                });
            }

            if ($scope.selectedDate.slots.length) {
                $scope.selectedDate.slots.forEach(slot => {
                    let start = new Date(moment($scope.selectedDate.date).format('YYYY-MM-DD') + ' ' + slot.start_time);
                    let end = new Date(moment($scope.selectedDate.date).format('YYYY-MM-DD') + ' ' + slot.end_time);
                    $scope.slotArr.push({
                        start_time: new Date(start.getFullYear(), start.getMonth(), start.getMonth(), start.getHours(), start.getMinutes(), start.getSeconds()),
                        end_time: new Date(end.getFullYear(), end.getMonth(), end.getMonth(), end.getHours(), end.getMinutes(), end.getSeconds()),
                        price: slot.price,
                        quantity: slot.quantity,
                        id: slot.id,
                    });
                });
            } else {
                $scope.slotArr = [{
                    start_time: new Date(year, month, date, 00, 00, 0),
                    end_time: new Date(year, month, date, 00, 00 + $scope.slotDuration, 0),
                }];
            }
        }

        $scope.bookSlot = function (slotData) {
            $scope.formData = {
                offset: moment().format('Z'),
                agent_token: $scope.agent_token,
                weeks_data: [],
                supplier_timings: [],
                supplier_available_dates: [{
                    from_date: '',
                    to_date: '',
                    status: ''
                }],
                sectionId: 22,
                supplier_id: $scope.supplierId,
                date_order_type: $scope.tabStatus,
                supplier_location_id: $scope.supplier_location_id
            };
            if ($scope.slot_mode == 0 && $scope.slot_interval.time) {
                $scope.formData.supplier_slots_interval = $scope.slot_interval.time;
            }
            $scope.selectedDate = slotData;
            setSlots();
            $("#agent_slot").modal('show');
        };

        var checkSlots = function () {
            $scope.error = false;
            let i = 0;
            for (let slot of $scope.slotArr) {
                if (getTime(slot.start_time).isSame(getTime(slot.end_time), 'minutes')) {
                    $scope.error = true;
                    return;
                } else if (getTime(slot.start_time).isAfter(getTime(slot.end_time), 'minutes')) {
                    $scope.error = true;
                    return;
                } else if ((i + 1 < $scope.slotArr.length) && (getTime(slot.end_time).isAfter(getTime($scope.slotArr[i + 1].start_time), 'minutes'))) {
                    $scope.error = true;
                    return;
                } else {
                    $scope.slotArr.forEach(s => {
                        if (getTime(s.start_time).isAfter(getTime(slot.start_time)) && getTime(s.end_time).isBefore(getTime(slot.end_time))) {
                            $scope.error = true;
                            return;
                        }
                    });
                }
                i++;
            }
        }

        var getTime = function (dateTime) {
            dateTime = moment(dateTime);
            return moment({ h: dateTime.hours(), m: dateTime.minutes() });
        }

        $scope.addSlot = function (childIndex) {
            if ($scope.slotArr.length) {
                let previousTime = new Date($scope.slotArr[$scope.slotArr.length - 1].end_time);
                $scope.slotArr.push({
                    start_time: new Date(year, month, date, previousTime.getHours(), previousTime.getMinutes(), previousTime.getSeconds()),
                    end_time: new Date(year, month, date, previousTime.getHours(), previousTime.getMinutes() + $scope.slotDuration, previousTime.getSeconds()),
                });
            } else {
                $scope.slotArr = [{
                    start_time: new Date(year, month, date, 00, 00, 0),
                    end_time: new Date(year, month, date, 00, 00 + $scope.slotDuration, 0),
                }];
            }
        };

        $scope.deleteSlot = function (childIndex) {
            if (!!$scope.slotArr[childIndex].id) {
                let param_data = {};
                param_data.sectionId = 63;
                param_data.agent_token = $scope.agent_token;
                param_data.slotId = $scope.slotArr[childIndex].id;

                services.POST_DATA(param_data, API.DELETE_SCHEDULING_SLOTS(), function (response) {
                    $scope.slotArr.splice(childIndex, 1);
                    setTimeout(() => {
                        afterAvaSet();
                    }, 2000);
                    $scope.error = $scope.slotArr.some(slot => {
                        if ((slot.end_time < slot.start_time) || (($scope.slotArr.indexOf(slot) + 1 < $scope.slotArr.length) && slot.end_time > $scope.slotArr[$scope.slotArr.indexOf(slot) + 1].start_time)) {
                            return true;
                        } else return false;
                    });
                });
            } else {
                $scope.slotArr.splice(childIndex, 1);
                $scope.error = $scope.slotArr.some(slot => {
                    if ((slot.end_time < slot.start_time) || (($scope.slotArr.indexOf(slot) + 1 < $scope.slotArr.length) && slot.end_time > $scope.slotArr[$scope.slotArr.indexOf(slot) + 1].start_time)) {
                        return true;
                    } else return false;
                });
            }
        }

        $scope.applyCurrent = function () {
            checkSlots();
            $scope.is_days = false;
            $scope.formData.supplier_available_dates[0].from_date = moment($scope.selectedDate.date).format('YYYY-MM-DD');
            $scope.formData.supplier_available_dates[0].to_date = moment($scope.selectedDate.date).format('YYYY-MM-DD');
            $scope.formData.supplier_available_dates[0].status = '1';
            if ($scope.availability) {
                $scope.formData.weeks_data = [];
                $scope.availability.supplier_available_dates.find(date => {
                    if (date.from_date === $scope.formData.supplier_available_dates[0].from_date) {
                        $scope.formData.supplier_available_dates[0].id = date.id;
                    }
                });
            }
            setAvailability(false);
        }

        $scope.applyAll = function () {
            checkSlots();
            $scope.is_days = true;
            $scope.formData.supplier_available_dates = [];
            Object.keys($scope.selectedDays).forEach(day => {
                if ($scope.selectedDays[day]) {
                    $scope.formData.weeks_data[day].status = 1;
                }
            });
            setAvailability(false);
        }

        $scope.applyToDay = function (day) {
            checkSlots();
            $scope.is_days = true;
            $scope.formData.supplier_available_dates = [];
            $scope.formData.weeks_data[$scope.days.indexOf(day)].status = 1
            setAvailability(true);
        }
        // $scope.applyToDay = function (day) {
        //     checkSlots();
        //     var d = new Date($scope.selectedDate.date);
        //     var getTotal = daysInMonth(d.getMonth(), d.getFullYear());
        //     $scope.is_days = true;
        //     $scope.formData.supplier_available_dates = [];
        //     for (var i = 1; i <= getTotal; i++) {
        //       let newDate = new Date(d.getFullYear(), d.getMonth(), i);
        //       let currentDate = $scope.availability.supplier_available_dates.find((x) => new Date(x.from_date).getDate() == newDate.getDate());
        //       if (newDate.getDay() == $scope.days.indexOf(day) && currentDate) {
        //         $scope.formData.supplier_available_dates.push({
        //           from_date: moment(currentDate.from_date).format("YYYY-MM-DD"),
        //           to_date: moment(currentDate.to_date).format("YYYY-MM-DD"),
        //           status: currentDate.status,
        //           id: currentDate.id
        //         });
        //       }
        //     }
        //     $scope.formData.weeks_data[$scope.days.indexOf(day)].status = 1;
        //     setAvailability(true);
        //   };
        //   function daysInMonth(month, year) {
        //     return new Date(year, month, 0).getDate();
        //   }

        var setAvailability = function (repeating_day) {
            if ($scope.error) {
                factories.invalidDataPop($translate.instant("Slot Intervals are invalid, please reselect"));
                return;
            }
            $scope.formData.supplier_timings = [];
            $scope.slotArr.forEach(slot => {
                let obj = {
                    start_time: moment(slot.start_time).format('HH:mm:ss'),
                    end_time: moment(slot.end_time).format('HH:mm:ss'),
                    price: slot.price,
                    quantity: slot.quantity
                }
                if (slot['id'] && !repeating_day) {
                    obj['id'] = slot['id'];
                }
                if ($rootScope.enable_dayId_in_supplier_slots_sakado == 1 && !$scope.is_days  ) {
                    if (!!$scope.selectedDate.slots.length && $scope.selectedDate.slots[0].day_id != 8) {
                        obj['day_id'] = $scope.selectedDate.slots[0].day_id;
                    } else {
                        var x = moment($scope.selectedDate.date).utc().day();
                        obj['day_id'] = x;
                        console.log('dddddd', obj['day_id']);
                    }
                }
                
                $scope.formData.supplier_timings.push(obj);
            });

            if ($scope.is_days) {
                let arr = [];
                $scope.formData.weeks_data.forEach(day => {
                    if (day['status']) {
                        $scope.formData.supplier_timings.forEach(slot => {
                            let s = { ...slot };
                            s['day_id'] = day['day_id']
                            arr.push(s);
                        });
                    }
                    if ($scope.availability && $scope.availability.weeks_data[day['day_id']].status) {
                        day['status'] = 1
                    }
                });
                $scope.formData.supplier_timings = arr;
            }

            if ($scope.availability) {
                services.POST_DATA($scope.formData, API.UPDATE_SCHEDULING_SLOTS(), function (response) {
                    afterAvaSet();
                });
            } else {
                services.POST_DATA($scope.formData, API.SET_SCHEDULING_SLOTS(), function (response) {
                    afterAvaSet();
                });
            }
        }

        var afterAvaSet = function () {
            $scope.refreshAva();
            $scope.message = `${$translate.instant('Availability has been')} ${$scope.availability ? $translate.instant('updated') : $translate.instant('added')}`;
            $("#agent_slot").modal('hide');
            services.SUCCESS_MODAL(true);
        }

        $scope.switch = function () {
            $scope.multiple = !$scope.multiple;
        }




        $scope.changeChangeSlotMode = function (slot_mode) {
            $scope.slot_mode = slot_mode;
            $scope.geofence_slot_view = 0;
            if (slot_mode == 1) {
                getGeofenceAreas();
            } else {
                $scope.supplier_location_id = 0;
                $scope.refreshAva();
            }
        }

        $scope.geofenceSlots = function (geo_id) {
            $scope.supplier_location_id = geo_id;
            // $scope.slot_mode = 0;
            $scope.geofence_slot_view = 1;
            $scope.refreshAva();
        }


        //Geofence delivery charge & taxes
        $scope.geofence_areas = [];
        $scope.geofence_coordinates = [];
        $scope.current_geofence_index = -1;

        var getGeofenceAreas = function () {
            services.GET_DATA({ supplier_id: $scope.supplierId }, API.LIST_GEOFENCE_SCHEDULING_SLOTS(), function (response) {
                if (response && response.data.length) {
                    $scope.geofence_areas = response.data;
                }
                $scope.addArea();
            });
        }

        $scope.addArea = function () {
            $scope.geofence_areas.push({
                coordinates: [],
                supplier_id: $scope.supplierId,
                name: ''
            });
        }

        $scope.removeArea = function (index) {
            services.CONFIRM(`You want to delete this area`,
                function (isConfirm) {
                    if (isConfirm) {
                        let params = {
                            id: $scope.geofence_areas[index].id
                        }
                        services.POST_DATA(params, API.DELETE_GEOFENCE_SCHEDULING_SLOTS(), function (response) {
                            $scope.geofence_areas.splice(index, 1);
                            $scope.message = `${$translate.instant('Geofence area removed')}`;
                            services.SUCCESS_MODAL(true);
                        });
                    }
                });
        }

        $scope.initGeofence = function (index) {
            $("#geo").modal('show');
            $scope.current_geofence_index = index;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var map = new google.maps.Map(document.getElementById('geo_map'), {
                        center: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        },
                        zoom: 15
                    });

                    function getPolygonPath(polygon) {
                        let arr = [];
                        for (var i = 0; i < polygon.getPath().getLength(); i++) {
                            let latlng = polygon.getPath().getAt(i);
                            arr.push({
                                x: latlng.lat(),
                                y: latlng.lng()
                            });
                        }
                        $scope.geofence_coordinates = arr;
                        $scope.geofence_coordinates.push(arr[0]);
                    }

                    if ($scope.geofence_areas[$scope.current_geofence_index].id) {
                        $scope.geofence_coordinates = $scope.geofence_areas[$scope.current_geofence_index].coordinates;
                        let polygon_coordinates = $scope.geofence_coordinates.map(latlng => {
                            return {
                                lat: (latlng.x),
                                lng: (latlng.y)
                            }
                        });
                        polygon_coordinates.pop()
                        var myPolygon = new google.maps.Polygon({
                            paths: polygon_coordinates,
                            fillColor: '#2ca6b18c',
                            strokeOpacity: 0.8,
                            fillOpacity: 0.4,
                            strokeWeight: 3,
                            strokeColor: '#4a4a4a',
                            draggable: true,
                            editable: true,
                            zIndex: 1
                        });
                        myPolygon.setMap(map);

                        google.maps.event.addListener(myPolygon, 'dragend', function () {
                            getPolygonPath(myPolygon);
                        });

                        google.maps.event.addListener(myPolygon.getPath(), 'insert_at', function () {
                            getPolygonPath(myPolygon);
                        });
                        google.maps.event.addListener(myPolygon.getPath(), 'set_at', function () {
                            getPolygonPath(myPolygon);
                        });
                    }

                    var selectedShape;

                    function clearSelection() {
                        if (selectedShape) {
                            selectedShape.setEditable(false);
                            selectedShape.setMap(null);
                            selectedShape = null;
                        }
                        if ($scope.geofence_areas[$scope.current_geofence_index].id) {
                            myPolygon.setMap(null);
                        }
                    }

                    function setSelection(shape) {
                        clearSelection();
                        selectedShape = shape;
                        shape.setEditable(true);
                    }

                    var drawingManager = new google.maps.drawing.DrawingManager({
                        drawingMode: $scope.geofence_areas[$scope.current_geofence_index].id ? null : google.maps.drawing.OverlayType.POLYGON,
                        drawingControl: true,
                        drawingControlOptions: {
                            position: google.maps.ControlPosition.TOP_CENTER,
                            drawingModes: [google.maps.drawing.OverlayType.POLYGON]
                        },
                        polygonOptions: {
                            fillColor: '#2ca6b18c',
                            strokeOpacity: 0.8,
                            fillOpacity: 0.4,
                            strokeWeight: 3,
                            strokeColor: '#4a4a4a',
                            clickable: true,
                            draggable: true,
                            editable: true,
                            zIndex: 1
                        }
                    });
                    drawingManager.setMap(map);

                    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
                        var newShape = event.overlay;
                        newShape.type = event.type;

                        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
                            drawingManager.setDrawingMode(null);
                            getPolygonPath(newShape);

                            google.maps.event.addListener(newShape, 'dragend', function () {
                                setSelection(newShape);
                            });

                            setSelection(newShape);
                        }
                    });

                    google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);

                });
            }
        }

        $scope.setGeofence = function () {
            $scope.geofence_areas[$scope.current_geofence_index].coordinates = $scope.geofence_coordinates;
            $("#geo").modal('hide');
        }

        var afterupdate = function () {
            $scope.message = `${$translate.instant('Geofence details updated')}`;
            services.SUCCESS_MODAL(true);
            getGeofenceAreas();
        }

        $scope.setGeofenceData = function (geofenceForm, index) {
            if (geofenceForm.$submitted && geofenceForm.$invalid) return;

            if (!$scope.geofence_areas.length) return;

            if ($scope.geofence_areas[index].id) {
                services.POST_DATA($scope.geofence_areas[index], API.UPDATE_GEOFENCE_SCHEDULING_SLOTS(), function (response) {
                    afterupdate();
                });
            } else {
                services.POST_DATA($scope.geofence_areas[index], API.ADD_GEOFENCE_SCHEDULING_SLOTS(), function (response) {
                    afterupdate();
                });
            }
        }


    }]);