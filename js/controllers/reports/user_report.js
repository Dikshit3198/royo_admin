Royo.controller('userReportsCtrl', ['$scope', '$rootScope', 'services', 'pagerService', '$translate', '$window', 'API', 'factories', 'constants',
  function ($scope, $rootScope, services, pagerService, $translate, $window, API, factories, constants) {

    $rootScope.active_report_tab = 1;
    $scope.skip = 0;
    $scope.limit = 20;
    $scope.filter = {
      id: '',
      startDate: '',
      endDate: ''
    }
    $scope.users = [];
    $scope.count = 0;
    $scope.TotalOrders = 0;
    $scope.dataLoaded = false;
    $scope.order_by = null;
    $scope.is_desc = null;
    $scope.notification_open = false;
    $scope.notification = { msg: '' };
    $scope.checkall = false;
    $scope.selected_users = [];
    $scope.selected_emails = [];
    $scope.message = '';
    $scope.message_type = 1;
    $scope.email = {
      body: '',
      subject: ''
    };

    $scope.is_abn_business = $rootScope.is_abn_business;

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

    var getuserData = function (page) {
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.sectionId = 45;
      param_data.offset = $scope.skip;
      param_data.limit = $scope.limit;
      param_data.id = $scope.filter.id;
      param_data.startDate = $scope.filter.startDate;
      param_data.endDate = $scope.filter.endDate;
      if ($scope.order_by && $scope.is_desc !== undefined && $scope.is_desc !== null) {
        param_data.order_by = $scope.order_by;
        param_data.is_desc = $scope.is_desc;
      }

      $scope.dataLoaded = false;
      services.POST_DATA(param_data, API.GET_USER_REPORT(), function (response) {
        $scope.count = response.data.count;
        $scope.users = response.data.user;
        $scope.TotalOrders = response.data.totalOrder
        $scope.dataLoaded = true;
        $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
      });
    };
    getuserData(1);

    $scope.filter = function () {
      getuserData(1);
    }

    $scope.resetFilter = function () {
      $window.location.reload();
    };

    $scope.setPage = function (page) {
      $scope.currentPage = page;
      $scope.skip = $scope.limit * (page - 1);
      getuserData(page);
    }

    $scope.sortBy = function (col) {
      $scope.skip = 0;
      if ($scope.order_by == col) {
        $scope.is_desc = +(!$scope.is_desc);
      } else {
        $scope.is_desc = 1;
      }
      $scope.order_by = col;
      getuserData(1);
    }

    $scope.check = function (user) {
      if ($scope.selected_users.includes(user.id)) {
        $scope.selected_users.splice($scope.selected_users.indexOf(user.id), 1);
        $scope.selected_emails.splice($scope.selected_emails.indexOf(user.email), 1);
      } else {
        $scope.selected_users.push(user.id);
        $scope.selected_emails.push(user.email);
      }
    }

    $scope.checkAll = function () {
      $scope.checkall = !$scope.checkall;
      $scope.selected_users = [];
      $scope.selected_emails = [];
      if ($scope.checkall) {
        $scope.users.forEach(user => {
          $scope.selected_users.push(user.id);
          $scope.selected_emails.push(user.email);
        });
      }
    }

    $scope.changeMsgType = function (msgType) {
      $scope.message_type = msgType;
    }


    $scope.sendNotificationOrEmail = function () {
      console.log($scope.message_type)
      if ($scope.selected_users.length == 0) {
        factories.invalidDataPop($translate.instant('Please select users'))
        return;
      } else if ($scope.message_type == 1 && $scope.notification.msg == '') {
        factories.invalidDataPop($translate.instant(`Please enter the notification message`));
        return;
      } else if ($scope.message_type == 2 && $scope.email.subject == '') {
        factories.invalidDataPop($translate.instant("Please enter the subject"));
        return;
      } else if ($scope.message_type == 2 && $scope.email.body == '') {
        factories.invalidDataPop($translate.instant("Please enter the email body"));
        return;
      }

      let userTypeArr = ($scope.selected_users.slice()).fill(0);

      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.sectionId = 52;
      param_data.ids = $scope.selected_users.join('#');

      if ($scope.message_type == 1) {
        param_data.content = $scope.notification.msg;
        param_data.userType = userTypeArr.join('#');
        services.POST_DATA(param_data, API.SEND_PUSH, function (response) {
          $scope.message = `${$translate.instant('Notification has been sent successfully')}`;
          services.SUCCESS_MODAL(true);
        });
      } else {
        param_data.content = $scope.email.body;
        param_data.receiverType = userTypeArr.join('#');
        param_data.receiverEmail = $scope.selected_emails.join('#');
        param_data.subject = $scope.email.subject;
        services.POST_DATA(param_data, API.SEND_EMAIL, function (response) {
          $scope.message = `${$translate.instant('Email has been sent successfully')}`;
          services.SUCCESS_MODAL(true);
        });
      }
    }

    $scope.downloadCSV = function () {
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.sectionId = 45;
      param_data.offset = $scope.skip;
      param_data.limit = $scope.limit;
      param_data.id = $scope.filter.id;
      param_data.startDate = $scope.filter.startDate;
      param_data.endDate = $scope.filter.endDate;
      if ($scope.order_by && $scope.is_desc !== undefined && $scope.is_desc !== null) {
        param_data.order_by = $scope.order_by;
        param_data.is_desc = $scope.is_desc;
      }
      param_data.is_download = 1;
      services.POST_DATA(param_data, API.GET_USER_REPORT(), function (response) {
        let dwnld_link = response.data.csvFileLink;
        services.DOWNLOAD_CSV(dwnld_link, 'supplier');
      });
    };

    $scope.notificationOpen = function () {
      $scope.notification_open = !$scope.notification_open;
    }

  }]);