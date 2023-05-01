Royo.controller('CategoryProdCtrl', ['$scope', '$rootScope', 'services', 'factories', 'constants', '$filter', '$state', '$stateParams', '$location', 'API', 'pagerService', '$translate',
  function ($scope, $rootScope, services, factories, constants, $filter, $state, $stateParams, $location, API, pagerService, $translate) {

    $scope.original_localisation = factories.localisation(true);

    $scope.main = {};
    $scope.outputs = {
      inputs: {},
      desc_inputs: [], //{},
      tax: ''
    };
    // $scope.edit = {};
    $scope.category = {};
    $scope.is_activate = 0;
    $scope.is_loader = 1;
    $scope.is_view_city = 0;
    $scope.addCategory = false;
    $scope.Selected = [];
    $scope.is_disabled_all = 1;
    $scope.is_disabled_deact = 1;
    $scope.is_disabled_act = 1;
    $scope.is_variant = 0;
    $scope.variantView = false;
    $scope.status = false;
    $scope.is_quantity = 1;
    $scope.sub_cat_btn = false;
    $scope.cat_id = 0;
    $scope.search = '';
    $scope.count = 0;
    $scope.currentPage = 1;
    $scope.skip = 0;
    $scope.limit = 20;
    $scope.tab = 1;
    $scope.is_grid = true;
    $scope.is_edit = false;
    $scope.brandsLoaded = false;
    $scope.dataLoaded = false;
    $scope.message = '';
    $scope.start_time = '';
    $scope.end_time = '';
    $scope.variant_id = '';
    $scope.Variants = [];
    $scope.read_more_text = '';
    $scope.is_product = factories.productType();
    $scope.cart_image_upload = 0;
    $scope.order_instructions = 0;
    $scope.payment_after_confirmation = 0;
    $scope.menu_type = 1;
    $scope.dine_in = 0;
    $scope.is_liquor = 0;
    $scope.disable_preparation_time = 0;

    $scope.flows = [];
    $scope.selected_flow = {};
    $scope.flow_type = '';
    $scope.basic_terminologies = [];
    $scope.status_terminologies = [];
    $scope.profileType = $rootScope.profile;

    $scope.selected_cat_id = 0;


    $scope.supplier_coordinates_geo = {
      lat: '',
      lng: ''
    };

    $scope.delivery_radius_geo = 0;

    $scope.geo_fence_set = false;
    $scope.is_geofence = false;
    $scope.gender_category = '';

    $rootScope.$on('is_cat_add_edit', function ($event, type) {
      if (type && type === 'ADD') {
        $scope.changeview(true, false);
      } else if (type && type === 'EDIT') {
        $scope.changeview(true, true);
      }
    });

    $scope.changeTime = function (type, time) {
      if (type == 'start') {
        $scope.start_time = time;
      } else if (type == 'end') {
        $scope.end_time = time;
      }
    }

    var clearInputs = function () {
      $scope.outputs = {
        inputs: {},
        desc_inputs: [], //{},
        tax: ''
      };
      $scope.is_quantity = 1;
      $scope.cat_img = '';
      $scope.cat_icon = '';
      $scope.cart_image_upload = 0;
      $scope.order_instructions = 0;
      $scope.payment_after_confirmation = 0;
      $scope.menu_type = 1;
      $scope.dine_in = 0;
      $scope.is_liquor = 0;
      $scope.gender_category = '';
      if ([5, 6, 7].includes($rootScope.app_type) || $rootScope.hideAgentList == 1) {
        $scope.agent_list = 0;
      } else {
        $scope.agent_list = 1;
      }
    }

    var getTerminologies = function (terminologies) {
      if ($rootScope.app_type > 10) {
        if (terminologies) {
          let terms = JSON.parse(terminologies);
          $scope.basic_terminologies = [];
          $scope.status_terminologies = [];
          Object.keys(terms.english).forEach(key => {
            if (key !== 'status') {
              $scope.basic_terminologies.push(
                {
                  key: key,
                  value: {
                    english: (terms.english)[key],
                    other: (terms.other)[key]
                  },
                  is_status: 0
                }
              )
            } else {
              Object.keys(terms.english.status).forEach(st => {
                $scope.status_terminologies.push(
                  {
                    key: parseInt(st),
                    value: {
                      english: (terms.english.status)[st],
                      other: (terms.other.status)[st]
                    },
                    is_status: 1
                  }
                )
              });
            }
          });
        }
      }
    }

    $scope.gridViewChange = function (val) {
      $scope.is_grid = val
    }

    $scope.changeview = function (is_add, is_edit) {
      $scope.addCategory = is_add;
      $scope.is_edit = is_edit;
      if (is_add) {
        if ($scope.is_edit) {
          $scope.Variants = [{ variant_name: [{ name: '' }], variant_values: [], id: '', is_color: false }];
        } else {
          $scope.Variants = [{ variant_name: [{ name: '' }], variant_values: [''], is_color: false }];
        }
        $scope.tab = 1;

        if ($rootScope.app_type > 10) {
          $scope.flows = $rootScope.flow_data;

          if (localStorage.getItem('client_code') == 'bodyformula_0497') {
            $scope.selected_flow = $scope.flows.find(flow => flow.flow_type == 8);
          } else {
            $scope.selected_flow = $scope.flows[0];
          }
          $scope.flowType($scope.selected_flow);

          if (factories.getSettings().key_value.terminology) {
            getTerminologies(factories.getSettings().key_value.terminology);
          }
        }
      }
      clearInputs();
    }

    $scope.changeTab = function (tab) {
      $scope.tab = tab;
      if (tab == 4) {
        getGeofenceAreas();
      }
    }

    $scope.flowType = function (selected_flow) {
      $scope.flow_type = selected_flow.flow_type;
      $scope.original_localisation = factories.localisation(true, selected_flow.flow_type);
    }

    $scope.changeInstructions = function (order_instructions) {
      $scope.order_instructions = order_instructions;
    }

    $scope.changeCartImageUpload = function (cart_image_upload) {
      $scope.cart_image_upload = cart_image_upload;
    }

    $scope.changeLiqourType = function (is_liquor) {
      $scope.is_liquor = is_liquor;
    }

    $scope.paymentConfirmation = function (payment_after_confirmation) {
      $scope.payment_after_confirmation = payment_after_confirmation;
    }

    $scope.menu_type_change = function (menu_type) {
      $scope.menu_type = menu_type;
    }

    $scope.changeDineIn = function (dine_in) {
      $scope.dine_in = dine_in;
    }

    $scope.change_disable_preparation_time = function (preparation_time) {
     $scope.disable_preparation_time = preparation_time;
    }

    $scope.changeGenderCategory = function (gender_category) {
      $scope.gender_category = gender_category;
    }

    var getCatBrands = function (category_id) {
      let param_data = {};
      param_data.sectionId = 62;
      param_data.cat_id = category_id;
      $scope.brandsLoaded = false;

      services.GET_DATA(param_data, API.GET_CAT_BRANDS(), function (response) {
        $scope.catBrandList = response.data;
        $scope.catBrandList.forEach(cat_brand => {
          $scope.brandList.forEach(brand => {
            if (brand.id == cat_brand.id) {
              brand.checked = true;
              brand.is_cat_brand = true;
            }
          });
        });
        $scope.brandsLoaded = true;
      });
    }

    var getAllBrands = function () {
      let params = {};
      params.sectionId = 62;
      params.offset = 0;
      params.limit = 0;
      services.GET_DATA(params, API.GET_BRANDS(), function (response) {
        $scope.brandList = response.data;
        ($scope.brandList).map(brand => {
          brand['checked'] = false;
          brand['is_cat_brand'] = false;
        });
      });
    }

    var getLanguagesData = function (k, stat) {
      services.getLanguagesData($scope, function (lang_data) {
        $scope.langData = lang_data;
      });
    };

    var editCat = function () {
      // services.GET_DATA({ offset: 0, limit: 500 }, API.ADMIN_CATEGORY_LIST(), function (response) {
      services.GET_DATA({ category_id: $stateParams.cat_id }, API.GET_CATEGORY_DETAIL, function (response) {
        if (response.data && response.data.categories.length) {
          let categoryData = response.data.categories;
          // let category = categoryData.find(cat => {
          //   return cat.category_id == $stateParams.cat_id;
          // });
          $scope.edit(categoryData[0]);
        }
      });
    }

    var getCategoryList = function (page) {
      $scope.dataLoaded = false;
      let params = {
        limit: $scope.limit,
        offset: $scope.skip,
      }
      params.search = ($scope.search).trim() ? $scope.search : '';

      services.GET_DATA(params, API.ADMIN_CATEGORY_LIST(), function (response) {
        if (response.data && response.data.categories.length) {
          $scope.categoryData = response.data.categories;
          $scope.count = response.data.count;
          let generic_index = -1;
          let i = 0;
          let lang_index = localStorage.getItem('lang') != 'en' ? 1 : 0;
          $scope.categoryData.map(el => {
            if (el.category_id == 1) {
              generic_index = i;
            }
            el['name'] = el.category_name.length ? el.category_name[lang_index].name : '';
            el['description'] = el.category_name.length ? el.category_name[lang_index].description : '';
            i++;
          });
          if (generic_index > -1) {
            $scope.categoryData.splice(generic_index, 1);
          }
          if ($stateParams.cat_id && $scope.is_edit) {
            editCat();
          }
          $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
        } else {
          $scope.categoryData = [];
        }
        getLanguagesData();
        getAllBrands();
        $scope.dataLoaded = true;
      });
    }
    getCategoryList(1);


    $scope.refresh = function () {
      $scope.skip = 0;
      $scope.currentPage = 1;
      getCategoryList(1);
    }

    var getVariants = function (category_id) {
      let params = {};
      params.sectionId = 30;
      params.category_id = category_id;
      services.getVariantList($scope, params, function (data) {
        $scope.Variants = [];
        console.log(data)
        if (data && data.length) {
          data.forEach(variant => {

            variant.variant_name.forEach(el => {
              if (el.variant_type != undefined && el.variant_type != null) {
                delete el.variant_type
              }
            });

            $scope.Variants.push({
              variant_name: variant.variant_name,
              variant_values: variant.variant_values,
              is_color: variant.variant_type,
              id: variant.id
            })
          });
        } else {
          $scope.Variants = [{ variant_name: [{ name: '' }], variant_values: [''], is_color: false }];
        }
      });
    }

    $scope.edit = function (category) {

      if ($rootScope.enable_supplier_add_edit_delete_restriction == 1 && $rootScope.profile == 'SUPPLIER') {
        return;
      }

      $scope.category = category;
      if ($rootScope.add_variant_supplier == 1 && $rootScope.profile == 'SUPPLIER')
        $scope.tab = 2;
      else $scope.tab = 1;
      $scope.addCategory = true;
      $scope.is_edit = true;
      $scope.category_id = category.category_id;
      $scope.is_quantity = category.is_quantity;
      $scope.agent_list = category.agent_list;
      $scope.cat_img = category.image;
      $scope.cat_icon = category.icon;
      $scope.start_time = category.start_time;
      $scope.end_time = category.end_time;
      $scope.outputs.tax = category.tax;
      $scope.cart_image_upload = category.cart_image_upload ? category.cart_image_upload : 0;
      $scope.order_instructions = category.order_instructions ? category.order_instructions : 0;
      $scope.is_liquor = category.is_liquor ? category.is_liquor : 0;
      $scope.payment_after_confirmation = category.payment_after_confirmation ? category.payment_after_confirmation : 0;
      $scope.menu_type = category.menu_type ? category.menu_type : 1;
      if ($rootScope.show_gender_category_dropdown == 1) {
        $scope.gender_category = category.service_for;
      }
      if ($rootScope.app_type > 10 && $rootScope.is_table_booking == 1) {
        $scope.dine_in = category.is_dine ? category.is_dine : 0;
      }
      $scope.disable_preparation_time = category.disable_preparation_time  ? category.disable_preparation_time : 0;
      let i = 0;
      (category.category_name).forEach(el => {
        $scope.outputs.inputs[i] = el.name;
        $scope.outputs.desc_inputs[i] = el.description;
        i++
      });

      if (category.is_variant) {
        getVariants(category.category_id);
      } else {
        $scope.Variants = [{ variant_name: [{ name: '' }], variant_values: [''], is_color: false }];
      }

      getCatBrands(category.category_id);

      if ($rootScope.profile == 'ADMIN' && $rootScope.enable_geofence_wise_categories) {
        getGeofenceAreas();
      }

      if ($rootScope.app_type > 10) {
        $scope.flows = $rootScope.flow_data;
        $scope.selected_flow = $scope.flows.find(flow => flow.flow_type == category.type);
        $scope.flowType($scope.selected_flow);
        if (category.terminology) {
          getTerminologies(category.terminology);
        }
      }

    }

    $scope.blockCategory = function (category) {
      let param_data = {};
      param_data.sectionId = 27;
      param_data.category_id = category.category_id;
      param_data.is_live = +(!category.is_live);
      services.POST_DATA(param_data, API.BLOCK_CATEGORY(), function (response) {
        getCategoryList($scope.currentPage);
        $scope.message = `${factories.localisation().category} ${$translate.instant('status has been updated')}`;
        services.SUCCESS_MODAL(true);
      });
    }

    /*** Image Upload Function ***/
    $scope.files = [];
    $scope.image_file;
    $scope.icon_file;

    $scope.$on("fileSelected", function (event, args) {
      $scope.$apply(function () {
        $scope.files.push(args.file);
      });
    });

    /* Get to be uploading file and set it into a variable and read to show it on view */
    $scope.file_to_upload_for_image = function (File) {
      var file = File[0];
      if (constants.IMAGE_TYPE.includes(file.type)) {
        if ((file.size / Math.pow(1024, 2)) <= 7) {
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function (e) {
            // var image = new Image();
            // image.src = e.target.result;
            // image.onload = function () {
            //   let aspect_ratio = image.width / image.height;
            //   if(aspect_ratio >= 1.30 && aspect_ratio <= 1.42) {
            $scope.$apply(function () {
              $scope.cat_img = e.target.result;
              $scope.image_file = File[0];
            });
            //   } else {
            //     factories.invalidDataPop("Invalid aspect ratio of image");
            //     return;
            //   }
            // }
          }
        } else {
          factories.invalidDataPop($translate.instant("Image size must be less than 7mb"));
        }
      } else {
        factories.invalidDataPop($translate.instant("Invalid File Type"));
      }
    };

    /* Get to be uploading file and set it into a variable and read to show it on view */
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

    $scope.checkBrand = function (brand) {
      brand.checked = !brand.checked;
    }

    $scope.varient = function (value) {
      $scope.is_variant = value;
    }

    $scope.agent = function (agent_list) {
      $scope.agent_list = agent_list;
    }

    $scope.quantityType = function (is_quantity) {
      $scope.is_quantity = is_quantity;
    }

    /*** =============== Add Variants ============== ***/

    $scope.switchToColor = function (parentIndex) {
      let variant = $scope.Variants[parentIndex];
      variant.is_color = !variant.is_color;
      if (variant.is_color) {
        if ($scope.is_edit) {
          $scope.Variants[parentIndex].variant_values = [{ value: '#ffffff' }];
        } else {
          $scope.Variants[parentIndex].variant_values = ['#ffffff'];
        }
      } else {
        if ($scope.is_edit) {
          $scope.Variants[parentIndex].variant_values = [{ value: '' }];
        } else {
          $scope.Variants[parentIndex].variant_values = [''];
        }
      }
    }

    $scope.AddVariant = function () {
      //Add the new item to the Array.
      let lastVariant = $scope.Variants[$scope.Variants.length - 1];
      if (!lastVariant.variant_name || !lastVariant.variant_values[0]) {
        factories.warningDataPop($translate.instant('Please enter variant'));
        return;
      }
      var variant = {};
      variant.variant_name = $scope.variant_name;
      variant.variant_values = $scope.variant_values;
      $scope.Variants.push(variant);
      let length = $scope.Variants.length;
      $scope.Variants[length - 1].variant_name = [{ name: '' }];
      $scope.Variants[length - 1].variant_values = [''];
    };

    $scope.RemoveVariant = function (index) {
      if ($scope.is_edit && $scope.category.is_variant) {
        let variantToDel = $scope.Variants[index];
        if (variantToDel.id) {
          let formData = {};
          formData.id = parseInt(variantToDel.id);
          formData.sectionId = 30;

          services.PUT_DATA(formData, API.DELETE_VARIANT(), function (response) {
            $scope.message = `${$translate.instant('Variant removed successfully')}`;
            services.SUCCESS_MODAL(true);
          });
        }
        $scope.Variants.splice(index, 1);
      } else {
        $scope.Variants.splice(index, 1);
      }
    }

    $scope.addVariantVal = function (parentIndex, childIndex) {
      if (!$scope.Variants[parentIndex].variant_values[0]) {
        factories.warningDataPop($translate.instant('Please enter a variant value'));
        return;
      }
      var variantVal = $scope.Variants[parentIndex].is_color ? ($scope.is_edit ? { value: '#ffffff' } : '#ffffff') : '';
      if ($scope.Variants[parentIndex].variant_values.length <= childIndex + 1) {
        $scope.Variants[parentIndex].variant_values.splice(childIndex + 1, 0, variantVal);
      }
    };

    $scope.addVariants = function (category_id) {
      let variant_arr = [...$scope.Variants];
      for (variant of variant_arr) {
        let variantName = [];
        variant['variant_type'] = variant.is_color ? +variant.is_color : 0;
        delete variant.is_color;
        for (key in variant.variant_name) {
          for (let lang of $scope.langData) {
            let nameObj = {};
            if (key === lang.language_name) {
              nameObj = {
                name: variant.variant_name[key],
                language_id: lang.id
              }
              variantName.push(nameObj)
            }
          }
        }
        variant.variant_name = variantName;
      }

      let formData = {};
      formData.variant = variant_arr;
      formData.category_id = category_id;
      formData.sectionId = 27;

      services.POST_DATA(formData, API.ADD_VARIANT(), function (response) {
        if ([2].includes($rootScope.app_type) || ($rootScope.app_type > 10 && [2].includes($scope.flow_type))) {
          $scope.tab = 3;
          getCatBrands($scope.category_id);
          $scope.Variants = [{ variant_name: [{ name: '' }], variant_values: [''], is_color: false }];
        } else if ($rootScope.enable_geofence_wise_categories == 1) {
          $scope.tab = 4;
          getGeofenceAreas();
        } else {
          $scope.final();
        }
      });
    }

    $scope.updateVariant = function (variant) {

      var selectedVariant = { ...variant };

      var variantToSubmit = {
        variant_name: [],
        variant_values: [],
        variant_type: 0
      };
      var variantId = '';

      for (val of selectedVariant.variant_values) {
        if (!val.value) {
          factories.warningDataPop($translate.instant('Field cannot be empty'));
          return;
        }
      }

      if (!!selectedVariant && !!selectedVariant.id) {
        for (val of selectedVariant.variant_name) {
          if (!val.name) {
            factories.warningDataPop($translate.instant('Field cannot be empty'));
            return;
          }
        }

        variantId = selectedVariant.id;
        delete selectedVariant.id;
        selectedVariant.variant_name.forEach(val => {
          delete val.ml_id;
          delete val.id;
        });
      } else if (selectedVariant) {
        let nameArr = [];
        let nameObj = selectedVariant.variant_name;
        let i = 0;
        $scope.langData.forEach(lang => {
          if (!nameObj[i] && lang.id == 14) {
            factories.warningDataPop($translate.instant('Field cannot be empty'));
            return;
          }
          if (!nameObj[i] && lang.id == 15) {
            nameObj[i] = nameObj[i - 1] ? nameObj[i - 1] : { name: '' };
          }
          nameArr.push({
            name: nameObj[i].name,
            language_id: lang.id
          });
          i++;
        });
        selectedVariant.variant_name = nameArr;
      }

      variantToSubmit.variant_name = selectedVariant.variant_name;
      variantToSubmit.variant_values = selectedVariant.variant_values;
      variantToSubmit.variant_type = selectedVariant.is_color ? 1 : 0;

      let formData = {};
      if (variantId) {
        formData.id = variantId;
      }
      formData.variant = [variantToSubmit];
      formData.category_id = parseInt($scope.category.category_id);
      formData.sectionId = 30

      services.POST_DATA(formData, API.EDIT_VARIANT(), function (response) {
        $scope.message = `${$translate.instant('Variant updated successfully')}`;
        services.SUCCESS_MODAL(true);
      });
    }

    $scope.deleteVariantVal = function (parentIndex, childIndex) {
      let variantToDel = $scope.Variants[parentIndex].variant_values[childIndex];
      if (variantToDel.id) {
        let formData = {};
        formData.ids = [variantToDel.id];
        formData.sectionId = 30;

        services.PUT_DATA(formData, API.DELETE_VARIANT_VALUE(), function (response) {
          $scope.message = `${$translate.instant('Variant value removed successfully')}`;
          services.SUCCESS_MODAL(true);
        });
      }
      $scope.Variants[parentIndex].variant_values.splice(childIndex, 1);
    }

    $scope.back = function () {
      if ($scope.tab == 2) {
        $scope.tab = 1;
        $scope.cat_img = '';
        $scope.cat_icon = '';
      } else if ($scope.tab = 3) {
        $scope.tab = 2;
      } else if ($scope.tab = 4) {
        if ([2].includes($rootScope.app_type) || ($scope.app_type > 10 && [2].includes($scope.flow_type))) {
          $scope.tab = 3;
        } else {
          $scope.tab = 2;
        }
      }

    }

    $scope.cat_params = {};
    $scope.submitCategory = function (addCategoriesForm) {

      if (addCategoriesForm.$submitted && addCategoriesForm.$invalid) return;

      let terminologies = {
        english: {
          status: {}
        },
        other: {
          status: {}
        }
      }

      if ($rootScope.app_type > 10 && $scope.basic_terminologies.length && $scope.status_terminologies.length) {
        $scope.basic_terminologies.forEach(el => {
          terminologies.english[el.key] = (el.value.english).trim();
          terminologies.other[el.key] = (el.value.other).trim();
        });
        $scope.status_terminologies.forEach(el => {
          (terminologies.english['status'])[el.key] = (el.value.english).trim();
          (terminologies.other['status'])[el.key] = (el.value.other).trim();
        });
      }

      $scope.is_disabled_add = 1;
      var nameData = $scope.outputs.inputs;
      var descData = $scope.outputs.desc_inputs;

      var param_data = {};
      param_data['accessToken'] = constants.ACCESSTOKEN;
      param_data['authSectionId'] = 27;
      param_data['name'] = nameData[0] + '#' + (nameData[1] ? nameData[1] : nameData[0]);
      param_data['languageId'] = '14#15';
      param_data['description1'] = descData.length ? descData[0] + '#' + (descData[1] ? descData[1] : descData[0]) : '#';
      param_data['image'] = $scope.image_file;
      param_data['icon1'] = $scope.icon_file;
      param_data['category_flow'] = factories.categoryFlow();
      param_data['agent_list'] = $scope.agent_list;
      param_data['is_quantity'] = 1;
      param_data['is_variant'] = 0;
      param_data['tax'] = $rootScope.is_dine_in == 1 ? 0 : $scope.outputs.tax;
      param_data['start_time'] = ($rootScope.app_type == 1 || ($scope.app_type > 10 && $scope.flow_type == 8)) ? $scope.start_time : '00:00:00';
      param_data['end_time'] = ($rootScope.app_type == 1 || ($scope.app_type > 10 && $scope.flow_type == 8)) ? $scope.end_time : '00:00:00';
      param_data['cart_image_upload'] = $scope.cart_image_upload;
      param_data['order_instructions'] = $scope.order_instructions;
      param_data['is_liquor'] = $scope.is_liquor;
      param_data['payment_after_confirmation'] = $scope.payment_after_confirmation;
      if ($scope.flow_type == 1 || $rootScope.app_type == 1) param_data['menu_type'] = $scope.menu_type;
      if ($rootScope.is_single_vendor == 1) {
        param_data['supplier_id'] = $rootScope.single_vendor_id;
      }
      if ($rootScope.app_type > 10 && $rootScope.is_table_booking == 1) {
        param_data['is_dine'] = $scope.dine_in;
      }
       param_data['disable_preparation_time'] = $scope.disable_preparation_time;

      if ($rootScope.app_type > 10) {
        param_data['type'] = $scope.flow_type;
        param_data['terminology'] = JSON.stringify(terminologies);
      }

      if ($rootScope.show_gender_category_dropdown == 1) {
          param_data['service_for'] = $scope.gender_category;
      }

      if ($scope.is_edit) {
        param_data['categoryId'] = $scope.category_id;
        param_data['imageUrl'] = $scope.image_file ? $scope.image_file : $scope.category.image;
        param_data['iconUrl'] = $scope.icon_file ? $scope.icon_file : $scope.category.icon;
        param_data['iconStatus'] = 0;
        if ($scope.icon_file) {
          param_data['iconStatus'] = 1;
        }

        services.POST_FORM_DATA(param_data, API.EDIT_CATEGORY(), function (data) {
          afterSubmitCat(data);
        });
      } else {
        services.POST_FORM_DATA(param_data, API.ADD_CATEGORY(), function (data) {
          afterSubmitCat(data);
        });
      }
    };

    var afterSubmitCat = function (data) {
      if (data.data.category_id) {
        $scope.selected_cat_id = data.data.category_id;
      }
      if ($rootScope.enable_food_varients !=1 && !$rootScope.enable_geofence_wise_categories && [1, 8].includes($rootScope.app_type) || ($scope.app_type > 10 && [1, 8].includes($scope.flow_type))) {
        $scope.final();
      } else if ($rootScope.enable_food_varients !=1 && $rootScope.enable_geofence_wise_categories) {
        $scope.tab = 4;
        $scope.category_id = $scope.is_edit ? $scope.category_id : data.data.category_id;
        getGeofenceAreas();
      } else {
        $scope.tab = 2;
        $scope.category_id = $scope.is_edit ? $scope.category_id : data.data.category_id;
      }
    }

    $scope.submitVariant = function (is_variant) {
      if (is_variant) {
        for (let variant of $scope.Variants) {
          if (!variant.variant_name || variant.variant_name == undefined) {
            factories.warningDataPop($translate.instant('Please enter variant names'));
            return;
          }
          for (let val of variant.variant_values) {
            if (!val || val == undefined) {
              factories.warningDataPop($translate.instant('Please enter variant values'));
              return;
            }
          }
        }
        $scope.addVariants($scope.category_id);
      } else {
        if ([2].includes($rootScope.app_type) || ($scope.app_type > 10 && [2].includes($scope.flow_type))) {
          $scope.tab = 3;
          getCatBrands($scope.category_id);
        } else if ($rootScope.enable_geofence_wise_categories) {
          $scope.tab = 4;
          getGeofenceAreas();
        } else {
          $scope.final();
        }
      }
    }

    $scope.brandSubmit = function () {
      let selectedBrands = [];
      let brandsToDelete = [];
      let brandsAlreadySelected = [];

      ($scope.brandList).forEach(brand => {
        if (brand.checked && !brand.is_cat_brand) {
          selectedBrands.push(brand.id);
        } else if (brand.is_cat_brand && !brand.checked) {
          brandsToDelete.push(brand.id);
        } else if (brand.is_cat_brand && brand.checked) {
          brandsAlreadySelected.push(brand.id);
        }
      });

      if (selectedBrands.length == 0 && brandsToDelete.length == 0) {
        if (brandsAlreadySelected.length == 0) {
          factories.invalidDataPop(`${$translate.instant('Please select atleast one')} ${factories.localisation().brand}`);
          return;
        } else {
          if ($rootScope.enable_geofence_wise_categories) {
            $scope.tab = 4;
            getGeofenceAreas();
          } else {
            $scope.final();
          }
        }
      }

      if (selectedBrands.length > 0 && brandsToDelete.length > 0) {
        let param_data = {};
        param_data.sectionId = 62;
        param_data.cat_id = $scope.category_id;
        param_data.brandIds = JSON.stringify(selectedBrands);
        services.POST_FORM_DATA(param_data, API.ADD_BRANDS_TO_CATEGORY(), function (response) {
          let params = {};
          params.sectionId = 62;
          params.cat_id = $scope.category_id;
          params.brandIds = JSON.stringify(brandsToDelete);
          services.POST_FORM_DATA(params, API.DELETE_BRAND_FROM_CATEGORY(), function (response) {
            $scope.final();
          });
        });
      } else if (selectedBrands.length > 0 && brandsToDelete.length == 0) {
        let param_data = {};
        param_data.sectionId = 62;
        param_data.cat_id = $scope.category_id;
        param_data.brandIds = JSON.stringify(selectedBrands);
        services.POST_FORM_DATA(param_data, API.ADD_BRANDS_TO_CATEGORY(), function (response) {
          $scope.final();
        });
      } else if (selectedBrands.length == 0 && brandsToDelete.length > 0) {
        let params = {};
        params.sectionId = 62;
        params.cat_id = $scope.category_id;
        params.brandIds = JSON.stringify(brandsToDelete);
        services.POST_FORM_DATA(params, API.DELETE_BRAND_FROM_CATEGORY(), function (response) {
          $scope.final();
        });
      }
    }

    $scope.final = function () {
      $scope.refresh();
      services.SUCCESS_MODAL(true);
      $(".message").text(`${$translate.instant(`${factories.localisation().category} has been ${$scope.is_edit ? 'updated' : 'added'} successfully`)}`);
      setTimeout(() => {
        $scope.changeview(false, false);
      }, 600);
    }

    $scope.openSubCat = function () {
      $state.go("production.subCategory", {
        cat_id: $scope.cat_id
      });
    }

    $scope.activateCountry = function (Id, status) {
      if (typeof Id == "number") {
        Id = Id.toString();
      }
      var param_data = {};
      param_data.id = Id;
      param_data.section_id = 17;
      param_data.status = status;
      services.activateCountry($scope, param_data, function (data) {
        $scope.refresh();
      });
    };

    $scope.viewDescription = function (text) {
      $scope.read_more_text = text;
      $("#readMore").modal('show');
    }

    $scope.viewProducts = function (category) {
      let params = {
        cat_id: category.category_id
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

    $scope.setPage = function (page) {
      $scope.currentPage = page;
      $scope.skip = $scope.limit * (page - 1);
      getCategoryList(page);
    }

    $scope.searchCategoy = function (keyEvent) {
      if (keyEvent.which === 13) {
        $scope.search = keyEvent.target.value;
        $scope.skip = 0;
        getCategoryList(1);
      }
    }














    $scope.isCsv = false;
    $scope.selectedCsv = {};
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
      if ($rootScope.enable_food_varients == 1) {
        a.href = $scope.settings.key_value.cat_variant_import_sample_url
      }
      // a.target = '_blank';
      a.setAttribute('style', 'display: none');
      a.download = 'Supplier-Cat-Csv';
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
        "catId": parseInt($scope.selected_cat_id),
      }

      var api = '';
      api = API.ADMIN_IMPORT_VARIENT;

      services.POST_FORM_DATA(param_data, api, function (response) {
        var csvCloseBtn = document.getElementById('close-csv-btn');
        csvCloseBtn.click();
        $scope.message = `${$translate.instant('File Successfully Uploaded')}`;
        services.SUCCESS_MODAL(true);
        $scope.refresh();
      })
    }



    //Geofence delivery charge & taxes
    $scope.geofence_areas = [];
    $scope.geofence_coordinates = [];
    $scope.current_geofence_index = -1;

    var getGeofenceAreas = function () {
      $scope.geofence_areas = [];
      services.GET_DATA({ category_id: $scope.category_id }, API.LIST_CATEGORY_GEOFENCE_AREA, function (response) {
        if (response && response.data.length) {
          $scope.geofence_areas = response.data;
        }
        $scope.addArea();
      });
    }

    $scope.addArea = function () {
      $scope.geofence_areas.push({
        coordinates: [],
        category_id: $scope.category_id
      });
    }

    $scope.removeArea = function (id, index) {
      services.CONFIRM(`You want to delete this area`,
        function (isConfirm) {
          if (isConfirm) {
            let params = {
              id
            }
            services.POST_DATA(params, API.DELETE_CATEGORY_GEOFENCE_AREA, function (response) {
              $scope.geofence_areas.splice(index, 1);
              $scope.message = `${$translate.instant('Geofence area removed')}`;
              services.SUCCESS_MODAL(true);
            });
          }
        });
    }

    $scope.initGeofence = function (index) {
      $("#geo").modal('show');
      $scope.current_geofence_index = index;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          let obj = {};
          if ($scope.geofence_areas[$scope.current_geofence_index].id) {
            let data = $scope.geofence_areas[$scope.current_geofence_index].coordinates[0];
            obj = {
              lat: data.x,
              lng: data.y
            }
          } else {
            obj = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }
          var map = new google.maps.Map(document.getElementById('geo_map'), {
            center: obj,
            zoom: 15
          });

          function getPolygonPath(polygon) {
            let arr = [];
            for (var i = 0; i < polygon.getPath().getLength(); i++) {
              let latlng = polygon.getPath().getAt(i);
              arr.push({
                x: latlng.lat(),
                y: latlng.lng()
              });
            }
            $scope.geofence_coordinates = arr;
            $scope.geofence_coordinates.push(arr[0]);
          }

          if ($scope.geofence_areas[$scope.current_geofence_index].id) {
            $scope.geofence_coordinates = $scope.geofence_areas[$scope.current_geofence_index].coordinates;
            let polygon_coordinates = $scope.geofence_coordinates.map(latlng => {
              return {
                lat: (latlng.x),
                lng: (latlng.y)
              }
            });
            polygon_coordinates.pop()
            var myPolygon = new google.maps.Polygon({
              paths: polygon_coordinates,
              fillColor: '#2ca6b18c',
              strokeOpacity: 0.8,
              fillOpacity: 0.4,
              strokeWeight: 3,
              strokeColor: '#4a4a4a',
              draggable: true,
              editable: true,
              zIndex: 1
            });
            myPolygon.setMap(map);

            google.maps.event.addListener(myPolygon, 'dragend', function () {
              getPolygonPath(myPolygon);
            });

            google.maps.event.addListener(myPolygon.getPath(), 'insert_at', function () {
              getPolygonPath(myPolygon);
            });
            google.maps.event.addListener(myPolygon.getPath(), 'set_at', function () {
              getPolygonPath(myPolygon);
            });
          }

          var selectedShape;

          function clearSelection() {
            if (selectedShape) {
              selectedShape.setEditable(false);
              selectedShape.setMap(null);
              selectedShape = null;
            }
            if ($scope.geofence_areas[$scope.current_geofence_index].id) {
              myPolygon.setMap(null);
            }
          }

          function setSelection(shape) {
            clearSelection();
            selectedShape = shape;
            shape.setEditable(true);
          }

          var drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: $scope.geofence_areas[$scope.current_geofence_index].id ? null : google.maps.drawing.OverlayType.POLYGON,
            drawingControl: true,
            drawingControlOptions: {
              position: google.maps.ControlPosition.TOP_CENTER,
              drawingModes: [google.maps.drawing.OverlayType.POLYGON]
            },
            polygonOptions: {
              fillColor: '#2ca6b18c',
              strokeOpacity: 0.8,
              fillOpacity: 0.4,
              strokeWeight: 3,
              strokeColor: '#4a4a4a',
              clickable: true,
              draggable: true,
              editable: true,
              zIndex: 1
            }
          });
          drawingManager.setMap(map);

          google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
            var newShape = event.overlay;
            newShape.type = event.type;

            if (event.type === google.maps.drawing.OverlayType.POLYGON) {
              drawingManager.setDrawingMode(null);
              getPolygonPath(newShape);

              google.maps.event.addListener(newShape, 'dragend', function () {
                setSelection(newShape);
              });

              setSelection(newShape);
            }
          });

          google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);

        });
      }
    }

    $scope.setGeofence = function () {
      $scope.geofence_areas[$scope.current_geofence_index].coordinates = $scope.geofence_coordinates;
      $("#geo").modal('hide');
      console.log($scope.geofence_areas)
    }

    var afterupdate = function () {
      $scope.message = `${$translate.instant('Geofence details updated')}`;
      services.SUCCESS_MODAL(true);
      getGeofenceAreas();
    }

    $scope.setGeofenceData = function (geofenceForm, index) {

      if (geofenceForm.$submitted && geofenceForm.$invalid) return;

      if (!$scope.geofence_areas[index].coordinates.length) {
        factories.invalidDataPop($translate.instant(`Please select geofence area`));
        return;
      }

      if ($scope.geofence_areas[index].id) {
        let value = { ...$scope.geofence_areas[index] };
        delete value.category_id;
        services.POST_DATA(value, API.UPDATE_CATEGORY_GEOFENCE_AREA, function (response) {
          afterupdate();
        });
      } else {
        services.POST_DATA($scope.geofence_areas[index], API.ADD_CATEGORY_GEOFENCE_AREA, function (response) {
          afterupdate();
        });
      }

    }
    $scope.deleteCategory = function (category) {
      services.CONFIRM($translate.instant(`You want to delete this Category`),
        function (isConfirm) {
          if (isConfirm) {
            var param_data = {};
            param_data.accessToken = constants.ACCESSTOKEN;
            param_data.id = category['category_id'];
            param_data.sectionId = 27;
            services.POST_DATA(param_data, API.DELETE_SUB_CAT(), function (response) {
              $scope.refresh();
              $scope.message = `${$translate.instant('Category has been deleted')}`;
              services.SUCCESS_MODAL(true);
            });
          }
        });
    };



  }]);
