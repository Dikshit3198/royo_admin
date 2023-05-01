Royo.controller('KpiCtrl', ['$scope', 'services', '$stateParams', '$state', 'API', '$rootScope', 'factories', 'constants', '$interval',
    function ($scope, services, $stateParams, $state, API, $rootScope, factories, constants, $interval) {

        $scope.totalOrders = [];
        $scope.avarage_no_of_Deliveries_per_Hour = 0;
        $scope.total_average_duration_per_order = 0;
        $scope.Percentage_of_Driver_Is_On_Order = 0;
        $scope.Percentage_of_Driver_Is_On_Idle = 0;
        $scope.avarage_order_Duration = [];
        $scope.Driver_Is_on_order = [];
        $scope.end_date = moment().format("YYYY-MM-DD");
        $scope.start_date = moment($scope.end_date).subtract(6, 'days').format("YYYY-MM-DD");
        $scope.totalOrders = [];
        $scope.totalRevenue = [];
        $scope.totalUsers = [];
        $scope.is_data_loaded = false;
        $scope.selectedProducts = [];
        $scope.no_orders = true;
        $scope.no_revenue = true;
        $scope.no_users = true;
        $scope.no_avarge_duration = true;
        $scope.no_driver = true;

        $scope.zero_value = 0
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
            total_active_driver_by_date : 0,
            total_avarage_order_Duration_by_date : 0
          };

        $scope.filter = {
            month_filter: '',
            year_filter: ''
        }

        let current_year = new Date().getFullYear();
        $scope.year_array = [];
        for (let i = 0; i < 10; i++) {
            $scope.year_array.push(current_year - 2 + i);
        }

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
            if (!$scope.supplier_id) {
                $state.go(route, params);
            }
        }

        var chartColorSets = function () {
            let backgroundColor = [];
            let hoverBackgroundColor = [];
            let hoverBorderColor = [];


            let background_2_Color = [];
            let hoverBackground_2_Color = [];
            let hoverBorder_2_Color = [];

            for (var d = 0; d <= (moment($scope.end_date)).diff(moment($scope.start_date), 'days'); d++) {
                backgroundColor.push($rootScope.primary_color);
                hoverBackgroundColor.push($rootScope.primary_color);
                hoverBorderColor.push($rootScope.primary_color);

                let color = $rootScope.enable_second_theme_color == 1 && $rootScope.theme_second_color
                    ? $rootScope.theme_second_color : $rootScope.primary_color;
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
            $scope.Driver_Is_on_order = [];
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

                if ($rootScope.is_single_vendor == 1) {
                    param_data.supplier_id = $rootScope.single_vendor_id;
                }

            } else if ($rootScope.profile === 'SUPPLIER' || $rootScope.profile === 'BRANCH') {

                param_data.supplier_id = $rootScope.active_supplier_id;
            }
            $scope.is_data_loaded = false;
            if ($scope.filter.month_filter) {
                param_data['month_filter'] = $scope.filter.month_filter;
                param_data['year_filter'] = $scope.filter.year_filter ? $scope.filter.year_filter : current_year;
            }

            services.GET_DATA(param_data, API.KPI_DETAILS, function (data) {
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
                        total_active_driver_by_date : (dash.totalActiveDriverByDate && dash.totalActiveDriverByDate[0]) ? dash.totalActiveDriverByDate[0].total : 0,
                        total_avarage_order_Duration_by_date : (dash.totalAverageOrderDurationbyDate  && dash.totalAverageOrderDurationbyDate[0]) ? dash.totalAverageOrderDurationbyDate[0].total :0 
                    };
                    $scope.total_average_duration_per_order = (dash.totalAverageOrderDuration[0]) ? dash.totalAverageOrderDuration[0].average_duration_per_order : 0
                    if (dash.averageOrderDuration.length > 0) {
                        let weekly_orders = dash.averageOrderDuration.map(item => item.total_delivered_order).reduce((prev, next) => prev + next);
                        $scope.avarage_no_of_Deliveries_per_Hour = 7 / weekly_orders;
                    }

                         let driverOnOrder = dash.totalDriverOnOrder[0] ? dash.totalDriverOnOrder[0].total : 0 

                         let totalActiveDriver = dash.totalActiveDriverByDate[0] ? dash.totalActiveDriverByDate[0].total : 0
 
                         if(driverOnOrder && totalActiveDriver ){
                            $scope.Percentage_of_Driver_Is_On_Order = (driverOnOrder / totalActiveDriver ) * 100;

                           let driver_on_Idle =  totalActiveDriver - driverOnOrder ;
                            $scope.Percentage_of_Driver_Is_On_Idle = (driver_on_Idle / totalActiveDriver ) * 100;
                         }




                    if ($rootScope.show_total_user_order == 1) {
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

                        if ($rootScope.show_user_graph_dash == 1) {
                            let users = data.data.total_user.find(data => moment(data.created_at).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD"));

                            if (!!users) {
                                $scope.totalUsers.unshift((users.total_user).toFixed(2));
                            } else {
                                $scope.totalUsers.unshift(0);
                            }
                        }

                       
                        let averageOrderDuration = data.data.averageOrderDuration.find(data => moment(data.delivered_at).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD"));

                        if (!! averageOrderDuration) {
                            $scope.avarage_order_Duration.unshift((averageOrderDuration.total_delivered_order).toFixed(2));
                        } else {
                            $scope.avarage_order_Duration.unshift(0);
                        }

                        let percentageOfDriverOnIdle = data.data.driverOnOrder.find(data => moment (data.created_at).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD"));

                        if(!! percentageOfDriverOnIdle) {
                          $scope.Driver_Is_on_order.unshift((percentageOfDriverOnIdle.total_active_orders_agents).toFixed(2));     
                        } else {
                            $scope.Driver_Is_on_order.unshift(0);
                        }
                      
                    }

                    $scope.no_orders = $scope.totalOrders.find(data => data) ? false : true;
                    $scope.no_revenue = $scope.totalRevenue.find(data => data) ? false : true;
                    $scope.no_avarge_duration = $scope.avarage_order_Duration.find(data => data) ? false : true;
                    $scope.no_driver = $scope.Driver_Is_on_order.find(data => data) ? false : true;
                    $scope.totalOrders = $scope.totalOrders.reverse();
                    $scope.totalRevenue = $scope.totalRevenue.reverse();
                    $scope.labels = $scope.labels.reverse();

                    if ($rootScope.show_user_graph_dash == 1) {
                        $scope.totalUsers = $scope.totalUsers.reverse();
                    }
                   
                    $scope.avarage_order_Duration = $scope.avarage_order_Duration.reverse();

                    $scope.Driver_Is_on_order = $scope.Driver_Is_on_order.reverse();

                } 
                $scope.is_data_loaded = true;
            });
        }
        $scope.getGraphData();

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