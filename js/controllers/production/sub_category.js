Royo.controller('SubCategoryProdCtrl', ['$scope', 'services', 'factories', 'constants', '$filter', '$stateParams', 'API', '$rootScope', 'pagerService', '$state', '$translate',
  function ($scope, services, factories, constants, $filter, $stateParams, API, $rootScope, pagerService, $state, $translate) {

    $scope.main = {};
    $scope.outputs = {
      inputs: {},
      desc_inputs: {}
    };
    // $scope.edit = {};
    $scope.category = {};
    $scope.category_id = '';
    $scope.sub_cat_id = 0;
    $scope.categories = [];
    $scope.subCategories = [];
    $scope.detailedSubCategories = [];

    $scope.search = '';
    $scope.is_edit = false;
    $scope.addCategory = false;
    $scope.selected_category = {};
    $scope.selected_sub_category = {};
    $scope.dataLoaded = false;
    $scope.is_grid = true;
    $scope.mesage = '';
    $scope.categoryData = [];
    $scope.read_more_text = '';
    $scope.profileType = $rootScope.profile
    $scope.search = '';
    $scope.count = 0;
    $scope.currentPage = 1;
    $scope.skip = 0;
    $scope.limit = 20;

    $scope.flow_type = '';
    $scope.menu_type = 1;
    $scope.subCatId = 0;

    $scope.catIds = [];
    // $scope.restrictNlevel = false;

    if (!!$stateParams.sub_cat_ids) {
      $scope.catIds = $stateParams.sub_cat_ids.split(',');
      // if ($scope.catIds.length == 1 && factories.getSettings().screenFlow[0].app_type == 1) {
      //   $scope.restrictNlevel = true;
      // }
    }

    $rootScope.$on('is_sub_cat_add_edit', function ($event, type, subCatId) {
      if (type && type === 'ADD') {
        $scope.changeview(true, false);
      } else if (type && type === 'EDIT') {
        if ($scope.catIds.includes($stateParams.cat_id)) {
          $scope.catIds.splice($scope.catIds.indexOf($stateParams.cat_id), 1);
        }
        $scope.subCatId = subCatId;
        $scope.changeview(true, true);
      }
    });

    var clearInputs = function () {
      $scope.outputs = {
        inputs: {},
        desc_inputs: {}
      };

      $scope.menu_type = 1;
      $scope.cat_img = '';
      $scope.cat_icon = '';
      $scope.image_file = '';
      $scope.icon_file = '';
    }

    $scope.menu_type_change = function (menu_type) {
      $scope.menu_type = menu_type;
    }

    $scope.changeview = function (is_add, is_edit) {
      $scope.addCategory = is_add;
      $scope.is_edit = is_edit;
      clearInputs();
    }

    $scope.edit = function (category) {
      if ($rootScope.enable_supplier_add_edit_delete_restriction == 1 && $rootScope.profile == 'SUPPLIER') {
        return;
      }
      $scope.addCategory = true;
      $scope.is_edit = true;
      $scope.sub_category_data = category;
      $scope.sub_category_id = category.category_id;
      $scope.menu_type = category.menu_type || 1;
      $scope.cat_img = category.image;
      $scope.cat_icon = category.icon;
      let i = 0;
      (category.category_name).forEach(el => {
        $scope.outputs.inputs[i] = el.name;
        $scope.outputs.desc_inputs[i] = el.description;
        i++
      });
    }

    var getSubCategories = function (page) {
      $scope.dataLoaded = false;
      let params = {
        offset: $scope.skip,
        limit: $scope.limit,
        categoryId: $scope.selected_det_sub_cat.id
      }
      params.search = ($scope.search).trim() ? $scope.search : '';
      services.GET_DATA(params, API.LIST_SUBCATEGORIES, function (response) {
        if (response) {
          $scope.count = response.data.totalCount[0].totalCount;
          $scope.categoryData = response.data.cData;
          $scope.categoryData.map(cat => {
            cat['id'] = cat.category_id;
            cat['name'] = cat.category_name.length ? cat.category_name[0].name : '';
            cat['description'] = cat.category_name.length ? cat.category_name[0].description : '';
          });
          $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
        }
        $scope.dataLoaded = true;
      });

      if ($scope.is_edit) {
        services.GET_DATA({ offset: 0, limit: 100, categoryId: $scope.selected_det_sub_cat.id }, API.LIST_SUBCATEGORIES, function (response) {
          let categories = response.data.cData;
          let subCat = categories.find(el => el.category_id == $scope.subCatId);
          if (subCat) {
            $scope.edit(subCat);
          }
        });
      }
    }

    var getCategories = function () {
      let params = {
        limit: 0,
        offset: 0,
        search: ''
      }
      services.GET_DATA(params, API.ADMIN_CATEGORY_LIST(), function (response) {
        if (response.data && response.data.categories.length) {
          $scope.sub_categories = {};
          $scope.det_sub_categories = {};
          $scope.categories = [];
          let lang_index = localStorage.getItem('lang') != 'en' ? 1 : 0;
          (response.data.categories).forEach(category => {
            category['id'] = category.category_id;
            if (category.category_id != 1) {
              category['name'] = category.category_name.length ? category.category_name[lang_index].name : '';
              if(!!category['name']) {
                $scope.categories.push(category);
              }
            }
          });
          if ($scope.categories.length) {
            if ($stateParams.cat_id) {
              $scope.selected_cat = $scope.categories.find(cat => {
                return cat.category_id == $stateParams.cat_id;
              });
              $scope.onSelectCategory($stateParams.cat_id, false, $scope.selected_cat);
            } else {
              $scope.selected_cat = $scope.categories[0];
              $scope.onSelectCategory($scope.categories[0].category_id, false, $scope.selected_cat);
            }
          }
        }
      });
    };
    getCategories();

    $scope.dynamicSubCategories = [];
    $scope.onSelectCategory = function (Id, change, category) {
      $scope.selected_det_sub_cat = category;
      if ($rootScope.app_type > 10) {
        $scope.flow_type = category.type;
      }
      $scope.selected_sub_cat = '';
      if (!!category) {
        $scope.categoryData = [];
        $scope.selected_cat = category;
      }
      if (Id) {
        $scope.category_selected = Id;
        $scope.changeSubCatId(category, 0, change);
      }
    };

    $scope.selectedCategory = [];
    $scope.changeSubCatId = function (subCatData, catIndex, change) {
      if (!!subCatData && !!subCatData.id) {
        if (change) {
          $scope.selectedCategory.splice(catIndex, $scope.selectedCategory.length - catIndex);
        }
        $scope.selected_det_sub_cat = subCatData;
        let param_data = {};
        param_data.subCatId = subCatData.id;
        param_data.sectionId = 30;
        if (catIndex == 0) {
          param_data.level = 1;
        }
        services.GET_DATA(param_data, API.GET_SUBCATEGORY_DATA(), function (response) {
          let data = response.data;
          if (data.length > 0) {
            if ($scope.catIds.length - 1 >= catIndex && catIndex == $scope.dynamicSubCategories.length) {
              $scope.dynamicSubCategories.push(data);
            } else {
              $scope.dynamicSubCategories.splice(catIndex, $scope.dynamicSubCategories.length - catIndex);
              getSubCategories(1);
            }

            if ($scope.dynamicSubCategories.length > 0 && $scope.dynamicSubCategories[catIndex] && $scope.catIds.length && !change) {
              let subcat = $scope.dynamicSubCategories[catIndex].find(el => {
                return el.id == $scope.catIds[catIndex];
              });
              if ($scope.selectedCategory[catIndex]) {
                $scope.selectedCategory[catIndex] = subcat;
              } else {
                $scope.selectedCategory.push(subcat);
              }
              if (subcat) {
                $scope.changeSubCatId(subcat, catIndex + 1, false);
              }
            }

          } else {
            $scope.dynamicSubCategories.splice(catIndex, $scope.dynamicSubCategories.length - catIndex);
            getSubCategories(1);
          }
        });
      }
    };

    /*** Image Upload Function ***/
    $scope.files = [];
    $scope.image_file;
    $scope.icon_file;

    //listen for the file selected event
    $scope.$on("fileSelected", function (event, args) {
      $scope.$apply(function () {
        $scope.files.push(args.file);
      });
    });

    $scope.cat_img = '';
    $scope.file_to_upload_for_image = function (File) {
      var file = File[0];
      if (constants.IMAGE_TYPE.includes(file.type)) {
        if ((file.size / Math.pow(1024, 2)) <= 7) {
          $scope.image_file = File[0];
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function (e) {
            $scope.$apply(function () {
              $scope.cat_img = e.target.result;
            });
          }
        } else {
          factories.invalidDataPop($translate.instant("Image size must be less than 7mb"));
        }
      } else {
        factories.invalidDataPop($translate.instant("Invalid File Type"));
      }
    };

    $scope.cat_icon = '';
    $scope.file_to_upload_for_icon = function (File) {
      var file = File[0];
      if (constants.IMAGE_TYPE.includes(file.type)) {
        if ((file.size / Math.pow(1024, 2)) <= 7) {
          $scope.icon_file = File[0];
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function (e) {
            $scope.$apply(function () {
              $scope.cat_icon = e.target.result;
            });
          }
        } else {
          factories.invalidDataPop($translate.instant("Image size must be less than 7mb"));
        }
      } else {
        factories.invalidDataPop($translate.instant("Invalid File Type"));
      }
    };

    $scope.submitAdd = function (addSubCategoryForm) {
      if (addSubCategoryForm.$submitted && addSubCategoryForm.$invalid) return;

      $scope.is_disabled_add = 1;
      var nameData = $scope.outputs.inputs;
      var descData = $scope.outputs.desc_inputs;
      var param_data = {};
      param_data['accessToken'] = constants.ACCESSTOKEN;
      param_data['authSectionId'] = 28;
      param_data['name'] = nameData[0] + '#' + (nameData[1] ? nameData[1] : nameData[0]);
      param_data['languageId'] = '14#15';
      param_data['description1'] = descData[0] + '#' + (descData[1] ? descData[1] : descData[0]);
      param_data['image[]'] = $scope.image_file;
      param_data['icon1[]'] = $scope.icon_file;
      param_data['count'] = 1;
      if ($scope.flow_type == 1 || $rootScope.app_type == 1) param_data['menu_type'] = $scope.menu_type;
      if ($rootScope.is_single_vendor == 1) {
        param_data['supplier_id'] = $rootScope.single_vendor_id;
      }

      if ($scope.is_edit) {
        param_data['subCategoryId'] = $scope.sub_category_id;
        param_data['imageName'] = $scope.image_file ? $scope.image_file : $scope.sub_category_data.image;
        param_data['iconName'] = $scope.icon_file ? $scope.icon_file : $scope.sub_category_data.icon;
        param_data['iconStatus'] = $scope.icon_file ? 1 : 0;
        services.POST_FORM_DATA(param_data, API.EDIT_SUBCATEGORY(), function (data) {
          $scope.refresh();
          $scope.message = `${$translate.instant('Sub-Category has been updated')}`;
          services.SUCCESS_MODAL(true);
          $scope.addCategory = false;
        });
      } else {
        param_data['categoryId'] = $scope.selected_det_sub_cat.id;
        services.POST_FORM_DATA(param_data, API.ADD_SUBCATEGORY(), function (data) {
          $scope.refresh();
          $scope.addCategory = false;
          $scope.message = $translate.instant('Sub-Category has been added to the list of sub-categories');
          services.SUCCESS_MODAL(true);
        });
      }
    };

    $scope.deleteSubCategory = function (category) {
      services.CONFIRM($translate.instant(`You want to delete this Sub-Category`),
        function (isConfirm) {
          if (isConfirm) {
            var param_data = {};
            param_data.accessToken = constants.ACCESSTOKEN;
            param_data.id = category['category_id'];
            param_data.sectionId = 28;
            services.POST_DATA(param_data, API.DELETE_SUB_CAT(), function (response) {
              $scope.refresh();
              $scope.message = `${$translate.instant('Sub-Category has been deleted')}`;
              services.SUCCESS_MODAL(true);
            });
          }
        });
    };

    $scope.viewProducts = function (category) {
      $scope.catIds.push(category.id);

      let params = {
        cat_id: $stateParams.cat_id,
        sub_cat_ids: $scope.catIds.join(',')
      };

      if ($rootScope.is_single_vendor == 0 && $rootScope.profile === 'ADMIN') {
        $state.go('production.products', params);

      } else if (($rootScope.is_single_vendor == 1 && $rootScope.profile === 'ADMIN') || $rootScope.profile === 'SUPPLIER' || $rootScope.profile === 'BRANCH') {

        if ($rootScope.is_single_vendor == 1 && $rootScope.profile === 'ADMIN') {
          params['id'] = $rootScope.single_vendor_id;
        } else if ($rootScope.profile === 'SUPPLIER' || $rootScope.profile === 'BRANCH') {
          params['id'] = $rootScope.active_supplier_id;
        }

        if (factories.IsJsonString(localStorage.getItem('branch_type'))) {
          let branch_data = JSON.parse(localStorage.getItem('branch_type'))
          if (branch_data.is_multibranch == 0) {
            params['multi_b'] = branch_data.is_multibranch;
            params['b_id'] = branch_data.default_branch_id;
            $state.go('production.supplierProducts', params);
          } else {
            $state.go('production.supplierProducts', params);
          }
        } else {
          $state.go('production.supplierProducts', params);
        }
      }
    }

    $scope.viewDetailedSubCategory = function (category) {
      $scope.catIds.push(category.id);
      $state.go('.', { sub_cat_ids: $scope.catIds.join(',') });
      $scope.selected_det_sub_cat = category;
      $scope.categoryData = [];
      $scope.refresh();
    }

    $scope.viewDescription = function (text) {
      $scope.read_more_text = text;
      $("#readMore").modal('show');
    }

    $scope.refresh = function () {
      $scope.skip = 0;
      $scope.currentPage = 1;
      getSubCategories(1);
    }

    $scope.setPage = function (page) {
      $scope.currentPage = page;
      $scope.skip = $scope.limit * (page - 1);
      getSubCategories(page);
    }

    $scope.searchCategoy = function (keyEvent) {
      if (keyEvent.which === 13) {
        $scope.search = keyEvent.target.value;
        $scope.skip = 0;
        getSubCategories(1);
      }
    }



    $scope.blockCategory = function (category) {
      let param_data = {};
      param_data.sectionId = 27;
      param_data.category_id = category.category_id;
      param_data.is_live = +(!category.is_live);
      services.POST_DATA(param_data, API.BLOCK_CATEGORY(), function (response) {
        getSubCategories(1);
        $scope.message = `${factories.localisation().category} ${$translate.instant('status has been updated')}`;
        services.SUCCESS_MODAL(true);
      });
    }

  }]);
