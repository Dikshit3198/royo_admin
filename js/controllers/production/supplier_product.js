Royo.controller('SupplierProductsCtrl', ['$scope', '$rootScope', '$location', 'services', 'factories', '$filter', '$stateParams', '$translate', '$state', 'pagerService', 'API', 'constants',
  function ($scope, $rootScope, $location, services, factories, $filter, $stateParams, $translate, $state, pagerService, API, constants) {

    $scope.main = {};
    $scope.outputs = {
      inputs: {},
    };
    $scope.tagSearch = '';

    $scope.msr_unit = {};
    $scope.product = {};
    $scope.product.commission = '';
    $scope.detsubcategory = {};
    $scope.description = {
      english: "",
      arabic: ""
    };
    $scope.is_commission = 1;
    $scope.Selected = [];
    $scope.is_disabled_all = 1;
    $scope.is_disabled_deact = 1;
    $scope.is_disabled_act = 1;
    $scope.supplierId = $stateParams.id
    $scope.is_variant = 0;

    $scope.status = true;
    $scope.selectedVariant = {};
    $scope.variants = [];

    $scope.productData;
    $scope.variantId = '';
    $scope.selected_duration = 60;
    $scope.durationArr = [];
    $scope.is_multi_branch = $stateParams.multi_b;

    $scope.is_out_network = parseInt($stateParams.is_out_network);

    var price_decimal_length = factories.getSettings().key_value.price_decimal_length || 2;
    var price_decimal_zero = factories.getSettings().key_value.price_decimal_zero ? JSON.parse(factories.getSettings().key_value.price_decimal_zero) : 0;
    if (price_decimal_zero) {
      price_decimal_length = 0;
    } else {
      price_decimal_length = price_decimal_length || 2;
    }

    console.log('price_decimal_length', price_decimal_length);
    $scope.addProduct = false;
    $scope.search = '';
    $scope.products = [];
    $scope.is_grid = true;
    $scope.product.sku = '';
    $scope.dataLoaded = false;
    $scope.catLoaded = false;
    $scope.skip = 0;
    $scope.limit = 20;
    $scope.categories = [];
    $scope.is_edit = false;
    $scope.product.quantity = factories.getSettings().key_value.is_consider_qty_enable == 1 ? 5000000 : '';
    $scope.product.making_price = '';
    $scope.product.weight = '';
    $scope.is_pricing = false;
    $scope.product_id = '';
    $scope.selected_det_sub_cat = { id: 0 };
    $scope.catIds = [];
    $scope.sup_branch_id = '';
    $scope.is_discount = false;
    $scope.discount_type = 1;
    $scope.message = '';
    $scope.read_more_text = '';
    $scope.user_type = '';
    $scope.from_hour = [];
    $scope.to_hour = [];
    $scope.hour_price = [];
    $scope.selected_product = {};
    $scope.price_type = factories.priceType();
    $scope.interval = factories.getSettings().bookingFlow[0].interval;
    $scope.settings = factories.getSettings();
    $scope.rental_plan = '';
    $scope.show_price_modal = false;
    $scope.productTags = [];
    $scope.product.payment_after_confirmation = 0//factories.getSettings().key_value.order_request == 1 ? 1 : 0;
    $scope.product.cart_image_upload = 0;
    $scope.product.gender_category = 0;


    $scope.no_inventory = factories.getSettings().key_value.is_consider_qty_enable == 1 ? 1 : 0;
    // $scope.price_type = 1
    $scope.branch_data = localStorage.getItem('branch_type') ? JSON.parse(localStorage.getItem('branch_type')) : null;

    if ($scope.settings) {
      $scope.isProductCustomTabDescEnable = $scope.settings.key_value.isProductCustomTabDescriptionEnable ? JSON.parse($scope.settings.key_value.isProductCustomTabDescriptionEnable) : 0;
      if ($scope.isProductCustomTabDescEnable == 1) {
        $scope.tabIds = localStorage.getItem('productCustomTabDescriptionLabelSelected') && !!JSON.parse(localStorage.getItem('productCustomTabDescriptionLabelSelected')) ? JSON.parse(localStorage.getItem('productCustomTabDescriptionLabelSelected')) : [];

        $scope.allowedTabs = [];
        let arr = $scope.settings.key_value.productCustomTabDescriptionLabel ? JSON.parse($scope.settings.key_value.productCustomTabDescriptionLabel) : [];
        $scope.productCustomTabLabel = [...arr];

        $scope.productCustomTabLabel.forEach(col => {
          if ($scope.tabIds.includes(col.uniqueId) && !col.addByAdmin) {
            $scope.allowedTabs.push(col);
          }
        })
      }
    }
    $scope.flow_type = '';
    $scope.pdf_link = '';

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

    $scope.isCsv = false;
    $scope.selectedCsv = {};

    $scope.product.country_of_origin = '';
    $scope.Size_chart_url = '';
    $scope.Size_chart_url_toView = '';

    $scope.vendorProductUpdateList = [];


    $rootScope.$on('is_sup_product_add_edit', function ($event, data) {
      if (data && data.type === 'ADD') {
        $scope.changeview(true, false);
      } else if (data && data.type === 'EDIT') {
        $scope.product_id = data.product_id;
        $scope.changeview(true, true);
      }
    });

    if ($stateParams) {
      $scope.supplier_id = $stateParams.id;
      $scope.sup_branch_id = $stateParams.b_id;
      $scope.user_type = $stateParams.b_id ? 'branch' : 'supplier';
      $scope.category_selected = $stateParams.cat_id;
      // $scope.addProduct = $stateParams.is_add;
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

    $scope.count_hours = [1];
    $scope.from_timing = [[]];
    $scope.to_timing = [[]];

    if (factories.productType() == 1) {
      $scope.interval = 60;
    } else if ($stateParams.is_product == 0) {
      $scope.interval = factories.getSettings().bookingFlow[0].interval;
    }

    var getTiming = function () {
      $scope.from_timing = [[]];
      $scope.to_timing = [[]];
      $scope.count_hours = [1];
      $scope.from_hour = [];
      $scope.to_hour = [];
      $scope.hour_price = [];

      if ([5, 6, 7].includes($rootScope.app_type) && $scope.rental_plan == 1) {
        let i = 1
        while (i <= 30) {
          let obj = {};
          obj.name = i + (i == 1 ? ' day' : ' days');
          obj.value = i;
          $scope.from_timing[0].push(obj);
          i++;
        }
      } else {
        $scope.from_timing[0] = [
          {
            name: factories.getTimeFromMins($scope.interval),
            value: $scope.interval
          }
        ];

        let i = $scope.interval + $scope.selected_duration;
        while (i <= (24 * 60)) {
          let obj = {};
          obj.name = factories.getTimeFromMins(i);
          obj.value = i;
          $scope.to_timing[0].push(obj);
          i += $scope.selected_duration;
        }
      }
    }

    $scope.getTimeFromMins = function (mins) {
      return factories.getTimeFromMins(mins);
    }

    $scope.addMoreHours = function (index) {
      if ($scope.from_hour[index] && $scope.to_hour[index] && $scope.hour_price[index]) {

        if ([5, 6, 7].includes($rootScope.app_type) && $scope.rental_plan == 1) {
          let toArr = $scope.from_timing[index].slice();
          let i = toArr.findIndex(to => {
            return to.value == parseInt($scope.from_hour[index])
          });
          toArr.splice(0, i + 1);
          $scope.from_timing[index + 1] = toArr;
          $scope.count_hours.push(index + 2);

        } else {
          let toArr = $scope.to_timing[index].slice();
          let i = toArr.findIndex(to => {
            return to.value == parseInt($scope.to_hour[index])
          })
          // toArr.splice(0, i + 2);
          toArr.splice(0, i + 1);
          $scope.to_timing[index + 1] = toArr;
          // let from_time = $scope.to_hour[index] + $scope.selected_duration;
          let from_time = $scope.to_hour[index];
          $scope.from_timing[index + 1] = [
            {
              name: factories.getTimeFromMins(from_time),
              value: parseInt(from_time)
            }
          ];
          $scope.count_hours.push(index + 2);
        }

      } else {
        factories.invalidDataPop("Please enter price and duration");
      }
    }

    $scope.removeHours = function (index) {
      $scope.from_timing.splice(index, 1);
      $scope.to_timing.splice(index, 1);
      $scope.hour_price.splice(index, 1);
      $scope.count_hours.splice(index, 1);
    }

    $scope.changeFrom = function (index) {
      if ([5, 6, 7].includes($rootScope.app_type) && $scope.rental_plan == 1) {
        $scope.to_hour[index] = $scope.from_hour[index];
      }
    }

    $scope.changeRentalPlan = function (plan) {
      $scope.rental_plan = plan;
    }

    $scope.changeGenderCategory = function (gender_category) {
      $scope.product.gender_category = gender_category;
    }

    $scope.changePriceType = function (type) {
      $scope.price_type = type;
      if (type == 0) {
        $scope.selected_duration = 60;
      }
      if ($scope.is_edit == 1) {
        $scope.selected_product.price = [];
      }
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
      $scope.product.making_price = '';
      $scope.product.sku = '';
      $scope.product.weight = '';
      $scope.product.recipe_pdf = '';
      $scope.product_img1 = '';
      $scope.product_img2 = '';
      $scope.image_file = null;
      $scope.is_discount = false;
      $scope.selected_duration = 60;
      fileArr = [];
      $scope.product.payment_after_confirmation = 0;//factories.getSettings().key_value.order_request == 1 ? 1 : 0;
      $scope.product.cart_image_upload = 0;
      $scope.Size_chart_url = '';
      $scope.product.country_of_origin = '';
      $scope.product.purchase_limit = '';
      $scope.product.is_subscription_required = '0';
      $scope.product.is_allergy_product = '0';
      $scope.product.is_appointment = '0';
      $scope.product.allergy_description = '';
      $scope.product.is_non_veg = 1;
      $scope.product.is_special_instruction = 0;
      $scope.product.calories = '';
      $scope.product.gender_category = 0;
      $scope.product_images = [
        {
          img: '',
          file: '',
          order: '',
          del: 0
        }
      ];
    }

    var getUserTypes = function () {
      services.GET_DATA({}, API.LIST_USER_TYPES(), function (response) {
        if (response.data.length) {
          $scope.user_type_prices = [];
          $scope.user_type_prices = (response.data).map(type => {
            return {
              name: type.type_name,
              user_type_id: type.id,
              price: '',
              discount_price: '',
            }
          });
        }
      });
    }
    if (factories.getSettings().key_value.is_user_type == 1 && factories.getSettings().key_value.user_type_check == 1) {
      getUserTypes();
    }

    $scope.changeview = function (is_add, is_edit) {
      $scope.addProduct = is_add;
      $scope.is_edit = is_edit;
      clearInputs();
      $scope.is_pricing = false;
      // $location.search('is_add', null);
      // $location.search('product_id', null);
      if (!is_add) {
        $scope.product_id = '';
        // $scope.skip = 0;
        getHomeData($scope.currentPage);
      }

      setTimeout(() => {
        $('#tags').tagEditor({
          delimiter: ',',
          placeholder: 'Enter Tags',
          autocomplete: {
            delay: 0,
            position: { collision: 'flip' }, // automatic menu position up/down
            source: []
          },
          forceLowercase: false,
          onChange: function (field, editor, tags) {
            $scope.productTags = tags;
          }
        });
      }, 500);
    }

    $scope.productPayLater = function (type) {
      $scope.product.payment_after_confirmation = type;
    }

    $scope.prescriptionUploadChanges = function (type) {
      $scope.product.cart_image_upload = type;
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
      if ($scope.is_edit == 1) {
        $scope.selected_product.price = [];
      }
    }

    $scope.productEdit = function (product) {


      // if ($rootScope.enable_supplier_add_edit_delete_restriction == 1 && $rootScope.profile == 'SUPPLIER') {
      //   return;
      // }

      $scope.selected_product = product;
      $scope.multiLanguageId = [];
      $scope.product_id = product.id;
      $scope.is_edit = true;
      $scope.addProduct = true;
      $scope.is_discount = false;
      $scope.product.quantity = product.quantity;
      $scope.product.making_price = parseFloat(product.making_price);
      $scope.product.sku = product.sku;
      $scope.product.commission = product.commission;
      $scope.commission_type = product.commission_type ? product.commission_type : 1;
      $scope.product.payment_after_confirmation = product.payment_after_confirmation || 0;
      $scope.product.cart_image_upload = product.cart_image_upload || 0;
      $scope.price_type = product.pricing_type;
      $scope.product.country_of_origin = product.country_of_origin;
      $scope.Size_chart_url_toView = product.Size_chart_url;
      $scope.Size_chart_url = product.Size_chart_url;
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

      if ($rootScope.enable_product_calories == 1) {
        $scope.product.calories = product.calories;
      }



      if ($rootScope.enable_product_special_instruction == 1 && $rootScope.enable_product_wise_special_instruction == 1) {
        $scope.product.is_special_instruction = product.is_special_instruction;
      }

      if ($rootScope.enable_food_varients == 1) {
        $scope.product.variant = product.variant;
        getVarients(product.category_id);
      }

      let i = 0;
      product.names.forEach(el => {
        $scope.outputs.inputs[i] = el.name;
        $scope.msr_unit[i] = el.measuring_unit;
        $scope.multiLanguageId.push(el.product_multi_id);
        if (el.langauge_id == 14 || el.language_id == 14) {
          $scope.description.english = el.product_desc;
        } else if (el.langauge_id == 15 || el.language_id == 15) {
          $scope.description.arabic = el.product_desc;
        }
        i++;
      });
      // if (product.images.length) $scope.product_img1 = product.images[0].image_path;
      // if (product.images.length > 1) $scope.product_img2 = product.images[1].image_path;
      $scope.selected_duration = product.duration;
      $scope.product.weight = product.duration;
      $scope.brandId = product.brand_id;
      $scope.brand = $scope.catBrandList.find(brand => brand.id == product.brand_id);
      $scope.rental_plan = product.interval_flag;
      if ($rootScope.product_pdf_upload == 1 && product.recipe_pdf) {
        $scope.product.recipe_pdf = product.recipe_pdf;
        $scope.pdf_link = product.recipe_pdf;
      }

      if ($rootScope.show_gender_category_dropdown == 1) {
        $scope.product.gender_category = product.service_for;
      } 

      if (product.product_tags) {
        setTimeout(() => {
          $('#tags').tagEditor({
            delimiter: ', ',
            placeholder: 'Enter Tags',
            autocomplete: {
              delay: 0,
              position: { collision: 'flip' }, // automatic menu position up/down
              source: product.product_tags.split(',')
            },
            forceLowercase: false,
            onChange: function (field, editor, tags) {
              $scope.productTags = tags;
            }
          });
        }, 500);
      }

      if ($scope.isProductCustomTabDescEnable == 1) {
        if ($scope.allowedTabs.length) {
          $scope.allowedTabs.forEach(col => {
            $scope.product[col.labelDBColName] = product[col.labelDBColName];
          })
        }
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
      } else {
        if (product.images.length) {
          (product.images).forEach(el => {
            switch (el.imageOrder) {
              case 1:
                $scope.product_img1 = el.image_path;
                break;
              case 2:
                $scope.product_img2 = el.image_path;
                break;
            }
          });
        }
      }
      if (!$scope.vendorProductUpdateList.length) {
        getVendorProductUpdateList(1);
      }
    }

    //Get Url Ids .
    $scope.supplier_id = $stateParams.id;
    $scope.supplier_name = $stateParams.user;
    $scope.user_level = $stateParams.level;
    $scope.brand;
    $scope.brandId = '';
    $scope.catBrandList = [];

    var getBrandList = function (Id) {
      let param_data = {};
      param_data.sectionId = 30;
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
        $scope.price_type = factories.priceType(category.type);
        if (factories.productType(category.type) == 1) {
          $scope.interval = 60;
        }
      }
      $scope.selected_cat = category;
      $scope.selected_sub_cat = [];
      $scope.selected_det_sub_cat = {};
      $scope.det_sub_categories = [];
      $scope.catIdArr = [];
      $scope.products = [];
      $scope.commission_type = category.commission_type ? category.commission_type : 1;
      $scope.product.commission = category.commission;
      $scope.commission_level = category.commisionButton;
      $scope.is_variant = category.is_variant;
      if ($scope.selected_cat.commisionButton == 1) {
        $scope.is_commission = 1;
      } else {
        $scope.is_commission = 0;
      }

      $scope.catLoaded = true;
      if (category.category_id) {
        $scope.category_selected = category.id;
        getBrandList(category.category_id);

        if ($rootScope.enable_food_varients == 1) {
          getVarients(category.category_id);
        }

        $scope.changeSubCatId(category, 0, change);

      }
    };

    var getVarients = function (category_id) {
      let params = {};
      params.sectionId = 30;
      params.category_id = $scope.selected_cat.category_id ? $scope.selected_cat.category_id : category_id;
      services.getVariantList($scope, params, function (data) {
        $scope.variants = data;
        if ($scope.is_edit && $scope.product) {
          console.log("$scope.product", $scope.product)
          data.forEach(variant => {
            variant.variant_values.forEach(val => {
              let i = 0;
              // console.log("$scope.product.variant")
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

    $scope.catIdArr = [];
    $scope.selectedCategory = [];
    $scope.changeSubCatId = function (subCatData, catIndex, change) {
      $scope.currentPage = 1;
      $scope.skip = 0;
      $scope.selected_det_sub_cat = subCatData;
      if (!!subCatData && !!subCatData.id) {
        if (change) {
          console.log('111111111', catIndex, $scope.catIdArr)
          $scope.selectedCategory.splice(catIndex, $scope.selectedCategory.length - catIndex);
          if (catIndex > 0) {
            $scope.catIdArr.splice(catIndex - 1, $scope.catIdArr.length - (catIndex - 1));
          } else {
            $scope.catIdArr = [];
          }
        }

        let param_data = {};
        param_data.subCatId = subCatData.id;
        param_data.sectionId = 30;
        if ($rootScope.is_single_vendor == 0) {
          param_data.supplierId = $scope.supplier_id;
        }
        if (catIndex == 0) {
          param_data.level = 1;
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
            getHomeData($scope.currentPage);
          }
        });

        console.log($scope.catIdArr)

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

    var param_data = {};
    param_data.accessToken = constants.ACCESSTOKEN;
    param_data.sectionId = 30;
    param_data.supplierId = $stateParams.id;

    param_data.language_id = localStorage.getItem('lang') != 'en' ? 15 : 14;

    services.POST_DATA(param_data, API.LIST_SUPPLIER_CATEGORIES(), function (response) {
      let categoryData = response.data;
      categoryData.map((cat, index) => {
        cat['id'] = cat.category_id;
      });
      $scope.sub_categories = {};
      $scope.det_sub_categories = {};
      $scope.categories = categoryData;
      $scope.selected_cat = categoryData[0];
      console.log($scope.categories)

      if (categoryData.length) {
        if ($stateParams.cat_id) {
          $scope.selected_cat = $scope.categories.find(cat => {
            return cat.category_id == $stateParams.cat_id;
          });
          if ($scope.selected_cat) {
            $scope.onSelectCategory($scope.selected_cat, false);
          }
        } else {
          $scope.onSelectCategory(categoryData[0], false);
        }
      }
    });

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

    $scope.file_to_upload_for_size_chart = function (File, order) {
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
              // if ($scope.is_edit) {
              //   $scope.Size_chart_url = File[0];
              // }
              // else {
              //   $scope.uploadImage(File[0], function (err, imageUrl) {
              //     $scope.Size_chart_url = imageUrl;
              //   })
              // }
              $scope.uploadImage(File[0], function (err, imageUrl) {
                $scope.Size_chart_url_toView = imageUrl;
              })
              $scope.Size_chart_url = File[0];
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

    $scope.pdf_upload = function (File) {
      if (File[0].type == "application/pdf") {
        $scope.product.recipe_pdf = File[0];
        $scope.pdf_link = '';
      } else {
        factories.invalidDataPop("Invalid File Type");
      }
    }

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
                // if ($scope.product_images.length < 6) {
                $scope.product_images.push({
                  img: '',
                  file: '',
                  order: '',
                  del: 0
                });
                // }
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
        let lang_id_data = [];
        let lang_name_data = [];
        for (var i = 0; i < lang_data.length; i++) {
          lang_id_data.push(lang_data[i].id);
          lang_name_data.push(lang_data[i].language_name);
        }
        $scope.lang_ids = lang_id_data.toString();
        $scope.language_name = lang_name_data.toString();
      });
    };

    var listPoducts = function (data, page) {
      $scope.count = data['product_count'];
      let lang_index = localStorage.getItem('lang') != 'en' ? 1 : 0;
      (data['products']).map(product => {
        product['name_en'] = product.names.length > lang_index ? product.names[lang_index].name : '';
        product['desc_en'] = product.names.length > lang_index ? product.names[lang_index].product_desc : '';
        if (product.price && product.price.length) {
          let regular_price = (product.price).find(el => el.price_type == 0) || {};
          let discount_price = (product.price).find(el => el.price_type == 1);


          product['regular_price'] = regular_price ? (parseFloat(regular_price.price)).toFixed(price_decimal_length) : null;
          product['discount_price'] = discount_price ? (parseFloat(discount_price.price)).toFixed(price_decimal_length) : null;
          product['profit'] = ((parseFloat(regular_price.price) - parseFloat(product.making_price)) / parseFloat(product.making_price)) * 100;
        }
      });
      $scope.products = data['products'];
      $scope.dataLoaded = true;
      $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);

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
      langData();
    }

    //Call Get Home Page Data Service
    var getHomeData = function (page) {

      let param_data = {};
      param_data.subCategoryId = undefined;
      param_data.detailedSubCategoryId = undefined;

      var supplierId = $stateParams.id;
      param_data.section_id = 30;
      param_data.supplierId = supplierId;
      param_data.categoryId = $scope.selected_cat.category_id;
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

      if ($scope.tagSearch) {
        param_data.tagText = $scope.tagSearch;
      }
      param_data.language_id = localStorage.getItem('lang') != 'en' ? 15 : 14;
      $scope.dataLoaded = false;
      if ($stateParams.b_id) {
        param_data.branchId = $stateParams.b_id;
        services.listSupBranchProducts($scope, param_data, function (data) {
          listPoducts(data, page);
        });
      } else {
        services.listSupplierProducts($scope, param_data, function (data) {
          listPoducts(data, page);
        });
      }
    };

    $scope.refresh = function () {
      $scope.skip = 0;
      $scope.currentPage = 1;
      getHomeData(1);
    }

    var getPrice = function (product) {

      if ($scope.price_type == 1) {
        getTiming();
      }

      $scope.pricing = {
        price: 0,
        discount_price: 0,
        deliveryCharges: 0,
        handlingFeeAdmin: 0,
        start_date: '',
        end_date: '',
        discount_start_date: '',
        discount_end_date: '2099-01-01',
        item_rate: 0
      }

      $scope.is_pricing_edit = false;
      $scope.pricingData = product && product.price ? product.price : [];

      if (product && product.price && product.price.length) {
        $scope.is_pricing_edit = true;
        if (factories.getSettings().key_value.is_user_type == 1 && factories.getSettings().key_value.user_type_check == 1) {
          let regular_price = (product.price).filter(el => el.price_type == 0);
          let discount_price = (product.price).filter(el => el.price_type == 1);
          $scope.user_type_prices.forEach(type => {
            if (regular_price && regular_price.length) {
              let user_price = regular_price.find(p => type.user_type_id == p.user_type_id);
              if (!!user_price) {
                type['price'] = parseFloat(user_price.price);
                type['id'] = user_price.id;
                if (discount_price && discount_price.length && $scope.is_discount) {
                  let user_discount_price = discount_price.find(p => type.user_type_id == p.user_type_id);
                  if (!!user_discount_price) {
                    let discount_price = ((parseFloat(user_price.price) - parseFloat(user_discount_price.price)) / parseFloat(user_price.price)) * 100;
                    type['discount_price'] = Math.round(discount_price);
                  }
                }
              }
            }
          });

          if (discount_price && discount_price.length && $scope.is_discount) {
            $scope.pricing.discount_end_date = moment(discount_price[0].end_date).format('YYYY-MM-DD');
            setTimeout(() => {
              $scope.discount_end_date_picker.setDate(discount_price[0].end_date);
            }, 200);
          }
        } else {
          let regular_price = (product.price).find(el => el.price_type == 0);
          let discount_price = (product.price).find(el => el.price_type == ($scope.isFlashSalePrice ? 2 : 1));

          if (!!regular_price) {
            if ($scope.price_type == 0) {
              $scope.pricing = {
                price: parseFloat(regular_price.price),
                deliveryCharges: regular_price.delivery_charges,
                handlingFeeAdmin: regular_price.handling,
              }
            } else if ($scope.price_type == 1) {
              let index = 0;
              $scope.count_hours = [];
              $scope.from_hour = [];
              $scope.to_hour = [];
              $scope.hour_price = [];

              let priceArr = JSON.parse(regular_price.price);
              if (priceArr && priceArr.length) {
                priceArr.forEach(price => {
                  $scope.from_hour[index] = parseInt(price.min_hour);
                  $scope.to_hour[index] = parseInt(price.max_hour);
                  $scope.hour_price[index] = parseFloat(price.price_per_hour);
                  if (index + 1 < priceArr.length) {
                    let to_timings = [];
                    let toArr = [];
                    to_timings = ($scope.to_timing).slice();
                    toArr = (to_timings[index]).slice();
                    let i_to = toArr.findIndex(to => {
                      return to.value == price.max_hour
                    });
                    if (i_to > -1) {
                      $scope.from_timing[index + 1] = [toArr[i_to]];
                      toArr.splice(0, i_to + 1);
                      $scope.to_timing[index + 1] = toArr;
                    }
                  }
                  $scope.count_hours.push(index + 1);
                  index++;
                });

              }
            }
          }

          if (!!discount_price && product.price.length > 1) {
            let discount_value = 0;

            if ([1, 2].includes(discount_price.pricing_type)) {
              let priceArr = JSON.parse(discount_price.price);
              let priceObj = priceArr[0];
              discount_value = ((parseFloat(priceObj.price_per_hour) - parseFloat(priceObj.discount_price)) / parseFloat(priceObj.price_per_hour)) * 100;
            } else {
              discount_value = ((parseFloat(regular_price.price) - parseFloat(discount_price.price)) / parseFloat(regular_price.price)) * 100;
            }
            $scope.pricing.discount_price = Math.round(discount_value);
            $scope.pricing.discount_start_date = moment(discount_price.start_date).format('YYYY-MM-DD');
            $scope.pricing.discount_end_date = moment(discount_price.end_date).format('YYYY-MM-DD');
            if (!!$scope.discount_end_date_picker) {
              setTimeout(() => {
                $scope.discount_end_date_picker.setDate(discount_price.end_date);
              }, 200);
            }
          }
          if ($scope.is_discount && !!discount_price) {
            $scope.pricing_id = discount_price.id;
          } else if (!$scope.is_discount && !!regular_price) {
            $scope.pricing_id = regular_price.id;
          }
        }
      } else {
        if (factories.getSettings().key_value.is_user_type == 1 && factories.getSettings().key_value.user_type_check == 1) {
          $scope.user_type_prices.forEach(el => {
            el.price = 0;
          });
        }
      }
    }

    $scope.editPrice = function (product, is_discount, is_flash_sale) {

      // if ($rootScope.enable_supplier_add_edit_delete_restriction == 1 && $rootScope.profile == 'SUPPLIER') {
      //   return;
      // }

      $scope.addProductPriceForm.$setPristine();
      $scope.is_discount = is_discount;
      $scope.product_id = product['id'];
      $scope.rental_plan = product.interval_flag;
      $scope.selected_duration = product.duration;
      $scope.price_type = product.pricing_type;

      $scope.isFlashSalePrice = is_flash_sale ? true : false;

      getPrice(product);
      setTimeout(() => {
        $("#edit_pricing_modal").modal('show');
        if (is_discount) {
          document.getElementById("discount_end_date").value = '';
          $scope.discount_end_date_picker = new Lightpick({
            field: document.getElementById('discount_end_date'),
            minDate: new Date(),
            format: 'DD-MM-YYYY',
            repick: true,
            onSelect: function (date) {
              if (date) {
                $scope.pricing.discount_end_date = date.format('YYYY-MM-DD');
              }
            }
          });
        }
      }, 300);
    }

    var afterSubmit = function () {
      $scope.is_pricing = true;
      $scope.is_edit ? getPrice($scope.selected_product) : getPrice();
      if ($rootScope.enable_weight_price_rate == 1) {
        $scope.calculateItemRate($scope.pricing.price);
      }
    }

    $scope.calculateItemRate = function (price) {
      $scope.pricing.item_rate = ((Number)(price) / ($scope.product.weight ? (Number)($scope.product.weight) : 0));
    }

    /*** ======================== Submit ======================= ***/
    $scope.submitAdd = function (addSupplierProductForm) {

      if (addSupplierProductForm.$submitted && addSupplierProductForm.$invalid) return;

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
        return false;
      }

      // $scope.is_disabled_add = 1;
      var nameData = $scope.outputs.inputs;
      services.getLangDataWithHash($scope, nameData, function (diffLangNameData) {
        var descNameData = $scope.msr_unit;

        services.getLangDataWithHash($scope, descNameData, function (diffLangNameUnitData) {
          if ($scope.selected_det_sub_cat.length == 0) {
            if ($scope.selected_sub_cat.length == 0) {
              var catId = $scope.selected_cat.category_id;
            } else {
              catId = $scope.selected_cat.category_id;
              subCatId = $scope.selected_sub_cat.sub_category_id;
              detailSubCatId = 0;
            }
          } else {
            catId = $scope.selected_cat.category_id;
            subCatId = $scope.selected_sub_cat.sub_category_id;
            detailSubCatId = $scope.selected_det_sub_cat.detailed_sub_category_id;
          }

          var param_data = {};
          param_data.section_id = 30;
          param_data.categoryId = catId;
          // param_data.subCategoryId = subCatId;
          // param_data.detailedSubCategoryId = detailSubCatId;
          if ($scope.catIdArr.length > 0) {
            param_data.subCategoryId = $scope.catIdArr[$scope.catIdArr.length - 1];
          }
          param_data.detailedSubCategoryId = $scope.selected_det_sub_cat.id;
          if (param_data.subCategoryId == undefined) {
            param_data.subCategoryId = param_data.detailedSubCategoryId;
          }
          param_data.supplierId = $stateParams.id;
          param_data.name = diffLangNameData.nameData;
          if ($rootScope.replace_hash_with_slash == 1) {
            param_data.split_name_slash = 1;
            param_data.description = $scope.description.english + "=:" + ($scope.description.arabic ? $scope.description.arabic : $scope.description.english);
          } else {
            param_data.description = $scope.description.english + "#" + ($scope.description.arabic ? $scope.description.arabic : $scope.description.english);
          }
          // param_data.measuringUnit = diffLangNameUnitData.nameData;
          param_data.measuringUnit = 'a#a';
          param_data.languageId = diffLangNameData.langData;
          param_data.priceUnit = $scope.selected_currency.id;
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
          if ($rootScope.show_gender_category_dropdown == 1) {
            param_data.service_for = $scope.product.gender_category;
          } 

          if ($rootScope.replace_hash_with_slash == 1) {
            param_data.split_name_slash = 1;
          }
          param_data.commissionType = 0;
          param_data.commission = 0;
          param_data.pricing_type = $scope.price_type;
          param_data.Count = Images.length;
          param_data.image = Images;
          param_data.imageOrder = ImageOrder;
          param_data.quantity = [8, 9, 10].includes($rootScope.app_type) || ($rootScope.app_type > 10 && [8, 9, 10].includes($scope.flow_type) || ($rootScope.inventory_optional && !$scope.product.quantity)) ? 500000 : $scope.product.quantity || 0;
          param_data.brand_id = $scope.brandId;
          param_data.variant_id = Object.values($scope.selectedVariant);
          param_data.payment_after_confirmation = $scope.product.payment_after_confirmation;
          param_data.cart_image_upload = $scope.product.cart_image_upload;
          param_data.making_price = $scope.product.making_price;
          param_data.product_tags = $scope.productTags.join(',');

          if (param_data.subCategoryId == undefined) {
            param_data.subCategoryId = param_data.detailedSubCategoryId;
          }
          if (param_data.subCategoryId == undefined && param_data.detailedSubCategoryId == undefined) {
            param_data.detailedSubCategoryId = param_data.categoryId;
            param_data.subCategoryId = param_data.categoryId;
          }
          param_data.is_product = $rootScope.app_type > 10 ? factories.productType($scope.flow_type) : factories.productType();
          param_data.duration = $rootScope.is_product_weight == 1 ? $scope.product.weight : $scope.selected_duration;
          param_data.interval_flag = $scope.rental_plan;

          if ($rootScope.product_pdf_upload == 1) {
            param_data.recipe_pdf = $scope.product.recipe_pdf;
          }

          if ($scope.allowedTabs && $scope.allowedTabs.length) {
            param_data['product_desc'] = [];
            $scope.allowedTabs.forEach(col => {
              param_data['product_desc'].push({
                label: col.labelDBColName,
                value: $scope.product[col.labelDBColName]
              });
            });
          }

          if ($rootScope.enable_size_chart_in_product == '1') {
            param_data.Size_chart_url = $scope.Size_chart_url;
          }
          if ($rootScope.enable_country_of_origin_in_product == '1') {
            param_data.country_of_origin = $scope.product.country_of_origin;
          }

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

          if ($rootScope.enable_updation_vendor_approval == 1 && $rootScope.profile == 'SUPPLIER') {
            param_data.is_updation_vendor_request = 1;
          }
          else {
            param_data.is_updation_vendor_request = 0;
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
          if ($rootScope.enable_product_calories == 1) {
            param_data.calories = $scope.product.calories;
          }

          if ($rootScope.enable_product_special_instruction == 1 && $rootScope.enable_product_wise_special_instruction == 1) {
            param_data.is_special_instruction = $scope.product.is_special_instruction;
          }

          param_data.commissionPackage = $scope.no_inventory;



          if ($rootScope.enable_food_varients == 1 && $scope.variants.length > 0) {
            let varaintArr = [];
            if (!Object.values($scope.selectedVariant).length) {
              factories.invalidDataPop("Please select a variant");
              return;
            }

            if ($rootScope.not_all_variant_required == 1) {
              Object.values($scope.selectedVariant).forEach(col => {
                if (!!col) {
                  varaintArr.push(col);
                }
              })
              if (!varaintArr.length) {
                factories.invalidDataPop("Please select a variant");
                return;
              }
            }
            param_data.parent_id = $scope.parent_id;
            param_data.variant_id = $rootScope.not_all_variant_required == 0 ? Object.values($scope.selectedVariant) : varaintArr;
          }
          
          if ($scope.is_edit) {
            param_data.deleteOrder = delete_order.join();
            param_data.imagePath = '';
            param_data.productId = $scope.product_id;
            param_data.multiLanguageId = $scope.multiLanguageId.join('#');

            if ($scope.vendorProductUpdateList.length) {
              if ($scope.vendorProductUpdateList[0].update_request_approved == 0) {
                param_data.updationRequestId = $scope.vendorProductUpdateList[0].id;
              }
            }

            services.editAdminProduct($scope, param_data, function (data) {
              afterSubmit();
            });
          } else {
            if ($stateParams.b_id) {
              param_data.branchId = $stateParams.b_id
              services.addBranchProduct($scope, param_data, function (data) {
                $scope.product_id = data.data.productId;
                afterSubmit();
              });
            } else {
              services.addSupplierProduct($scope, param_data, function (data) {
                $scope.product_id = data.data.productId;
                afterSubmit();
              });
            }
          }
        });
      });
    };

    var discountPrice = function (PRICE_ARR) {
      let price = 0;
      if ($scope.price_type == 1 && PRICE_ARR.length) {
        PRICE_ARR.map(charge => {
          charge['discount_price'] = 0;
          if ($scope.discount_type == 1) {
            charge['discount_price'] = charge.price_per_hour - ((charge.price_per_hour * $scope.pricing.discount_price) / 100);
          } else {
            charge['discount_price'] = charge.price_per_hour - $scope.pricing.discount_price;
          }
          if (charge['discount_price'] < 0) {
            charge['discount_price'] = 0;
          }
        });
        price = JSON.stringify(PRICE_ARR);
      } else {
        price = $scope.discount_type == 1 ? $scope.pricing.price - (($scope.pricing.discount_price * $scope.pricing.price) / 100) : ($scope.pricing.price - $scope.pricing.discount_price);
      }
      return price;
    }

    var afterPricing = function (type) {
      console.log('6544455');

      switch (type) {
        case 0:
          $scope.pricing = {};
          // $location.search('is_add', null);
          // $location.search('product_id', null);
          $scope.changeview(false, false);
          getHomeData($scope.currentPage);
          $("#edit_pricing_modal").modal('hide');
          clearInputs();
          // $scope.message = `${factories.localisation().product} price has been ${$scope.is_pricing_edit ? 'updated' : 'added'} successfully`;
          // services.SUCCESS_MODAL(true);
          break;
        case 1:
          $state.go('production.customization', { product_id: $scope.product_id, level: 1, sup_id: $scope.supplier_id, b_id: $scope.sup_branch_id, type: $scope.selected_cat.is_liquor });
          break;
        case 2:
          $state.go('production.productVariants', {
            id: $scope.product_id,
            type: $scope.user_type,
            supplierId: $scope.supplier_id,
            branchId: $scope.sup_branch_id,
            flow: $scope.flow_type
          });
          break;
      }
      $scope.product_id = '';
    }

    $scope.submitPricingType = function (type) {
      $scope.selected_pricing_type = type;
    }

    $scope.submitPricing = function (addProductPriceForm) {
      if (addProductPriceForm.$submitted && addProductPriceForm.$invalid) return;

      let is_user_type = factories.getSettings().key_value.is_user_type && factories.getSettings().key_value.user_type_check == 1 ? factories.getSettings().key_value.is_user_type : 0;

      let PRICE_ARR = [];
      if ($scope.price_type == 1) {
        for (let index = 0; index < $scope.hour_price.length; index++) {
          let Obj = {};
          Obj.min_hour = $scope.from_hour[index];
          Obj.max_hour = $scope.to_hour[index];
          Obj.price_per_hour = $scope.hour_price[index];
          PRICE_ARR.push(Obj);
        }
      }

      let param_data = {};
      param_data.section_id = 30;
      param_data.productId = $scope.product_id;
      // param_data.handling_fee_admin = $scope.pricing.handlingFeeAdmin;
      param_data.handling_fee_admin = $scope.selected_cat.tax;
      param_data.delivery_charges = $scope.pricing.deliveryCharges ? $scope.pricing.deliveryCharges : 0;
      param_data.id = $stateParams.b_id ? $stateParams.b_id : $stateParams.id;
      // param_data.type = $stateParams.b_id ? 2 : 1;
      param_data.start_date = '2000-01-01';
      param_data.end_date = '2099-01-01';

      // param_data.offer_type = +$scope.is_discount;

      param_data.offer_type = $rootScope.is_flash_sale == 0 ? +$scope.is_discount : ($scope.isFlashSalePrice ? 2 : +$scope.is_discount);
      param_data.pricing_type = $scope.price_type;

      if ($rootScope.enable_weight_price_rate == 1) {
        param_data.item_rate = $scope.pricing.item_rate ? $scope.pricing.item_rate : 0;
      }

      let regular_price = [];
      let discount_price = [];
      if (is_user_type == 1) {
        regular_price = ($scope.pricingData).filter(el => el.price_type == 0);
        discount_price = ($scope.pricingData).filter(el => el.price_type == 1);
      }

      if ($scope.price_type == 1) {
        param_data.price = JSON.stringify(PRICE_ARR);
        param_data.displayPrice = JSON.stringify(PRICE_ARR);
      } else {
        if (is_user_type == 1) {
          let user_type_price = [];
          let user_type_discount_price = [];
          user_type_price = $scope.user_type_prices.map(type => {
            let price_obj = {
              startDate: '2000-01-01',
              offerType: +$scope.is_discount,
              user_type_id: type.user_type_id
            };

            if ($scope.is_pricing_edit && regular_price.length && (!$scope.is_discount || (discount_price.length && $scope.is_discount))) {
              price_obj['productPricingId'] = type.id;
            }
            if ($scope.is_pricing_edit && $scope.is_discount && discount_price.length) {
              price_obj['endDate'] = $scope.pricing.discount_end_date;
              price_obj['price'] = type.price - ((type.discount_price * type.price) / 100);
              price_obj['displayPrice'] = type.price - ((type.discount_price * type.price) / 100);
            } else {
              price_obj['endDate'] = '2099-01-01';
              price_obj['price'] = type.price;
              price_obj['displayPrice'] = type.price;
            }
            return price_obj;
          });

          if ($scope.is_pricing_edit && $scope.is_discount && regular_price.length && !discount_price.length) {
            user_type_discount_price = $scope.user_type_prices.map(type => {
              return {
                discountEndDate: $scope.pricing.discount_end_date,
                discountStartDate: '2000-01-01',
                discountPrice: type.price - ((type.discount_price * type.price) / 100),
                startDate: '2000-01-01',
                endDate: $scope.pricing.discount_end_date,
                offerType: +$scope.is_discount,
                user_type_id: type.user_type_id,
                price: type.price,
                displayPrice: type.price
              }
            });
            param_data.discountPrice = user_type_discount_price;
          }

          param_data.price = user_type_price;
          param_data.displayPrice = 0;
        } else {
          param_data.price = $scope.pricing.price;
          param_data.displayPrice = $scope.pricing.price;
        }
      }

      if ($scope.is_pricing_edit) {
        if ((($scope.pricingData.length < 2 && is_user_type == 0) || (is_user_type == 1 && !discount_price.length && regular_price.length)) && $scope.is_discount) {
          if ($scope.pricing.discount_price > 99) {
            factories.invalidDataPop("Discount cannot be more than 99%");
            return;
          }
          param_data.discountStartDate = '2000-01-01';
          param_data.discountEndDate = $scope.pricing.discount_end_date;
          if (is_user_type == 0) {
            param_data.discountPrice = discountPrice(PRICE_ARR);
          }
          services.addProductPricing($scope, param_data, function (data) {
            afterPricing($scope.selected_pricing_type);
          });
        } else if ((($scope.pricingData.length < 1 && is_user_type == 0) || (is_user_type == 1 && !regular_price.length && !discount_price.length)) && !$scope.is_discount) {
          services.addProductPricing($scope, param_data, function (data) {
            afterPricing($scope.selected_pricing_type);
          });
        } else {
          param_data.productPricingId = $scope.pricing_id ? $scope.pricing_id : 0;
          if ($scope.is_discount) {
            if ($scope.pricing.discount_price > 99) {
              factories.invalidDataPop("Discount cannot be more than 99%");
              return;
            }
            param_data.price = discountPrice(PRICE_ARR);
            param_data.displayPrice = discountPrice(PRICE_ARR);
            param_data.start_date = '2000-01-01';
            param_data.end_date = $scope.pricing.discount_end_date;
          }
          services.editProductPricing($scope, param_data, function (data) {
            afterPricing($scope.selected_pricing_type);
          });
        }
      } else {
        services.addProductPricing($scope, param_data, function (data) {
          afterPricing($scope.selected_pricing_type);
        });
      }
    }



    $scope.makeProductUnavail = function (product) {
      services.CONFIRM(`YOU WANT TO MAKE ${product.item_unavailable == 1 ? 'AVAILABLE' : 'UNAVAILABLE'} THIS ${factories.localisation().product}`,
        function (isConfirm) {
          if (isConfirm) {
            if (typeof product.id == "number") {
              product.id = product.id.toString();
            }
            var param_data = {};
            param_data.product_id = product.id;
            param_data.item_unavailable = product.item_unavailable == 1 ? 0 : 1;
            $scope.message = `${factories.localisation().product} Has Been ${product.item_unavailable == 1 ? 'AVAILABLE' : 'UNAVAILABLE'}`;

            services.POST_DATA(param_data, API.MAKE_PRODUCT_UNAVAILABLE(), function (data) {
              getHomeData($scope.currentPage);
              services.SUCCESS_MODAL(true);
            });

          }
        });
    };

    $scope.deleteProduct = function (Id) {
      services.CONFIRM($translate.instant(`YOU WANT TO DELETE THIS ${factories.localisation().product}`),
        function (isConfirm) {
          if (isConfirm) {
            if (typeof Id == "number") {
              Id = Id.toString();
            }
            var param_data = {};
            param_data.accessToken = constants.ACCESSTOKEN;
            param_data.productId = Id;
            param_data.sectionId = 30;
            $scope.message = `${factories.localisation().product} ${$translate.instant('Has Been Deleted Successfully')}`;
            if ($stateParams.b_id) {
              param_data.branchId = $stateParams.b_id;
              services.POST_DATA(param_data, API.DELETE_BRANCH_PRODUCT(), function (data) {
                getHomeData($scope.currentPage);
                services.SUCCESS_MODAL(true);
              });
            } else {
              param_data.supplierId = $stateParams.id;
              services.POST_DATA(param_data, API.DELETE_SUPPLIER_PRODUCT(), function (data) {
                getHomeData(1);
                services.SUCCESS_MODAL(true);
              });
            }
          }
        });
    };

    $scope.setPage = function (page) {
      $scope.currentPage = page;
      $scope.skip = $scope.limit * (page - 1);
      getHomeData(page);
    }

    $scope.viewDescription = function (text) {
      $scope.read_more_text = text;
      $("#readMore").modal('show');
    }

    $scope.assignProducts = function () {
      let params = {
        id: $scope.supplier_id,
        cat_id: $scope.category_selected,
        multi_b: $scope.is_multi_branch,
        b_id: $scope.sup_branch_id,
        sub_cat_ids: $stateParams.sub_cat_ids
      };
      $state.go('production.assignProducts', params);
    }

    $scope.searchProduct = function (keyEvent, type) {
      if (keyEvent.which === 13) {
        if (type == 1) $scope.search = keyEvent.target.value;
        if (type == 2) $scope.tagSearch = keyEvent.target.value;
        $scope.skip = 0;
        getHomeData(1);
      }
    }

    $scope.removeDiscount = function (product) {
      let param_data = {
        accessToken: constants.ACCESSTOKEN,
        sectionId: 30
      }
      if (factories.getSettings().key_value.is_user_type == 1 && factories.getSettings().key_value.user_type_check == 1) {
        let id_arr = [];
        (product.price).filter(price => price.price_type == 1).forEach(p => {
          id_arr.push(p.id);
        });
        param_data['productPricingId'] = id_arr;
      } else {
        let discount_price = (product.price).find(price => price.price_type == 1);
        param_data['productPricingId'] = discount_price.id;
      }
      services.POST_DATA(param_data, API.REMOVE_PRICE(), function (response) {
        getHomeData($scope.currentPage);
        $scope.message = `${$translate.instant('Discount price has been removed.')}`;
        services.SUCCESS_MODAL(true);
      });
    }

    var upload = document.getElementById('upload');
    upload.value = null;

    function onFile() {
      var me = this;
      file = upload.files[0];
      $scope.selectedCsv = file;
      $scope.$apply(function () {
        $scope.selectedCsv = file;
        $scope.isCsv = true;
      });
      name = file.name.replace(/.[^/.]+$/, '');
      console.log('upload code goes here', $scope.selectedCsv, name);
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

    $scope.downloadSampleFile = () => {
      const a = document.createElement('a');
      document.body.appendChild(a);
      if ($rootScope.is_variant_product_import) {
        a.href = $rootScope.app_type == 1 ? $scope.settings.key_value.supplier_import_url_v1 :
          $scope.settings.key_value.product_variants_import_url_v2;
      }
      else {
        a.href = $rootScope.app_type == 1 ? $scope.settings.key_value.supplier_import_url_v1 :
          $scope.settings.key_value.supplier_import_url_v2;
      }
      // a.target = '_blank';
      a.setAttribute('style', 'display: none');
      a.download = 'Supplier-Product-Csv';
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
        "supplierId": $scope.supplierId,
        "branchId": $scope.sup_branch_id
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
      var api = '';

      if ($rootScope.is_variant_product_import) {
        api = API.SUPPLIER_VARIANT_PRODUCT_IMPORT;
      }
      else {
        api = API.ADMIN_SUPPLIER_PRODUCT_IMPORT();
      }

      if ($rootScope.disable_category_csv_upload == 1) {
        api = API.ADMIN_SUPPLIER_PRODUCT_IMPORT_WITHOUT_CATEGORY();
      }

      services.POST_FORM_DATA(param_data, api, function (response) {
        var csvCloseBtn = document.getElementById('close-csv-btn');
        csvCloseBtn.click();
        $scope.message = $translate.instant('File Successfully Uploaded');
        services.SUCCESS_MODAL(true);
        $scope.refresh();
      })
    }


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

    $scope.posImport = function (pos) {
      let params = {
        categoryId: $scope.selected_cat.category_id,
        subCategoryId: $scope.dynamicSubCategories.length ? $scope.selected_det_sub_cat.id : '',
        api_key: pos.api_key,
        client_id: pos.client_id,
        supplier_id: $scope.supplier_id
      }
      services.GET_DATA(params, API.POS_IMPORT_SUPPLIER, function (response) {
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
    $scope.changeSpecialInstruction = function (is_spcial_instruction) {
      $scope.product.is_special_instruction = is_special_instruction;
    }
    var getVendorProductUpdateList = function (page) {
      setTimeout(() => {
        if ($rootScope.enable_updation_vendor_approval == 1) {
          var data = {
            limit: 10,
            skip: 0
          };
          var api = API.PRODUCT_UPDATION_REQUESTS;
          if ($scope.product_id) {
            data['product_id'] = $scope.product_id;
            api = API.PRODUCT_UPDATION_REQUESTS_BY_PRODUCT_ID;
          }
          $scope.dataLoaded = false;
          services.GET_DATA(data, api, function (response) {
            $scope.vendorProductUpdateList = response.data.list;
            $scope.dataLoaded = true;
          });
        }
      }, 2000);
    };



  }]);
