Royo.controller('SurveyMonkeyCtrl', ['$scope', 'services', '$stateParams', 'API', 'factories', 'pagerService', 'constants', '$rootScope',
    function ($scope, services, $stateParams, API, factories, pagerService, constants, $rootScope) {

        $scope.surveyList = [];
        $scope.message = '';
        $scope.dataLoaded = false;
        $scope.invalid_phone_no = false;
        $scope.count = 0;
        $scope.currentPage = 1;
        $scope.skip = 0;
        $scope.limit = 20;



        var getSurveyList = function (page) {
            $scope.dataLoaded = false;
            var params = {
                accessToken: $rootScope.survey_monkey_access_token
            }
            services.GET_DATA(params, API.GET_SURVEY_DET_LIST, function (response) {
                if (response) {
                    $scope.surveyList = response.data;
                    $scope.count = response.data.total;
                }
                $scope.dataLoaded = true;
                // $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
            });
        }

        getSurveyList(1);

        $scope.setPage = function (page) {
            $scope.currentPage = page;
            $scope.skip = $scope.limit * (page - 1);
            getSurveyList(page);
        }
    }]);