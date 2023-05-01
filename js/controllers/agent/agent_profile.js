Royo.controller('AgentProfileCtrl', ['$scope', 'services', 'factories', 'constants', '$state', 'API', 'pagerService', '$rootScope', '$stateParams', '$translate', '$location',
  function ($scope, services, factories, constants, $state, API, pagerService, $rootScope, $stateParams, $translate, $location) {

    $scope.suppliers = [];
    $scope.selected_supplier;
    $scope.is_edit = false;
    $scope.agent_image = '';
    $scope.addAgent = false;
    $scope.outputs = {
      name: '',
      email: '',
      phone_number: '',
      supplier_id: 0,
      supplier_name: '',
      area_id: 0,
      occupation: '',
      experience: 1,
      commission: '',
      sectionId: 63,
      offset: '',
      agent_commission_type: 1,
      employee_id: '',
      id_number: '',
      base_price: '',
      delivery_charge_share: '',
      agent_category_id: '',
      assigned_id: '',
      car_type: '',
      car_model: '',
      plate_number: '',
      car_insurnce_number: 0,
      driver_age: 0,
      id_type: 0,
      license_expr_date: '',
      driver_expr_date: '',
      driver_type: 0,
      birthday: '',
      social_security_number: '',
      account_number: '',
      transit_number: '',
      institution_number: '',

      vehicle_model: '',
      vehicle_make: '',
      vehicle_year: '',
      vehicle_vin: '',
      id_proof: '',
      base_commission_charge_distance: 0,
      commision_per_distance: 0,
      language_id: ''
    };
    $scope.isStripeConnected = 0;
    $scope.agents = [];
    $scope.agent_id = '';
    $scope.search_agent = '';
    $scope.settings = factories.getSettings();
    $scope.dataLoaded = false;
    $scope.message = '';
    $scope.skip = 0;
    $scope.limit = 20;
    $scope.count = 0;
    $scope.is_desc = null;
    $scope.order_by = null;
    $scope.new_pass = '';
    $scope.selected_agent_id = '';
    $scope.selected_supplier_filter;
    $scope.is_admin = 0;
    $scope.invalid_phone_no = false;
    $scope.agent_access = [1, 11].includes($rootScope.app_type) ? 1 : 0;
    $scope.tips = [{ price: '', is_default: 0 }];
    $scope.max_tips = 5;
    $scope.document = { front: '', back: '' };
    $scope.mark_all = false;
    $scope.selected_count = 0;
    $scope.currentPage = $stateParams.page ? parseInt($stateParams.page) : 1;
    $scope.currency = localStorage.getItem('currency') || '$';
    $scope.driver_id_type = 0;


    if ($rootScope.profile == 'SHIPPING') {
      $scope.delivery_company_id = localStorage.getItem('delivery_company_id');
    }

    $scope.vehicleCatList = [];


    $scope.uplaodAgentDOCS_DL = {
      drivingLicenseUrl: '',
      drivingLicenseBackUrl: '',
      vehicleRegisterationUrl: '',
      vehicleRegisterationBackUrl: '',
      drivingLicenseNumber: ''
    }



    $scope.notification_open = false;
    $scope.notification = { msg: '' };
    $scope.checkall = false;
    $scope.selected_users = [];
    $scope.selected_emails = [];
    $scope.message = '';
    $scope.message_type = 1;
    $scope.email = {
      body: '',
      subject: ''
    };
    //$scope.limit = 10;
    $scope.products = [];
    $scope.selected_product = [];
    $scope.agentData = {};



    var datepicker = function () {
      setTimeout(function () {
        var date = new Lightpick({
          field: document.getElementById("datepicker_lincense"),
          startDate: new Date($scope.outputs.license_expr_date),
          onSelect: function (date) {
            if (date) {
              $scope.outputs.license_expr_date = date.format('YYYY-MM-DD');
            }
          }
        });
      }, 800);
    }

    var driver = function () {
      setTimeout(function () {
        var date = new Lightpick({
          field: document.getElementById("datepicker_driver"),
          startDate: new Date($scope.outputs.driver_expr_date),
          onSelect: function (date) {
            if (date) {
              $scope.outputs.driver_expr_date = date.format('YYYY-MM-DD');
            }
          }
        });
      }, 1000);
    }

    var driverDOB = function () {
      setTimeout(function () {
        var date = new Lightpick({
          field: document.getElementById("datepicker_driver_dob"),
          startDate: new Date($scope.outputs.birthday),
          onSelect: function (date) {
            if (date) {
              $scope.outputs.birthday = date.format('DD/MM/YYYY');
            }
          }
        });
      }, 1000);
    }




    $scope.setPage = function (page) {
      $scope.currentPage = page;
      $scope.skip = $scope.limit * (page - 1);
      location.replace(`${window.origin}/#!/profile-setup/agent-profile?page=${$scope.currentPage}`);
      getAgentList(page);
    }

    var clearInput = function () {
      $scope.outputs = {
        name: '',
        email: '',
        phone_number: '',
        supplier_id: '',
        supplier_name: '',
        area_id: 0,
        occupation: '',
        experience: '',
        commission: 0,
        sectionId: 63,
        offset: '',
        agent_commission_type: 1,
        employee_id: '',
        id_number: '',
        abn_num: '',
        base_price: '',
        delivery_charge_share: '',
        agent_category_id: '',
        assigned_id: '',
        car_type: '',
        car_model: '',
        plate_number: '',
        car_insurnce_number: 0,
        driver_age: 0,
        id_type: 0,
        license_expr_date: '',
        driver_expr_date: '',
        birthday: '',
        social_security_number: '',
        account_number: '',
        transit_number: '',
        institution_number: '',

        vehicle_model: '',
        vehicle_make: '',
        vehicle_year: '',
        vehicle_vin: '',
        id_proof: '',
        base_commission_charge_distance: 0,
        commision_per_distance: 0
      };

      $scope.uplaodAgentDOCS_DL = {
        drivingLicenseUrl: '',
        drivingLicenseBackUrl: '',
        vehicleRegisterationUrl: '',
        vehicleRegisterationBackUrl: '',
        drivingLicenseNumber: ''
      }
      $scope.agent_image = '';
      $scope.outputs.file = null;
      $scope.is_edit = false;

    }




    $scope.changeView = function (val) {
      $scope.addAgent = val;
      if (val) {
        $scope.imageArray = [];
        $scope.docArr = [];
        $scope.multipleImage = [];
        $scope.documents = '';
        clearInput();
        setTimeout(() => {
          var input = document.querySelector("#agent_phone");
          $scope.iti = window.intlTelInput(input, {
            preferredCountries: [factories.getSettings().adminDetails[0].iso || factories.getSettings().onboarding_data.iso]
          });
          $scope.iti.setCountry(factories.getSettings().adminDetails[0].iso || factories.getSettings().onboarding_data.iso);
        }, 500);
        if ($scope.suppliers.length) {
          $scope.suppliers.map(sup => {
            sup['checked'] = false;
          });
        }
      }
      driverDOB();
      $scope.is_edit = false;
    }

    $scope.agentEdit = function (agent) {
      $scope.is_edit = true;
      $scope.addAgent = true;
      if ($rootScope.enable_driver_details == 1) {
        datepicker();
        driver();
      }
      $scope.outputs = {
        name: agent.name,
        email: agent.email,
        phone_number: agent.phone_number,
        supplier_id: agent.supplier_id,
        supplier_name: agent.supplier_name,
        area_id: 0,
        occupation: agent.occupation,
        experience: agent.experience,
        commission: agent.commission,
        sectionId: 63,
        offset: '',
        agent_commission_type: agent.agent_commission_type,
        employee_id: agent.employee_id || '',
        id_number: agent.id_number || '',
        base_price: agent.base_price,
        delivery_charge_share: agent.delivery_charge_share,
        agent_category_id: agent.agent_category_id ? agent.agent_category_id.toString() : '',
        assigned_id: agent.assigned_id,
        car_type: agent.vehicle_type,
        car_model: agent.vehicle_model,
        plate_number: agent.vehicle_plate_number,
        car_insurnce_number: agent.vehicle_insurance_number,
        driver_age: agent.age,
        id_type: agent.id_type,
        driver_type: agent.driver_type,
        license_expr_date: agent.license_expiration_date,
        driver_expr_date: agent.driver_expiration,
        birthday: agent.birthday,
        social_security_number: agent.social_security_number,
        account_number: agent.account_number,
        transit_number: agent.transit_number,
        institution_number: agent.institution_number,
        id_proof: agent.id_proof || '',
        base_commission_charge_distance: agent.base_commission_charge_distance,
        commision_per_distance: agent.commision_per_distance
      };

      if ($rootScope.addDocumentsInAgent_DL == 1 || $rootScope.enable_driver_details == 1) {
        $scope.uplaodAgentDOCS_DL.drivingLicenseUrl = agent.drivingLicenseUrl || '';
        $scope.uplaodAgentDOCS_DL.drivingLicenseBackUrl = agent.drivingLicenseBackUrl || '';
        $scope.uplaodAgentDOCS_DL.vehicleRegisterationUrl = agent.vehicleRegisterationUrl || '';
        $scope.uplaodAgentDOCS_DL.vehicleRegisterationBackUrl = agent.vehicleRegisterationBackUrl || '';
        $scope.uplaodAgentDOCS_DL.drivingLicenseNumber = agent.driver_license_number || '';
      }

      if ($rootScope.enable_agent_vehicle_model == 1) {
        $scope.outputs.vehicle_model = agent.vehicle_model;
      }
      if ($rootScope.enable_agent_vehicle_maker == 1) {
        $scope.outputs.vehicle_make = agent.vehicle_make;
      }
      if ($rootScope.enable_agent_vehicle_year == 1) {
        $scope.outputs.vehicle_year = agent.vehicle_year;
      }
      if ($rootScope.enable_agent_vehicle_vin == 1) {
        $scope.outputs.vehicle_vin = agent.vehicle_vin;
      }
      if ($rootScope.enable_distancewise_agent_commission == 1) {
        $scope.outputs.base_commission_charge_distance = agent.base_commission_charge_distance;
        $scope.outputs.commision_per_distance = agent.commision_per_distance;
      }

      if (agent.id_type == 0) {
        $scope.driver_id_type = 0
      } else {
        $scope.driver_id_type = 1
      }

      if ($rootScope.addABNInAgent == 1)
        $scope.outputs['abn_num'] = agent.abn || '';
      $scope.agent_id = agent.id;
      $scope.agent_image = agent.image;
      if (localStorage.getItem('profile_type') == 'ADMIN' && $scope.settings.screenFlow[0].is_single_vendor == 0) {
        $scope.selected_supplier = $scope.suppliers.find(supplier => supplier.id == agent.supplier_id);
      }
      if (agent.supplier_id == 0) {
        $scope.agent_access = 1;
      } else {
        $scope.agent_access = 0;
      }

      if ($scope.agent_access == 0) {
        const supplierIds = typeof agent.supplier_id == 'string' ? (agent.supplier_id.split(',')).map(sup_id => parseInt(sup_id)) : [agent.supplier_id];

        $scope.suppliers.forEach((supplier) => {
          if (supplierIds.includes(supplier.id)) {
            supplier['checked'] = true;
          }
        });
      }

      setTimeout(() => {
        var input = document.querySelector("#agent_phone");
        $scope.iti = window.intlTelInput(input, {
          preferredCountries: [agent.iso]
        });

        if ($scope.is_edit && agent.iso) {
          $scope.iti.setCountry(agent.iso);
        }
      }, 500);

      driverDOB();
    }




    var getAgentList = function (page) {
      let param_data = {};
      param_data.sectionId = 63;
      param_data.offset = $scope.skip;
      param_data.limit = $scope.limit;
      param_data.search = ($scope.search_agent).trim() ? $scope.search_agent : '';
      if ($scope.order_by && $scope.is_desc !== undefined && $scope.is_desc !== null) {
        param_data.order_by = $scope.order_by;
        param_data.is_desc = $scope.is_desc;
      }
      if ($scope.isStripeConnected !== 0) {
        param_data.is_stripe_connected = $scope.isStripeConnected
      }
      if ($rootScope.profile === 'ADMIN') {
        if ($scope.selected_supplier_filter) {
          param_data.supplierId = $scope.selected_supplier_filter.id;
        }
        param_data.is_admin = $scope.is_admin;
      }

      if ($rootScope.profile == 'SHIPPING') {
        param_data.delivery_company_id = $scope.delivery_company_id;
      }

      if (!!localStorage.getItem('data_country')) {
        let country_data = localStorage.getItem('data_country').split(',');
        param_data.country_code = country_data[0];
        param_data.country_code_type = country_data[1];
      }
      $scope.dataLoaded = false;

      services.GET_DATA(param_data, API.GET_AGENT_LIST(), function (response) {
        if (!!response && response.data) {
          $scope.agents = response.data.AgentList;
          $scope.count = response.data.count;
          $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
        }
        $scope.dataLoaded = true;
      });
    }

    if ($stateParams.id && $stateParams.edit == 1) {
      let param_data = {};
      param_data.sectionId = 63;
      param_data.offset = 0;
      param_data.limit = 200;
      services.GET_DATA(param_data, API.GET_AGENT_LIST(), function (response) {
        if (!!response && response.data) {
          let agents = response.data.AgentList;
          let selectedAgent = agents.find(agent => agent.id == $stateParams.id);
          if (!!selectedAgent) {
            $scope.agentEdit(selectedAgent);
          }
        }
      });
    } else {
      $scope.setPage($scope.currentPage);
    }

    var getSuppliers = function () {
      if (!!localStorage.getItem('data_country')) {
        let params = {
          limit: 0,
          offset: 0,
          is_active: 1,
          search: '',
          is_desc: 0,
          order_by: 0
        }
        let country_data = localStorage.getItem('data_country').split(',');
        params.country_code = country_data[0];
        params.country_code_type = country_data[1];
        services.GET_DATA(params, API.SUPPLIER_LIST, function (response) {
          $scope.suppliers = response.data.suppliersList;
        });
      } else {
        services.GET_DATA({}, API.AGENT_SUPPLIER_LISTING, function (response) {
          $scope.suppliers = response.data.suppliersList;
        });
      }
    };
    if ($rootScope.profile === 'ADMIN' && $scope.settings.screenFlow[0].is_single_vendor == 0) {
      getSuppliers();
    }

    $scope.onSupplierChange = function (supplier) {
      $scope.outputs.supplier_id = supplier.id;
      $scope.outputs.supplier_name = supplier.supplier_name || supplier.name;
    }

    $scope.refresh = function () {
      // $scope.skip = 0;
      getAgentList($scope.currentPage);
    }

    $scope.selectSupplier = function (supplier) {
      $scope.selected_count = 0;
      supplier.checked = !supplier.checked;
      $scope.suppliers.forEach(supplier => {
        if (supplier.checked) {
          $scope.selected_count++;
        }
      });
    }
    $scope.filterByStripe = function (value) {
      $scope.isStripeConnected = value;
      getAgentList(1);
    }
    $scope.markAll = function (mark_all) {
      $scope.mark_all = mark_all;
      $scope.selected_count = 0;
      $scope.suppliers.forEach(sup => {
        sup.checked = mark_all;
        if (mark_all) {
          $scope.selected_count++;
        }
      });
    }

    $scope.agentAccess = function (type) {
      $scope.agent_access = type;
      if (type == 1) {
        $scope.selected_supplier = undefined;
        $scope.outputs.supplier_id = 0;
      }
    }

    $scope.IdType = function (type) {
      $scope.outputs.id_type = type
    }

    $scope.driverType = function (type) {
      $scope.outputs.driver_type = type
    }

    //listen for the file selected event
    $scope.$on("fileSelected", function (event, args) {
      $scope.$apply(function () {
        $scope.files.push(args.file);
      });
    });

    /* Get to be uploading file and set it into a variable and read to show it on view */
    $scope.file_to_upload_for_image = function (File) {
      var file = File[0];
      if (constants.IMAGE_TYPE.includes(file.type)) {
        if ((file.size / Math.pow(1024, 2)) <= 3) {
          $scope.FileUploaded = File[0];
          $scope.outputs.file = File[0];
          var imageType = /image.*/;
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function (e) {
            $scope.$apply(function () {
              $scope.agent_image = e.target.result;
            });
          }
          if (!file.type.match(imageType)) {
            factories.invalidDataPop($translate.instant("Invalid file type selected"));
          }
        } else {
          factories.invalidDataPop($translate.instant("Image size must be less than 3mb"));
        }
      } else {
        factories.invalidDataPop($translate.instant("Invalid File Type"));
      }
    };


    $scope.readUrlMultiple = function (event) {
      $scope.imageArray = [];
      if (event) {
        $scope.multipleImage = [];

        if (event.target.files.length > 10) {
          return false;
        }
        $scope.imageArray = event.target.files;
        $scope.readFiles(0);

      }
    }

    $scope.docArr = [];
    $scope.readFiles = function (cur_file) {
      if (cur_file < $scope.imageArray.length) {
        let file = $scope.imageArray[cur_file];
        var imageType = /image.*/;

        if (file.type.match(imageType)) {
          if (constants.IMAGE_TYPE.includes(file.type)) {
            if ((file.size / Math.pow(1024, 2)) <= 3) {
              $scope.docArr.push($scope.imageArray[cur_file]);

              const fr = new FileReader();
              fr.readAsDataURL($scope.imageArray[cur_file]);
              fr.onload = function (e) {
                $scope.$apply(function () {
                  $scope.multipleImage[cur_file] = {
                    url: e.target.result,
                    index: cur_file
                  };
                  $scope.readFiles(cur_file + 1);
                });
              }
            } else {
              factories.invalidDataPop($translate.instant("Image size must be less than 3mb"));
            }
          } else {
            factories.invalidDataPop($translate.instant("Invalid File Type"));
          }
        }

        if (file.name.includes('.pdf')) {
          $scope.docArr.push($scope.imageArray[cur_file]);
        }

        if (file.name.includes('.doc') || file.name.includes('.docx')) {
          $scope.docArr.push($scope.imageArray[cur_file]);
        }
      }
      else {
        $scope.disabled = false;
      }
    }

    var clearFields = function () {
      $scope.uplaodAgentDOCS_DL = {
        drivingLicenseUrl: '',
        drivingLicenseBackUrl: '',
        vehicleRegisterationUrl: '',
        vehicleRegisterationBackUrl: '',
        drivingLicenseNumber: ''
      }
    }

    var afterSubmit = function (id, type) {
      $scope.changeView(false);
      clearFields();
      if (!$scope.is_edit && $rootScope.app_type == 8) {
        $state.go("profile.agentServiceAssignment", {
          id: id,
          name: $scope.outputs.name,
          sup_id: $scope.outputs.supplier_id,
        });
      } else {
        $scope.skip = 0;
        getAgentList(1);
        $scope.message = `${factories.localisation().agent.toLowerCase()} ${$translate.instant('information has been')} ${type} ${$translate.instant('successfully')}`;
        services.SUCCESS_MODAL(true);
      }
    }




    $scope.submitAdd = function (addAgentForm) {

      if (addAgentForm.$submitted && addAgentForm.$invalid) return;

      if ($scope.iti.isValidNumber()) {
        $scope.invalid_phone_no = false;
      } else {
        $scope.invalid_phone_no = true;
        return;
      }

      if ($scope.agent_access == 1) {
        $scope.outputs.supplier_id = 0;
        $scope.outputs.supplier_name = '';
      }

      $scope.outputs.offset = moment().format('Z');
      if (localStorage.getItem('profile_type') == 'SUPPLIER') {
        $scope.outputs.supplier_id = localStorage.getItem('supplier_id');
      } else if (localStorage.getItem('profile_type') == 'ADMIN' && $scope.settings.screenFlow[0].is_single_vendor == 1) {
        $scope.outputs.supplier_id = $scope.settings.supplier_id;
      } else if ($scope.agent_access == 0 && $rootScope.app_type != 8) {
        const selectedSuppliers = $scope.suppliers.filter((supplier) => supplier.checked);
        $scope.outputs.supplier_id = selectedSuppliers.map(sup => sup.id).toString();

        if ($rootScope.hide_all_restaurant_option_for_agent == 1) {
          $scope.outputs.supplier_name = selectedSuppliers.map(sup => sup.name).toString();
        } else {
          $scope.outputs.supplier_name = selectedSuppliers.map(sup => sup.supplier_name).toString();
        }

      }

      if ($scope.outputs.supplier_id == "" && $scope.agent_access == 0) {
        factories.invalidDataPop($translate.instant('Please select atleast 1 supplier'));
        return false;
      }

      let phone_data = $scope.iti.getSelectedCountryData();
      let param_data = { ...$scope.outputs };
      if (!param_data.commission) param_data.commission = 0;
      if (!!phone_data) {
        param_data['iso'] = phone_data['iso2'];
        param_data['country_code'] = phone_data['dialCode'];
      }
      if ($rootScope.addABNInAgent == 1) {
        param_data['abn'] = $scope.outputs.abn_num;
      }

      if ($rootScope.profile == 'SHIPPING') {
        param_data.delivery_company_id = $scope.delivery_company_id
      }
      if ($rootScope.agent_language_id_params == 1) {
        $scope.language = localStorage.getItem('lang');

        if ($scope.language == 'en') {
          $scope.language_id = 14;
        } else {
          $scope.language_id = 15;
        }
        param_data['language_id'] = $scope.language_id;
      }



      if ($rootScope.addDocumentsInAgent_DL == 1 || $rootScope.enable_driver_details == 1) {
        param_data['drivingLicenseUrl'] = $scope.uplaodAgentDOCS_DL.drivingLicenseUrl || '';
        param_data['drivingLicenseBackUrl'] = $scope.uplaodAgentDOCS_DL.drivingLicenseBackUrl || '';
        param_data['vehicleRegisterationUrl'] = $scope.uplaodAgentDOCS_DL.vehicleRegisterationUrl || '';
        param_data['vehicleRegisterationBackUrl'] = $scope.uplaodAgentDOCS_DL.vehicleRegisterationBackUrl || '';
        param_data['driver_license_number'] = $scope.uplaodAgentDOCS_DL.drivingLicenseNumber || '';
      }


      if ($rootScope.enable_id_number_in_agent == 1) {
        delete param_data['employee_id'];
      }
      else {
        delete param_data['id_number'];
      }



      if ($rootScope.enable_driver_details == 1) {
        param_data['vehicle_type'] = $scope.outputs.car_type
        param_data['vehicle_model'] = $scope.outputs.car_model
        param_data['vehicle_plate_number'] = $scope.outputs.plate_number
        param_data['vehicle_insurance_number'] = $scope.outputs.car_insurnce_number
        param_data['age'] = $scope.outputs.driver_age
        param_data['id_type'] = $scope.outputs.id_type
        param_data['driver_type'] = $scope.outputs.driver_type
        param_data['license_expiration_date'] = $scope.outputs.license_expr_date
        param_data['driver_expiration'] = $scope.outputs.driver_expr_date
      }


      if ($scope.is_edit) {
        param_data['id'] = $scope.agent_id;
        services.PUT_FORM_DATA(param_data, API.EDIT_AGENT(), function (data) {
          afterSubmit(data.data.id, 'updated');
        });
      } else {
        if ($rootScope.addDocumentsInAgent == 1 && $scope.docArr.length) {
          $scope.docArr.forEach((col) => {
            delete col.$$hashKey;
          });
          param_data['addAgentDocument'] = $scope.docArr;
        }

        services.POST_FORM_DATA(param_data, API.ADD_AGENT(), function (data) {
          afterSubmit(data.data.id, 'created');
        });
      }
    }

    $scope.blockAgent = function (agent) {
      let param_data = {
        status: +(!agent.is_active),
        id: agent.id
      }

      if (['ADMIN', 'SUPPLIER'].includes($rootScope.profile)) {
        param_data.sectionId = 63;
      }

      services.PUT_DATA(param_data, API.BLOCK_UNBLOCK_AGENT(), function (response) {
        $scope.skip = 0;
        getAgentList(1);
        $scope.message = `${factories.localisation().agent} ${$translate.instant('has been')} ${agent.is_active ? $translate.instant('blocked') : $translate.instant('unblocked')} ${$translate.instant('successfully')}`;
        services.SUCCESS_MODAL(true);
      });
    }

    $scope.updateAvailability = function (agent) {
      let param_data = {
        sectionId: 63,
        status: +(!agent.is_available),
        id: agent.id
      }

      services.PUT_DATA(param_data, API.UPDATE_AGENT_STATUS(), function (response) {
        $scope.skip = 0;
        getAgentList(1);
        $scope.message = `${factories.localisation().agent} ${$translate.instant('is now')} ${agent.is_available ? $translate.instant('unavailable') : $translate.instant('available')}`;
        services.SUCCESS_MODAL(true);
      });
    }

    $scope.deleteAgent = function (agent) {
      services.CONFIRM(`${$translate.instant('Delete this')} ${factories.localisation().agent.toLowerCase()}`, function (isConfirm) {
        if (isConfirm) {
          let param_data = {
            id: agent.id
          }

          if (['ADMIN', 'SUPPLIER'].includes($rootScope.profile)) {
            param_data.sectionId = 63;
          }

          services.PUT_DATA(param_data, API.DELETE_AGENT(), function (response) {
            $scope.skip = 0;
            getAgentList(1);
            $scope.message = `${factories.localisation().agent.toLowerCase()} ${$translate.instant('has been deleted successfully')}`;
            services.SUCCESS_MODAL(true);
          });
        }
      });
    }

    $scope.searchAgent = function (keyEvent) {
      if (keyEvent.which === 13) {
        $scope.search_agent = keyEvent.target.value;
        $scope.skip = 0;
        getAgentList(1);
      }
    }

    $scope.sortBy = function (col) {
      $scope.skip = 0;
      if ($scope.order_by == col) {
        $scope.is_desc = +(!$scope.is_desc);
      } else {
        $scope.is_desc = 1;
      }
      $scope.order_by = col;
      getAgentList(1);
    }

    $scope.selectAgent = function (agent) {
      $scope.new_pass = '';
      $scope.selected_agent_id = agent.id;
    }

    $scope.resetPassword = function (resetPassForm) {
      if (resetPassForm.$submitted && resetPassForm.$invalid) {
        return;
      }
      let param_data = {};
      param_data.agentId = $scope.selected_agent_id;
      param_data.password = $scope.new_pass;
      services.POST_DATA(param_data, API.RESET_AGENT_PASSWORD(), function (response) {
        $("#reset_password").modal('hide');
        $scope.message = `${factories.localisation().agent.toLowerCase()} ${$translate.instant('password has been updated successfully')}`;
        services.SUCCESS_MODAL(true);
      });
    }

    $scope.changeSupplier = function (supplier) {
      $scope.selected_supplier_filter = supplier;
      $scope.skip = 0;
      getAgentList(1);
    }

    $scope.toggleAdmin = function (is_admin) {
      $scope.is_admin = +!is_admin;
      $scope.selected_supplier_filter = '';
      $scope.skip = 0;
      getAgentList(1);
    }

    /****** Tips *****/

    $scope.getTips = function () {
      services.GET_DATA({}, API.AGENT_TIPS, function (response) {
        $scope.tips = response.data;
        if ($scope.tips.length < 1) {
          $scope.addMoreTips();
        }
        setTimeout(() => {
          $("#tip_modal").modal('show');
        }, 300);
      });
    }

    $scope.addMoreTips = function () {
      if ($scope.max_tips > $scope.tips.length) {
        $scope.tips.push({
          price: '',
          is_default: ''
        });
      }
    }

    $scope.removeTips = function (index) {
      $scope.tips.splice(index, 1);
    }

    $scope.markDefaultAgentTip = function (tip, index) {
      console.log(index);
      // $scope.tips[index].is_default = 1;

      for (let i = 0; i < $scope.tips.length; i++) {
        if (i == index) {
          $scope.tips[index].is_default = +(!$scope.tips[index].is_default);
        } else {
          $scope.tips[i].is_default = 0;
        }

      }
    }

    $scope.submitTips = function (tipForm) {
      if (tipForm.$submitted && tipForm.$invalid) {
        return;
      }
      let tips = [];
      let obj = {};

      $scope.tips.forEach(tip => {
        obj = {
          price: tip.price
        }
        if ($rootScope.enable_default_agent_tip == 1) {
          obj['is_default'] = tip.is_default ? tip.is_default : 0;
        }
        tips.push(obj);
      });

      services.POST_DATA({ tips: tips }, API.ADD_AGENT_TIPS, function (response) {
        $("#tip_modal").modal('hide');
        $scope.message = `${factories.localisation().agent.toLowerCase()} ${$translate.instant('tips updated successfully')}`;
        services.SUCCESS_MODAL(true);
      });
    }

    $scope.viewDocuments = function (front, back) {
      $scope.document = {
        front: front,
        back: back
      };
      $("#document_verification").modal('show');
    }

    $scope.viewSingleImage = function (image) {
      $scope.singleImage = image;
      $("#single_image_view").modal('show');
    }

    $scope.viewAllDocuments = function (docArr) {
      $scope.imgUrls = [];
      $scope.pdfUrls = [];
      $scope.docUrls = [];

      docArr.forEach(val => {
        if (val.docUrl.includes('.png') || val.docUrl.includes('.jpg') || val.docUrl.includes('.jpeg')) {
          $scope.imgUrls.push(val);
        }

        if (val.docUrl.includes('.pdf')) {
          $scope.pdfUrls.push(val);
        }

        if (val.docUrl.includes('.doc') || val.docUrl.includes('.docx')) {
          $scope.docUrls.push(val);
        }
      })
      $("#document_view").modal('show');
    }



    var getVehicleCatList = function () {
      var data = {};
      $scope.dataLoaded = false;
      services.GET_DATA(data, API.LIST_VEHICLE_CATEGORY, function (response) {
        $scope.vehicleCatList = response.data;
        $scope.dataLoaded = true;
      });
    };
    getVehicleCatList();

    $scope.vehicleChange = function (agent_category_id) {
      $scope.outputs.agent_category_id = agent_category_id;
    }



    $scope.check = function (user) {
      if ($scope.selected_users.includes(user.employee_id ? user.employee_id : user.id)) {
        $scope.selected_users.splice($scope.selected_users.indexOf(user.employee_id ? user.employee_id : user.id), 1);
        $scope.selected_emails.splice($scope.selected_emails.indexOf(user.email), 1);
      } else {
        $scope.selected_users.push(user.id);
        $scope.selected_emails.push(user.email);
      }
    }

    $scope.checkAll = function () {
      $scope.checkall = !$scope.checkall;
      $scope.selected_users = [];
      if ($scope.checkall) {
        $scope.agents.forEach(user => {
          $scope.selected_users.push(user.employee_id ? user.employee_id : user.id);
          $scope.selected_emails.push(user.email);
        });
      }
    }
    $scope.changeMsgType = function (msgType) {
      $scope.message_type = msgType;
    }

    $scope.sendNotificationOrEmail = function () {
      if ($scope.selected_users.length == 0) {
        factories.invalidDataPop("Please select users");
        return;
      } else if ($scope.message_type == 1 && $scope.notification.msg == '') {
        factories.invalidDataPop(`Please enter the notification message`);
        return;
      } else if ($scope.message_type == 2 && $scope.email.subject == '') {
        factories.invalidDataPop("Please enter the subject");
        return;
      } else if ($scope.message_type == 2 && $scope.email.body == '') {
        factories.invalidDataPop("Please enter the email body");
        return;
      }

      let userTypeArr = ($scope.selected_users.slice()).fill(2);
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.sectionId = 52;
      param_data.ids = $scope.selected_users.join('#');

      if ($scope.message_type == 1) {
        param_data.content = $scope.notification.msg;
        param_data.userType = userTypeArr.join('#');
        services.POST_DATA(param_data, API.SEND_PUSH, function (response) {
          $scope.message = 'Notification has been sent successfully';
          services.SUCCESS_MODAL(true);
        });
      } else {
        param_data.content = $scope.email.body;
        param_data.receiverType = userTypeArr.join('#');
        param_data.receiverEmail = $scope.selected_emails.join('#');
        param_data.subject = $scope.email.subject;
        services.POST_DATA(param_data, API.SEND_EMAIL, function (response) {
          $scope.message = 'Email has been sent successfully';
          services.SUCCESS_MODAL(true);
        });
      }
    }

    $scope.notificationOpen = function () {
      $scope.notification_open = !$scope.notification_open;
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


    $scope.uplaodAgentDOCS = function (File, name) {
      var file = File[0];
      if (constants.IMAGE_TYPE.includes(file.type)) {
        if ((file.size / Math.pow(1024, 2)) <= 1) {
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function (e) {
            $scope.$apply(function () {
              $scope.uploadImage(File[0], function (err, imageUrl) {
                switch (name) {
                  case 'RC_FRONT':
                    $scope.uplaodAgentDOCS_DL.vehicleRegisterationUrl = imageUrl;
                    break;
                  case 'RC_BACK':
                    $scope.uplaodAgentDOCS_DL.vehicleRegisterationBackUrl = imageUrl;
                    break;
                  case 'DL_FRONT':
                    $scope.uplaodAgentDOCS_DL.drivingLicenseUrl = imageUrl;
                    break;
                  case 'DL_BACK':
                    $scope.uplaodAgentDOCS_DL.drivingLicenseBackUrl = imageUrl;
                    break;
                }
              })
            });
          }
        } else {
          factories.invalidDataPop("Image size must be less than 1mb");
        }
      } else {
        factories.invalidDataPop("Invalid File Type");
      }
    }









    $scope.upload_id_proof = function (File, name) {
      var file = File[0];
      if (constants.IMAGE_TYPE.includes(file.type)) {
        if ((file.size / Math.pow(1024, 2)) <= 1) {
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function (e) {
            $scope.$apply(function () {
              $scope.uploadImage(File[0], function (err, imageUrl) {
                debugger
                $scope.outputs.id_proof = imageUrl;
              })
            });
          }
        } else {
          factories.invalidDataPop("Image size must be less than 1mb");
        }
      } else {
        factories.invalidDataPop("Invalid File Type");
      }
    }










    $scope.getExtraProductList = function (agent) {
      $scope.agentData = agent;
      let param_data = {};
      param_data.offset = 0;
      param_data.limit = 500;

      services.GET_DATA(param_data, API.GET_EXTRA_PRODUCT(), function (response) {
        if (!!response && response.data) {
          $scope.products = response.data.result.data;
          if (!!$scope.agentData.extra_product_id) {
            let extra_product = $scope.agentData.extra_product_id.split(',');
            $scope.products.forEach(prod => {
              if (extra_product.includes(prod.id + '')) {
                prod.ticked = true;
                $scope.selected_product.push(prod);
              }
            })
          }
        }
        $scope.dataLoaded = true;
      });
    }

    $scope.getInventory = function (id, index) {
      $scope.extra_product = [];
      $scope.selected_product.forEach(prod => {
        $scope.extra_product.push(prod.id);
      })
      var param_data = {
        id: $scope.agentData.id,
        extra_product: $scope.extra_product.join(',')
      };
      services.PUT_DATA(param_data, API.ASSIGN_INVENTORY_AGENT, function (response) {
        getAgentList(1);
        $("#assign_inventory").modal('hide');
        services.SUCCESS_MODAL(true);
      });
    }

  }]);
