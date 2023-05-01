Royo.controller('agentReportCtrl', ['$scope', '$rootScope', 'services', 'pagerService', 'API', 'constants', '$window', 'factories',
  function ($scope, $rootScope, services, pagerService, API, constants, $window, factories) {

    $rootScope.active_report_tab = 4;
    $scope.skip = 0;
    $scope.limit = 20;
    $scope.filter = {
      startDate: '',
      endDate: '',
      supplier_id: 0,
      search: ''
    }
    $scope.suppliers = [];
    $scope.count = 0;
    $scope.dataLoaded = false;
    $scope.selected_supplier;
    $scope.order_by = null;
    $scope.is_desc = null;
    $scope.agents = [];
    $scope.is_admin = 0;
    $scope.Total_Orders = 0;
    $scope.Total_revenue = 0;

    var datepicker = function () {
      setTimeout(() => {
        var picker = new Lightpick({
          field: document.getElementById("datepicker_supplier_report"),
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

    var getSuppliers = function () {
      let params = {
        limit: 0,
        offset: 0,
        is_active: 1,
        search: '',
        is_desc: 0,
        order_by: 0
      }
            
      if(!!localStorage.getItem('data_country')){
        let country_data = localStorage.getItem('data_country').split(',');
        params.country_code = country_data[0];
        params.country_code_type = country_data[1];
      }
      
      services.GET_DATA(params, API.SUPPLIER_LIST, function (response) {
        $scope.suppliers = response.data.suppliersList;
      });
    }
    if ($rootScope.profile === 'ADMIN') {
      getSuppliers();
    }

    $scope.changeSupplier = function (selected_supplier) {
      $scope.filter.supplier_id = selected_supplier ? selected_supplier.id : 0;
    }

    var getReportData = function (page) {
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.sectionId = 45;
      param_data.offset = $scope.skip;
      param_data.limit = $scope.limit;
      param_data.startDate = $scope.filter.startDate;
      param_data.endDate = $scope.filter.endDate;
      param_data.search = ($scope.filter.search).trim() ? $scope.filter.search : '';
      if ($rootScope.profile === 'ADMIN' && $scope.filter.supplier_id) {
        param_data.supplierId = $scope.filter.supplier_id
      }
      if ($scope.order_by && $scope.is_desc !== undefined && $scope.is_desc !== null) {
        param_data.order_by = $scope.order_by;
        param_data.is_desc = $scope.is_desc;
      }
      param_data.is_admin = $scope.is_admin;
      $scope.dataLoaded = false;

      services.POST_DATA(param_data, API.GET_AGENT_REPORT(), function (response) {
        $scope.agents = response.data.agents;
        $scope.count = response.data.count;
        $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
        $scope.dataLoaded = true;
        $scope.Total_Orders = response.data.totalorder;
        $scope.Total_revenue = response.data.totalrevenue;
      });
    };
    getReportData(1);

    $scope.resetFilter = function () {
      $window.location.reload();
    };

    $scope.selectFilter = function () {
      getReportData(1);
    };

    $scope.setPage = function (page) {
      $scope.currentPage = page;
      $scope.skip = $scope.limit * (page - 1);
      getReportData(page);
    }

    $scope.sortBy = function (col) {
      $scope.skip = 0;
      if ($scope.order_by == col) {
        $scope.is_desc = +(!$scope.is_desc);
      } else {
        $scope.is_desc = 1;
      }
      $scope.order_by = col;
      getReportData(1);
    }

    $scope.toggleAdmin = function () {
      $scope.is_admin = +(!$scope.is_admin);
      if ($scope.is_admin) {
        $scope.filter.supplier_id = 0;
      }
    }

    $scope.downloadCSV = function () {
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.sectionId = 45;
      param_data.offset = $scope.skip;
      param_data.limit = $scope.limit;
      param_data.startDate = $scope.filter.startDate;
      param_data.endDate = $scope.filter.endDate;
      param_data.search = ($scope.filter.search).trim() ? $scope.filter.search : '';
      if ($rootScope.profile === 'ADMIN' && $scope.filter.supplier_id) {
        param_data.supplierId = $scope.filter.supplier_id
      }
      if ($scope.order_by && $scope.is_desc !== undefined && $scope.is_desc !== null) {
        param_data.order_by = $scope.order_by;
        param_data.is_desc = $scope.is_desc;
      }
      param_data.is_admin = $scope.is_admin;
      param_data.is_download = 1;
      services.POST_DATA(param_data, API.GET_AGENT_REPORT(), function (response) {
        let dwnld_link = response.data.csvFileLink;
        services.DOWNLOAD_CSV(dwnld_link, 'agents');
      });
    };

  }]);
