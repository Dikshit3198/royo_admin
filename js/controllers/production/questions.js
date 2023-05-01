Royo.controller('QuestionsCtrl', ['$scope', '$rootScope', 'factories', 'services', 'constants', '$state', 'API', '$stateParams',
    function ($scope, $rootScope, factories, services, constants, $state, API, $stateParams) {

        $scope.active_index = 0;
        $scope.message = '';
        $scope.questions = [
            {
                question: "",
                question_ar: "a",
                questionTypeSelection: 1,
                optionsList: [
                    {
                        optionLabel: "",
                        valueChargeType: 1,
                        flatValue: 0,
                        percentageValue: 0,
                        optionLabel_ar: "a"
                    }
                ]
            }
        ];

        var getQuestions = function () {
            services.GET_DATA({ categoryId: $stateParams.cat_id }, API.GET_ALL_QUESTIONS_DETAIL(), function (response) {
                if (response && (response.data).questionList.length) {
                    $scope.questions = (response.data).questionList;
                    $scope.questions.forEach(question => {
                        delete question.categoryId;
                        question.optionsList.forEach(option => {
                            delete option.questionId;
                            delete option.categoryId;
                        });
                    });
                }
            });
        }
        getQuestions();

        $scope.addQuestion = function () {
            $scope.questions.push({
                question: "",
                question_ar: "",
                questionTypeSelection: 1,
                optionsList: [
                    {
                        optionLabel: "",
                        optionLabel_ar: "a",
                        valueChargeType: 1,
                        flatValue: 0,
                        percentageValue: 0
                    }
                ]
            });
            $scope.active_index = $scope.questions.length - 1;

            if (document.querySelector(".show")) {
                setTimeout(() => {
                    window.scrollTo(0, document.querySelector(".show").scrollHeight);
                }, 200);
            }
        }

        $scope.addOption = function (parentIndex) {
            $scope.questions[parentIndex].optionsList.push({
                optionLabel: "",
                optionLabel_ar: "a",
                valueChargeType: 1,
                flatValue: 0,
                percentageValue: 0
            });
        }

        $scope.deleteOption = function (parentIndex, childIndex) {
            ($scope.questions[parentIndex].optionsList).splice(childIndex, 1);
        }

        var afterRemove = function () {
            $scope.message = 'Question removed successfully';
            services.SUCCESS_MODAL(true);
        }

        $scope.removeQuestion = function (parentIndex) {
            services.CONFIRM(`you want to remove this question`,
                function (isConfirm) {
                    if (isConfirm) {
                        if (!!$scope.questions[parentIndex].questionId) {
                            let params_data = {
                                accessToken: constants.ACCESSTOKEN,
                                questions: [$scope.questions[parentIndex].questionId]
                            }
                            services.POST_DATA(params_data, API.DELETE_QUESTION(), function (response) {
                                afterRemove();
                                $scope.questions.splice(parentIndex, 1);
                            });
                        } else {
                            afterRemove();
                            $scope.$apply(function () {
                                $scope.questions.splice(parentIndex, 1);
                            });
                        }
                    }
                });
        }

        $scope.submitQuestions = function (questionsForm) {
            if (questionsForm.$submitted && questionsForm.$invalid) return;
            let params_data = {
                accessToken: constants.ACCESSTOKEN,
                categoryId: $stateParams.cat_id,
                questions: $scope.questions
            }
            services.POST_DATA(params_data, API.ADD_EDIT_QUESTIONS(), function (response) {
                getQuestions();
                $scope.message = 'Questions updated successfully';
                services.SUCCESS_MODAL(true);
            });
        }

    }]);