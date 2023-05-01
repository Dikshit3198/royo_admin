Royo.controller('FeedbackCtrl', ['$scope', '$rootScope', 'constants', 'services', 'API', 'pagerService', 'factories',
    function ($scope, $rootScope, constants, services, API, pagerService, factories) {

        $scope.selectedType = 'USER';
        $scope.feedbackList = [];
        $scope.count = 0;
        $scope.skip = 0;
        $scope.limit = 20;
        $scope.currentPage = 1;
        $scope.dataLoaded = false;

        $scope.supplierFeedback = {
            name: '',
            email_id: '',
            phone: '',
            description: '',
            new_suggestions: ''
        };
        $scope.suggestions = [];

        var getFeedback = function (page) {
            let params = {
                offset: $scope.skip,
                limit: $scope.limit,
                type: $scope.selectedType
            }
            $scope.dataLoaded = false;
            services.GET_DATA(params, API.GET_FEEDBACK, function (response) {
                if (response) {
                    $scope.feedbackList = response.data.data;
                    $scope.count = response.data.count;
                    $scope.feedbackList.forEach(feedback => {
                        feedback['suggestions'] = feedback.suggestions_assigned ? [...new Set(feedback.suggestions_assigned.split(','))] : [];
                    });
                }
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                $scope.dataLoaded = true;
            });
        }
        getFeedback(1);

        $scope.refresh = function () {
            $scope.count = 0;
            $scope.skip = 0;
            $scope.currentPage = 1;
            getFeedback(1);
        }

        $scope.changeTab = function (type) {
            $scope.selectedType = type;
            $scope.refresh();
        }

        $scope.setPage = function (page) {
            if ($scope.currentPage !== page) {
                $scope.currentPage = page;
                $scope.skip = $scope.limit * (page - 1);
                getFeedback(page);
            }
        }

        $scope.deleteFeedback = function (feedback) {
            services.CONFIRM(`You want to delete this feedback`,
                function (isConfirm) {
                    if (isConfirm) {
                        let param_data = {
                            authSectionId: 30,
                            accessToken: localStorage.getItem('RoyoAccessToken'),
                            id: feedback.id
                        };                        
                        services.POST_DATA(param_data, API.DELETE_FEEDBACK, function (response) {
                            $scope.message = 'Feedback has been deleted succeffully';
                            services.SUCCESS_MODAL(true);
                            $scope.refresh();
                        });
                    }
                });
        }

        $scope.approveSuggestions = function(feedback, status) {
            services.CONFIRM(`You want to ${status == 1 ? 'approve' : 'decline'} suggestions`,
            function (isConfirm) {
                if (isConfirm) {
                    let param_data = {
                        name: feedback.new_suggestions,
                        id: feedback.id,
                        status: status,
                        authSectionId: 30,
                        accessToken: localStorage.getItem('RoyoAccessToken')
                    };
                    param_data.id = feedback.id;
                    services.POST_DATA(param_data, API.APPROVE_SUGGESTIONS, function (response) {
                        $scope.message = `Suggestion has been ${status == 1 ? 'approved' : 'declined'} succeffully`;
                        services.SUCCESS_MODAL(true);
                        $scope.refresh();
                    });
                }
            });
        }

        $scope.selectSuggestion = function(suggestion) {
            suggestion.checked = !suggestion.checked;
        }

        var getSuggestions = function() {
            let params = {
                offset: 0,
                limit: 100
            }
            services.GET_DATA(params, API.GET_USER_SUGGESTIONS, function (response) {
                $scope.suggestions = response.data.data;
                $scope.suggestions.forEach(el => {
                    el['checked'] = false;
                });
            });
        }
        getSuggestions();

        $scope.addFeedback = function(addFeedbackForm) {
            if (addFeedbackForm.$submitted && addFeedbackForm.$invalid) return;
            let assigned_suggestions = [];
            $scope.suggestions.forEach(el => {
                if(el.checked) {
                    assigned_suggestions.push(el.name);
                }
            });
            let param_data = {
                name: $scope.supplierFeedback.name,
                email_id: $scope.supplierFeedback.email_id,
                phone: $scope.supplierFeedback.phone,
                description: $scope.supplierFeedback.description,
                from_user_id: localStorage.getItem('supplier_id'), 
                from_user_type: 'SUPPlIER',  
                suggestions_assigned: assigned_suggestions.length ? assigned_suggestions.join(',') : '',
                new_suggestions: $scope.supplierFeedback.new_suggestions
            }
            services.POST_DATA(param_data, API.SUBMIT_SUPPLIER_FEEDBACK, function (response) {
                $scope.message = `Feedback Submitted Successfully`;
                services.SUCCESS_MODAL(true);
            });
        }

        $scope.selectedFeedback = {
            id: '',
            suggestions: ''
        };
        $scope.selectFeedbackToEdit = function(feedback) {
            $scope.selectedFeedback.id = feedback.id;
            $scope.selectedFeedback.suggestions = feedback.new_suggestions;
            $("#editSuggestion").modal('show');
        }

        $scope.editSuggestion = function(editSuggestionForm) {
            if (editSuggestionForm.$submitted && editSuggestionForm.$invalid) return;
            let param_data = {
                id:  $scope.selectedFeedback.id,
                new_suggestion:  $scope.selectedFeedback.suggestions,
                accessToken: localStorage.getItem('RoyoAccessToken'),
                authSectionId: 30
            }
            services.POST_DATA(param_data, API.EDIT_FEEDBACK_SUGGESTION, function (response) {
                $("#editSuggestion").modal('hide');
                $scope.message = `Suggestions Updated Successfully`;
                services.SUCCESS_MODAL(true);
                getFeedback($scope.currentPage);
            });
        }

    }]);