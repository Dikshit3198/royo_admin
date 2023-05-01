Royo.controller('AdminPermissionCtrl', ['$scope', '$rootScope', 'services', 'factories', 'constants', '$state', '$translate', '$stateParams', 'API',
  function ($scope, $rootScope, services, factories, constants, $state, $translate, $stateParams, API) {

    $scope.admin_id = $stateParams.id;
    $scope.user = $stateParams.user;
    $scope.sections = [];
    $scope.select_section = false;
    $scope.message = '';

    var filterPermissions = function (section, index) {
      if ((section.section_category_name).toLowerCase() === 'dashboard') {
        $scope.sections.splice(index, 1);
      }
      switch ($rootScope.app_type) {
        case 1: case 8:
          if ((section.section_category_name).toLowerCase() === 'brands') {
            $scope.sections.splice(index, 1);
          }
          break;

        case 2:
          if ((section.section_category_name).toLowerCase() === 'agents') {
            $scope.sections.splice(index, 1);
          }
          break;
      }
    }

    var getPermissions = function () {
      let params = {};
      if(localStorage.getItem('profile_type') == 'SUPPLIER') {
        params.subSupplierId = $scope.admin_id;
      } else {
        params.subAdminId = $scope.admin_id;
      }
      services.POST_DATA(params, API.GET_PERMISSIONS(), function (response) {
        if (response.data.length) {
          $scope.sections = response.data;
          $scope.sections.map((section, index) => {
            if(section.section_category_name == 'SUBSCRIPTION' && factories.getSettings().key_value.is_subscription_plan == 0) {
              $scope.sections.splice(index, 1);
            }
            section['checked'] = !section.admin_section.some(el => el.is_assign == 0);
            filterPermissions(section, index);
          });
        }
      });
    }
    getPermissions();

    $scope.selectSection = function (section) {
      section.checked = !section.checked;
      (section.admin_section).map(el => {
        el.is_assign = section.checked;
      });
    }

    $scope.selectSubSection = function (sub_section) {
      sub_section.is_assign = +!sub_section.is_assign;
    }

    $scope.savePermissions = function () {

      let assigned_sections = [];

      $scope.sections.forEach(section => {
        (section.admin_section).forEach(sub_section => {
          if (!!sub_section.is_assign) {
            assigned_sections.push(sub_section.section_id);
          }
        });
      });

      if (!assigned_sections.length) {
        factories.warningDataPop('Please select permissions');
        return;
      }

      let form_data = {
        sectionIds: assigned_sections
      }
      if(localStorage.getItem('profile_type') == 'SUPPLIER') {
        form_data.subSupplierId = $scope.admin_id;
      } else {
        form_data.subAdminId = $scope.admin_id;
      }
      services.POST_DATA(form_data, API.SAVE_PERMISSIONS(), function (response) {
        $scope.message = `${$translate.instant('Permissions updated successfully')}`;
        services.SUCCESS_MODAL(true);
      });


    }


  }]);