Royo.controller('SurveyMonkeyPagesCtrl', ['$scope', 'services', '$stateParams', 'API', 'factories', 'pagerService', 'constants', '$rootScope',
    function ($scope, services, $stateParams, API, factories, pagerService, constants, $rootScope) {

        $scope.surveyPages = [];
        $scope.surveyId = $stateParams.surveyId;
        $scope.message = '';
        $scope.dataLoaded = false;
        $scope.invalid_phone_no = false;
        $scope.count = 0;
        $scope.currentPage = 1;
        $scope.skip = 0;
        $scope.limit = 20;

        var getSurveyPageList = function (page) {
            $scope.dataLoaded = false;
            var params = {
                accessToken: 'g8ejEhgrp-f7gWs7XCicD0AgwweZ1276CeGdSKbSN-oaZczQyobFbA2lXt0.IA6ojLgh7upGH8-jbowEVmCJm54n780p2y0Jzq9n3w8lOni8gQOCfX4raExid2u2G-X0',
                id: $scope.surveyId
            }
            services.GET_DATA(params, API.GET_SURVEY_PAGES, function (response) {
                if (response) {
                    $scope.surveyPages = response.data;
                    $scope.count = response.data.length;
                }
                $scope.dataLoaded = true;
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
            });
        }

        getSurveyPageList(1);

        $scope.setPage = function (page) {
            $scope.currentPage = page;
            $scope.skip = $scope.limit * (page - 1);
            getSurveyPageList(page);
        }
    }]);