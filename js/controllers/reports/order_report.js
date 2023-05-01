Royo.controller('orderReportsCtrl', ['$scope', '$rootScope', 'constants', 'services', 'pagerService', '$translate', 'API', '$window', 'factories',
  function ($scope, $rootScope, constants, services, pagerService, $translate, API, $window, factories) {

    $rootScope.active_report_tab = 2;
    $scope.skip = 0;
    $scope.limit = 20;
    $scope.filter = {
      id: '',
      status: '',
      startDate: '',
      endDate: '',
      email: '',
      supplier: ''
    }
    $scope.orders = [];
    $scope.count = 0;
    $scope.dataLoaded = false;
    $scope.selected_supplier;
    $scope.suppliers = [];
    $scope.order_by = null;
    $scope.is_desc = null;
    $scope.TotalorderAmount = 0;
    $scope.notification_open = false;
    $scope.graphical_report = false;
    $scope.notification = { msg: '' };
    $scope.checkall = false;
    $scope.selected_orders = [];
    $scope.selected_emails = [];
    $scope.message = '';
    $scope.message_type = 1;
    $scope.email = {
      body: '',
      subject: ''
    };
    $scope.totalOrders = [];
    $scope.no_orders = true;
    $scope.selected_user_type = '';

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

    var datePicker = function () {
      setTimeout(() => {
        var picker = new Lightpick({
          field: document.getElementById("datepickerOrderReport"),
          singleDate: false,
          onSelect: function (start, end) {
            if (start && end) {
              $scope.filter.startDate = start.format('YYYY-MM-DD');
              $scope.filter.endDate = end.format('YYYY-MM-DD');
            }
          }
        });
      }, 500);
    }
    datePicker();

    var getSuppliers = function () {
      let params = {
        limit: 0,
        offset: 0,
        is_active: 1,
        search: '',
        is_desc: 0,
        order_by: 0
      }

      if (!!localStorage.getItem('data_country')) {
        let country_data = localStorage.getItem('data_country').split(',');
        params.country_code = country_data[0];
        params.country_code_type = country_data[1];
      }

      services.GET_DATA(params, API.SUPPLIER_LIST, function (response) {
        $scope.suppliers = response.data.suppliersList;
      });
    }

    if ($rootScope.profile === 'ADMIN') {
      getSuppliers();
    }

    $scope.changeSupplier = function (selected_supplier) {
      $scope.filter.supplier = selected_supplier.id;
    }

    var getOrderData = function (page) {
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.sectionId = 45;
      param_data.offset = $scope.skip;
      param_data.limit = $scope.limit;
      param_data.id = $scope.filter.id;
      param_data.status = $scope.filter.status;
      param_data.email = $scope.filter.email;
      param_data.supplier = $scope.filter.supplier;
      param_data.startDate = $scope.filter.startDate;
      param_data.endDate = $scope.filter.endDate;
      if ($scope.order_by && $scope.is_desc !== undefined && $scope.is_desc !== null) {
        param_data.order_by = $scope.order_by;
        param_data.is_desc = $scope.is_desc;
      }

      if (factories.getSettings().key_value.is_user_type == 1) {
        param_data.user_type_id = $scope.selected_user_type ? $scope.selected_user_type.user_type_id : 0;
      }

      $scope.dataLoaded = false;
      services.POST_DATA(param_data, API.GET_ORDER_REPORT(), function (response) {
        $scope.orders = response.data.orders;
        $scope.count = response.data.count;
        $scope.TotalorderAmount = response.data.order_amount;
        $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
        $scope.dataLoaded = true;
      });

      $scope.labels = [];
      $scope.totalOrders = [];
      param_data.supplier_id = localStorage.getItem('profile_type') == 'SUPPLIER' ? localStorage.getItem('supplier_id') : $scope.filter.supplier;
      services.POST_DATA(param_data, API.ORDER_GRAPHICAL_REPORT(), function (response) {
        generateGraph(response.data.slots);
      });
    };
    getOrderData(1);

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
    if (factories.getSettings().key_value.is_user_type == 1) {
      getUserTypes();
    }

    $scope.resetFilter = function () {
      $window.location.reload();
    };

    $scope.changeStatus = function (status) {
      $scope.filter.status = status;
    }

    $scope.onSelectUserType = function (selected_user_type) {
      $scope.selected_user_type = selected_user_type;
    }

    $scope.selectFilter = function () {
      getOrderData(1);
    };

    $scope.setPage = function (page) {
      $scope.currentPage = page;
      $scope.skip = $scope.limit * (page - 1);
      getOrderData(page);
    }

    $scope.sortBy = function (col) {
      $scope.skip = 0;
      if ($scope.order_by == col) {
        $scope.is_desc = +(!$scope.is_desc);
      } else {
        $scope.is_desc = 1;
      }
      $scope.order_by = col;
      getOrderData(1);
    }

    $scope.check = function (order) {
      if ($scope.selected_orders.includes(order.id)) {
        $scope.selected_orders.splice($scope.selected_orders.indexOf(order.id), 1);
        $scope.selected_emails.splice($scope.selected_orders.indexOf(order.user_email), 1);
      } else {
        $scope.selected_orders.push(order.id);
        $scope.selected_emails.push(order.user_email);
      }
    }

    $scope.checkAll = function () {
      $scope.checkall = !$scope.checkall;
      $scope.selected_orders = [];
      $scope.selected_emails = [];
      if ($scope.checkall) {
        $scope.orders.forEach(order => {
          $scope.selected_orders.push(order.id);
          $scope.selected_emails.push(order.user_email);
        });
      }
    }
    $scope.changeMsgType = function (msgType) {
      $scope.message_type = msgType;
    }

    $scope.sendNotificationOrEmail = function () {
      if ($scope.selected_orders.length == 0) {
        factories.invalidDataPop($translate.instant('Please select users'))
        return;
      } else if ($scope.message_type == 1 && $scope.notification.msg == '') {
        factories.invalidDataPop($translate.instant(`Please enter the notification message`));
        return;
      } else if ($scope.message_type == 2 && $scope.email.subject == '') {
        factories.invalidDataPop($translate.instant("Please enter the subject"));
        return;
      } else if ($scope.message_type == 2 && $scope.email.body == '') {
        factories.invalidDataPop($translate.instant("Please enter the email body"));
        return;
      }

      let userTypeArr = ($scope.selected_orders.slice()).fill(0);

      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.sectionId = 52;
      param_data.ids = $scope.selected_orders.join('#');

      if ($scope.message_type == 1) {
        param_data.content = $scope.notification.msg;
        param_data.userType = userTypeArr.join('#');
        services.POST_DATA(param_data, API.SEND_PUSH, function (response) {
          $scope.message = `${$translate.instant('Notification has been sent successfully')}`;
          services.SUCCESS_MODAL(true);
        });
      } else {
        param_data.content = $scope.email.body;
        param_data.receiverType = userTypeArr.join('#');
        param_data.receiverEmail = $scope.selected_emails.join('#');
        param_data.subject = $scope.email.subject;
        services.POST_DATA(param_data, API.SEND_EMAIL, function (response) {
          $scope.message = `${$translate.instant('Email has been sent successfully')}`;
          services.SUCCESS_MODAL(true);
        });
      }
    }

    $scope.downloadCSV = function () {
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.sectionId = 45;
      param_data.offset = $scope.skip;
      param_data.limit = $scope.limit;
      param_data.id = $scope.filter.id;
      param_data.status = $scope.filter.status;
      param_data.email = $scope.filter.email;
      param_data.supplier = $scope.filter.supplier;
      param_data.startDate = $scope.filter.startDate;
      param_data.endDate = $scope.filter.endDate;
      if ($scope.order_by && $scope.is_desc !== undefined && $scope.is_desc !== null) {
        param_data.order_by = $scope.order_by;
        param_data.is_desc = $scope.is_desc;
      }
      param_data.is_download = 1;
      services.POST_DATA(param_data, API.GET_ORDER_REPORT(), function (response) {
        let dwnld_link = response.data.csvFileLink;
        services.DOWNLOAD_CSV(dwnld_link, 'orders');
      });
    };


    var chartColorSets = function () {
      let backgroundColor = [];
      let hoverBackgroundColor = [];
      let hoverBorderColor = [];

      for (var d = 0; d <= 12; d++) {
        backgroundColor.push($rootScope.primary_color);
        hoverBackgroundColor.push($rootScope.primary_color);
        hoverBorderColor.push($rootScope.primary_color);
      }

      $scope.datasetOverride = {
        backgroundColor: backgroundColor,
        hoverBackgroundColor: hoverBackgroundColor,
        hoverBorderColor: hoverBorderColor
      };
    }

    var chartSettings = function () {
      $scope.options = {
        cornerRadius: 12,
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            }
          }],
          yAxes: [
            {
              id: 'y-axis',
              type: 'linear',
              display: false,
              position: 'left',
              gridLines: {
                display: false
              },
              ticks: {
                beginAtZero: true
              }
            },
          ],
        },
      }

      chartColorSets();
    }

    var generateGraph = function (data) {
      chartSettings();

      data.forEach(el => {
        $scope.labels.unshift(`${el.from_time} to ${el.to_time}`);
        if (el.orderCount) {
          $scope.totalOrders.unshift((el.orderCount).toFixed(2));
        } else {
          $scope.totalOrders.unshift(0);
        }
      });

      $scope.no_orders = $scope.totalOrders.find(data => data) ? false : true;
      $scope.totalOrders = $scope.totalOrders.reverse();
      $scope.labels = $scope.labels.reverse();
    }

    $scope.notificationOpen = function () {
      $scope.notification_open = !$scope.notification_open;
    }

    $scope.getPaytoRestaurant = function (order) {
      var amount = 0;
      if (order) {
        var restpay = (order.sub_total * order.admin_commission) / 100;
        amount = (Number)((order.sub_total - restpay).toFixed(2));
      }
      return amount;
    }

    $scope.getPaytoCompnay = function (order) {
      var amount = 0;
      if (order) {
        amount = ((order.sub_total * order.admin_commission) / 100) -(order.loyality_point_discount + order.promo_discount);
        amount = (Number)(amount.toFixed(2));
      }
      return amount;
    }


  }]);