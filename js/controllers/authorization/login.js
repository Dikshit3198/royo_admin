Royo.controller('LoginCtrl', ['$scope', '$rootScope', 'services', 'factories', 'constants', '$state', 'API', '$location', '$translate',
    function ($scope, $rootScope, services, factories, constants, $state, API, $location, $translate) {

        if ((!$location.path() || $location.path() === '/login') && constants.ACCESSTOKEN) {
            if ($rootScope.profile === 'SHIPPING')
                $state.go('index.dashboardShipping');
            else
                $state.go('index.dashboard');
        }

        $scope.login = {};
        $scope.view_password = false;
        $scope.profile_type = 'ADMIN';
        $scope.message = '';
        $scope.is_branch = 0;
        $rootScope.login_page_type = 0;
        $scope.submitted = false;
        $scope.is_remember_checked = false;
        $scope.termsCheck = false;
        $scope.$on('login_page_type', getLoginPageType);
        function getLoginPageType($event, data) {
            $scope.profile_type = data == 2 ? 'SUPPLIER' : 'ADMIN';
            $rootScope.login_page_type = data;
        }
        $scope.updateTerms = function() {
            $scope.termsCheck = !$scope.termsCheck;
        }
        if (localStorage.getItem('login_page_type')) {
            let login_page_type = localStorage.getItem('login_page_type');
            $scope.profile_type = login_page_type == 2 ? 'SUPPLIER' : 'ADMIN';
            $rootScope.login_page_type = login_page_type;
        }

        if (localStorage.getItem('lang') == 'ar') {
            $scope.arabic_text_right_align = 1;
        } else {
            $scope.arabic_text_right_align = 0;
        }

        $scope.passwordView = function (view) {
            $scope.view_password = view;
        }

        $scope.checkBranch = function (is_branch) {
            $scope.is_branch = +is_branch;
        }

        $scope.changeProfile = function (profile_type) {
            console.log('qwertyuio', profile_type);
            $scope.profile_type = profile_type;
            if($rootScope.enable_signup_phone_only == 1) {
                setTimeout(() => {
                    initialize();
                }, 1000);
            }
        }


        var initialize = function () {
            var input = document.querySelector("#sup_phone");
            $scope.iti = window.intlTelInput(input, {
                preferredCountries: [factories.getSettings().adminDetails[0].iso]
            });
        }

        $scope.updateFCMtoken = function (token) {
            let data = {
                accessToken: token
            }

            data.fcm_token = localStorage.getItem('fcm_token') ? localStorage.getItem('fcm_token') : '';
            if ($rootScope.login_page_type == 2 || ($rootScope.login_page_type == 0 && ['SUPPLIER', 'BRANCH'].includes($scope.profile_type))) {
                data['sub'] = $scope.profile_type === 'BRANCH' ? 2 : 1;
            }
            services.POST_DATA(data, API.UPDATE_FCM_TOKEN(), function (data) {
            });
        }

        $scope.loginSubmit = function (loginForm) {
            $scope.submitted = true;
            if(!$scope.termsCheck && $scope.profile_type == 'SUPPLIER' && $rootScope.client_code == 'XYZ') { 
                return;
            }
            if (loginForm.$submitted && loginForm.$invalid) return;

            let data = {};
            if ($rootScope.enable_signup_phone_only != 1 || ['ADMIN', 'SHIPPING'].includes($scope.profile_type) || $rootScope.enable_supplier_email_login == 1)  {
                data.email = $scope.login.username;
                 
                if($rootScope.enable_rememberme_supplier == 1) {
                    localStorage.removeItem('userDetail')
                    if ($scope.is_remember_checked) {
                        let userDetail = {};
                        userDetail = { email: $scope.login.username, password: $scope.login.password }
                        localStorage.setItem('userDetail', JSON.stringify(userDetail));
                    }
                }
            }
            else if ($rootScope.enable_signup_phone_only == 1 && $scope.profile_type == 'SUPPLIER') {
                let phone_data = $scope.iti.getSelectedCountryData();
                if (!!phone_data) {
                    data['phone_number'] = $scope.login.mobile;
                    data['iso'] = phone_data['iso2'];
                    data['country_code'] = phone_data['dialCode'];
                }
            }

            data.password = $scope.login.password;
            data.fcm_token = localStorage.getItem('fcm_token') ? localStorage.getItem('fcm_token') : '';

            if ($rootScope.login_page_type == 2 || ($rootScope.login_page_type == 0 && ['SUPPLIER', 'BRANCH'].includes($scope.profile_type))) {
                data['sub'] = $scope.profile_type === 'BRANCH' ? 2 : 1;
            }

            services.POST_DATA(data, API.LOGIN($scope), function (data) {
                if ([4, 200].includes(data.status)) {
                    var accessToken = data.data.access_token;
                    var adminId = data.data.admin_id;
                    var userCreatedId = data.data.user_created_id;
                    if (data.data.logo) {
                        $rootScope.user_image = data.data.logo
                        localStorage.setItem('user_image', data.data.logo);
                    }
                    constants.ACCESSTOKEN = accessToken;
                    localStorage.setItem('RoyoAccessToken', accessToken);
                    localStorage.setItem('adminId', adminId);
                    localStorage.setItem('user_created_id', userCreatedId);
                    localStorage.setItem('message_id', data.data.message_id);
                    localStorage.setItem('is_superAdmin', data.data.is_super_admin);
                    localStorage.setItem('is_head_branch', data.data.is_head_branch ? data.data.is_head_branch : 0);
                    localStorage.setItem('profile_type', $scope.profile_type);
                    localStorage.setItem('supplier_id', data.data.supplierId);
                    localStorage.setItem('is_own_delivery', data.data.is_own_delivery);
                    localStorage.setItem('banner_limit', data.data.banner_limit);
                    localStorage.setItem('is_branch', $scope.is_branch);

                    let user_name = '';
                    switch ($scope.profile_type) {
                        case 'ADMIN':
                            user_name = $rootScope.business_name
                            break;
                        case 'SUPPLIER':
                            user_name = data.data.supplierName;
                            break;
                        case 'BRANCH':
                            user_name = data.data.branchName;
                            break;
                        case 'SHIPPING':
                            user_name = data.data.name;
                            localStorage.setItem('delivery_company_id', data.data.delivery_company_id);
                            break;
                    }
                    localStorage.setItem('user_name', user_name);

                    if (data.data.supplierSubscription && data.data.supplierSubscription.length) {
                        localStorage.setItem('supplierSubscription', JSON.stringify(data.data.supplierSubscription));
                    }
                    if (!!data.data.section_data) {
                        localStorage.setItem('section_data', JSON.stringify(data.data.section_data));
                    }
                    let branch_data = {
                        is_multibranch: data.data.is_multibranch,
                        default_branch_id: data.data.default_branch_id
                    };
                    localStorage.setItem('branch_type', JSON.stringify(branch_data));
                    $rootScope.profile = $scope.profile_type;
                    $rootScope.$emit('profile_type', $scope.profile_type);
                    $rootScope.active_supplier_id = data.data.supplierId;
                    $rootScope.is_superAdmin = data.data.is_super_admin;
                    $rootScope.is_head_branch = data.data.is_head_branch ? data.data.is_head_branch : 0;
                    if (data.data.productCustomTabDescriptionLabelSelected) {
                        localStorage.setItem('productCustomTabDescriptionLabelSelected', data.data.productCustomTabDescriptionLabelSelected);
                    }

                    let fcm_token = localStorage.getItem('fcm_token') ? localStorage.getItem('fcm_token') : '';

                    if (!!fcm_token) {
                        $scope.updateFCMtoken(accessToken);
                    }

                    if ($scope.profile_type == 'SHIPPING') {
                        $state.go('index.dashboardShipping');
                        $rootScope.delivery_company_id = data.data.delivery_company_id;
                    } else {
                        $state.go('index.dashboard');
                    }
                    $scope.submitted = false;
                }
            });
        };

        $scope.forgotPassword = function (forgotPassForm) {
            if (forgotPassForm.$submitted && forgotPassForm.$invalid) return;

            var data = {};
            data.email = ($scope.forgot.email).trim();
            services.POST_DATA(data, API.FORGOT_PASSWORD($scope), function (response) {
                $scope.message = response.message;
                $("#forgot_pass").modal('hide');
                services.SUCCESS_MODAL(true);
            });
        }

        $scope.toSupplierReg = function () {
            if (localStorage.getItem('reg_domain')) {
                window.open(localStorage.getItem('reg_domain') + '?redir=true#!/supplier-registration');
            } else {
                $state.go('supplierRegistration');
                setTimeout(() => {
                    $rootScope.$broadcast('settingsLoaded', true);
                }, 500);
            }
        }

        $scope.toDeliveryCompanyReg = function () {
            $state.go('deliveryCompanyRegistration');
            setTimeout(() => {
                $rootScope.$broadcast('settingsLoaded', true);
            }, 500);
        }

        $scope.rememberMe = function (event) {
            if (event.target.checked) {
                $scope.is_remember_checked = true;

                // localStorage.setItem('rememberMe',$scope.is_remember_checked);
            }
            else {
                $scope.is_remember_checked = false;

                //    localStorage.setItem('rememberMe',$scope.is_remember_checked);
            }

        }
        if ($rootScope.enable_signup_phone_only != 1 && $rootScope.enable_rememberme_supplier == 1) {

            if (localStorage.getItem('userDetail')) {
                var details = JSON.parse(localStorage.getItem('userDetail'));
                $scope.login.username = details.email;
                $scope.login.password = details.password;
                $scope.is_remember_checked = true;
            }
        }

    }
]);
