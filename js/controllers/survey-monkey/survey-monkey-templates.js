Royo.controller('SurveyMonkeyTemplatesCtrl', ['$scope', 'services', '$stateParams', 'API', 'factories', 'pagerService', 'constants', '$rootScope',
    function ($scope, services, $stateParams, API, factories, pagerService, constants, $rootScope) {

        $scope.surveyCategories = [];
        $scope.selectedCategory = "";
        $scope.surveyTemplates = [];
        $scope.message = '';
        $scope.dataLoaded = false;
        $scope.invalid_phone_no = false;
        $scope.count = 0;
        $scope.currentPage = 1;
        $scope.skip = 0;
        $scope.limit = 20;

        $scope.setPage = function (page) {
            $scope.currentPage = page;
            $scope.skip = $scope.limit * (page - 1);
            getSurveyTemplates(page);
        }

        var getSurveyCatList = function () {
            $scope.dataLoaded = false;
            var params = {
                accessToken: 'g8ejEhgrp-f7gWs7XCicD0AgwweZ1276CeGdSKbSN-oaZczQyobFbA2lXt0.IA6ojLgh7upGH8-jbowEVmCJm54n780p2y0Jzq9n3w8lOni8gQOCfX4raExid2u2G-X0'
            }
            services.GET_DATA(params, API.GET_SURVEY_CATEGORIES, function (response) {
                if (response) {
                    $scope.surveyCategories = response.data;
                    $scope.count = response.data.length;
                }
                $scope.dataLoaded = true;
            });
        }
        getSurveyCatList();

        var getSurveyTemplates = function (page) {
            $scope.dataLoaded = false;
            var params = {
                accessToken: 'g8ejEhgrp-f7gWs7XCicD0AgwweZ1276CeGdSKbSN-oaZczQyobFbA2lXt0.IA6ojLgh7upGH8-jbowEVmCJm54n780p2y0Jzq9n3w8lOni8gQOCfX4raExid2u2G-X0'
            }
            services.GET_DATA(params, API.GET_SURVEY_TEMPLATES, function (response) {
                if (response) {
                    $scope.surveyTemplates = response.data;
                    $scope.count = response.data.length;
                }
                $scope.dataLoaded = true;
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
            });
        }
        getSurveyTemplates(1);
        $scope.onSelectCategory = function (cat) {
            
        }
    }]);