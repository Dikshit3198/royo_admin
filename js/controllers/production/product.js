Royo.controller('ProductsProdCtrl', ['$scope', '$rootScope', 'services', 'factories', 'constants', '$filter', '$stateParams', '$location', 'pagerService', 'API',
  function ($scope, $rootScope, services, factories, constants, $filter, $stateParams, $location, pagerService, API) {

    $scope.main = {};
    $scope.outputs = {
      inputs: {},
    };
    $scope.msr_unit = {};
    $scope.commission_type = 1;
    $scope.change_pagination_amount = 10;
    $scope.bigCurrentPage = 1;
    $scope.product = {};
    $scope.detsubcategory = {};
    $scope.description = {
      english: "",
      arabic: ""
    };
    $scope.show = 1;
    $scope.product.commission = 0;
    $scope.product.price_type = 0;
    $scope.Selected = [];

    $scope.addProduct = false;
    $scope.search = '';
    $scope.products = [];
    $scope.is_grid = true;
    $scope.product.quantity = factories.getSettings().key_value.is_consider_qty_enable == 1 ? 5000000 : '';
    $scope.product.sku = '';
    $scope.brand;
    $scope.brandId = '';
    $scope.catBrandList = [];
    $scope.status = true;
    $scope.selectedVariant = {};
    $scope.variants = [];
    $scope.productData;
    $scope.variantId = '';
    $scope.category_selected;
    $scope.selected_duration = 0;
    $scope.durationArr = [];
    $scope.interval = factories.getSettings().bookingFlow[0].interval;
    $scope.skip = 0;
    $scope.limit = 20;
    $scope.dataLoaded = false;
    $scope.categories = [];
    $scope.selected_det_sub_cat = { id: 0 };
    $scope.catIds = [];
    $scope.catIdArr = [];
    $scope.product_id = '';
    $scope.message = '';
    $scope.read_more_text = '';
    $scope.rental_plan = '';
    $scope.files = [];
    var fileArr = [];
    $scope.price_type = factories.priceType();
    $scope.selected_duration = 60;
    $scope.settings = factories.getSettings();
    $scope.product.weight = '';
    $scope.no_inventory = factories.getSettings().key_value.is_consider_qty_enable == 1 ? 1 : 0;

    $scope.isCsv = false;
    $scope.selectedCsv = {};

    $scope.flow_type = '';


    $scope.status = true;
    $scope.selectedVariant = {};
    $scope.variants = [];
    $scope.product.gender_category = '';

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

    $scope.product_images = [
      {
        img: '',
        file: '',
        order: '',
        del: 0
      }
    ];

    $rootScope.$on('is_product_add_edit', function ($event, data) {
      if (data && data.type === 'ADD') {
        $scope.changeview(true, false);
      } else if (data && data.type === 'EDIT') {
        $scope.product_id = data.product_id;
        $scope.changeview(true, true);
      }
    });

    if ($stateParams) {
      $scope.supplier_id = $stateParams.id;
      $scope.supplier_name = $stateParams.user;
      $scope.supplier_level = $stateParams.level;
      $scope.sup_branch_id = $stateParams.b_id;
      $scope.sup_id = $stateParams.sup_id;
      // $scope.addProduct = $stateParams.is_add;
      $scope.category_selected = $stateParams.cat_id;
      $scope.show_categories = $stateParams.cat_id == 1 ? false : true;
      if (!!$stateParams.sub_cat_ids) {
        if ($stateParams.sub_cat_ids.indexOf(',') > -1) {
          $scope.catIds = $stateParams.sub_cat_ids.split(',');
        } else {
          $scope.catIds = [$stateParams.sub_cat_ids];
        }
        if ($scope.catIds.length > 1) {
          $scope.selected_det_sub_cat.id = $scope.catIds[1];
        }
      }
    }

    $scope.changeRentalPlan = function (plan) {
      $scope.rental_plan = plan;
    }

    var clearInputs = function () {
      $scope.description = {
        english: "",
        arabic: ""
      };
      $scope.outputs = {
        inputs: {},
      };
      $scope.msr_unit = {};
      $scope.product = {};
      $scope.product.quantity = factories.getSettings().key_value.is_consider_qty_enable == 1 || factories.getSettings().key_value.no_product_quantity == 1 ? 5000000 : '';
      $scope.no_inventory = factories.getSettings().key_value.is_consider_qty_enable == 1 ? 1 : 0;
      $scope.product_img1 = '';
      $scope.product_img2 = '';
      fileArr = [];
      $scope.product.payment_after_confirmation = 0;
      $scope.product.cart_image_upload = 0;
      $scope.product.sku = '';
      $scope.product.weight = '';
      $scope.product.gender_category = '';

      $scope.product.purchase_limit = '';
      $scope.product.is_subscription_required = '0';
      $scope.product.is_allergy_product = '0';
      $scope.product.is_appointment = '0';
      $scope.product.allergy_description = '';
      $scope.product.is_non_veg = 1;
      $scope.product.is_special_instruction = 1;

      $scope.product_images = [
        {
          img: '',
          file: '',
          order: '',
          del: 0
        }
      ];
    }

    $scope.changeDuration = function (type) {
      switch (type) {
        case '+':
          $scope.selected_duration += $scope.interval;
          break;
        case '-':
          if ($scope.selected_duration > $scope.interval) $scope.selected_duration -= $scope.interval;
          break;
      }
    }
    $scope.currencies = [];

    $scope.getTimeFromMins = function (mins) {
      return factories.getTimeFromMins(mins);
    }

    $scope.productEdit = function (product) {
      if ($rootScope.enable_supplier_add_edit_delete_restriction == 1 && $rootScope.profile == 'SUPPLIER') {
        return;
      }
      $scope.multiLanguageId = [];
      $scope.is_edit = true;
      $scope.addProduct = true;
      $scope.product_id = product.id
      $scope.product.quantity = product.quantity ? product.quantity : 0;
      $scope.product.sku = product.sku;
      $scope.product.commission = product.commission;
      $scope.product.payment_after_confirmation = product.payment_after_confirmation || 0;
      $scope.product.cart_image_upload = product.cart_image_upload || 0;
      $scope.product.weight = product.duration;
      $scope.no_inventory = product.commission_package;

      $scope.product.purchase_limit = product.purchase_limit;
      $scope.product.is_subscription_required = product.is_subscription_required;

      if ($rootScope.enable_product_allergy == 1) {
        $scope.product.is_allergy_product = product.is_allergy_product;
        $scope.product.allergy_description = product.allergy_description;
      }


      if ($rootScope.enable_product_appointment == 1) {
        $scope.product.is_appointment = product.is_appointment || '0';
      }

      if ($rootScope.enable_non_veg_filter == 1) {
        $scope.product.is_non_veg = product.is_non_veg;
      }

      if ($rootScope.show_gender_category_dropdown == 1) {
        $scope.product.gender_category = product.service_for || 0;
      }

      // $scope.show = 1;
      let i = 0;
      product.names.forEach(el => {
        $scope.outputs.inputs[i] = el.name;
        $scope.msr_unit[i] = el.measuring_unit;
        $scope.multiLanguageId.push(el.product_multi_id);
        if (el.language_id == 14) {
          $scope.description.english = el.product_desc;
        } else if (el.language_id == 15) {
          $scope.description.arabic = el.product_desc;
        }
        i++;
      });
      if (product.images.length) $scope.product_img1 = product.images[0].image_path;
      if (product.images.length > 1) $scope.product_img2 = product.images[1].image_path;
      $scope.selected_duration = product.duration < $scope.interval ? $scope.interval : product.duration;
      $scope.rental_plan = product.interval_flag;
      $scope.price_type = product.pricing_type;


      if ($rootScope.enable_food_varients == 1) {
        $scope.product.variant = product.variant;
        getVarients(product.category_id);
      }

      if ($rootScope.is_multiple_images == 1) {
        $scope.product_images = [];
        (product.images).map(el => {
          $scope.product_images.push({
            order: el.imageOrder,
            img: el.image_path,
            file: '',
            del: 0
          });
        });
        if ($scope.product_images.length < 6) {
          $scope.product_images.push({
            order: '',
            img: '',
            file: '',
            del: 0
          });
        }
      }
    }

    $scope.changeview = function (is_add, is_edit) {
      $scope.addProduct = is_add;
      $scope.is_edit = is_edit;
      if (!is_add) {
        $scope.product_id = '';
      }
      clearInputs();
    }

    $scope.changePriceType = function (type) {
      $scope.price_type = type;
      if (type == 0) {
        $scope.selected_duration = $scope.interval;
      }
    }

    $scope.productPayLater = function (type) {
      $scope.product.payment_after_confirmation = type;
    }

    $scope.prescriptionUploadChanges = function (type) {
      $scope.product.cart_image_upload = type;
    }

    //Call Get Home Page Data Service
    var getHomeData = function () {
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
            if (category.category_id != 1 && category.is_live == 1) {
              category['name'] = category.category_name.length ? category.category_name[lang_index].name : '';
              category['id'] = category.category_id;
              if (!!category['name']) {
                $scope.categories.push(category);
              }
            }
          });
          if ($scope.categories.length) {
            if ($stateParams.cat_id) {
              $scope.selected_cat = $scope.categories.find(cat => {
                return cat.category_id == $stateParams.cat_id;
              });
              $scope.onSelectCategory($scope.selected_cat, false);
            } else {
              $scope.selected_cat = $scope.categories[0];
              $scope.onSelectCategory($scope.categories[0], false);
            }
          }
        }
        langData();
      });
    };
    getHomeData();

    var getBrandList = function (Id) {
      let param_data = {};
      param_data.sectionId = 62;
      param_data.cat_id = Id;
      services.GET_DATA(param_data, API.GET_CAT_BRANDS(), function (response) {
        $scope.catBrandList = response.data;
      });
    }

    $scope.onSelectBrand = function (brand) {
      $scope.brandId = brand.id
    }

    $scope.dynamicSubCategories = [];
    $scope.onSelectCategory = function (category, change) {

      if ($rootScope.app_type > 10) {
        $scope.flow_type = category.type;
      }
      $scope.selected_sub_cat = '';
      $scope.selected_det_sub_cat = {};
      $scope.catIdArr = [];
      if (!!category) {
        $scope.selected_cat = category;
      }
      if (category.id) {
        $scope.category_selected = category.id;
        getBrandList(category.id);
        if ($rootScope.enable_food_varients == 1) {
          getVarients(category.category_id);
        }

        $scope.changeSubCatId(category, 0, change);

      }
    };

    $scope.selectedCategory = [];
    $scope.changeSubCatId = function (subCatData, catIndex, change) {
      $scope.currentPage = 1;
      $scope.skip = 0;
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
        if ($stateParams.type === 'branch') {
          param_data.supplierId = $scope.sup_id;
        } else if ($stateParams.type === 'supplier') {
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
            productList($scope.currentPage);
          }
        });
      }
    };

    var getCurrencyList = function () {
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.sectionId = 30;
      services.POST_DATA(param_data, API.LIST_CURRENCIES(), function (response) {
        let currencyData = response.data;
        $scope.currencies = currencyData;
        $scope.selected_currency = currencyData[0];
      });
    };
    getCurrencyList();

    var getSupplierList = function () {
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.sectionId = 30;
      services.POST_DATA(param_data, API.LIST_SUPPLIER_NAMES, function (response) {
        let supplierData = response.data;
        $scope.suppliers = supplierData;
        $scope.selected_supplier = supplierData[0];
      });
    };
    getSupplierList();

    var productList = function (page) {

      var param_data = {};
      param_data.section_id = 30;
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

      services.listProducts($scope, param_data, function (product) {
        $scope.count = product.product_count;
        $scope.products = product.products;
        let lang_index = localStorage.getItem('lang') != 'en' ? 1 : 0;
        $scope.products.map(product => {
          product['name_en'] = product.names.length > lang_index ? product.names[lang_index].name : '';
          product['desc_en'] = product.names.length > lang_index ? product.names[lang_index].product_desc : '';
        });

        $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);

        $scope.dataLoaded = true;
        if ($scope.product_id) {
          let product = $scope.products.find(el => {
            return el.id == $scope.product_id;
          });
          if (product) {
            $scope.productEdit(product);
          } else {
            $scope.changeview(false, false);
          }
        }
      });
    };

    //listen for the file selected event
    $scope.$on("fileSelected", function (event, args) {
      $scope.$apply(function () {
        //add the file object to the scope's files collection
        $scope.files.push(args.file);
      });
    });

    /* Get to be uploading file and set it into a variable and read to show it on view */
    $scope.file_to_upload_for_image = function (File, order) {
      var file = File[0];
      if (constants.IMAGE_TYPE.includes(file.type)) {
        if ((file.size / Math.pow(1024, 2)) <= 7) {
          $scope.image_file = File[0];
          var Obj = {};
          Obj.image = File[0];
          Obj.image_order = order;
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function (e) {
            $scope.$apply(function () {
              if (order == 1) {
                $scope.product_img1 = e.target.result;
              } else if (order == 2) {
                $scope.product_img2 = e.target.result;
              }
            });
          }
          var index = _.indexOf(_.pluck(fileArr, 'image_order'), Obj.image_order);
          if (index != -1) {
            fileArr[index] = Obj;
          } else {
            fileArr.push(Obj);
          }
        } else {
          factories.invalidDataPop("Image size must be less than 7mb");
        }
      } else {
        factories.invalidDataPop("Invalid File Type");
      }
    };


    $scope.file_to_upload_for_multiple_images = function (File, index) {
      let file = File[0];
      if (constants.IMAGE_TYPE.includes(file.type)) {
        if ((file.size / Math.pow(1024, 2)) <= 3) {
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function (e) {
            $scope.$apply(function () {
              $scope.product_images[index].order = index + 1;
              if ($scope.product_images[index].img) {
                $scope.product_images[index].img = e.target.result;
                $scope.product_images[index].file = file;
                $scope.product_images[index].del = 1;
              } else {
                $scope.product_images[index].img = e.target.result;
                $scope.product_images[index].file = file;
                if ($scope.product_images.length < 10) {
                  $scope.product_images.push({
                    img: '',
                    file: '',
                    order: '',
                    del: 0
                  });
                }
              }

            });
          }
        } else {
          factories.invalidDataPop("Image size must be less than 3mb");
        }
      } else {
        factories.invalidDataPop("Invalid File Type");
      }
    };

    $scope.removeImage = function (index) {
      if ($scope.is_edit) {
        $scope.product_images[index].del = 1;
        $scope.product_images[index].removed = true;
      } else {
        $scope.product_images.splice(index, 1);
      }
    }

    var langData = function () {
      services.getLanguagesData($scope, function (lang_data) {
        var lang_id_data = [];
        var lang_name_data = [];
        for (var i = 0; i < lang_data.length; i++) {
          lang_id_data.push(lang_data[i].id);
          lang_name_data.push(lang_data[i].language_name);
        }
        $scope.lang_ids = lang_id_data.toString();
        $scope.language_name = lang_name_data.toString();
      });
    };

    $scope.$watch(function () {
      return $scope.no_inventory;
    });


    $scope.onConsiderQty = function (no_inventory) {
      $scope.no_inventory = no_inventory;
      if (no_inventory == 1) {
        $scope.product.quantity = 5000000;
      }
      else {
        $scope.product.quantity = null;
      }
    }



    var afterSubmit = function () {
      // $scope.message = `${factories.localisation().product} Has Been ${$scope.is_edit ? 'Updated' : 'Added'} Successfully`;
      // services.SUCCESS_MODAL(true);
      $location.search('is_add', null);
      $location.search('product_id', null);
      productList($scope.currentPage);
      $scope.changeview(false, false);
    }

    /*** ======================= Add/Edit Product ======================== ***/
    $scope.submitAdd = function (addProductForm) {

      if (addProductForm.$submitted && addProductForm.$invalid) return;

      if (fileArr.length == 0 && !$scope.is_edit && !$rootScope.food_item_image_optional && $rootScope.is_multiple_images == 0) {
        factories.invalidDataPop("Upload at least one image file ");
        return false;
      }

      var Images = [];
      var ImageOrder = [];
      let delete_order = [];
      if ($rootScope.is_multiple_images == 0) {
        fileArr.map((el, index) => {
          Images.push(el.image);
          ImageOrder.push(el.image_order);
          if ($scope.is_edit && !!el.image) {
            delete_order.push(el.image_order);
          }
        });
      } else {
        $scope.product_images.map((el, index) => {
          if (!!el.file) {
            Images.push(el.file);
            ImageOrder.push(el.order);
          }
          if ($scope.is_edit && !!el.img && el.del == 1) {
            delete_order.push(el.order);
          }
        });
      }

      if ($scope.description.english == "" && !$rootScope.food_item_desc_optional) {
        factories.invalidDataPop("Product description can not be empty ");
        return;
      }

      // $scope.is_disabled_add = 1;
      var nameData = $scope.outputs.inputs;
      services.getLangDataWithHash($scope, nameData, function (diffLangNameData) {
        var param_data = {};
        param_data.section_id = 30;
        param_data.categoryId = $scope.category_selected;

        if ($scope.catIdArr.length > 0) {
          param_data.subCategoryId = $scope.catIdArr[$scope.catIdArr.length - 1];
        }
        param_data.detailedSubCategoryId = $scope.selected_det_sub_cat.id;

        if (param_data.subCategoryId == undefined) {
          param_data.subCategoryId = param_data.detailedSubCategoryId;
        }

        if (param_data.subCategoryId == undefined && param_data.detailedSubCategoryId == undefined) {
          param_data.detailedSubCategoryId = param_data.categoryId;
          param_data.subCategoryId = param_data.categoryId;
        }
        if ($rootScope.replace_hash_with_slash == 1) {
          param_data.split_name_slash = 1;
          param_data.description = $scope.description.english + "=:" + ($scope.description.arabic ? $scope.description.arabic : $scope.description.english);
        } else {
          param_data.description = $scope.description.english + "#" + ($scope.description.arabic ? $scope.description.arabic : $scope.description.english);
        }

        param_data.name = diffLangNameData.nameData;
        param_data.languageId = diffLangNameData.langData;
        param_data.priceUnit = $scope.selected_currency.id;
        param_data.measuringUnit = 'a#a';
        if ($rootScope.add_sku_product == 1) {
          param_data.sku = $scope.product.sku;
        } else {
          param_data.sku = 0;
        }
        if ($scope.product.barcode) {
          param_data.barCode = $scope.product.barcode;
        } else {
          param_data.barCode = 0;
        }
        param_data.commissionType = $scope.commission_type;
        param_data.commission = 0;
        param_data.pricing_type = $scope.price_type;
        // param_data.commissionPackage = 0;
        param_data.Count = Images.length;
        param_data.image = Images;
        param_data.imageOrder = ImageOrder;
        param_data.quantity = [8, 9, 10].includes($rootScope.app_type) || ($rootScope.app_type > 10 && [8, 9, 10].includes($scope.flow_type) || ($rootScope.inventory_optional && !$scope.product.quantity)) ? 10000 : $scope.product.quantity;
        param_data.brand_id = $scope.brandId;
        param_data.variant_id = Object.values($scope.selectedVariant);
        param_data.is_product = $rootScope.app_type > 10 ? factories.productType($scope.flow_type) : factories.productType();
        param_data.duration = $rootScope.is_product_weight == 1 ? $scope.product.weight : $scope.selected_duration;
        param_data.interval_flag = $scope.rental_plan;
        param_data.payment_after_confirmation = $scope.product.payment_after_confirmation;
        param_data.cart_image_upload = $scope.product.cart_image_upload;
        param_data.commissionPackage = $scope.no_inventory;



        if ($rootScope.enable_item_purchase_limit == 1) {
          param_data.purchase_limit = $scope.product.purchase_limit;
        }
        if ($rootScope.is_enable_subscription_required == 1) {
          param_data.is_subscription_required = $scope.product.is_subscription_required
        }

        if ($rootScope.enable_product_allergy == 1) {
          param_data.is_allergy_product = $scope.product.is_allergy_product;
          param_data.allergy_description = $scope.product.allergy_description;
        }

        if ($rootScope.enable_product_appointment == 1) {
          param_data.is_appointment = $scope.product.is_appointment;
        }

        if ($rootScope.enable_non_veg_filter == 1) {
          param_data.is_non_veg = $scope.product.is_non_veg;
        }

        if ($rootScope.show_gender_category_dropdown == 1) {
          param_data.service_for = $scope.product.gender_category;
        } 

        if ($scope.is_edit) {
          param_data.productId = $scope.product_id;
          param_data.deleteOrder = delete_order.join();
          param_data.imagePath = '';
          param_data.multiLanguageId = $scope.multiLanguageId.join('#');

          services.editAdminProduct($scope, param_data, function (data) {
            afterSubmit();
          });
        } else {
          services.addAdminProduct($scope, param_data, function (data) {
            afterSubmit();
          });
        }
      });
    };

    $scope.deleteProduct = function (Id) {
      services.CONFIRM(`YOU WANT TO DELETE THIS ${factories.localisation().product}`,
        function (isConfirm) {
          if (isConfirm) {
            if (typeof Id == "number") {
              Id = Id.toString();
            }
            var param_data = {};
            param_data.accessToken = constants.ACCESSTOKEN;
            param_data.productId = Id;
            param_data.sectionId = 30;

            services.POST_DATA(param_data, API.DELETE_PRODUCT(), function (response) {
              $scope.message = `${factories.localisation().product} Has Been Deleted Successfully`;
              services.SUCCESS_MODAL(true);
              $scope.refresh();
            });
          }
        });
    };

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
      $scope.currentPage = 1;
      productList(1);
    }

    $scope.searchProduct = function (keyEvent, type) {
      if (keyEvent.which === 13) {
        if (type == 1) $scope.search = keyEvent.target.value;
        if (type == 2) $scope.tagSearch = keyEvent.target.value;
        $scope.skip = 0;
        $scope.currentPage = 1;
        productList(1);
      }
    }


    $scope.downloadSampleFile = () => {
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = $rootScope.app_type > 10 ? $scope.settings.key_value.product_import_url : ($rootScope.app_type == 1 ? $scope.settings.key_value.product_import_url_v1 : $scope.settings.key_value.product_import_url_v2);
      // a.target = '_blank';
      a.setAttribute('style', 'display: none');
      a.download = 'Product-Csv';
      a.click();
      document.body.removeChild(a);
    }

    $scope.removeCsv = () => {
      $scope.selectedCsv = null;
      $scope.isCsv = false;
      var upload = document.getElementById('upload');
      upload.value = null;
    }

    $scope.uploadCsv = () => {
      if (!$scope.isCsv) { return; }
      var param_data = {
        "file": $scope.selectedCsv,
        "sectionId": 30,
        "catId": $scope.selected_cat.category_id,
        "serviceType": $scope.settings.screenFlow[0].app_type,
        "parentId": $scope.selected_cat.category_id
      }

      if ($scope.catIdArr.length > 0) {
        param_data.subcatId = $scope.catIdArr[$scope.catIdArr.length - 1];
      }

      param_data.detSubcatId = $scope.selected_det_sub_cat.id;

      if (param_data.subcatId == undefined) {
        param_data.subcatId = param_data.detSubcatId;
      }

      if (param_data.subcatId == undefined && param_data.detSubcatId == undefined) {
        param_data.detSubcatId = param_data.catId;
        param_data.subcatId = param_data.catId;
      }

      // if (!$scope.catIdArr.length) {
      //   param_data['subcatId'] = $scope.selected_cat.category_id;
      //   param_data['detSubcatId'] = $scope.selected_cat.category_id;
      // } else if ($scope.catIdArr.length == 1) {
      //   param_data['subcatId'] = $scope.catIdArr[0];
      //   param_data['detSubcatId'] = $scope.catIdArr[0];
      // } else {
      //   param_data['subcatId'] = $scope.catIdArr[$scope.catIdArr.length - 2];
      //   param_data['detSubcatId'] = $scope.selected_det_sub_cat.id;
      // }
      let api = '';
      if ($rootScope.app_type > 10) {
        api = API.PRODUCT_IMPORT;
      } else {
        api = API.ADMIN_PRODUCT_IMPORT;
      }

      services.POST_FORM_DATA(param_data, api, function (response) {
        var csvCloseBtn = document.getElementById('close-csv-btn');
        csvCloseBtn.click();
        $scope.message = `File Successfully Uploaded`;
        services.SUCCESS_MODAL(true);
        $scope.refresh();
      })
    }

    var upload = document.getElementById('upload');
    function onFile() {
      file = upload.files[0];
      $scope.selectedCsv = file;
      $scope.$apply(function () {
        $scope.selectedCsv = file;
        $scope.isCsv = true;
      });
      name = file.name.replace(/.[^/.]+$/, '');
    }

    upload.addEventListener('dragenter', function (e) {
      upload.parentNode.className = 'area dragging';
    }, false);

    upload.addEventListener('dragleave', function (e) {
      upload.parentNode.className = 'area';
    }, false);

    upload.addEventListener('drop', function (e) {
      onFile();
    }, false);

    upload.addEventListener('change', function (e) {
      onFile();
    }, false);


    $scope.posKeyList = [];
    $scope.selected_POS = {};
    $scope.getPOSKeyList = function () {
      let params = {
        accessToken: constants.ACCESSTOKEN,
        sectionId: 62
      }
      services.GET_DATA(params, API.POS_KEYS_LIST, function (response) {
        $scope.posKeyList = response.data;
        $scope.selected_POS = $scope.posKeyList[0];
      });
    }
    if (factories.getSettings().key_value.is_pos_enabled == 1) {
      $scope.getPOSKeyList();
    }

    $scope.onSelectPOSKEY = function (pos) {
      pos = pos ? pos : $scope.selected_POS;
      $scope.posImport(pos);
    }




    var getVarients = function (category_id) {
      let params = {};
      params.sectionId = 30;
      params.category_id = $scope.selected_cat.category_id ? $scope.selected_cat.category_id : category_id;
      services.getVariantList($scope, params, function (data) {
        $scope.variants = data;
        if ($scope.is_edit && $scope.product) {
          data.forEach(variant => {
            variant.variant_values.forEach(val => {
              let i = 0;
              $scope.product.variant.forEach(element => {
                if (val.id === element.vaiant_id) {
                  val['selected'] = true;
                  $scope.selectedVariant[i] = val.id;
                } else {
                  val['selected'] = false;
                }
                i++;
              });
            });
          });
        }
      });
    }

    $scope.posImport = function (pos) {
      let params = {
        categoryId: $scope.selected_cat.category_id,
        subCategoryId: $scope.dynamicSubCategories.length ? $scope.selected_det_sub_cat.id : '',
        api_key: pos.api_key,
        client_id: pos.client_id
      }
      services.GET_DATA(params, API.POS_IMPORT, function (response) {
        $scope.message = `Import Successfull`;
        services.SUCCESS_MODAL(true);
        $scope.refresh();
      });
    }



    $scope.changeProductAllergy = function (allergy) {
      $scope.product.is_allergy_product = allergy;
      if (allergy != 1) {
        $scope.product.allergy_description = "";
      }
    }
    $scope.changeProductType = function (is_non_veg) {
      $scope.product.is_non_veg = is_non_veg;
    }

    $scope.changeSpecialInstruction = function (is_special_instruction) {
      $scope.is_special_instruction = is_special_instruction;
    }

  }]);

