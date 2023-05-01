Royo.controller('SupplierProfileSetupFiveCtrl', ['$scope', '$rootScope', 'services', '$stateParams', '$translate', 'factories', 'API', 'constants',
  function ($scope, $rootScope, services, $stateParams, $translate, factories, API, constants) {


    $scope.msg_description = '';
    $rootScope.tab = $stateParams.tab;
    $scope.supplier_id = $stateParams.id;
    $rootScope.$broadcast('supplier_id', { supplier_id: $scope.supplier_id, tab: $stateParams.tab });

    $scope.prep_time = '00:00:00';
    $scope.prior_days = [];
    $scope.order_prior_day = '';
    $scope.timing = [];
    $scope.order_prior_time = '';
    $scope.selected_max_delivery = { name: '15 Min', value: 15 };
    $scope.selected_min_delivery = { name: '0 Min', value: 0 };
    $scope.urgent_delivery_time = { name: '0 Hour 30 min', value: 30 };

    $scope.work_days = [
      { name: 'Monday', from: '', to: '', value: false, id: 0, close_week_id: 0 },
      { name: 'Tuesday', from: '', to: '', value: false, id: 0, close_week_id: 0 },
      { name: 'Wednesday', from: '', to: '', value: false, id: 0, close_week_id: 0  },
      { name: 'Thursday', from: '', to: '', value: false, id: 0, close_week_id: 0 },
      { name: 'Friday', from: '', to: '', value: false, id: 0, close_week_id: 0 },
      { name: 'Saturday', from: '', to: '', value: false, id: 0, close_week_id: 0 },
      { name: 'Sunday', from: '', to: '', value: false, id: 0, close_week_id: 0 },
    ];

    for (let i = 0; i <= 30; i++) {
      $scope.prior_days.push({ name: `${i} days`, value: i });
    }

    $scope.min_delivery = [
      {
        name: '0 Min',
        value: 0
      }, {
        name: '15 Min',
        value: 15
      }, {
        name: '30 Min',
        value: 30
      }, {
        name: '45 Min',
        value: 45
      }, {
        name: '60 Min',
        value: 60
      }, {
        name: '90 Min',
        value: 90
      }, {
        name: '2 Hours',
        value: 120
      }, {
        name: '3 Hours',
        value: 180
      }, {
        name: '4 Hours',
        value: 240
      }, {
        name: '5 Hours',
        value: 300
      }, {
        name: '6 Hours',
        value: 360
      }, {
        name: '7 Hours',
        value: 420
      }, {
        name: '8 Hours',
        value: 480
      }, {
        name: '9 Hours',
        value: 540
      },
      {
        name: '1 day',
        value: 1440
      },
      {
        name: '2 day',
        value: 2880
      },
      {
        name: '3 day',
        value: 4320
      },
      {
        name: '4 day',
        value: 5760
      },
      {
        name: '5 day',
        value: 7200
      },
      {
        name: '6 day',
        value: 8640
      }
    ];

    $scope.max_delivery = [
      {
        name: '15 Min',
        value: 15
      }, {
        name: '30 Min',
        value: 30
      }, {
        name: '45 Min',
        value: 45
      }, {
        name: '60 Min',
        value: 60
      }, {
        name: '90 Min',
        value: 90
      }, {
        name: '2 Hours',
        value: 120
      }, {
        name: '3 Hours',
        value: 180
      }, {
        name: '4 Hours',
        value: 240
      }, {
        name: '5 Hours',
        value: 300
      }, {
        name: '6 Hours',
        value: 360
      }, {
        name: '7 Hours',
        value: 420
      }, {
        name: '8 Hours',
        value: 480
      }, {
        name: '9 Hours',
        value: 540
      },
      {
        name: '1 day',
        value: 1440
      },
      {
        name: '2 day',
        value: 2880
      },
      {
        name: '3 day',
        value: 4320
      },
      {
        name: '4 day',
        value: 5760
      },
      {
        name: '5 day',
        value: 7200
      },
      {
        name: '6 day',
        value: 8640
      },
      {
        name: '7 day',
        value: 10080
      }
    ];

    $scope.timing = [
      {
        name: '0 Hour 30 min',
        value: 30
      },
      {
        name: '1 Hour 00 min',
        value: 60
      },
      {
        name: '1 Hour 30 min',
        value: 90
      },
      {
        name: '2 Hour 00 min',
        value: 120
      },
      {
        name: '2 Hour 30 min',
        value: 150
      },
      {
        name: '3 Hour 00 min',
        value: 180
      },
      {
        name: '3 Hour 30 min',
        value: 210
      },
      {
        name: '4 Hour 00 min',
        value: 240
      },
      {
        name: '4 Hour 30 min',
        value: 270
      },
      {
        name: '5 Hour 00 min',
        value: 300
      },
      {
        name: '5 Hour 30 min',
        value: 330
      },
      {
        name: '6 Hour 00 min',
        value: 360
      },
      {
        name: '6 Hour 30 min',
        value: 390
      },
      {
        name: '7 Hour 00 min',
        value: 420
      },
      {
        name: '7 Hour 30 min',
        value: 450
      },
      {
        name: '8 Hour 00 min',
        value: 480
      },
      {
        name: '8 Hour 30 min',
        value: 510
      },
      {
        name: '9 Hour 00 min',
        value: 540
      },
      {
        name: '9 Hour 30 min',
        value: 570
      },
      {
        name: '10 Hour 00 min',
        value: 600
      },
      {
        name: '10 Hour 30 min',
        value: 630
      },
      {
        name: '11 Hour 00 min',
        value: 660
      },
      {
        name: '11 Hour 30 min',
        value: 690
      },
      {
        name: '12 Hour 00 min',
        value: 720
      },
      {
        name: '12 Hour 30 min',
        value: 750
      },
      {
        name: '13 Hour 00 min',
        value: 780
      },
      {
        name: '13 Hour 30 min',
        value: 810
      },
      {
        name: '14 Hour 00 min',
        value: 840
      },
      {
        name: '14 Hour 30 min',
        value: 870
      },
      {
        name: '15 Hour 00 min',
        value: 900
      },
      {
        name: '15 Hour 30 min',
        value: 930
      },
      {
        name: '16 Hour 00 min',
        value: 960
      },
      {
        name: '16 Hour 30 min',
        value: 990
      },
      {
        name: '17 Hour 00 min',
        value: 1020
      },
      {
        name: '17 Hour 30 min',
        value: 1050
      },
      {
        name: '18 Hour 00 min',
        value: 1080
      },
      {
        name: '18 Hour 30 min',
        value: 1110
      },
      {
        name: '19 Hour 00 min',
        value: 1140
      },
      {
        name: '19 Hour 30 min',
        value: 1170
      },
      {
        name: '20 Hour 00 min',
        value: 1200
      },
      {
        name: '20 Hour 30 min',
        value: 1230
      },
      {
        name: '21 Hour 00 min',
        value: 1260
      },
      {
        name: '21 Hour 30 min',
        value: 1290
      },
      {
        name: '22 Hour 00 min',
        value: 1320
      },
      {
        name: '22 Hour 30 min',
        value: 1350
      },
      {
        name: '23 Hour 00 min',
        value: 1380
      },
      {
        name: '23 Hour 30 min',
        value: 1410
      },
      {
        name: '24 Hour 00 min',
        value: 1440
      }
    ];

    $scope.dayChange = function (day) { 
      $scope.order_prior_day = day;
    }

    $scope.timeChange = function (time) {
      $scope.order_prior_time = time;
    }

    $scope.onSelectMaxDelivery = function (selected_max_delivery) {
      $scope.selected_max_delivery = selected_max_delivery;
    }

    $scope.onSelectMinDelivery = function (selected_min_delivery) {
      $scope.selected_min_delivery = selected_min_delivery;
    }

    $scope.onUrgentTimeChange = function (urgent_time) {
      $scope.urgent_delivery_time = urgent_time;
    }

    $scope.toggle = function (day) {
      day.value = !day.value;
    }

    $scope.changePrepTime = function (prep_time) {
      $scope.prep_time = prep_time;
    }

    $scope.checkFlow = function (types) {
      return $rootScope.app_type > 10 && $rootScope.flow_data.length && types.length ? $rootScope.flow_data.some(flow => types.includes(flow.flow_type)) : false;
    }
    
    var getSupplierSummaryData = function () {
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.supplierId = $scope.supplier_id;
      param_data.sectionId = 32;

      services.POST_DATA(param_data, API.GET_SUPPLIER_CONFIG(), function(response) {
        let summaryData = response.data[0];
        $scope.prep_time = summaryData.preparation_time ? summaryData.preparation_time : '00:00:00';
        $scope.order_prior_day = $scope.prior_days.find(el => el.value == summaryData.delivery_prior_days);
        $scope.order_prior_time = $scope.timing.find(el => el.value == summaryData.delivery_prior_time);
        let selected_max_delivery = $scope.max_delivery.find(el => el.value == summaryData.delivery_max_time);
        let selected_min_delivery = $scope.min_delivery.find(el => el.value == summaryData.delivery_min_time);
        let urgent_delivery_time = $scope.timing.find(el => el.value == summaryData.urgent_delivery_time);
        $scope.urgent_delivery_time = !!urgent_delivery_time ? urgent_delivery_time : $scope.urgent_delivery_time;
        $scope.selected_min_delivery = !!selected_min_delivery ? selected_min_delivery : $scope.selected_min_delivery;
        $scope.selected_max_delivery = !!selected_max_delivery ? selected_max_delivery : $scope.selected_max_delivery;
        if (summaryData.timings.length) {
          for (var k = 0; k < $scope.work_days.length; k++) {
            let timing_obj = summaryData.timings[k];
            $scope.work_days[k].from = timing_obj.start_time;
            $scope.work_days[k].to = timing_obj.end_time;
            $scope.work_days[k].value = timing_obj.is_open;
            $scope.work_days[k].id = timing_obj.id;
            $scope.work_days[k].week_id = timing_obj.week_id;
            $scope.work_days[k].close_week_id = (timing_obj.close_week_id || timing_obj.close_week_id == 0) ? timing_obj.close_week_id : timing_obj.week_id;
          }

          console.log('$scope.work_days', $scope.work_days);
        }
      });
    }
    getSupplierSummaryData();

    $scope.onSubmit = function () {
      let JSON_DATA = [];

      if($scope.selected_min_delivery.value > $scope.selected_max_delivery.value) {
        factories.warningDataPop($translate.instant('Min. Delivery Time Cannot Be More Than Max. Delivery Time'));
        return;
      }      

      for (var k = 0; k < $scope.work_days.length; k++) {
        let data = $scope.work_days[k];

        if((data.from && !data.to) || (!data.from && data.to)) {
          factories.warningDataPop($translate.instant('Please select start/end time'));
          return;
        }

        // console.log('data.close_week_id', );
        if((!data.close_week_id && data.close_week_id != 0) || (data.week_id == data.close_week_id)) {
          if( moment(data.to, 'h:mma').isBefore(moment(data.from, 'h:mma'))) {
            factories.warningDataPop(`${$translate.instant("Invalid date-time duration for")} ${data.name}`);
            return;
          }
        }

        let obj = {
          id: data.id,
          supplier_id: $scope.supplier_id,
          week_id: k,
          week: ((data.name).toLowerCase()).substring(0, 3),
          start_time: data.from,
          end_time: data.to,
          is_open: +data.value
        }

        if($rootScope.enable_supplier_config_closing_day == 1) {
          obj['close_week_id'] = (data.close_week_id || data.close_week_id == 0) ? data.close_week_id : data.week_id;
        }
        JSON_DATA.push(obj);
      }

      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.supplierId = $scope.supplier_id;
      param_data.sectionId = 32;
      // param_data.deliveryPriorDays = $scope.order_prior_day.value;
      // param_data.deliveryPriorTime = $scope.order_prior_time.value;
      param_data.deliveryPriorDays = 0;
      param_data.deliveryPriorTime = 0;
      param_data.deliveryMinTime = $scope.selected_min_delivery.value;
      param_data.deliveryMaxTime = $scope.selected_max_delivery.value;
      param_data.urgentDeliveryTime = $scope.urgent_delivery_time.value;
      param_data.preparation_time = moment($scope.prep_time, 'HH:mm').format('HH:mm:ss');
      param_data.timings = JSON.stringify(JSON_DATA);

      services.POST_DATA(param_data, API.UPDATE_SUPPLIER_CONFIG(), function(response) {
        $scope.msg_description = `${factories.localisation().supplier.toLowerCase()} ${$translate.instant('Configuration Saved')}`;
        services.SUCCESS_MODAL(true);
      });

    }

  }]);