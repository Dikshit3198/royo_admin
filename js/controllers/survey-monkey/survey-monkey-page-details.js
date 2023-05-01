Royo.controller('SurveyMonkeyPageDetailsCtrl', ['$scope', 'services', '$stateParams', 'API', 'factories', 'pagerService', 'constants', '$rootScope',
    function ($scope, services, $stateParams, API, factories, pagerService, constants, $rootScope) {

        $scope.surveyPageDetails = {};
        $scope.message = '';
        $scope.dataLoaded = false;
        $scope.pageId = $stateParams.pageId;
        $scope.surveyId = $stateParams.surveyId

        var getSurveyDetails = function () {
            $scope.dataLoaded = false;
            var params = {
                accessToken: 'g8ejEhgrp-f7gWs7XCicD0AgwweZ1276CeGdSKbSN-oaZczQyobFbA2lXt0.IA6ojLgh7upGH8-jbowEVmCJm54n780p2y0Jzq9n3w8lOni8gQOCfX4raExid2u2G-X0',
                id: $scope.surveyId,
                page_id: $scope.pageId
            }
            services.GET_DATA(params, API.GET_SURVEY_PAGES, function (response) {
                if (response) {
                    $scope.surveyPageDetails = response.data;
                }
                $scope.dataLoaded = true;
            });
        }
        getSurveyDetails();

    }]);