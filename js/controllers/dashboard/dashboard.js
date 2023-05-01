Royo.controller('DashboardCtrl', ['$scope', 'services', '$stateParams', '$state', 'API', '$rootScope', 'factories', 'constants', '$interval',
  function ($scope, services, $stateParams, $state, API, $rootScope, factories, constants, $interval) {

    $scope.labels = [];
    $scope.series = ['Series A'];
    $scope.totalOrders = [];
    $scope.totalRevenue = [];
    $scope.totalUsers = [];
      $scope.avarage_order_Duration = [];
    $scope.is_grid = true;
    $scope.selected_status = 1;
    $scope.total_users = 0;
    $scope.avarage_no_of_Deliveries_per_Hour = 0;
    $scope.total_average_duration_per_order = 0;
    $scope.dash_data = {
      pending_orders: 0,
      active_orders: 0,
      completed_orders: 0,
      cancelled_orders: 0,
      registered_suppliers: 0,
      total_categories: 0,
      total_products: 0,
      active_offers: 0,
      total_revenue: 0,
      total_orders: 0,
      active_driver_count: 0,

    };
    $scope.pending_orders = [];
    $scope.active_orders = [];
    $scope.orders = [];
    $scope.is_data_loaded = false;
    $scope.selectedProducts = [];
    $scope.no_orders = true;
    $scope.no_revenue = true;
    $scope.no_users = true;
    $scope.tabStatus = 0;
    $scope.supplier_id = '';
    $scope.supplier_name = '';
    $scope.end_date = moment().format("YYYY-MM-DD");
    $scope.start_date = moment($scope.end_date).subtract(6, 'days').format("YYYY-MM-DD");
    $scope.selected_order = {};
    $scope.prep_time = '00:00:00';
    $scope.branch_data = localStorage.getItem('branch_type') ? JSON.parse(localStorage.getItem('branch_type')) : null;
    $scope.zelle_order = null;
    $scope.zero_value = 0;
    $scope.filter = {
      month_filter: '',
      year_filter: ''
    }
    $scope.rejection_reason = '';

    $scope.base_color = '#2ca6b1';

    $scope.is_auto_confirmation = factories.getSettings().key_value.is_auto_confirmation ? JSON.parse(factories.getSettings().key_value.is_auto_confirmation) : 0;
    $scope.tabStatus = $scope.is_auto_confirmation;

    $scope.month_array = [
      { label: 'January', value: 1 },
      { label: 'February', value: 2 },
      { label: 'March', value: 3 },
      { label: 'April', value: 4 },
      { label: 'May', value: 5 },
      { label: 'June', value: 6 },
      { label: 'July', value: 7 },
      { label: 'August', value: 8 },
      { label: 'September', value: 9 },
      { label: 'October', value: 10 },
      { label: 'November', value: 11 },
      { label: 'December', value: 12 }
    ]

    let current_year = new Date().getFullYear();
    $scope.year_array = [];
    for (let i = 0; i < 10; i++) {
      $scope.year_array.push(current_year - 2 + i);
    }

    if (!angular.merge) {
      angular.merge = (function mergePollyfill() {
        function setHashKey(obj, h) {
          if (h) {
            obj.$$hashKey = h;
          } else {
            delete obj.$$hashKey;
          }
        }

        function baseExtend(dst, objs, deep) {
          var h = dst.$$hashKey;

          for (var i = 0, ii = objs.length; i < ii; ++i) {
            var obj = objs[i];
            if (!angular.isObject(obj) && !angular.isFunction(obj)) continue;
            var keys = Object.keys(obj);
            for (var j = 0, jj = keys.length; j < jj; j++) {
              var key = keys[j];
              var src = obj[key];

              if (deep && angular.isObject(src)) {
                if (angular.isDate(src)) {
                  dst[key] = new Date(src.valueOf());
                } else {
                  if (!angular.isObject(dst[key])) dst[key] = angular.isArray(src) ? [] : {};
                  baseExtend(dst[key], [src], true);
                }
              } else {
                dst[key] = src;
              }
            }
          }

          setHashKey(dst, h);
          return dst;
        }

        return function merge(dst) {
          return baseExtend(dst, [].slice.call(arguments, 1), true);
        }
      })();
    }

    if ($stateParams.sup_id) {
      $scope.supplier_id = $stateParams.sup_id;
    }
    if ($stateParams.name) {
      $scope.supplier_name = $stateParams.name;
    }

      var datepicker = function () {
        setTimeout(() => {
          var picker = new Lightpick({
            field: document.getElementById("datepicker_dasboard"),
            singleDate: false,
            startDate: $scope.start_date,
            endDate: $scope.end_date,
            lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en',
            format: 'DD.MM.YYYY',
            onSelect: function (start, end) {
              if (start && end) {
                $scope.start_date = start.format('YYYY-MM-DD');
                $scope.end_date = end.format('YYYY-MM-DD');
              }
            }
          });
        }, 500);
      }
      datepicker();
      $scope.showTimer = function (orderCreated_on) {
        var createdOn = new Date(orderCreated_on);
        var now = new Date();
        var tzDifference = 11.00 * 60 + now.getTimezoneOffset();
        var offsetTime = new Date(now.getTime() + tzDifference * 60 * 1000);
        var timeDiff = Math.abs(offsetTime.getTime() - createdOn.getTime());
        // var minutes = Math.floor(timeDiff / 60000);
        // var seconds = ((timeDiff % 60000) / 1000).toFixed(0);
        // return minutes + " Min. " + seconds + " seconds";


        var days = Math.floor(timeDiff / (24 * 3600000));
        var hours = Math.floor((timeDiff % (24 * 3600000)) / 3600000);
        var minutes = Math.floor(((timeDiff % (24 * 3600000)) % 3600000) / 60000);
        var seconds = ((((timeDiff % (24 * 3600000)) % 3600000) % 60000) / 1000).toFixed(0);

        let result = '';
        if (days > 0) {
          result = days + " Days ";
      }
      if (hours > 0 || days > 0) {
        result = result + hours + " Hrs. ";
      }
      result = result + minutes + " Mins. " + seconds + " Sec."
      return result;
    }
    $interval($scope.showTimer, 1000);


    $scope.changeTab = function (tab_status) {
      $scope.tabStatus = tab_status;
      if (tab_status == 1) {
        $scope.orders = $scope.active_orders;
      } else if (tab_status == 0) {
        $scope.orders = $scope.pending_orders;
      }
    }

    $scope.navigate = function (route, params) {
      //if (!$scope.supplier_id) {
        $state.go(route, params);
      //}
    }

    var chartColorSets = function () {
      let backgroundColor = [];
      let hoverBackgroundColor = [];
      let hoverBorderColor = [];


      let background_2_Color = [];
      let hoverBackground_2_Color = [];
      let hoverBorder_2_Color = [];

      for (var d = 0; d <= (moment($scope.end_date)).diff(moment($scope.start_date), 'days'); d++) {
        backgroundColor.push($rootScope.primary_color || $scope.base_color);
        hoverBackgroundColor.push($rootScope.primary_color || $scope.base_color);
        hoverBorderColor.push($rootScope.primary_color || $scope.base_color);

        let color = $rootScope.enable_second_theme_color == 1 && $rootScope.theme_second_color
          ? $rootScope.theme_second_color : ($rootScope.primary_color || $scope.base_color);
        background_2_Color.push(color);
        hoverBackground_2_Color.push(color);
        hoverBorder_2_Color.push(color);

      }

      $scope.datasetOverride = {
        backgroundColor: backgroundColor,
        hoverBackgroundColor: hoverBackgroundColor,
        hoverBorderColor: hoverBorderColor
      };

      $scope.datasetOverride_2 = {
        backgroundColor: background_2_Color,
        hoverBackgroundColor: hoverBackground_2_Color,
        hoverBorderColor: hoverBorder_2_Color
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

    $scope.getGraphData = function () {

      $scope.labels = [];
      $scope.totalOrders = [];
      $scope.totalRevenue = [];
      $scope.pending_orders = [];
      $scope.totalUsers = [];
      $scope.active_orders = [];
      $scope.orders = [];
      $scope.avarage_no_of_Deliveries = [];
      $scope.avarage_order_Duration = [];
      $scope.active_orders_agents = 0;
      let param_data = {
        end_date: $scope.end_date,
        start_date: $scope.start_date,
        sectionId: 39
      }

      if ($rootScope.profile == 'ADMIN') {
        if ($scope.supplier_id) {
          param_data.supplier_id = $scope.supplier_id;
        }

        // if ($rootScope.is_single_vendor == 1) {
        //   param_data.supplier_id = $rootScope.single_vendor_id;
        // }

      } else if ($rootScope.profile === 'SUPPLIER' || $rootScope.profile === 'BRANCH') {

        param_data.supplier_id = $rootScope.active_supplier_id;
      }
      $scope.is_data_loaded = false;
      if ($scope.filter.month_filter) {
        param_data['month_filter'] = $scope.filter.month_filter;
        param_data['year_filter'] = $scope.filter.year_filter ? $scope.filter.year_filter : current_year;
      }

      services.GET_DATA(param_data, API.DASHBOARD(), function (data) {
        if (data.status == 200) {
          chartSettings();
          let dash = data.data;
          $scope.dash_data = {
            pending_orders: dash.pending_order_count,
            active_orders: dash.active_order_count,
            completed_orders: dash.completed_order_count,
            cancelled_orders: dash.cancel_order_count,
            registered_suppliers: dash.register_supplier_count,
            total_categories: dash.category_count,
            total_products: dash.product_count,
            active_orders_agents: dash.active_orders_agents ? dash.active_orders_agents : 0,
            active_offers: dash.offers_count,
            active_driver_count: dash.active_agents,
            total_revenue: dash.total_revenue_order ? parseFloat(dash.total_revenue_order.total_revenue) : 0,
            total_orders: dash.total_revenue_order ? dash.total_revenue_order.total_order : 0,
            total_revenue_by_date: dash.total_revenue_order ? parseFloat(dash.total_revenue_order.total_revenue_by_date) : 0,
            total_order_by_date: dash.total_revenue_order ? dash.total_revenue_order.total_order_by_date : 0,
            total_expired_subuscriptions_count: dash.total_expired_subuscriptions_count,
            total_active_subuscriptions_count: dash.total_active_subuscriptions_count,
            total_user_by_date: (dash.total_user && dash.total_user[0]) ? dash.total_user[0].total_user : 0,


          };


          if ($rootScope.show_total_user_order == 1 || ($rootScope.show_user_graph_dash_to_admin_only == 1 && $rootScope.profile == 'ADMIN')) {
            $scope.total_users = dash.user_data[0].total_overall_user;
          }
 

          generateGraph(dash.subscriptionRevenueGraph || []);
          generateMonthlySubsGraph(dash.monthlySubscriptionCountGraph || []);


          $scope.pending_orders = dash.latestPendingOrders;
          $scope.active_orders = dash.latestActiveOrders;
          if ($scope.tabStatus == 0) {
            $scope.orders = $scope.pending_orders;
          } else {
            $scope.orders = $scope.active_orders;
          }



          for (var d = 0; d <= (moment($scope.end_date)).diff(moment($scope.start_date), 'days'); d++) {
            let date = moment($scope.start_date).add(d, 'days');
            $scope.labels.unshift(moment(date).format("MMM DD"));

            let revenueData = data.data.total_revenue.find(data => moment(data.created_at).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD"));
            let orderData = data.data.total_order.find(data => moment(data.created_at).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD"));
            if (!!revenueData) {
              $scope.totalRevenue.unshift((revenueData.total_revenue).toFixed(2));
            } else {
              $scope.totalRevenue.unshift(0);
            }

            if (!!orderData) {
              $scope.totalOrders.unshift((orderData.total_order).toFixed(2));
            } else {
              $scope.totalOrders.unshift(0);
            }

            if ($rootScope.show_user_graph_dash == 1 || ($rootScope.show_user_graph_dash_to_admin_only == 1 && $rootScope.profile == 'ADMIN')) {
              let users = data.data.total_user.find(data => moment(data.created_at).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD"));

              if (!!users) {
                $scope.totalUsers.unshift((users.total_user).toFixed(2));
              } else {
                $scope.totalUsers.unshift(0);
              }
            }

          }

          $scope.no_orders = $scope.totalOrders.find(data => data) ? false : true;
          $scope.no_revenue = $scope.totalRevenue.find(data => data) ? false : true;
          // $scope.no_users = $scope.total_users.find(data => data) ? false : true;

          $scope.totalOrders = $scope.totalOrders.reverse();
          $scope.totalRevenue = $scope.totalRevenue.reverse();
          $scope.labels = $scope.labels.reverse();

          if ($rootScope.show_user_graph_dash == 1 || ($rootScope.show_user_graph_dash_to_admin_only == 1 && $rootScope.profile == 'ADMIN')) {
            $scope.totalUsers = $scope.totalUsers.reverse();
          }
          if ($rootScope.enable_kpi == 1) {
            $scope.avarage_order_Duration = $scope.avarage_order_Duration.reverse();

          }
        }
        $scope.is_data_loaded = true;
      });
    }
    $scope.getGraphData();

    $scope.selectProduct = function (order) {
      $scope.selectedProducts = order.product;
    }

    var afterUpdate = function (orderId) {
      // let index = ($scope.active_orders).findIndex(order => orderId == order.id);
      // $scope.active_orders.splice(index, 1);
      $scope.getGraphData();
      services.SUCCESS_MODAL(true);
    }

    $scope.updateOrderStatus = function (val, orderId) {
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
            afterUpdate(orderId);
          });
          break;
        case 10:
          services.POST_DATA(param_data, API.NEARBY_UPDATE_ORDER(), function (response) {
            afterUpdate(orderId);
          });
          break;
        case 5:
          services.POST_DATA(param_data, API.DELIVERED_UPDATE_ORDER(), function (response) {
            afterUpdate(orderId);
          });
          break;
        case 11:
          services.POST_DATA(param_data, API.IN_PROGRESS_UPDATE_ORDER(), function (response) {
            afterUpdate(orderId);
          });
          break;
      }
    };

    $scope.orderConfirmation = function (status, order, add_prep_time) {
      var param_data = {};
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
      services.POST_DATA(param_data, API.CONFIRM_REJECT_ORDER(), function (response) {
        $("#prep_time").modal('hide');
        $scope.getGraphData();
        services.SUCCESS_MODAL(true);
      });
    }

    $scope.ConfirmOrderUpdate = function (status, order, type) {
      if (status == 1 && ($rootScope.app_type == 1 || order.type == 1)) {
        $scope.prep_time = order.preparation_time ? order.preparation_time : '00:00:00';
        $scope.selected_order = order;
        if ($rootScope.enable_by_pass_order_confirmation == 1) {
          $scope.orderConfirmation(status, order, 0);
        } else {
          if (!order.category[0].disable_preparation_time || order.category[0].disable_preparation_time == 0) {
            $("#prep_time").modal('show');
          }
        }
        return;
      } if (status == 2) {
        $scope.rejection_reason = '';
        $("#order_rejection").modal('show');
        $scope.selected_order = order;
        $scope.order_cancel_type = !!type ? 1 : 0;
      } else {
        $scope.orderConfirmation(status, order, 0);
      }
    };

    $scope.viewPaymentreceipt = function (order) {
      $scope.zelle_order = order;
      $("#zelle_confirmation").modal('show');
    }

    $scope.resetFilter = function () {
      $scope.filter.month_filter = '';
      $scope.filter.year_filter = '';
      $scope.getGraphData();
    }

    $scope.totalSubscriptionRevenue = [];
    $scope.subscriptionRevenueLabels = [];
    var generateGraph = function (data) {
      chartSettings();
      $scope.totalSupplierSubscription = [];
      $scope.revenueLabels = [];
      data.forEach((element, index) => {
        $scope.revenueLabels.unshift(element.month);
        $scope.totalSupplierSubscription.unshift(element.total_revenue);
      });

      $scope.no_subscription = $scope.totalSupplierSubscription.find(data => data) ? false : true;
      $scope.totalSupplierSubscription = $scope.totalSupplierSubscription.reverse();
      $scope.revenueLabels = $scope.revenueLabels.reverse();
    }

    var generateMonthlySubsGraph = function (data) {
      chartSettings();
      $scope.totalMonthlyRevenue = [];
      $scope.monthlyLabels = [];
      data.forEach((element, index) => {
        $scope.monthlyLabels.unshift($scope.filter.month_filter ? ($scope.month_array[$scope.filter.month_filter - 1].label) : 'TOTAL');
        $scope.totalMonthlyRevenue.unshift(element.mounthly_subuscriptions_count);
      });

      $scope.no_subscription_monthly = $scope.totalMonthlyRevenue.find(data => data) ? false : true;
      $scope.totalMonthlyRevenue = $scope.totalMonthlyRevenue.reverse();
      $scope.monthlyLabels = $scope.monthlyLabels.reverse();

    }
  }]);



