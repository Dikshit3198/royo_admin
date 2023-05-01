Royo.controller('SupplierProfileSetupFourCtrl', ['$scope', '$rootScope', '$stateParams',
  function ($scope, $rootScope, $stateParams) {

    $scope.supplier_id = $stateParams.id;
    $rootScope.$broadcast('supplier_id', { supplier_id: $scope.supplier_id, tab: $stateParams.tab });
    $scope.reviews = [];
    $scope.dataLoaded = false;

    $scope.$on('supplier_data', getSupplierData);
    function getSupplierData($event, data) {
      if (!!data) {
        $scope.reviews = data.rating_review;
      }
      $scope.dataLoaded = true;
    }

  }]);