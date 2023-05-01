Royo.controller('PackageCtrl', ['$scope', 'services', 'factories', 'constants', '$filter', '$timeout', 'API',
  function ($scope, services, factories, constants, $filter, $timeout, API) {
    $scope.main = {};
    $scope.outputs = {};
    $scope.edit = {};
    $scope.category = {};
    $scope.is_activate = 0;
    $scope.is_loader = 1;
    $scope.is_view_city = 0;
    $scope.change_view = 0;
    $scope.changePkg = 1;
    $scope.msr_unit = {};
    $scope.commission_type = 1;
    $scope.product = {};
    $scope.is_activate = 0;
    $scope.is_view_city = 0;
    $scope.is_view_select = 0;
    $scope.is_assigned_sub = 1;
    $scope.show = 1;
    $scope.pkg_stat = 1;
    $scope.totalPrice = 0;
    $scope.datePicker = {};
    $scope.product.totalPrice = 0;

    //Currency Drag Drop..
    $scope.listA = [];
    $scope.listB = [];

    $scope.moveToListB = function (item) {
      $scope.listB.push(item);
      $scope.listA.splice($scope.listA.indexOf(item), 1);
      productSum(item.price, 1);
    };

    $scope.moveToListA = function (item) {
      $scope.listA.push(item);
      $scope.listB.splice($scope.listB.indexOf(item), 1);
      productSum(item.price, 0);

    };

    $scope.changeDet = function () {

      $timeout(function () {

        if (Object.keys($scope.selected_sub_cat).length == 0) {
          var subCat = { id: 0, name: "" };
        } else {
          subCat = $scope.selected_sub_cat;
        }
        if (Object.keys($scope.selected_det_sub_cat).length == 0) {
          var detSubCat = { id: 0, name: "" };
        } else {
          detSubCat = $scope.selected_det_sub_cat;
        }

        $scope.listBranchProducts($scope.supplier_data, $scope.selected_category, $scope.selected_branch);
      }, 1500);
    }

    var productSum = function (productPrice, flag) {

      var num1 = $scope.product.totalPrice;
      var num2 = parseFloat(productPrice);
      // .toFixed(2)
      // return false
      if (!$scope.product.totalPrice) {
        $scope.product.totalPrice = 0;
      }
      if (flag == 1) {
        // $scope.product.totalPrice = parseFloat($scope.product.totalPrice).toFixed(2) + parseFloat(productPrice).toFixed(2);
        $scope.product.totalPrice = num1 + num2;
      }
      else {
        // $scope.product.totalPrice = parseFloat($scope.product.totalPrice).toFixed(2) - parseFloat(productPrice).toFixed(2);
        if (num1 - num2 < 0) {
          var subs = 0;
        } else {
          subs = num1 - num2;
        }
        $scope.product.totalPrice = subs;
      }
    };

    //Packages..
    $scope.packages = [{
      name: "Buy X+Y+Z For X1 (Package)",
      value: 1
    }, {
      name: "Buy X Get X",
      value: 2
    }, {
      name: "Buy X Get Y",
      value: 3
    }, {
      name: "Min Amount Purchase Get Y Service",
      value: 4
    }];

    $scope.selected_package = $scope.packages[0];
    $scope.dynamicSubCategories = [];

    //Category Select Functions..
    $scope.onSelectCategory = function (Id) {
      // $scope.selected_sub_cat = [];
      // $scope.selected_det_sub_cat = [];
      // $scope.det_sub_categories = [];
      $scope.catIdArr = [];
      $scope.selectedCategoryId = Id
      let params = {};
      params.categoryId = Id;
      params.section_id = 30;
      services.listSupplier($scope, params, function (supplierListData) {
        $scope.supplier_list = supplierListData;
        if (supplierListData.length != 0) {

          $scope.selected_supplier = supplierListData[0];
          $scope.onSelectSupplier(supplierListData[0].id);

          if (Id) {
            let param_data = {};
            param_data.subCatId = Id;
            param_data.sectionId = 30;
            param_data.supplierId = supplierListData[0].id;
            param_data.level = 1;

            services.getSubCategoryData($scope, param_data, function (data) {
              if (data.length > 0) {
                $scope.selectedCategory = [];
                $scope.dynamicSubCategories = [];
                $scope.dynamicSubCategories.push(data);
              } else {
                $scope.listBranchProducts($scope.suplierId, { id: $scope.selectedCategoryId }, $scope.selected_branch);
              }
            });
          }
        } else {
          $scope.changeDet();
        }
      });
    };

    // $scope.changeDetCat = function (val, stat) {

    //     $scope.selected_det_sub_cat = val;
    //     if (stat == 1) {
    //         $scope.changeDet();
    //     }
    // };

    // $scope.onSelectSubCategory = function (Id, stat) {
    //     $scope.selected_det_sub_cat = [];

    //     var param_data = {};
    //     param_data.section_id = 30;
    //     param_data.categoryId = Id;
    //     services.listSubCat($scope, param_data, function (detSubCategoryData) {
    //         $scope.det_sub_categories = detSubCategoryData;
    //         if (detSubCategoryData.length != 0) {
    //             $scope.selected_det_sub_cat = detSubCategoryData[0];
    //             if (stat) {
    //                 $scope.changeDetCat(detSubCategoryData[0], 1);
    //             } else {
    //                 $scope.changeDetCat(detSubCategoryData[0], 0);
    //             }
    //         } else {
    //             $scope.changeDet();
    //         }

    //     });
    // };

    $scope.selectedCategory = [];
    $scope.changeSubCatId = function (subCatData, catIndex) {

      $scope.selected_det_sub_cat = subCatData;
      if (!!subCatData && !!subCatData.id) {
        let param_data = {};
        param_data.subCatId = subCatData.id;
        param_data.sectionId = 30;
        param_data.supplierId = $scope.suplierId;

        services.getSubCategoryData($scope, param_data, function (data) {

          if ($scope.catIdArr[catIndex] === -1) {
            $scope.catIdArr.push(param_data.subCatId);
          } else {
            $scope.catIdArr[catIndex] = param_data.subCatId;
            $scope.catIdArr.splice(catIndex + 1, $scope.catIdArr.length - 1)
          }

          if (data.length > 0) {
            if (catIndex == $scope.dynamicSubCategories.length - 1) {
              $scope.dynamicSubCategories.push(data);
            } else {
              $scope.dynamicSubCategories[catIndex + 1] = data;
              $scope.dynamicSubCategories.splice((catIndex + 2), ($scope.dynamicSubCategories.length - 1));
            }
          } else {
            $scope.dynamicSubCategories.splice((catIndex + 1), ($scope.dynamicSubCategories.length - 1));
            // getYProducts();
            $scope.listBranchProducts($scope.suplierId, { id: $scope.selectedCategoryId }, $scope.selected_branch);
          }
        });
      }
    };

    $scope.onSelectSupplier = function (supData) {
      $scope.listB = [];
      $scope.branches = {};
      $scope.selected_branch = [];

      $scope.suplierId = supData;

      var param_data = {};
      param_data.Id = supData;
      param_data.section_id = 31;
      services.listBranch($scope, param_data, function (supplierData) {

        var branch;
        if (supplierData.length == 0) {
          branch = { id: 0, name: "", branch_name: "" };
        } else {
          $scope.branches = supplierData;
          $scope.selected_branch = supplierData[0];
          branch = supplierData[0];
        }

        $timeout(function () {

          param_data.section_id = 30;
          param_data.supplierId = supData;
          services.listSupplierCategories($scope, param_data, function (categoryData) {

            $scope.sup_sub_categories = {};
            $scope.sup_det_sub_categories = {};
            $scope.sup_categories = categoryData;
            $scope.selected_sup_cat = categoryData[0];

            $scope.onSelectSupCategory(categoryData[0]);
          });

          // $scope.listBranchProducts(supData, $scope.selected_category, branch);
        }, 1000);
      });
    };


    //Suplier Categories Functions..
    $scope.onSelectSupCategory = function (Id) {
      var Id_cat = Id.category_id;
      $scope.selected_sup_cat = Id;
      $scope.selected_sup_sub_cat = [];
      $scope.selected_sup_det_sub_cat = [];
      $scope.sup_det_sub_categories = [];
      $scope.catSupIdArr = [];

      if (Id_cat) {
        let param_data = {};
        param_data.subCatId = Id_cat;
        param_data.sectionId = 30;
        param_data.supplierId = $scope.suplierId;
        param_data.level = 1;

        services.getSubCategoryData($scope, param_data, function (data) {
          if (data.length > 0) {
            $scope.selectedSupCategory = [];
            $scope.dynamicSupSubCategories = [];
            $scope.dynamicSupSubCategories.push(data);
          }
        });
      }
    };


    $scope.dynamicSupSubCategories = [];
    $scope.selectedSupCategory = [];
    $scope.changeSupSubCatId = function (subCatData, catIndex) {

      $scope.selected_sup_det_sub_cat = subCatData;
      if (!!subCatData && !!subCatData.id) {
        let param_data = {};
        param_data.subCatId = subCatData.id;
        param_data.sectionId = 30;
        param_data.supplierId = $scope.suplierId

        services.getSubCategoryData($scope, param_data, function (data) {

          if ($scope.catSupIdArr[catIndex] === -1) {
            $scope.catSupIdArr.push(param_data.subCatId);
          } else {
            $scope.catSupIdArr[catIndex] = param_data.subCatId;
            $scope.catSupIdArr.splice(catIndex + 1, $scope.catSupIdArr.length - 1)
          }

          if (data.length > 0) {
            if (catIndex == $scope.dynamicSupSubCategories.length - 1) {
              $scope.dynamicSupSubCategories.push(data);
            } else {
              $scope.dynamicSupSubCategories[catIndex + 1] = data;
              $scope.dynamicSupSubCategories.splice((catIndex + 2), ($scope.dynamicSupSubCategories.length - 1));
            }
          } else {
            $scope.dynamicSupSubCategories.splice((catIndex + 1), ($scope.dynamicSupSubCategories.length - 1));
            // getYProducts();
            listBranchProducts();
          }
        });
      }
    };


    // $scope.onSelectSupSubCategory = function (Id) {

    //     $scope.selected_sup_sub_cat = Id;
    //     var Id_sub = Id.sub_category_id;
    //     $scope.selected_sup_det_sub_cat = [];
    //     var param_data = {};
    //     param_data.section_id = 30;
    //     param_data.subCategoryId = Id_sub;
    //     param_data.supplierId = $scope.suplierId;
    //     services.listSupplierDetSubCat($scope, param_data, function (detSubCategoryData) {
    //         $scope.sup_det_sub_categories = detSubCategoryData;
    //         if (detSubCategoryData.length != 0) {
    //             $scope.selected_sup_det_sub_cat = detSubCategoryData[0];

    //         }
    //         getYProducts();
    //     });
    // };

    // $scope.onSelectSupDetSubCategory = function (Data) {

    //     $scope.selected_sup_det_sub_cat = Data;
    //     getYProducts();
    // };

    // var getYProducts = function () {
    //     $scope.y_products = [];
    //     $scope.selected_product_3 = {};

    //     if (Object.keys($scope.selected_sup_sub_cat).length == 0) {
    //         var subCat = { id: 0, name: "" };
    //     } else {
    //         subCat = $scope.selected_sup_sub_cat;
    //     }
    //     if (Object.keys($scope.selected_sup_det_sub_cat).length == 0) {
    //         var detSubCat = { detailed_sub_category_id: 0, name: "" };
    //     } else {
    //         detSubCat = $scope.selected_sup_det_sub_cat;
    //     }

    //     listBranchProducts();
    // };

    $scope.listBranchProducts = function (supData, catData, branchData) {

      var param_data = {};
      param_data.supplierId = supData;
      param_data.section_id = 31;
      param_data.branchId = branchData.id;
      param_data.categoryId = catData.id;

      if ($scope.catIdArr.length > 0) {
        param_data.subCategoryId = $scope.catIdArr[$scope.catIdArr.length - 2];
      }
      param_data.detailedSubCategoryId = $scope.selected_det_sub_cat ? $scope.selected_det_sub_cat.id : undefined;

      if (param_data.subCategoryId == undefined) {
        param_data.subCategoryId = param_data.detailedSubCategoryId;
      }

      if (param_data.subCategoryId == undefined && param_data.detailedSubCategoryId == undefined) {
        param_data.detailedSubCategoryId = param_data.categoryId;
        param_data.subCategoryId = param_data.categoryId;
      }
      services.listBranchProductsForPromotion($scope, param_data, function (supplierData) {
        $scope.listA = supplierData;
        $scope.selected_product_1 = supplierData[0];
        $scope.selected_product_2 = supplierData[0];
        $scope.selected_product_3 = supplierData[0];
        $scope.selected_product_4 = supplierData[0];
      });

      if (param_data.subCategoryId && param_data.detailedSubCategoryId) {
        getListData(supData, catData, branchData);
      }

      $timeout(function () {
        getPromotionListData();
      }, 1500);
    };

    var listBranchProducts = function () {
      $scope.is_loader = 1;
      $scope.y_products = [];
      $scope.selected_product_3 = {};

      var param_data = {};
      param_data.section_id = 31;
      param_data.supplierId = $scope.suplierId;
      param_data.branchId = $scope.selected_branch.id;
      param_data.categoryId = $scope.selected_sup_cat.category_id;

      if ($scope.catSupIdArr.length > 0) {
        param_data.subCategoryId = $scope.catSupIdArr[$scope.catSupIdArr.length - 2];
      }
      param_data.detailedSubCategoryId = $scope.selected_sup_det_sub_cat.id;

      if (param_data.subCategoryId == undefined) {
        param_data.subCategoryId = param_data.detailedSubCategoryId;
      }

      if (param_data.subCategoryId == undefined && param_data.detailedSubCategoryId == undefined) {
        param_data.detailedSubCategoryId = param_data.categoryId;
        param_data.subCategoryId = param_data.categoryId;
      }

      services.listBranchProductsForPromotion($scope, param_data, function (productData) {
        $scope.y_products = productData;
        $scope.selected_product_3 = productData[0];
        $scope.is_loader = 0;
      });
    };

    //Call Get Home Page Data Service
    var getHomeData = function () {
      $scope.suppliers = {};
      $scope.selected_supplier = {};
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.filter = 0;
      param_data.sectionId = 31;
      services.POST_DATA(param_data, API.GET_HOME_DATA(), function (data) {        
        services.getSectionData(constants.CAT_PRODUCTION, 31, data.data, function (catData) {
          $scope.categories = catData;
          $scope.selected_category = catData[0];
          $scope.onSelectCategory(catData[0].id);
        });
      });
    };
    getHomeData();

    var getCurrencyList = function () {

      var param_data = {};
      param_data.section_id = 30;
      services.listCurrencies($scope, param_data, function (currencyData) {
        $scope.currencies = currencyData;
        $scope.selected_currency = currencyData[0];
      });
    };
    getCurrencyList();

    var getListData = function (supData, catData, branchData) {

      $scope.rows = {};
      var rows_data_Arr = [];
      var param_data = {};
      param_data.section_id = 31;
      param_data.supplierId = supData;
      param_data.branchId = branchData.id;
      param_data.categoryId = catData.id;

      if ($scope.catIdArr.length > 0) {
        param_data.subCategoryId = $scope.catIdArr[$scope.catIdArr.length - 2];
      }
      param_data.detailedSubCategoryId = $scope.selected_det_sub_cat ? $scope.selected_det_sub_cat.id : undefined;

      if (param_data.subCategoryId == undefined) {
        param_data.subCategoryId = param_data.detailedSubCategoryId;
      }

      if (param_data.subCategoryId == undefined && param_data.detailedSubCategoryId == undefined) {
        param_data.detailedSubCategoryId = param_data.categoryId;
        param_data.subCategoryId = param_data.categoryId;
      }

      services.listPackages($scope, param_data, function (sectionData) {
        var products = sectionData;
        for (var i = 0; i < products.length; i++) {

          var listData = {};
          listData['id'] = products[i].id;
          listData['is_live'] = products[i].is_live;
          listData['products'] = products[i].products;
          listData['category_id'] = products[i].category_id;
          if (products[i].names.length > 0) {
            listData['name'] = products[i].names[0].name;
          } else {
            listData['name'] = "";
          }
          if (products[i].chemical_tools_price_applicable == 1) {
            var userTool = 1;
          } else if (products[i].services_at_home_price_applicable == 1) {
            userTool = 2;
          } else {
            userTool = 0;
          }
          listData['user_tool'] = userTool;
          listData['#'] = i + 1;
          var country_obj_data = products[i].names;
          var lang_length = country_obj_data.length;
          for (var k = 0; k < lang_length; k++) {
            listData['NAME (' + country_obj_data[k].language_name + ')'] = country_obj_data[k].name;
            listData['DESCRIPTION (' + country_obj_data[k].language_name + ')'] = country_obj_data[k].package_desc;
            listData['MEASURING UNIT (' + country_obj_data[k].language_name + ')'] = country_obj_data[k].measuring_unit;
          }
          listData['ORIGINAL PRICE'] = products[i].display_price;
          listData['DISCOUNTED PRICE'] = products[i].price;
          listData['BAR CODE'] = products[i].bar_code;
          listData['SKU'] = products[i].sku;
          rows_data_Arr.push(listData);
        }

        $scope.rows = rows_data_Arr;
        $scope.noDataFound = false;
        if (rows_data_Arr.length != 0) {

          $scope.cols = Object.keys($scope.rows[0]);
          $scope.cols.splice(0, 6);
        } else {

          $scope.noDataFound = true;
        }
      });
    };

    var getPromotionListData = function () {

      if ($scope.selected_package.value == 1) {
        var promoType = 0;
      } else if ($scope.selected_package.value == 2) {
        promoType = 0;
      } else if ($scope.selected_package.value == 3) {
        promoType = 1;
      } else if ($scope.selected_package.value == 4) {
        promoType = 2;
      }

      $scope.rows_promo = {};
      var rows_data_Arr_Promo = [];
      var param_data = {};
      param_data.section_id = 31;
      param_data.supplierId = $scope.selected_supplier.id;
      if ($scope.selected_branch.length == 0) {
        param_data.branchId = 0;
      } else {
        param_data.branchId = $scope.selected_branch.id;
      }
      param_data.categoryId = $scope.selected_category.id;
      param_data.promotionType = promoType;

      if ($scope.catIdArr.length > 0) {
        param_data.subCategoryId = $scope.catIdArr[$scope.catIdArr.length - 2];
      }
      param_data.detailedSubCategoryId = $scope.selected_det_sub_cat ? $scope.selected_det_sub_cat.id : undefined;

      if (param_data.subCategoryId == undefined) {
        param_data.subCategoryId = param_data.detailedSubCategoryId;
      }

      if (param_data.subCategoryId == undefined && param_data.detailedSubCategoryId == undefined) {
        param_data.detailedSubCategoryId = param_data.categoryId;
        param_data.subCategoryId = param_data.categoryId;
      }
      services.listPromotions($scope, param_data, function (sectionData) {
        var products = sectionData;
        for (var i = 0; i < products.length; i++) {

          var listPromoData = {};
          listPromoData['id'] = products[i].id;
          if (products[i].names.length > 0) {
            listPromoData['name'] = products[i].names[0].promotion_name;
          } else {
            listPromoData['name'] = "";
          }
          listPromoData['product1'] = products[i].product1;
          listPromoData['product2'] = products[i].product2;
          listPromoData['promotion_image'] = products[i].promotion_image;
          listPromoData['#'] = i + 1;
          var country_obj_data = products[i].names;
          var lang_length = country_obj_data.length;
          for (var k = 0; k < lang_length; k++) {
            listPromoData['NAME (' + country_obj_data[k].language_name + ')'] = country_obj_data[k].promotion_name;
            listPromoData['DESCRIPTION (' + country_obj_data[k].language_name + ')'] = country_obj_data[k].promotion_description;
          }
          // listPromoData['PRICE'] = products[i].promotion_price;
          rows_data_Arr_Promo.push(listPromoData);
        }

        $scope.rows_promo = rows_data_Arr_Promo;
        $scope.noPromoDataFound = false;
        if (rows_data_Arr_Promo.length != 0) {

          $scope.cols_promo = Object.keys($scope.rows_promo[0]);
          $scope.cols_promo.splice(0, 4);
        } else {

          $scope.noPromoDataFound = true;
        }
      });
    };

    //On Change Functions..
    $scope.changePackageType = function (type) {

      $scope.selected_package = type;
      $scope.changePkg = type.value;
      if ($scope.selected_det_sub_cat && $scope.selected_det_sub_cat.id) {
        getPromotionListData();
      }
    };

    $scope.changeView = function (is_view) {

      $scope.is_view_city = is_view;
      $scope.change_view = is_view;
    };

    $scope.changeGetView = function (is_view) {

      $scope.pkg_stat = is_view;
      if (is_view == 0) {
        getPromotionListData();
      }
    };

    /*** Image Upload Function ***/
    /*** ===================== ***/
    //an array of files selected
    $scope.files = [];
    var fileArr = [];

    //listen for the file selected event
    $scope.$on("fileSelected", function (event, args) {
      $scope.$apply(function () {
        //add the file object to the scope's files collection
        $scope.files.push(args.file);
      });
    });

    /* Get to be uploading file and set it into a variable and read to show it on view */
    $scope.file_to_upload_for_image = function (File) {
      $scope.FileUploaded = File[0];

      var file = File[0];
      $scope.image_file = File[0];
      fileArr.push(File[0]);
      var imageType = /image.*/;
      if (!file.type.match(imageType)) {

        factories.invalidDataPop("Invalid file type selected");
      }
    };

    /*** Add Promo Data Form Append ***/
    /*** ============================ ***/
    // Dynamically add input fields
    $scope.inputs = [{
      type: "text",
      name: "english",
      placeholder: "Package Name (ENGLISH)"
    }, {
      type: "text",
      name: "arabic",
      placeholder: "Package Name (ARABIC)"
    }];

    $scope.inputs_desc = [{
      type: "text",
      name: "english",
      placeholder: "Package Description (ENGLISH)"
    }, {
      type: "text",
      name: "arabic",
      placeholder: "Package Description (ARABIC)"
    }];

    $scope.inputs_unit = [{
      type: "text",
      name: "english",
      placeholder: "Measuring Unit (ENGLISH)"
    }, {
      type: "text",
      name: "arabic",
      placeholder: "Measuring Unit (ARABIC)"
    }];

    var createInputs = function () {

      var rows_data_Arr = [];
      var rows_desc_data_Arr = [];
      var rows_unit_data_Arr = [];
      services.getLanguagesData($scope, function (lang_data) {

        var lang_id_data = [];
        var lang_name_data = [];
        for (var i = 0; i < lang_data.length; i++) {

          lang_id_data.push(lang_data[i].id);
          lang_name_data.push(lang_data[i].language_name);

          var listData = {};
          listData['type'] = "text";
          listData['name'] = $filter('lowercase')(lang_data[i].language_name);
          listData['placeholder'] = "Package Name (" + lang_data[i].language_name + ")";
          rows_data_Arr.push(listData);

          var listDescData = {};
          listDescData['type'] = "text";
          listDescData['name'] = $filter('lowercase')(lang_data[i].language_name);
          listDescData['placeholder'] = "Package Description (" + lang_data[i].language_name + ")";
          rows_desc_data_Arr.push(listDescData);

          var listUnitData = {};
          listUnitData['type'] = "text";
          listUnitData['name'] = $filter('lowercase')(lang_data[i].language_name);
          listUnitData['placeholder'] = "Measuring Unit (" + lang_data[i].language_name + ")";
          rows_unit_data_Arr.push(listUnitData);
        }

        $scope.lang_ids = lang_id_data.toString();
        $scope.language_name = lang_name_data.toString();
        $scope.inputs = rows_data_Arr;
        $scope.inputs_desc = rows_desc_data_Arr;
        $scope.inputs_unit = rows_unit_data_Arr;
        $scope.is_disabled_add = 0;
      });

    };
    createInputs();

    $scope.onProductChange = function (val, type) {

      if (type == 1) {
        $scope.selected_product_2 = val;
      }
      else if (type == 2) {
        $scope.selected_product_1 = val;
      }
      else if (type == 3) {
        $scope.selected_product_3 = val;
      }
      else if (type == 4) {
        $scope.selected_product_4 = val;
      }
    }

    /*** Add Promotion Data Form Submission & Other Events ***/
    /*** =============================================== ***/
    $scope.submitAdd = function () {

      if (fileArr.length == 0) {
        factories.invalidDataPop("Upload at least one image file ");
        return false;
      }
      var productsToSendArr = [];
      var displayPriceArr = [];

      for (var c = 0; c < $scope.listB.length; c++) {

        productsToSendArr.push($scope.listB[c].product_id);
        displayPriceArr.push($scope.listB[c].price);
      }

      function add(a, b) {
        return parseFloat(a) + parseFloat(b);
      }

      var displayPrice = displayPriceArr.reduce(add, 0);

      String.prototype.replaceAll = function (str1, str2, ignore) {
        return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"),
          (ignore ? "gi" : "g")), (typeof (str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
      };

      // $scope.is_disabled_add = 1;
      var nameData = $scope.outputs.inputs;
      services.getLangDataWithHash($scope, nameData, function (diffLangNameData) {
        var descNameData = $scope.outputs.inputs_desc;
        services.getLangDataWithHash($scope, descNameData, function (diffLangNameDescData) {
          var descNameData = $scope.msr_unit;
          services.getLangDataWithHash($scope, descNameData, function (diffLangNameUnitData) {

            var param_data = {};
            param_data.section_id = 31;
            param_data.supplierId = $scope.selected_supplier.id;
            param_data.branchId = $scope.selected_branch.id;
            param_data.categoryId = $scope.selected_category.id;
            // param_data.subCategoryId = $scope.selected_sub_cat.id;
            // param_data.detailedSubCategoryId = $scope.selected_det_sub_cat.id;

            if ($scope.catIdArr.length > 0) {
              param_data.subCategoryId = $scope.catIdArr[$scope.catIdArr.length - 2];
            }
            param_data.detailedSubCategoryId = $scope.selected_det_sub_cat ? $scope.selected_det_sub_cat.id : undefined;
            param_data.productIds = productsToSendArr.toString().replaceAll(",", "#");
            param_data.name = diffLangNameData.nameData;
            param_data.description = diffLangNameDescData.nameData;
            param_data.languageId = diffLangNameData.langData;
            param_data.priceUnit = $scope.selected_currency.id;
            param_data.measuringUnit = diffLangNameUnitData.nameData;
            //param_data.description = $scope.product.description;
            param_data.sku = $scope.product.sku;
            if ($scope.product.barcode) {
              param_data.barCode = $scope.product.barcode;
            } else {
              param_data.barCode = 0;
            }
            param_data.commissionType = $scope.commission_type;
            param_data.commission = $scope.product.commission;
            param_data.commissionPackage = 0;
            param_data.Count = fileArr.length;
            param_data.image = fileArr;
            param_data.startDate = new Date($scope.datePicker.date.startDate._d).toISOString();
            param_data.endDate = new Date($scope.datePicker.date.endDate._d).toISOString();
            param_data.displayPrice = displayPrice;
            param_data.price = $scope.product.totalPrice;

            if (param_data.subCategoryId == undefined) {
              param_data.subCategoryId = param_data.detailedSubCategoryId;
            }

            if (param_data.subCategoryId == undefined && param_data.detailedSubCategoryId == undefined) {
              param_data.detailedSubCategoryId = param_data.categoryId;
              param_data.subCategoryId = param_data.categoryId;
            }
            services.addPackages($scope, param_data, function (data) {
              angular.element("input[type='file']").val(null);
              $scope.is_disabled_add = 0;
              factories.successActionPop(data.message);
              $scope.outputs = {};
              $scope.product = {};
              $scope.msr_unit = {};
              $scope.listB = [];
              fileArr = [];
              getHomeData();
            });
          });
        });
      });
    };

    $scope.submitAddPromo = function (promoType) {
      if (fileArr.length == 0) {
        factories.invalidDataPop("Upload at least one image file ");
        return false;
      }

      // $scope.is_disabled_add = 1;
      var nameData = $scope.outputs.inputs;
      services.getLangDataWithHash($scope, nameData, function (diffLangNameData) {
        var descNameData = $scope.outputs.inputs_desc;
        services.getLangDataWithHash($scope, descNameData, function (diffLangNameDescData) {

          var param_data = {};
          param_data.section_id = 31;
          param_data.supplierId = $scope.selected_supplier.id;
          param_data.branchId = $scope.selected_branch.id;
          param_data.categoryId = $scope.selected_category.id;
          // param_data.subCategoryId = $scope.selected_sub_cat.id;
          // param_data.detailedSubCategoryId = $scope.selected_det_sub_cat.id;
          if ($scope.catIdArr.length > 0) {
            param_data.subCategoryId = $scope.catIdArr[$scope.catIdArr.length - 2];
          }
          param_data.detailedSubCategoryId = $scope.selected_det_sub_cat ? $scope.selected_det_sub_cat.id : undefined;
          param_data.name = diffLangNameData.nameData;
          param_data.description = diffLangNameDescData.nameData;
          param_data.image = fileArr[0];
          param_data.languageId = diffLangNameData.langData;
          param_data.promotionType = promoType;
          param_data.startDate = new Date($scope.datePicker.date.startDate._d).toISOString();
          param_data.endDate = new Date($scope.datePicker.date.endDate._d).toISOString();
          if (promoType == 1) {

            param_data.offerProduct1 = $scope.selected_product_1.product_id;
            param_data.offerProduct2 = $scope.selected_product_3.product_id;
          } else if (promoType == 2) {

            param_data.offerProduct1 = $scope.product.product_amount;
            param_data.offerProduct2 = $scope.selected_product_4.product_id;
          } else {

            param_data.offerProduct1 = $scope.selected_product_2.product_id;
            param_data.offerProduct2 = $scope.selected_product_2.product_id;
          }

          if (param_data.subCategoryId == undefined) {
            param_data.subCategoryId = param_data.detailedSubCategoryId;
          }

          if (param_data.subCategoryId == undefined && param_data.detailedSubCategoryId == undefined) {
            param_data.detailedSubCategoryId = param_data.categoryId;
            param_data.subCategoryId = param_data.categoryId;
          }
          services.addPromotion($scope, param_data, function (data) {
            angular.element("input[type='file']").val(null);
            $scope.is_disabled_add = 0;
            factories.successActionPop(data.message);
            $scope.outputs = {};
            $scope.product = {};
            $scope.msr_unit = {};
            fileArr = [];
            getHomeData();
          });
        });
      });
    };

    $scope.deletePackage = function (Id) {

      services.deletePop($scope.rows, Id, function (data) {
        if (typeof Id == "number") {
          Id = Id.toString();
        }
        var param_data = {};
        param_data.id = Id;
        param_data.section_id = 31;
        services.deletePackage($scope, param_data, function (data) {

          factories.spliceOnDelete($scope.rows, Id);
          swal("Deleted!", "", "success");
        });
      });
    };

    $scope.deletePromo = function (Id) {

      services.deletePop($scope.rows, Id, function (data) {
        if (typeof Id == "number") {
          Id = Id.toString();
        }
        var param_data = {};
        param_data.id = Id;
        param_data.section_id = 31;
        services.deletePromo($scope, param_data, function (data) {

          factories.spliceOnDelete($scope.rows_promo, Id);
          swal("Deleted!", "", "success");
        });
      });
    };

    $scope.activatePackage = function (Id, status) {
      if (typeof Id == "number") {
        Id = Id.toString();
      }
      var param_data = {};
      param_data.id = Id;
      param_data.section_id = 31;
      param_data.status = status;
      $scope.is_loader = 1;
      services.activateProduct($scope, param_data, function (data) {
        $scope.is_loader = 0;
        getPromotionListData();
        getListData($scope.suplierId, { id: $scope.selectedCategoryId }, $scope.selected_branch)
        // getHomeData();
      });
    };

  }]);