Royo.controller('UserSubsRevenueReportCtrl', ['$scope', 'services', 'factories', 'API', 'pagerService', '$rootScope', 'constants',
    function ($scope, services, factories, API, pagerService, $rootScope, constants) {
        $rootScope.active_report_tab = 7;
        $scope.skip = 0;
        $scope.limit = 20;
        $scope.filter = {
            search: '',
            month_filter: ''
        }
        $scope.subscriptions = [];
        $scope.count = 0;
        $scope.dataLoaded = false;
        $scope.order_by = null;
        $scope.is_desc = null;

        $scope.totalRevenue = [];

        $scope.series = ['Series A'];
        $scope.no_revenue = true;
        $scope.endDate = moment().format("YYYY-MM-DD");;
        $scope.startDate = moment($scope.endDate).subtract(6, 'days').format("YYYY-MM-DD");

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

        var datepicker = function () {
            setTimeout(() => {
                var picker = new Lightpick({
                    field: document.getElementById("datepicker_user_report"),
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

        var getUserSubsRevenueReport = function (page) {
            $scope.labels = [];
            var param_data = {};
            param_data.accessToken = constants.ACCESSTOKEN;
            param_data.sectionId = 0;
            param_data.is_download = 0;
            param_data.offset = $scope.skip;
            param_data.limit = $scope.limit;
            param_data.search = $scope.filter.search;
            param_data.month_filter = $scope.filter.month_filter;
            $scope.dataLoaded = false;
            services.POST_DATA(param_data, API.USER_SUBSCRIPTION_REVENUE_REPORT, function (response) {
                $scope.count = response.data.count;
                $scope.subscriptions = response.data.data;
                $scope.dataLoaded = true;
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                generateGraph(response.data.graph);
            });
        };
        getUserSubsRevenueReport(1);

        $scope.filterData = function () {
            getUserSubsRevenueReport(1);
        }

        $scope.resetFilter = function () {
            $window.location.reload();
        };

        $scope.setPage = function (page) {
            $scope.currentPage = page;
            $scope.skip = $scope.limit * (page - 1);
            getUserSubsRevenueReport(page);
        }

        $scope.sortBy = function (col) {
            $scope.skip = 0;
            if ($scope.order_by == col) {
                $scope.is_desc = +(!$scope.is_desc);
            } else {
                $scope.is_desc = 1;
            }
            $scope.order_by = col;
            getUserSubsRevenueReport(1);
        }

        $scope.search = function (keyEvent) {
            if (keyEvent.which === 13) {
                $scope.search = keyEvent.target.value;
                $scope.skip = 0;
                getUserSubsRevenueReport(1);
            }
        }

        $scope.downloadCSV = function () {
            var param_data = {};
            param_data.accessToken = constants.ACCESSTOKEN;
            param_data.sectionId = 0;
            param_data.offset = $scope.skip;
            param_data.limit = $scope.limit;
            param_data.is_download = 1;
            services.POST_DATA(param_data, API.USER_SUBSCRIPTION_REVENUE_REPORT, function (response) {
                let dwnld_link = response.data.csvFileLink;
                services.DOWNLOAD_CSV(dwnld_link, 'subscription');
            });
        };







        var chartColorSets = function () {
            let backgroundColor = [];
            let hoverBackgroundColor = [];
            let hoverBorderColor = [];

            for (var d = 0; d <= (moment($scope.endDate)).diff(moment($scope.startDate), 'days'); d++) {
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
            $scope.totalRevenue = [];
            data.forEach((element, index) => {
                $scope.labels.unshift(element.month);
                $scope.totalRevenue.unshift(element.total_revenue);
            });

            $scope.no_revenue = $scope.totalRevenue.find(data => data) ? false : true;
            $scope.totalRevenue = $scope.totalRevenue.reverse();
            $scope.labels = $scope.labels.reverse();
        }


    }]);