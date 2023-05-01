Royo.controller('BookAgentsCtrl', ['$scope', '$stateParams', 'services', 'factories', 'API', '$rootScope',
  function ($scope, $stateParams, services, factories, API, $rootScope) {


    var getAgentList = function (page) {
        let param_data = {};
        param_data.sectionId = 63;
        param_data.offset = $scope.skip;
        param_data.limit = $scope.limit;
        param_data.search = '';
        
        if ($rootScope.profile === 'ADMIN') {
          if ($scope.selected_supplier_filter) {
            param_data.supplierId = $scope.selected_supplier_filter.id;
          }
          param_data.is_admin = $scope.is_admin;
        }
  
        if (!!localStorage.getItem('data_country')) {
          let country_data = localStorage.getItem('data_country').split(',');
          param_data.country_code = country_data[0];
          param_data.country_code_type = country_data[1];
        }
        $scope.dataLoaded = false;
  
        services.GET_DATA(param_data, API.GET_AGENT_LIST(), function (response) {
          if (!!response && response.data) {
            $scope.agents = response.data.AgentList;
            // $scope.count = response.data.count;
            // $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
          }
          $scope.dataLoaded = true;
        });
      }

      getAgentList(1);



  getAgents = function() {
    let form_data = {
      serviceIds: $scope.params['service_ids'].split(','),
      duration: $scope.duration,
      offset: moment().format('Z')
    }

    if ($scope.date_time) {
      form_data['datetime'] = $scope.date_time;
    }

    $scope.noAgent = false;
    $scope.isLoading = true;
    services.POST_AGENT_DATA.postAgentData(ApiUrl.agent.getAgents, form_data, $scope.headers)
      .subscribe(response => {
        if (!!response && response.data) {
          $scope.agents = response.data;
          $scope.createResponseModel();
        }
        $scope.noAgent = true;
        $scope.isLoading = false
      }, (err) => $scope.isLoading = false);
  }
  }]);