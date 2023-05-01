Royo.controller('PrivacyTermsCtrl', ['$scope', '$rootScope', 'services', 'factories', 'constants', 'API',
    function ($scope, $rootScope, services, factories, constants, API) {

        // $scope.app_image = '';
        // $scope.data = {
        //     background: '',
        //     font_family: '',
        //     theme_color: ''
        // };
        // $scope.privacy = '';
        // $scope.terms = '';
        // $scope.business_name = localStorage.getItem('business_name') ? localStorage.getItem('business_name') : 'Royo Apps';

        // if ((factories.getSettings()).key_value.logo_url) {
        //     $scope.app_image = (factories.getSettings()).key_value.logo_url;
        // } else {
        //     $scope.app_image = '';
        //     $scope.data['background'] = (factories.getSettings()).key_value.logo_background;
        //     $scope.data['font_family'] = (factories.getSettings()).key_value.font_family;
        //     $scope.data['theme_color'] = (factories.getSettings()).key_value.theme_color;
        // }

        services.GET_DATA({}, API.LIST_TERMS_AND_PRIVACY, function (response) {
            console.log(response)
            if(!!response) {
                let lang_index = localStorage.getItem('lang') != 'en' ? 1 : 0;

                let data = (response.data)[lang_index];
                $scope.privacy = data.faq;
                $scope.terms = data.terms_and_conditions;
            }
        });

    }]);