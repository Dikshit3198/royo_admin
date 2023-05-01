Royo.controller('SuggestionsCtrl', ['$scope', '$rootScope', 'constants', 'services', 'API', 'pagerService', 'factories',
    function ($scope, $rootScope, constants, services, API, pagerService, factories) {

        $scope.suggestions = [];
        $scope.count = 0;
        $scope.skip = 0;
        $scope.limit = 20;
        $scope.currentPage = 1;
        $scope.dataLoaded = false;
        $scope.is_edit = false;
        $scope.suggestion = {
            authSectionId: 30,
            accessToken: localStorage.getItem('RoyoAccessToken'),
            name: ''
        }

        var getSuggestions = function (page) {
            let params = {
                offset: $scope.skip,
                limit: $scope.limit
            }
            $scope.dataLoaded = false;
            services.GET_DATA(params, API.LIST_SUGGESTIONS, function (response) {
                if (response) {
                    $scope.suggestions = response.data.data;
                    $scope.count = response.data.count;
                }
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                $scope.dataLoaded = true;
            });
        }
        getSuggestions(1);

        $scope.refresh = function () {
            $scope.count = 0;
            $scope.skip = 0;
            $scope.currentPage = 1;
            getSuggestions(1);
        }

        $scope.setPage = function (page) {
            if ($scope.currentPage !== page) {
                $scope.currentPage = page;
                $scope.skip = $scope.limit * (page - 1);
                getSuggestions(page);
            }
        }

        $scope.addModal = function () {
            $scope.is_edit = false;
            $("#addSuggestion").modal('show');
        }

        $scope.editSuggestion = function (suggestion) {
            $scope.is_edit = true;
            $scope.selectedSuggestion = suggestion;
            $scope.suggestion.name = suggestion.name;
            $("#addSuggestion").modal('show');
        }

        var afterSubmit = function () {
            $scope.is_edit = false;
            $scope.message = `Suggestion Has Been ${$scope.is_edit ? 'Updated' : 'Added'} Successfully`;
            services.SUCCESS_MODAL(true)
            $scope.refresh();
            $("#addSuggestion").modal('hide');
        }

        $scope.submitAdd = function (addSuggestionForm) {
            if (addSuggestionForm.$submitted && addSuggestionForm.$invalid) return;

            if ($scope.is_edit) {
                let params = {
                    ...$scope.suggestion,
                    id: $scope.selectedSuggestion.id,
                }
                services.POST_DATA(params, API.EDIT_SUGGESTIONS, function (response) {
                    afterSubmit();
                });
            } else {
                services.POST_DATA($scope.suggestion, API.ADD_SUGGESTIONS, function (response) {
                    afterSubmit();
                });
            }
        }

        $scope.deleteBlockSuggestion = function (suggestion, status, text) {
            services.CONFIRM(`You want to ${text} this suggestion`,
                function (isConfirm) {
                    if (isConfirm) {
                        let param_data = {
                            id: suggestion.id,
                            status: status,
                            authSectionId: 30,
                            accessToken: localStorage.getItem('RoyoAccessToken')
                        };
                        services.POST_DATA(param_data, API.DELETE_BLOCK_SUGGESTIONS, function (response) {
                            $scope.message = 'Suggestion status updated';
                            services.SUCCESS_MODAL(true);
                            $scope.refresh();
                        });
                    }
                });
        }

    }]);