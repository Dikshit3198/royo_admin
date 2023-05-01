Royo.controller('CustomPagesSetupCtrl', ['$scope', 'services', '$stateParams', '$state', 'API', '$rootScope', 'factories', 'constants', '$interval',
    function ($scope, services, $stateParams, $state, API, $rootScope, factories, constants, $interval) {
        console.log('sdfghjnm,.');
        $scope.tab = 1;
        $scope.tab = parseInt($state.params.type);
        // $rootScope.activeTab = 1;
        
        $scope.activateTab = function (tab) {
            $scope.tab = tab;
            // $rootScope.activeTab = 1;
            $rootScope.$broadcast('active_custom_page', tab);
        }

    }]);