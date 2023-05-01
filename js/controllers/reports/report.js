Royo.controller('ReportsCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {

  if($rootScope.profile === 'SUPPLIER' || $rootScope.profile === 'BRANCH') {
    $rootScope.active_report_tab = 2;
  } else {
    $rootScope.active_report_tab = 1;
  }
}]);