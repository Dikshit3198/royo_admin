Royo.controller('SupplierProfileSetupTwoCtrl', ['$scope', '$rootScope', 'factories', 'services', '$stateParams','$translate' ,'$state', 'API', 'constants', '$filter',
  function ($scope, $rootScope, factories, services, $stateParams, $translate, $state, API, constants, $filter) {

    $scope.categoryData = [];
    $scope.selected_parentIndex = 0;
    $scope.selected_childIndex = 0;
    $scope.selectedCat = [];
    $scope.products = [];
    $scope.category_selected = '';
    $scope.is_product = false;
    $scope.is_assigned = false;
    $scope.selected_cat_for_assign = [];
    $scope.settings = factories.getSettings();
    $scope.message = '';
    $scope.dataLoaded = false;
    $scope.supplier_id = $stateParams.id;
    $scope.generic_category = [];
    $scope.selectedCatOrder = {}
    $scope.selectedCatProduct = []
    $scope.allCategories = []
    $scope.orderedCat = []
    $scope.orderedCatProduct = []
    $scope.isProductOrder = false
    $scope.allProducts = []
    $scope.query = ''
    $scope.orderList = 'order_no' // name
    $scope.totalProducts = 0;

    $scope.has_any_product = 0;

    $scope.changeView = function (val) {
      $scope.is_assigned = val;
      $scope.categoryData = [];
      $scope.selected_parentIndex = -1;
      $scope.selected_childIndex = -1;
      $scope.selectedCat = [];
      $scope.products = [];
      $scope.category_selected = '';
      if (val) {
        getAllAdminCategories(!val);
      }
      else {
        getCategories(!val);
      }
    }

    $rootScope.$broadcast('supplier_id', {
      supplier_id: $scope.supplier_id,
      tab: $stateParams.tab
    });

    if ($scope.settings) {
      $scope.isProductCustomTabDescEnable = $scope.settings.key_value.isProductCustomTabDescriptionEnable ? JSON.parse($scope.settings.key_value.isProductCustomTabDescriptionEnable) : 0;
      if ($scope.isProductCustomTabDescEnable == 1) {
        $scope.$on('supplier_data', getSupplierData);
        function getSupplierData($event, data) {
          if (!!data) {
            localStorage.setItem('productCustomTabDescriptionLabelSelected', data.productCustomTabDescriptionLabelSelected);
          }
        }
      }
    }




    $scope.$on('supplier_data', getSupplierData);
    function getSupplierData($event, data) {
      if (!!data) {
        if ($rootScope.enable_in_out_network == 1) {
          $scope.is_out_network = data.is_out_network;
        }
      }
    }



    var getCategories = function (is_supplier) {
      let params = { supplier_id: $scope.supplier_id };
      params.language_id = localStorage.getItem('lang') != 'en' ? 15 : 14;
      services.GET_DATA(params, API.CATEGORY_LIST(), function (data) {
        let categories = data.data;
        if (categories.length) {
          if (factories.getSettings().key_value.category_sequence == 1 || 
          factories.getSettings().key_value.supplier_branch_category_sequence_admin == 1) {
            categories.forEach(category => {
              category['order_no'] = parseInt(category.order_no)
            });
          }
          let selected_cat = {};
          let selected_index = 0;
          let generic_index = categories.findIndex(el => el.id == 1);
          if (generic_index > -1) {
            $scope.generic_category = categories.splice(generic_index, 1);
          }

          if ($scope.is_assigned) {
            selected_cat = (categories)[0];
            selected_index = 0;
          } else {
            selected_cat = (categories).find(cat => cat.is_assign == 1);
            selected_index = (categories).findIndex(cat => cat.is_assign == 1);
          }

          $scope.category_selected = selected_cat ? selected_cat.id : '';
          if (!is_supplier) {
            (categories).map(cat => {
              cat['checked'] = cat['is_assign'];
            });
            let no_subcat_present = (categories).some(cat => {
              return !cat.sub_category || (!!cat.sub_category && !cat.sub_category.length)
            });
            $scope.categoryData = [{ arr: categories, name: 'Categories', no_subcat_present: no_subcat_present, selected_cat_for_assign: [] }];
          } else {
            $scope.categoryData = [{ arr: categories, name: 'Categories' }];
          }
          // && is_supplier
          if (!!selected_cat && is_supplier) {
            if (selected_cat.sub_category.length) {
              $scope.selectCat(0, selected_index, selected_cat)
            } else {
              getSupplierProducts();
            }
          }
        }
      });
    };
    var getAllAdminCategories = function (is_supplier) {
      let params = {
        supplier_id: $scope.supplier_id,
        is_assigned_cat_include: 0
      };
      params.language_id = localStorage.getItem('lang') != 'en' ? 15 : 14;
      services.GET_DATA(params, API.CATEGORY_LIST(), function (data) {
        let categories = data.data;
        console.log("Categories", categories);
        if (categories.length) {
          if (factories.getSettings().key_value.category_sequence == 1 || 
          factories.getSettings().key_value.supplier_branch_category_sequence_admin == 1) {
            categories.forEach(category => {
              category['order_no'] = parseInt(category.order_no)
            });
          }
          let selected_cat = {};
          let selected_index = 0;
          let generic_index = categories.findIndex(el => el.id == 1);
          if (generic_index > -1) {
            $scope.generic_category = categories.splice(generic_index, 1);
          }

          if ($scope.is_assigned) {
            selected_cat = (categories)[0];
            selected_index = 0;
          } else {
            selected_cat = (categories).find(cat => cat.is_assign == 1);
            selected_index = (categories).findIndex(cat => cat.is_assign == 1);
          }

          $scope.category_selected = selected_cat ? selected_cat.id : '';
          if (!is_supplier) {
            (categories).map(cat => {
              cat['checked'] = cat['is_assign'];
            });
            let no_subcat_present = (categories).some(cat => {
              return !cat.sub_category || (!!cat.sub_category && !cat.sub_category.length)
            });
            $scope.categoryData = [{ arr: categories, name: 'Categories', no_subcat_present: no_subcat_present, selected_cat_for_assign: [] }];
          } else {
            $scope.categoryData = [{ arr: categories, name: 'Categories' }];
          }
          // && is_supplier
          if (!!selected_cat && is_supplier) {
            if (selected_cat.sub_category.length) {
              $scope.selectCat(0, selected_index, selected_cat)
            } else {
              getSupplierProducts();
            }
          }
        }
      });
    };
    if ($stateParams.multi_b == 1 && factories.getSettings().key_value.branch_flow == 1) {
      $scope.is_multi_branch = 1;
      $scope.changeView(true);
    } else {
      getCategories(true);
    }

    var getSupplierProducts = function () {
      $scope.is_product = true;
      let param_data = {};
      param_data.section_id = 30;
      param_data.categoryId = $scope.category_selected;
      param_data.supplierId = $scope.supplier_id;
      param_data.limit = 50;
      param_data.offset = 0;
      param_data.serachText = '';
      param_data.serachType = 0;

      if ($scope.selectedCat.length > 0) {
        param_data.subCategoryId = $scope.selectedCat[$scope.selectedCat.length - 1];
        if ($scope.selectedCat.length > 1) {
          param_data.subCategoryId = $scope.selectedCat[$scope.selectedCat.length - 2];
          param_data.detailedSubCategoryId = $scope.selectedCat[$scope.selectedCat.length - 1];
        }
      }

      if (param_data.subCategoryId == undefined) {
        param_data.subCategoryId = param_data.categoryId;
      }
      if (param_data.detailedSubCategoryId == undefined && param_data.subCategoryId) {
        param_data.detailedSubCategoryId = param_data.subCategoryId;
      }
      if (param_data.subCategoryId == undefined && param_data.detailedSubCategoryId == undefined) {
        param_data.detailedSubCategoryId = param_data.categoryId;
        param_data.subCategoryId = param_data.categoryId;
      }

      $scope.dataLoaded = false;

      // if ($stateParams.multi_b == 0) {
      param_data['branchId'] = $stateParams.b_id;
      services.listSupBranchProducts($scope, param_data, function (data) {
        $scope.products = data.products;
        if (!$scope.has_any_product && $scope.is_out_network && $scope.products.length) {
          $scope.has_any_product = 1;
        }
        $scope.dataLoaded = true;
      });
      // } else {
      //   services.listSupplierProducts($scope, param_data, function (data) {
      //     $scope.products = data.products;
      //     $scope.dataLoaded = true;
      //   });
      // }
    }

    var getAllProducts = function () {
      $scope.is_product = true;
      let param_data = {};
      param_data.section_id = 30;
      param_data.categoryId = $scope.category_selected;
      param_data.supplierId = $scope.supplier_id;
      param_data.limit = $scope.totalProducts < 10 ? 10 : $scope.totalProducts;
      param_data.offset = 0;
      param_data.serachText = '';
      param_data.serachType = 0;
      if ($scope.selectedCat.length > 0) {
        param_data.subCategoryId = $scope.selectedCat[0];
        param_data.detailedSubCategoryId = $scope.selectedCat[1];
      }
      if (param_data.subCategoryId == undefined) {
        param_data.subCategoryId = param_data.detailedSubCategoryId;
      }
      if (param_data.detailedSubCategoryId == undefined && param_data.subCategoryId) {
        param_data.detailedSubCategoryId = param_data.subCategoryId;
      }
      if (param_data.subCategoryId == undefined && param_data.detailedSubCategoryId == undefined) {
        param_data.detailedSubCategoryId = param_data.categoryId;
        param_data.subCategoryId = param_data.categoryId;
      }

      $scope.dataLoaded = false;
      param_data['branchId'] = $stateParams.b_id;
      services.listSupBranchProducts($scope, param_data, function (data) {
        $scope.allProducts = data.products;
        $scope.dataLoaded = true;
        $scope.isProductOrder = true
        $scope.selectedCatProduct = data
        $scope.items = []
        $scope.allProducts.forEach(item => {
          $scope.items.push(item.name + '.' + item.id)
        })
        document.getElementById('OpenProductOrder').click()
        $scope.orderedCatProduct = []
      });
    }


    $scope.toProduct = function (type, id) {
      let params = {};
      params.cat_id = $scope.category_selected;
      params.id = $scope.supplier_id;
      params.level = 0;
      if ($scope.selectedCat.length) {
        params.sub_cat_ids = $scope.selectedCat.join();
      }
      // if ($scope.settings.screenFlow[0].is_multiple_branch == 0) {
      //   params.b_id = $scope.settings.supplier_branch_id;
      // }
      // if ($stateParams.multi_b == 0) {
      params['multi_b'] = $stateParams.multi_b;
      params['b_id'] = $stateParams.b_id;
      params['is_out_network'] = $scope.is_out_network;
      // }
      $state.go('production.supplierProducts', params);
      setTimeout(() => {
        $rootScope.$broadcast('is_sup_product_add_edit', { type: type, product_id: id });
      }, 1200);
    }

    $scope.setCatOrder = function (data) {
      $scope.isProductOrder = false
      $scope.selectedCatOrder = data
      $scope.allCategories = []
      $scope.allCategories = data.arr
      $scope.items = []

      data.arr.forEach(item => {
        if (item.is_assign) {
          $scope.items.push(item.name)
        }
      })
      $scope.orderedCat = []
    }


    $scope.SubmitCatSequence = function () {
      $scope.orderedCat = []
      $scope.items.forEach(item => {
        $scope.allCategories.forEach(cat => {
          if (cat.name == item) {
            $scope.orderedCat.push(cat)
          }
        })
      })
      let catOrder = [];
      for (let i = 0; i <= $scope.orderedCat.length - 1; i++) {
        let obj = {
          categoryId: $scope.selectedCatOrder.parent_cat ? $scope.selectedCatOrder.parent_cat.id : $scope.orderedCat[i].id,
          subCategoryId: $scope.selectedCatOrder.parent_cat ? $scope.orderedCat[i].id : 0,
          detailSubCategoryId: 0,
          order_no: 0
        }
        if (i < 9) {
          obj.order_no = Number($scope.selectedCatOrder.parent_cat ? ($scope.selectedCatOrder.parent_cat.order_no + '.' + '0' + (i + 1)) : i + 1) // '0' + 
        } else {
          obj.order_no = Number($scope.selectedCatOrder.parent_cat ? ($scope.selectedCatOrder.parent_cat.order_no + '.' + (i + 1)) : i + 1)
        }
        catOrder.push(obj)
      }
      let param_data = {
        accessToken: constants.ACCESSTOKEN,
        sectionId: 22,
        supplierId: $scope.supplier_id,
        categoryOrder: catOrder,
        isSubCat: $scope.selectedCatOrder.parent_cat ? true : false
      }
      services.changeSupplierCatOrder(param_data, function (data) {
        if (data) {
          document.getElementById('closeCatOrder').click()
          getCategories(true)
        }
      })
    }

    $scope.setProductOrder = function () {
      getAllProducts()

    }



    $scope.SubmitProductSequence = function () {
      $scope.orderedCatProduct = []
      $scope.items.forEach(item => {
        let cat = {}
        $scope.products.forEach(product => {
          if (product.id == item.split('.')[1]) {
            $scope.orderedCatProduct.push(product)
          }
        })
      })
      let productOrder = []
      for (let i = 0; i <= $scope.orderedCatProduct.length - 1; i++) {
        let obj = {
          product_id: $scope.orderedCatProduct[i].id,
          order_no: i + 1
        }
        productOrder.push(obj)
      }
      let param_data = {}
      param_data.accessToken = constants.ACCESSTOKEN,
        param_data.sectionId = 30;
      param_data.categoryId = $scope.category_selected;
      // param_data.supplierId = $scope.supplier_id;
      param_data['branchId'] = $stateParams.b_id;
      if ($scope.selectedCat.length > 0) {
        param_data.subCategoryId = $scope.selectedCat[0];
        param_data.detailedSubCategoryId = $scope.selectedCat[1];
      }
      if (param_data.subCategoryId == undefined) {
        param_data.subCategoryId = param_data.detailedSubCategoryId;
      }
      if (param_data.detailedSubCategoryId == undefined && param_data.subCategoryId) {
        param_data.detailedSubCategoryId = param_data.subCategoryId;
      }
      if (param_data.subCategoryId == undefined && param_data.detailedSubCategoryId == undefined) {
        param_data.detailedSubCategoryId = param_data.categoryId;
        param_data.subCategoryId = param_data.categoryId;
      }
      param_data.productOrder = productOrder
      services.changeBranchProdutOrder(param_data, function (data) {
        if (data) {
          document.getElementById('closeProductOrder').click()
          getSupplierProducts()
        }
      })
    }

    $scope.selectCat = function (parentIndex, childIndex, category) {
      $scope.is_product = false;
      $scope.selected_parentIndex = parentIndex;
      $scope.selected_childIndex = childIndex;
      if (parentIndex == 0) {
        $scope.category_selected = category.id;
        $scope.selectedCat = [];
      }
      $scope.categoryData.splice(parentIndex + 1, $scope.categoryData.length);
      $scope.selectedCat.splice(parentIndex + 1, $scope.selectedCat.length);

      if (parentIndex > 0) {
        if (!!$scope.selectedCat[parentIndex - 1]) {
          $scope.selectedCat[parentIndex - 1] = category.id;
          if ($scope.selectedCat.length > parentIndex) {
            $scope.selectedCat.splice(parentIndex, $scope.selectedCat.length - 1)
          }
        } else {
          $scope.selectedCat.push(category.id);
        }
      }

      if (!!category.sub_category && category.sub_category.length) {
        if (parentIndex != 0) {
          $scope.selectedCat.push(category.id);
        }
        $scope.categoryData.push({ arr: category.sub_category, name: category.name, parent_cat: category });
      } else {
        $scope.products = [];
        getSupplierProducts();
      }
    }

    $scope.selectAssignCategory = function (parentIndex, childIndex, category) {
      $scope.selected_parentIndex = parentIndex;
      $scope.selected_childIndex = childIndex;
      if (parentIndex == 0) {
        $scope.category_selected = category.id;
        $scope.selectedCat = [];
      }
      $scope.categoryData.splice(parentIndex + 1, $scope.categoryData.length);
      $scope.selectedCat.splice(parentIndex + 1, $scope.selectedCat.length);
      if (!!category.sub_category && category.sub_category.length) {
        if (parentIndex != 0) {
          $scope.selectedCat.push(category.id);
        }
        (category.sub_category).map(cat => {
          cat['checked'] = cat['is_assign'];
        });
        let no_subcat_present = (category.sub_category).some(cat => {
          return !cat.sub_category || (!!cat.sub_category && !cat.sub_category.length)
        });
        $scope.categoryData.push({ arr: category.sub_category, name: category.name, no_subcat_present: no_subcat_present, selected_cat_for_assign: [], parent_cat: category });
      } else {
        $scope.selectedCat.push(category.id);
      }
    }

    $scope.selectedCategoriesForAssignment = function (category, catArr, parentIndex) {
      $scope.selected_parentIndex = parentIndex;
      $scope.categoryData[parentIndex].selected_cat_for_assign = [];
      category.checked = !category.checked;
      $scope.categoryData[parentIndex].selected_cat_for_assign = catArr;
    }

    var getSubCat = function (catData, el) {
      catData.data.push({
        id: el,
        data: []
      });
      return catData.data[0];
    }


    $scope.assignSelectedCategories = function (is_single, category_id, catData) {
      let selectedCategories = [];
      selectedCategories.push({
        id: $scope.category_selected,
        data: []
      });

      if (!is_single && !category_id) {
        if ($scope.selectedCat.length) {
          let subcat = selectedCategories[0];
          $scope.selectedCat.forEach(el => {
            subcat = getSubCat(subcat, el);
          });
          catData.selected_cat_for_assign.forEach(cat => {
            if (cat.checked) {
              subcat.data.push({
                id: cat.id,
                data: []
              });
            }
          });
        } else {
          if ($scope.selected_parentIndex > 0) {
            catData.selected_cat_for_assign.forEach(cat => {
              if (cat.checked) {
                selectedCategories[0].data.push({
                  id: cat.id,
                  data: []
                });
              }
            });
          } else {
            selectedCategories = []
            catData.selected_cat_for_assign.forEach(cat => {
              if (cat.checked) {
                selectedCategories.push({
                  id: cat.id,
                  data: []
                });
              }
            });
          }
        }
      } else {
        selectedCategories = [{
          id: category_id,
          data: []
        }]
      }


      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.sectionId = 22;
      param_data.supplierId = ($scope.supplier_id).toString();
      param_data.categoryString = JSON.stringify(selectedCategories);
      // param_data.subCategoryString = $scope.selectedCat.length ? ($scope.selectedCat[$scope.selectedCat.length - 1]).toString() : ($scope.category_selected).toString();
      param_data.subCategoryString = ($scope.category_selected).toString();

      services.POST_DATA(param_data, API.ADD_SUPPLIER_CATEGORY, function (response) {
        $scope.message = `${$translate.instant(is_single ? 'Category' : 'Categories')} ${$translate.instant('assigned successfully')}`;
        services.SUCCESS_MODAL(true);
        if ($stateParams.multi_b == 1) {
          $scope.changeView(true);
        } else {
          $scope.changeView(false);
        }
      });
    }

    $scope.removeCategory = function (category, parentIndex) {
      services.CONFIRM(`You want to remove this category`,
        function (isConfirm) {
          if (isConfirm) {
            var param_data = {};
            param_data.accessToken = constants.ACCESSTOKEN;
            param_data.sectionId = 22;
            param_data.id = category.id;
            param_data.suplierId = $scope.supplier_id;
            param_data.deleteValue = 1;

            services.POST_DATA(param_data, API.DELETE_SUPPLIER_CATEGORY, function (response) {
              $scope.message = `${$translate.instant('Category removed from')} ${(factories.localisation()).supplier}`;
              services.SUCCESS_MODAL(true);
              category.is_assign = 0;
              category.checked = false;
              if ($scope.categoryData[parentIndex].selected_cat_for_assign.length) {
                $scope.categoryData[parentIndex].selected_cat_for_assign.forEach(cat => {
                  if (cat.id == category.id) {
                    cat['checked'] = false;
                  }
                });
              }
            });
          }
        });
    }

    $scope.assignProducts = function () {
      let params = {
        id: $scope.supplier_id,
        cat_id: $scope.category_selected
      };
      // if($stateParams.multi_b == 0) {
      params['multi_b'] = $stateParams.multi_b;
      params['b_id'] = $stateParams.b_id;
      // }
      if ($scope.selectedCat.length) {
        params.sub_cat_ids = $scope.selectedCat.join();
      }
      $state.go('production.assignProducts', params);
    }

    $scope.genericProducts = function () {
      $scope.category_selected = $scope.generic_category[0].id;
      $scope.toProduct('LIST');
    }

  }]);