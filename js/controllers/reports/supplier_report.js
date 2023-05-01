Royo.controller('supplierReportsCtrl', ['$scope', '$rootScope', 'services', 'pagerService', 'API', '$window', 'constants',
  function ($scope, $rootScope, services, pagerService, API, $window, constants) {

    $rootScope.active_report_tab = 3;
    $scope.skip = 0;
    $scope.limit = 20;
    $scope.filter = {
      email: '',
      product: '',
      startDate: '',
      endDate: ''
    }
    $scope.suppliers = [];
    $scope.count = 0;
    $scope.order_by = null;
    $scope.is_desc = null;
    $scope.dataLoaded = false;
    $scope.Total_order_delivered = 0;
    $scope.Total_revenue = 0;

    var datepicker = function () {
      setTimeout(() => {
        var picker = new Lightpick({
          field: document.getElementById("datepicker_supplier_report"),
          singleDate: false,
          onSelect: function (start, end) {
            if (start && end || start) {
              $scope.filter.startDate = start.format('YYYY-MM-DD');
              $scope.filter.endDate = end.format('YYYY-MM-DD');
            }
          }
        });
      }, 500);
    }
    datepicker();

    var getReportData = function (page) {

      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.sectionId = 45;
      param_data.offset = $scope.skip;
      param_data.limit = $scope.limit;
      param_data.email = $scope.filter.email;
      param_data.product = $scope.filter.product;
      param_data.startDate = $scope.filter.startDate;
      param_data.endDate = $scope.filter.endDate;
      if ($scope.order_by && $scope.is_desc !== undefined && $scope.is_desc !== null) {
        param_data.order_by = $scope.order_by;
        param_data.is_desc = $scope.is_desc;
      }

      $scope.dataLoaded = false;
      $scope.suppliers = [];
      services.POST_DATA(param_data, API.SUPPLIER_REPORT, function (response) {
        if(response) {
          $scope.suppliers = response.data.supplier;
          $scope.count = response.data.count;
          $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
          $scope.Total_order_delivered = response.data.total_no_orders;
          $scope.Total_revenue = response.data.total_revenue;
        }
        $scope.dataLoaded = true;
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

    $scope.downloadCSV = function () {
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.sectionId = 45;
      param_data.offset = $scope.skip;
      param_data.limit = $scope.limit;
      param_data.email = $scope.filter.email;
      param_data.product = $scope.filter.product;
      param_data.startDate = $scope.filter.startDate;
      param_data.endDate = $scope.filter.endDate;
      if ($scope.order_by && $scope.is_desc !== undefined && $scope.is_desc !== null) {
        param_data.order_by = $scope.order_by;
        param_data.is_desc = $scope.is_desc;
      }
      param_data.is_download = 1;
      services.POST_DATA(param_data, API.SUPPLIER_REPORT, function (response) {
        let dwnld_link = response.data.csvFileLink;
        services.DOWNLOAD_CSV(dwnld_link, 'supplier');
      });
    };

  }]);
