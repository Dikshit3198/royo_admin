Royo.controller('ClientProfileCtrl', ['$scope', '$rootScope', 'services', 'API', 'pagerService', 'constants', 'factories', '$window', '$state', '$translate',
  function ($scope, $rootScope, services, API, pagerService, constants, factories, $window, $state, $translate) {

    $scope.bigCurrentPage = 1;
    $scope.change_pagination_amount = 10;
    $scope.is_toUpdate = 1;

    $rootScope.active_profile_tab = 1;
    $scope.skip = 0;
    $scope.limit = 20;
    $scope.search = '';
    $scope.count = 0;
    $scope.users = [];
    $scope.dataLoaded = false;
    $scope.user = {
      otp_verified: '',
      phone_number: '',
      country_code: '',
      user_id: '',
      iso: '',
      user_type_id: '',
      // email: ''
    };
    $scope.invalid_phone_no = false;
    $scope.message = '';
    $scope.new_user_pass = {
      user_id: '',
      password: '',
      confirm_password: ''
    }
    $scope.user_type = '';
    $scope.planList = [];
    $scope.selected_plan = '';
    $scope.subscription_start_date = '';
    $scope.subscription_end_date = '';
    $scope.isStripeConnected = 0;
    $scope.notification_open = false;
    $scope.notification = { msg: '' };
    $scope.checkall = false;
    $scope.selected_users = [];
    $scope.selected_emails = [];
    $scope.message = '';
    $scope.message_type = 1;
    $scope.email = {
      body: '',
      subject: ''
    };
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
    };
    $scope.filterByStripe = function (value) {
      if ($scope.isStripeConnected !== value) {
        $scope.isStripeConnected = value;
        $scope.skip = 0;
      }
      getUserData(1);
    }
    var getUserData = function (page) {
      var data = {};
      data.accessToken = constants.ACCESSTOKEN;
      data.sectionId = 21;
      data.offset = $scope.skip;
      data.limit = $scope.limit;
      if (($scope.search).trim()) {
        data.search = $scope.search;
        data.searchType = 1;
      } else {
        data.searchType = 0;
        data.search = "";
      }
      if ($scope.isStripeConnected !== 0) {
        data.is_stripe_connected = $scope.isStripeConnected
      }
      if (!!localStorage.getItem('data_country')) {
        let country_data = localStorage.getItem('data_country').split(',');
        data.country_code = country_data[0];
        data.country_code_type = country_data[1];
      }

      if ($scope.selected_plan && $scope.selected_plan.id) data.subscription_id = $scope.selected_plan.id;
      if ($scope.subscription_start_date) data.subscription_start_date = $scope.subscription_start_date;
      if ($scope.subscription_end_date) data.subscription_end_date = $scope.subscription_end_date;

      $scope.dataLoaded = false;
      services.POST_DATA(data, API.GET_USERS, function (response) {
        $scope.count = response.data.count;
        $scope.users = response.data.users;
        $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
        $scope.dataLoaded = true;
      });
    };
    getUserData(1);


    var datepicker_filter = function () {
      setTimeout(() => {
        var picker2 = new Lightpick({
          field: document.getElementById("datepicker_subscription"),
          singleDate: false,
          format: 'DD.MM.YYYY',
          repick: true,
          onSelect: (start, end) => {
            $scope.subscription_start_date = '';
            $scope.subscription_end_date = '';
            if (start && end) {
              $scope.subscription_start_date = start.format('YYYY-MM-DD');
              $scope.subscription_end_date = end.format('YYYY-MM-DD');
              $scope.skip = 0;
              $scope.currentPage = 1;
              getUserData(1);
            }
          }
        });
      }, 500);
    }

    var getSubscriptions = function () {
      var params = {};
      params.offset = 0;
      params.limit = 200;
      services.GET_DATA(params, API.GET_USER_SUBSCRIPTION_PLANS(), function (response) {
        $scope.planList = response.data.plans;
      });
    }
    if (factories.getSettings().key_value.is_user_subscription == 1 && localStorage.getItem('profile_type') == 'ADMIN') {
      datepicker_filter();
      getSubscriptions();
    }

    $scope.onSelectPlan = function (plan) {
      $scope.selected_plan = plan;
      $scope.skip = 0;
      $scope.currentPage = 1;
      getUserData(1);
    }

    $scope.changeUserStatus = function (status, id) {
      var param_data = {};
      param_data.sectionId = 21;
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.userId = id;
      param_data.status = +(!status);

      services.POST_DATA(param_data, API.UPDATE_USER_STATUS, function (data) {
        getUserData(1);
        $scope.message = 'User status updated successfully';
        services.SUCCESS_MODAL(true);
      });
    }

    $scope.setPage = function (page) {
      $scope.currentPage = page;
      $scope.skip = $scope.limit * (page - 1);
      getUserData(page);
    }

    $scope.searchUser = function (keyEvent) {
      if (keyEvent.which === 13) {
        $scope.skip = 0;
        $scope.limit = 20;
        $scope.search = '';
        $scope.count = 0;
        $scope.users = [];
        $scope.dataLoaded = false;
        $scope.user = {
          otp_verified: '',
          phone_number: '',
          country_code: '',
          user_id: '',
          iso: '',
          user_type_id: '',
          // email: ''
        };
        $scope.invalid_phone_no = false;
        $scope.message = '';
        $scope.new_user_pass = {
          user_id: '',
          password: '',
          confirm_password: ''
        }
        $scope.user_type = '';
      }
    }

    $scope.changeUserStatus = function (status, id) {
      var param_data = {};
      param_data.sectionId = 21;
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.userId = id;
      param_data.status = +(!status);

      services.POST_DATA(param_data, API.UPDATE_USER_STATUS, function (data) {
        getUserData(1);
        $scope.message = 'User status updated successfully';
        services.SUCCESS_MODAL(true);
      });
    }

    $scope.setPage = function (page) {
      $scope.currentPage = page;
      $scope.skip = $scope.limit * (page - 1);
      getUserData(page);
    }

    $scope.searchUser = function (keyEvent) {
      if (keyEvent.which === 13) {
        $scope.skip = 0;
        getUserData(1);
      }
    }

    $scope.downloadCSV = function () {
      var data = {};
      data.accessToken = constants.ACCESSTOKEN;
      data.sectionId = 21;
      data.offset = $scope.skip;
      data.limit = $scope.limit;
      if (($scope.search).trim()) {
        data.search = $scope.search;
        data.searchType = 1;
      } else {
        data.searchType = 0;
        data.search = "";
      }

      if (!!localStorage.getItem('data_country')) {
        let country_data = localStorage.getItem('data_country').split(',');
        param_data.country_code = country_data[0];
        param_data.country_code_type = country_data[1];
      }

      data.is_download = 1
      services.POST_DATA(data, API.GET_USERS, function (response) {
        let dwnld_link = response.data.csvFileLink;
        services.DOWNLOAD_CSV(dwnld_link, 'users');
      });
    }

    $scope.changeOtpVErified = function (verified) {
      $scope.user.otp_verified = verified;
    }

    $scope.changeUserType = function (user_type) {
      if (!!user_type) {
        $scope.user.user_type_id = user_type.user_type_id;
      }
    }

    var getUserTypes = function (user) {
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
          if (user) {
            let type = $scope.user_type_prices.find(el => el.user_type_id == user.user_type_id);
            if (!!type) {
              $scope.user.user_type_id = type.user_type_id;
              $scope.user_type = type;
            }
          }
        }
      });
    }

    $scope.downloadCSV = function () {
      var data = {};
      data.accessToken = constants.ACCESSTOKEN;
      data.sectionId = 21;
      data.offset = $scope.skip;
      data.limit = $scope.limit;
      if (($scope.search).trim()) {
        data.search = $scope.search;
        data.searchType = 1;
      } else {
        data.searchType = 0;
        data.search = "";
      }
      if ($scope.selected_plan && $scope.selected_plan.id) data.subscription_id = $scope.selected_plan.id;

      data.is_download = 1
      services.POST_DATA(data, API.GET_USERS, function (response) {
        let dwnld_link = response.data.csvFileLink;
        services.DOWNLOAD_CSV(dwnld_link, 'users');
      });
    }

    $scope.changeOtpVErified = function (verified) {
      $scope.user.otp_verified = verified;
    }

    $scope.changeUserType = function (user_type) {
      if (!!user_type) {
        $scope.user.user_type_id = user_type.user_type_id;
      }
    }

    var getLoyalty = function (data) {
      let params = {
        offset: $scope.skip,
        limit: $scope.limit,
        sectionId: 40
      }
      $scope.dataLoaded = false;
      services.GET_DATA(params, API.LIST_LOYALTY, function (response) {
        if (response) {
          $scope.loyalties = response.data.levelData;

          let obj = $scope.loyalties.find(o => o.id == data.id);

          if (!!obj) {
            delete obj.$$hashKey;
            console.log('obj', obj);
            $scope.user.loyalty = obj.name + '#' + obj.total_loyality_points;
            $scope.user.loyalty_points = obj.total_loyality_points;
          }
        }
        $scope.dataLoaded = true;
      });
    }

    $scope.userEdit = function (user) {
      if (factories.getSettings().key_value.is_user_type == 1) {
        getUserTypes(user);
      }
      $scope.userEditForm.$setPristine();
      $scope.user.otp_verified = user.otp_verified;
      $scope.user.phone_number = user.mobile_no;
      $scope.user.user_id = user.id;
      $scope.user.iso = user.iso;
      $scope.user.country_code = user.country_code;
      $scope.user.name = user.firstname;

      if ($rootScope.enable_manual_user_loyality_update == 1) {
        $scope.user.loyalty_points = user.loyalty_points;
        // if(user.levelData.length){
        //   let col = user.levelData[0];
        //   // getLoyalty(col);
        // }
      }

      // $scope.user.email = user.email;
      setTimeout(() => {
        var input = document.querySelector("#user_phone");
        $scope.iti = window.intlTelInput(input, {
          preferredCountries: [factories.getSettings().adminDetails[0].iso]
        });
        if (user.iso) {
          $scope.iti.setCountry(user.iso);
        } else if (user.country_code && user.mobile_no) {
          $scope.iti.setNumber(`${user.country_code}${user.mobile_no}`);
        }
      }, 200);
      $("#user_edit_modal").modal('show');
    }

    $scope.changeLoyaltyPoints = function (data) {
      let value = `${data}`;
      let val = value.split('#');
      $scope.user.loyalty_points = val[1];
    }

    $scope.refresh = function () {
      // $window.location.reload();
      getUserData($scope.currentPage);
    }

    $scope.updateUser = function (userEditForm) {
      if (userEditForm.$submitted && userEditForm.$invalid) return;

      if ($scope.iti.isValidNumber()) {
        $scope.invalid_phone_no = false;
      } else {
        $scope.invalid_phone_no = true;
        return;
      }

      let phone_data = $scope.iti.getSelectedCountryData();
      if (!!phone_data) {
        $scope.user.iso = phone_data['iso2'];
        $scope.user.country_code = phone_data['dialCode'];
      }

      let value = { ...$scope.user };

      if ($rootScope.enable_manual_user_loyality_update == 0) {
        delete value.loyalty_points;
      }

      services.POST_DATA(value, API.UPDATE_USER_DETAILS, function (data) {
        $scope.currentPage = 1;
        $scope.skip = 0;
        getUserData(1);
        $("#user_edit_modal").modal('hide');
        $scope.message = 'User updated successfully';
        services.SUCCESS_MODAL(true);
      });
    }

    $scope.userPassword = function (user) {
      $("#reset_password_user").modal('show');
      $scope.new_user_pass.user_id = user.id;
    }

    $scope.passwordReset = function (passwordResetForm) {
      if (passwordResetForm.$submitted && passwordResetForm.$invalid) return;
      services.POST_DATA($scope.new_user_pass, API.REST_USER_PASSWORD, function (response) {
        $("#reset_password_user").modal('hide');
        $scope.message = 'User password updated successfully';
        services.SUCCESS_MODAL(true);
      });
    }

    $scope.viewDocuments = function (documents) {
      $scope.documents = documents.split('#');
      $("#document_view").modal('show');
    }










    $scope.check = function (user) {
      if ($scope.selected_users.includes(user.id)) {
        $scope.selected_users.splice($scope.selected_users.indexOf(user.id), 1);
        $scope.selected_emails.splice($scope.selected_emails.indexOf(user.email), 1);
      } else {
        $scope.selected_users.push(user.id);
        $scope.selected_emails.push(user.email);
      }
    }

    $scope.checkAll = function () {
      $scope.checkall = !$scope.checkall;
      $scope.selected_users = [];
      $scope.selected_emails = [];
      if ($scope.checkall) {
        $scope.users.forEach(user => {
          $scope.selected_users.push(user.id);
          $scope.selected_emails.push(user.email);
        });
      }
    }
    $scope.changeMsgType = function (msgType) {
      $scope.message_type = msgType;
    }

    $scope.sendNotificationOrEmail = function () {
      if ($scope.selected_users.length == 0) {
        factories.invalidDataPop("Please select users");
        return;
      } else if ($scope.message_type == 1 && $scope.notification.msg == '') {
        factories.invalidDataPop(`Please enter the notification message`);
        return;
      } else if ($scope.message_type == 2 && $scope.email.subject == '') {
        factories.invalidDataPop("Please enter the subject");
        return;
      } else if ($scope.message_type == 2 && $scope.email.body == '') {
        factories.invalidDataPop("Please enter the email body");
        return;
      }

      let userTypeArr = ($scope.selected_users.slice()).fill(0);

      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.sectionId = 52;
      param_data.ids = $scope.selected_users.join('#');

      if ($scope.message_type == 1) {
        param_data.content = $scope.notification.msg;
        param_data.userType = userTypeArr.join('#');
        services.POST_DATA(param_data, API.SEND_PUSH, function (response) {
          $scope.message = 'Notification has been sent successfully';
          services.SUCCESS_MODAL(true);
        });
      } else {
        param_data.content = $scope.email.body;
        param_data.receiverType = userTypeArr.join('#');
        param_data.receiverEmail = $scope.selected_emails.join('#');
        param_data.subject = $scope.email.subject;
        services.POST_DATA(param_data, API.SEND_EMAIL, function (response) {
          $scope.message = 'Email has been sent successfully';
          services.SUCCESS_MODAL(true);
        });
      }
    }

    $scope.notificationOpen = function () {
      $scope.notification_open = !$scope.notification_open;
    }



    // Create Order for Users

    $scope.getSupplierList = function () {
      var params = {
        is_active: 1,
        is_desc: 0,
        is_out_network: 0,
        limit: 20,
        offset: 0,
        order_by: 0,
        search: ''
      }

      services.GET_DATA(params, API.SUPPLIER_LIST, function (response) {
        $scope.suppliers = response.data.suppliersList;

        if ($scope.suppliers.length) {
          $scope.selected_supplier = $scope.suppliers[0];
          $scope.changeSupplier($scope.selected_supplier);
        }
      });
    }

    $scope.getHomeData = function () {
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.sectionId = 30;
      param_data.supplierId = $scope.selected_supplier.id; // $scope.supplier_id;

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

    $scope.changeSupplier = function (supplier) {
      $scope.selected_supplier = supplier;
      $scope.getHomeData();
    }

    $scope.interval = factories.getSettings().bookingFlow[0].interval;
    $scope.openProductModal = function (user) {
      $scope.selected_products = [];
      $("#add_products").modal('show');
      $scope.selected_user = { id: user.id, address_id: user.user_address_id }
      $scope.suppliers = [];
      $scope.selected_supplier = '0';
      $scope.selected_products = [];
      $scope.product_list = [];
      $scope.getSupplierList();
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
        $scope.selected_products = [];
        $scope.product_list.forEach(col => {
          if (col.id != product.id) {
            col.isChecked = false
          } else {
            col.isChecked = true;
            if (col['pricing_type']) {
              product.selectedQuantity = product.duration / $rootScope.timeInterval;
            }
          }
        })

        $scope.selected_products.push(product);
      }
    }


    $scope.productPriceToFloat = function (productData) {
      const decimalLength = $rootScope.price_decimal_length;
      ["price", "display_price", "fixed_price"].forEach(price => {
        productData[price] = Number.parseFloat(productData[price]).toFixed(decimalLength);
      });
      return productData;
    }

    var mapPoducts = function (data, page) {
      $scope.dataLoaded = true;
      $scope.product_list = [];
      $scope.count = data['product_count'];
      if (data['products'].length) {
        data['products'].forEach(item => {
          item.isChecked = false;
          // if (product.price && product.price.length) {
          //   product['name_en'] = product.names[0].name;
          //   product['desc_en'] = product.names[0].product_desc;
          //   let regular_price = (product.price).find(el => el.price_type == 0);
          //   let discount_price = (product.price).find(el => el.price_type == 1);
          //   if (!!discount_price) {
          //     product['price'] = discount_price ? (parseFloat(discount_price.price)) : null;
          //     product['handling'] = discount_price ? (parseFloat(discount_price.handling)) : 0;
          //   } else {
          //     product['price'] = regular_price ? (parseFloat(regular_price.price)) : null;
          //     product['handling'] = regular_price ? (parseFloat(regular_price.handling)) : 0;
          //   }
          //   // if(product.left_quantity) {
          //   $scope.product_list.push(product);
          //   // }
          // }
          let regular_price = (item['price']).find(el => el.price_type == 0);

          if (item['pricing_type']) {
            let discount_price = (item.price).find(el => el.price_type == 1);
            item['hourly_price'] = JSON.parse(regular_price.price)
            item['maxHour'] = item['hourly_price'][item['hourly_price'].length - 1]['max_hour'] - $scope.interval;
            if (item['discount'] && item['hourly_price'][0]['discount_price']) {
              item['fixed_price'] = item['hourly_price'][0]['discount_price'];
              item['display_price'] = item['hourly_price'][0]['price_per_hour'];
              item["discountPercentage"] = parseFloat((((item.display_price - item.fixed_price) / item.display_price) * 100).toFixed(2));
            } else {
              item['fixed_price'] = item['hourly_price'][0]['price_per_hour'];
            }
          } else {
            item.display_price = (parseFloat(regular_price.display_price)).toFixed(factories.getSettings().key_value.price_decimal_length || 2);
            item.fixed_price = (parseFloat(regular_price.price)).toFixed(factories.getSettings().key_value.price_decimal_length || 2);
            regular_price["discountPercentage"] = parseFloat((((regular_price.display_price - item.fixed_price) / regular_price.display_price) * 100).toFixed(2));
            item["discount"] = Math.round(regular_price.discountPercentage);
          }

          if (item.left_quantity) {
            $scope.product_list.push(item);
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
      param_data.serachText = $scope.search_product;
      param_data.serachType = $scope.search_product ? 1 : 0;
      param_data.branchId = $scope.selected_supplier.default_branch_id; // $scope.branch_id;

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


    $scope.products = [];
    $scope.addProducts = function () {
      $scope.products = [];
      $scope.selected_products.forEach(product => {
        if (product.left_quantity) {
          // $scope.order_desc.order_cost += parseFloat(product.price);
          let similar_product = $scope.products.find(el => el.product_id == product.id);
          if (!!similar_product) {
            similar_product.quantity++;
          } else {
            $scope.products.push({
              image: product.images[0].image_path,
              name: product.name,
              product_id: product.id,
              price: product.price ? product.price : 0,
              variants: product.prod_variants,
              addons: [],
              selectedQuantity: (similar_product || {}).quantity || product.selectedQuantity,
              left_quantity: product.left_quantity,
              handling: product.handling,
              new: true,
              discount: product.discount || 0,
              maxHour: product.maxHour || 0,
              supplier_branch_id: $scope.selected_supplier.default_branch_id,
              user_data: $scope.selected_user,
              supplier_id: 55,
              tax: 0,
              category_id: product.category_id
            });
          }
        }
      });

      localStorage.setItem('cart', JSON.stringify($scope.products))

      $state.go('cart.summary');
     
      $("#add_products").modal('hide');
    }


    $scope.deleteUser = function (userId) {
      services.CONFIRM($translate.instant(`You want to delete this User`),
        function (isConfirm) {
          if (isConfirm) {
            var param_data = {};
            param_data.accessToken = constants.ACCESSTOKEN;
            param_data.sectionId = 21;
            param_data.userId = userId;
            param_data.status = 1;
            services.POST_DATA(param_data, API.DELETE_USER, function (response) {
              $scope.refresh();
              $scope.message = `${$translate.instant('User has been deleted')}`;
              services.SUCCESS_MODAL(true);
            });
          }
        });
    };

  }]);
