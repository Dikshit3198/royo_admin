Royo.controller('AccountSettelmentCtrl', ['$scope', '$rootScope', 'constants', 'services', 'API', 'pagerService', 'factories', '$window', '$translate',
  function ($scope, $rootScope, constants, services, API, pagerService, factories, $window, $translate) {

    $rootScope.active_account_tab = 2;

    $scope.no_online_orders = factories.getSettings().key_value.no_online_orders ? JSON.parse(factories.getSettings().key_value.no_online_orders) : 0;
    $scope.no_cash_orders = factories.getSettings().key_value.no_cash_orders ? JSON.parse(factories.getSettings().key_value.no_cash_orders) : 0;
    if ($scope.no_online_orders) {
      $rootScope.active_settelment_tab = $rootScope.profile === 'ADMIN' ? 2 : 1;
      $scope.active_settelment_tab = $rootScope.profile === 'ADMIN' ? 2 : 1;
    } else if ($scope.no_cash_orders) {
      $rootScope.active_account_tab = 2;
      $rootScope.active_settelment_tab = $rootScope.profile === 'ADMIN' ? 1 : 2;
    } else {
      $rootScope.active_account_tab = 2;
      $rootScope.active_settelment_tab = 1;
    }


    $scope.filter = {
      status: 2,
      supplier: '',
      startDate: '',
      endDate: '',
      paymentSource: ''
    };
    $scope.selected_supplier;
    $scope.suppliers = [];
    $scope.amount_receivable = 0;
    $scope.amount_payable = 0;
    $scope.account_data = [];
    $scope.dataLoaded = false;
    $scope.payable_data = [];
    $scope.receivable_data = [];
    $scope.message = '';
    $scope.skip = 0;
    $scope.limit = 20;
    $scope.currentPage = 1;
    $scope.count = 0;
    $scope.search = '';
    $scope.payment_type = 0;

    $scope.showAccountBalance = false;
    account_balance = 0;
    account_type = '';
    $scope.showWithdrawal = false;


    $scope.marking_all = false;


    $scope.is_free_delivery = '';


    var defaultText = function () {
      if ($rootScope.profile === 'ADMIN') {
        $scope.received_text = `${factories.localisation().admin_online_orders}`;
        $scope.amount_paid = `${factories.localisation().supplier_online_orders}`;
      } else {
        $scope.received_text = `${factories.localisation().supplier_online_orders}`;
        $scope.amount_paid = `TO ADMIN FOR CASH ORDERS`;
      }

      if (localStorage.getItem('unique_id') == 'beezii_0133') {
        const text = 'Owed By Beezii';
        $scope.amount_paid = text;
        $scope.received_text = text;
      }
    }
    defaultText();

    var datepicker = function () {
      setTimeout(() => {
        var picker = new Lightpick({
          field: document.getElementById("datepicker_settelment"),
          singleDate: false,
          onSelect: function (start, end) {
            if (start && end) {
              $scope.filter.startDate = start.format('YYYY-MM-DD');
              $scope.filter.endDate = end.format('YYYY-MM-DD');
            }
          }
        });
      }, 200);
    }
    datepicker();

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
      });
    };

    if ($rootScope.profile === 'ADMIN') {
      getHomeData();
    }

    $scope.changeSupplier = function (supplier) {
      $scope.filter.supplier = supplier.id;
    }

    $scope.changeFilter = function () {
      switch (parseInt($scope.filter.status)) {
        case 2: //All
          if ($rootScope.profile === 'ADMIN') {
            if ($scope.active_settelment_tab == 2) $scope.received_text = `TO ADMIN FOR CASH ORDERS`;
            if ($scope.active_settelment_tab == 1) $scope.amount_paid = `${factories.localisation().supplier_online_orders}`;
          } else {
            if ($scope.active_settelment_tab == 2) $scope.received_text = `${factories.localisation().supplier_online_orders}`;
            if ($scope.active_settelment_tab == 1) $scope.amount_paid = `TO ADMIN FOR CASH ORDERS`;
          }
          break;

        case 1: //Received
          if ($rootScope.profile === 'ADMIN') {
            if ($scope.active_settelment_tab == 2) $scope.received_text = `RECEIVED BY ADMIN`;
            if ($scope.active_settelment_tab == 1) $scope.amount_paid = `ALREADY PAID TO THE ${factories.localisation().supplier} BY ADMIN`;
          } else {
            if ($scope.active_settelment_tab == 2) $scope.received_text = `RECEIVED BY ${factories.localisation().supplier}`;
            if ($scope.active_settelment_tab == 1) $scope.amount_paid = `RECEIVED BY ADMIN`;
          }
          break;

        case 0: //Outstanding
          if ($rootScope.profile === 'ADMIN') {
            if ($scope.active_settelment_tab == 2) $scope.received_text = `TO BE RECEIVED BY ADMIN`;
            if ($scope.active_settelment_tab == 1) $scope.amount_paid = `TO BE PAID BY ADMIN`;
          } else {
            if ($scope.active_settelment_tab == 2) $scope.received_text = `TO BE RECEIVED BY ${factories.localisation().supplier}`;
            if ($scope.active_settelment_tab == 1) $scope.amount_paid = `TO BE PAID TO ADMIN`;
          }
          break;
      }

      if (localStorage.getItem('unique_id') == 'beezii_0133') {
        const text = 'Owed By Beezii';
        $scope.amount_paid = text;
        $scope.received_text = text;
      }
      $scope.skip = 0;
      getAccountData(1, $scope.active_settelment_tab);
    }

    $scope.filerPaymentSource = function (source) {
      $scope.filter.paymentSource = source;
      getAccountData(1, 0);
    }

    var getMumybeneAccountBalance = function () {
      const payload = {
        accessToken: constants.ACCESSTOKEN,
        authSectionId: 42
      }
      services.POST_DATA(payload, API.MUMYBENE_ACCOUNT_BALANCE, function (response) {
        console.log(response);
        if (response && response.data) {
          $scope.account_balance = response.data.balance;
        }
      })
    }

    var checkMumybeneGateway = function () {
      const paymentGateways = $rootScope.paymentGateways || JSON.parse(localStorage.getItem('featureData'));
      if (!paymentGateways) return;
      const isMumybeneGateway = paymentGateways.some(gateway => (gateway.name).toLowerCase() == 'mumybene' && gateway.is_active == 1)
      if (isMumybeneGateway) {
        $scope.showAccountBalance = true;
        $scope.account_type = 'Mumybene';
        getMumybeneAccountBalance();
      }
    }

    if ($rootScope.profile === 'ADMIN') {
      checkMumybeneGateway();
    }

    $scope.changeTab = function (tab) {
      $scope.account_data = [];
      $scope.active_settelment_tab = tab;
      $scope.filter.status = 2;
      defaultText();
      $scope.search = '';
      if (tab == 1) {
        $scope.account_data = $scope.payable_data;
        getAccountData(1, tab);
      } else if (tab == 2) {
        $scope.account_data = $scope.receivable_data;
        getAccountData(1, tab);
      }
      $scope.dataLoaded = true;
    }

    $scope.changepaymentStatus = function (status) {
      $scope.filter.status = status;
    }

    $scope.changeDeliveryCharge = function (is_free_delivery) {
      $scope.is_free_delivery = is_free_delivery;
    }

    $scope.clearFilter = function () {
      $window.location.reload();
    }

    var getAccountData = function (page, tab) {
      $scope.account_data = [];
      $scope.dataLoaded = false;
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.authSectionId = 42;
      param_data.supplier = $scope.filter.supplier;
      param_data.startDate = $scope.filter.startDate;
      param_data.endDate = $scope.filter.endDate;
      if ($scope.filter.status != 2) {
        param_data.status = $scope.filter.status;
      }
      param_data.offset = $scope.skip;
      param_data.limit = $scope.limit;
      param_data.search = ($scope.search).trim() ? $scope.search : '';

      if ($scope.filter.paymentSource) {
        param_data.payment_source = $scope.filter.paymentSource;
      }

      if (!!localStorage.getItem('data_country')) {
        let country_data = localStorage.getItem('data_country').split(',');
        param_data.country_code = country_data[0];
        param_data.country_code_type = country_data[1];
      }

      if (['0', '1'].includes($scope.is_free_delivery)) {
        param_data.is_free_delivery = $scope.is_free_delivery;
      }

      if ([1, 0].includes(tab)) {
        services.POST_DATA(param_data, API.ACCOUNT_PAYABLE_LIST(), function (response) {
          let data = response.data;
          $scope.amount_payable = data.totals[0] ? data.totals[0].total_payable_amount : 0;
          $scope.payable_data = data.orders;
          if ($scope.payable_data.length) {
            $scope.payable_data.map(data => {
              data['checked'] = false;
              if ($rootScope.remove_delivery_charge_supplier || $rootScope.remove_service_fee_supplier) {
                let price = data.net_amount;
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
            });
            if ($scope.active_settelment_tab == 1) {
              $scope.account_data = $scope.payable_data;
              $scope.count = response.data.count;
              $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
            }
          }
          $scope.showWithdrawal = $scope.filter.status == 0 ? true : false;
          $scope.dataLoaded = true;
        });
      }
      if ([2, 0].includes(tab)) {
        services.POST_DATA(param_data, API.ACCOUNT_RECEIVABLE_LIST(), function (response) {
          let data = response.data;
          $scope.amount_receivable = data.totals[0] ? data.totals[0].total_receivable_amount : 0;
          $scope.receivable_data = data.orders;
          if ($scope.receivable_data.length) {
            $scope.receivable_data.map(data => {
              data['checked'] = false;
              if ($rootScope.remove_delivery_charge_supplier || $rootScope.remove_service_fee_supplier) {
                let price = data.net_amount;
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
            });
            if ($scope.active_settelment_tab == 2) {
              $scope.account_data = $scope.receivable_data;
              console.log($scope.account_data);
              $scope.count = response.data.count;
              $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
            }
          }
          $scope.showWithdrawal = $scope.filter.status == 0 ? true : false;
          $scope.dataLoaded = true;
        });
      }
    };
    getAccountData(1, 0);

    $scope.getDisplayPrice = function (account) {
      let price = account.net_amount; // 0;
      if ($rootScope.remove_delivery_charge_supplier == 1)
        price = price - account.delivery_charges; // account.net_amount

      if ($rootScope.remove_service_fee_supplier == 1)
        price = price - account.user_service_charge; // account.net_amount

      return price.toFixed($rootScope.price_decimal_length);
    }

    $scope.check = function (order) {
      order.checked = !order.checked;
      $scope.marking_all = false;
    }

    $scope.payUser = function () {
      let JSON_DATA = [];
      $scope.account_data.forEach(element => {
        if (element['checked']) {
          JSON_DATA.push({
            orderId: element.order_id,
            amount: element.total_amount,
            supplierId: element.id,
            transaction_mode: $scope.payment_type
          });
        }
      });

      if (JSON_DATA.length <= 0) {
        factories.invalidDataPop($translate.instant('Please select orders'));
        return;
      }

      services.CONFIRM(`You pay to the ${factories.localisation().user_settlement}?`,
        function (isConfirm) {
          if (isConfirm) {
            var param_data = {};
            param_data.accessToken = constants.ACCESSTOKEN;
            param_data.authSectionId = 41;
            param_data.transactionData = JSON_DATA;
            if ($rootScope.profile === 'ADMIN') {
              param_data.accountType = $scope.active_settelment_tab == 1 ? 0 : 1;
            } else {
              param_data.accountType = $scope.active_settelment_tab == 1 ? 1 : 0;
            }

            services.POST_DATA(param_data, API.PAY_AMOUNT(), function (response) {
              if (response && response.data && response.data.length) {
                const orderIds = response.data.map(item => item.orderId)
                let message = `${orderIds.length > 1 ? factories.localisation().orders : factories.localisation().order} (${orderIds}) ${orderIds.length > 1 ? $translate.instant('are') : $translate.instant('is')} ${$translate.instant('not paid through online because the')} ${orderIds.length > 1 ? factories.localisation().suppliers : factories.localisation().supplier} ${$translate.instant('do not register with stripe account')}`
                factories.invalidDataPop(message);
                return;
              }

              $scope.skip = 0;
              $scope.currentPage = 1;
              getAccountData(1, $scope.active_settelment_tab);
              $scope.message = `${$translate.instant('Payment status updated')}`;
              services.SUCCESS_MODAL(true);
            });
          }
        })
    };

    $scope.withdrawalRequest = function () {

      const order_data = [];
      $scope.account_data.forEach(element => {
        if (element['checked']) {
          order_data.push({
            order_id: element.order_id,
            amount: element.total_amount,
          });
        }
      });

      if (order_data.length <= 0) {
        factories.invalidDataPop($translate.instant('Please select orders'));
        return;
      }

      const param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.authSectionId = 0;
      param_data.order_data = order_data;

      services.POST_DATA(param_data, API.SUPPLIER_PAYOUT_REQUEST, function (response) {
        if (response) {
          getAccountData(1, $scope.active_settelment_tab);
          $scope.message = `${$translate.instant('Payment withdrawal request created')}`;
          services.SUCCESS_MODAL(true);
        }
      })
    }

    $scope.searchOrder = function (keyEvent) {
      if (keyEvent.which === 13) {
        $scope.currentPage = 1;
        $scope.skip = 0;
        getAccountData(1, $scope.active_settelment_tab);
      }
    }

    $scope.setPage = function (page) {
      $scope.currentPage = page;
      $scope.skip = $scope.limit * (page - 1);
      getAccountData(page, $scope.active_settelment_tab);
    }

    $scope.downloadCSV = function () {
      $scope.account_data = [];
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.authSectionId = 42;
      param_data.supplier = $scope.filter.supplier;
      param_data.startDate = $scope.filter.startDate;
      param_data.endDate = $scope.filter.endDate;
      if ($scope.filter.status != 2) {
        param_data.status = $scope.filter.status;
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

      if ($scope.active_settelment_tab == 1) {
        services.POST_DATA(param_data, API.ACCOUNT_PAYABLE_LIST(), function (response) {
          let dwnld_link = response.data.csvFileLink;
          services.DOWNLOAD_CSV(dwnld_link, 'settlement');
        });
      }
      if ($scope.active_settelment_tab == 2) {
        services.POST_DATA(param_data, API.ACCOUNT_RECEIVABLE_LIST(), function (response) {
          let dwnld_link = response.data.csvFileLink;
          services.DOWNLOAD_CSV(dwnld_link, 'settlement');
        });
      }
    };

    $scope.changePaymentMode = function (payment_type) {
      $scope.payment_type = payment_type;
    }



    $scope.markAllRows = function () {
      if (!$scope.marking_all) {
        $scope.account_data.forEach(element => {
          element['checked'] = false;
        });
      }
      $scope.marking_all = true;
      $scope.account_data.forEach(element => {
        element['checked'] = !element['checked'];
        if (!element['checked']) {
          $scope.marking_all = false;
        }
      });
    }


    $scope.getPaytoRestaurant = function (order) {
      var amount = 0;
      if (order && $rootScope.client_code == "kareemfood_0082") {
        var restpay = ((order.sub_total * order.admin_commission) / 100) || 0;
        amount = (Number)((order.sub_total - restpay) - ((order.bear_by == 1) ? order.promo_discount: 0));
      }
      if (order && $rootScope.client_code != "kareemfood_0082") {
        var restpay = ((order.sub_total * order.admin_commission) / 100) || 0;
        amount = (Number)((order.sub_total - restpay).toFixed(2));
      }
      return amount;
    }

    $scope.getPaytoCompnay = function (order) {
      var amount = 0;
      if (order && $rootScope.client_code == "kareemfood_0082") {
        amount = (((order.sub_total * order.admin_commission) / 100)- ((order.bear_by == 0) ? order.promo_discount: 0));
        amount = (Number)(amount.toFixed(2));
      }
      if (order && $rootScope.client_code != "kareemfood_0082") {
        amount = ((order.sub_total * order.admin_commission) / 100)  - (order.loyality_point_discount + order.promo_discount) || 0;
        amount = (Number)(amount.toFixed(2));
      }
      return amount;
    }
  }]);
