Royo.controller('AccountCtrl', ['$scope', '$rootScope', 'factories',
  function ($scope, $rootScope, factories) {
    $rootScope.active_account_tab = factories.getSettings().screenFlow[0].is_single_vendor == 1 ? 3 : 1;
    $rootScope.remove_service_fee_supplier = factories.getSettings().key_value.remove_service_fee_supplier ? JSON.parse(factories.getSettings().key_value.remove_service_fee_supplier) : 0;
    $rootScope.remove_delivery_charge_supplier = factories.getSettings().key_value.remove_delivery_charge_supplier ? JSON.parse(factories.getSettings().key_value.remove_delivery_charge_supplier) : 0;
    $rootScope.enable_free_delivery_account_filter = factories.getSettings().key_value.enable_free_delivery_account_filter ? JSON.parse(factories.getSettings().key_value.enable_free_delivery_account_filter) : 0;
    
    $scope.changeTab = function(tab) {
      $rootScope.active_account_tab = tab;
    }
  }]);