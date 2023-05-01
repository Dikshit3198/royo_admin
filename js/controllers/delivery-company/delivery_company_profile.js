Royo.controller('DeliveryCompanyProfileCtrl', ['$scope', 'services', 'factories', 'constants', '$rootScope', 'API', 'pagerService',
  function ($scope, services, factories, constants, $rootScope, API, pagerService) {

    $scope.companyData = [];
    $scope.is_add = false;
    $scope.search = '';
    $scope.count = 0;
    $scope.currentPage = 1;
    $scope.skip = 0;
    $scope.limit = 20;
    $scope.order_by = 0;
    $scope.is_desc = 0;
    $scope.dataLoaded = false;
    $scope.is_active = 1;
    $scope.deliveryCompany = {
      name: '',
      email: '',
      mobile: '',
      address: '',
      latitude: 0,
      longitude: 0,
      license_number: ''
    };

    $scope.License_url_toView = '';
    $scope.Letter_of_intent_url_toView = '';

    $scope.message = '';
    $scope.invalid_phone_no = false;

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
                if (type == 1) {
                  $scope.License_url_toView = imageUrl;
                } else {
                  $scope.Letter_of_intent_url_toView = imageUrl
                }
              })
              if (type == 1) {
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

    var initialize = function () {
      var input = document.querySelector("#supp_phone");
      $scope.iti = window.intlTelInput(input, {
        preferredCountries: [factories.getSettings().adminDetails[0].iso]
      });
      var input = document.getElementById('addressSearchTextField');
      var autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        $scope.deliveryCompany.latitude = place.geometry.location.lat();
        $scope.deliveryCompany.longitude = place.geometry.location.lng();
        $scope.deliveryCompany.address = place.formatted_address;
      });
    }

    $scope.checkFlow = function (types) {
      return $rootScope.app_type > 10 && $rootScope.flow_data.length && types.length ? $rootScope.flow_data.some(flow => types.includes(flow.flow_type)) : false;
    }

    $scope.changeView = function (val) {
      $scope.is_add = val;
      if (val) {
        $scope.deliveryCompany = {
          name: '',
          email: '',
          mobile: '',
          address: '',
          latitude: 0,
          longitude: 0,
          commission: '',
          pickupCommision: '',
          license_number: '',
          base_delivery_charges: ''
        };

        setTimeout(() => {
          initialize();
        }, 500);
      }
    }

    // image_url:Joi.string().optional().allow(),
    // logo_url:Joi.string().optional().allow(""),
    // password:Joi.string().required(),
    // base_delivery_charges:Joi.number().optional().allow(0)

    $scope.summernote_config = {
      height: 200,
      toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'italic', 'underline', 'clear']],
        ['fontname', ['fontname']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['height', ['height']],
        ['table', ['table']],
      ]
    }

    //Call Get Registered Company Data Service
    $scope.getCompanyData = function (page) {
      $scope.dataLoaded = false;
      $scope.companyData = [];
      let params = {
        limit: $scope.limit,
        skip: $scope.skip
      }
      params.search = ($scope.search).trim() ? $scope.search : '';

      if (!!localStorage.getItem('data_country')) {
        let country_data = localStorage.getItem('data_country').split(',');
        params.country_code = country_data[0];
        params.country_code_type = country_data[1];
      }
      services.GET_DATA(params, API.LIST_DELIVERY_COMPANY, function (response) {
        if (!!response && [4, 200].includes(response.status)) {
          $scope.companyData = response.data.list;
          $scope.count = response.data.count;
          $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
          $scope.dataLoaded = true;
        }
      });
    };
    $scope.getCompanyData(1);

    $scope.changeTab = function (status) {
      $scope.is_active = status;
      $scope.skip = 0;
      $scope.order_by = 0;
      $scope.is_desc = 0;
      $scope.getCompanyData(1);
    }

    $scope.changeBranchType = function (branch_type) {
      $scope.deliveryCompany.is_multibranch = branch_type;
    }

    $scope.registerCompany = function (addDeliveryCompanyForm) {

      if (addDeliveryCompanyForm.$submitted && addDeliveryCompanyForm.$invalid) return;

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

      var param_data = {};
      // param_data.commission = $scope.deliveryCompany.commission ? $scope.deliveryCompany.commission : 0;
      // param_data.pickupCommision = $scope.deliveryCompany.pickupCommision ? $scope.deliveryCompany.pickupCommision : 0;
      // param_data.license_number = $scope.deliveryCompany.license_number;

      let phone_data = $scope.iti.getSelectedCountryData();
      let iso, country_code;

      if (!!phone_data) {
        iso = phone_data['iso2'];
        country_code = phone_data['dialCode'];
      }


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
        no_of_motorbike_controlled_temp: $scope.deliveryCompany.no_of_motorbike_controlled_temp,
        no_of_motorbike_non_controlled_temp: $scope.deliveryCompany.no_of_motorbike_non_controlled_temp,
        no_of_cars: $scope.deliveryCompany.no_of_cars,
        no_of_vans_controlled_temp: $scope.deliveryCompany.no_of_vans_controlled_temp,
        no_of_vans_non_controlled_temp: $scope.deliveryCompany.no_of_vans_non_controlled_temp 
      }

      if ($scope.Letter_of_intent_url_toView) {
        param_data['letter_of_intent'] = $scope.Letter_of_intent_url_toView;
      }

      services.POST_DATA(param_data, API.CREATE_DELIVERY_COMPANY, function (response) {
        $scope.message = `${factories.localisation().delivery_company} Successfully Registered`;
        services.SUCCESS_MODAL(true);
        $scope.getCompanyData(1);
        $scope.is_blocked = false;
        $scope.is_add = false;
      });
    }

    $scope.activateOrVerifyCompany = function (Id, status, flag) {
      if (typeof Id == "number") {
        Id = Id.toString();
      }
      var param_data = {};
      param_data.id = Id;
      if (flag == 1) {
        param_data.is_block = +status;
      } else {
        param_data.is_verified = +status;
      }

      services.POST_DATA(param_data, flag == 1 ? API.BLOCK_DELIVERY_COMPANY : API.VERIFY_DELIVERY_COMPANY, function (response) {
        $scope.skip = 0;
        $scope.getCompanyData(1);
        $scope.message = `${factories.localisation().delivery_company} status has been updated`;
        services.SUCCESS_MODAL(true);
      });
    }

    $scope.setPage = function (page) {
      $scope.currentPage = page;
      $scope.skip = $scope.limit * (page - 1);
      $scope.getCompanyData(page);
    }


    $scope.searchCompany = function (keyEvent) {
      if (keyEvent.which === 13) {
        $scope.search = keyEvent.target.value;
        $scope.skip = 0;
        $scope.getCompanyData(1);
      }
    }

    $scope.refresh = function () {
      $scope.skip = 0;
      $scope.order_by = 0;
      $scope.is_desc = 0;
      $scope.getCompanyData(1);
    }

    // $scope.deleteSupplier = function (Id) {
    //   services.deletePop($scope.dumped_suppliers, Id, function (data) {
    //     var param_data = {};
    //     param_data.id = Id;
    //     param_data.section_id = 22;
    //     services.deleteDumpSupplier($scope, param_data, function (data) {
    //       factories.spliceOnDelete($scope.dumped_suppliers, Id);
    //       swal("Deleted!", "", "success");
    //     });
    //   });
    // };

  }]);