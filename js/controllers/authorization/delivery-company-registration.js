Royo.controller('DeliveryCompanyRegistrationCtrl', ['$scope', 'services', 'factories', 'constants', '$rootScope', 'API', 'pagerService',
    function ($scope, services, factories, constants, $rootScope, API, pagerService) {

        $scope.view = 0;
        $scope.dataLoaded = false;
        $scope.categories = [];
        $scope.subCategories = [];
        $scope.detSubCategories = [];
        $scope.deliveryCompany = {
            name: '',
            email: '',
            first_name: '',
            last_name: '',
            designation: '',
            mobile: '',
            address: '',
            latitude: 0,
            longitude: 0,
            license_number: '',
            coverage_cities: '',
            more_information: '',
            booking_type: '',
            delivery_boys_count: '',
            no_of_motorbike_controlled_temp: '',
            no_of_motorbike_non_controlled_temp: '',
            no_of_cars: '',
            no_of_vans_controlled_temp: '',
            no_of_vans_non_controlled_temp: '',
        };
        
        // preferred_language
        // type_of_deliveries_offered

        $scope.message = '';
        $scope.mark_all = false;
        $scope.mark_all_sub = false;
        $scope.mark_all_det = false;
        $scope.invalid_phone_no = false;

        $scope.files = [];

        $scope.skip = 0;
        $scope.limit = 20;
        $scope.search = '';
        $scope.count = 0;

        $scope.License_url= null;
        $scope.License_url_toView = '';

        $scope.is_tnc_checked = false;

        var initialize = function () {
            var input = document.querySelector("#supp_phone");
            if (!input) return;
            $scope.iti = window.intlTelInput(input);

            var input = document.getElementById('addressSearchTextField');
            var autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.addListener('place_changed', function () {
                var place = autocomplete.getPlace();
                $scope.deliveryCompany.latitude = place.geometry.location.lat();
                $scope.deliveryCompany.longitude = place.geometry.location.lng();
                $scope.deliveryCompany.address = place.formatted_address;
            });
        }

        var initUpload = function () {
            var upload = document.getElementById('upload');
            function onFile() {
                var me = this;
                let reader = new FileReader();
                reader.readAsDataURL(upload.files[0]);
                reader.onload = function (e) {
                    $scope.$apply(function () {
                        let fileName = upload.files[0].name.replace(/.[^/.]+$/, '');
                        let isFileExist = !!$scope.files.find(file => file.name == fileName);
                        if (isFileExist) return;
                        $scope.files.push(
                            {
                                id: $scope.files.length,
                                name: fileName,
                                url: e.target.result,
                                path: upload.files[0]
                            }
                        );
                    });

                }
            }

            upload.addEventListener('dragenter', function (e) {
                upload.parentNode.className = 'area dragging';
            }, false);

            upload.addEventListener('dragleave', function (e) {
                upload.parentNode.className = 'area';
            }, false);

            upload.addEventListener('dragexit', function (e) {
                onFile();
            }, false);

            upload.addEventListener('change', function (e) {
                onFile();
            }, false);

        }

        $scope.removeFile = function (fileId) {
            $scope.files = $scope.files.filter(file => file.id != fileId);
        }


        $scope.file_to_upload_for_doc = function (File, type) {
            var file = File[0];
            if (constants.IMAGE_TYPE.includes(file.type)) {
                if ((file.size / Math.pow(1024, 2)) <= 7) {
                    $scope.image_file = File[0];
                    var Obj = {};
                    Obj.image = File[0];
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        $scope.$apply(function () {
                            $scope.uploadImage(File[0], function (err, imageUrl) {
                                if(type == 1) {
                                    $scope.License_url_toView = imageUrl;
                                } else {
                                    $scope.Letter_of_intent_url_toView = imageUrl
                                }
                            })
                            if(type == 1) {
                                $scope.License_url = File[0];
                            } else {
                                $scope.Letter_of_intent_url = File[0];
                            }
                        });
                    }
                } else {
                    factories.invalidDataPop("Image size must be less than 7mb");
                }
            } else {
                factories.invalidDataPop("Invalid File Type");
            }
        };

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

        $scope.changeSelfPickup = function (is_self_pickup) {
            $scope.deliveryCompany.self_pickup = parseInt(is_self_pickup);
        }

        $scope.registerSupplier = function (addSupplierForm) {

            if (addSupplierForm.$submitted && addSupplierForm.$invalid) return;

            if ($scope.iti.isValidNumber()) {
                $scope.invalid_phone_no = false;
            } else {
                $scope.invalid_phone_no = true;
                return;
            }

            if (!$scope.deliveryCompany.latitude || !$scope.deliveryCompany.longitude) {
                factories.invalidDataPop("Please choose a valid address");
                return;
            }

            if (!$scope.License_url_toView) {
                factories.invalidDataPop("Please upload license image");
                return;
            }

            if (!$scope.is_tnc_checked) {
                factories.invalidDataPop("Please accept out terms and conditions!");
                return;
            }

            var param_data = {};

            let phone_data = $scope.iti.getSelectedCountryData();
            let iso, country_code;

            if (!!phone_data) {
                iso = phone_data['iso2'];
                country_code = phone_data['dialCode'];
            }

            // param_data.documents = [];
            // if ($scope.files && $scope.files.length) {
            //     $scope.files.forEach(function (file) {
            //         param_data.documents.push(file.path);
            //     })
            // }

            param_data = {
                name: $scope.deliveryCompany.name,
                address: $scope.deliveryCompany.address,
                phone_number: $scope.deliveryCompany.mobile,
                country_code,
                iso,
                email: $scope.deliveryCompany.email,
                latitude: $scope.deliveryCompany.latitude,
                longitude: $scope.deliveryCompany.longitude,
                first_name: $scope.deliveryCompany.first_name,
                last_name: $scope.deliveryCompany.last_name,
                designation: $scope.deliveryCompany.designation,
                license_number: $scope.deliveryCompany.license_number,
                coverage_cities: $scope.deliveryCompany.coverage_cities,
                more_information: $scope.deliveryCompany.more_information,
                booking_type: $scope.deliveryCompany.booking_type,
                license_image: $scope.License_url_toView,
                // delivery_boys_count: $scope.deliveryCompany.delivery_boys_count,
                no_of_motorbike_controlled_temp: $scope.deliveryCompany.no_of_motorbike_controlled_temp,
                no_of_motorbike_non_controlled_temp: $scope.deliveryCompany.no_of_motorbike_non_controlled_temp,
                no_of_cars: $scope.deliveryCompany.no_of_cars,
                no_of_vans_controlled_temp: $scope.deliveryCompany.no_of_vans_controlled_temp,
                no_of_vans_non_controlled_temp: $scope.deliveryCompany.no_of_vans_non_controlled_temp 
            }

            if ($scope.Letter_of_intent_url_toView) {
                param_data['letter_of_intent'] = $scope.Letter_of_intent_url_toView;
            }
            // image_url:Joi.string().optional().allow(),
            // logo_url:Joi.string().optional().allow(""),

            services.POST_DATA(param_data, API.REGISTER_DELIVERY_COMPANY, function (response) {
                console.log(response);

                $scope.message = `${factories.localisation().delivery_company} Successfully Registered`;
                services.SUCCESS_MODAL(true);
                $scope.view = 1;
            });
        }

        $scope.$on('settingsLoaded', load);
        function load($event, data) {
            console.log(data);
            if (data) {

                $scope.localisation = factories.localisation();
                console.log('$scope.localisation', $scope.localisation);
                $scope.$apply();
                $scope.app_type = factories.getSettings().screenFlow[0].app_type;
                var time = setInterval(() => {
                    if ($rootScope.show_login) {
                        initialize();
                        // initUpload();
                        clearInterval(time);
                    }
                }, 500);
            }
        }

        $scope.acceptTnC = function (event) {
            console.log('event', event);

            if (event.target.checked) {
                $scope.is_tnc_checked = true;
                console.log('checked');

            }
            else {
                $scope.is_tnc_checked = false;
            }
        }


    }]);
