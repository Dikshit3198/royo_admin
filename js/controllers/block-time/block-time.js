Royo.controller('BlockTimeCtrl', ['$scope', '$rootScope', '$stateParams', 'services', 'API', 'pagerService', 'constants', 'factories',
    function ($scope, $rootScope, $stateParams, services, API, pagerService, constants, factories) {


        $scope.skip = 0;
        $scope.limit = 20;
        $scope.search = '';
        $scope.count = 0;
        $scope.blockTimeList = [];
        $scope.dataLoaded = false;
        $scope.block_time = {
            name: '',
            description: '',
            blockTime: '',
            blockEndTime: '',
            blockDate: '',
            blockEndDate: '',
            offset: '',
            block_time_commission: 0
        }

        $scope.selectedBlockTime = {};
        $scope.is_updating = false;

        $scope.accepted_blocktime_agents = [];


        var datepicker = function () {
            setTimeout(() => {
                var picker = new Lightpick({
                    field: document.getElementById("datepicker_order"),
                    singleDate: false,
                    footer: true,
                    onSelect: function (start, end) {
                        console.log(start, end)
                        if (start && end) {
                            $scope.block_time.blockDate = start.format('YYYY-MM-DD');
                            $scope.block_time.blockEndDate = end.format('YYYY-MM-DD');
                            $scope.block_time.offset = new Date($scope.block_time.blockDate).getTimezoneOffset().toString();
                            $scope.skip = 0;
                        } else if (!start && !end) {
                            picker.hide();
                            $scope.block_time.offset = '';
                            $scope.block_time.blockDate = '';
                            $scope.block_time.blockEndDate = ''
                            $scope.skip = 0;
                        }
                    }
                });
            }, 500);
        }

        datepicker();


        var getBlockTime = function (page) {
            $stateParams
            var data = {
                limit: $scope.limit,
                skip: $scope.skip
            };
            $scope.dataLoaded = false;
            services.GET_DATA(data, API.GET_AGENT_BLOCK_TIME, function (response) {
                $scope.blockTimeList = response.data.list;
                $scope.count = response.data.count;
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                $scope.dataLoaded = true;
            });
        };
        getBlockTime(1);

        $scope.setPage = function (page) {
            $scope.currentPage = page;
            $scope.skip = $scope.limit * (page - 1);
            getBlockTime(page);
        }

        $scope.changeView = function (is) {
            $scope.is_updating = false;
            $scope.block_time = {
                name: '',
                description: '',
                blockTime: '',
                blockEndTime: '',
                blockDate: '',
                blockEndDate: '',
                offset: '',
                block_time_commission: 0
            }
        }


        $scope.addBlockTime = function (addBlockTimeForm) {
            if (addBlockTimeForm.$invalid) return;
            var addParams = {};
            addParams.name = $scope.block_time.name;
            addParams.description = $scope.block_time.description;
            addParams.blockTime = $scope.block_time.blockTime.toLocaleTimeString();
            addParams.blockEndTime = $scope.block_time.blockEndTime.toLocaleTimeString();
            addParams.blockDate = $scope.block_time.blockDate;
            addParams.blockEndDate = $scope.block_time.blockEndDate;
            addParams.offset = $scope.block_time.offset;
            addParams.block_time_commission = $scope.block_time.block_time_commission;

            if ($scope.is_updating) {
                addParams.id = $scope.selectedBlockTime.id;
            }

            services.POST_DATA(addParams, API.SET_AGENT_BLOCK_TIME, function (response) {
                $scope.is_updating = false;
                $scope.dataLoaded = true;
                $("#addBlockTimeRef").modal('hide');
                getBlockTime(1);
                $scope.message = `Block time has been added!`;
                $scope.block_time = {
                    name: '',
                    description: '',
                    blockTime: '',
                    blockEndTime: '',
                    blockDate: '',
                    blockEndDate: '',
                    offset: '',
                    block_time_commission: 0
                }
                addBlockTimeForm.$submitted = false;
                services.SUCCESS_MODAL(true);
            });
        }



        $scope.deleteBlockTime = function (blocktime) {
            var data = {
                id: blocktime.id
            }
            services.POST_DATA(data, API.DELETE_AGENT_BLOCK_TIME, function (response) {
                getBlockTime(1);
                $scope.dataLoaded = true;
                $scope.message = `Block time has been deleted!`;
                services.SUCCESS_MODAL(true);
            });
        }

        $scope.updateBlockTime = function (blocktime) {
            $scope.selectedBlockTime = blocktime;
            $scope.is_updating = true;
            $scope.block_time = {
                name: blocktime.name,
                description: blocktime.description,
                blockTime: new Date(moment(new Date()).format('YYYY-MM-DD') + ' ' + blocktime.blockTime),
                blockEndTime: new Date(moment(new Date()).format('YYYY-MM-DD') + ' ' + blocktime.blockEndTime),
                blockDate: blocktime.blockDate,
                blockEndDate: blocktime.blockEndDate,
                offset: blocktime.offset,
                block_time_commission: blocktime.block_time_commission
            }
            $("#addBlockTimeRef").modal('show');

        }


        $scope.viewAgents = function (blocktime) {
            var data = {
                limit: $scope.limit,
                skip: $scope.skip,
                block_time_id: blocktime.id
            }
            services.GET_DATA(data, API.VIEW_BLOCK_TIME_ACCEPTED_AGENTS, function (response) {
                $scope.dataLoaded = true;
                $scope.accepted_blocktime_agents = response.data.list;
                $('#blocktimeAcceptedAgentRef').modal('show');
            });
        }


    }]);
