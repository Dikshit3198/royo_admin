Royo.controller('SurveyMonkeyDetailsCtrl', ['$scope', 'services', '$stateParams', 'API', 'factories', 'pagerService', 'constants', '$rootScope',
    function ($scope, services, $stateParams, API, factories, pagerService, constants, $rootScope) {

        $scope.surveyDetails = {};
        $scope.message = '';
        $scope.dataLoaded = false;
        $scope.surveyId = $stateParams.surveyId;

        var getSurveyDetails = function () {
            $scope.dataLoaded = false;
            var params = {
                accessToken: 'g8ejEhgrp-f7gWs7XCicD0AgwweZ1276CeGdSKbSN-oaZczQyobFbA2lXt0.IA6ojLgh7upGH8-jbowEVmCJm54n780p2y0Jzq9n3w8lOni8gQOCfX4raExid2u2G-X0',
                id: $scope.surveyId
            }
            services.GET_DATA(params, API.GET_SURVEY_DET_LIST, function (response) {
                if (response) {
                    $scope.surveyDetails = response.data;
                }
                $scope.dataLoaded = true;
            });
        }
        getSurveyDetails();

    }]);