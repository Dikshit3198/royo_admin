Royo.controller('SupplierProfileSetupThreeCtrl', ['$scope', '$rootScope', 'factories', 'services', '$stateParams', 'API', 'constants',
    function ($scope, $rootScope, factories, services, $stateParams, API, constants) {

        $scope.supplier_id = $stateParams.id;
        $scope.branches = [];
        $scope.search = '';
        $scope.branch = {
            name: '',
            email: '',
            phone: '',
            address: '',
            password: '',
            primaryMobile: '',
            logo: ''
        };
        $scope.logo = '';
        $scope.is_edit = false;
        $scope.add_branch = false;
        $scope.branch_id = '';
        $scope.delivery_type = 1;
        $scope.supplier_coordinates = {
            lat: '',
            lng: ''
        };
        $scope.supplier_coordinates_geo = {
            lat: '',
            lng: ''
        };
        $scope.delivery_radius = 0;
        $scope.delivery_radius_geo = 0;
        $scope.message = '';
        $scope.address = '';
        $scope.dataLoaded = false;
        $scope.geo_fence_set = false;
        $scope.is_geofence = false;
        $scope.phoneData = {
            country_code: '',
            iso: ''
        }
        var initialize = function () {
            var input = document.querySelector("#phone");
            $scope.iti = window.intlTelInput(input, {
                preferredCountries: [factories.getSettings().adminDetails[0].iso]
            });

            if ($scope.phoneData.iso && $scope.is_edit) {
                $scope.iti.setCountry($scope.phoneData.iso);
            } else {
                $scope.iti.setCountry(factories.getSettings().adminDetails[0].iso);
            }

            var input = document.getElementById('searchTextFieldBranch');
            var autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.addListener('place_changed', function () {
                var place = autocomplete.getPlace();
                $scope.supplier_coordinates = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                }
                $scope.branch.address = place.formatted_address;
            });
        }

        $scope.changeview = function (val) {
            $scope.add_branch = val;
            $scope.is_edit = false;
            $scope.branch_id = '';
            if (val) {
                setTimeout(() => {
                    document.getElementById('searchTextFieldBranch').value = "";
                    document.getElementById('branch_email').value = "";
                    document.getElementById('branch_password').value = "";
                    $scope.branch.password = '';
                    $scope.branch.email = '';
                    initialize();
                }, 500);
            }
        }

        $rootScope.$broadcast('supplier_id', { supplier_id: $scope.supplier_id, tab: $stateParams.tab });

        var getGeoLocation = function (lat, lng) {
            const geocoder = new google.maps.Geocoder();
            const latlng = new google.maps.LatLng(lat, lng);
            const request = { latLng: latlng };
            geocoder.geocode(request, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        $scope.address = results[0].formatted_address;
                    }
                }
            });
        }

        var GeofenceController = function () {
            let div = document.getElementById('geo_map');
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    $scope.is_geofence = true;
                    var map = new google.maps.Map(div, {
                        center: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        },
                        zoom: 15
                    });

                    var all_overlays = [];
                    var selectedShape;
                    var drawingManager = new google.maps.drawing.DrawingManager({
                        drawingMode: null,
                        drawingControl: true,
                        drawingControlOptions: {
                            position: google.maps.ControlPosition.TOP_CENTER,
                            drawingModes: [
                                google.maps.drawing.OverlayType.CIRCLE,
                            ]
                        },
                        circleOptions: {
                            fillColor: '#2ca6b18c',
                            strokeOpacity: 0.8,
                            fillOpacity: 0.2,
                            strokeWeight: 2,
                            strokeColor: '#4a4a4a',
                            clickable: true,
                            draggable: true,
                            editable: true,
                            zIndex: 1
                        }
                    });

                    function clearSelection() {
                        if (selectedShape) {
                            selectedShape.setEditable(false);
                            selectedShape = null;
                        }
                    }

                    function setSelection(shape) {
                        clearSelection();
                        selectedShape = shape;
                        shape.setEditable(true);
                    }

                    function deleteSelectedShape() {
                        if (selectedShape) {
                            selectedShape.setMap(null);
                        }
                    }

                    function CenterControl(controlDiv, map) {

                        // Set CSS for the control border.
                        var controlUI = document.createElement('div');
                        controlUI.style.backgroundColor = '#fff';
                        controlUI.style.border = '2px solid #fff';
                        controlUI.style.borderRadius = '3px';
                        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
                        controlUI.style.cursor = 'pointer';
                        controlUI.style.marginBottom = '22px';
                        controlUI.style.textAlign = 'center';
                        controlUI.title = 'Select to delete the shape';
                        controlDiv.appendChild(controlUI);

                        // Set CSS for the control interior.
                        var controlText = document.createElement('div');
                        controlText.style.color = '2ca6b18c';
                        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
                        controlText.style.fontSize = '16px';
                        controlText.style.lineHeight = '38px';
                        controlText.style.paddingLeft = '5px';
                        controlText.style.paddingRight = '5px';
                        controlText.innerHTML = 'Delete Selected Area';
                        controlUI.appendChild(controlText);

                        // Setup the click event listeners: simply set the map to Chicago.
                        controlUI.addEventListener('click', function () {
                            deleteSelectedShape();
                        });

                    }
                    drawingManager.setMap(map);

                    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
                        all_overlays.push(event);
                        if (event.type == 'circle') {
                            drawingManager.setDrawingMode(null);
                            var newShape = event.overlay;
                            $scope.delivery_radius_geo = Math.round(newShape.getRadius()) / 1000;
                            $scope.supplier_coordinates_geo = {
                                lat: newShape.center.lat(),
                                lng: newShape.center.lng()
                            }
                            getGeoLocation(newShape.center.lat(), newShape.center.lng());

                            google.maps.event.addListener(newShape, 'dragend', function () {
                                $scope.supplier_coordinates_geo = {
                                    lat: newShape.center.lat(),
                                    lng: newShape.center.lng()
                                }
                                getGeoLocation(newShape.center.lat(), newShape.center.lng());
                                setSelection(newShape);
                            });

                            google.maps.event.addListener(newShape, 'radius_changed', function () {
                                $scope.delivery_radius_geo = Math.round(newShape.getRadius()) / 1000;
                                setSelection(newShape);
                            });
                            setSelection(newShape);
                        }
                    });

                    var centerControlDiv = document.createElement('div');
                    var centerControl = new CenterControl(centerControlDiv, map);
                    centerControlDiv.index = 1;
                    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);
                });

            }
        }
        $scope.$on('google_map_loaded', loadeMap);
        function loadeMap($event, data) {
            if (data) {
                setTimeout(() => {
                    GeofenceController();
                }, 250);
            }
        }

        $scope.setGeolocation = function () {
            if (!$scope.delivery_radius_geo || (!$scope.supplier_coordinates_geo.lat && !$scope.supplier_coordinates_geo.lng)) {
                factories.warningDataPop('Please select an area for geofencing');
                return;
            }
            $scope.geo_fence_set = true;
            $scope.delivery_radius = $scope.delivery_radius_geo;
            $scope.supplier_coordinates = $scope.supplier_coordinates_geo;
            $scope.branch.address = $scope.address;
            document.getElementById('close_geofence_branch').click();
        }

        $scope.changeDeliverType = function (type) {
            $scope.geo_fence_set = false;
            $scope.delivery_type = type;
        }

        $scope.changeDeliveryRadius = function (delivery_radius) {
            $scope.delivery_radius = delivery_radius;
        }

        var getSupplierBranch = function () {
            var param_data = {};
            param_data.accessToken = constants.ACCESSTOKEN;
            param_data.sectionId = 22;
            param_data.supplierId = $scope.supplier_id;
            $scope.dataLoaded = false;
            services.POST_DATA(param_data, API.GET_SUPPLIER_BRANCHES(), function (response) {
                let branchData = response.data;
                $scope.branches = branchData.branches;
                $scope.dataLoaded = true;
            });
        }
        getSupplierBranch();

        $scope.changeStatus = function (Id, status) {
            if (typeof Id == "number") {
                Id = Id.toString();
            }
            var param_data = {};
            param_data.accessToken = constants.ACCESSTOKEN;
            param_data.branchId = Id;
            param_data.sectionId = 22;
            param_data.status = +(!status);
            services.POST_DATA(param_data, API.UPDATE_BRANCH_STATUS(), function (response) {
                getSupplierBranch();
                $scope.message = `Branch status has been updated successfully`;
                services.SUCCESS_MODAL(true);
            });
        };

        $scope.deleteBranch = function (Id) {
            services.CONFIRM(`You want to delete this branch`,
                function (isConfirm) {
                    if (isConfirm) {
                        if (typeof Id == "number") {
                            Id = Id.toString();
                        }
                        var param_data = {};
                        param_data.accessToken = constants.ACCESSTOKEN;
                        param_data.branchId = Id;
                        param_data.sectionId = 22;
                        param_data.supplierId = $scope.supplier_id;
                        services.POST_DATA(param_data, API.DELETE_BRANCH(), function (response) {
                            $scope.message = `Branch has been deleted successfully`;
                            services.SUCCESS_MODAL(true);
                            getSupplierBranch();
                        });
                    }
                });
        };

        $scope.file_to_upload_for_image = function (File) {
            var file = File[0];
            if (constants.IMAGE_TYPE.includes(file.type)) {
                if ((file.size / Math.pow(1024, 2)) <= 1) {
                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (event) {
                        $scope.$apply(function () {
                            $scope.logo = event.target.result;;
                            $scope.branch.logo = file;
                        });
                    }
                } else {
                    factories.invalidDataPop("Image size must be less than 1mb");
                }
            } else {
                factories.invalidDataPop("Invalid File Type");
            }
        };

        $scope.createBranch = function (addBranchForm) {

            if (addBranchForm.$submitted && addBranchForm.$invalid) return;

            if ($scope.branch.address && (!$scope.supplier_coordinates.lat || !$scope.supplier_coordinates.lng)) {
                factories.warningDataPop('Not able to locate area');
                return;
            } else if (!$scope.branch.address && (!$scope.supplier_coordinates.lat || !$scope.supplier_coordinates.lng)) {
                factories.warningDataPop('Please select an area');
                return;
            } else if (!$scope.geo_fence_set && $scope.delivery_type == 2) {
                factories.warningDataPop('Please select geofence area');
                return;
            }

            var data = {};
            data.accessToken = constants.ACCESSTOKEN;
            data.sectionId = 22;
            data.supplierId = $scope.supplier_id;
            data.name = `${$scope.branch.name}#${$scope.branch.name}`;
            data.branchName = `${$scope.branch.name}#${$scope.branch.name}`;
            data.languageId = '14#15';
            data.email = $scope.branch.email;
            data.password = $scope.branch.password;
            data.address = `${$scope.branch.address}#${$scope.branch.address}`;
            data.latitude = $scope.supplier_coordinates.lat;
            data.longitude = $scope.supplier_coordinates.lng;
            data.is_area_restricted = $scope.delivery_type == 0 ? 1 : 0;
            data.delivery_radius = $scope.delivery_radius;
            data.delivery_type = $scope.delivery_type;
            if ($scope.branch_id) {
                data.supplierBranchId = $scope.branch_id;
                data.multiLanguageId = '14#15';
            }
            if ($scope.branch.phone) {
                data.phone = $scope.branch.phone;
                let phone_data = $scope.iti.getSelectedCountryData();
                if (!!phone_data) {
                    data['iso'] = phone_data['iso2'];
                    data['country_code'] = phone_data['dialCode'];
                }
            } else {
                data.phone = "0";
            }
            if ($scope.branch.primaryMobile) {
                data.primaryMobile = $scope.branch.primaryMobile;
                data.secondaryMobile = $scope.branch.primaryMobile;
            } else {
                data.primaryMobile = "0";
                data.secondaryMobile = "0";
            }

            if ($rootScope.is_branch_image_optional == 1) data.logo = $scope.branch.logo;

            services.POST_FORM_DATA(data, API.ADD_BRANCH(), function (response) {
                if (response) {
                    getSupplierBranch();
                    $scope.message = `Branch has been ${$scope.is_edit ? 'updated' : 'created'} successfully`;
                    services.SUCCESS_MODAL(true);
                    $scope.add_branch = false;
                }
            });
        }

        $scope.editBranch = function (branch) {
            $scope.is_edit = true;
            $scope.add_branch = true;
            $scope.branch_id = branch.id;
            $scope.branch = {
                name: branch.branch_name,
                email: branch.email,
                phone: branch.phone,
                address: branch.address,
                primaryMobile: branch.mobile_1,
                password: branch.password,
                logo: branch.logo
            };
            $scope.logo = branch.logo;
            $scope.delivery_type = branch.delivery_type;
            $scope.supplier_coordinates.lat = branch.latitude;
            $scope.supplier_coordinates.lng = branch.longitude;
            $scope.is_area_restricted = branch.is_area_restricted;
            $scope.delivery_radius = branch.delivery_radius;
            $scope.phoneData.country_code = branch.country_code;
            $scope.phoneData.iso = branch.iso;
            setTimeout(() => {
                initialize();
            }, 500);
        }

        var geocodePosition = function (pos) {
            geocoder = new google.maps.Geocoder();
            geocoder.geocode({ latLng: pos },
                function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        $scope.branch.address = results[0].formatted_address;
                        $scope.supplier_coordinates.lat = pos.lat();
                        $scope.supplier_coordinates.lng = pos.lng();
                    }
                });
        }

        $scope.selected_location_on_map = null;
        $scope.viewDeliveryRadius = function () {
            $scope.selected_location_on_map = null;

            $("#view_delivery_area").modal('show');

            var map = new google.maps.Map(document.getElementById('delivery_geo_map'), {
                zoom: 11,
                center: $scope.supplier_coordinates,
                mapTypeId: 'terrain'
            });

            var marker = new google.maps.Marker({
                draggable: true,
                map: map,
                position: new google.maps.LatLng($scope.supplier_coordinates.lat, $scope.supplier_coordinates.lng),
                title: 'Some location'
            });

            var circle = new google.maps.Circle({
                map: map,
                radius: $scope.delivery_radius * 1000,
                fillColor: $rootScope.primary_color,
                strokeOpacity: 0.8,
                fillOpacity: 0.3,
                strokeWeight: 2,
                strokeColor: '#4a4a4a'
            });
            circle.bindTo('center', marker, 'position');


            google.maps.event.addListener(marker, 'dragend', function () {
                $scope.selected_location_on_map = marker.getPosition();
                // geocodePosition(marker.getPosition());
            });
        }

        $scope.saveSelectedSupplierLocation = function () {
            if ($scope.selected_location_on_map) {
                geocodePosition($scope.selected_location_on_map);
            }
        }

    }]);
