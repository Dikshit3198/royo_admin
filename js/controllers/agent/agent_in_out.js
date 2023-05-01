Royo.controller('AgentInOutTimingCtrl', ['$scope', '$rootScope', '$stateParams', 'services', 'API', 'pagerService', 'constants', 'factories',
    function ($scope, $rootScope, $stateParams, services, API, pagerService, constants, factories) {


        $rootScope.tab = $stateParams.tab;
        $scope.supplier_id = $stateParams.supplierId;
        $rootScope.$broadcast('supplier_id', { supplier_id: $stateParams.supplierId, tab: $stateParams.tab });


        $scope.skip = 0;
        $scope.limit = 20;
        $scope.search = '';
        $scope.count = 0;
        $scope.timingList = [];
        $scope.dataLoaded = false;
        $scope.supplier_id = '';

        $scope.agents = [];
        $scope.agentId = 0;


        var getAgentList = function (page) {
            let param_data = {};
            param_data.sectionId = 63;
            param_data.offset = $scope.skip;
            param_data.limit = 100;
            param_data.search = ''

            param_data.is_admin = 0;


            if (!!localStorage.getItem('data_country')) {
                let country_data = localStorage.getItem('data_country').split(',');
                param_data.country_code = country_data[0];
                param_data.country_code_type = country_data[1];
            }

            services.GET_DATA(param_data, API.GET_AGENT_LIST(), function (response) {
                if (!!response && response.data) {
                    $scope.agents = response.data.AgentList;
                    var default_agent = $scope.agents.find(x => x.id == (Number)($stateParams.id));
                    if (default_agent) {
                        $scope.agentId = default_agent.id;
                    }
                }
            });
        }

        getAgentList(1);

        var getAgentInOutTimings = function (page) {
            var data = {
                agentId: $scope.agentId ? $scope.agentId : (Number)($stateParams.id),
                limit: $scope.limit,
                skip: $scope.skip

            };
            $scope.dataLoaded = false;
            services.GET_DATA(data, API.DRIVER_IN_OUT_TIMINGS, function (response) {
                $scope.timingList = response.data.list;
                $scope.count = response.data.count;
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                $scope.dataLoaded = true;
            });
        };
        getAgentInOutTimings(1);


        $scope.onSelectAgent = function (agentId) {
            $scope.agentId = agentId;
            getAgentInOutTimings(1);
        }

        $scope.setPage = function (page) {
            $scope.currentPage = page;
            $scope.skip = $scope.limit * (page - 1);
            getAgentInOutTimings(page);
        }


    }]);