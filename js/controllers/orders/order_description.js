Royo.controller('OrderDescCtrl', ['$scope', 'services', '$stateParams', 'API', '$rootScope', '$translate', 'constants', 'pagerService', 'factories',
  function ($scope, services, $stateParams, API, $rootScope, $translate, constants, pagerService, factories) {

    $scope.userId;
    $scope.latlng = '';
    $scope.selected_status = 1;
    $scope.msg_description = '';
    $scope.products = [];
    $scope.data_loaded = false;
    $scope.selected_order = {};
    $scope.prep_time = '00:00:00';
    $scope.questions = [];
    $scope.zelle_order = null;
    $scope.prescription_image = '';
    $scope.edit_product = 0;
    $scope.selected_products = [];
    $scope.supplier_id = '';
    $scope.branch_id = '';
    $scope.tabStatus = $stateParams.tab || 0;
    $scope.skip = 0;
    $scope.limit = 20;
    $scope.dataLoaded = false;
    $scope.categories = [];
    $scope.search = '';
    $scope.selected_products = [];
    $scope.product_list = [];
    $scope.deletedProducts = [];
    $scope.supplierData = {};

    $scope.is_multiple_supplier = factories.getSettings().bookingFlow[0].vendor_status;

    $scope.geofence_tax_data = [];
    $scope.reason_type = 0;
    $scope.reason_label = '';

    $scope.schedule_delivery_time = {
      date: '',
      time: ''
    }
    $scope.profile = $rootScope.profile
    $scope.is_head_branch = $rootScope.is_head_branch

    $scope.showRefundBtn = false;
    $scope.discount = 0;

    $scope.is_dhl_assignment = false;


    $scope.vehicleCatList = [];
    $scope.selected_order_for_assign = {};
    $scope.selected_agent_vehicle_cat = "";
    $scope.current_time = new Date();
    $scope.dine_in_deliver_disable = false;

    $scope.order_cancel_type = 0;


    $scope.edit_order_price = {
      admin_updated_charge: "",
      handlingAdmin: "",
      admin_price_update_receipt: "",
      is_tax_add: "",
      is_subtotal_add: "",
      order_id: 0
    }

    $scope.ship_rocket_obj = {
      deliveryCharge: "",
      weight: "",
      length: "",
      height: "",
      breadth: "",
      customer_pincode: "",
      customer_state: "",
      supplier_pincode: "",
      supplier_state: "",
      supplier_city: "",
    }

    $scope.description = '';
    $scope.prescription_image_arr = [];

    var getMumybenePaymentStatus = function () {
      const payload = {
        paymentReference: $scope.order_desc['transaction_id'],
        accessToken: constants.ACCESSTOKEN,
        authSectionId: 36
      }

      services.POST_DATA(payload, API.MUMYBENE_PAYMENT_STATUS, function (response) {
        $scope.order_desc['paymentStatus'] = response.data['responseMessage'];
        $scope.order_desc['paymentId'] = response.data['paymentID']

        if (($scope.order_desc['paymentStatus']).toLowerCase() == 'successful' && ($scope.order_desc.status == 2 || $scope.order_desc.status == 8)) {
          $scope.showRefundBtn = true;
        }
      })
    }

    $scope.refundMumybenePayment = function () {
      const payload = {
        paymentReference: $scope.order_desc['transaction_id'],
        accessToken: constants.ACCESSTOKEN,
        authSectionId: 36
      }

      $scope.data_loaded = true;

      services.POST_DATA(payload, API.MUMYBENE_REVERSE_PAYMENT, function (response) {
        $scope.showRefundBtn = false;
      })
    }

    var getOrderDesc = function () {
      $scope.freeProductQuantity = 0;
      $scope.orderId = $stateParams.order_id;
      $scope.products = [];
      $scope.prescription_image_arr = [];
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.authSectionId = 36;
      param_data.orderId = $scope.orderId;

      services.POST_DATA(param_data, API.GET_ORDER_DESCRIPTION(), function (response) {
        $scope.order_desc = (response.data)[0];
        $scope.odrder_giftparse=JSON.parse((response.data)[0].gift_data);
        $scope.branch_id = $scope.order_desc.supplier_branch_id;
        $scope.supplier_id = $scope.order_desc.supplier_id;

        if ($rootScope.profile == 'SUPPLIER' && $rootScope.remove_delivery_charge_supplier == 1)
          $scope.order_desc.order_cost = $scope.order_desc.order_cost - $scope.order_desc.delivery_charges;


        if ($rootScope.profile == 'SUPPLIER' && $rootScope.remove_service_fee_supplier == 1 && !!$scope.order_desc.user_service_charge)
          $scope.order_desc.order_cost = $scope.order_desc.order_cost - $scope.order_desc.user_service_charge;


        // console.log('hede', $scope.order_desc.order_cost, $scope.order_desc.delivery_charges);
        if ($scope.order_desc.pres_image1) {
          var prescription_image_arr_obj = { url: '', type: '' }
          prescription_image_arr_obj.url = $scope.order_desc.pres_image1;
          if ($scope.order_desc.pres_image1.split('.').pop() === 'pdf') {
            prescription_image_arr_obj.type = 'pdf';
          }
          else {
            prescription_image_arr_obj.type = 'image';
          }
          $scope.prescription_image_arr.push(prescription_image_arr_obj);
        }
        if ($scope.order_desc.pres_image2) {
          var prescription_image_arr_obj = { url: '', type: '' }
          prescription_image_arr_obj.url = $scope.order_desc.pres_image2;
          if ($scope.order_desc.pres_image2.split('.').pop() === 'pdf') {
            prescription_image_arr_obj.type = 'pdf';
          }
          else {
            prescription_image_arr_obj.type = 'image';
          }
          $scope.prescription_image_arr.push(prescription_image_arr_obj);
        }
        if ($scope.order_desc.pres_image3) {
          var prescription_image_arr_obj = { url: '', type: '' }
          prescription_image_arr_obj.url = $scope.order_desc.pres_image3;
          if ($scope.order_desc.pres_image3.split('.').pop() === 'pdf') {
            prescription_image_arr_obj.type = 'pdf';
          }
          else {
            prescription_image_arr_obj.type = 'image';
          }
          $scope.prescription_image_arr.push(prescription_image_arr_obj);
        }
        if ($scope.order_desc.pres_image4) {
          var prescription_image_arr_obj = { url: '', type: '' }
          prescription_image_arr_obj.url = $scope.order_desc.pres_image4;
          if ($scope.order_desc.pres_image4.split('.').pop() === 'pdf') {
            prescription_image_arr_obj.type = 'pdf';
          }
          else {
            prescription_image_arr_obj.type = 'image';
          }
          $scope.prescription_image_arr.push(prescription_image_arr_obj);
        }
        if ($scope.order_desc.pres_image5) {
          var prescription_image_arr_obj = { url: '', type: '' }
          prescription_image_arr_obj.url = $scope.order_desc.pres_image5;
          if ($scope.order_desc.pres_image5.split('.').pop() === 'pdf') {
            prescription_image_arr_obj.type = 'pdf';
          }
          else {
            prescription_image_arr_obj.type = 'image';
          }
          $scope.prescription_image_arr.push(prescription_image_arr_obj);
        }


        if ($scope.order_desc.is_dine_in) {
          $scope.dine_in_deliver_disable = moment().format('YYYY-MM-DD HH:mm:ss') < moment.utc($scope.order_desc.schedule_date).format('YYYY-MM-DD HH:mm:ss');
        }

        if ($scope.order_desc.payment_source == '543') {
          getMumybenePaymentStatus();
        }

        if (($rootScope.app_type == 8 || $rootScope.app_type > 10) && $scope.order_desc.questions) {
          $scope.questions = JSON.parse($scope.order_desc.questions);
        }

        if ($scope.order_desc.discountAmount) {
          $scope.discount = Math.round(($scope.order_desc.discountAmount * 100) / $scope.order_desc.total_order_price);
        }

        $scope.userId = (response.data)[0].user_id;
        $scope.data_loaded = true;
        $scope.totalDuration = 0;
        (response.data).forEach(product => {
          let base_prd = {
            image: product.image[0],
            name: product.product,
            product_id: product.product_id,
            price: parseFloat(product.Product_cost),
            variants: product.prod_variants,
            orderPriceId: product.orderPriceId,
            left_quantity: product.left_quantity,
            quantity: product.quantity,
            handling: product.item_handling,
            new: false,
            branch: product.branch_name,
            branchAddress: product.branch_address,
            duration: product.wduration,
            freeQuantity: product.freeQuantity || 0
          }

          if (product.freeQuantity) {
            $scope.freeProductQuantity += product.freeQuantity;
          }

          if (product.addsOn.length) {
            let addons_grp = _.groupBy(product.addsOn, 'serial_number');
            Object.keys(addons_grp).forEach(key => {
              let prd = {
                ...base_prd,
                addons: [],
                quantity: $scope.order_desc.is_edit ? product.quantity : addons_grp[key][0].quantity,
                // special_instructions: product.special_instructions || addons_grp[key][0].special_instructions
              };

              let special_instructions_array = (!!JSON.parse(product.specialInstructions) && typeof JSON.parse(product.specialInstructions) != 'string') ? JSON.parse(product.specialInstructions) : [];

              let customId = '';
              let addons_grp_name = _.groupBy(addons_grp[key], 'adds_on_name');
              Object.keys(addons_grp_name).forEach(key => {
                let addon = {
                  addon_name: key,
                  addon_types: ''
                }
                let types = [];
                addons_grp_name[key].forEach(add_on => {
                  prd.price += parseFloat(add_on.price);
                  types.push(add_on.adds_on_type_name);
                  customId += '' + add_on.adds_on_type_jd;
                });
                // console.log('customId', customId, special_instructions_array);

                let obj = special_instructions_array.find(o => (o.addOnIds == customId));
                // && o.productId == item.product_id
                if (!!obj) {
                  console.log('wwwwe', obj);

                  prd.special_instructions = obj.special_instruction;
                }
                addon.addon_types = types.join(', ');
                prd.addons.push(addon);
              });
              $scope.products.push(prd);
            });
          } else {
            let prd = {
              ...base_prd,
              addons: [],
              quantity: product.quantity,
              special_instructions: product.special_instructions
            };

            if ($rootScope.enable_services_order_edit == 1) {
              prd.pricing_type = product.pricing_type;
              
              prd.quantity = (!!product.addCartDuration ? (product.is_edit == 0 ? product.addCartDuration :
                (!!product.product_durations ? product.product_durations : product.duration)) :
                product.duration) / $rootScope.timeInterval;

              if(prd.pricing_type == 1) {
                prd.actual_price = JSON.parse(product.actual_price);
                
                console.log('prd.quantity', prd.quantity);
                prd.maxHour = (prd.actual_price[prd.actual_price.length - 1].max_hour) - $rootScope.timeInterval;
                prd.productDurations = product.productDurations;
                $scope.totalDuration += !!product.product_durations ? product.product_durations : product.duration;
              }
            }
            $scope.products.push(prd);
          }
        });

        // Order Calculation got change
        // if ($rootScope.enable_services_order_edit == 0) {
        //   priceCalculation();
        // }
      });
    };
    getOrderDesc();

    var afterStatusUpdate = function () {
      getOrderDesc();
      $scope.msg_description = `${$translate.instant('Order Status updated successfully')}`;
      services.SUCCESS_MODAL(true);
    }

    $scope.getSupplierOrderPrice = function (detail) {
      let price;
      if (!!detail) {
        price = detail.order_cost - detail.delivery_charges;
      }
      return price;
    }

    $scope.updateOrderStatus = function (val, orderId, self_pickup, orderType) {
      if (self_pickup == 1 && val == 3 || val == 4) {
        return;
      }

      let offset = moment().format('Z');
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.authSectionId = 36;
      param_data.orderId = orderId;
      param_data.status = val;
      param_data.offset = offset;

      switch (parseInt(val)) {
        case 3:
          services.POST_DATA(param_data, API.SHIPPED_UPDATE_ORDER(), function (response) {
            afterStatusUpdate();
          });
          break;
        case 10:
          services.POST_DATA(param_data, API.NEARBY_UPDATE_ORDER(), function (response) {
            afterStatusUpdate();
          });
          break;
        case 5:
          services.POST_DATA(param_data, API.DELIVERED_UPDATE_ORDER(), function (response) {
            afterStatusUpdate();
          });
          break;
        case 11:
          services.POST_DATA(param_data, API.IN_PROGRESS_UPDATE_ORDER(), function (response) {
            afterStatusUpdate();
          });
          break;

        case 8:
          let order = { id: orderId, type: orderType }
          $scope.ConfirmUpdate(2, order, 1);
          break;
      }
    };

    $scope.orderConfirmation = function (status, order, add_prep_time) {
      var param_data = {};

      if (!!$scope.order_cancel_type) {
        $scope.cancel_confirmed_order();
        return false;
      }
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.authSectionId = 36;
      param_data.orderId = order.id;
      param_data.status = status;
      param_data.offset = moment().format('Z');
      param_data.reason = "";

      if (status == 2) {
        param_data.reject_reasons = $scope.rejection_reason;
      }
      if (($rootScope.app_type == 1 || order.type == 1) && status == 1) {
        param_data.preparation_time = add_prep_time == 1 ? moment($scope.prep_time, 'HH:mm').format('HH:mm:ss') : order.preparation_time;
      }
      if ($rootScope.enable_supplier_express_schedule_delivery_provide == 1 &&
        order.delivery_date_time && (!order.express_delivery_charges || order.express_delivery_charges == 0)) {
        param_data.delivery_date_time = order.delivery_date_time;
      }
      services.POST_DATA(param_data, API.CONFIRM_REJECT_ORDER(), function (response) {
        $("#prep_time").modal('hide');
        getOrderDesc();
        $scope.msg_description = `${$translate.instant('Order')} ${status == 1 ? $translate.instant('Confirmed') : $translate.instant('Rejected')}`;
        services.SUCCESS_MODAL(true);
      });
    }

    $scope.ConfirmUpdate = function (status, order, type) {
      if (status == 1 && ($rootScope.app_type == 1 || order.type == 1)) {
        $scope.prep_time = order.preparation_time;
        $scope.selected_order = order;
        if ($rootScope.enable_by_pass_order_confirmation == 1) {
          $scope.orderConfirmation(status, order, 0);
        } else {
          if (!order.category || (!!order.category[0].disable_preparation_time || order.category[0].disable_preparation_time == 0)) {
            $("#prep_time").modal('show');
          }
        }
        return;
      } if (status == 2) {
        $("#order_rejection").modal('show');
        $scope.selected_order = order;
        $scope.order_cancel_type = !!type ? 1 : 0;
      } else {
        $scope.orderConfirmation(status, order, 0);
      }
    };


    $scope.cancel_confirmed_order = function () {
      var param_data = {
        accessToken: constants.ACCESSTOKEN,
        orderId: $scope.selected_order.id,
        reason: $scope.rejection_reason,
        languageId: localStorage.getItem('lang')
      };

      services.POST_DATA(param_data, API.CANCEL_ORDER_AFTER_CONFIRMATION(), function (response) {
        $("#prep_time").modal('hide');
        getOrderDesc();
        $scope.msg_description = `${$translate.instant('Order Cancelled')}`;
        services.SUCCESS_MODAL(true);

      });
    };

    $scope.viewPaymentreceipt = function (order) {
      $scope.zelle_order = order;
      $("#zelle_confirmation").modal('show');
    }

    $scope.viewPrescription = function (image) {
      if (image.type == 'image') {
        $scope.prescription_image = image.url;
        $("#order_prescription").modal('show');
      }
      else {
        window.open(image.url);
      }
    }

    /****************************** Edit Order *****************************/

    var getSupplierInfo = function () {
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.sectionId = 30;
      param_data.supplierId = $scope.supplier_id;

      services.POST_DATA(param_data, API.GET_SUPPLIER_INFO_TAB_DATA(), function (response) {
        if (!!response) {
          $scope.supplierData = response.data[0];
        }
      });
    }

    var geoFencedTax = function () {
      $scope.geofence_tax_data = [];
      let param_data = {
        lat: $scope.order_desc.latitude,
        long: $scope.order_desc.longitude,
        branchId: $scope.branch_id
      }
      services.GET_DATA(param_data, API.GET_GEOFENCE_TAX, function (response) {
        if (!!response && response.data) {
          $scope.geofence_tax_data = response.data.taxData;
        }
      });
    }

    $scope.editProducts = function () {
      $scope.edit_product = 1;
      if (factories.getSettings().key_value.is_tax_geofence == 1) {
        geoFencedTax();
      }
      getSupplierInfo();
    }

    $scope.updateProducts = function () {
      let products = [];
      $scope.products.forEach(product => {
        if (product) {
          products.push({
            price: product.price,
            quantity: $rootScope.enable_services_order_edit == 0 ? product.quantity : 1,
            productName: product.name,
            productId: product.product_id,
            reason: product.reason || '',
            productDesc: '',
            imagePath: product.image,
            branchId: $scope.branch_id,
            orderPriceId: product.orderPriceId ? product.orderPriceId : 0,
            productDurations: product.productDurations ? product.productDurations : 0
          });
        }
      });

      removedItems = [];
      $scope.deletedProducts.forEach(el => {
        if (el.orderPriceId) {
          removedItems.push(el.orderPriceId);
        }
      });

      if (!products.length) {
        $scope.edit_product = 0;
        return;
      }

      let param_data = {
        sectionId: 36,
        orderId: $scope.orderId,
        items: products,
        removalItems: removedItems,
        handlingAdmin: $scope.order_desc.handling_admin,
        // description: $scope.description || '', // missing on staging server
        userServiceCharge: $scope.order_desc.user_service_charge
      };

      if ($rootScope.enable_services_order_edit == 1) {
        param_data['duration'] = $scope.totalDuration;
        param_data['cartId'] = $scope.order_desc.cart_id;
      }

      services.POST_DATA(param_data, API.ADD_PRODUCT_IN_ORDER(), function (response) {
        $scope.edit_product = 0;
        getOrderDesc();
        $scope.msg_description = `${$translate.instant('Order updated')}`;
        services.SUCCESS_MODAL(true);
      });
    }

    $scope.addProducts = function () {
      console.log($scope.selected_products)
      $scope.selected_products.forEach(product => {
        if (product.left_quantity) {
          // $scope.order_desc.order_cost += parseFloat(product.price);
          let similar_product = $scope.products.find(el => el.product_id == product.id);
          if (!!similar_product) {
            similar_product.quantity++;
          } else {

            let prd = {
              image: product.images[0].image_path,
              name: product.name,
              product_id: product.id,
              price: product.price ? product.price : 0,
              variants: product.prod_variants,
              addons: [],
              quantity: 1,
              left_quantity: product.left_quantity,
              handling: product.handling,
              new: true,
              maxHour: product.maxHour ? product.maxHour : 0,
              productDurations: 0
            }
            if ($rootScope.enable_services_order_edit) {
              prd.actual_price = (product.actual_price);
              prd.pricing_type = product.pricing_type;
              prd.maxHour = (prd.actual_price[prd.actual_price.length - 1].max_hour) - $rootScope.timeInterval;
              prd.productDurations = product.quantity * $rootScope.timeInterval;
            }
            $scope.products.push(prd);

          }
        }
      });
      console.log($scope.products)
      priceCalculation();
    }

    $scope.removeProduct = function (index) {
      services.CONFIRM(`${$translate.instant('you want to remove this item')}`,
        function (isConfirm) {
          if (isConfirm) {
            $scope.$apply(function () {
              if ($scope.products[index].new) {
                $scope.products.splice(index, 1);
              } else {
                let removed_item = $scope.products.splice(index, 1);
                console.log([removed_item[0]])
                $scope.deletedProducts.push(removed_item[0]);
              }
              priceCalculation();
            });
          }
        });
    }

    $scope.increaseQuantity = function (product) {

      if ((![$scope.order_desc.type, $rootScope.app_type].includes(8) && product.quantity < product.left_quantity) ||
        ([$scope.order_desc.type, $rootScope.app_type].includes(8) && ((product['quantity']) * $rootScope.timeInterval <= product.maxHour))) {
        // if (product.quantity < product.left_quantity) {
        // $scope.order_desc.order_cost += product.price;
        product.quantity++;
        priceCalculation();
      }
    }

    $scope.decreaseQuantity = function (product) {
      if (product.quantity > 1) {
        // $scope.order_desc.order_cost -= product.price;
        product.quantity--;
        priceCalculation();
      }
    }

    var getHomeData = function () {
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.sectionId = 30;
      param_data.supplierId = $scope.supplier_id;

      services.POST_DATA(param_data, API.LIST_SUPPLIER_CATEGORIES(), function (response) {
        let categoryData = response.data;
        $scope.sub_categories = {};
        $scope.det_sub_categories = {};
        categoryData.map((cat) => {
          cat['id'] = cat.category_id;
        });
        $scope.categories = categoryData;
        $scope.selected_cat = categoryData[0];
        $scope.category_selected = categoryData[0].category_id;
        $scope.onSelectCategory(categoryData[0], false);
      });
    };

    $scope.openProductModal = function () {
      $scope.selected_products = [];
      $("#add_products").modal('show');
      getHomeData();
    }

    $scope.dynamicSubCategories = [];
    $scope.onSelectCategory = function (category, change) {
      $scope.selected_products = [];
      $scope.product_list = [];
      $scope.category_selected = category.id;
      $scope.selected_sub_cat = '';
      $scope.selected_det_sub_cat = {};
      $scope.catIdArr = [];
      if (category.id) {
        $scope.changeSubCatId(category, 0, change);
      }
    };

    $scope.selectedCategory = [];
    $scope.changeSubCatId = function (subCatData, catIndex, change) {
      $scope.selected_products = [];
      $scope.selected_det_sub_cat = subCatData;
      if (!!subCatData && !!subCatData.id) {
        if (change) {
          $scope.selectedCategory.splice(catIndex, $scope.selectedCategory.length - catIndex);
        }
        let param_data = {};
        param_data.subCatId = subCatData.id;
        param_data.sectionId = 30;
        param_data.supplierId = $scope.supplier_id;
        if (catIndex == 0) {
          param_data.level = 1;
        }

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

    $scope.selectProduct = function (product) {
      let index = $scope.selected_products.findIndex(p => p.id == product.id);
      if (index > -1) {
        $scope.selected_products.splice(index, 1);
      } else {
        $scope.selected_products.push(product);
      }
    }

    var mapPoducts = function (data, page) {
      $scope.dataLoaded = true;
      $scope.product_list = [];
      $scope.count = data['product_count'];
      if (data['products'].length) {
        data['products'].forEach(product => {
          if (product.price && product.price.length) {
            product['name_en'] = product.names[0].name;
            product['desc_en'] = product.names[0].product_desc;
            let regular_price = (product.price).find(el => el.price_type == 0);

            if (product['pricing_type'] == 0) {
              let discount_price = (product.price).find(el => el.price_type == 1);
              if (!!discount_price) {
                product['price'] = discount_price ? (parseFloat(discount_price.price)) : null;
                product['handling'] = discount_price ? (parseFloat(discount_price.handling)) : 0;
              } else {
                product['price'] = regular_price ? (parseFloat(regular_price.price)) : null;
                product['handling'] = regular_price ? (parseFloat(regular_price.handling)) : 0;
              }
            } else {
              let discount_price = (product.price).find(el => el.price_type == 1);
              product['hourly_price'] = JSON.parse(regular_price.price);

              product.actual_price = product['hourly_price'];
              product.pricing_type = 1; // product.pricing_type;

              product['maxHour'] = product['hourly_price'][product['hourly_price'].length - 1]['max_hour'] - $rootScope.timeInterval;
              // if (product['discount'] && product['hourly_price'][0]['discount_price']) {
              //   product['fixed_price'] = product['hourly_price'][0]['discount_price'];
              //   product['display_price'] = product['hourly_price'][0]['price_per_hour'];
              //   product["discountPercentage"] = parseFloat((((product.display_price - product.fixed_price) / product.display_price) * 100).toFixed(2));
              // } else {

              product['price'] = parseFloat(product['hourly_price'][0]['price_per_hour'] + '');
              product['handling'] = regular_price ? (parseFloat(regular_price.handling)) : 0;
              // }
            }
            // if(product.left_quantity) {
            $scope.product_list.push(product);
            // }
          }
        });
      }
      $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
    }

    var productList = function (page) {

      let param_data = {};
      param_data.subCategoryId = undefined;
      param_data.detailedSubCategoryId = undefined;

      param_data.section_id = 30;
      param_data.supplierId = $scope.supplier_id;
      param_data.categoryId = $scope.category_selected;
      if ($scope.catIdArr.length > 0) {
        param_data.subCategoryId = $scope.catIdArr[$scope.catIdArr.length - 1];
      }
      param_data.limit = $scope.limit;
      param_data.offset = $scope.skip;
      param_data.serachText = $scope.search;
      param_data.serachType = $scope.search ? 1 : 0;
      param_data.branchId = $scope.branch_id;

      param_data.detailedSubCategoryId = $scope.selected_det_sub_cat.id;
      if (param_data.subCategoryId == undefined) {
        param_data.subCategoryId = param_data.detailedSubCategoryId;
      }

      if (param_data.subCategoryId == undefined && param_data.detailedSubCategoryId == undefined) {
        param_data.detailedSubCategoryId = param_data.categoryId;
        param_data.subCategoryId = param_data.categoryId;
      }

      $scope.dataLoaded = false;
      services.listSupBranchProducts($scope, param_data, function (data) {
        mapPoducts(data, page);
      });

      // if ($stateParams.b_id) {
      //   if($stateParams.multi_b == 1) {
      //     services.listSupplierProducts($scope, param_data, function (data) {
      //       mapPoducts(data, page);
      //     });
      //   } else {
      //     services.listProducts($scope, param_data, function (data) {
      //       mapPoducts(data, page);
      //     });
      //   }
      // } else {
      //   services.listProducts($scope, param_data, function (data) {
      //     mapPoducts(data, page);
      //   });
      // }
    };

    $scope.scheduleDelivery = function () {
      $("#schedule_delivery_time").modal('show');
      let min_date = moment().add($scope.order_desc.delivery_min_time, 'm').toDate();
      setTimeout(() => {
        document.getElementById("schedule_data").value = '';
        $scope.discount_end_date_picker = new Lightpick({
          field: document.getElementById('schedule_data'),
          minDate: min_date,
          format: 'DD-MM-YYYY',
          repick: true,
          onSelect: function (date) {
            if (date) {
              $scope.schedule_delivery_time.date = date.format('YYYY-MM-DD');
            }
          }
        });
      }, 200);
    }

    $scope.setDeliveryTime = function () {
      if (!$scope.schedule_delivery_time.date) {
        factories.warningDataPop($translate.instant('Please select date'));
        return;
      } else if (!$scope.schedule_delivery_time.time) {
        factories.warningDataPop($translate.instant('Please select time'));
        return;
      }
      let param_data = {
        orderId: $scope.orderId,
        deliveryDateTime: $scope.schedule_delivery_time.date + ' ' + $scope.schedule_delivery_time.time,
        offset: moment().format('Z')
      }
      services.PUT_DATA(param_data, API.SCHEDULE_DELIVERY(), function (response) {
        $("#schedule_delivery_time").modal('hide');
        getOrderDesc();
        $scope.msg_description = `${$translate.instant('Order Delivery Time Updated')}`;
        services.SUCCESS_MODAL(true);
      });
    }


    $scope.searchProduct = function (keyEvent) {
      if (keyEvent.which === 13) {
        $scope.search = keyEvent.target.value;
        $scope.currentPage = 1;
        $scope.skip = 0;
        productList(1);
      }
    }

    $scope.setPage = function (page) {
      $scope.currentPage = page;
      $scope.skip = $scope.limit * (page - 1);
      productList(page);
    }


    calculateProductHourlyPrice = function (product) {
      console.log('product 1234', product);
      if (product['pricing_type']) {
        // if (product['is_product']) {
        //   this.timeInterval = 60;
        // }
        product['hourly_price'].forEach(element => {
          if (product['quantity'] * $rootScope.timeInterval >= element['min_hour'] &&
            product['quantity'] * $rootScope.timeInterval < element['max_hour']) {
            if (product['discount'] == 1 && element['discount_price']) {
              product['fixed_price'] = parseFloat(element['discount_price']);
              product['display_price'] = parseFloat(element['price_per_hour']);
            } else {
              product['fixed_price'] = parseFloat(element['price_per_hour']);
            }
          }
        });
        product['price'] = parseFloat(product['fixed_price']);
        product['productDurations'] = product['quantity'] * $rootScope.timeInterval;

        $scope.totalDuration += product['quantity'] * $rootScope.timeInterval;
      }
    }

    var priceCalculation = function () {
      $scope.order_desc.total_order_price = 0;
      $scope.order_desc.user_service_charge = 0;
      $scope.order_desc.order_cost = 0;
      $scope.order_desc.handling_admin = 0;
      $scope.totalDuration = 0;

      let geo_handling = 0;
      if (factories.getSettings().key_value.is_tax_geofence == 1 && $scope.geofence_tax_data.length) {
        geo_handling = $scope.geofence_tax_data[0].tax;
      }

      $scope.products.forEach(product => {
        if (product.pricing_type && $rootScope.enable_services_order_edit == 1) {
          product['hourly_price'] = (product.actual_price);

          if (product['actual_price'].length) {
            calculateProductHourlyPrice(product);
          }
          $scope.order_desc.total_order_price += parseFloat(product.price);
          if ($scope.geofence_tax_data.length) {
            $scope.order_desc.handling_admin += ((parseFloat(product.price)) * geo_handling) / 100;
          } else {
            $scope.order_desc.handling_admin += ((parseFloat(product.price)) * parseFloat(product.handling)) / 100;
          }
        } else {
          $scope.order_desc.total_order_price += parseFloat(product.price) * product.quantity;
          if ($scope.geofence_tax_data.length) {
            $scope.order_desc.handling_admin += ((parseFloat(product.price) * product.quantity) * geo_handling) / 100;
          } else {
            $scope.order_desc.handling_admin += ((parseFloat(product.price) * product.quantity) * parseFloat(product.handling)) / 100;
          }
        }

      });

      if ($scope.discount) {
        $scope.order_desc.discountAmount = ($scope.discount * $scope.order_desc.total_order_price) / 100;
      }

      let service_charge = $scope.supplierData.user_service_charge;
      if (service_charge) {
        $scope.order_desc.user_service_charge = (service_charge * $scope.order_desc.total_order_price) / 100;
      }

      $scope.order_desc.order_cost = ($scope.order_desc.total_order_price - $scope.order_desc.discountAmount) + $scope.order_desc.user_service_charge + $scope.order_desc.handling_admin + $scope.order_desc.tip_agent + $scope.order_desc.delivery_charges;
    }

    $scope.selected_agent = [];


    $scope.openDriverAssign = function (order) {
      $scope.selected_order_for_assign = order;
      if ($rootScope.is_vehicle_category_enable == '1') {
        getVehicleCatList();
      }
      else {
        $scope.listAgents($scope.selected_order_for_assign);
      }
    }

    var getVehicleCatList = function () {
      var data = {};
      $scope.dataLoaded = false;
      services.GET_DATA(data, API.LIST_VEHICLE_CATEGORY, function (response) {
        $scope.vehicleCatList = response.data;
        $scope.dataLoaded = true;
      });
    };
    $scope.onSelectAgentVehicle = function (vehicle) {
      if (!vehicle || vehicle == "") {
        return;
      }
      $scope.selected_agent_vehicle_cat = vehicle;
      $scope.listAgents($scope.selected_order_for_assign);
    }

    $scope.listAgents = function () {
      $scope.selected_agent = [];
      var param_data = {};
      param_data.sectionId = 36;
      param_data.supplierId = $scope.supplier_id ? $scope.supplier_id : 0;
      param_data.agent_category_id = $scope.selected_agent_vehicle_cat ? $scope.selected_agent_vehicle_cat : '';

      services.GET_DATA(param_data, API.AGENT_ACC_TO_AREA(), function (response) {
        $scope.agents = response.data;
        $scope.agents.forEach(el => {
          el['total_active_orders'] = ` | ${el.active_orders} ${$rootScope.localisation.dashboard_active_orders}`;
        });
        if ($scope.order_desc.agent.length) {
          let agent = $scope.agents.find(el => el.id == $scope.order_desc.agent[0].id);
          if (!!agent) {
            agent.ticked = true;
            $scope.selected_agent.push(agent);
          }
        }
      });
    }

    $scope.assignAgent = function () {
      var data = {};
      data.agentIds = [parseInt($scope.selected_agent[0].id)];
      data.orderId = $scope.orderId;
      data.sectionId = 36;
      services.POST_DATA(data, API.ASSIGN_AGENT(), function (response) {
        getOrderDesc();
        $("#assign_agent_to_order").modal('hide');
        $scope.msg_description = `${(factories.localisation()).agent} ${$translate.instant('assigned successfully')}`;
        services.SUCCESS_MODAL(true);
      });
    }

    $scope.dhlAssignment = function () {
      $scope.is_dhl_assignment = true;
      $scope.products.forEach(el => {
        el['weight'] = '';
        el['width'] = '';
        el['height'] = '';
        el['depth'] = '';
      });
    }





    $scope.submitDHL = function () {

      let items = [];
      $scope.products.forEach(el => {
        items.push({
          price: el.price,
          quantity: el.quantity,
          productName: el.name,
          productId: el.product_id,
          branchId: $scope.branch_id,
          productDesc: el.productDesc || '',
          imagePath: el.image,
          orderPriceId: el.orderPriceId || 0,
          weight: el.weight,
          width: el.width,
          height: el.height,
          depth: el.depth
        });
      });

      let data = {
        sectionId: 36,
        orderId: $scope.orderId,
        handlingAdmin: $scope.order_desc.handling_admin,
        userServiceCharge: $scope.order_desc.user_service_charge,
        offset: moment().format('Z'),
        items: items
      }

      services.POST_DATA(data, API.DHL_SHIPMENT(), function (response) {
        $scope.msg_description = `${(factories.localisation()).order} ${$translate.instant('assigned successfully')}`;
        services.SUCCESS_MODAL(true);
        $scope.is_dhl_assignment = false;
        getOrderDesc();
      });
    }

    $scope.dhlData = '';
    $scope.trackDHLShipment = function () {
      var data = {};
      data.orderId = $scope.orderId;
      data.sectionId = 36;
      services.POST_DATA(data, API.TRACK_DHL_SHIPMENT(), function (response) {
        $scope.dhlData = response.data;
        $("#dhl_shipment").modal('show');
      });
    }

    $scope.shipRocketData = '';
    $scope.trackShipRocket = function () {
      var data = {};
      data.orderId = $scope.orderId;
      services.POST_DATA(data, API.TRACK_TO_SHIPROCKET, function (response) {
        $scope.shipRocketData = response.data;
        window.open($scope.shipRocketData.tracking_data.track_url);
      });
    }

    $scope.EditOrderPrice = function (order) {
      $("#edit_order_price").modal('show');
      $scope.edit_order_price.admin_updated_charge = order.total_order_price;
      $scope.edit_order_price.handlingAdmin = order.handling_admin;
    }

    $scope.file_to_upload_for_edit_order_receipt = function (File) {
      var file = File[0];
      if (constants.IMAGE_TYPE.includes(file.type)) {
        if ((file.size / Math.pow(1024, 2)) <= 1) {
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function (e) {
            $scope.$apply(function () {
              $scope.uploadImage(File[0], function (err, imageUrl) {
                $scope.edit_order_price.admin_price_update_receipt = imageUrl;
              })
            });
          }
        } else {
          factories.invalidDataPop($translate.instant("Image size must be less than 1mb"));
        }
      } else {
        factories.invalidDataPop($translate.instant("Invalid File Type"));
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
    $scope.onEditNewPrice = function (edit_order_priceForm) {
      if (edit_order_priceForm.$submitted && edit_order_priceForm.$invalid) {
        return;
      }
      services.CONFIRM($translate.instant('Are you sure you want to update the order price? You can not undo this step.'),
        function (isConfirm) {
          if (isConfirm) {
            updatePriceAfterConfirm(edit_order_priceForm);
          }
        });
    }
    var updatePriceAfterConfirm = function (edit_order_priceForm) {
      $scope.edit_order_price.order_id = $stateParams.order_id;
      if ($scope.edit_order_price.admin_updated_charge < $scope.order_desc.total_order_price) {
        $scope.edit_order_price.is_subtotal_add = 0;
        $scope.edit_order_price.admin_updated_charge = $scope.order_desc.total_order_price - $scope.edit_order_price.admin_updated_charge;
      }
      else {
        $scope.edit_order_price.is_subtotal_add = 1;
        $scope.edit_order_price.admin_updated_charge = $scope.edit_order_price.admin_updated_charge - $scope.order_desc.total_order_price;

      }
      if ($scope.edit_order_price.admin_updated_charge < $scope.order_desc.handling_admin) {
        $scope.edit_order_price.is_tax_add = 0;
      }
      else {
        $scope.edit_order_price.is_tax_add = 1;
      }

      if (!$scope.edit_order_price.admin_price_update_receipt) {
        $scope.edit_order_price.admin_price_update_receipt = '';
      }

      services.POST_FORM_DATA($scope.edit_order_price, API.EDIT_ORDER_PRICE, (response) => {
        $("#edit_order_price").modal('hide');
        getOrderDesc();
        $scope.msg_description = `${$translate.instant('Order Price Updated Successfuly')}`;
        services.SUCCESS_MODAL(true);
      })
    }

    $scope.openShipRocket = function () {
      $("#ship_rocket_modal").modal('show');
    }


    $scope.submitShipRocket = function (ship_rocket_form) {
      if (ship_rocket_form.$submitted && ship_rocket_form.$invalid) {
        return;
      }
      let items = [];
      $scope.products.forEach(el => {
        items.push({
          price: el.price,
          quantity: el.quantity,
          productName: el.name,
          productId: el.product_id,
          branchId: $scope.branch_id,
          productDesc: el.productDesc || '',
          imagePath: el.image,
          orderPriceId: el.orderPriceId || 0,
          weight: el.weight,
          width: el.width,
          height: el.height,
          depth: el.depth
        });
      });

      let data = $scope.ship_rocket_obj;
      data.sectionId = 36;
      data.orderId = $scope.orderId;
      data.handlingAdmin = $scope.order_desc.handling_admin;
      data.userServiceCharge = $scope.order_desc.user_service_charge;
      data.offset = moment().format('Z');
      data.items = items;


      services.POST_DATA(data, API.ASSIGN_TO_SHIPROCKET, function (response) {
        $scope.msg_description = `${(factories.localisation()).order} ${$translate.instant('assigned successfully')}`;
        services.SUCCESS_MODAL(true);
        $("#ship_rocket_modal").modal('hide');
        getOrderDesc();
      });
    }


    $scope.printOrderDetails = function (divName) {
      var content = document.getElementById(divName).innerHTML;
      var printContents = content.replace(/<img[^>]*>/g, "");
      var printContents = printContents.replace(/<button[^>]*>/g, "");

      var popupWin = window.open('', '_blank', 'width=800,height=800');
      popupWin.document.open();
      popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="../../../css/v1_css/style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
      popupWin.document.close();
    }

    $scope.listenAgentBio = function (biourl) {
      window.open(biourl);
    }


    $scope.tables = [];
    $scope.selected_table = '';
    $scope.selected_table_booking = '';

    $scope.tableSelection = function (booking) {
      $scope.selected_table = '';
      $scope.tables = [];
      $scope.selected_table_booking = booking;
      let param_data = {
        limit: 200,
        offset: 0,
        supplier_id: booking.supplier_id,
        branch_id: booking.supplier_branch_id
      }
      services.GET_DATA(param_data, API.LIST_SUPPLIER_TABLE(), function (response) {
        if (response) {
          $scope.tables = response.data.list;
          $("#updateTable").modal('show');
        }
      });
    }

    $scope.selectTable = function (table) {
      $scope.selected_table = table;
    }

    $scope.updateTable = function () {
      let params = {
        id: $scope.selected_table_booking.id,
        table_id: $scope.selected_table
      }

      console.log($rootScope.table_book_mac_theme, $scope.selected_table_booking.is_dine_in);
      if ($rootScope.table_book_mac_theme && $scope.selected_table_booking.is_dine_in) {
        params['order_id'] = $scope.selected_table_booking.id
      }

      services.POST_DATA(params, API.UPDATE_BOOKING_TABLE(), function (response) {
        $scope.message = `${$translate.instant('Booking table updated')}`;
        services.SUCCESS_MODAL(true);
        getOrderDesc();
        $("#updateTable").modal('hide');
      });
    }


    $scope.getDeliverySlot = function (delivery_date_time) {
      if (delivery_date_time) {
        if (delivery_date_time.includes('16:00')) {
          return '04:00 PM - 08:00 PM'
        }
        else {
          return '12:00 PM - 04:00 PM'
        }
      }
    }

    $scope.getOrderRevenue = function (order) {
      var orderRevenue = 0;
      if (order) {
        var commission = order.self_pickup == 1 ? order.pickup_commission : order.admin_commission;
        var totalOrderPricePerc = (order.total_order_price * commission) / 100;
        var gstOnStaticTax = 0;
        if ($rootScope.enable_fees_estimated_tax_contant == 1) {
          gstOnStaticTax = (totalOrderPricePerc * (Number)($rootScope.custom_tax_static_value)) / 100;
        }
        else {
          gstOnStaticTax = order.handling_admin;
        }
        orderRevenue = order.total_order_price - (totalOrderPricePerc + gstOnStaticTax);
        orderRevenue = (Number)(orderRevenue.toFixed(2));
      }
      return orderRevenue;
    }

    $scope.getPaytoRestaurant = function (order) {
      var amount = 0;
      if (order && $rootScope.client_code == "kareemfood_0082") {
        var restpay = (order.total_order_price * order.admin_commission) / 100;
        amount = (Number)((order.total_order_price - restpay) - ((order.bear_by == 1) ? order.discountAmount: 0));
        amount = (Number)(amount.toFixed(2));
      }
      if (order && $rootScope.client_code != "kareemfood_0082") {
        var restpay = (order.total_order_price * order.admin_commission) / 100;
        amount = (Number)((order.total_order_price - restpay).toFixed(2)) - ((order.bear_by == 1) ? order.discountAmount : 0);
      }
      return amount;
    }

    $scope.getPaytoCompnay = function (order) {
      var amount = 0;
      if (order && $rootScope.client_code == "kareemfood_0082") {
        amount = (((order.total_order_price * order.admin_commission) / 100)- ((order.bear_by == 0) ? order.discountAmount: 0));
        amount = (Number)(amount.toFixed(2));
      }
      if (order && $rootScope.client_code != "kareemfood_0082") {
        amount = ((order.total_order_price * order.admin_commission) / 100) - (order.loyality_point_discount + ((order.bear_by == 0) ? order.discountAmount : 0));
        amount = (Number)(amount.toFixed(2));
      }
      return amount;
    }
    



    // Add EXTRA PRODUCT TO ORDER

    $scope.openExtraProductList = function () {
      $("#add_extra_product").modal('show');

      $scope.selected_extra_products = {};
      $scope.extra_products = [];
      $scope.extra_product_arr = [];
      $scope.extras_price = 0;
      $scope.getExtraProductList();
    }

    $scope.getExtraProductList = function () {
      let param_data = {};
      param_data.offset = 0;
      param_data.limit = 800;
      if ($rootScope.profile == 'SUPPLIER') {
        param_data.id = $scope.supplier_id;
      }

      services.GET_DATA(param_data, API.GET_EXTRA_PRODUCT(), function (response) {
        if (!!response && response.data) {
          $scope.extra_products = response.data.result.data;
          $scope.extra_products.forEach(prod => {
            prod.selectedQuantity = 0;
            prod.left_quantity = prod.quantity - prod.purchase_qty;
          })
        }
      });
    }

    $scope.setSerailNo = function (id, childIndex, serial_id) {
      $scope.selected_extra_products[id].selectedSerial[childIndex] = parseInt(angular.copy(serial_id));
      // $scope.selected_extra_products[id].serial_no_arr[childIndex].id = serial_id;
    }

    $scope.checkAvailability = function (product_id, id, childIndex, index) {
      let check = $scope.selected_extra_products[product_id].serial_no_arr[index].id != id &&
        $scope.selected_extra_products[product_id].selectedSerial.includes(id);
      return check;
    }
    $scope.increaseExtraProdQuantity = function (product) {
      if (product.selectedQuantity == 0) {
        $scope.selected_extra_products[product.id] = {
          quantity: 1, price: product.price, serial_no_arr: [{
            id: '',
            quantity: 1
          }], selectedSerial: []
        };
        ++product.selectedQuantity;
      } else if (product.left_quantity > product.selectedQuantity) {
        $scope.selected_extra_products[product.id].quantity++;
        $scope.selected_extra_products[product.id].serial_no_arr.push({
          id: '',
          quantity: 1
        });
        ++product.selectedQuantity;
      }
      $scope.extras_price_calculation();
    }

    $scope.decreaseExtraProdQuantity = function (product) {
      if (product.selectedQuantity > 1) {
        $scope.selected_extra_products[product.id].quantity--;
        $scope.selected_extra_products[product.id].serial_no_arr.pop();
      } else {
        $scope.selected_extra_products = _.omit($scope.selected_extra_products, product.id);

      }
      product.selectedQuantity--;
      $scope.extras_price_calculation();
    }

    $scope.requestOrderUpdateWithExtraProd = function () {
      $scope.extra_product_arr = [],
        $scope.serial_no_arr = []
      let i = 0;
      for (obj in $scope.selected_extra_products) {
        $scope.extra_product_arr.push({
          id: parseInt(obj),
          quantity: $scope.selected_extra_products[obj].quantity,
          serial_no: []
        })

        let selected_serial = {};
        for (ob1 in $scope.selected_extra_products[obj].serial_no_arr) {
          let ob = $scope.selected_extra_products[obj].serial_no_arr[ob1];
          if (!!selected_serial[ob.id]) {
            selected_serial[ob.id] += ob.quantity;
          } else {
            selected_serial[ob.id] = ob.quantity;

          }

        }
        for (val in selected_serial) {
          $scope.extra_product_arr[i].serial_no.push({
            id: val,
            quantity: selected_serial[val]
          })
        }
        i++;
      }

      if ($scope.extra_product_arr.length) {
        $scope.submitRequest();
      }
    }

    $scope.extras_price_calculation = function () {
      $scope.extras_price = 0;
      for (obj in $scope.selected_extra_products) {
        let x = $scope.selected_extra_products[obj];
        $scope.extras_price += x.quantity * x.price;
      }
    }

    $scope.submitRequest = function () {

      var param_data = {};
      param_data.orderId = parseInt($scope.orderId);
      param_data.extra_product = $scope.extra_product_arr;
      param_data.order_updated_by = ($rootScope.profile == 'ADMIN') ? 0 : 1;

      services.POST_DATA(param_data, API.UPDATE_ORDER_EXTRA_PRODUCT(), function (response) {
        $scope.msg_description = `${factories.localisation().extra_product} ${$translate.instant('Updation Request Created')}`;
        services.SUCCESS_MODAL(true);
        $("#add_extra_product").modal('hide');
      });
    }


    $scope.setReasonType = function (type) {
      $scope.reason_type = type;

      let label = '';
      if (type == 0) label = 'Rejection';
      if (type == 1) label = 'Cancellation';
      if (type == 2) label = 'Added';

      $scope.reason_label = `${factories.localisation().order} ${label} Reason`;
    }


  }]);
