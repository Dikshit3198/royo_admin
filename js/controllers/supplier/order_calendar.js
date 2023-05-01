Royo.controller('SupplierOrderCalendarCtrl', ['$scope', '$rootScope', 'services', 'factories', 'constants', '$filter', '$state', '$stateParams', '$location', 'API', 'pagerService', 'calendarConfig',
  function ($scope, $rootScope, services, factories, constants, $filter, $state, $stateParams, $location, API, pagerService, calendarConfig) {

    $scope.skip = 0;
    $scope.limit = 100;
    $scope.tabStatus = 0;
    $scope.count = 0;
    $scope.search_agent = '0'
    $scope.selected_supplier_filter = {}
    $scope.is_admin = 0
    $scope.agents = []
    $scope.agentSlots = []
    $scope.agentEvents = []
    $scope.colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
      '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
      '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
      '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
      '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
      '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
      '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
      '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
      '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
      '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'
    ];


    $scope.cellIsOpen = true;
    $scope.selectedOrderDetail = {}
    $scope.selectedAgent = {}



    $scope.startingAgent = 0
    $scope.endingAgent = 6
    $scope.totalPagePartition = 6
    $scope.viewDate = new Date();


    if ($stateParams.tab) {
      $scope.tabStatus = $stateParams.tab ? parseInt($stateParams.tab) : 0;
    }

    $scope.actions = [{
      label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
      onClick: function (args) {
        console.log('Edited', args.calendarEvent);
      }
    }, {
      label: '<i class=\'glyphicon glyphicon-remove\'></i>',
      onClick: function (args) {
        console.log('Deleted', args.calendarEvent);
      }
    }];

    $scope.calendarView = 'month';

    $scope.changeTab = function(tab) {
      // if($scope.tabStatus != tab) {
        $scope.tabStatus = tab;
        // $scope.agentEvents = [];
        // $scope.getOrderData(1);

        $state.go('.', { tab }, { notify: true });
      // }
    }

    $scope.getOrderData = function (page) {
        $scope.orders = [];
        var param_data = {};
        param_data.accessToken = constants.ACCESSTOKEN;
        param_data.authSectionId = 36;
        param_data.limit = $scope.limit;
        param_data.serachText = $scope.search;
        param_data.serachType = $scope.search ? 1 : 0;
        param_data.offset = $scope.skip;
        param_data.tab_status = $scope.tabStatus;
        param_data.payment_type = 2;
        param_data.start_date = $scope.start_date;
        param_data.end_date = $scope.end_date;
  
        if (!!localStorage.getItem('data_country')) {
          let country_data = localStorage.getItem('data_country').split(',');
          param_data.country_code = country_data[0];
          param_data.country_code_type = country_data[1];
        }
  
        if ($scope.agent_id_for_orders && $stateParams.agent_id) {
          param_data.agent_id = (Number)($scope.agent_id_for_orders);
        }
  
        if ($rootScope.profile == 'SHIPPING') {
          param_data.delivery_company_id = $scope.delivery_company_id
        }
  
        $scope.dataLoaded = false;
  
        if ($scope.filter_by) {
          param_data.filter_by = $scope.filter_by;
        }
  
        services.POST_DATA(param_data, API.GET_ORDER_LIST(), function (response) {
          $scope.count = response.data.total_order;
          $scope.orders = response.data.orders ? response.data.orders : [];


          let i = 0
          $scope.orders.forEach(order => {
            calendarConfig.colorTypes.transparency = {
              primary: $scope.colorArray[i],
              secondary: $scope.colorArray[i]
            }
            // order.slots.forEach(slot => {
              let item = {
                title: `Order Id ${order.id}`,
                color: calendarConfig.colorTypes.transparency,
                startsAt: moment(order.schedule_date).toDate(),
                endsAt: moment(order.schedule_date).add(order.duration ? order.duration : 60, 'minutes').toDate(),
                draggable: true,
                resizable: true,
                actions: $scope.actions
              }
              $scope.agentEvents.push(item)
            // })
            i = i + 1;
          })

          $scope.dataLoaded = true;
          $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
        });
      };

      $scope.getOrderData(1);

    $scope.changeCalendaView = function (view) {
      $scope.calendarView = view
      // if (view == 'day') {
      //   let k = 0
      //   $scope.agentSlots = $scope.agentSlots.map(order => {
      //     let i = 0
      //     calendarConfig.colorTypes.transparency = {
      //       primary: $scope.colorArray[k],
      //       secondary: $scope.colorArray[k]
      //     }
      //     order.slots = order.slots.map(item => {
      //       item.title = `Order Id: ${item.order_id}`,
      //         item.color = calendarConfig.colorTypes.transparency,
      //         item.startsAt = moment(item.booking_date_time).toDate(),
      //         item.endsAt= moment(item.booking_date_time).add(item.duration ? item.duration : 60, 'minutes').toDate(),
      //         item.draggable = true,
      //         item.resizable = true,
      //         item.actions = $scope.actions
      //       i = i + 1;
      //       return item
      //     })
      //     order['count'] = k
      //     k++
      //     return order
      //   })
      // }
    }


    $scope.addEvent = function () {
      $scope.events.push({
        title: 'New event',
        startsAt: moment().startOf('day').toDate(),
        endsAt: moment().endOf('day').toDate(),
        color: calendarConfig.colorTypes.important,
        draggable: true,
        resizable: true
      });
    };

    $scope.eventClicked = function (event) {
      let order = event.title.split(' ')
      $scope.selectedAgentEvent = $scope.agentSlots.find(item => item.order_id == order[2])
      $scope.getOrderDesc(order[2])
    };

    $scope.getOrderDesc = function (order_id) {
      $scope.selectedOrderDetail = {}
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.authSectionId = 36;
      param_data.orderId = order_id;

      services.POST_DATA(param_data, API.GET_ORDER_DESCRIPTION(), function (response) {
        if (response && response.data) {
          $scope.selectedOrderDetail = response.data[0];
          if ($scope.selectedOrderDetail) {
            let params = {
              order_id: $scope.selectedOrderDetail.id
            }
            $state.go('orders.ordersDescription', params)
            // setTimeout(() => {
            // document.getElementById('editEventmodal').click()
            // }, 500);
          }
        }

      });
    };

    $scope.eventEdited = function (event) {
      console.log('Edited', event);
    };

    $scope.eventDeleted = function (event) {
      console.log('Deleted', event);
    };

    // $scope.eventTimesChanged = function (event) {
    //   console.log('Dropped or resized', event);
    // };

    $scope.eventTimesChanged = function (event) {
      $scope.viewDate = event.startsAt;
    };


    $scope.toggle = function ($event, field, event) {
      $event.preventDefault();
      $event.stopPropagation();
      event[field] = !event[field];
    };

    $scope.cellClicked = function(calendarDate, calendarNextView) {
      // $scope.viewDate = event.startsAt;
      $scope.calendarView = calendarNextView;
    };

    $scope.timespanClicked = function (date, cell) {
      if ($scope.calendarView === 'month') {
        if (($scope.cellIsOpen && moment(date).startOf('day').isSame(moment($scope.viewDate).startOf('day'))) || cell.events.length === 0 || !cell.inMonth) {
          $scope.cellIsOpen = false;
        } else {
          $scope.cellIsOpen = true;
          $scope.viewDate = date;
        }
      } else if ($scope.calendarView === 'year') {
        if (($scope.cellIsOpen && moment(date).startOf('month').isSame(moment($scope.viewDate).startOf('month'))) || cell.events.length === 0) {
          $scope.cellIsOpen = false;
        } else {
          $scope.cellIsOpen = true;
          $scope.viewDate = date;
        }
      }
    }

    $scope.changeOrder = function (order, type) {
      if (type == 'prev') {
        $scope.startingAgent = $scope.startingAgent == 0 ? 0 : $scope.startingAgent - 1
        $scope.endingAgent = $scope.startingAgent == 0 ? 6 : $scope.endingAgent - 1
      }
      if (type == 'next') {
        $scope.startingAgent = $scope.endingAgent == $scope.agentSlots.length - 1 ? $scope.startingAgent : $scope.startingAgent + 1
        $scope.endingAgent = $scope.endingAgent == $scope.agentSlots.length - 1 ? $scope.endingAgent : $scope.endingAgent + 1
      }
    }



  }
])