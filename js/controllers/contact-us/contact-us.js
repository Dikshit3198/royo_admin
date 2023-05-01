Royo.controller('ContactUsCtrl', ['$scope', 'services', '$stateParams', '$state', 'API', '$rootScope', '$translate', 'factories', 'constants', '$interval',
    function ($scope, services, $stateParams, $state, API, $rootScope, $translate, factories, constants, $interval) {
        $scope.supplier = {
            email: '',
            subject: '',
            message: '',

        }

        $scope.client_info = {
            email: '',
            phone: '',
            country: '',
            country_code: ''
        }

        $scope.message = '';

        var init = function () {
            let onboarding_data = factories.getSettings().onboarding_data;
            $scope.client_info.email = onboarding_data.email;
            $scope.client_info.country = onboarding_data.country;
            $scope.client_info.phone = onboarding_data.phone_number;
            $scope.client_info.country_code = onboarding_data.country_code;
        }
        init();

        $scope.contactUs = function (addContactUsForm) {

            if (addContactUsForm.$submitted && addContactUsForm.$invalid) return;

            var param_data = {};
            // param_data.accessToken = constants.ACCESSTOKEN;
            param_data.receiverEmail = $scope.client_info.email;
            param_data.senderEmail = $scope.supplier.email;
            param_data.subject = $scope.supplier.subject;
            param_data.content = $scope.supplier.message;
            // param_data.receiverType = 1;
            // param_data.sectionId = 1;
            // param_data.ids = 1;
            services.POST_DATA(param_data, API.SEND_CONTACT_EMAIL, function (response) {
                $scope.message = `${$translate.instant('feedback Submitted Successfully')}`
                $scope.addContactUsForm.$setPristine(true);
                $scope.supplier = {
                    email: '',
                    subject: '',
                    message: '',
                }
                services.SUCCESS_MODAL(true);
            });

        }





        // $scope.setSupplierDetails = function (stepOneForm) {



    }]);