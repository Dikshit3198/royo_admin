Royo.controller('CountryCodes', ['$scope', '$rootScope', '$stateParams', 'services', 'API', 'pagerService', 'constants', 'factories',
    function ($scope, $rootScope, $stateParams, services, API, pagerService, constants, factories) {
        $scope.countries = [];
        $scope.country_info = {
            country_code: '',
            iso: '',
            flag_image: '',
            country_name: ''
        }
        $scope.skip = 0;
        $scope.limit = 20;
        $scope.search = '';
        $scope.count = 0;
        $scope.selectedCountry = {};
        $scope.dataLoaded = false;
        $scope.is_updating = false;
        $scope.flag_image_to_view = '';
        $scope.loadCountries = function (page) {
            let params = {
                limit: 10,
                skip: 0
            }
            services.GET_DATA(params, API.GET_COUNTRIES, function (response) {
                if (response.message === "Success") {
                    $scope.countries = response.data.list;
                    $scope.count = response.data.count;
                    $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                    $scope.dataLoaded = true;
                }
            });
        }
        $scope.loadCountries(1);
        $scope.addCountries = function (addCountryForm) {
            if (addCountryForm.$invalid) return;
            var addParams = $scope.country_info
            if ($scope.is_updating) {
                addParams.id = $scope.selectedCountry.id;
                updateCountries(addParams);
            }
            else {
                addParams.flag_image = $scope.flag_image_to_view;
                saveCountries(addParams);
            }

        }

        var saveCountries = function (addParams) {
            services.POST_DATA(addParams, API.SET_COUNTRIES, function (response) {
                $scope.message = `Country code has been added!`;
                addCountryForm.$submitted = false;
                onSave();
                services.SUCCESS_MODAL(true);
            });
        }
        var updateCountries = function (addParams) {
            services.POST_DATA(addParams, API.SET_COUNTRIES, function (response) {
                $scope.message = `Country code has been updated!`;
                onSave();
                addCountryForm.$submitted = false;
                services.SUCCESS_MODAL(true);
            });
        }



        $scope.deleteCountryCode = function (countryCode) {
            var data = {
                id: countryCode.id
            }
            services.POST_DATA(data, API.DELETE_COUNTRYCODE, function (response) {
                $scope.loadCountries(1);
                $scope.dataLoaded = true;
                $scope.message = `Country code has been deleted!`;
                services.SUCCESS_MODAL(true);
            });
        }
        $scope.updateCountryCode = function (country) {
            $scope.selectedCountry = country;
            $scope.is_updating = true;
            $scope.country_info = {
                country_code: country.country_code,
                iso: country.iso,
                flag_image: country.flag_image,
                country_name: country.country_name
            }
            $scope.flag_image_to_view = country.flag_image
            $("#addCurrencyRef").modal('show');
        }
        $scope.file_to_upload_for_flag = function (File) {
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
                                $scope.flag_image_to_view = imageUrl;
                            })
                            $scope.country_info.flag_image = File[0];
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
        var onSave = function () {
            $scope.is_updating = false;
            $scope.dataLoaded = true;
            $("#addCurrencyRef").modal('hide');
            $scope.flag_image_to_view = '';
            $scope.loadCountries(1);
            $scope.country_info = {
                country_code: '',
                iso: '',
                flag_image: '',
                country_name: ''
            }
        }
    }]);