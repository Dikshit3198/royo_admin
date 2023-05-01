Royo.controller('SettingCtrl', ['$scope', 'services', 'factories', '$stateParams', '$rootScope', 'API', '$rootScope', 'constants', '$translate',
    function ($scope, services, factories, $stateParams, $rootScope, API, $rootScope, constants, $translate) {

        $scope.original_localisation = factories.localisation(true);
        $scope.gateways = [];
        $scope.selected_countries = [];
        $scope.countries = [];
        $scope.active_settings_tab = 1;
        $scope.user_data = [];
        $scope.agent_list_data = [];
        $scope.supplier_data = [];
        $scope.all_user_data = [];
        $scope.all_supplier_data = [];
        $scope.all_agent_list_data = [];
        $scope.email = {
            subject: '',
            email_msg: ''
        }
        $scope.phone_no = {
            text_msg: ''
        }
        $scope.advertisment_image = '';
        $scope.subject = '';
        $scope.recipients = [];
        $scope.recipientsPhone = [];
        $scope.mark_all_users = false;
        $scope.mark_all_suppliers = false;
        $scope.notification = {
            notification_msg: ''
        };
        $scope.selected_email_ids = [{ email: '' }];
        $scope.selected_phone_nos = [{ mobile_no: '' }];
        $scope.user_supplier = [];
        $scope.logo_image = null;
        $scope.logo_image1 = null;

        $scope.logo = null;
        $scope.footer_logo = null;

        $scope.message = '';
        $scope.logo_url = '';
        $scope.footer_logo_url = '';

        // $scope.logoHeight = '';
        $scope.features = [];
        $scope.features_types = {};
        $scope.feature_submitted = false;
        $scope.ip_address = constants.IP_ADDRESS;
        $scope.default_address = '';
        $scope.coordinates = {
            latitude: 0,
            longitude: 0
        };
        $scope.is_address_edit = false;
        $scope.address_id = '';
        $scope.app_colors = {
            theme_color: '',
            header_color: '',
            element_color: '',
            header_text_color: '',
            element_shadow_color: '',
            element_theme2_color: ''
        };
        $scope.favicon_image = null;
        $scope.favicon = null;
        $scope.favicon_url = '';
        $scope.basic_terminologies = [];
        $scope.status_terminologies = [];
        $scope.return_status_terminologies = [];
        $scope.terms = {
            english: '',
            other: ''
        };
        $scope.privacy = {
            english: '',
            other: ''
        };
        $scope.about = {
            english: '',
            other: ''
        };
        $scope.faq = {
            english: '',
            other: ''
        };
        $scope.loginDisclaimer = {
            english: '',
            other: ''
        };
        $scope.about_us_short = {
            english: '',
            other: ''
        };
        $scope.cancellation_and_refund_policy = {
            english: '',
            other: ''
        }
        $scope.cookie_policy = {
            english: '',
            other: ''
        }

        $scope.show = false
        $scope.counterArray = [];
        $scope.fieldCollection = [];



        $scope.login_background_image = '';
        $scope.login_background = '';
        $scope.login_background_url = '';
        $scope.footer_mockup_image = '';
        $scope.footer_mockup_file = null;
        $scope.selected_placeholder = {};
        $scope.toggleCancellationCriteria = false;
        $scope.cancellation_policy = {
            min_time: { min_time: '00:00', id: 0, refund_different: 0 },
            partial_refund: {
                value: 0,
                is_flat: 0,
                id: 0
            },
            status_refund_types: [],
        };
        $scope.refund_types = [];


        $scope.show_referral = 0;
        $scope.basic_settings = {
            waiting_charges: '',
            payment_through_wallet_discount: '',
            payment_method: 0,
            referral_receive: '',
            referral_send: '',
            email: '',
            app_sharing_message: '',
            web_meta_description: '',
            web_meta_title: '',
            web_meta_keywords: '',
            agent_ios_app_url: '',
            agent_android_app_url: '',
            ios_app_url: '',
            android_app_url: '',
            max_order_weight: '',
            logoHeight: '',
            agent_verification_code_on_status: '',
            table_booking_distance: '',
            table_booking_time: '',
            schedule_time_buffer: '',
            agent_delivery_radius: '',
            max_order_charge: '',
            enable_user_signature: '',
            dropoff_buffer: '',
            eligible_order_amount: '',
            agent_order_request_popup: '',
            dynamic_order_type_client_wise_delivery: false,
            dynamic_order_type_client_wise_pickup: false,
            dynamic_order_type_client_wise_dinein: false,
            is_table_booking: false,
            glassdoor_link: '',
            google_pay_merchant_id: '',
            address_reference_char_limit: '',
            referral_bal_limit_per_order: '',

            sendPushToAllUserOnSupplierReg: '',
            sendPushToAllUserOnPromoAdd: '',
            surge_price: '',
            min_loyalty_points_to_redeem: '',
            min_order_amount_for_loyality_points: '',
            loyality_point_per_order: '',


            cleanfax_home_title: '',
            cleanfax_home_heading: '',
            cleanfax_home_image_url: '',
            custom_tax_static_value: '',
            custom_tax_static_value_flat: '',
            custom_agent_tip_min_value: '',
            km_for_fixed_delivery_charges: '',
            fixed_delivery_charge_value: '',
            fixed_delivery_charge_radius_exceed_value: '',

            minimum_subtotal_for_small_order_fee: '',
            small_order_fee: '',
            copy_right_section_contant: '',
            copy_right_section_contant_ol: '',
            cookies_policy_contant: '',
            cookies_policy_contant_ol: '',

            banner_title_text: '',
            banner_title_text_ol: '',
            base_delivery_charge_percentage: 0
        }

        $scope.story = {
            sec_1: {
                title: '',
                description: '',
                image: '',
                image_to_view: ''
            },
            sec_2: {
                title: '',
                description: '',
                image: '',
                image_to_view: ''
            },
            sec_3: {
                title: '',
                description: '',
                image: '',
                image_to_view: ''
            },
            sec_4: {
                title: '',
                description: '',
                image: '',
                image_to_view: ''
            }
        }

        $scope.user_types = [
            { type_name: '', is_active: 1, is_default: 0 }
        ];

        $scope.user_typ_status = 0;

        $scope.selected_domain_for_clone = '';

        $scope.client_info = {
            email: '',
            phone: '',
            country: '',
            iso: '',
            whatsapp_iso: '',
            country_code: '',
            whatsapp_number: '',
            whatsapp_country_code: ''
        }

        $scope.countries = [];
        $.getJSON("/js/components/countries.json", function (data) {
            if (data) {
                $scope.countries = Object.values(data);
            }
        });


        $scope.tipShowHideSettingsList = [
            { id: 1, name: 'Show Tip', showFor: "" },
            { id: 2, name: 'Show Item Price', showFor: "" },
            { id: 3, name: 'Show Total Price', showFor: "" },
            { id: 4, name: 'Show KM', showFor: "" },
            { id: 5, name: 'Show Commission', showFor: "" }
        ];
        $scope.tipRequestShowHideSettingsList = [
            { id: 1, name: 'Show Tip', isShow: "" },
            { id: 2, name: 'Show Item Price', isShow: "" },
            { id: 3, name: 'Show Total Price', isShow: "" },
            { id: 4, name: 'Show KM', isShow: "" },
            { id: 5, name: 'Show Commission', isShow: "" }
        ];
        $scope.isSavingTipShowHideSetting = false;
        $scope.tipShowHideDataObj = {
            show_tip: "",
            show_item_price: "",
            show_total_price: "",
            show_km: "",
            show_comission: "",
            req_show_tip: "",
            req_show_item_price: "",
            req_show_total_price: "",
            req_show_km: "",
            req_show_comission: "",
        }


        $scope.show_supplier_info_details = {
            show_supplier_phone: "",
            show_supplier_email: "",
            show_supplier_delivery_timing: "",
            show_supplier_open_close: "",
            show_supplier_nationality: "",
            show_supplier_speciality: "",
            show_supplier_brand_name: "",
            hide_supplier_address: "",
            show_supplier_categories: "",
        }
        $scope.showSuplierInfoSettingsList = [
            { id: 1, name: 'Supplier Phone', isShow: "" },
            { id: 2, name: 'Supplier Email', isShow: "" },
            { id: 3, name: 'Supplier Delivery Timing', isShow: "" },
            { id: 4, name: 'Supplier Open Close', isShow: "" },
            { id: 5, name: 'Show Supplier Nationality', isShow: "" },
            { id: 6, name: 'Supplier Speciality', isShow: "" },
            { id: 7, name: 'Supplier Brand', isShow: "" },
            { id: 8, name: 'Supplier Address Hide', isShow: "" },
            { id: 9, name: 'Supplier Categories', isShow: "" }
        ];

        $scope.home_screen_sections = [
            { id: 1, code: 'trending_rest', default_name: 'Trending Restaurant', section_name: 'Trending Restaurant', section_place: 1, is_active: 0 },
            { id: 2, code: 'special_offer', default_name: 'Special Offers', section_name: 'Special Offers', section_place: 2, is_active: 0 },
            { id: 3, code: 'best_seller', default_name: 'Best Seller', section_name: 'Best Seller', section_place: 3, is_active: 0 },
            { id: 4, code: 'top_selling', default_name: 'Top Selling Items', section_name: 'Top Selling Items', section_place: 4, is_active: 0 },
            { id: 5, code: 'fastest_del', default_name: 'Fastest Delivery', section_name: 'Fastest Delivery', section_place: 5, is_active: 0 },
            { id: 6, code: 'recomm_items', default_name: 'Recommended Items', section_name: 'Recommended Items', section_place: 6, is_active: 0 },
            { id: 7, code: 'near_you', default_name: 'Near You', section_name: 'Near You', section_place: 7, is_active: 0 },
            { id: 8, code: 'category_wise_rest', default_name: 'Category Wise Product', section_name: 'Category Wise Product', section_place: 8, is_active: 0 },
            { id: 9, code: 'highest_rating_resturant', default_name: 'Rating Wise Restaurant', section_name: 'Rating Wise Restaurant', section_place: 9, is_active: 0 },
            { id: 10, code: 'new_resturant', default_name: 'New Restaurant', section_name: 'New Restaurant', section_place: 10, is_active: 0 },
            { id: 11, code: 'show_categories', default_name: 'Show Categories', section_name: 'Show Categories', section_place: 11, is_active: 0 },
            { id: 12, code: 'recent_orders', default_name: 'Recent Orders', section_name: 'Recent Orders', section_place: 12, is_active: 0 }

        ];

        $scope.order_type_sections = [
            { id: 1, code: 'delivery', default_name: 'Delivery', section_name: 'Delivery', section_place: 1, is_active: 0 },
            { id: 2, code: 'pickup', default_name: 'Pick Up', section_name: 'Pick Up', section_place: 2, is_active: 0 },
            { id: 3, code: 'dinein', default_name: 'Dine In', section_name: 'Dine In', section_place: 3, is_active: 0 },
        ];


        $scope.tutorial_screens_obj = {
            tt1: {
                tutorial_image: "",
                tutorial_text: "",
                tutorial_title: ""
            },
            tt2: {
                tutorial_image: "",
                tutorial_text: "",
                tutorial_title: ""
            },
            tt3: {
                tutorial_image: "",
                tutorial_text: "",
                tutorial_title: ""
            }
        }
        $scope.tutorial_screens = [];

        $scope.agent_leave_notes = [];

        $scope.is_pickup_order = 2;

        $scope.array_rejection_reasons = [];



        $scope.selectCountry = function (country) {
            $scope.client_info.country = country;
        }

        if (factories.getSettings().onboarding_data) {
            setTimeout(() => {
                let onboarding_data = factories.getSettings().onboarding_data;
                console.log(onboarding_data);
                $scope.is_pickup_order = factories.getSettings().bookingFlow[0].is_pickup_order;
                $scope.client_info.email = onboarding_data.email;
                $scope.client_info.country = onboarding_data.country;
                $scope.client_info.phone = onboarding_data.phone_number;

                $scope.client_info.iso = onboarding_data.iso || factories.getSettings().adminDetails[0].iso;
                $scope.client_info.country_code = onboarding_data.country_code || factories.getSettings().adminDetails[0].country_code;
                var input = document.querySelector("#client_phone");
                $scope.iti = window.intlTelInput(input, {
                    preferredCountries: onboarding_data.iso || factories.getSettings().adminDetails[0].iso ? [onboarding_data.iso || factories.getSettings().adminDetails[0].iso] : ['us']
                });

                // $rootScope.enable_whatsapp_contact_us
                setTimeout(() => {
                    if (!!factories.getSettings().key_value.enable_whatsapp_contact_us) {
                        $scope.client_info.whatsapp_number = onboarding_data.whatsapp_phone_number;
                        $scope.client_info.whatsapp_iso = onboarding_data.whatsapp_iso ? onboarding_data.whatsapp_iso : ['us'];
                        $scope.client_info.whatsapp_country_code = onboarding_data.whatsapp_country_code || factories.getSettings().adminDetails[0].whatsapp_country_code;

                        var input1 = document.querySelector("#client_whatsapp_phone");
                        $scope.iti1 = window.intlTelInput(input1, {
                            preferredCountries: onboarding_data.whatsapp_iso ? onboarding_data.whatsapp_iso : ['us']
                        });
                    }
                }, 200);
            }, 200);
        }

        $scope.updateClientSettings = function () {
            let phone_data = $scope.iti.getSelectedCountryData();
            if (!!phone_data) {
                $scope.client_info.iso = phone_data['iso2'];
                $scope.client_info.country_code = phone_data['dialCode'];
            }

            if ($rootScope.enable_whatsapp_contact_us == 1) {
                let phone_data1 = $scope.iti1.getSelectedCountryData();
                if (!!phone_data1) {
                    $scope.client_info.whatsapp_iso = phone_data1['iso2'];
                    $scope.client_info.whatsapp_country_code = phone_data1['dialCode'];
                }
            }
            let params = {
                email: $scope.client_info.email,
                phone_number: $scope.client_info.phone,
                country: $scope.client_info.country,
                iso: $scope.client_info.iso,
                country_code: $scope.client_info.country_code,
                id: factories.getSettings().onboarding_data.id,
                business_name: factories.getSettings().onboarding_data.business_name
            }

            if ($rootScope.enable_whatsapp_contact_us == 1) {
                params['whatsapp_iso'] = $scope.client_info.whatsapp_iso;
                params['whatsapp_phone_number'] = $scope.client_info.whatsapp_number;
                params['whatsapp_country_code'] = $scope.client_info.whatsapp_country_code;
            }

            services.POST_ONBOARDING_DATA(params, API.UPDATE_CLIENT_INFO, false, function (response) {
                $scope.message = `${$translate.instant('Settings updated successfully')}`;
                services.SUCCESS_MODAL(true);
            });
        }


        $scope.changeDeliveryMode = function (is_pickup_order) {
            $scope.is_pickup_order = is_pickup_order;
        }

        $scope.updateDeliveryMode = function () {
            services.PUT_DATA({ is_pickup_order: $scope.is_pickup_order }, API.DELIVERY_MODE_UPDATE, function (response) {
                $scope.message = `${$translate.instant('Delivery mode updated successfully')}`;
                services.SUCCESS_MODAL(true);
            });
        }

        $scope.summernote_config_app_sharing = {
            height: 100,
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'italic', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
            ]
        }

        $scope.summernote_config = {
            height: 200,
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'italic', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['table', ['table']],
            ]
        }
        setTimeout(() => {
            $scope.summernote_policy_config = {
                height: 350,
                toolbar: [
                    ['style', ['style']],
                    ['font', ['bold', 'italic', 'underline', 'clear']],
                    ['fontname', ['fontname']],
                    ['color', ['color']],
                    ['insert', ['link']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['height', ['height']],
                    ['table', ['table']],
                    ['fontsize', ['fontsize']],

                ],
                fontSizes: ['8', '9', '10', '11', '12', '14', '18', '24', '36', '48', '64', '82', '150']
            }

        }, 500)



        $scope.summernote_flavor_week_config = {
            height: 350,
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'italic', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['table', ['table']],
            ]
        }

        var initialize = function () {
            var input = document.getElementById('addressField');
            var autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.addListener('place_changed', function () {
                var place = autocomplete.getPlace();
                $scope.coordinates.latitude = place.geometry.location.lat();
                $scope.coordinates.longitude = place.geometry.location.lng();
                $scope.default_address = place.formatted_address;
            });
        }


        $scope.singleFoodFile1 = '';
        $scope.singleFoodFile2 = '';
        $scope.singleFoodImage1 = '';
        $scope.singleFoodImage2 = '';
        $scope.singleFoodStoryFile = '';
        $scope.singleFoodStoryImage = '';
        $scope.single_vendor_text = {
            popular_text: '',
            offer_text: ''
        }

        $scope.user_app_version = {
            device_type: 0,
            forced_version: 0,
            id: 0,
            is_forced_android: 0,
            is_forced_ios: 0,
            is_update_android: 0,
            is_update_ios: 0,
            type: 0,
            version: 0,
            version_android: "",
            version_ios: "",
        }

        $scope.flavor_of_week = {
            title_one: "",
            description_one: "",
            title_two: "",
            description_two: "",
            image_one: "",
            image_two: "",
            image_three: "",
            become_flavor_signup_text: "",
            become_driver_signup_text: ""
        }

        $scope.updateSingleFoodBottomBanner = function (singleFoodForm) {
            if (singleFoodForm.$submitted && singleFoodForm.$invalid) return;

            if (!$scope.singleFoodImage1 || !$scope.singleFoodImage1) {
                factories.invalidDataPop($translate.instant("Please select images"));
                return;
            }

            let param_data = {};
            param_data.singleFoodBottomBanner1 = $scope.singleFoodFile1 ? $scope.singleFoodFile1 : $scope.singleFoodImage1;
            param_data.singleFoodBottomBanner2 = $scope.singleFoodFile2 ? $scope.singleFoodFile2 : $scope.singleFoodImage2;
            param_data.singleFoodStoryBackground = $scope.singleFoodStoryFile ? $scope.singleFoodStoryFile : $scope.singleFoodStoryImage;
            param_data.single_vendor_popular_text = $scope.single_vendor_text.popular_text;
            param_data.single_vendor_offer_text = $scope.single_vendor_text.offer_text;

            services.POST_FORM_DATA(param_data, API.UPDATE_ADMIN_SETTINGS, function (response) {
                $scope.message = `${$translate.instant('Bottom banners updated successfully')}`;
                services.SUCCESS_MODAL(true);
            });
        }

        $scope.file_to_upload_for_single_food_banner_bottom = function (File, type) {
            var file = File[0];
            if (constants.IMAGE_TYPE.includes(file.type)) {
                if ((file.size / Math.pow(1024, 2)) <= 1) {
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        $scope.$apply(function () {
                            if (type == 1) {
                                $scope.singleFoodImage1 = e.target.result;
                                $scope.singleFoodFile1 = File[0];
                            } else if (type == 2) {
                                $scope.singleFoodImage2 = e.target.result;
                                $scope.singleFoodFile2 = File[0];
                            } else if (type == 3) {
                                $scope.singleFoodStoryImage = e.target.result;
                                $scope.singleFoodStoryFile = File[0];
                            }
                        });
                    }
                } else {
                    factories.invalidDataPop($translate.instant("Image size must be less than 2mb"));
                }
            } else {
                factories.invalidDataPop($translate.instant("Invalid File Type"));
            }
        };


        var appBanners = function () {
            var key_value = factories.getSettings().key_value;

            $scope.pick_up_banners = {
                file: {
                    pickup_url_one: '',
                    pickup_url_two: '',
                    pickup_url_three: ''
                },
                img: {
                    one: key_value.pickup_url_one ? key_value.pickup_url_one : '',
                    two: key_value.pickup_url_two ? key_value.pickup_url_two : '',
                    three: key_value.pickup_url_three ? key_value.pickup_url_three : ''
                }
            }

            $scope.delivery_banners = {
                file: {
                    delivery_url_one: '',
                    delivery_url_two: '',
                    delivery_url_three: ''
                },
                img: {
                    one: key_value.delivery_url_one ? key_value.delivery_url_one : '',
                    two: key_value.delivery_url_two ? key_value.delivery_url_two : '',
                    three: key_value.delivery_url_three ? key_value.delivery_url_three : '',
                }
            }
        }
        appBanners();

        var addType = function () {
            $scope.user_types.push({
                type_name: '',
                is_active: 1,
                is_default: 0
            });
        }
        var getUserTypes = function () {
            services.GET_DATA({}, API.LIST_USER_TYPES(), function (response) {
                if (response.data.length) {
                    $scope.user_types = [];
                    $scope.user_types = (response.data).map(type => {
                        return {
                            type_name: type.type_name,
                            id: type.id,
                            is_active: type.is_active,
                            is_default: type.is_default,
                            payment_gateways: type.payment_gateways ? (type.payment_gateways).split('#') : []
                        }
                    });
                }
                addType();
            });
        }
        if (factories.getSettings().key_value.is_user_type == 1) {
            let val = parseInt(factories.getSettings().key_value.user_type_check);
            $rootScope.user_type_check = val ? val : 0;
            $scope.user_typ_status = val ? val : 0;
            getUserTypes();
        }

        /*******settings tab -> terms and cond -> add fields********/
        $scope.hideAddField = function () {
            let limit = factories.getSettings().key_value.extra_content_section_limit || 2;
            if ($scope.fieldCollection.length >= limit) {
                $scope.hideAddField1 = true;
            } else {
                $scope.hideAddField1 = false;
            }
        }


        $scope.addField = function () {
            let field = {
                isNew: 1
            }
            $scope.fieldCollection.push(field);
            $scope.hideAddField();
        }

        // $scope.hideAddField();
        /***********************************************************/

        $scope.tabSwitch = function (type) {
            $scope.active_settings_tab = type;
            switch (type) {
                case 1:
                    $scope.getBasicSettings();
                    appBanners();
                    if (factories.getSettings().key_value.is_user_type == 1) {
                        getUserTypes();
                    }
                    break;

                case 2:
                    setTimeout(() => {
                        initialize();
                    }, 500);
                    break;

                case 3:
                    if (factories.getSettings().key_value.terminology) {
                        let terms = JSON.parse(factories.getSettings().key_value.terminology);
                        $scope.basic_terminologies = [];
                        $scope.status_terminologies = [];
                        $scope.return_status_terminologies = [];
                        Object.keys(terms.english).forEach(key => {
                            if (key !== 'status' && key !== 'return_status') {
                                $scope.basic_terminologies.push(
                                    {
                                        key: key,
                                        value: {
                                            english: (terms.english)[key],
                                            other: (terms.other)[key]
                                        },
                                        is_status: 0,
                                        is_return_status: 0
                                    }
                                )
                            } else if (key === 'status') {
                                Object.keys(terms.english.status).forEach(st => {
                                    $scope.status_terminologies.push(
                                        {
                                            key: parseInt(st),
                                            value: {
                                                english: (terms.english.status)[st],
                                                other: (terms.other.status)[st]
                                            },
                                            is_status: 1,
                                            is_return_status: 0
                                        }
                                    )
                                });
                            } else if (key === 'return_status' && factories.getSettings().key_value.is_return_request == 1) {
                                Object.keys(terms.english.return_status).forEach(st => {
                                    $scope.return_status_terminologies.push(
                                        {
                                            key: parseInt(st),
                                            value: {
                                                english: (terms.english.return_status)[st],
                                                other: (terms.other.return_status)[st]
                                            },
                                            is_return_status: 1,
                                            is_status: 0
                                        }
                                    )
                                });
                            }
                        });


                        if ($rootScope.is_user_subscription != '1' && $scope.basic_terminologies.some(x => x.key === 'my_subscription')) {
                            $scope.basic_terminologies = $scope.basic_terminologies.filter(function (obj) {
                                return obj.key !== 'my_subscription';
                            });
                        }
                        if ($rootScope.is_loyality_enable != '1' && $scope.basic_terminologies.some(x => x.key === 'loyalty_points')) {
                            $scope.basic_terminologies = $scope.basic_terminologies.filter(function (obj) {
                                return obj.key !== 'loyalty_points';
                            });
                        }
                        if ($rootScope.wallet_module != '1' && $scope.basic_terminologies.some(x => x.key === 'wallet')) {
                            $scope.basic_terminologies = $scope.basic_terminologies.filter(function (obj) {
                                return obj.key !== 'wallet';
                            });
                        }
                    }
                    break;

                case 4:
                    let emails = [];
                    $scope.user_supplier.forEach(el => {
                        emails.push(el.email);
                    });
                    setTimeout(() => {
                        $('#autocomplete').tagEditor({
                            delimiter: ', ',
                            placeholder: $translate.instant('Enter Email Address'),
                            autocomplete: {
                                delay: 0,
                                position: { collision: 'flip' }, // automatic menu position up/down
                                source: emails
                            },
                            forceLowercase: false,
                            onChange: function (field, editor, tags) {
                                $scope.recipients = tags;
                            }
                        });
                    }, 500);
                    break;

                case 6:
                    services.GET_DATA({}, API.LIST_TERMS_AND_PRIVACY, function (response) {
                        if (!!response && response.status == 4) {
                            let english = (response.data)[0];
                            let other = (response.data)[1];
                            if (!!english) {
                                $scope.terms.english = english.terms_and_conditions;
                                $scope.privacy.english = english.faq;
                                $scope.about.english = english.about_us;
                                $scope.faq.english = english.faqs;

                                if ($rootScope.login_page_disclaimer == 1) {
                                    $scope.loginDisclaimer.english = english.terms_of_login;
                                }
                                if ($rootScope.show_cancellation_and_refund_policy == 1) {
                                    $scope.cancellation_and_refund_policy.english = english.cancellation_and_refund;
                                }
                                if ($rootScope.show_cookie_policy == 1) {
                                    $scope.cookie_policy.english = english.cookie_policy;
                                }
                                if ($rootScope.enable_adding_multiplefields_in_web == 1) {
                                    if (!!english.additional_dynamic_fields && !!JSON.parse(english.additional_dynamic_fields)) {
                                        $scope.fieldCollection = JSON.parse(english.additional_dynamic_fields);
                                        $scope.hideAddField();
                                    } else {
                                        $scope.addField();
                                    }
                                }
                            }

                            if (!!other) {
                                $scope.terms.other = other.terms_and_conditions;
                                $scope.privacy.other = other.faq;
                                $scope.about.other = other.about_us;
                                $scope.faq.other = other.faqs;

                                if ($rootScope.login_page_disclaimer == 1) {
                                    $scope.loginDisclaimer.other = other.terms_of_login;
                                }
                                if ($rootScope.show_cancellation_and_refund_policy == 1) {
                                    $scope.cancellation_and_refund_policy.other = other.cancellation_and_refund;
                                }
                                if ($rootScope.show_cookie_policy == 1) {
                                    $scope.cookie_policy.other = other.cookie_policy;
                                }
                                // if ($rootScope.enable_adding_multiplefields_in_web == 1) {
                                //     $scope.fieldCollection = !!other.additional_dynamic_fields ? JSON.parse(other.additional_dynamic_fields) : [];
                                // }
                            }
                        }
                    });
                    break;

                case 7:
                    if (factories.getSettings().key_value.flavor_of_week) {
                        var flavor = JSON.parse(factories.getSettings().key_value.flavor_of_week);
                        $scope.flavor_of_week = {
                            title_one: flavor.title_one || "",
                            description_one: flavor.description_one || "",
                            title_two: flavor.title_two || "",
                            description_two: flavor.description_two || "",
                            image_one: flavor.image_one || "",
                            image_two: flavor.image_two || "",
                            image_three: flavor.image_three || "",
                            become_driver_signup_text: flavor.become_driver_signup_text || "",
                            become_flavor_signup_text: flavor.become_flavor_signup_text || "",
                        }
                    }
                    break;

                case 8:
                    let phone_numbers = [];
                    $scope.user_supplier.forEach(el => {
                        phone_numbers.push(el.mobile_no);
                    });
                    setTimeout(() => {
                        $('#autocomplete1').tagEditor({
                            delimiter: ', ',
                            placeholder: $translate.instant('Enter Phone Number'),
                            autocomplete: {
                                delay: 0,
                                position: { collision: 'flip' }, // automatic menu position up/down
                                source: phone_numbers
                            },
                            forceLowercase: false,
                            onChange: function (field, editor, tags) {
                                $scope.recipientsPhone = tags;
                            }
                        });
                    }, 500);
                    break;
            }
        }

        /*********************** Basic ***********************/

        //User Types
        var setUserTypeStatus = function (status) {
            let local = JSON.parse(localStorage.getItem('settings_data'));
            local.key_value.user_type_check = status;
            localStorage.setItem('settings_data', JSON.stringify(local));
            $rootScope.user_type_check = status;
            $scope.user_typ_status = status;
        }

        $scope.changeUserTypeStatus = function (user_typ_status) {
            $scope.user_typ_status = user_typ_status;
            if (user_typ_status == 1) {
                services.POST_DATA({ is_active: 1 }, API.ACTIVATE_USER_TYPE, function (response) {
                    setUserTypeStatus(1);
                    getUserTypes();
                    $scope.message = `${$translate.instant('User types module activated successfully')}`;
                    services.SUCCESS_MODAL(true);
                });
            } else {
                services.POST_DATA({ is_active: 0 }, API.DEACTIVATE_USER_TYPE, function (response) {
                    setUserTypeStatus(0);
                    getUserTypes();
                    $scope.message = `${$translate.instant('User types module deactivated successfully')}`;
                    services.SUCCESS_MODAL(true);
                });
            }
        }

        $scope.addUserType = function (addUserTypesForm, index) {
            if (addUserTypesForm.$submitted && addUserTypesForm.$invalid) return;

            if ($scope.user_types[index].id) {
                const payload = {
                    type_name: $scope.user_types[index].type_name,
                    id: $scope.user_types[index].id
                }

                if ($scope.user_types[index].payment_gateways) {
                    payload.payment_gateways = $scope.user_types[index].payment_gateways;
                }

                services.POST_DATA(payload, API.UPDATE_USER_TYPES, function (response) {
                    getUserTypes();
                    $scope.message = `${$translate.instant('User types updated successfully')}`;
                    services.SUCCESS_MODAL(true);
                });
            } else {
                const payload = {
                    type_name: $scope.user_types[index].type_name
                }

                if ($scope.user_types[index].payment_gateways) {
                    payload.payment_gateways = $scope.user_types[index].payment_gateways;
                }
                services.POST_DATA(payload, API.ADD_USER_TYPE, function (response) {
                    getUserTypes();
                    $scope.message = `${$translate.instant('User type added successfully')}`;
                    services.SUCCESS_MODAL(true);
                });
            }
        }
        $scope.showPolicies = function (policy) {
            if ($rootScope.client_code == 'peeparound_0104') {
                if (policy.status == 0 || policy.status == 11 || policy.status == 10) {
                    return false
                } else {
                    return true;
                }
            } else {
                return true;
            }
        }
        $scope.removeUserType = function (index) {
            services.POST_DATA({ id: $scope.user_types[index].id }, API.DELETE_USER_TYPE, function (response) {
                getUserTypes();
                $scope.message = `${$translate.instant('User type removed successfully')}`;
                services.SUCCESS_MODAL(true);
            });
        }

        //cancellation policy section
        $scope.changeRefundCriteria = function (toggleCancellationCriteria) {
            $scope.toggleCancellationCriteria = !toggleCancellationCriteria;
            $scope.toggleCancellationCriteria == false ? $scope.cancellation_policy.min_time.refund_different = 0 : $scope.cancellation_policy.min_time.refund_different = 1;
        }

        var getCancellationPolicyData = function () {
            services.GET_DATA({}, API.GET_CANCELLATION_POLICY_DATA, function (response) {
                let data = response.data;
                $scope.cancellation_policy.min_time = {
                    min_time: data.min_time[0].min_time,
                    id: data.min_time[0].id,
                    refund_different: data.min_time[0].refund_different
                };
                $scope.toggleCancellationCriteria = $scope.cancellation_policy.min_time.refund_different == 0 ? false : true;
                $scope.cancellation_policy.status_refund_types = [];
                (data.status_refund_types).forEach(el => {
                    obj = {
                        id: el.id,
                        status: el.status,
                        refund_type: el.refund_type,
                    }
                    if ($rootScope.order_statuswise_deduction_charges == 1 && !!$scope.toggleCancellationCriteria) {
                        obj['is_flat'] = el.is_flat;
                        obj['value'] = el.value;
                    }
                    if ($rootScope.order_statuswise_deduction_charges == 1 && !$scope.toggleCancellationCriteria) {
                        obj['is_flat'] = 0;
                        obj['value'] = 0;
                    }
                    $scope.cancellation_policy.status_refund_types.push(obj);
                });
                $scope.refund_types = data.partial_refund;
                let partial_refund = (data.partial_refund).find(el => el.refund_type == 1);
                if (!!partial_refund) {
                    if ($rootScope.order_statuswise_deduction_charges == 1 && !!$scope.toggleCancellationCriteria) {
                        partial_refund.is_flat = 0;
                        partial_refund.value = 0;
                    }
                    $scope.cancellation_policy.partial_refund = {
                        value: partial_refund.value,
                        is_flat: partial_refund.is_flat,
                        id: partial_refund.id
                    };
                }
            });
        }
        getCancellationPolicyData();

        $scope.updateCancellationPolicy = function (cancellationPolicyForm) {
            if (cancellationPolicyForm.$submitted && cancellationPolicyForm.$invalid) return;
            services.POST_DATA($scope.cancellation_policy, API.UPDATE_CANCELLATION_POLICY_DATA, function (response) {
                $scope.message = `${$translate.instant('Refund Policy updated successfully')}`;
                services.SUCCESS_MODAL(true);
            });
            if ($rootScope.disable_cancel_order_after_admin_provided_time == 1) {
                var param_data = {};
                param_data['max_cancellation_waiting_time'] = moment.duration($scope.cancellation_policy.min_time.min_time).asSeconds();
                services.POST_FORM_DATA(param_data, API.UPDATE_ADMIN_SETTINGS, function (response) {
                })
            }
        }

        $scope.loadKeyValuesSettings = function () {
            if (factories.getSettings().key_value) {
                var keys = factories.getSettings().key_value;
                $scope.basic_settings.dropoff_buffer = Number($rootScope.dropoff_buffer);
                $scope.about_us_short.english = keys.aboutus_two_english;
                $scope.about_us_short.other = keys.aboutus_two_other;
                $scope.basic_settings.eligible_order_amount = keys.eligible_order_amount ? (Number)(keys.eligible_order_amount) : 0;
                $scope.basic_settings.agent_order_request_popup = keys.agent_order_request_popup ? (Number)(keys.agent_order_request_popup) : 0;

                $scope.basic_settings.dynamic_order_type_client_wise_delivery = keys.dynamic_order_type_client_wise_delivery == '1' ?
                    true : false;
                $scope.basic_settings.dynamic_order_type_client_wise_pickup = keys.dynamic_order_type_client_wise_pickup == '1' ?
                    true : false;
                $scope.basic_settings.dynamic_order_type_client_wise_dinein = keys.dynamic_order_type_client_wise_dinein == '1' ?
                    true : false;

                if ($rootScope.is_table_booking == 0) {
                    $scope.basic_settings.dynamic_order_type_client_wise_dinein = false;
                }

                $scope.basic_settings.address_reference_char_limit = (Number)(keys.address_reference_char_limit) || 0;

                $scope.basic_settings.referral_bal_limit_per_order = (Number)(keys.referral_bal_limit_per_order) || 0;

                $scope.basic_settings.sendPushToAllUserOnSupplierReg = (Number)(keys.sendPushToAllUserOnSupplierReg) || 0;
                $scope.basic_settings.sendPushToAllUserOnPromoAdd = (Number)(keys.sendPushToAllUserOnPromoAdd) || 0;

                if ($rootScope.Is_juman_flow_enable == 1) {
                    $scope.basic_settings.cleanfax_home_image_url = keys.cleanfax_home_image_url || '';
                    $scope.basic_settings.cleanfax_home_title = keys.cleanfax_home_title || '';
                    $scope.basic_settings.cleanfax_home_heading = keys.cleanfax_home_heading || '';
                }


                $scope.agent_leave_notes = keys.leave_notes_reasons ?
                    keys.leave_notes_reasons.split('#') : [''];

                $scope.home_screen_sections = (keys.dynamic_home_screen_sections &&
                    keys.home_screen_sections) ?
                    JSON.parse(keys.home_screen_sections) : $scope.home_screen_sections;

                $scope.order_type_sections = (keys.order_type_sections &&
                    keys.order_type_sections) ?
                    JSON.parse(keys.order_type_sections) : $scope.order_type_sections;


                if ($stateParams && $stateParams.supplier_id && $rootScope.is_flavor_of_week_enable) {
                    $scope.supplier_id_for_flavor_of_week = $stateParams.supplier_id;
                    $scope.tabSwitch(7);
                }

                if ($rootScope.enable_custom_tax_static == 1) {
                    $scope.basic_settings.custom_tax_static_value = Number(keys.custom_tax_static_value);
                    $scope.basic_settings.custom_tax_static_value_flat = Number(keys.custom_tax_static_value_flat) || 0;
                }
                if ($rootScope.enable_custom_agent_tip == 1) {
                    $scope.basic_settings.custom_agent_tip_min_value = Number(keys.custom_agent_tip_min_value);
                }
                if ($rootScope.enable_fixed_delivery_charges == 1) {
                    $scope.basic_settings.km_for_fixed_delivery_charges = Number(keys.km_for_fixed_delivery_charges);
                    $scope.basic_settings.fixed_delivery_charge_value = Number(keys.fixed_delivery_charge_value);
                    $scope.basic_settings.fixed_delivery_charge_radius_exceed_value = Number(keys.fixed_delivery_charge_radius_exceed_value);
                }

                $scope.basic_settings.copy_right_section_contant = keys.copy_right_section_contant ? keys.copy_right_section_contant : '';
                $scope.basic_settings.copy_right_section_contant_ol = keys.copy_right_section_contant_ol ? keys.copy_right_section_contant_ol : '';
                $scope.basic_settings.cookies_policy_contant = keys.cookies_policy_contant ? keys.cookies_policy_contant : '';
                $scope.basic_settings.cookies_policy_contant_ol = keys.cookies_policy_contant_ol ? keys.cookies_policy_contant_ol : '';

                if ($rootScope.enable_banner_title == 1) {
                    $scope.basic_settings.banner_title_text = keys.banner_title_text ? keys.banner_title_text : '';
                    $scope.basic_settings.banner_title_text_ol = keys.banner_title_text_ol ? keys.banner_title_text_ol : '';
                }
                if ($rootScope.enable_base_delivery_charge_percentage == 1) {
                    $scope.basic_settings.base_delivery_charge_percentage = Number(keys.base_delivery_charge_percentage) ? Number(keys.base_delivery_charge_percentage) : 0;
                }

                $scope.array_rejection_reasons = keys.rejection_reasons ?
                    keys.rejection_reasons.split('#') : [''];


            }
        }

        $scope.addNewNote = function (index) {
            console.log($scope.agent_leave_notes[index])
            if (!$scope.agent_leave_notes[index]) {
                factories.invalidDataPop($translate.instant("Please Enter Note"));
                return;
            }
            $scope.agent_leave_notes.push('');
        }

        $scope.removeNote = function (index) {
            $scope.agent_leave_notes.splice(index, 1);
        }

        $scope.updateAgentLeaveNotes = function (form) {
            if (form.$invalid) {
                return;
            }
            var param_data = {};
            param_data['leave_notes_reasons'] = $scope.agent_leave_notes.join('#');
            services.POST_FORM_DATA(param_data, API.UPDATE_ADMIN_SETTINGS, function (response) {
                $scope.message = `${$translate.instant('Settings updated successfully')}`;
                services.SUCCESS_MODAL(true);
            })

        }

        /**************************************Adding rejection reasons*******************************************/
        $scope.addRejectionReasons = function (index) {
            console.log($scope.array_rejection_reasons[index])
            if (!$scope.array_rejection_reasons[index]) {
                factories.invalidDataPop($translate.instant("Please Enter A Reason"));
                return;
            }
            $scope.array_rejection_reasons.push('');
        }

        $scope.removeRejectionReasons = function (index) {
            $scope.array_rejection_reasons.splice(index, 1);
        }

        $scope.updateRejectionReasons = function (form) {
            if (form.$invalid) {
                return;
            }
            var param_data = {};
            param_data['rejection_reasons'] = $scope.array_rejection_reasons.join('#');
            services.POST_FORM_DATA(param_data, API.UPDATE_ADMIN_SETTINGS, function (response) {
                $scope.message = `${$translate.instant('Settings updated successfully')}`;
                services.SUCCESS_MODAL(true);
            })
        }
        /*****************************************************************************************************************/


        $scope.loadTipSettings = function () {
            if (factories.getSettings().key_value) {
                $scope.tipShowHideSettingsList.forEach(element => {
                    switch (element.name) {
                        case 'Show Tip':
                            element.showFor = factories.getSettings().key_value.show_tip;
                            break;
                        case 'Show Item Price':
                            element.showFor = factories.getSettings().key_value.show_item_price;
                            break;
                        case 'Show Total Price':
                            element.showFor = factories.getSettings().key_value.show_total_price;
                            break;
                        case 'Show KM':
                            element.showFor = factories.getSettings().key_value.show_km;
                            break;
                        case 'Show Commission':
                            element.showFor = factories.getSettings().key_value.show_comission;
                            break;
                    }
                });
                $scope.tipRequestShowHideSettingsList.forEach(element => {
                    switch (element.name) {
                        case 'Show Tip':
                            element.isShow = factories.getSettings().key_value.req_show_tip;
                            break;
                        case 'Show Item Price':
                            element.isShow = factories.getSettings().key_value.req_show_item_price;
                            break;
                        case 'Show Total Price':
                            element.isShow = factories.getSettings().key_value.req_show_total_price;
                            break;
                        case 'Show KM':
                            element.isShow = factories.getSettings().key_value.req_show_km;
                            break;
                        case 'Show Commission':
                            element.isShow = factories.getSettings().key_value.req_show_comission;
                            break;
                    }
                });
            }
        }
        $scope.loadTipSettings();
        $scope.updateTipSettings = function (showHideTipForm) {
            $scope.tipShowHideSettingsList.forEach(element => {
                switch (element.name) {
                    case 'Show Tip':
                        $scope.tipShowHideDataObj.show_tip = element.showFor;
                        break;
                    case 'Show Item Price':
                        $scope.tipShowHideDataObj.show_item_price = element.showFor;
                        break;
                    case 'Show Total Price':
                        $scope.tipShowHideDataObj.show_total_price = element.showFor;
                        break;
                    case 'Show KM':
                        $scope.tipShowHideDataObj.show_km = element.showFor;
                        break;
                    case 'Show Commission':
                        $scope.tipShowHideDataObj.show_comission = element.showFor;
                        break;
                }
            });
            $scope.tipRequestShowHideSettingsList.forEach(element => {
                switch (element.name) {
                    case 'Show Tip':
                        $scope.tipShowHideDataObj.req_show_tip = element.isShow;
                        break;
                    case 'Show Item Price':
                        $scope.tipShowHideDataObj.req_show_item_price = element.isShow;
                        break;
                    case 'Show Total Price':
                        $scope.tipShowHideDataObj.req_show_total_price = element.isShow;
                        break;
                    case 'Show KM':
                        $scope.tipShowHideDataObj.req_show_km = element.isShow;
                        break;
                    case 'Show Commission':
                        $scope.tipShowHideDataObj.req_show_comission = element.isShow;
                        break;
                }
            });
            $scope.isSavingTipShowHideSetting = true;
            $scope.updateSettings();
        }

        $scope.loadShowSupplierInfoSettings = function () {
            if (factories.getSettings().key_value) {
                $scope.showSuplierInfoSettingsList.forEach(element => {
                    switch (element.name) {
                        case 'Supplier Phone':
                            element.isShow = factories.getSettings().key_value.show_supplier_phone;
                            break;
                        case 'Supplier Email':
                            element.isShow = factories.getSettings().key_value.show_supplier_email;
                            break;
                        case 'Supplier Delivery Timing':
                            element.isShow = factories.getSettings().key_value.show_supplier_delivery_timing;
                            break;
                        case 'Supplier Open Close':
                            element.isShow = factories.getSettings().key_value.show_supplier_open_close;
                            break;
                        case 'Show Supplier Nationality':
                            element.isShow = factories.getSettings().key_value.show_supplier_nationality;
                            break;
                        case 'Supplier Speciality':
                            element.isShow = factories.getSettings().key_value.show_supplier_speciality;
                            break;
                        case 'Supplier Brand':
                            element.isShow = factories.getSettings().key_value.show_supplier_brand_name;
                            break;
                        case 'Supplier Address Hide':
                            element.isShow = factories.getSettings().key_value.hide_supplier_address;
                            break;
                        case 'Supplier Categories':
                            element.isShow = factories.getSettings().key_value.show_supplier_categories;
                            break;
                    }
                });
            }
        }
        $scope.loadShowSupplierInfoSettings();
        $scope.updateShowSuplierInfoSettings = function (showSuplierInfoSettingsForm) {
            $scope.showSuplierInfoSettingsList.forEach(element => {
                switch (element.name) {
                    case 'Supplier Phone':
                        $scope.show_supplier_info_details.show_supplier_phone = element.isShow;
                        break;
                    case 'Supplier Email':
                        $scope.show_supplier_info_details.show_supplier_email = element.isShow;
                        break;
                    case 'Supplier Delivery Timing':
                        $scope.show_supplier_info_details.show_supplier_delivery_timing = element.isShow;
                        break;
                    case 'Supplier Open Close':
                        $scope.show_supplier_info_details.show_supplier_open_close = element.isShow;
                        break;
                    case 'Show Supplier Nationality':
                        $scope.show_supplier_info_details.show_supplier_nationality = element.isShow;
                        break;
                    case 'Supplier Speciality':
                        $scope.show_supplier_info_details.show_supplier_speciality = element.isShow;
                        break;
                    case 'Supplier Brand':
                        $scope.show_supplier_info_details.show_supplier_brand_name = element.isShow;
                        break;
                    case 'Supplier Address Hide':
                        $scope.show_supplier_info_details.hide_supplier_address = element.isShow;
                        break;
                    case 'Supplier Categories':
                        $scope.show_supplier_info_details.show_supplier_categories = element.isShow;
                        break;
                }
            });
            $scope.isShowSupplierInfoSettings = true;
            param_data = $scope.show_supplier_info_details;
            services.POST_FORM_DATA(param_data, API.UPDATE_ADMIN_SETTINGS, function (response) {
                $scope.message = `${$translate.instant('Settings updated successfully')}`;
                services.SUCCESS_MODAL(true);
            })
        }

        $scope.updateHomeScreenUi = function (form) {
            var param_data = {};
            param_data['home_screen_sections'] = JSON.stringify($scope.home_screen_sections);
            services.POST_FORM_DATA(param_data, API.UPDATE_ADMIN_SETTINGS, function (response) {
                $scope.message = `${$translate.instant('Settings updated successfully')}`;
                services.SUCCESS_MODAL(true);
            })
        }
        $scope.updateOrderTypeSection = function (form) {
            var param_data = {};
            param_data['order_type_sections'] = JSON.stringify($scope.order_type_sections);
            services.POST_FORM_DATA(param_data, API.UPDATE_ADMIN_SETTINGS, function (response) {
                $scope.message = `${$translate.instant('Settings updated successfully')}`;
                services.SUCCESS_MODAL(true);
            })
        }






        // setTimeout(() => {
        //     if ($stateParams && $stateParams.supplier_id && $rootScope.is_flavor_of_week_enable) {
        //         $scope.supplier_id_for_flavor_of_week = $stateParams.supplier_id;
        //         $scope.tabSwitch(7);
        //     }
        // }, 4000);



        $scope.file_to_upload_for_flavor_of_week = function (File, index) {
            var file = File[0];
            if (constants.IMAGE_TYPE.includes(file.type)) {
                if ((file.size / Math.pow(1024, 2)) <= 1) {
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        $scope.$apply(function () {
                            switch (index) {
                                case 1:
                                    $scope.uploadImage(File[0], function (err, imageUrl) {
                                        $scope.flavor_of_week.image_one = imageUrl;
                                    })
                                    break;
                                case 2:
                                    $scope.uploadImage(File[0], function (err, imageUrl) {
                                        $scope.flavor_of_week.image_two = imageUrl;
                                    })
                                    break;
                                case 3:
                                    $scope.uploadImage(File[0], function (err, imageUrl) {
                                        $scope.flavor_of_week.image_three = imageUrl;
                                    })
                                    break;
                            }
                        });
                    }
                } else {
                    factories.invalidDataPop($translate.instant("Image size must be less than 1mb"));
                }
            } else {
                factories.invalidDataPop($translate.instant("Invalid File Type"));
            }
        };


        $scope.updateFlavorOfTheWeek = function (flavorWeekForm) {
            var param_data = {
                flavor_of_week: JSON.stringify($scope.flavor_of_week),
                supplier_id: $scope.supplier_id_for_flavor_of_week,
                is_flavor_of_week: 1
            }
            services.POST_DATA(param_data, API.ADD_EDIT_FLAVOR_OF_WEEK, function (response) {
                $scope.message = `${$translate.instant('Flavor of the week added successfully')}`;
                services.SUCCESS_MODAL(true);
            })
        }






        $scope.loadTutorialScreens = function () {
            if (factories.getSettings().key_value && factories.getSettings().key_value.tutorial_screens) {
                var tt_screens = JSON.parse(factories.getSettings().key_value.tutorial_screens);
                tt_screens.forEach((element, index) => {
                    switch (index) {
                        case 0:
                            $scope.tutorial_screens_obj.tt1.tutorial_image = element.tutorial_image;
                            $scope.tutorial_screens_obj.tt1.tutorial_text = element.tutorial_text;
                            $scope.tutorial_screens_obj.tt1.tutorial_title = element.tutorial_title;
                            break;
                        case 1:
                            $scope.tutorial_screens_obj.tt2.tutorial_image = element.tutorial_image;
                            $scope.tutorial_screens_obj.tt2.tutorial_text = element.tutorial_text;
                            $scope.tutorial_screens_obj.tt2.tutorial_title = element.tutorial_title;
                            break;
                        case 2:
                            $scope.tutorial_screens_obj.tt3.tutorial_image = element.tutorial_image;
                            $scope.tutorial_screens_obj.tt3.tutorial_text = element.tutorial_text;
                            $scope.tutorial_screens_obj.tt3.tutorial_title = element.tutorial_title;
                            break;
                    }
                });
            }
        }
        $scope.loadTutorialScreens();
        //tutorial screen section
        $scope.file_to_upload_for_tutorial_screen = function (File, section) {
            var file = File[0];
            if (constants.IMAGE_TYPE.includes(file.type)) {
                if ((file.size / Math.pow(1024, 2)) <= 1) {
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        $scope.$apply(function () {
                            switch (section) {
                                case 1:
                                    $scope.uploadImage(File[0], function (err, imageUrl) {
                                        $scope.tutorial_screens_obj.tt1.tutorial_image = imageUrl;
                                    })
                                    break;

                                case 2:
                                    $scope.uploadImage(File[0], function (err, imageUrl) {
                                        $scope.tutorial_screens_obj.tt2.tutorial_image = imageUrl;
                                    })
                                    break;

                                case 3:
                                    $scope.uploadImage(File[0], function (err, imageUrl) {
                                        $scope.tutorial_screens_obj.tt3.tutorial_image = imageUrl;
                                    })
                                    break;
                            }
                        });
                    }
                } else {
                    factories.invalidDataPop($translate.instant("Image size must be less than 1mb"));
                }
            } else {
                factories.invalidDataPop($translate.instant("Invalid File Type"));
            }
        };

        $scope.tutorialScreenSubmit = function (tutorialScreenForm) {
            if (tutorialScreenForm.$submitted && tutorialScreenForm.$invalid) return;
            let tutorial_screens = [
                {
                    tutorial_image: $scope.tutorial_screens_obj.tt1.tutorial_image,
                    tutorial_text: $scope.tutorial_screens_obj.tt1.tutorial_text,
                    tutorial_title: $scope.tutorial_screens_obj.tt1.tutorial_title
                },
                {
                    tutorial_image: $scope.tutorial_screens_obj.tt2.tutorial_image,
                    tutorial_text: $scope.tutorial_screens_obj.tt2.tutorial_text,
                    tutorial_title: $scope.tutorial_screens_obj.tt2.tutorial_title
                },
                {
                    tutorial_image: $scope.tutorial_screens_obj.tt3.tutorial_image,
                    tutorial_text: $scope.tutorial_screens_obj.tt3.tutorial_text,
                    tutorial_title: $scope.tutorial_screens_obj.tt3.tutorial_title
                }
            ]

            $scope.tutorial_screens = tutorial_screens;
            var param_data = {};
            param_data['tutorial_screens'] = JSON.stringify($scope.tutorial_screens);

            services.POST_FORM_DATA(param_data, API.UPDATE_ADMIN_SETTINGS, function (response) {
                $scope.isSavingTipShowHideSetting = false;
                if (response.data.logo_url) {
                    $rootScope.profile_image = response.data.logo_url;
                    $rootScope.app_image = response.data.logo_url;
                }
                // if (response.data.footer_logo_url) {
                //     $rootScope.profile_image = response.data.footer_logo_url;
                //     $rootScope.app_image = response.data.footer_logo_url;
                // }
                if (response.data.favicon_url) {
                    let link = window.document.getElementById('favicon');
                    let icon = response.data.favicon_url;
                    link.setAttribute('href', icon);
                    localStorage.setItem('fav_icon', icon);
                }

                $scope.message = `${$translate.instant('Settings updated successfully')}`;
                services.SUCCESS_MODAL(true);
            });

        }

        $scope.file_to_upload_for_app_banner = function (File, section, number) {
            var file = File[0];
            if (constants.IMAGE_TYPE.includes(file.type)) {
                if ((file.size / Math.pow(1024, 2)) <= 1) {
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        $scope.$apply(function () {
                            if (section == 'pickup') {
                                switch (number) {
                                    case 1:
                                        $scope.pick_up_banners.file.pickup_url_one = file;
                                        $scope.pick_up_banners.img.one = e.target.result;
                                        break;
                                    case 2:
                                        $scope.pick_up_banners.file.pickup_url_two = file;
                                        $scope.pick_up_banners.img.two = e.target.result;
                                        break;
                                    case 3:
                                        $scope.pick_up_banners.file.pickup_url_three = file;
                                        $scope.pick_up_banners.img.three = e.target.result;
                                        break;
                                }
                            } else {
                                switch (number) {
                                    case 1:
                                        $scope.delivery_banners.file.delivery_url_one = file;
                                        $scope.delivery_banners.img.one = e.target.result;
                                        break;
                                    case 2:
                                        $scope.delivery_banners.file.delivery_url_two = file;
                                        $scope.delivery_banners.img.two = e.target.result;
                                        break;
                                    case 3:
                                        $scope.delivery_banners.file.delivery_url_three = file;
                                        $scope.delivery_banners.img.three = e.target.result;
                                        break;
                                }
                            }
                        });
                    }
                } else {
                    factories.invalidDataPop($translate.instant("Image size must be less than 1mb"));
                }
            } else {
                factories.invalidDataPop($translate.instant("Invalid File Type"));
            }
        }

        $scope.submitPickupDeliveryBanners = function () {
            let form_data = {
                ...$scope.pick_up_banners.file,
                // ...$scope.delivery_banners.file
            }
            services.POST_FORM_DATA(form_data, API.PICKUP_DELIVERY_APP_BANNERS, function (response) {
                $scope.message = `${$translate.instant('Banners updated successfully')}`;
                services.SUCCESS_MODAL(true);
            });
        }

        //story section
        $scope.file_to_upload_for_story_image = function (File, section) {
            var file = File[0];
            if (constants.IMAGE_TYPE.includes(file.type)) {
                if ((file.size / Math.pow(1024, 2)) <= 1) {
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        $scope.$apply(function () {
                            switch (section) {
                                case 1:
                                    $scope.story.sec_1.image = File[0];
                                    $scope.story.sec_1.image_to_view = e.target.result;
                                    break;

                                case 2:
                                    $scope.story.sec_2.image = File[0];
                                    $scope.story.sec_2.image_to_view = e.target.result;
                                    break;

                                case 3:
                                    $scope.story.sec_3.image = File[0];
                                    $scope.story.sec_3.image_to_view = e.target.result;
                                    break;

                                case 4:
                                    $scope.story.sec_4.image = File[0];
                                    $scope.story.sec_4.image_to_view = e.target.result;
                                    break;
                            }
                        });
                    }
                } else {
                    factories.invalidDataPop($translate.instant("Image size must be less than 1mb"));
                }
            } else {
                factories.invalidDataPop($translate.instant("Invalid File Type"));
            }
        };




        $scope.file_to_upload_for_cleanfax = function (File, section) {
            var file = File[0];
            if (constants.IMAGE_TYPE.includes(file.type)) {
                if ((file.size / Math.pow(1024, 2)) <= 1) {
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        $scope.$apply(function () {
                            $scope.uploadImage(File[0], function (err, imageUrl) {
                                $scope.basic_settings.cleanfax_home_image_url = imageUrl;
                            })
                        });
                    }
                } else {
                    factories.invalidDataPop($translate.instant("Image size must be less than 1mb"));
                }
            } else {
                factories.invalidDataPop($translate.instant("Invalid File Type"));
            }
        };

        $scope.cleanFaxFormSubmit = function (cleanFaxForm) {
            if (cleanFaxForm.$submitted && cleanFaxForm.$invalid) return;
            var params = {
                cleanfax_home_heading: $scope.basic_settings.cleanfax_home_heading,
                cleanfax_home_title: $scope.basic_settings.cleanfax_home_title,
                cleanfax_home_image_url: $scope.basic_settings.cleanfax_home_image_url
            }
            services.POST_FORM_DATA(params, API.UPDATE_ADMIN_SETTINGS, function (response) {
                $scope.message = `${$translate.instant('Section updated successfully')}`;
                services.SUCCESS_MODAL(true);
            });
        }




        $scope.updateStorySection = function (storyForm) {
            if (storyForm.$submitted && storyForm.$invalid) return;

            // if (!$scope.story.sec_1.image || !$scope.story.sec_2.image || !$scope.story.sec_3.image) {
            //     factories.invalidDataPop("Please select images");
            //     return;
            // }

            let sections = [
                {
                    title: $scope.story.sec_1.title,
                    description: $scope.story.sec_1.description
                },
                {
                    title: $scope.story.sec_2.title,
                    description: $scope.story.sec_2.description
                },
                {
                    title: $scope.story.sec_3.title,
                    description: $scope.story.sec_3.description
                }
            ];
            if ($scope.story.sec_4.title || $scope.story.sec_4.description) {
                sections.push({
                    title: $scope.story.sec_4.title,
                    description: $scope.story.sec_4.description
                });
            }
            let form_data = {
                sections: JSON.stringify(sections),
                image1: $scope.story.sec_1.image ? $scope.story.sec_1.image : $scope.story.sec_1.image_to_view,
                image2: $scope.story.sec_2.image ? $scope.story.sec_2.image : $scope.story.sec_2.image_to_view,
                image3: $scope.story.sec_3.image ? $scope.story.sec_3.image : $scope.story.sec_3.image_to_view
            }
            if ($scope.story.sec_4.image || $scope.story.sec_4.image_to_view) {
                form_data['image4'] = $scope.story.sec_4.image ? $scope.story.sec_4.image : $scope.story.sec_4.image_to_view;
            }

            services.POST_FORM_DATA(form_data, API.ADD_DESCRIPTION_SECTIONS, function (response) {
                $scope.message = `${$translate.instant('Section updated successfully')}`;
                services.SUCCESS_MODAL(true);
            });
        }

        //placeholders section
        $scope.placeholders = [
            { name: 'LOCATION PAGE BACKGROUND IMAGE', app: { file: '', url: '' }, web: { file: '', url: '' }, key: 'user_location', type: ['image/jpg', 'image/jpeg', 'image/png'] },
            { name: 'EMPTY CART IMAGE', app: { file: '', url: '' }, web: { file: '', url: '' }, key: 'empty_cart', type: ['image/jpg', 'image/jpeg', 'image/png'] },
            { name: `${$translate.instant(factories.localisation().order)}` + " " + `${$translate.instant('Loading Screen GIF')}`, app: null, key: 'order_loader', web: { file: '', url: '' }, type: ['image/gif'] },

            { name: 'LOGIN IMAGE', app: { file: '', url: '' }, web: null, key: 'login_icon_url', type: ['image/jpg', 'image/jpeg', 'image/png'] },
            { name: 'DELIVERY IMAGE', app: { file: '', url: '' }, web: null, key: 'delivery_url', type: ['image/jpg', 'image/jpeg', 'image/png'] },
            { name: 'PICKUP IMAGE', app: { file: '', url: '' }, web: null, key: 'pickup_url', type: ['image/jpg', 'image/jpeg', 'image/png'] },
            { name: `${$translate.instant('INSTRUCTION SCREEN IMAGE')}`, app: { file: '', url: '' }, web: null, key: 'instruction_screen_image', type: ['image/jpg', 'image/jpeg', 'image/png'] },
            { name: 'NO DATA PLACEHOLDER', app: { file: '', url: '' }, web: null, key: 'no_data_image', type: ['image/jpg', 'image/jpeg', 'image/png'] }
        ];

        if (factories.getSettings().key_value.is_user_subscription == 1) {
            $scope.placeholders.push(
                { name: 'USER SUBSCRIPTION PLAN PLACEHOLDER', app: { file: '', url: '' }, web: { file: '', url: '' }, key: 'user_subscription_placeholder', type: ['image/jpg', 'image/jpeg', 'image/png'] },
            );
        }

        if (factories.getSettings().key_value.selected_template == 1 && factories.getSettings().screenFlow[0].app_type == 2) {
            $scope.placeholders.push({ name: 'Website Background Image', app: null, web: { file: '', url: '' }, key: 'website_background', type: ['image/jpg', 'image/jpeg', 'image/png'] });
        }

        $scope.placeholders.forEach(placeholder => {
            let key_value = (factories.getSettings()).key_value;
            if (key_value[placeholder.key] && factories.IsJsonString(key_value[placeholder.key])) {
                if (placeholder.web) {
                    (placeholder.web).url = JSON.parse(key_value[placeholder.key]).web;
                }
                if (placeholder.app) {
                    (placeholder.app).url = JSON.parse(key_value[placeholder.key]).app;
                }
            }
        });

        $scope.selectPlaceholder = function (placeholder) {
            $scope.selected_placeholder = placeholder;
        }

        $scope.file_to_upload_for_placeholder = function (File, type) {
            var file = File[0];
            if (($scope.selected_placeholder.type).includes(file.type) && $scope.selected_placeholder) {
                if ((file.size / Math.pow(1024, 2)) <= 1) {
                    if (type == 'app') {
                        $scope.selected_placeholder.app.file = File[0];
                    } else {
                        $scope.selected_placeholder.web.file = File[0];
                    }
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        $scope.$apply(function () {
                            if (type == 'app') {
                                $scope.selected_placeholder.app.url = e.target.result;
                            } else {
                                $scope.selected_placeholder.web.url = e.target.result;
                            }
                        });
                    }
                } else {
                    factories.invalidDataPop($translate.instant("Image size must be less than 2mb"));
                }
            } else {
                factories.invalidDataPop($translate.instant("Invalid File Type"));
            }
        };

        $scope.uploadPlaceholder = function (placeholder) {
            let form_data = {
                key: placeholder.key,
                web: placeholder.web ? ((placeholder.web).file ? (placeholder.web).file : (placeholder.web).url) : '',
                app: placeholder.app ? ((placeholder.app).file ? (placeholder.app).file : (placeholder.app).url) : ''
            }
            services.PUT_FORM_DATA(form_data, API.UPDATE_PLACEHOLDERS, function (response) {
                $scope.message = `${$translate.instant('Placeholders updated successfully')}`;
                services.SUCCESS_MODAL(true);
            });
        }

        //basic section
        var components = {
            preview: true,
            opacity: true,
            hue: true,     // Hue slider
            output: {
                hex: true,
                rgba: false,
                hsla: false,
                hsva: false,
                cmyk: false,
                input: false
            },
            interaction: {
                hex: true,  // hex option  (hexadecimal representation of the rgba value)
                rgba: true, // rgba option (red green blue and alpha)
                input: true, // input / output element
                save: true   // Save button
            }
        }

        var strings = {
            save: 'Save',  // Default for save button
        }

        var initColorPickers = function (data) {
            const theme_color = new Pickr({
                el: '.theme_color',
                theme: 'classic',
                default: $rootScope.primary_color || '',
                components: components,
                strings: strings
            });

            const element_color = new Pickr({
                el: '.element_color',
                theme: 'classic',
                default: '#484848',
                components: components,
                strings: strings
            });

            const header_color = new Pickr({
                el: '.header_color',
                theme: 'classic',
                default: '#ffffff',
                components: components,
                strings: strings
            });

            const header_text_color = new Pickr({
                el: '.header_text_color',
                theme: 'classic',
                default: '#484848',
                components: components,
                strings: strings
            });

            let element_shadow_color;
            let element_theme2_color;
            if ($rootScope.enable_panel_theme == 1) {
                element_shadow_color = new Pickr({
                    el: '.element_shadow_color',
                    theme: 'classic',
                    default: '#2ca5b133',
                    components: components,
                    strings: strings
                });
            }

            if ($rootScope.enable_second_theme_color == 1) {
                element_theme2_color = new Pickr({
                    el: '.element_theme2_color',
                    theme: 'classic',
                    default: $rootScope.primary_color || '',
                    components: components,
                    strings: strings
                });
            }

            let current_theme_color = (data).find(el => el.key === 'theme_color');
            let current_element_color = (data).find(el => el.key === 'element_color');
            let current_header_color = (data).find(el => el.key === 'header_color');
            let current_header_text_color = (data).find(el => el.key === 'header_text_color');
            let current_element_shadow_color;
            if ($rootScope.enable_panel_theme == 1) {
                current_element_shadow_color = (data).find(el => el.key === 'element_shadow_color');
            }

            let current_element_theme2_color;
            if ($rootScope.enable_second_theme_color == 1) {
                current_element_theme2_color = (data).find(el => el.key === 'element_theme2_color');
            }

            setTimeout(() => {
                if (!!current_theme_color && current_theme_color.value) {
                    $scope.app_colors.theme_color = current_theme_color.value;
                    theme_color.setColor(current_theme_color.value);
                }
                if (!!current_element_color && current_element_color.value) {
                    $scope.app_colors.element_color = current_element_color.value;
                    element_color.setColor(current_element_color.value);
                }
                if (!!current_header_color && current_header_color.value) {
                    $scope.app_colors.header_color = current_header_color.value;
                    header_color.setColor(current_header_color.value);
                }
                if (!!current_header_text_color && current_header_text_color.value) {
                    $scope.app_colors.header_text_color = current_header_text_color.value;
                    header_text_color.setColor(current_header_text_color.value);
                }

                if ($rootScope.enable_panel_theme == 1 && !!current_element_shadow_color && current_element_shadow_color.value) {
                    $scope.app_colors.element_shadow_color = current_element_shadow_color.value;
                    element_shadow_color.setColor(current_element_shadow_color.value);
                }

                if ($rootScope.enable_second_theme_color == 1 && !!current_element_theme2_color && current_element_theme2_color.value) {
                    $scope.app_colors.element_theme2_color = current_element_theme2_color.value;
                    element_theme2_color.setColor(current_element_theme2_color.value);
                }
            }, 500);

            theme_color.on('save', (color, instance) => {
                $scope.app_colors.theme_color = color.toHEXA().toString();
            });

            element_color.on('save', (color, instance) => {
                $scope.app_colors.element_color = color.toHEXA().toString();
            });

            header_color.on('save', (color, instance) => {
                $scope.app_colors.header_color = color.toHEXA().toString();
            });

            header_text_color.on('save', (color, instance) => {
                $scope.app_colors.header_text_color = color.toHEXA().toString();
            });

            if ($rootScope.enable_panel_theme == 1) {
                element_shadow_color.on('save', (color, instance) => {
                    $scope.app_colors.element_shadow_color = color.toHEXA().toString();
                });
            }

            if ($rootScope.enable_second_theme_color == 1) {
                element_theme2_color.on('save', (color, instance) => {
                    $scope.app_colors.element_theme2_color = color.toHEXA().toString();
                });
            }
        }


        $scope.getBasicSettings = function () {
            services.GET_DATA({}, API.GET_BASIC_SETTINGS, function (response) {
                let logo = (response.data).find(el => el.key === 'logo_url');
                let footer_logo = (response.data).find(el => el.key === 'footer_logo_url');
                console.log("footer logo", footer_logo)
                // let logoHeight = (response.data).find(el => el.key === 'logoHeight');
                let favicon = (response.data).find(el => el.key === 'favicon_url');
                let payment_method = (response.data).find(el => el.key === 'payment_method');
                let brandImage = (response.data).find(el => el.key === 'brandImage_url');
                let waiting_charges = (response.data).find(el => el.key === 'waiting_charges');
                let payment_through_wallet_discount = (response.data).find(el => el.key === 'payment_through_wallet_discount');
                let referral = (response.data).find(el => el.key === 'referral_feature');
                let referral_receive_price = (response.data).find(el => el.key === 'referral_receive_price');
                let referral_given_price = (response.data).find(el => el.key === 'referral_given_price');
                let email = (response.data).find(el => el.key === 'email');
                let desc_section = (response.data).find(el => el.key === 'description_sections');
                let app_sharing_message = (response.data).find(el => el.key === 'app_sharing_message');
                let web_meta_description = (response.data).find(el => el.key === 'web_meta_description');
                let web_meta_title = (response.data).find(el => el.key === 'web_meta_title');
                let web_meta_keywords = (response.data).find(el => el.key === 'web_meta_keywords');
                let agent_android_app_url = (response.data).find(el => el.key === 'agent_android_app_url');
                let agent_ios_app_url = (response.data).find(el => el.key === 'agent_ios_app_url');
                let android_app_url = (response.data).find(el => el.key === 'android_app_url');
                let ios_app_url = (response.data).find(el => el.key === 'ios_app_url');
                let footer_mockup_image = (response.data).find(el => el.key === 'footer_mockup_image');
                let footer_mockup_title = (response.data).find(el => el.key === 'footer_mockup_title');
                let footer_mockup_description = (response.data).find(el => el.key === 'footer_mockup_description');
                let fackbook_link = (response.data).find(el => el.key === 'fackbook_link');
                let twitter_link = (response.data).find(el => el.key === 'twitter_link');
                let google_link = (response.data).find(el => el.key === 'google_link');
                let linkedin_link = (response.data).find(el => el.key === 'linkedin_link');
                let instagram_link = (response.data).find(el => el.key === 'instagram_link');
                let youtube_link = (response.data).find(el => el.key === 'youtube_link');
                if (factories.getSettings().key_value.social_media_icons_horizontally_aligned == 1) {
                    var blog_link = (response.data).find(el => el.key === 'blog_link');
                }
                let singleFoodBottomBanner1 = (response.data).find(el => el.key === 'singleFoodBottomBanner1');
                let singleFoodBottomBanner2 = (response.data).find(el => el.key === 'singleFoodBottomBanner2');
                let singleFoodStoryBackground = (response.data).find(el => el.key === 'singleFoodStoryBackground');
                let single_vendor_popular_text = (response.data).find(el => el.key === 'single_vendor_popular_text');
                let single_vendor_offer_text = (response.data).find(el => el.key === 'single_vendor_offer_text');
                let max_order_weight = (response.data).find(el => el.key === 'max_order_weight');
                let agent_verification_code_on_status = (response.data).find(el => el.key === 'agent_verification_code_on_status');
                let enable_user_signature = (response.data).find(el => el.key === 'enable_user_signature');
                let table_booking_distance = (response.data).find(el => el.key === 'table_booking_distance');
                let table_booking_time = (response.data).find(el => el.key === 'table_booking_time');
                let schedule_time_buffer = (response.data).find(el => el.key === 'schedule_time_buffer');
                let agent_delivery_radius = (response.data).find(el => el.key === 'agent_delivery_radius');
                if ($rootScope.enable_surge_price == 1) {
                    var max_order_charge = (response.data).find(el => el.key === 'max_order_charge')
                }

                let glassdoor_link = (response.data).find(el => el.key === 'glassdoor_link');
                let google_pay_merchant_id = (response.data).find(el => el.key === 'google_pay_merchant_id');
                let min_loyalty_points_to_redeem = (response.data).find(el => el.key === 'min_loyalty_points_to_redeem');
                let min_order_amount_for_loyality_points = (response.data).find(el => el.key === 'min_order_amount_for_loyality_points');
                let loyality_point_per_order = (response.data).find(el => el.key === 'loyality_point_per_order');
                let footer_ad_image = (response.data).find(el => el.key === 'footer_ad_image');
                if ($rootScope.enable_surge_price == 1) {
                    var surge_price = (response.data).find(el => el.key === 'surge_price')
                }
                if (factories.getSettings().key_value.minimum_order_fee == 1) {
                    var minimum_subtotal_for_small_order_fee = (response.data).find(el => el.key === 'minimum_subtotal_for_small_order_fee');
                    var small_order_fee = (response.data).find(el => el.key === 'small_order_fee')
                }


                $scope.logo_url = logo ? logo.value : '';
                $scope.footer_logo_url = footer_logo ? footer_logo.value : '';
                // $scope.basic_settings.logoHeight = logoHeight ? logoHeight.value : '';
                $scope.logo_image = logo ? logo.value : '';
                $scope.logo_image1 = footer_logo ? footer_logo.value : '';

                $scope.favicon_url = favicon ? favicon.value : '';
                $scope.favicon_image = favicon ? favicon.value : '';
                $scope.login_background_url = brandImage ? brandImage.value : '';
                $scope.login_background_image = brandImage ? brandImage.value : '';
                $scope.basic_settings.waiting_charges = waiting_charges ? parseFloat(waiting_charges.value) : 0;
                $scope.basic_settings.payment_through_wallet_discount = payment_through_wallet_discount ? parseFloat(payment_through_wallet_discount.value) : 0;
                $scope.basic_settings.payment_method = payment_method ? payment_method.value : 0;
                $scope.show_referral = referral ? parseInt(referral.value) : 0;
                $scope.basic_settings.referral_send = referral_receive_price ? parseFloat(referral_receive_price.value) : '';
                $scope.basic_settings.referral_receive = referral_given_price ? parseFloat(referral_given_price.value) : '';
                $scope.basic_settings.email = email ? email.value : '';
                $scope.basic_settings.app_sharing_message = app_sharing_message ? app_sharing_message.value : '';
                $scope.basic_settings.web_meta_description = web_meta_description ? web_meta_description.value : '';
                $scope.basic_settings.web_meta_title = web_meta_title ? web_meta_title.value : '';
                $scope.basic_settings.agent_android_app_url = agent_android_app_url ? agent_android_app_url.value : '';
                $scope.basic_settings.agent_ios_app_url = agent_ios_app_url ? agent_ios_app_url.value : '';
                $scope.basic_settings.android_app_url = android_app_url ? android_app_url.value : '';
                $scope.basic_settings.ios_app_url = ios_app_url ? ios_app_url.value : '';
                $scope.footer_mockup_image = footer_mockup_image ? footer_mockup_image.value : '';
                $scope.basic_settings.footer_mockup_title = footer_mockup_title ? footer_mockup_title.value : '';
                $scope.basic_settings.footer_mockup_description = footer_mockup_description ? footer_mockup_description.value : '';
                $scope.basic_settings.fackbook_link = fackbook_link ? fackbook_link.value : '';
                $scope.basic_settings.twitter_link = twitter_link ? twitter_link.value : '';
                $scope.basic_settings.google_link = google_link ? google_link.value : '';
                $scope.basic_settings.linkedin_link = linkedin_link ? linkedin_link.value : '';
                $scope.basic_settings.youtube_link = youtube_link ? youtube_link.value : '';
                $scope.basic_settings.instagram_link = instagram_link ? instagram_link.value : '';
                if (factories.getSettings().key_value.social_media_icons_horizontally_aligned == 1) {
                    $scope.basic_settings.blog_link = blog_link ? blog_link.value : '';
                }
                $scope.singleFoodImage1 = singleFoodBottomBanner1 ? singleFoodBottomBanner1.value : '';
                $scope.singleFoodImage2 = singleFoodBottomBanner2 ? singleFoodBottomBanner2.value : '';
                $scope.singleFoodStoryImage = singleFoodStoryBackground ? singleFoodStoryBackground.value : '';
                $scope.single_vendor_text.popular_text = single_vendor_popular_text ? single_vendor_popular_text.value : '';
                $scope.single_vendor_text.offer_text = single_vendor_offer_text ? single_vendor_offer_text.value : '';
                $scope.basic_settings.max_order_weight = max_order_weight ? parseFloat(max_order_weight.value) : '';
                $scope.basic_settings.agent_verification_code_on_status = agent_verification_code_on_status ? agent_verification_code_on_status.value : ''
                $scope.basic_settings.table_booking_distance = table_booking_distance ? parseFloat(table_booking_distance.value) : '';
                $scope.basic_settings.table_booking_time = table_booking_time ? parseFloat(table_booking_time.value) : '';
                $scope.basic_settings.schedule_time_buffer = schedule_time_buffer ? parseFloat(schedule_time_buffer.value) : '';
                $scope.basic_settings.agent_delivery_radius = agent_delivery_radius ? parseFloat(agent_delivery_radius.value) : '';
                $scope.basic_settings.enable_user_signature = enable_user_signature ? enable_user_signature.value : '';
                $scope.basic_settings.glassdoor_link = glassdoor_link ? glassdoor_link.value : '';
                $scope.basic_settings.google_pay_merchant_id = google_pay_merchant_id ? google_pay_merchant_id.value : '';
                $scope.basic_settings.web_meta_keywords = web_meta_keywords ? web_meta_keywords.value : '';

                $scope.basic_settings.min_loyalty_points_to_redeem = min_loyalty_points_to_redeem ? (Number)(min_loyalty_points_to_redeem.value) : 0
                $scope.basic_settings.min_order_amount_for_loyality_points = min_order_amount_for_loyality_points ? (Number)(min_order_amount_for_loyality_points.value) : 0;
                $scope.basic_settings.loyality_point_per_order = loyality_point_per_order ? (Number)(loyality_point_per_order.value) : 0
                $scope.advertisment_image_to_view = (footer_ad_image && footer_ad_image.value) ? footer_ad_image.value : ''

                if ($rootScope.enable_surge_price) {
                    $scope.basic_settings.surge_price = surge_price ? surge_price.value : '';
                }
                if ($rootScope.enable_surge_price == 1) {
                    $scope.basic_settings.max_order_charge = max_order_charge ? parseFloat(max_order_charge.value) : 0;
                }
                if (factories.getSettings().key_value.minimum_order_fee == 1) {
                    $scope.basic_settings.minimum_subtotal_for_small_order_fee = minimum_subtotal_for_small_order_fee ? parseFloat(minimum_subtotal_for_small_order_fee.value) : '';
                    $scope.basic_settings.small_order_fee = small_order_fee ? parseFloat(small_order_fee.value) : '';
                }


                if (!!desc_section) {
                    let section = JSON.parse(desc_section.value);
                    if (section && section.length) {
                        section.map((sec, index) => {
                            let key = 'sec_' + (index + 1);
                            $scope.story[key].title = sec.title;
                            $scope.story[key].description = sec.description;
                            $scope.story[key].image_to_view = sec.image;
                        });
                    }
                }
                initColorPickers(response.data);

                $scope.loadKeyValuesSettings();
            });
        }
        $scope.getBasicSettings();


        $scope.getSettings = function () {
            services.GET_DATA({}, API.GET_SETTINGS, function (response) {
                $scope.user_app_version = response.data.user_app_version[0];
                if (!$scope.user_app_version.version_ios) {
                    $scope.user_app_version.version_ios = '';
                }
                if (!$scope.user_app_version.version_android) {
                    $scope.user_app_version.version_android = '';
                }
            })
        }
        $scope.getSettings();

        $scope.updateUserAppVersion = function (userAppVersionForm) {
            if (userAppVersionForm.$invalid) {
                return;
            }
            var data = {
                id: $scope.user_app_version.id,
                version_ios: $scope.user_app_version.version_ios,
                version_android: $scope.user_app_version.version_android,
                is_update_ios: $scope.user_app_version.is_update_ios,
                is_update_android: $scope.user_app_version.is_update_android,
            }
            services.POST_FORM_DATA(data, API.UPDATE_USER_APP_VERSION, (response) => {
                if (response && response.data) {
                    $scope.message = `${$translate.instant('Settings updated successfully')}`;
                    services.SUCCESS_MODAL(true);
                    $scope.getSettings();
                }
            })


        }


        $scope.$on("fileSelected", function (event, args) {
            $scope.$apply(function () {
                $scope.files.push(args.file);
            });
        });

        $scope.uploadImage = function (file, callback) {     // Get Image Url
            if (!file) {
                return callback(null, file)
            }

            const data = {
                'file': file
            }

            services.POST_FORM_DATA(data, API.UPLOAD_IMAGE, (response) => {
                if (response && response.data) {
                    return callback(null, response.data)
                }
            })
        }

        $scope.file_to_upload_for_footer_mockup_image = function (File) {
            var file = File[0];
            if (constants.IMAGE_TYPE.includes(file.type)) {
                if ((file.size / Math.pow(1024, 2)) <= 2) {
                    $scope.footer_mockup_file = File[0];
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        $scope.$apply(function () {
                            $scope.footer_mockup_image = e.target.result;
                        });
                    }
                } else {
                    factories.invalidDataPop($translate.instant("Image size must be less than 2mb"));
                }
            } else {
                factories.invalidDataPop($translate.instant("Invalid File Type"));
            }
        };

        /* Get to be uploading file and set it into a variable and read to show it on view */
        $scope.file_to_upload_for_image_web = function (File) {
            var file = File[0];
            if (constants.IMAGE_TYPE.includes(file.type)) {
                if ((file.size / Math.pow(1024, 2)) <= 1) {
                    $scope.logo = File[0];
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        $scope.$apply(function () {
                            $scope.logo_image = e.target.result;
                        });
                    }
                } else {
                    factories.invalidDataPop($translate.instant("Image size must be less than 1mb"));
                }
            } else {
                factories.invalidDataPop($translate.instant("Invalid File Type"));
            }
        };

        $scope.file_to_upload_for_image_web1 = function (File) {
            var file = File[0];
            if (constants.IMAGE_TYPE.includes(file.type)) {
                if ((file.size / Math.pow(1024, 2)) <= 1) {
                    $scope.footer_logo = File[0];
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        $scope.$apply(function () {
                            $scope.logo_image1 = e.target.result;
                        });
                    }
                } else {
                    factories.invalidDataPop($translate.instant("Image size must be less than 1mb"));
                }
            } else {
                factories.invalidDataPop($translate.instant("Invalid File Type"));
            }
        };


        $scope.file_to_upload_for_login_background = function (File) {
            var file = File[0];
            if (constants.IMAGE_TYPE.includes(file.type)) {
                if ((file.size / Math.pow(1024, 2)) <= 2) {
                    $scope.login_background = File[0];
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        $scope.$apply(function () {
                            $scope.login_background_image = e.target.result;
                        });
                    }
                } else {
                    factories.invalidDataPop($translate.instant("Image size must be less than 2mb"));
                }
            } else {
                factories.invalidDataPop($translate.instant("Invalid File Type"));
            }
        };

        $scope.file_to_upload_for_favicon = function (File) {
            var file = File[0];
            if (['image/vnd.microsoft.icon', 'image/x-icon', 'image/jpg', 'image/jpeg', 'image/png'].includes(file.type)) {
                if ((file.size / Math.pow(1024, 2)) <= 1) {
                    var imageType = /image.*/;
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        $scope.$apply(function () {
                            $scope.favicon_image = e.target.result;
                            $scope.favicon = File[0];

                            // setTimeout(() => {
                            // let myImg = document.querySelector("#fav_icon");
                            // let realWidth = myImg.naturalWidth;
                            // let realHeight = myImg.naturalHeight;
                            // if (realWidth <= 600 && realHeight <= 600) {
                            //     $scope.favicon = File[0];
                            // } else {
                            //     factories.invalidDataPop("Dimensions must be less than 600 x 600");
                            // }
                            // }, 500);
                        });
                    }
                    if (!file.type.match(imageType)) {
                        factories.invalidDataPop($translate.instant("Invalid file type selected"));
                    }
                } else {
                    factories.invalidDataPop($translate.instant("Image size must be less than 1mb"));
                }
            } else {
                factories.invalidDataPop($translate.instant("Invalid File Type"));
            }
        };

        $scope.changePaymentType = function (payment_type) {
            $scope.basic_settings.payment_method = payment_type;
        }

        $scope.updateSettings = function (addBasicSettingsForm) {
            if (!$scope.isSavingTipShowHideSetting) {
                if (addBasicSettingsForm.$submitted && addBasicSettingsForm.$invalid) {
                    return;
                }
            }

            let param_data = { ...$scope.app_colors };
            param_data.logo_url = $scope.logo ? $scope.logo : $scope.logo_url;
            param_data.footer_logo_url = $scope.footer_logo ? $scope.footer_logo : $scope.footer_logo_url;

            // param_data.logoHeight = $scope.basic_settings.logoHeight
            param_data.payment_method = $scope.basic_settings.payment_method;
            param_data.favicon_url = $scope.favicon ? $scope.favicon : $scope.favicon_url;
            param_data.brandImage_url = $scope.login_background ? $scope.login_background : $scope.login_background_url;
            param_data.waiting_charges = $scope.basic_settings.waiting_charges;
            param_data.email = $scope.basic_settings.email;
            param_data.app_sharing_message = $scope.basic_settings.app_sharing_message;
            param_data.web_meta_description = $scope.basic_settings.web_meta_description;
            param_data.web_meta_keywords = $scope.basic_settings.web_meta_keywords;
            param_data.web_meta_title = $scope.basic_settings.web_meta_title;
            param_data.agent_android_app_url = $scope.basic_settings.agent_android_app_url;
            param_data.agent_ios_app_url = $scope.basic_settings.agent_ios_app_url;
            param_data.android_app_url = $scope.basic_settings.android_app_url;
            param_data.ios_app_url = $scope.basic_settings.ios_app_url;
            param_data.payment_through_wallet_discount = $scope.basic_settings.payment_through_wallet_discount;
            param_data.agent_delivery_radius = $scope.basic_settings.agent_delivery_radius;

            if ($rootScope.enable_surge_price == 1) {
                param_data.max_order_charge = $scope.basic_settings.max_order_charge;
            }


            if ($rootScope.enable_surge_price == 1) {
                param_data.surge_price = $scope.basic_settings.surge_price;
            }


            if ($scope.isSavingTipShowHideSetting) {
                param_data.show_tip = $scope.tipShowHideDataObj.show_tip;
                param_data.show_item_price = $scope.tipShowHideDataObj.show_item_price;
                param_data.show_total_price = $scope.tipShowHideDataObj.show_total_price;
                param_data.show_km = $scope.tipShowHideDataObj.show_km;
                param_data.show_comission = $scope.tipShowHideDataObj.show_comission;
                param_data.req_show_tip = $scope.tipShowHideDataObj.req_show_tip;
                param_data.req_show_item_price = $scope.tipShowHideDataObj.req_show_item_price;
                param_data.req_show_total_price = $scope.tipShowHideDataObj.req_show_total_price;
                param_data.req_show_km = $scope.tipShowHideDataObj.req_show_km;
                param_data.req_show_comission = $scope.tipShowHideDataObj.req_show_comission;
            }


            if ($rootScope.is_product_weight == 1) {
                param_data.max_order_weight = $scope.basic_settings.max_order_weight;
            }

            if ($rootScope.is_table_booking == 1) {
                param_data.table_booking_distance = $scope.basic_settings.table_booking_distance;
                param_data.table_booking_time = $scope.basic_settings.table_booking_time;
            }

            if ($rootScope.display_slot_with_difference == 1) {
                param_data.schedule_time_buffer = $scope.basic_settings.schedule_time_buffer;
            }
            if ($scope.show_referral == 1) {
                param_data.referral_receive_price = $scope.basic_settings.referral_send;
                param_data.referral_given_price = $scope.basic_settings.referral_receive;
            }
            param_data.agent_verification_code_on_status = $scope.basic_settings.agent_verification_code_on_status;
            param_data.enable_user_signature = $scope.basic_settings.enable_user_signature;
            param_data.dropoff_buffer = $scope.basic_settings.dropoff_buffer;
            param_data.eligible_order_amount = $scope.basic_settings.eligible_order_amount;
            param_data.agent_order_request_popup = $scope.basic_settings.agent_order_request_popup;

            param_data.dynamic_order_type_client_wise_delivery = $scope.basic_settings.dynamic_order_type_client_wise_delivery ? 1 : 0;
            param_data.dynamic_order_type_client_wise_pickup = $scope.basic_settings.dynamic_order_type_client_wise_pickup ? 1 : 0;
            param_data.dynamic_order_type_client_wise_dinein = $scope.basic_settings.dynamic_order_type_client_wise_dinein ? 1 : 0;

            param_data.address_reference_char_limit = $scope.basic_settings.address_reference_char_limit;
            param_data.referral_bal_limit_per_order = $scope.basic_settings.referral_bal_limit_per_order;
            param_data.glassdoor_link = $scope.basic_settings.glassdoor_link;
            if ($rootScope.enable_braintree_google_pay == 1) {
                param_data.google_pay_merchant_id = $scope.basic_settings.google_pay_merchant_id;
            }

            param_data.sendPushToAllUserOnSupplierReg = $scope.basic_settings.sendPushToAllUserOnSupplierReg;
            param_data.sendPushToAllUserOnPromoAdd = $scope.basic_settings.sendPushToAllUserOnPromoAdd;

            param_data.min_loyalty_points_to_redeem = $scope.basic_settings.min_loyalty_points_to_redeem;
            param_data.min_order_amount_for_loyality_points = $scope.basic_settings.min_order_amount_for_loyality_points;
            param_data.loyality_point_per_order = $scope.basic_settings.loyality_point_per_order;

            param_data.custom_tax_static_value = $scope.basic_settings.custom_tax_static_value;
            param_data.custom_tax_static_value_flat = $scope.basic_settings.custom_tax_static_value_flat;
            param_data.custom_agent_tip_min_value = $scope.basic_settings.custom_agent_tip_min_value;


            param_data.km_for_fixed_delivery_charges = $scope.basic_settings.km_for_fixed_delivery_charges;
            param_data.fixed_delivery_charge_value = $scope.basic_settings.fixed_delivery_charge_value;
            param_data.fixed_delivery_charge_radius_exceed_value = $scope.basic_settings.fixed_delivery_charge_radius_exceed_value;

            param_data.copy_right_section_contant = $scope.basic_settings.copy_right_section_contant;
            param_data.copy_right_section_contant_ol = $scope.basic_settings.copy_right_section_contant_ol;
            param_data.cookies_policy_contant = $scope.basic_settings.cookies_policy_contant;
            param_data.cookies_policy_contant_ol = $scope.basic_settings.cookies_policy_contant_ol;

            param_data.banner_title_text = $scope.basic_settings.banner_title_text;
            param_data.banner_title_text_ol = $scope.basic_settings.banner_title_text_ol;

            param_data.base_delivery_charge_percentage = $scope.basic_settings.base_delivery_charge_percentage;


            if (factories.getSettings().key_value.minimum_order_fee == 1) {
                param_data.minimum_subtotal_for_small_order_fee = $scope.basic_settings.minimum_subtotal_for_small_order_fee;
                param_data.small_order_fee = $scope.basic_settings.small_order_fee;
            }


            services.POST_FORM_DATA(param_data, API.UPDATE_ADMIN_SETTINGS, function (response) {
                $scope.isSavingTipShowHideSetting = false;
                if (response.data.logo_url) {
                    $rootScope.profile_image = response.data.logo_url;
                    $rootScope.app_image = response.data.logo_url;
                }

                // if (response.data.footer_logo_url) {
                //     $rootScope.profile_image = response.data.footer_logo_url;
                //     $rootScope.app_image = response.data.footer_logo_url;
                // }

                if (response.data.favicon_url) {
                    let link = window.document.getElementById('favicon');
                    let icon = response.data.favicon_url;
                    link.setAttribute('href', icon);
                    localStorage.setItem('fav_icon', icon);
                }

                $scope.message = `${$translate.instant('Settings updated successfully')}`;
                services.SUCCESS_MODAL(true);
            });
        }

        $scope.updateFooterSettings = function (addFooterBasicSettingsForm) {
            if (addBasicSettingsForm.$submitted && addBasicSettingsForm.$invalid) return;

            const payload = {
                fackbook_link: $scope.basic_settings.fackbook_link,
                twitter_link: $scope.basic_settings.twitter_link,
                google_link: $scope.basic_settings.google_link,
                linkedin_link: $scope.basic_settings.linkedin_link,
                instagram_link: $scope.basic_settings.instagram_link,
                youtube_link: $scope.basic_settings.youtube_link
            }

            if (factories.getSettings().key_value.social_media_icons_horizontally_aligned == 1) {
                payload['blog_link'] = $scope.basic_settings.blog_link;
            }


            if (factories.getSettings().key_value.footer_type == 2) {
                payload.footer_mockup_image = !$scope.footer_mockup_file ? $scope.footer_mockup_image : '';
                payload.footer_mockup_title = $scope.basic_settings.footer_mockup_title;
                payload.footer_mockup_description = $scope.basic_settings.footer_mockup_description;

                $scope.uploadImage($scope.footer_mockup_file, function (err, imageUrl) {
                    if (imageUrl) {
                        payload['footer_mockup_image'] = imageUrl
                    }

                    services.POST_FORM_DATA(payload, API.UPDATE_ADMIN_SETTINGS, function (response) {
                        $scope.message = `${$translate.instant('Settings updated successfully')}`;
                        services.SUCCESS_MODAL(true);
                    })
                })
            } else {
                services.POST_FORM_DATA(payload, API.UPDATE_ADMIN_SETTINGS, function (response) {
                    $scope.message = `${$translate.instant('Settings updated successfully')}`;
                    services.SUCCESS_MODAL(true);
                });
            }
        }

        /*********************** Default Address ***********************/

        var getDefaultAddress = function () {
            services.GET_DATA({}, API.GET_DEFAULT_ADDRESS, function (response) {
                if (!!response && response.status === 4) {
                    if ((response.data).length) {
                        $scope.is_address_edit = true;
                        let address_data = response.data[0];
                        $scope.address_id = address_data.id;
                        $scope.default_address = address_data.address;
                        $scope.coordinates.latitude = address_data.latitude;
                        $scope.coordinates.longitude = address_data.longitude;
                    }
                }
            });
        }
        getDefaultAddress();

        var afterSubmit = function () {
            $scope.message = `${$translate.instant('Default address updated successfully')}`;
            services.SUCCESS_MODAL(true);
        }

        $scope.updateAddress = function (defaultAddressForm) {
            if (defaultAddressForm.$submitted && defaultAddressForm.$invalid) return;

            if ($scope.default_address && (!$scope.coordinates.latitude || !$scope.coordinates.longitude)) {
                factories.warningDataPop($translate.instant('Not able to locate area'));
                return;
            }

            let param_data = {
                sectionId: 52,
                address: $scope.default_address,
                latitude: $scope.coordinates.latitude,
                longitude: $scope.coordinates.longitude
            };

            if ($scope.is_address_edit) {
                param_data['id'] = $scope.address_id;
                services.PUT_DATA(param_data, API.UPDATE_DEFAULT_ADDRESS, function (response) {
                    afterSubmit();
                });
            } else {
                services.POST_DATA(param_data, API.ADD_DEFAULT_ADDRESS, function (response) {
                    afterSubmit();
                });
            }
        }

        /*********************** Terminologies ***********************/

        $scope.updateTerminology = function (addTerminologyForm) {
            if (addTerminologyForm.$submitted && addTerminologyForm.$invalid) return;

            let payload = {
                english: {
                    status: {}
                },
                other: {
                    status: {}
                }
            }

            $scope.basic_terminologies.forEach(el => {
                payload.english[el.key] = (el.value.english).trim();
                payload.other[el.key] = (el.value.other ? el.value.other : '').trim();
            });

            $scope.status_terminologies.forEach(el => {
                (payload.english['status'])[el.key] = (el.value.english).trim();
                (payload.other['status'])[el.key] = (el.value.other ? el.value.other : '').trim();
            });

            if ($scope.return_status_terminologies.length) {
                payload.english['return_status'] = {};
                payload.other['return_status'] = {};
                $scope.return_status_terminologies.forEach(el => {
                    (payload.english['return_status'])[el.key] = (el.value.english).trim();
                    (payload.other['return_status'])[el.key] = (el.value.other).trim();
                });
            }

            services.PUT_DATA({ terminologies: JSON.stringify(payload) }, API.UPDATE_TERMINOLOGIES, function (response) {
                $scope.message = `${$translate.instant('Terminologies updated successfully')}`;
                services.SUCCESS_MODAL(true);
                let settings = JSON.parse(localStorage.getItem('settings_data'));
                settings.key_value.terminology = JSON.stringify(payload);
                localStorage.setItem('settings_data', JSON.stringify(settings));
                $rootScope.localisation = factories.localisation();
            });
        }


        /*********************** Email ***********************/

        $scope.getEmailData = function () {
            var param_data = {};
            param_data.accessToken = constants.ACCESSTOKEN;
            param_data.sectionId = 52;

            services.POST_DATA(param_data, API.LIST_USERS_FOR_SETTINGS, function (response) {
                let usersData = response.data;
                if (!!usersData) {
                    $scope.user_data = usersData;
                    $scope.user_data.map(user => {
                        user['checked'] = false;
                    });
                    $scope.all_user_data = $scope.user_data.slice();

                    if ($rootScope.is_single_vendor == 0) {
                        services.POST_DATA(param_data, API.LIST_SUPPLIERS_FOR_SETTINGS, function (response) {
                            let suppliersData = response.data;
                            if (!!suppliersData) {
                                $scope.supplier_data = suppliersData;
                                $scope.supplier_data.map(supplier => {
                                    supplier['checked'] = false;
                                });
                                $scope.all_supplier_data = $scope.supplier_data.slice();
                                $scope.user_supplier = [...$scope.user_data, ...$scope.supplier_data];
                            }
                        });
                    } else {
                        $scope.user_supplier = [...$scope.user_data];
                    }

                    if ($rootScope.enable_agent_email_notification == 1) {
                        services.GET_DATA(param_data, API.GET_AGENT_LIST_FOR_SETTINGS, function (response) {
                            let agentData = response.data;
                            if (!!agentData) {
                                $scope.agent_list_data = agentData;
                                $scope.agent_list_data.map(user => {
                                    user['checked'] = false;
                                });
                                $scope.all_agent_list_data = $scope.agent_list_data.slice();
                                $scope.user_supplier.push(...$scope.agent_list_data);

                            }
                        })
                    }

                }
            });
        };
        $scope.getEmailData();


        $scope.wishUserBDay = function () {
            $scope.user_data.forEach(user => {
                if (user.dateOfBirth) {
                    var dateOfBirth = new Date(user.dateOfBirth);
                    var date = new Date();
                    if (dateOfBirth.getDate() == date.getDate()) {
                        $('#autocomplete').tagEditor('addTag', user.email);
                    }
                }
            });
            var isAny = this.user_data.find(x => x.dateOfBirth ? new Date(x.dateOfBirth).getDate() == new Date().getDate() : null);
            if (!isAny) {
                factories.invalidDataPop($translate.instant("No any user birthday today"));
            }
        }
        $scope.allUsers = function () {
            $scope.user_data.forEach(user => {
                $('#autocomplete').tagEditor('addTag', user.email);
            });
        }
        $scope.allAgents = function () {
            $scope.agent_list_data.forEach(user => {
                $('#autocomplete').tagEditor('addTag', user.email);
            });
        }

        $scope.allSuppliers = function () {
            $scope.supplier_data.forEach(supplier => {
                $('#autocomplete').tagEditor('addTag', supplier.email);
            });
        }

        $scope.resetTag = function () {
            var tags = $('#autocomplete').tagEditor('getTags')[0].tags;
            for (i = 0; i < tags.length; i++) { $('#autocomplete').tagEditor('removeTag', tags[i]); }
            $scope.email = {
                subject: '',
                email_msg: ''
            }
        }

        /////////////////////////////////////////////////////////
        $scope.wishUserBDayviaMsg = function () {
            $scope.user_data.forEach(user => {
                if (user.dateOfBirth) {
                    var dateOfBirth = new Date(user.dateOfBirth);
                    var date = new Date();
                    if (dateOfBirth.getDate() == date.getDate()) {
                        $('#autocomplete1').tagEditor('addTag', user.mobile_no);
                    }
                }
            });
            var isAny = this.user_data.find(x => x.dateOfBirth ? new Date(x.dateOfBirth).getDate() == new Date().getDate() : null);
            if (!isAny) {
                factories.invalidDataPop($translate.instant("No any user birthday today"));
            }
        }
        $scope.allMsgUsers = function () {
            $scope.user_data.forEach(user => {
                $('#autocomplete1').tagEditor('addTag', user.mobile_no);
            });
        }
        $scope.allMsgAgents = function () {
            $scope.agent_list_data.forEach(user => {
                $('#autocomplete1').tagEditor('addTag', user.mobile_no);
            });
        }
        $scope.allMsgSuppliers = function () {
            $scope.supplier_data.forEach(supplier => {
                $('#autocomplete1').tagEditor('addTag', supplier.mobile_no);
            });
        }

        $scope.resetMsgTag = function () {
            var tags = $('#autocomplete1').tagEditor('getTags')[0].tags;
            for (i = 0; i < tags.length; i++) { $('#autocomplete1').tagEditor('removeTag', tags[i]); }
            $scope.phone_no = {
                text_msg: ''
            }
        }
        /////////////////////////////////////////////////////////

        $scope.submitEmail = function () {
            if (!$scope.recipients.length) {
                factories.invalidDataPop($translate.instant("Please enter recipients"));
                return;
            } else if (!$scope.email.subject) {
                factories.invalidDataPop($translate.instant("Please enter subject"));
                return;
            } else if (!$scope.email.email_msg) {
                factories.invalidDataPop($translate.instant("Please enter email body"));
                return;
            }
            console.log('qsywgshywdse', $scope.user_supplier);

            var userIdsArr = [];
            var userTypeArr = [];

            $scope.recipients.forEach(email => {
                let recipient = $scope.user_supplier.find(el => el.email === email);

                if (!!recipient) {
                    userIdsArr.push(recipient.id);
                    userTypeArr.push(recipient.type);
                }
            });

            if (!userIdsArr.length) {
                factories.invalidDataPop($translate.instant("Please select valid email ids"));
                return;
            }

            var param_data = {};
            param_data.accessToken = constants.ACCESSTOKEN;
            param_data.sectionId = 52;
            param_data.ids = userIdsArr.join('#');
            param_data.receiverType = userTypeArr.join('#');
            param_data.receiverEmail = $scope.recipients.join('#');
            param_data.subject = $scope.email.subject;
            param_data.content = $scope.email.email_msg;

            services.POST_DATA(param_data, API.SEND_EMAIL, function (response) {
                $scope.message = `${$translate.instant('Email has been sent successfully')}`;
                services.SUCCESS_MODAL(true);
            });
        };


        $scope.submitPhoneNumber = function () {
            if (!$scope.recipientsPhone.length) {
                factories.invalidDataPop($translate.instant("Please enter recipients"));
                return;
            }

            var userIdsArr = [];
            var userTypeArr = [];

            $scope.recipientsPhone.forEach(mobile_no => {
                let recipientPh = $scope.user_supplier.find(el => el.mobile_no === mobile_no);

                if (!!recipientPh) {
                    userIdsArr.push(recipientPh.id);
                    userTypeArr.push(recipientPh.type);
                }
            });

            var param_data = {};
            param_data.accessToken = constants.ACCESSTOKEN;
            param_data.receiverNo = $scope.recipientsPhone.join('#');
            param_data.sectionId = 52;
            param_data.ids = userIdsArr.join('#');
            param_data.receiverType = userTypeArr.join('#');
            param_data.text = $scope.phone_no.text_msg;

            services.POST_DATA(param_data, API.SEND_TEXT, function (response) {
                $scope.message = `${$translate.instant('Text has been sent successfully')}`;
                services.SUCCESS_MODAL(true);
            });
        };

        /*********************** Push Notification ***********************/

        $scope.markAll = function (mark, type) {
            if (type === 'USER') {
                $scope.user_data.forEach(user => {
                    user.checked = !mark;
                });
            } else if (type === 'SUPPLIER') {
                $scope.supplier_data.forEach(sup => {
                    sup.checked = !mark;
                });
            }
            else if (type === 'AGENTS') {
                $scope.agent_list_data.forEach(sup => {
                    sup.checked = !mark;
                });
            }
        }

        $scope.selectUser = function (user) {
            user.checked = !user.checked;
        }

        $scope.selectSupplier = function (supplier) {
            supplier.checked = !supplier.checked;
        }
        $scope.selectAgent = function (agent) {
            agent.checked = !agent.checked;
        }



        $scope.sendPush = function () {
            let selected_users = [];
            let selected_suppliers = [];
            let selected_agnets = [];
            let finalArr = [];

            $scope.user_data.forEach(user => {
                if (user.checked) {
                    selected_users.push(user);
                }
            });

            $scope.supplier_data.forEach(supplier => {
                if (supplier.checked) {
                    selected_suppliers.push(supplier);
                }
            });

            finalArr = [...selected_users, ...selected_suppliers];

            if ($rootScope.enable_agent_email_notification == 1) {
                $scope.agent_list_data.forEach(agent => {
                    if (agent.checked) {
                        selected_agnets.push(agent);
                    }
                });
                finalArr.push(...selected_agnets);
            }

            if (!finalArr.length) {
                factories.invalidDataPop($translate.instant("Please Select User/Supplier To Continue"));
                return;
            } else if (!$scope.notification.notification_msg) {
                factories.invalidDataPop($translate.instant("Please enter notification"));
                return;
            }

            var userIdsArr = [];
            var userTypeArr = [];
            for (var i = 0; i < finalArr.length; i++) {
                userIdsArr.push(finalArr[i].id);
                userTypeArr.push(finalArr[i].type);
            }

            var param_data = {};
            param_data.accessToken = constants.ACCESSTOKEN;
            param_data.sectionId = 52;
            param_data.ids = userIdsArr.join('#');
            param_data.userType = userTypeArr.join('#');
            param_data.content = $scope.notification.notification_msg;

            services.POST_DATA(param_data, API.SEND_PUSH, function (response) {
                $scope.message = `${$translate.instant('Push has been sent successfully')}`;
                services.SUCCESS_MODAL(true);
            })
        };

        /*********************** T&C / Privacy Policy ***********************/

        $scope.submitTerms = function () {
            let param_data = {
                termsAndConditions: [$scope.terms.english, $scope.terms.other],
                language_ids: '14#15'
            }

            services.POST_DATA(param_data, API.ADD_TERMS_AND_PRIVACY, function (response) {
                $scope.message = `${$translate.instant('Terms and conditions updated successfully')}`;
                services.SUCCESS_MODAL(true);
            });
        }

        $scope.submitPrivacy = function () {
            let param_data = {
                privacyPolicy: [$scope.privacy.english, $scope.privacy.other],
                language_ids: '14#15'
            }

            services.POST_DATA(param_data, API.ADD_TERMS_AND_PRIVACY, function (response) {
                $scope.message = `${$translate.instant('Privacy Policy updated successfully')}`;
                services.SUCCESS_MODAL(true);
            });
        }

        $scope.submitAboutUs = function () {
            let param_data = {
                about_us: [$scope.about.english, $scope.about.other],
                language_ids: '14#15'
            }

            services.POST_DATA(param_data, API.ADD_TERMS_AND_PRIVACY, function (response) {
                $scope.message = `${$translate.instant('About Us updated successfully')}`;
                services.SUCCESS_MODAL(true);
            });
        }
        $scope.updateAlternateAboutUs = function (alternateAboutUsForm) {
            let param_data = {
                aboutus_two_english: $scope.about_us_short.english,
                aboutus_two_other: $scope.about_us_short.other,
            }
            services.POST_DATA(param_data, API.UPDATE_ADMIN_SETTINGS, function (response) {
                $scope.message = `${$translate.instant('About Us short updated successfully')}`;
                services.SUCCESS_MODAL(true);
            });
        }

        $scope.submitFAQ = function () {
            let param_data = {
                faqs: [$scope.faq.english, $scope.faq.other],
                language_ids: '14#15'
            }

            services.POST_DATA(param_data, API.ADD_TERMS_AND_PRIVACY, function (response) {
                $scope.message = `${$translate.instant('FAQ updated successfully')}`;
                services.SUCCESS_MODAL(true);
            });
        }

        $scope.submitLoginDisclaimer = function () {
            let param_data = {
                terms_of_login: [$scope.loginDisclaimer.english, $scope.loginDisclaimer.other],
                language_ids: '14#15'
            }

            services.POST_DATA(param_data, API.ADD_TERMS_AND_PRIVACY, function (response) {
                $scope.message = `${$translate.instant('Login disclaimer updated successfully')}`;
                services.SUCCESS_MODAL(true);
            });
        }

        $scope.submitCancellationAndRefundPolicy = function () {
            let param_data = {
                cancellation_and_refund: [$scope.cancellation_and_refund_policy.english, $scope.cancellation_and_refund_policy.other],
                language_ids: '14#15'
            }

            services.POST_DATA(param_data, API.ADD_TERMS_AND_PRIVACY, function (response) {
                $scope.message = `${$translate.instant('Cancellation and refund policy updated successfully')}`;
                services.SUCCESS_MODAL(true);
            });
        }

        $scope.submitCookiePolicy = function () {
            let param_data = {
                cookie_policy: [$scope.cookie_policy.english, $scope.cookie_policy.other],
                language_ids: '14#15'
            }

            services.POST_DATA(param_data, API.ADD_TERMS_AND_PRIVACY, function (response) {
                $scope.message = `${$translate.instant('Cookie policy updated successfully')}`;
                services.SUCCESS_MODAL(true);
            });
        }

        // <!--------------------------- dynamically adding fields like the above ones -------------------------->
        $scope.submitOnAddField = function () {
            let errorCount = 0;
            $scope.fieldCollection.forEach(col => {
                if (col.isNew) {
                    if (!col.heading || !col.description) {
                        errorCount++;
                    }
                }
            })

            if (errorCount > 0) {
                factories.invalidDataPop("Please add content first");
                return false;
            }

            $scope.fieldCollection.map(o => delete o.isNew);

            let param_data = {
                additional_dynamic_fields: [$scope.fieldCollection, null],
                language_ids: '14#15'
            }
            services.POST_DATA(param_data, API.ADD_TERMS_AND_PRIVACY, function (response) {
                console.log(response)
                $scope.message = `${$translate.instant("data updated Successfully")}`;
                services.SUCCESS_MODAL(true);
            });
        }

        // $scope.addField = function () {
        //     $scope.field = {}
        //     $scope.fieldCollection.push($scope.field);
        //     $scope.hideAddField();
        // }

        $scope.deleteOnAddField = function (index) {
            let data = angular.copy($scope.fieldCollection[index]);
            $scope.fieldCollection.splice(index, 1);

            if (!data.isNew) {
                $scope.submitOnAddField();
                $scope.hideAddField();
            }
        }

        // <!-------------------------- ---------------------------------------------------- -------------------->


        /*********************** Features ***********************/

        $scope.featueTabSwitch = function (tab, feature_data) {
            $scope.active_settings_tab = tab;
            $scope.features = feature_data;
            $scope.feature_submitted = false;
        }

        var getFeatures = function () {
            services.GET_ONBOARDING_DATA({}, API.GET_FEATURES, false, function (response) {
                if (!!response && response.statusCode === 200) {
                    let features = (response.data).featureData;
                    features.forEach(feature => {
                        (feature.key_value).forEach(el => {
                            if (el.is_selection == 1 && !el.value) {
                                el.value = '0';
                            }
                        });
                        if (feature.key_value_front.length) {
                            (feature.key_value).forEach(val => {
                                let ft = (feature.key_value_front).find(el => el.key === val.key);
                                if (!!ft) {
                                    val['value'] = ft['value'];
                                    val['id'] = ft['id'];
                                }
                            });
                        }
                    });
                    $scope.features_types = _.groupBy(features, feature => { return feature.feature_type.name });

                    if ($scope.features_types['Payment Gateway']) {
                        const paymentGateways = $scope.features_types['Payment Gateway'];
                        $scope.gateways = [];
                        paymentGateways.map(el => {
                            if (el.is_active == 1) {
                                $scope.gateways.push({
                                    name: el.name,
                                    checked: false
                                });
                            }
                        });
                        $scope.gateways.unshift({
                            name: 'COD',
                            checked: false
                        });
                    }

                    if ($scope.features_types['Payment Gateway'] && factories.getSettings().key_value.is_tax_geofence == 1) {
                        getGeofenceAreas();
                    }
                }
            });
        }
        getFeatures();

        $scope.makeDefault = function (feature) {
            services.CONFIRM(`you want to ${feature.is_active == 1 ? 'deactivate' : 'activate'} this payment gateway`,
                function (isConfirm) {
                    if (isConfirm) {
                        services.PUT_ONBOARDING_DATA({ id: feature['customer_feature_id'], status: +!feature.is_active }, API.UPDATE_PAYMENT_STATUS, false, function (response) {
                            if (!!response) {
                                $scope.features.forEach(el => {
                                    if (el['id'] == feature['id']) {
                                        el['is_active'] = !el['is_active'];
                                    }
                                });
                            }
                        });
                    }
                });
        }

        var afterUpdate = function (active_settings_tab, features) {
            getFeatures();
            $scope.message = `${$translate.instant('Features updated successfully')}`;
            services.SUCCESS_MODAL(true);
            $scope.feature_submitted = false;
            $scope.active_settings_tab = active_settings_tab;
            $scope.features = features;
        }

        $scope.updateFeatures = function (featureForm, active_settings_tab, features) {
            $scope.feature_submitted = true;
            if (featureForm.$submitted && featureForm.$invalid) return;

            let form_data = {
                key_value: []
            };
            $scope.features.forEach(feature => {
                feature.key_value.forEach(el => {
                    el['customer_feature_id'] = feature['customer_feature_id'];
                    form_data.key_value.push(el);
                });
            });

            if ($scope.features[0].type_name == 'custom_domain') {
                services.PUT_ONBOARDING_DATA(form_data, API.SET_DOMAIN, false, function (response) {
                    if (!!response && response.statusCode === 200) {
                        afterUpdate(active_settings_tab, features);
                    }
                });
            } else {
                services.POST_ONBOARDING_DATA(form_data, API.SET_FEATURES, false, function (response) {
                    if (!!response && response.statusCode === 200) {
                        afterUpdate(active_settings_tab, features);
                    }
                });
            }
        }

        if (factories.getSettings().key_value.card_gateway) {
            $scope.gateways_with_saving_card_feature = typeof factories.getSettings().key_value.card_gateway == 'string' ? JSON.parse(factories.getSettings().key_value.card_gateway) : factories.getSettings().key_value.card_gateway;
            $scope.gateways_with_saving_card_feature_keys = Object.keys($scope.gateways_with_saving_card_feature);
        }

        $scope.setDefaultGatewayForSavingCards = function (feature) {
            let gateways = {};
            Object.keys($scope.gateways_with_saving_card_feature).forEach(key => {
                gateways[key.toLowerCase()] = 0;
            });
            gateways[feature.toLowerCase()] = 1;
            let param_data = {
                card_gateway: gateways
            };
            services.POST_FORM_DATA(param_data, API.UPDATE_ADMIN_SETTINGS, function (response) {
                $scope.message = `${$translate.instant('Gateway selected as default for saving cards')}`;
                services.SUCCESS_MODAL(true);
            });
        }


        $scope.geofence_areas = [];
        $scope.geofence_coordinates = [];
        $scope.current_geofence_index = -1;
        $scope.gatewayIndex = -1;
        $scope.selectedKey = '';
        $scope.selectedGateways = [];

        var getGeofenceAreas = function () {
            services.GET_DATA({ supplier_id: $scope.supplier_id }, API.LIST_PAYMENT_GATEWAY_LOCATION, function (response) {
                if (response && response.data.length) {
                    $scope.geofence_areas = [];
                    (response.data).forEach(el => {
                        $scope.geofence_areas.push({
                            coordinates: el.coordinates,
                            payment_gateways: (el.payment_gateways).split('#'),
                            id: el.id
                        });
                    });
                }
                $scope.addArea();
            });
        }

        $scope.addArea = function () {
            $scope.geofence_areas.push({
                coordinates: [],
                payment_gateways: []
            });
        }

        $scope.openGatewayModal = function (index, type) {
            $scope.selectedGateways = [];
            $scope.gatewayIndex = index;
            let key;
            switch (type) {
                case 'userType':
                    key = 'user_types';
                    break;
                case 'geofence':
                    key = 'geofence_areas';
                    break;
            }
            $scope.selectedKey = key;
            console.log($scope[key], index)
            if ($scope[key][index].payment_gateways && ($scope[key][index].payment_gateways).length) {
                $scope[key][index].payment_gateways.forEach(el => {
                    $scope.gateways.forEach(p => {
                        if (el.toLowerCase() == (p.name).toLowerCase()) {
                            p.checked = true;
                        }
                    });
                });
            } else {
                $scope.gateways.forEach(p => {
                    p.checked = false;
                });
            }
            $("#gateway_modal").modal('show');
        }

        $scope.selectGateway = function (gateway) {
            gateway.checked = !gateway.checked;
        }

        $scope.saveGateways = function () {
            $scope[$scope.selectedKey][$scope.gatewayIndex].payment_gateways = [];
            $scope.gateways.forEach(p => {
                if (p.checked) {
                    $scope[$scope.selectedKey][$scope.gatewayIndex].payment_gateways.push((p.name).toLowerCase());
                }
            });
            $("#gateway_modal").modal('hide');
        }

        $scope.removeArea = function (index) {
            services.CONFIRM(`You want to delete this area`,
                function (isConfirm) {
                    if (isConfirm) {
                        let params = {
                            id: $scope.geofence_areas[index].id
                        }
                        services.POST_DATA(params, API.DELETE_PAYMENT_GATEWAY_LOCATION, function (response) {
                            $scope.geofence_areas.splice(index, 1);
                            $scope.message = `${$translate.instant('Geofence area removed')}`;
                            services.SUCCESS_MODAL(true);
                        });
                    }
                });
        }

        $scope.initGeofence = function (index) {
            $("#geo").modal('show');
            $scope.current_geofence_index = index;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var map = new google.maps.Map(document.getElementById('geo_map'), {
                        center: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        },
                        zoom: 15
                    });

                    function getPolygonPath(polygon) {
                        let arr = [];
                        for (var i = 0; i < polygon.getPath().getLength(); i++) {
                            let latlng = polygon.getPath().getAt(i);
                            arr.push({
                                x: latlng.lat(),
                                y: latlng.lng()
                            });
                        }
                        $scope.geofence_coordinates = arr;
                        $scope.geofence_coordinates.push(arr[0]);
                    }

                    if ($scope.geofence_areas[$scope.current_geofence_index].id) {
                        $scope.geofence_coordinates = $scope.geofence_areas[$scope.current_geofence_index].coordinates;
                        let polygon_coordinates = $scope.geofence_coordinates.map(latlng => {
                            return {
                                lat: (latlng.x),
                                lng: (latlng.y)
                            }
                        });
                        polygon_coordinates.pop()
                        var myPolygon = new google.maps.Polygon({
                            paths: polygon_coordinates,
                            fillColor: '#2ca6b18c',
                            strokeOpacity: 0.8,
                            fillOpacity: 0.4,
                            strokeWeight: 3,
                            strokeColor: '#4a4a4a',
                            draggable: true,
                            editable: true,
                            zIndex: 1
                        });
                        myPolygon.setMap(map);

                        google.maps.event.addListener(myPolygon, 'dragend', function () {
                            getPolygonPath(myPolygon);
                        });

                        google.maps.event.addListener(myPolygon.getPath(), 'insert_at', function () {
                            getPolygonPath(myPolygon);
                        });
                        google.maps.event.addListener(myPolygon.getPath(), 'set_at', function () {
                            getPolygonPath(myPolygon);
                        });
                    }

                    var selectedShape;

                    function clearSelection() {
                        if (selectedShape) {
                            selectedShape.setEditable(false);
                            selectedShape.setMap(null);
                            selectedShape = null;
                        }
                        if ($scope.geofence_areas[$scope.current_geofence_index].id) {
                            myPolygon.setMap(null);
                        }
                    }

                    function setSelection(shape) {
                        clearSelection();
                        selectedShape = shape;
                        shape.setEditable(true);
                    }

                    var drawingManager = new google.maps.drawing.DrawingManager({
                        drawingMode: $scope.geofence_areas[$scope.current_geofence_index].id ? null : google.maps.drawing.OverlayType.POLYGON,
                        drawingControl: true,
                        drawingControlOptions: {
                            position: google.maps.ControlPosition.TOP_CENTER,
                            drawingModes: [google.maps.drawing.OverlayType.POLYGON]
                        },
                        polygonOptions: {
                            fillColor: '#2ca6b18c',
                            strokeOpacity: 0.8,
                            fillOpacity: 0.4,
                            strokeWeight: 3,
                            strokeColor: '#4a4a4a',
                            clickable: true,
                            draggable: true,
                            editable: true,
                            zIndex: 1
                        }
                    });
                    drawingManager.setMap(map);

                    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
                        var newShape = event.overlay;
                        newShape.type = event.type;

                        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
                            drawingManager.setDrawingMode(null);
                            getPolygonPath(newShape);

                            google.maps.event.addListener(newShape, 'dragend', function () {
                                setSelection(newShape);
                            });

                            setSelection(newShape);
                        }
                    });

                    google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);

                });
            }
        }

        $scope.setGeofence = function () {
            $scope.geofence_areas[$scope.current_geofence_index].coordinates = $scope.geofence_coordinates;
            $("#geo").modal('hide');
            console.log($scope.geofence_areas)
        }

        var afterupdate = function () {
            $scope.message = `${$translate.instant('Geofence details updated')}`;
            services.SUCCESS_MODAL(true);
            getGeofenceAreas();
        }

        $scope.setGeofenceData = function (geofenceForm, index) {
            if (geofenceForm.$submitted && geofenceForm.$invalid) return;

            if ($scope.geofence_areas[index].id) {
                services.POST_DATA($scope.geofence_areas[index], API.UPDATE_PAYMENT_GATEWAY_LOCATION, function (response) {
                    afterupdate();
                });
            } else {
                services.POST_DATA($scope.geofence_areas[index], API.ADD_PAYMENT_GATEWAY_LOCATION, function (response) {
                    afterupdate();
                });
            }

        }

        // <-------------------------------------Surge Pricing with GeoFence------------------------------------------->
        $scope.geofence_areas_surge = [];
        $scope.geofence_coordinates_surge = [];
        $scope.current_geofence_index_surge = -1;

        var getGeofenceAreasSurge = function () {
            services.GET_DATA({}, API.LIST_GEOFENCE_SURGE, function (response) {
                if (response && response.data.length) {
                    $scope.geofence_areas_surge = response.data;
                    $scope.geofence_areas_surge.forEach(ele => {
                        ele.isSurgePrice = !!ele.surge_price ? true : false;
                    })
                }

                $scope.addAreaSurge();
            });
        }

        $scope.toggleGeoSurge = function (isSurgePrice, index) {
            $scope.geofence_areas_surge.isSurgePrice = !isSurgePrice;
            $scope.geofence_areas_surge.isSurgePrice == false ? $scope.geofence_areas_surge.isSurgePrice = 0 : $scope.geofence_areas_surge.isSurgePrice = 1;
            if (!isSurgePrice) {
                $scope.geofence_areas_surge[index].surge_price = '';
                $scope.geofence_areas_surge[index].start_time = '';
                $scope.geofence_areas_surge[index].end_time = '';
                $scope.setGeofenceDataSurge(index);
            }
        }

        if (factories.getSettings().key_value.price_surge_with_geo_fencing == 1) {
            getGeofenceAreasSurge();
        }

        $scope.addAreaSurge = function () {
            $scope.geofence_areas_surge.push({
                coordinates: [],
                surge_price: '',
            });
        }

        $scope.removeAreaSurge = function (index) {
            services.CONFIRM(`You want to delete this area`,
                function (isConfirm) {
                    if (isConfirm) {
                        let params = {
                            id: $scope.geofence_areas_surge[index].id
                        }
                        services.POST_DATA(params, API.DELETE_GEOFENCE_SURGE, function (response) {
                            $scope.geofence_areas_surge.splice(index, 1);
                            $scope.message = `${$translate.instant('Geofence area removed')}`;
                            services.SUCCESS_MODAL(true);
                        });
                    }
                });
        }

        $scope.initGeofenceSurge = function (index) {
            $("#geoSurge").modal('show');
            $scope.current_geofence_index_surge = index;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var map = new google.maps.Map(document.getElementById('geo_map_surge'), {
                        center: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        },
                        zoom: 15
                    });

                    function getPolygonPath(polygon) {
                        let arr = [];
                        for (var i = 0; i < polygon.getPath().getLength(); i++) {
                            let latlng = polygon.getPath().getAt(i);
                            arr.push({
                                x: latlng.lat(),
                                y: latlng.lng()
                            });
                        }
                        $scope.geofence_coordinates_surge = arr;
                        $scope.geofence_coordinates_surge.push(arr[0]);
                    }

                    if ($scope.geofence_areas_surge[$scope.current_geofence_index_surge].id) {
                        $scope.geofence_coordinates_surge = $scope.geofence_areas_surge[$scope.current_geofence_index_surge].coordinates;
                        let polygon_coordinates = $scope.geofence_coordinates_surge.map(latlng => {
                            return {
                                lat: (latlng.x),
                                lng: (latlng.y)
                            }
                        });
                        polygon_coordinates.pop()
                        var myPolygon = new google.maps.Polygon({
                            paths: polygon_coordinates,
                            fillColor: '#2ca6b18c',
                            strokeOpacity: 0.8,
                            fillOpacity: 0.4,
                            strokeWeight: 3,
                            strokeColor: '#4a4a4a',
                            draggable: true,
                            editable: true,
                            zIndex: 1
                        });
                        myPolygon.setMap(map);

                        google.maps.event.addListener(myPolygon, 'dragend', function () {
                            getPolygonPath(myPolygon);
                        });

                        google.maps.event.addListener(myPolygon.getPath(), 'insert_at', function () {
                            getPolygonPath(myPolygon);
                        });
                        google.maps.event.addListener(myPolygon.getPath(), 'set_at', function () {
                            getPolygonPath(myPolygon);
                        });
                    }

                    var selectedShape;

                    function clearSelection() {
                        if (selectedShape) {
                            selectedShape.setEditable(false);
                            selectedShape.setMap(null);
                            selectedShape = null;
                        }
                        if ($scope.geofence_areas_surge[$scope.current_geofence_index_surge].id) {
                            myPolygon.setMap(null);
                        }
                    }

                    function setSelection(shape) {
                        clearSelection();
                        selectedShape = shape;
                        shape.setEditable(true);
                    }

                    var drawingManager = new google.maps.drawing.DrawingManager({
                        drawingMode: $scope.geofence_areas_surge[$scope.current_geofence_index_surge].id ? null : google.maps.drawing.OverlayType.POLYGON,
                        drawingControl: true,
                        drawingControlOptions: {
                            position: google.maps.ControlPosition.TOP_CENTER,
                            drawingModes: [google.maps.drawing.OverlayType.POLYGON]
                        },
                        polygonOptions: {
                            fillColor: '#2ca6b18c',
                            strokeOpacity: 0.8,
                            fillOpacity: 0.4,
                            strokeWeight: 3,
                            strokeColor: '#4a4a4a',
                            clickable: true,
                            draggable: true,
                            editable: true,
                            zIndex: 1
                        }
                    });
                    drawingManager.setMap(map);

                    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
                        var newShape = event.overlay;
                        newShape.type = event.type;

                        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
                            drawingManager.setDrawingMode(null);
                            getPolygonPath(newShape);

                            google.maps.event.addListener(newShape, 'dragend', function () {
                                setSelection(newShape);
                            });

                            setSelection(newShape);
                        }
                    });

                    google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);

                });
            }
        }

        $scope.setGeofenceSurge = function () {
            $scope.geofence_areas_surge[$scope.current_geofence_index_surge].coordinates = $scope.geofence_coordinates_surge;
            $("#geoSurge").modal('hide');
            console.log($scope.geofence_areas_surge)
        }

        var afterupdateSurge = function () {
            $scope.message = `${$translate.instant('Geofence details updated')}`;
            services.SUCCESS_MODAL(true);
            getGeofenceAreasSurge();
        }

        $scope.setGeofenceDataSurge = function (geofenceSurgeForm, index) {
            // if (geofenceSurgeForm.$submitted && geofenceSurgeForm.$invalid) return;

            if (($scope.geofence_areas_surge[index]?.start_time && !$scope.geofence_areas_surge[index]?.end_time) || (!$scope.geofence_areas_surge[index]?.start_time && $scope.geofence_areas_surge[index]?.end_time)) {
                factories.warningDataPop($translate.instant('Please select start/end time'));
                return;
            }
            if (moment($scope.geofence_areas_surge[index]?.end_time, 'h:mma').isBefore(moment($scope.geofence_areas_surge[index]?.start_time, 'h:mma'))) {
                factories.warningDataPop($translate.instant(`Invalid date-time duration`));
                return;
            }

            if ($scope.geofence_areas_surge[index].id) {
                services.POST_DATA($scope.geofence_areas_surge[index], API.UPDATE_GEOFENCE_SURGE, function (response) {
                    afterupdateSurge();
                });
            } else {
                services.POST_DATA($scope.geofence_areas_surge[index], API.ADD_GEOFENCE_SURGE, function (response) {
                    afterupdateSurge();
                });
            }

        }

        // <------------------------------------------------Ends----------------------------------------------->


        $scope.openUserTypeGatewayModal = function (index) {
            $scope.selectedGateways = [];
            $scope.gatewayIndex = index;
            console.log($scope.user_types, index)
            if (($scope.user_types[index].payment_gateways).length) {
                $scope.user_types[index].payment_gateways.forEach(el => {
                    $scope.gateways.forEach(p => {
                        if (el.toLowerCase() == (p.name).toLowerCase()) {
                            p.checked = true;
                        }
                    });
                });
            } else {
                $scope.gateways.forEach(p => {
                    p.checked = false;
                });
            }
            $("#gateway_modal").modal('show');
        }

        $scope.openDomainModal = function () {
            $("#db_clone_modal").modal('show');
        }

        $scope.clone_domains = [];
        var cloneDomanInit = function () {
            switch (factories.getSettings().screenFlow[0].app_type) {
                case 1:
                    $scope.clone_domains = [
                        { name: 'Food', type: 1 },
                        { name: 'Grocery', type: 3 },
                        { name: 'Pharmacy', type: 6 }
                    ];
                    $scope.selected_domain_for_clone = 1;
                    break;
                case 2:
                    $scope.clone_domains = [
                        { name: 'Ecommerce', type: 2 }
                    ];
                    $scope.selected_domain_for_clone = 2;
                    break;
                case 8:
                    $scope.clone_domains = [
                        { name: 'Home Services', type: 8 },
                        { name: 'Beauty Services', type: 4 }
                    ];
                    $scope.selected_domain_for_clone = 8;
                    break;
                default:
                    $scope.clone_domains = [
                        { name: 'Essentials', type: 9 },
                        { name: 'Clikat', type: 7 }
                    ];
                    $scope.selected_domain_for_clone = 9;
            }
        }
        cloneDomanInit();

        $scope.changeCloneDomain = function (domain) {
            $scope.selected_domain_for_clone = domain.type;
        }

        $scope.cloneDatabase = function () {
            let params = {
                type: $scope.selected_domain_for_clone
            };
            services.POST_ONBOARDING_DATA(params, API.CLONE_DB, false, function (response) {
                $("#db_clone_modal").modal('hide');
                $scope.message = `${$translate.instant('Database cloned successfully')}`;
                services.SUCCESS_MODAL(true);
            });
        }


        $scope.searchUser = function (event) {
            let value = event.target.value;
            if (value) {
                let regex = new RegExp(value, "i");
                $scope.user_data = $scope.all_user_data.filter(element => element['email'].match(regex));
            } else {
                $scope.user_data = $scope.all_user_data
            }
        }

        $scope.searchAgent = function (event) {
            let value = event.target.value;
            if (value) {
                let regex = new RegExp(value, "i");
                $scope.agent_list_data = $scope.all_agent_list_data.filter(element => element['email'].match(regex));
            } else {
                $scope.agent_list_data = $scope.all_agent_list_data
            }
        }

        $scope.searchSupplier = function (event) {
            let value = event.target.value;
            if (value) {
                let regex = new RegExp(value, "i");
                $scope.supplier_data = $scope.all_supplier_data.filter(element => element['email'].match(regex));
            } else {
                $scope.supplier_data = $scope.all_supplier_data
            }
        }


        //new placeholders

        $scope.selected_placeholder_new = {};
        $scope.placeholders_new = [
            { name: 'Loyalty Points Listing', message: '', app: { file: '', url: '' }, web: null, key: 'loyalty_points_listing', type: ['image/jpg', 'image/jpeg', 'image/png'] },
            { name: 'Wallet history', message: '', app: { file: '', url: '' }, web: null, key: 'wallet_history', type: ['image/jpg', 'image/jpeg', 'image/png'] },
            { name: 'Prescription requests listing', message: '', app: { file: '', url: '' }, web: null, key: 'prescription_requests_listing', type: ['image/jpg', 'image/jpeg', 'image/png'] },
            { name: 'Table booking requests', message: '', app: { file: '', url: '' }, web: null, key: 'table_booking_request', type: ['image/jpg', 'image/jpeg', 'image/png'] },
            { name: 'Feature suggestion list', message: '', app: { file: '', url: '' }, web: null, key: 'feature_suggestion_list', type: ['image/jpg', 'image/jpeg', 'image/png'] },
            { name: 'Promo code list', message: '', app: { file: '', url: '' }, web: null, key: 'promo_code_listing', type: ['image/jpg', 'image/jpeg', 'image/png'] },
            { name: `Select ${factories.localisation().agent} listing`, message: '', app: { file: '', url: '' }, web: null, key: 'select_agent_lsiting', type: ['image/jpg', 'image/jpeg', 'image/png'] },
            { name: `${factories.localisation().order} history listing`, message: '', app: { file: '', url: '' }, web: null, key: 'order_history_listing', type: ['image/jpg', 'image/jpeg', 'image/png'] },
            { name: `${factories.localisation().agent} slots listing`, message: '', app: { file: '', url: '' }, web: null, key: 'agent_slots_listing', type: ['image/jpg', 'image/jpeg', 'image/png'] },
            { name: 'Table selection', message: '', app: { file: '', url: '' }, web: null, key: 'table_selection', type: ['image/jpg', 'image/jpeg', 'image/png'] },
            { name: 'Cart', message: '', app: { file: '', url: '' }, web: null, key: 'cart', type: ['image/jpg', 'image/jpeg', 'image/png'] },
            { name: `Favourite ${factories.localisation().product} listing`, message: '', app: { file: '', url: '' }, web: null, key: 'favourite_product_listing', type: ['image/jpg', 'image/jpeg', 'image/png'] },
            { name: `Favourite ${factories.localisation().supplier}`, message: '', app: { file: '', url: '' }, web: null, key: 'favourite_suppliers', type: ['image/jpg', 'image/jpeg', 'image/png'] },
            { name: 'Notifications', message: '', app: { file: '', url: '' }, web: null, key: 'notifications', type: ['image/jpg', 'image/jpeg', 'image/png'] },
            { name: `${factories.localisation().product} listing and search/filters`, message: '', app: { file: '', url: '' }, web: null, key: 'product_listing', type: ['image/jpg', 'image/jpeg', 'image/png'] },
            { name: `${factories.localisation().supplier} reviews`, message: '', app: { file: '', url: '' }, web: null, key: 'supplier_reviews', type: ['image/jpg', 'image/jpeg', 'image/png'] },
            { name: `${factories.localisation().supplier} listing`, message: '', app: { file: '', url: '' }, web: null, key: 'supplier_listing', type: ['image/jpg', 'image/jpeg', 'image/png'] },
            { name: 'Home', message: '', app: { file: '', url: '' }, web: null, key: 'home', type: ['image/jpg', 'image/jpeg', 'image/png'] }
        ];

        $scope.placeholders_new.forEach(placeholder => {
            let key_value = (factories.getSettings()).key_value;
            if (key_value[placeholder.key] && factories.IsJsonString(key_value[placeholder.key])) {
                if (placeholder.web) {
                    (placeholder.web).url = JSON.parse(key_value[placeholder.key]).web;
                }
                if (placeholder.app) {
                    (placeholder.app).url = JSON.parse(key_value[placeholder.key]).app;
                }
                placeholder.message = JSON.parse(key_value[placeholder.key]).message;
            }
        });

        $scope.selectNewPlaceholder = function (placeholder) {
            $scope.selected_placeholder_new = placeholder;
        }

        $scope.file_to_upload_for_new_placeholder = function (File, type) {
            var file = File[0];
            if (($scope.selected_placeholder_new.type).includes(file.type) && $scope.selected_placeholder_new) {
                if ((file.size / Math.pow(1024, 2)) <= 1) {
                    if (type == 'app') {
                        $scope.selected_placeholder_new.app.file = File[0];
                    } else {
                        $scope.selected_placeholder_new.web.file = File[0];
                    }
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        $scope.$apply(function () {
                            if (type == 'app') {
                                $scope.selected_placeholder_new.app.url = e.target.result;
                            } else {
                                $scope.selected_placeholder_new.web.url = e.target.result;
                            }
                        });
                    }
                } else {
                    factories.invalidDataPop($translate.instant("Image size must be less than 1mb"));
                }
            } else {
                factories.invalidDataPop($translate.instant("Invalid File Type"));
            }
        };

        $scope.uploadNewPlaceholder = function (placeholder) {
            let form_data = {
                key: placeholder.key,
                message: placeholder.message,
                key: placeholder.key,
                web: placeholder.web ? ((placeholder.web).file ? (placeholder.web).file : (placeholder.web).url) : '',
                app: placeholder.app ? ((placeholder.app).file ? (placeholder.app).file : (placeholder.app).url) : ''
            }
            services.PUT_FORM_DATA(form_data, API.UPDATE_PLACEHOLDERS_V1, function (response) {
                $scope.message = `${$translate.instant('Placeholder updated successfully')}`;
                services.SUCCESS_MODAL(true);
            });
        }

        $scope.file_to_upload_for_advertisment_image = function (File) {
            var file = File[0];
            if (constants.IMAGE_TYPE.includes(file.type)) {
                if ((file.size / Math.pow(1024, 2)) <= 7) {
                    $scope.image_file = File[0];
                    var Obj = {};
                    Obj.image = File[0];
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        $scope.$apply(function () {
                            $scope.uploadAdvertismentImage(File[0], function (err, imageUrl) {
                                $scope.advertisment_image_to_view = imageUrl;
                            })
                            $scope.advertisment_image = File[0];
                        });
                    }
                } else {
                    factories.invalidDataPop($translate.instant("Image size must be less than 7mb"));
                }
            } else {
                factories.invalidDataPop($translate.instant("Invalid File Type"));
            }
        };
        $scope.uploadAdvertismentImage = function (file, callback) {    // Get Image Url
            if (!file) {
                return callback(null, file)
            }

            const data = {
                'file': file
            }

            services.POST_FORM_DATA(data, API.UPLOAD_IMAGE, (response) => {
                if (response && response.data) {
                    return callback(null, response.data)
                }
            })
        }
        $scope.updateAdvertismentImage = function (value) {
            if ($scope.advertisment_image_to_view !== '') {
                let form_data = {
                    footer_ad_image: value === 1 ? $scope.advertisment_image_to_view : ''
                }
                services.POST_FORM_DATA(form_data, API.UPDATE_ADMIN_SETTINGS, function (response) {
                    value === 0 ? $scope.advertisment_image_to_view = '' : null;
                    $scope.message = `${$translate.instant('Footer image has been updated!')}`;
                    services.SUCCESS_MODAL(true);
                });
            }
        }
    }

]);
