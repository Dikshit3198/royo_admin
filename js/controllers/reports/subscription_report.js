Royo.controller('SubscriptionReportsCtrl', ['$scope', '$rootScope', 'services', 'pagerService', '$window', 'API', 'factories', 'constants',
  function ($scope, $rootScope, services, pagerService, $window, API, factories, constants) {

    $rootScope.active_report_tab = 6;
    $scope.skip = 0;
    $scope.limit = 20;
    $scope.filter = {
      startDate: '',
      endDate: '',
      search: ''
    }
    $scope.subscriptions = [];
    $scope.count = 0;
    $scope.dataLoaded = false;
    $scope.order_by = null;
    $scope.is_desc = null;

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

    var getSubscriptionReport = function (page) {
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.sectionId = 45;
      param_data.offset = $scope.skip;
      param_data.limit = $scope.limit;
    //   param_data.search = ($scope.filter.search).trim() ? $scope.filter.search : '';
    //   param_data.startDate = $scope.filter.startDate;
    //   param_data.endDate = $scope.filter.endDate;

      $scope.dataLoaded = false;
      services.POST_DATA(param_data, API.SUBSCRIPTION_REPORT, function (response) {
        $scope.count = response.data.count;
        $scope.subscriptions = response.data.user;
        $scope.dataLoaded = true;
        $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
      });
    };
    getSubscriptionReport(1);

    $scope.filter = function () {
      getSubscriptionReport(1);
    }

    $scope.resetFilter = function () {
      $window.location.reload();
    };

    $scope.setPage = function (page) {
      $scope.currentPage = page;
      $scope.skip = $scope.limit * (page - 1);
      getSubscriptionReport(page);
    }

    $scope.sortBy = function (col) {
      $scope.skip = 0;
      if ($scope.order_by == col) {
        $scope.is_desc = +(!$scope.is_desc);
      } else {
        $scope.is_desc = 1;
      }
      $scope.order_by = col;
      getSubscriptionReport(1);
    }

    $scope.search = function (keyEvent) {
        if (keyEvent.which === 13) {
          $scope.search = keyEvent.target.value;
          $scope.skip = 0;
          getSubscriptionReport(1);
        }
      }

    $scope.downloadCSV = function () {
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.sectionId = 45;
      param_data.offset = $scope.skip;
      param_data.limit = $scope.limit;
      param_data.is_download = 1;
      services.POST_DATA(param_data, API.SUBSCRIPTION_REPORT, function (response) {
        let dwnld_link = response.data.csvFileLink;
        services.DOWNLOAD_CSV(dwnld_link, 'subscription');
      });
    };

  }]);