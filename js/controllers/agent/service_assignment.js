Royo.controller('ServiceAssignmentCtrl', ['$scope', '$rootScope', '$stateParams', 'services', 'factories', 'pagerService', 'API', 'constants',
  function ($scope, $rootScope, $stateParams, services, factories, pagerService, API, constants) {

    $scope.main = {};
    $scope.change_pagination_amount = 10;
    $scope.is_view_select = 0;
    $scope.is_assigned_sub = 1;
    $scope.Selected = [];
    $scope.product_assign = {};
    $scope.product_assign.Selected = {};
    $scope.selected_sup_cat = {};
    $scope.name = $stateParams.name;
    $scope.branches = [];
    $scope.selectedBranch = '';
    $scope.showCat = false;
    $scope.selectedService = {};
    $scope.serviceList = [];
    $scope.selectedAll = false;
    $scope.products = [];
    $scope.count = 0;
    $scope.skip = 0;
    $scope.limit = 20;
    $scope.dataLoaded = false;
    $scope.message = '';
    $scope.supplier_id = parseInt($stateParams.sup_id);

    var getHomeData = function () {
      var param = {};
      param.accessToken = constants.ACCESSTOKEN;
      param.supplierId = $scope.supplier_id;
      param.sectionId = 31;
      if(factories.getSettings().screenFlow[0].is_single_vendor == 1) {
        param.supplierId = factories.getSettings().supplier_id;
      }
      services.POST_DATA(param, API.LIST_BRANCHES(), function (data) {
        let response = data.data;
        $scope.branches = response;
        $scope.selected_branch = response[0];
        $scope.selectedBranch = response[0].id;
      });
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.sectionId = 30;
      param_data.supplierId = $scope.supplier_id;

      if(factories.getSettings().screenFlow[0].is_single_vendor == 1) {
        param_data.supplierId = factories.getSettings().supplier_id;
      }

      services.POST_DATA(param_data, API.LIST_SUPPLIER_CATEGORIES(), function (response) {
        let categoryData = response.data;
        $scope.sub_categories = {};
        $scope.det_sub_categories = {};
        $scope.categories = categoryData;
        $scope.categories.map((category) => {
          category['id'] = category.category_id;
        });
        $scope.onSelectCategory($scope.categories[0], false);

      });
    };

    if ($scope.supplier_id == 0) {
      let param_data = {
        offset: 0,
        limit: 0
      }
      services.GET_DATA(param_data, API.ADMIN_CATEGORY_LIST(), function (response) {
        $scope.categories = [];
        (response.data.categories).map((el) => {
          if (el.category_id != 1) {
            el['id'] = el.category_id;
            el['name'] = el.category_name[0].name;
            $scope.categories.push(el)
          }
        });
        $scope.onSelectCategory($scope.categories[0], false);
      });
    } else {
      getHomeData();
    }

    $scope.onSelectBranch = function (branch) {
      $scope.selectedBranch = branch.id;
    }

    var getServiceList = function (callProductList) {
      $scope.Selected = [];
      $scope.serviceList = [];
      $scope.selectedService = {};
      let param_data = {};
      param_data.sectionId = 63;
      param_data.agent_id = $stateParams.id;

      services.GET_DATA(param_data, API.GET_SERVICE_ASSIGNED_LIST(), function (response) {
        response.data.forEach(data => {
          $scope.selectedService[data.service_id] = true;
          $scope.serviceList.push(data.service_id);
        });
        if (callProductList) {
          productList(1);
        }
      });
    }
    getServiceList(false);

    $scope.dynamicSubCategories = [];
    $scope.onSelectCategory = function (category, change) {
      $scope.selectedAll = false;
      $scope.selected_sub_cat = '';
      $scope.selected_det_sub_cat = {};
      $scope.catIdArr = [];
      if (!!category) {
        $scope.selected_cat = category;
      }
      if (category.id) {
        $scope.category_selected = category.id;
        $scope.changeSubCatId(category, 0, change);
      }
    };

    $scope.selectedCategory = [];
    $scope.changeSubCatId = function (subCatData, catIndex, change) {
      $scope.selected_det_sub_cat = subCatData;
      if (!!subCatData && !!subCatData.id) {
        if (change) {
          $scope.selectedCategory.splice(catIndex, $scope.selectedCategory.length - catIndex);
        }
        let param_data = {};
        param_data.subCatId = subCatData.id;
        param_data.sectionId = 30;
        if (catIndex == 0) {
          param_data.level = 1;
        }
        if ($rootScope.is_single_vendor == 0 && $scope.supplier_id) {
          param_data.supplierId = $scope.supplier_id;
        }

        $scope.products = [];
        services.GET_DATA(param_data, API.GET_SUBCATEGORY_DATA(), function (response) {
          let data = response.data;
          if (data.length > 0) {
            if (catIndex == $scope.dynamicSubCategories.length) {
              $scope.dynamicSubCategories.push(data);
            } else {
              $scope.dynamicSubCategories.splice(catIndex, $scope.dynamicSubCategories.length - catIndex);
              $scope.dynamicSubCategories[catIndex] = data;
            }

            if (catIndex > 0) {
              if ($scope.catIdArr.length === catIndex - 1) {
                $scope.catIdArr.push(subCatData.id);
              } else {
                $scope.catIdArr.splice(catIndex, $scope.catIdArr.length - catIndex);
                $scope.catIdArr[catIndex] = subCatData.id;
              }
            }

          } else {
            $scope.dynamicSubCategories.splice(catIndex, $scope.dynamicSubCategories.length - catIndex);
            productList(1);
          }
        });
      }
    };

    var productList = function (page) {

      if (!$scope.selectedBranch) {
        factories.invalidDataPop("Please select branch");
        return;
      } else if (!$scope.selected_cat.category_id) {
        factories.invalidDataPop("Please select category");
        return;
      }

      var param_data = {};
      param_data.section_id = 30;
      param_data.branchId = $scope.selectedBranch;
      param_data.categoryId = $scope.selected_cat.category_id;
      if ($scope.catIdArr.length > 0) {
        param_data.subCategoryId = $scope.catIdArr[$scope.catIdArr.length - 1];
      }
      param_data.limit = $scope.limit;
      param_data.offset = $scope.skip;
      param_data.serachText = '';
      param_data.serachType = 0;

      if (!!$scope.selected_det_sub_cat) {
        param_data.detailedSubCategoryId = $scope.selected_det_sub_cat.id;
      }

      if (param_data.subCategoryId == undefined) {
        param_data.subCategoryId = param_data.detailedSubCategoryId;
      }
      if (param_data.subCategoryId == undefined && param_data.detailedSubCategoryId == undefined) {
        param_data.detailedSubCategoryId = param_data.categoryId;
        param_data.subCategoryId = param_data.categoryId;
      }

      $scope.dataLoaded = false;
      services.listSupBranchProducts($scope, param_data, function (product) {
        $scope.products = [];
        $rootScope.count = product.product_count;
        $scope.count = product.product_count;
        // $scope.products = product.products;

        (product.products).forEach(el => {
          if (!!el.price && el.price.length) {
            $scope.products.push(el);
          }
        });

        if ($scope.serviceList.length && $scope.products.length) {
          $scope.products.forEach(data => {
            if ($scope.serviceList.includes(data.id)) {
              $scope.Selected.push(data);
            }
          });
          console.log($scope.Selected)
        }
        $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
        $scope.dataLoaded = true;
      });
    };

    $scope.changeAccess = function (service) {
      let index = $scope.Selected.findIndex(el => el.id == service.id);
      if (index > -1) {
        $scope.Selected.splice(index, 1);
      } else {
        $scope.Selected.push(service);
      }
    }

    $scope.checkAll = function () {
      if ($scope.selectedAll) {
        $scope.Selected = [];
        $scope.rows.forEach(data => {
          $scope.Selected.push(data.json);
          $scope.selectedService[data.json.id] = true;
        });
      } else {
        $scope.Selected = [];
        $scope.selectedService = {};
      }

    };

    $scope.assignServices = function () {

      if (!$scope.Selected.length) {
        factories.invalidDataPop('Please select services first!');
        return;
      }

      let serviceData = [];
      $scope.Selected.forEach(service => {
        let obj = {};
        obj.service_id = service.id;
        obj.name = service.name;
        obj.image = service.images.length ? service.images[0].image_path : null;
        obj.priceArray = service.price;
        serviceData.push(obj)
      });

      let form_data = {};
      form_data.sectionId = 63;
      form_data.agentId = $stateParams.id;
      form_data.serviceData = serviceData;

      services.POST_DATA(form_data, API.AGENT_SERVICE_ASSIGNMENT(), function (response) {
        getServiceList(true);
        $scope.message = 'Assignment Done Successfully';
        services.SUCCESS_MODAL(true);
      });
    }

    $scope.unassignServices = function () {

      if (!$scope.Selected.length) {
        factories.invalidDataPop('Please select services first!');
        return;
      }

      let serviceIds = [];
      $scope.Selected.forEach(service => {
        serviceIds.push(service.id);
      });

      for (let service of serviceIds) {
        if (!$scope.serviceList.includes(service)) {
          factories.invalidDataPop('Please select services that have already been assigned!');
          return;
        }
      }

      let form_data = {};
      form_data.sectionId = 63;
      form_data.agentId = $stateParams.id;
      form_data.serviceIds = serviceIds;

      services.PUT_DATA(form_data, API.AGGENT_SERVICE_UNASSIGNMENT(), function (response) {
        $scope.message = 'Successfully Unassigned';
        getServiceList(true);
        services.SUCCESS_MODAL(true);
      });
    }

    $scope.setPage = function (page) {
      $scope.currentPage = page;
      $scope.skip = $scope.limit * (page - 1);
      productList(page);
    }

  }]);