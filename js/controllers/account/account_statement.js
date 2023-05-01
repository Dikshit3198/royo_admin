Royo.controller('StatementAccountPayableCtrl', ['$scope', '$rootScope', 'constants', 'services', 'API', 'pagerService', '$window',
  function ($scope, $rootScope, constants, services, API, pagerService, $window) {

    $rootScope.active_account_tab = 1;

    $scope.filter = {
      supplier: '',
      startDate: '',
      endDate: ''
    };
    $scope.suppliers = [];
    $scope.statement_data = [];
    $scope.selected_supplier;
    $scope.dataLoaded = false;
    $scope.search = '';
    $scope.skip = 0;
    $scope.limit = 20;
    $scope.count = 0;

    $scope.is_free_delivery = '';

    var datepicker = function () {
      setTimeout(() => {
        var picker = new Lightpick({
          field: document.getElementById("datepicker_statement"),
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
    datepicker();

    var getAccountStatementData = function (page) {

      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.authSectionId = 41;
      param_data.supplier = $scope.filter.supplier;
      if ($scope.filter.startDate) {
        param_data.startDate = $scope.filter.startDate;
      }
      if ($scope.filter.endDate) {
        param_data.endDate = $scope.filter.endDate;
      }
      param_data.offset = $scope.skip;
      param_data.limit = $scope.limit;
      param_data.search = ($scope.search).trim() ? $scope.search : '';

      if (!!localStorage.getItem('data_country')) {
        let country_data = localStorage.getItem('data_country').split(',');
        param_data.country_code = country_data[0];
        param_data.country_code_type = country_data[1];
      }

      if ([0, 1].includes($scope.is_free_delivery)) {
        param_data.is_free_delivery = $scope.is_free_delivery;
      }

      $scope.dataLoaded = false;

      services.POST_DATA(param_data, API.ACCOUNT_STATEMENT_LIST(), function (response) {
        let data = response.data;
        data.statement.map(data => {
          let price = data.net_amount;
          let subTotal = data.order_amount || price;
          if ($rootScope.remove_delivery_charge_supplier || $rootScope.remove_service_fee_supplier) {
            if ($rootScope.remove_delivery_charge_supplier == 1)
              price = price - data.delivery_charges;

            if ($rootScope.remove_service_fee_supplier == 1)
              price = price - data.user_service_charge;

            if ($rootScope.profile == 'SUPPLIER') {
              data.net_amount = price;
            }

            data.commission = (data.commission * price) / 100;
            data.total_amount = price - data.commission;
          }
          if ($rootScope.enable_fees_estimated_tax_contant == 1 && $rootScope.enable_custom_tax_static == 1) {
            var gstPerc = subTotal * (Number)($rootScope.custom_tax_static_value) / 100;
            data.commission = ((subTotal + gstPerc) * (data.admin_commission || 1)) / 100;
            data.total_amount = (subTotal + gstPerc) - (data.commission)
          }
        });





        $scope.statement_data = data.statement;
        $scope.count = data.count;
        $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
        $scope.dataLoaded = true;
      });
    };

    var getHomeData = function () {
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
        if ($scope.suppliers.length != 0) {
          getAccountStatementData(1);
        }
      });
    };

    $scope.searchOrder = function (keyEvent) {
      if (keyEvent.which === 13) {
        $scope.skip = 0;
        getAccountStatementData(1);
      }
    }

    if ($rootScope.profile === 'ADMIN') {
      getHomeData();
    } else {
      $scope.filter.supplier = $rootScope.active_supplier_id;
      getAccountStatementData(1);
    }

    $scope.changeSupplier = function (supplier) {
      $scope.filter.supplier = supplier.id;
    }

    $scope.changeDeliveryCharge = function (is_free_delivery) {
      $scope.is_free_delivery = is_free_delivery;
    }

    $scope.resetFilter = function () {
      $window.location.reload();
    };

    $scope.selectFilter = function () {
      $scope.skip = 0;
      getAccountStatementData(1);
    };

    $scope.setPage = function (page) {
      $scope.currentPage = page;
      $scope.skip = $scope.limit * (page - 1);
      getAccountStatementData(page);
    }

    $scope.downloadCSV = function () {
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.authSectionId = 41;
      param_data.supplier = $scope.filter.supplier;
      if ($scope.filter.startDate) {
        param_data.startDate = $scope.filter.startDate;
      }
      if ($scope.filter.endDate) {
        param_data.endDate = $scope.filter.endDate;
      }
      param_data.offset = $scope.skip;
      param_data.limit = $scope.limit;
      param_data.search = ($scope.search).trim() ? $scope.search : '';
      param_data.is_download = 1;

      if (!!localStorage.getItem('data_country')) {
        let country_data = localStorage.getItem('data_country').split(',');
        param_data.country_code = country_data[0];
        param_data.country_code_type = country_data[1];
      }

      if ([0, 1].includes($scope.is_free_delivery)) {
        param_data.is_free_delivery = $scope.is_free_delivery;
      }

      services.POST_DATA(param_data, API.ACCOUNT_STATEMENT_LIST(), function (response) {
        let dwnld_link = response.data.csvFileLink;
        services.DOWNLOAD_CSV(dwnld_link, 'statement');
      });
    };


    $scope.getDisplayPrice = function (account) {
      let price = account.net_amount; // 0;

      if ($rootScope.remove_delivery_charge_supplier == 1)
        price = price - account.delivery_charges; // account.net_amount

      if ($rootScope.remove_service_fee_supplier == 1)
        price = price - account.user_service_charge; // account.net_amount

      return price.toFixed($rootScope.price_decimal_length);
    }




    $scope.getPaytoRestaurant = function (order) {      
      var amount = 0;
      if (order && $rootScope.client_code == "kareemfood_0082") {
        var restpay = ((order.sub_total * order.admin_commission) / 100) || 0;
        amount = (Number)((order.sub_total - restpay) - ((order.bear_by == 1) ? order.promo_discount: 0));
        amount = (Number)(amount.toFixed(2));
      }
      if (order && $rootScope.client_code != "kareemfood_0082") {
        var restpay = ((order.sub_total * order.admin_commission) / 100) || 0;
        amount = (Number)((order.sub_total - restpay).toFixed(2));
      }
      return amount;
    }


    $scope.getPaytoCompnay = function (order) {
      debugger
      var amount = 0;
      if (order && $rootScope.client_code == "kareemfood_0082") {
        var restpay = (order.sub_total * order.admin_commission) / 100;
        amount = (Number)(restpay - ((order.bear_by == 0) ? order.promo_discount : 0));
        amount = (Number)(amount.toFixed(2));
      }
      if (order && $rootScope.client_code != "kareemfood_0082") {
        amount = ((order.sub_total * order.admin_commission) / 100) - ((order.bear_by == 1) ? order.promo_discount: 0).toFixed(2)
        amount = (Number)(amount.toFixed(2));
      }
      return amount;
    }
  }]);
