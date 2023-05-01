Royo.controller('AdminProfileCtrl', ['$scope', '$rootScope', 'services', 'constants', 'API', '$translate', 'pagerService', 'factories',
  function ($scope, $rootScope, services, constants, API, $translate, pagerService, factories) {

    $scope.adminList = [];
    $rootScope.active_profile_tab = 2;
    $scope.search = '';
    $scope.admin = {
      email: '',
      password: '',
      phone: '' 
    }
    $scope.message = '';
    $scope.dataLoaded = false;
    $scope.invalid_phone_no = false;
    $scope.count = 0;
    $scope.currentPage = 1;
    $scope.skip = 0;
    $scope.limit = 20;

    var getAdminList = function (page) {
      $scope.dataLoaded = false;
      let param_data = {
        offset: $scope.skip,
        limit: $scope.limit
      }
      param_data.search = ($scope.search).trim() ? $scope.search : '';

      if(localStorage.getItem('profile_type') == 'SUPPLIER') {
        param_data.accessToken = localStorage.getItem('RoyoAccessToken');
        // param_data.sectionId = 26;
        param_data.supplierId = localStorage.getItem('supplier_id');
      }
      services.GET_DATA(param_data, API.ADMIN_LIST(), function (response) {
        if(response.status == 4) {
          $scope.adminList = response.data.list;
          $scope.count = response.data.count;
          $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
        }
        $scope.dataLoaded = true;
      });
    }
    getAdminList(1);

    $scope.setPage = function (page) {
      $scope.currentPage = page;
      $scope.skip = $scope.limit * (page - 1);
      getAdminList(page);
    }

    // Activate / Deactivate Admin..
    $scope.changeAdminStatus = function (status, Id) {
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.subAdminId = Id;
      param_data.status = +(!status);

      if(localStorage.getItem('profile_type') == 'ADMIN') {
        param_data.authSectionId = 26;
      } 
      services.POST_DATA(param_data, API.CHANGE_ADMIN_STATUS(), function (response) {
        $scope.message = `${$translate.instant('Admin status updated successfully')}`;
        $scope.reset();
        services.SUCCESS_MODAL(true);
      });
    };

    $scope.deleteSubAdmin = function (Id) {
      services.CONFIRM(`You want to delete this Sub Admin`,
        function (isConfirm) {
          if (isConfirm) {
            let param_data = {};
            param_data.accessToken = constants.ACCESSTOKEN;
            param_data.subAdminId = Id;
            param_data.authSectionId = 26;
            services.POST_DATA(param_data, API.DELETE_SUB_ADMIN, function (response) {
              $scope.message = `${$translate.instant('Sub Admin has been deleted')}`;
              $scope.reset();
              services.SUCCESS_MODAL(true);
            });
          }
        });
    }

    $scope.openAdd = function () {
      document.getElementById("input_email").value = '';
      document.getElementById("input_password").value = '';
      $scope.admin.email = '';
      $scope.admin.password = '';
      $scope.addAdminForm.$setPristine();
      setTimeout(() => {
        var input = document.querySelector("#admin_phone");
        $scope.iti = window.intlTelInput(input, {
          preferredCountries: [factories.getSettings().adminDetails[0].iso || factories.getSettings().onboarding_data.iso]
        });
        $scope.iti.setCountry(factories.getSettings().adminDetails[0].iso || factories.getSettings().onboarding_data.iso);
      }, 500);
    }

    $scope.addAdmin = function (addAdminForm) {
      if (addAdminForm.$submitted && addAdminForm.$invalid) return;

      if($scope.iti.isValidNumber()) {
        $scope.invalid_phone_no = false;
      } else {
        $scope.invalid_phone_no = true;
        return;
      }

      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.authSectionId = 26;
      param_data.email = $scope.admin.email;
      param_data.password = $scope.admin.password;
      param_data.phoneNumber = $scope.admin.phone;

      let phone_data = $scope.iti.getSelectedCountryData();
      if(!!phone_data) {
        param_data['iso'] = phone_data['iso2'];
        param_data['country_code'] = phone_data['dialCode'];
      }

      services.POST_DATA(param_data, API.ADD_ADMIN(), function (data) {
        $scope.message = `${localStorage.getItem('profile_type')} ${$translate.instant('CREATED SUCCESSFULLY')}`;
        $("#addAdmin").modal('hide');
        $scope.reset();
        $scope.admin = {
          email: '',
          password: '',
          phone: ''
        }
        services.SUCCESS_MODAL(true);
        // $state.go('profile.admin_permissions', {id:admin.id, user:$scope.admin.email});
      });
    }

    $scope.searchAdmin = function (keyEvent) {
      if (keyEvent.which === 13) {
        $scope.search = keyEvent.target.value;
        $scope.reset();
      }
    }

    $scope.reset = function() {
      $scope.skip = 0;
      $scope.currentPage = 1;
      getAdminList(1);
    }

  }]);