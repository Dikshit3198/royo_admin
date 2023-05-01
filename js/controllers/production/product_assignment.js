Royo.controller('ProductAssignmentCtrl', ['$scope', 'factories', 'services', '$stateParams', 'pagerService', 'API', '$state', '$rootScope', 'constants',
  function ($scope, factories, services, $stateParams, pagerService, API, $state, $rootScope, constants) {

    $scope.is_grid = true;
    $scope.selected_det_sub_cat = { id: 0 };
    $scope.catIds = [];
    $scope.skip = 0;
    $scope.limit = 20;
    $scope.dataLoaded = false;
    $scope.categories = [];
    $scope.search = '';
    $scope.selected_products = [];
    $scope.sup_branch_id = '';
    $scope.supplier_id = '';
    $scope.products = [];


    if ($stateParams) {
      $scope.supplier_id = $stateParams.id;
      $scope.sup_branch_id = $stateParams.b_id;
      $scope.category_selected = $stateParams.cat_id;
      if ($stateParams.sub_cat_ids) {
        $scope.catIds = $stateParams.sub_cat_ids.split(',');
        if ($stateParams.sub_cat_ids.length > 1) {
          $scope.selected_det_sub_cat.id = $stateParams.sub_cat_ids[1];
        }
      }
    }

    var getHomeData = function () {
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.sectionId = 30;
      param_data.supplierId = $stateParams.id;

      param_data.language_id = localStorage.getItem('lang') != 'en' ? 15 : 14;

      services.POST_DATA(param_data, API.LIST_SUPPLIER_CATEGORIES(), function (response) {
        let categoryData = response.data;
        categoryData.map((cat, index) => {
          if (cat.category_id == 1) {
            categoryData.splice(index, 1);
          }
          cat['id'] = cat.category_id;
        });
        $scope.sub_categories = {};
        $scope.det_sub_categories = {};
        $scope.categories = categoryData;
        $scope.selected_cat = categoryData[0];
        $scope.category_selected = categoryData[0].category_id;
        if (categoryData.length) {
          if ($stateParams.cat_id) {
            $scope.selected_cat = $scope.categories.find(cat => {
              return cat.category_id == $stateParams.cat_id;
            });
            $scope.onSelectCategory($scope.selected_cat, false);
          } else {
            $scope.onSelectCategory(categoryData[0], false);
          }
        }

      });
    };
    getHomeData();


    $scope.dynamicSubCategories = [];
    $scope.catIdArr = [];
    $scope.onSelectCategory = function (category, change) {
      $scope.selected_sub_cat = '';
      $scope.selected_det_sub_cat = {};
      $scope.catIdArr = [];
      if (category.id) {
        $scope.selected_cat = category;
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
        if ($scope.sup_branch_id && $rootScope.is_single_vendor == 0) param_data.supplierId = $scope.supplier_id;

        if ($rootScope.is_single_vendor == 0) {
          if ($stateParams.type === 'branch') {
            param_data.supplierId = $scope.sup_id;
          } else if ($stateParams.type === 'supplier') {
            param_data.supplierId = $scope.supplier_id;
          }
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

            if ($scope.dynamicSubCategories.length > 0 && $scope.catIds.length && !change) {
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
            productList(1);
          }
        });
      }
    };


    $scope.selectProduct = function (product) {
      if ($scope.selected_products.includes(product.id)) {
        $scope.selected_products.splice($scope.selected_products.indexOf(product.id), 1);
      } else {
        $scope.selected_products.push(product.id);
      }
    }

    $scope.assignProducts = function () {

      if (!$scope.selected_products.length) {
        factories.warningDataPop(`Please select ${factories.localisation().product} to assign`);
        return;
      }

      let ProductCatArr = [];
      let ProductSubCatArr = [];
      let ProductDetSubCatArr = [];

      for (let i = 0; i < $scope.selected_products.length; i++) {
        ProductCatArr.push($scope.category_selected);
        if ($scope.catIdArr.length) {
          ProductSubCatArr.push($scope.catIdArr[$scope.catIdArr.length - 1]);
        } else {
          ProductSubCatArr.push($scope.selected_det_sub_cat.id);
        }
        if ($scope.selected_det_sub_cat.id) {
          ProductDetSubCatArr.push($scope.selected_det_sub_cat.id);
        } else if (!$scope.selected_det_sub_cat.id && $scope.catIdArr[$scope.catIdArr.length - 1]) {
          ProductDetSubCatArr.push($scope.catIdArr[$scope.catIdArr.length - 1])
        } else if (!$scope.selected_det_sub_cat.id && !$scope.catIdArr.length) {
          ProductDetSubCatArr.push($scope.category_selected);
        }
      }

      let productCatIds = ProductCatArr.join('#');
      let productSubCatIds = ProductSubCatArr.join('#');
      let ProductDetSubCatIds = ProductDetSubCatArr.join('#');
      var productIds = $scope.selected_products.join('#');

      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.sectionId = 30;
      param_data.productId = productIds;
      param_data.supplierId = $stateParams.id;
      param_data.categoryId = productCatIds;
      param_data.subCategoryId = productSubCatIds;
      param_data.detailedSubCategoryId = ProductDetSubCatIds;

      let catIds = [...$scope.catIdArr];
      if ($scope.selected_det_sub_cat.id) catIds.push($scope.selected_det_sub_cat.id);

      if ($scope.sup_branch_id) {
        param_data.branchId = $scope.sup_branch_id;
        services.POST_DATA(param_data, API.ASSIGN_PRODUCTS_TO_BRANCH(), function (data) {
          services.SUCCESS_MODAL(true);
          $state.go("production.supplierProducts", { id: $stateParams.id, b_id: $scope.sup_branch_id, cat_id: $scope.category_selected, sub_cat_ids: catIds.join() });
        });
      } else {
        services.POST_DATA(param_data, API.ASSIGN_PRODUCTS(), function (data) {
          services.SUCCESS_MODAL(true);
          $state.go("production.supplierProducts", { id: $stateParams.id, cat_id: $scope.category_selected, sub_cat_ids: catIds.join() });
        });
      }
    };

    var mapPoducts = function (data, page) {
      $scope.dataLoaded = true;
      $scope.count = data['product_count'];
      $scope.products = data['products'];
      if ($scope.products.length) {

        let lang_index = localStorage.getItem('lang') != 'en' ? 1 : 0;

        $scope.products.map(product => {
          product['name_en'] = product.names.length > lang_index ? product.names[lang_index].name : '';
          product['desc_en'] = product.names.length > lang_index ? product.names[lang_index].product_desc : '';

          if (product.price && product.price.length) {
            let regular_price = (product.price).find(el => el.price_type == 0);
            let discount_price = (product.price).find(el => el.price_type == 1);
            product['regular_price'] = regular_price ? (parseFloat(regular_price.price)).toFixed(2) : null;
            product['discount_price'] = discount_price ? (parseFloat(discount_price.price)).toFixed(2) : null;
          }
        });
      }
      $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
    }

    var productList = function (page) {

      let param_data = {};
      param_data.subCategoryId = undefined;
      param_data.detailedSubCategoryId = undefined;

      var supplierId = $stateParams.id;
      param_data.section_id = 30;
      param_data.supplierId = supplierId;
      param_data.categoryId = $scope.category_selected;
      if ($scope.catIdArr.length > 0) {
        param_data.subCategoryId = $scope.catIdArr[$scope.catIdArr.length - 1];
      }
      param_data.limit = $scope.limit;
      param_data.offset = $scope.skip;
      param_data.serachText = $scope.search;
      param_data.serachType = $scope.search ? 1 : 0;

      param_data.detailedSubCategoryId = $scope.selected_det_sub_cat.id;
      if (param_data.subCategoryId == undefined) {
        param_data.subCategoryId = param_data.detailedSubCategoryId;
      }

      if (param_data.subCategoryId == undefined && param_data.detailedSubCategoryId == undefined) {
        param_data.detailedSubCategoryId = param_data.categoryId;
        param_data.subCategoryId = param_data.categoryId;
      }

      $scope.dataLoaded = false;
      if ($stateParams.b_id) {
        // if ($stateParams.multi_b == 1) {
        //   param_data.branchId = $stateParams.b_id;
        //   services.listSupplierProducts($scope, param_data, function (data) {
        //     mapPoducts(data, page);
        //   });
        // } else {
        services.listProducts($scope, param_data, function (data) {
          mapPoducts(data, page);
        });
        // }
      } else {
        services.listProducts($scope, param_data, function (data) {
          mapPoducts(data, page);
        });
      }
    };

    $scope.viewProducts = function () {
      let catIds = [...$scope.catIdArr];
      if ($scope.selected_det_sub_cat.id) catIds.push($scope.selected_det_sub_cat.id);

      if ($scope.sup_branch_id) {
        $state.go("production.supplierProducts", { id: $stateParams.id, b_id: $scope.sup_branch_id, cat_id: $scope.category_selected, sub_cat_ids: catIds.join() });
      } else {
        $state.go("production.supplierProducts", { id: $stateParams.id, cat_id: $scope.category_selected, sub_cat_ids: catIds.join() });
      }
    }

    $scope.setPage = function (page) {
      $scope.currentPage = page;
      $scope.skip = $scope.limit * (page - 1);
      productList(page);
    }

    $scope.viewDescription = function (text) {
      $scope.read_more_text = text;
      $("#readMore").modal('show');
    }

    $scope.refresh = function () {
      $scope.skip = 0;
      productList(1);
    }

    $scope.searchProduct = function (keyEvent) {
      if (keyEvent.which === 13) {
        $scope.search = keyEvent.target.value;
        $scope.currentPage = 1;
        $scope.skip = 0;
        productList(1);
      }
    }

  }]);