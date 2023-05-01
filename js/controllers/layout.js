Royo.controller('LayoutCtrl', [
    
    '$scope',
    '$rootScope',
    'services',
    'constants',
    '$state',
    'factories',
    'API',
    '$location',
    '$translate',
    '$window',
    function ($scope, $rootScope, services, constants, $state, factories, API, $location, $translate, $window) {

        var loadLangScript = function (langCode) {
            if (!!langCode) {
                let jsElm = document.createElement("script");
                jsElm.type = "text/javascript";
                // ${langCode}-${langCode} 1.4.6
                let script_url = `https://cdnjs.cloudflare.com/ajax/libs/angular-i18n/1.2.2/angular-locale_es-es.js`
                jsElm.src = script_url;
                document.getElementsByTagName("body")[0].appendChild(jsElm);
            }
        }

        $rootScope.languages = [{
            name: 'English',
            code: 'en',
            flag: ''
        }];

        $rootScope.lang = 'en';

        if (localStorage.getItem('lang')) {
            $rootScope.lang = localStorage.getItem('lang');
            $translate.use($rootScope.lang);
            moment.locale($rootScope.lang);
            if($rootScope.lang == 'es') {
                loadLangScript($rootScope.lang);
            }
        }

        var secondary_languages = [
            {
                name: 'Spanish',
                code: 'es',
                flag: ''
            }, {
                name: 'Arabic',
                code: 'ar',
                flag: ''
            }, {
                name: 'French',
                code: 'fr',
                flag: ''
            }, {
                name: 'Malayalam',
                code: 'ml',
                flag: ''
            },
            {
                name: 'Albanian',
                code: 'alb',
                flag: ''
            },
            {
                name: 'Thai',
                code: 'th',
                flag: ''
            }
        ]

        $rootScope.changeLanguage = function (lang) {
            $translate.use(lang);
            localStorage.setItem('lang', lang);
            $window.location.reload();
        }

        $scope.isSingleVendor = 0;
        $rootScope.supplier_localisation = 'Supplier';
        $rootScope.shipping_localisation = 'Shipping Panel'; // 'Delivery Company';
        $rootScope.show_login = false;
        $rootScope.business_name = 'Royo';
        $rootScope.META_TITLE = 'Royo';

        $rootScope.login_logo_height = 104;
        $rootScope.login_app_image = '';
        $rootScope.logo_data = {
            background: '',
            font_family: '',
            theme_color: ''
        }
        $rootScope.theme_color = '';
        $rootScope.profile = localStorage.getItem('profile_type');

        if ($rootScope.profile == 'BRANCH')
            $rootScope.is_head_branch = localStorage.getItem('is_head_branch');

        $rootScope.active_supplier_id = localStorage.getItem('supplier_id');
        if ($rootScope.profile === 'SHIPPING')
            $rootScope.delivery_company_id = localStorage.getItem('delivery_company_id');

        $rootScope.is_superAdmin = localStorage.getItem('is_superAdmin') || 1;
        $rootScope.panel_loaded = false;
        $rootScope.show_vendor_registration = 0;
        $rootScope.branch_flow = 0;
        $rootScope.category_sequence = 0;
        $rootScope.is_vendor_app_login = localStorage.getItem('vendor_app_login') || 0;
        $rootScope.dhlService = false;

        $rootScope.is_secondary_language_enable = 0;
        $rootScope.show_tags_for_suppliers = 0;


        $rootScope.enable_signup_phone_only = 0;

        $rootScope.enable_additional_registration_info = 0;
        $rootScope.isColorGet = false;
        $rootScope.addFontHKGrotesk = 0;

        $scope.all_payment_gateways = [];

        if (localStorage.getItem('fav_icon')) {
            let link = window.document.getElementById('favicon');
            link.setAttribute('href', localStorage.getItem('fav_icon'));
        }
        if (localStorage.getItem('business_name')) {
            document.title = localStorage.getItem('business_name');
            $rootScope.META_TITLE = localStorage.getItem('business_name');
            document.querySelector('meta[name="meta_description"]').setAttribute("content", localStorage.getItem('business_name'));
        }

        // if(localStorage.getItem('settings_data')) {
        //     document.querySelector('meta[name="og:image"]').setAttribute("content", (localStorage.getItem('settings_data')).key_value.logo_url);
        // }

        /******************* FCM *******************/
        $scope.getReceiverType = function (send_by_type) {
            let receiver = 2;
            switch (send_by_type) {
                case 'AGENT':
                    receiver = 1;
                    break;
                case 'SUPPLIER':
                    receiver = 3;
                    break;
                case 'ADMIN':
                    receiver = 4;
                    break;
                default:
                    receiver = 2;
            }
            return receiver;
        }

        var fcmMessaging = function () {
            var orderId = '';
            var audio = new Audio('/img/ring.mp3');

            let order_data;
            console.log('fcmMessaging', $rootScope.messaging);
            $rootScope.messaging.onMessage(function (payload) {
                console.log('payload', payload);
                if (payload) {

                    console.log("Audio state---", audio.readyState);
                    document.getElementById('notify').style.display = 'block';

                    if (!!payload.data) {
                        order_data = payload.data;
                        orderId = order_data.orderId;
                        document.getElementById('notify_order_text').innerHTML = `${$translate.instant(payload.notification.body)}`;
                        if (order_data.orderId) {
                            document.getElementById('notify_order_no').innerHTML = `${$translate.instant(factories.localisation().order)} no: ` + order_data.orderId;
                        } else if (order_data.type == 'chat') {
                            document.getElementById('notify_order_no').innerHTML = order_data.text;
                        }
                    }
                    setTimeout(() => {
                        document.getElementById('notify').style.display = 'none';
                    }, 30000);


                    var btn = document.createElement('button');
                    if (!document.getElementById('notifbtn')) {
                        btn.style.visibility = 'hidden';
                        btn.id = "notifbtn"
                        document.getElementsByTagName('body')[0].appendChild(btn);
                    }
                    btn.addEventListener('click', function () {
                        audio.play()
                    });
                    btn.click();


                }
            });

            document.getElementById("notify_click").addEventListener("click", function () {
                if (order_data.type && order_data.type == 'chat') {
                    let receiver_type = $scope.getReceiverType(order_data.send_by_type);
                    window.open(`${window.origin}/#!/orders/order-chat?created_id=${order_data.agent_created_id}&name=${order_data.sender_name}&type=${receiver_type}&message_id=${order_data.message_id}&receiver_type=${order_data.send_by_type}`, "_self");
                } else if (order_data.type && order_data.type == 'sos') {
                    window.open(`${window.origin}/#!/sos/sos-list`, "_self");
                } else if (orderId) {
                    window.open(`${window.origin}/#!/orders/order-description?order_id=${orderId}`, "_self");
                }else if (order_data.type && order_data.type == 'zoom_call')
                {
                    window.open(order_data.join_url, "_blank")
                }
                
                else {
                    if (window.location.href == `${window.origin}/#!/orders/order-manager`) {
                        $rootScope.$broadcast('order_page_refresh', true);
                    } else {
                        window.open(`${window.origin}/#!/orders/order-manager`, "_self");
                    }
                }
                document.getElementById('notify').style.display = 'none';
                audio.pause();
            });

            document.getElementById("close_notification").addEventListener("click", function () {
                document.getElementById('notify').style.display = 'none';
                audio.pause();
            });


        }

        var firebaseInit = function (firebase_data) {
            let firebaseConfig = {};
            if (firebase_data) {
                firebaseConfig = firebase_data;
            } else {
                firebaseConfig = {
                    apiKey: "AIzaSyBDRuECPQxMDSNk10A_wQpXnsEFKHJouaM",
                    authDomain: "royo-977f3.firebaseapp.com",
                    databaseURL: "https://royo-977f3.firebaseio.com",
                    projectId: "royo-977f3",
                    storageBucket: "royo-977f3.appspot.com",
                    messagingSenderId: "907248328957",
                    appId: "1:907248328957:web:56228a415f9c150c1e1e94",
                    measurementId: "G-8R0WH365WE"
                };
            }

            firebase.initializeApp(firebaseConfig);
            $rootScope.messaging = firebase.messaging();
            console.log('$rootScope.messaging', $rootScope.messaging);
            fcmMessaging();

            navigator.serviceWorker.register(`firebase-messaging-sw.js?messagingSenderId=${firebaseConfig.messagingSenderId
                }&apiKey=${firebaseConfig.apiKey
                }&authDomain=${firebaseConfig.authDomain
                }&databaseURL=${firebaseConfig.databaseURL
                }&projectId=${firebaseConfig.projectId
                }&storageBucket=${firebaseConfig.storageBucket
                }&appId=${firebaseConfig.appId
                }&measurementId=${firebaseConfig.measurementId
                }`).then(function (registration) {
                    $rootScope.messaging.useServiceWorker(registration);
                    $rootScope.messaging.requestPermission().then(function () {
                        console.log('requestPermission');
                        getToken();
                    }).catch(function (err) {
                        console.log("Unable to get permission to notify.", err);
                    });
                });

            function getToken() {
                $rootScope.messaging.getToken().then((refreshedToken) => {
                    console.log('refreshedToken', refreshedToken);
                    if (refreshedToken) {
                        localStorage.setItem('fcm_token', refreshedToken);
                    }
                    // $rootScope.messaging.deleteToken(refreshedToken).then(()=>{
                    //     if (refreshedToken) {
                    //         localStorage.setItem('fcm_token', refreshedToken);
                    //     }
                    //     console.log('token deleted succesfully')
                    // })

                }).catch((err) => {
                    console.log('Unable to retrieve refreshed token ', err);
                });
            }

            $rootScope.messaging.onTokenRefresh(() => {
                getToken();
            });
        }

        var onboardingLogin = function (pathname, settingsData) {
            let path_name = (pathname).split('/');
            let token = (path_name[1]).substr(4);
            let type = (path_name[1]).substring(0, 4);
            localStorage.setItem('RoyoAccessToken', token);
            localStorage.setItem('is_superAdmin', 1);
            if (type == 'ROYO') {
                localStorage.setItem('profile_type', 'ADMIN');
            } else if (type == 'VNDR') {
                localStorage.setItem('profile_type', 'SUPPLIER');
                localStorage.setItem('supplier_id', path_name[2]);
                localStorage.setItem('vendor_app_login', 1);
                $rootScope.is_vendor_app_login = 1;
                localStorage.setItem('is_head_branch', 1);
                localStorage.setItem('is_branch', 0);
            }
            $rootScope.is_superAdmin = 1;
            let branch_data = {
                is_multibranch: 0,
                default_branch_id: settingsData.supplier_branch_id
            };
            localStorage.setItem('branch_type', JSON.stringify(branch_data));
            window.location.assign(window.location.origin);
        }

        var loadMapScript = function (featureData) {
            let MAP_KEY = '';

            let geoLocationProvider = featureData.filter(data => data['type_name'] == 'map');
            if (geoLocationProvider.length) {
                geoLocationProvider.forEach(googleMaps => {
                    if (!!googleMaps && googleMaps.key_value_front.length) {
                        if ((googleMaps.name).toLowerCase() === 'new google maps') {
                            let new_map_key = (googleMaps.key_value_front).find(el => el.key == 'google_map_key_web');
                            if (!!new_map_key) {
                                MAP_KEY = new_map_key.value;
                            }
                        } else if ((googleMaps.name).toLowerCase() === 'google maps') {
                            let old_map_key = (googleMaps.key_value_front).find(el => el.key == 'google_map_key');
                            if (!!old_map_key) {
                                MAP_KEY = old_map_key.value;
                            }
                        }
                    }
                });
            }

            if (!!MAP_KEY) {
                let jsElm = document.createElement("script");
                jsElm.type = "text/javascript";
                jsElm.src = `https://maps.googleapis.com/maps/api/js?key=${MAP_KEY}&language=${localStorage.getItem('lang')}&libraries=places,visualization,drawing,geometry`;
                document.getElementsByTagName("head")[0].appendChild(jsElm);
                $rootScope.$broadcast('google_map_loaded', true);
                localStorage.setItem('google_map_loaded', true);
            }
        }

        var setPWAManifest = function (appData) {
            let image = '';
            if (appData.key_value['logo_url']) {
                image = appData.key_value['logo_url'];
            } else {
                let default_image = JSON.parse(appData.key_value['login_icon_url']);
                image = (default_image || {}).app;
            }

            // "lang": "en-GB",
            // "start_url": "./",
            if (appData.key_value) {
                var myDynamicManifest = {
                    "name": appData.key_value['domain_name'] + '_admin',
                    "short_name": appData.key_value['domain_name'] + '_admin',
                    "theme_color": "#1976d2",
                    "background_color": "#fafafa",
                    "display": "standalone",
                    "scope": "/",
                    "start_url": "/",
                    "icons": [
                        {
                            "src": `${image}`,
                            "sizes": "48x48",
                            "type": "image/png"
                        },
                        {
                            "src": `${image}`,
                            "sizes": "72x72",
                            "type": "image/png"
                        },
                        {
                            "src": `${image}`,
                            "sizes": "96x96",
                            "type": "image/png"
                        },
                        {
                            "src": `${image}`,
                            "sizes": "128x128",
                            "type": "image/png"
                        }, {
                            "src": `${image}`,
                            "sizes": "144x144",
                            "type": "image/png"
                        }, {
                            "src": `${image}`,
                            "sizes": "152x152",
                            "type": "image/png"
                        }, {
                            "src": `${image}`,
                            "sizes": "192x192",
                            "type": "image/png"
                        }, {
                            "src": `${image}`,
                            "sizes": "384x384",
                            "type": "image/png"
                        }, {
                            "src": `${image}`,
                            "sizes": "512x512",
                            "type": "image/png"
                        }
                    ],
                    "serviceworker": {
                        "src": "upup.min.js",
                        "scope": "./",
                        "update_via_cache": "imports"
                    }
                }

                const stringManifest = JSON.stringify(myDynamicManifest);
                const blob = new Blob([stringManifest], { type: 'application/json' });
                const manifestURL = URL.createObjectURL(blob);
                document.querySelector('#my-manifest-placeholder').setAttribute('href', `${manifestURL}`);
            }
        }

        var getSettings = function (onboarding_data, settingsData) {
            if (!!settingsData) {
                if (!!(settingsData.key_value).favicon_url && !localStorage.getItem('fav_icon')) {
                    let link = window.document.getElementById('favicon');
                    link.setAttribute('href', (settingsData.key_value).favicon_url);
                    localStorage.setItem('fav_icon', (settingsData.key_value).favicon_url);
                }
                $rootScope.isColorGet = true;
                $rootScope.settings = { ...settingsData, ...{ onboarding_data: onboarding_data } };
                localStorage.setItem('is_subscription_plan', settingsData.key_value.is_subscription_plan);
                localStorage.setItem('is_white_label', (settingsData.whitelabel[0] ? settingsData.whitelabel[0].is_white_label : 0));
                localStorage.setItem('settings_data', JSON.stringify($rootScope.settings));
                $scope.isSingleVendor = settingsData.screenFlow[0].is_single_vendor;

                $rootScope.is_secondary_language_enable = settingsData.key_value.secondary_language
                    && settingsData.key_value.secondary_language != 0 ? 1 : 0;

                $rootScope.show_tags_for_suppliers = settingsData.key_value.show_tags_for_suppliers
                    && settingsData.key_value.show_tags_for_suppliers != 0 ? 1 : 0;

                // $rootScope.enable_zone_geofence = 1;
                $rootScope.enable_zone_geofence = settingsData.key_value.enable_zone_geofence
                    && settingsData.key_value.enable_zone_geofence != 0 ? 1 : 0;


                $rootScope.enable_supplier_intro = settingsData.key_value.enable_supplier_intro
                    && settingsData.key_value.enable_supplier_intro != 0 ? 1 : 0;


                $rootScope.enable_signup_phone_only = settingsData.key_value.enable_signup_phone_only
                    && settingsData.key_value.enable_signup_phone_only != 0 ? 1 : 0;

                $rootScope.enable_supplier_email_login = settingsData.key_value.enable_supplier_email_login &&
                    settingsData.key_value.enable_supplier_email_login != 0 ? 1 : 0;

                $rootScope.enable_additional_registration_info = settingsData.key_value.enable_additional_registration_info ? (Number)(settingsData.key_value.enable_additional_registration_info) : 0;

                document.querySelector('meta[name="meta_image"]').setAttribute("content", settingsData.key_value.logo_url);

                let sec_lang = settingsData.key_value.secondary_language;
                let lang = localStorage.getItem('lang');

                let selected_lang = secondary_languages.find(lang => sec_lang === lang.code);
                if (!!selected_lang) {
                    $rootScope.languages.push(selected_lang);
                }

                let default_language = settingsData.key_value.default_language;

                $rootScope.lang = default_language == 1 ? (lang ? lang : sec_lang) : (lang ? lang : $rootScope.lang);
                $translate.use($rootScope.lang);
                localStorage.setItem('lang', $rootScope.lang);

                $rootScope.show_vendor_registration = settingsData.key_value.is_vendor_registration ? parseInt(settingsData.key_value.is_vendor_registration) : 0;
                $rootScope.show_shipping_registration = settingsData.key_value.show_shipping_registration ? parseInt(settingsData.key_value.show_shipping_registration) : 0;
                $rootScope.is_delivery_company = settingsData.key_value.is_delivery_company ? parseInt(settingsData.key_value.is_delivery_company) : 0;
                $rootScope.branch_flow = settingsData.key_value.branch_flow ? parseInt(settingsData.key_value.branch_flow) : 0;
                $rootScope.category_sequence = settingsData.key_value.category_sequence ? parseInt(settingsData.key_value.category_sequence) : 0;
                $rootScope.supplier_gst_no = settingsData.key_value.supplier_gst_no ? parseInt(settingsData.key_value.supplier_gst_no) : 0;
                $rootScope.is_branch_image_optional = settingsData.key_value.is_branch_image_optional ? Number(settingsData.key_value.is_branch_image_optional) : 0;
                $rootScope.logo_background_color = settingsData.key_value.logo_background_color ? settingsData.key_value.logo_background_color : 0;
                $rootScope.login_page_primary_color = settingsData.key_value.login_page_primary_color ? settingsData.key_value.login_page_primary_color : 0;
                $rootScope.theme_color = settingsData.key_value.theme_color;
                $rootScope.show_tags_for_suppliers = settingsData.key_value.show_tags_for_suppliers ? settingsData.key_value.show_tags_for_suppliers : 0;
                $rootScope.hide_document_upload_supplier_registration = settingsData.key_value.hide_document_upload_supplier_registration ? settingsData.key_value.hide_document_upload_supplier_registration : 0;
                $rootScope.hide_trade_document_supplier_registration = settingsData.key_value.hide_trade_document_supplier_registration ? settingsData.key_value.hide_trade_document_supplier_registration : 0;
                $rootScope.supplier_category_not_required = settingsData.key_value.supplier_category_not_required ? settingsData.key_value.supplier_category_not_required : 0;
                $rootScope.disable_image_force_compression = settingsData.key_value.disable_image_force_compression ? settingsData.key_value.disable_image_force_compression : 0;
                $rootScope.enable_panel_theme = settingsData.key_value.enable_panel_theme ? settingsData.key_value.enable_panel_theme : 0;
                $rootScope.hide_back_web_view = settingsData.key_value.hide_back_web_view ? settingsData.key_value.hide_back_web_view : 0;
                $rootScope.show_static_food_image_admin = settingsData.key_value.show_static_food_image_admin ? settingsData.key_value.show_static_food_image_admin : 0;
                $rootScope.enable_custom_scroll_width = settingsData.key_value.enable_custom_scroll_width ? settingsData.key_value.enable_custom_scroll_width : 0;

                $rootScope.enable_business_name = settingsData.key_value.enable_business_name ? settingsData.key_value.enable_business_name : 0;
                $rootScope.enable_maroof_password_supplier_reg = settingsData.key_value.enable_maroof_password_supplier_reg ? settingsData.key_value.enable_maroof_password_supplier_reg : 0;
                $rootScope.enable_rememberme_supplier = settingsData.key_value.enable_rememberme_supplier ? settingsData.key_value.enable_rememberme_supplier : 0;
                $rootScope.addFontHKGrotesk = settingsData.key_value.addFontHKGrotesk ? settingsData.key_value.addFontHKGrotesk : 0;

                $rootScope.is_table_booking = settingsData.key_value.is_table_booking ? settingsData.key_value.is_table_booking : 0;
                $rootScope.show_dine_opt_vendor_reg = settingsData.key_value.show_dine_opt_vendor_reg ? settingsData.key_value.show_dine_opt_vendor_reg : 0;
                $rootScope.display_supplier_doc_note = settingsData.key_value.display_supplier_doc_note ? settingsData.key_value.display_supplier_doc_note : 0;


                $rootScope.enable_account_number = settingsData.key_value.enable_account_number ? settingsData.key_value.enable_account_number : 0;
                $rootScope.enable_transist_number = settingsData.key_value.enable_transist_number ? settingsData.key_value.enable_transist_number : 0;
                $rootScope.enable_institution_number = settingsData.key_value.enable_institution_number ? settingsData.key_value.enable_institution_number : 0;
                $rootScope.enable_rfc_number = settingsData.key_value.enable_rfc_number ? settingsData.key_value.enable_rfc_number : 0;
                $rootScope.enable_branch_flow_in_signup = settingsData.key_value.enable_branch_flow_in_signup ? settingsData.key_value.enable_branch_flow_in_signup : 0;
                $rootScope.enable_trade_name = settingsData.key_value.enable_trade_name ? settingsData.key_value.enable_trade_name : 0;
                $rootScope.display_privacy_on_supplier_reg = settingsData.key_value.display_privacy_on_supplier_reg ? settingsData.key_value.display_privacy_on_supplier_reg : 0;                
                $rootScope.enable_otp_at_supplier_registration = settingsData.key_value.enable_otp_at_supplier_registration ? settingsData.key_value.enable_otp_at_supplier_registration : 0;




                $rootScope.primary_color = '#2ca6b1';

                if ($rootScope.logo_background_color == 1) {
                    document.documentElement.style.setProperty('--theme-color', settingsData.key_value.theme_color);
                }

                if ($rootScope.enable_panel_theme == 1) {
                    $rootScope.primary_color = settingsData.key_value.theme_color;
                    document.documentElement.style.setProperty('--primary-color', settingsData.key_value.theme_color);
                    if (settingsData.key_value.element_shadow_color) {
                        document.documentElement.style.setProperty('--shadow-color', settingsData.key_value.element_shadow_color);
                    }
                }

                if ($rootScope.enable_custom_scroll_width == 1) {
                    document.documentElement.style.setProperty('--scroll-width', settingsData.key_value.scroll_width);
                }

                if ($rootScope.addFontHKGrotesk == 1) {

                    let bolders = document.getElementsByClassName('bold');
                    for (let bold of bolders) {
                        bold.style.fontFamily = "HKGrotesk-Bold";
                    }
                    document.getElementsByTagName('body')[0].style.fontFamily = "'Open Sans', sans-serif"
                }

                $rootScope.supplier_localisation = factories.localisation().supplier;
                if ($rootScope.is_delivery_company == 1) $rootScope.shipping_localisation = factories.localisation().delivery_company;

                let path_name = window.location.pathname;
                if (!!path_name && (path_name.startsWith('/ROYO') || path_name.startsWith('/VNDR'))) {
                    localStorage.setItem('first_login', 1);
                    onboardingLogin(window.location.pathname, settingsData);
                } else {
                    localStorage.setItem('first_login', 0);
                    $rootScope.show_login = true;
                    if (settingsData.key_value.logo_url) {
                        $rootScope.login_app_image = settingsData.key_value.logo_url;
                    } else {
                        $rootScope.login_app_image = '';
                        $rootScope.logo_data['background'] = settingsData.key_value.header_color;
                        $rootScope.logo_data['font_family'] = settingsData.key_value.font_family;
                        $rootScope.logo_data['theme_color'] = settingsData.key_value.theme_color;
                    }

                    if (!constants.ACCESSTOKEN) {
                        if (($location.absUrl().split('?')[0] === `${window.location.origin}/#!/supplier-registration`) || ($location.absUrl()).includes('/supplier-registration')) {
                            $state.go('supplierRegistration');
                        } else if (($location.absUrl().split('?')[0] === `${window.location.origin}/#!/delivery-company-registration`) || ($location.absUrl()).includes('/delivery-company-registration')) {
                            $state.go('deliveryCompanyRegistration');
                        } else if ($location.absUrl().split('?')[0] === `${window.location.origin}/#!/terms`) {
                            $state.go('terms');
                        } else if ($location.absUrl().split('?')[0] === `${window.location.origin}/#!/privacy`) {
                            $state.go('privacy');
                        } else if ($location.absUrl().split('?')[0] === `${window.location.origin}/#!/NotFound`) {
                            $state.go('NotFound');
                        } else {
                            $state.go('login');
                        }
                    } else if (!$location.path() && constants.ACCESSTOKEN) {
                        if ($rootScope.profile === 'SHIPPING')
                            $state.go('index.dashboardShipping');
                        else
                            $state.go('index.dashboard');
                    }
                }
                setPWAManifest(settingsData);

                setTimeout(() => {
                    $rootScope.$broadcast('settingsLoaded', true);
                }, 500);

            } else {
                $state.go('NotFound');
            }
        }

        var isFacebookApp = function () {
            var ua = navigator.userAgent || navigator.vendor || window.opera;
            return (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1 || ua.indexOf("Instagram") > -1);
        }

        var getDBKey = function () {
            services.GET_ONBOARDING_DATA({
                domain: constants.DOMAIN
            }, API.GET_DB_KEY, true, function (response) {
                if (response && response.statusCode === 200 && response.data.data.length) {
                    const onboarding_data = (response.data).data[0];
                    const onboarding_res = response.data;
                    const unique_id = onboarding_data.uniqueId;
                    const settingsData = (response.data).settingsData;
                    let setting_data = onboarding_data.cbl_customer_domains[0];
                    localStorage.setItem('dbKey', setting_data.db_secret_key);
                    if (!!(onboarding_res).currency && (onboarding_res.currency).length) {
                        localStorage.setItem('currency', (onboarding_res.currency[0]).currency_symbol);
                    }

                    let login_page_type = 0;
                    let supplier_domain = onboarding_data.cbl_customer_domains[0].supplier_domain;
                    let admin_domain = onboarding_data.cbl_customer_domains[0].admin_domain;
                    if (supplier_domain && admin_domain && window.location.origin == supplier_domain) {
                        login_page_type = 2;
                    } else if (supplier_domain && admin_domain && 'https://admin.freshfarmz.com' == admin_domain) {
                        login_page_type = 1;
                    } else {
                        login_page_type = 0;
                    }

                    localStorage.setItem('reg_domain', (admin_domain ?  admin_domain : supplier_domain));
                    $rootScope.$broadcast('login_page_type', login_page_type);
                    localStorage.setItem('login_page_type', login_page_type);

                    localStorage.setItem('featureData', JSON.stringify(onboarding_res.featureData));

                    localStorage.setItem('business_name', response.data.data[0].business_name)

                    localStorage.setItem('agent_db_key', setting_data.agent_db_secret_key);
                    localStorage.setItem('unique_id', unique_id);
                    localStorage.setItem('site_domain', setting_data.site_domain);
                    localStorage.setItem('supplier_domain', setting_data.supplier_domain);
                    localStorage.setItem('business_name', onboarding_data.business_name);
                    localStorage.setItem('total_days', onboarding_data.total_days);
                    localStorage.setItem('is_subscribed', onboarding_data.is_subscribed);

                    document.title = onboarding_data.business_name;
                    $rootScope.business_name = onboarding_data.business_name;
                    $rootScope.META_TITLE = onboarding_data.business_name;

                    // $rootScope.META_DESCRIPTION = onboarding_data.business_name;
                    document.querySelector('meta[name="meta_description"]').setAttribute("content", onboarding_data.business_name);

                    if ((onboarding_res.subscriptionData).length) {
                        localStorage.setItem('sub_plan_name', onboarding_res.subscriptionData[0].name);
                    }

                    if ((onboarding_res.flowData).length) {
                        localStorage.setItem('flow_data', JSON.stringify(onboarding_res.flowData));
                    }

                    loadMapScript(onboarding_res.featureData);

                    var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
                    if (!isSafari && !isFacebookApp()) {
                        const notification = onboarding_res.featureData.find(data => data['type_name'] == 'notification' && data['name'] === 'FCM');

                        if (!!notification && notification.key_value_front.length) {
                            let firebase = {};
                            notification.key_value_front.forEach(el => {
                                firebase[el.key] = el.value;
                            });
                            firebaseInit(firebase);
                        } else {
                            firebaseInit(null);
                        }
                    }

                    $rootScope.client_code = onboarding_res.data[0].uniqueId;
                    localStorage.setItem('client_code', onboarding_res.data[0].uniqueId);

                    $rootScope.paymentGateways = (onboarding_res.featureData.filter(element => element['type_name'] == 'payment_gateway')).map(({ id, name, is_active, key_value_front }) => new Object({ id, name, is_active, key_value_front }));

                    $rootScope.dhlService = !!(onboarding_res.featureData.find(element => element['type_name'] == 'shipping_service' && element['name'] == 'DHL'));
                    $rootScope.is_ship_rocket_enable = !!(onboarding_res.featureData.find(element => element['type_name'] == 'shipping_service' && element['name'] == 'Shiprocket'));

                    $rootScope.all_payment_gateways = (onboarding_res.featureData.filter(element =>
                        element['type_name'] == 'payment_gateway')).map((
                            { id, name, is_active, key_value_front }
                        ) => new Object({
                            id, name, is_active, key_value_front
                        }));

                    if (setting_data.db_secret_key) {
                        getSettings(onboarding_data, settingsData);
                    }

                    // set tawk chat here
                    const document_head = document.getElementsByTagName('head')[0];
                    const scriptLink4 = this.document.createElement('script');
                    console.log($scope.tawkId);
                    // $scope.tawkId = '5e410316298c395d1ce7139c'
                    scriptLink4.innerText = `(function () {
                           var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
                           s1.async = true;
                           s1.src = 'https://embed.tawk.to/${$scope.tawkId}/default';
                           s1.charset = 'UTF-8';
                           s1.id = 'tawk_chat';
                           s1.setAttribute('crossorigin', '*');
                           s0.parentNode.insertBefore(s1, s0);
                       })();`
                    document_head.appendChild(scriptLink4);
                }
            });
        }
        getDBKey();

    }
]);
