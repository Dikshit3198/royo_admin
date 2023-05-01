Royo.controller('ShippingDashboardCtrl', ['$scope', 'services', '$stateParams', '$state', 'API', '$rootScope', 'factories', 'constants',
  function ($scope, services, $stateParams, $state, API, $rootScope, factories, constants) {

    $scope.labels = [];
    $scope.series = ['Series A'];
    $scope.totalOrders = [];
    $scope.totalRevenue = [];
    $scope.totalUsers = [];
    $scope.is_grid = true;
    $scope.selected_status = 1;

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
      total_orders: 0
    };
    $scope.pending_orders = [];
    $scope.active_orders = [];
    $scope.orders = [];
    $scope.is_data_loaded = false;
    $scope.selectedProducts = [];
    $scope.no_orders = true;
    $scope.no_revenue = true;
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

    $scope.delivery_company_id = localStorage.getItem('delivery_company_id');

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

    $scope.changeTab = function (tab_status) {
      $scope.tabStatus = tab_status;
      if (tab_status == 1) {
        $scope.orders = $scope.active_orders;
      } else if (tab_status == 0) {
        $scope.orders = $scope.pending_orders;
      }
    }

    $scope.navigate = function (route, params) {
      if (!$scope.supplier_id) {
        $state.go(route, params);
      }
    }

    var chartColorSets = function () {
      let backgroundColor = [];
      let hoverBackgroundColor = [];
      let hoverBorderColor = [];

      for (var d = 0; d <= (moment($scope.end_date)).diff(moment($scope.start_date), 'days'); d++) {
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

    $scope.getGraphData = function () {

      $scope.labels = [];
      $scope.totalOrders = [];
      $scope.totalRevenue = [];
      $scope.pending_orders = [];
      $scope.active_orders = [];
      $scope.orders = [];

      let param_data = {
        delivery_company_id: $scope.delivery_company_id
        // end_date: $scope.end_date,
        // start_date: $scope.start_date,
        // sectionId: 39
      }

    //   if ($rootScope.profile == 'ADMIN') {
    //     if ($scope.supplier_id) {
    //       param_data.supplier_id = $scope.supplier_id;
    //     }
    //   } else if ($rootScope.profile === 'SUPPLIER' || $rootScope.profile === 'BRANCH') {
    //     param_data.supplier_id = $rootScope.active_supplier_id;
    //   }
      $scope.is_data_loaded = false;

      services.GET_DATA(param_data, API.DASHBOARD(), function (data) {
        if ([200, 4].includes(data.status)) {
        //   chartSettings();

          let dash = data.data;
          $scope.dash_data = {
            pending_orders: dash.pending_order_count,
            active_orders: dash.active_order_count,
            completed_orders: dash.completed_order_count,
            cancelled_orders: dash.cancel_order_count,
            
            // active_offers: dash.offers_count,
            // total_revenue: dash.total_revenue_order ? parseFloat(dash.total_revenue_order.total_revenue) : 0,
            // total_orders: dash.total_revenue_order ? dash.total_revenue_order.total_order : 0,
            // total_revenue_by_date: dash.total_revenue_order ? parseFloat(dash.total_revenue_order.total_revenue_by_date) : 0,
            // total_order_by_date: dash.total_revenue_order ? dash.total_revenue_order.total_order_by_date : 0
          };



        //   $scope.pending_orders = dash.latestPendingOrders;
        //   $scope.active_orders = dash.latestActiveOrders;
        //   if ($scope.tabStatus == 0) {
        //     $scope.orders = $scope.pending_orders;
        //   } else {
        //     $scope.orders = $scope.active_orders;
        //   }

        //   for (var d = 0; d <= (moment($scope.end_date)).diff(moment($scope.start_date), 'days'); d++) {
        //     let date = moment($scope.start_date).add(d, 'days');
        //     $scope.labels.unshift(moment(date).format("MMM DD"));

        //     let revenueData = data.data.total_revenue.find(data => moment(data.created_at).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD"));
        //     let orderData = data.data.total_order.find(data => moment(data.created_at).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD"));

        //     if (!!revenueData) {
        //       $scope.totalRevenue.unshift((revenueData.total_revenue).toFixed(2));
        //     } else {
        //       $scope.totalRevenue.unshift(0);
        //     }

        //     if (!!orderData) {
        //       $scope.totalOrders.unshift((orderData.total_order).toFixed(2));
        //     } else {
        //       $scope.totalOrders.unshift(0);
        //     }
        //   }

        //   $scope.no_orders = $scope.totalOrders.find(data => data) ? false : true;
        //   $scope.no_revenue = $scope.totalRevenue.find(data => data) ? false : true;

        //   $scope.totalUsers = $scope.totalUsers.reverse();
        //   $scope.totalOrders = $scope.totalOrders.reverse();
        //   $scope.totalRevenue = $scope.totalRevenue.reverse();
        //   $scope.labels = $scope.labels.reverse();

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
      if ($rootScope.app_type == 1 && status == 1) {
        param_data.preparation_time = add_prep_time == 1 ? moment($scope.prep_time, 'HH:mm').format('HH:mm:ss') : order.preparation_time;
      }
      services.POST_DATA(param_data, API.CONFIRM_REJECT_ORDER(), function (response) {
        $("#prep_time").modal('hide');
        $scope.getGraphData();
        services.SUCCESS_MODAL(true);
      });
    }

    $scope.ConfirmOrderUpdate = function (status, order) {
      if (status == 1 && $rootScope.app_type == 1) {
        $scope.prep_time = order.preparation_time ? order.preparation_time : '00:00:00';
        $scope.selected_order = order;
        $("#prep_time").modal('show');
      } else {
        $scope.orderConfirmation(status, order, 0);
      }
    };

    $scope.viewPaymentreceipt = function (order) {
      $scope.zelle_order = order;
      $("#zelle_confirmation").modal('show');
    }

  }]);