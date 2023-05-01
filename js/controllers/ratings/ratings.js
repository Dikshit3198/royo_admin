Royo.controller('RatingsCtrl', ['$scope', '$rootScope', 'factories', '$state', '$location',
    function ($scope, $rootScope, factories, $state, $location) {

        $rootScope.active_rating_tab = 1;

        checkUrl = function () {
            let url = $state.current.url;
            switch (url) {
                case '/products':
                    $rootScope.active_rating_tab = 1;
                    break;

                case '/suppliers':
                    $rootScope.active_rating_tab = 2;
                    break;

                case '/agents':
                    $rootScope.active_rating_tab = 3;
                    break;

                default:
                    $rootScope.active_rating_tab = 1;
            }
        }

        checkUrl();

        $scope.changeTab = function (tab) {
            $rootScope.active_rating_tab = tab;
        }
    }]);
    