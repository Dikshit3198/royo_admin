Royo.controller('HeaderCtrl', ['factories', '$rootScope', '$scope', 'services', '$state', '$location', 'constants', 'API',
  function (factories, $rootScope, $scope, services, $state, $location, constants, API) {

    if (!constants.ACCESSTOKEN) {
      $state.go('login');
    }
    /************** DEV ONLY **************/
    $rootScope.api_arr = [
      'https://api.royoapps.com',
      'https://monu-api.royodev.tk',
      'https://ishan-api.royodev.tk',
      'https://gagan-api.royodev.tk',
      'https://sk-backend.netsolutionindia.com'
    ];
    $rootScope.base_api = constants.BASEURL;
    $rootScope.is_dev = constants.IS_DEV;
    $rootScope.changeAPI = function (base_api) {
      $rootScope.base_api = base_api;
      constants.BASEURL = base_api;
    }
    /**************************************/

    $rootScope.billing_link = constants.BILLING_LINK;

    $rootScope.theme_second_color = '';
    $rootScope.app_image = '';
    $rootScope.logo_data = {};
    $rootScope.user_name = '';

    $rootScope.is_custom_app = 1;
    $rootScope.addFontHKGrotesk = 0;
    $rootScope.isColorGet = false;
    $rootScope.new_knockknock_icons = 0;
    $rootScope.hide_delivery_options = 0;

    $rootScope.active_route = $location.path();

    if (!!factories.getSettings()) {
      const settings = factories.getSettings();
      const screen_flow = settings.screenFlow[0];
      const key_value = settings.key_value;
      $rootScope.isColorGet = true;

      var remove_logo_bg_color = (key_value.remove_logo_bg_color && key_value.remove_logo_bg_color == 1) ? true : false;
      $rootScope.navBrandColor = (key_value.header_color && !remove_logo_bg_color) ? key_value.header_color : '#ffffff';

      $rootScope.flow_data = localStorage.getItem('flow_data') ? JSON.parse(localStorage.getItem('flow_data')) : [];
      if ($rootScope.flow_data.length) {
        $rootScope.flow_data_values = $rootScope.flow_data.map(flow => {
          return flow.flow_type
        });
      }
      $rootScope.is_single_vendor = screen_flow.is_single_vendor;
      $rootScope.is_multiple_branch = screen_flow.is_multiple_branch;
      $rootScope.app_type = screen_flow.app_type;
      $rootScope.allow_dynamic_image_on_fotter = settings.key_value.allow_dynamic_image_on_fotter;
      $rootScope.single_vendor_id = settings.supplier_id;
      $rootScope.supplier_branch_id = settings.supplier_branch_id;
      $rootScope.is_pickup = settings.bookingFlow[0].is_pickup_order;
      $rootScope.is_branch_login = parseInt(localStorage.getItem('is_branch'));
      $rootScope.profile_image = key_value.logo_url ? key_value.logo_url : null;
      // $rootScope.user_image = key_value.logo_url ? key_value.logo_url : null;
      $rootScope.payment_method = key_value.payment_method ? key_value.payment_method : null;
      $rootScope.localisation = factories.localisation();
      $rootScope.business_name = localStorage.getItem('business_name') ? localStorage.getItem('business_name') : 'Royo Apps';
      $rootScope.is_subscribed = localStorage.getItem('is_subscribed');
      $rootScope.currency = localStorage.getItem('currency') && localStorage.getItem('currency') != undefined ? localStorage.getItem('currency') : '$';
      $rootScope.is_white_label = localStorage.getItem('is_white_label');
      $rootScope.delivery_charge_algo = key_value.delivery_charge_algorithem ? key_value.delivery_charge_algorithem : (([1].includes(screen_flow.app_type) && screen_flow.app_type <= 10) ? 0 : 1);
      $rootScope.delivery_charge_type = key_value.delivery_charge_type ? key_value.delivery_charge_type : 0;
      $rootScope.user_service_fee = key_value.user_service_fee ? key_value.user_service_fee : 0;
      $rootScope.prescription = key_value.cart_image_upload ? key_value.cart_image_upload : 0;
      $rootScope.instruction = key_value.order_instructions ? key_value.order_instructions : 0;
      $rootScope.is_secondary_language = key_value.secondary_language && key_value.secondary_language != 0 ? 1 : 0;
      $rootScope.delivery_distance_unit = key_value.delivery_distance_unit ? key_value.delivery_distance_unit : 0;
      $rootScope.gift_card = key_value.gift_card ? key_value.gift_card : 0;
      $rootScope.is_subscription_plan = key_value.is_subscription_plan ? key_value.is_subscription_plan : 0;
      $rootScope.is_supplier_detail = key_value.is_supplier_detail ? key_value.is_supplier_detail : 0;
      $rootScope.agent_tip = key_value.agent_tip ? key_value.agent_tip : 0;
      $rootScope.product_pdf_upload = key_value.product_pdf_upload ? key_value.product_pdf_upload : 0;
      $rootScope.schedule_delivery = key_value.schedule_delivery ? key_value.schedule_delivery : 0;
      $rootScope.disable_app_sharing_message = key_value.disable_app_sharing_message ? key_value.disable_app_sharing_message : 0;
      $rootScope.is_return_request = key_value.is_return_request ? key_value.is_return_request : 0;
      $rootScope.is_tax_geofence = key_value.is_tax_geofence ? key_value.is_tax_geofence : 0;
      $rootScope.is_user_type = key_value.is_user_type ? key_value.is_user_type : 0; //god panel
      $rootScope.user_type_check = key_value.user_type_check ? key_value.user_type_check : 0; //admin     
      $rootScope.disable_import = key_value.disable_import ? key_value.disable_import : 0;
      $rootScope.bypass_otp = key_value.bypass_otp ? key_value.bypass_otp : 0;
      $rootScope.disable_agent_manual_assignment = key_value.disable_agent_manual_assignment ? key_value.disable_agent_manual_assignment : 0;
      $rootScope.ecom_agent_module = key_value.ecom_agent_module ? key_value.ecom_agent_module : 0;
      $rootScope.disable_supplier_category_add = key_value.disable_supplier_category_add ? key_value.disable_supplier_category_add : 0;
      $rootScope.is_db_clone = key_value.is_db_clone ? key_value.is_db_clone : 0;
      $rootScope.allow_supplier_category_edit = key_value.allow_supplier_category_edit ? key_value.allow_supplier_category_edit : 0;
      $rootScope.social_media_icons = key_value.social_media_icons ? key_value.social_media_icons : 0;
      $rootScope.hide_delivery_charges = key_value.hide_delivery_charges ? key_value.hide_delivery_charges : 0;
      $rootScope.no_agent_occupation = key_value.no_agent_occupation ? key_value.no_agent_occupation : 0;
      $rootScope.no_supplier_recommendation = key_value.no_supplier_recommendation ? key_value.no_supplier_recommendation : 0;
      $rootScope.allow_supplier_banner_edit = key_value.allow_supplier_banner_edit ? key_value.allow_supplier_banner_edit : 0;
      $rootScope.is_schdule_order = key_value.is_schdule_order ? key_value.is_schdule_order : 0;
      $rootScope.supplier_payment_method = 1 ? 1: 0;
      $rootScope.disable_supplier_order_accept = key_value.disable_supplier_order_accept ? key_value.disable_supplier_order_accept : 0;
      $rootScope.supplier_gst_no = key_value.supplier_gst_no ? key_value.supplier_gst_no : 0;
      $rootScope.disable_vendor_panel_document_approval = key_value.disable_vendor_panel_document_approval ? key_value.disable_vendor_panel_document_approval : 0;
      $rootScope.is_user_subscription = key_value.is_user_subscription ? key_value.is_user_subscription : 0;
      $rootScope.is_loyality_enable = key_value.is_loyality_enable ? key_value.is_loyality_enable : 0;
      $rootScope.hideAgentList = key_value.hideAgentList ? key_value.hideAgentList : 0;
      $rootScope.is_feedback_form_enabled = key_value.is_feedback_form_enabled ? key_value.is_feedback_form_enabled : 0;
      $rootScope.is_table_booking = key_value.is_table_booking ? key_value.is_table_booking : 0;
      $rootScope.is_product_weight = key_value.is_product_weight ? key_value.is_product_weight : 0;
      $rootScope.by_pass_tables_selection = key_value.by_pass_tables_selection ? key_value.by_pass_tables_selection : 0;
      $rootScope.supplier_country_of_origin = key_value.supplier_country_of_origin ? key_value.supplier_country_of_origin : 0;
      $rootScope.is_multiple_images = key_value.is_multiple_images ? key_value.is_multiple_images : 0;
      $rootScope.is_survey_monkey_enabled = key_value.is_survey_monkey_enabled ? key_value.is_survey_monkey_enabled : 0;
      $rootScope.agent_product_slot_assignment = key_value.agent_product_slot_assignment ? key_value.agent_product_slot_assignment : 0;
      $rootScope.is_enabled_multiple_base_delivery_charges = key_value.is_enabled_multiple_base_delivery_charges ? key_value.is_enabled_multiple_base_delivery_charges : 0;
      $rootScope.is_enabled_agent_base_price = key_value.is_enabled_agent_base_price ? key_value.is_enabled_agent_base_price : 0;
      $rootScope.is_social_ecommerce = key_value.is_social_ecommerce ? key_value.is_social_ecommerce : 0;
      $rootScope.is_currency_exchange_rate = key_value.is_currency_exchange_rate ? key_value.is_currency_exchange_rate : 0;
      $rootScope.branch_flow = key_value.branch_flow ? key_value.branch_flow : 0;
      $rootScope.is_vendor_registration = key_value.is_vendor_registration ? key_value.is_vendor_registration : 0;
      $rootScope.agent_verification_code_enable = key_value.agent_verification_code_enable ? key_value.agent_verification_code_enable : 0;
      $rootScope.hideAgentList = key_value.hideAgentList ? key_value.hideAgentList : 0;
      $rootScope.category_sequence = key_value.category_sequence ? key_value.category_sequence : 0;
      $rootScope.price_decimal_length = key_value.price_decimal_length ? parseInt(key_value.price_decimal_length) : 2;
      $rootScope.disable_supplier_category_block_delete = key_value.disable_supplier_category_block_delete ? key_value.disable_supplier_category_block_delete : 0;
      $rootScope.disable_tax = key_value.disable_tax ? key_value.disable_tax : 0;
      $rootScope.is_pos_enabled = key_value.is_pos_enabled ? key_value.is_pos_enabled : 0;
      $rootScope.show_platform_versions = key_value.show_platform_versions ? key_value.show_platform_versions : 0;
      $rootScope.hide_user_info_supplier = key_value.hide_user_info_supplier ? key_value.hide_user_info_supplier : 0;
      $rootScope.hide_agent_info_supplier = key_value.hide_agent_info_supplier ? key_value.hide_agent_info_supplier : 0;
      $rootScope.disable_supplier_delivery_status = key_value.disable_supplier_delivery_status ? key_value.disable_supplier_delivery_status : 0;
      $rootScope.hide_agent_tip = key_value.hide_agent_tip ? key_value.hide_agent_tip : 0;
      $rootScope.disable_product_report_columns_supplier = key_value.disable_product_report_columns_supplier ? key_value.disable_product_report_columns_supplier : 0;
      $rootScope.is_admin_placeholder_edit = key_value.is_admin_placeholder_edit ? key_value.is_admin_placeholder_edit : 0;
      $rootScope.hide_pickup_status = key_value.hide_pickup_status ? key_value.hide_pickup_status : 0;
      $rootScope.hide_agent_module = key_value.hide_agent_module ? key_value.hide_agent_module : 0;
      $rootScope.hide_service_fee_in_supplier = key_value.hide_service_fee_in_supplier ? key_value.hide_service_fee_in_supplier : 0;
      $rootScope.is_eligible_order_amount = key_value.is_eligible_order_amount ? key_value.is_eligible_order_amount : 0;
      $rootScope.allow_agent_request_popup_dynamic = key_value.allow_agent_request_popup_dynamic ? key_value.allow_agent_request_popup_dynamic : 0;
      $rootScope.disable_supplier_main_category_add_edit = key_value.disable_supplier_main_category_add_edit ? key_value.disable_supplier_main_category_add_edit : 0;
      $rootScope.supplier_category_not_required = key_value.supplier_category_not_required ? key_value.supplier_category_not_required : 0;
      $rootScope.disable_ontheway_delivered_admin = key_value.disable_ontheway_delivered_admin ? key_value.disable_ontheway_delivered_admin : 0;
      $rootScope.disable_supplier_promo_edit = key_value.disable_supplier_promo_edit ? key_value.disable_supplier_promo_edit : 0;
      $rootScope.supplier_subscription_revnue_graph = key_value.supplier_subscription_revnue_graph ? key_value.supplier_subscription_revnue_graph : 0;
      $rootScope.enable_agent_pwd_reset = key_value.enable_agent_pwd_reset ? key_value.enable_agent_pwd_reset : 1;
      $rootScope.hide_app_links_supplier = key_value.hide_app_links_supplier ? key_value.hide_app_links_supplier : 0;
      $rootScope.disbale_add_sgent_supplier = key_value.disbale_add_sgent_supplier ? key_value.disbale_add_sgent_supplier : 0;
      $rootScope.hide_dashboard_orders = key_value.hide_dashboard_orders ? key_value.hide_dashboard_orders : 0;
      $rootScope.disable_admin_order_status = key_value.disable_admin_order_status ? key_value.disable_admin_order_status : 0;
      $rootScope.no_supplier_sub_admins = key_value.no_supplier_sub_admins ? key_value.no_supplier_sub_admins : 0;


      $rootScope.enable_braintree_google_pay = key_value.enable_braintree_google_pay ? key_value.enable_braintree_google_pay : 0;
      $rootScope.google_pay_merchant_id = key_value.google_pay_merchant_id ? key_value.google_pay_merchant_id : 0;

      $rootScope.admin_to_agent_chat = key_value.admin_to_agent_chat ? key_value.admin_to_agent_chat : 0;
      $rootScope.admin_to_supplier_chat = key_value.admin_to_supplier_chat ? key_value.admin_to_supplier_chat : 0;
      $rootScope.admin_to_user_chat = key_value.admin_to_user_chat ? key_value.admin_to_user_chat : 0;
      $rootScope.supplier_to_user_chat = key_value.supplier_to_user_chat ? key_value.supplier_to_user_chat : 0;
      $rootScope.addon_type_quantity = key_value.addon_type_quantity ? key_value.addon_type_quantity : 0;

      $rootScope.is_supplier_stripe_split_enabled = key_value.is_supplier_stripe_split_enabled ? key_value.is_supplier_stripe_split_enabled : 0;
      $rootScope.is_agent_stripe_split_enabled = key_value.is_agent_stripe_split_enabled ? key_value.is_agent_stripe_split_enabled : 0;
      $rootScope.create_stripe_connect_account = key_value.create_stripe_connect_account ? key_value.create_stripe_connect_account : '';
      $rootScope.show_user_stripe_account_connectivity = key_value.show_user_stripe_account_connectivity ? key_value.show_user_stripe_account_connectivity : '';

      $rootScope.is_agent_rating = key_value.is_agent_rating ? key_value.is_agent_rating : 0;
      $rootScope.is_supplier_rating = key_value.is_supplier_rating ? key_value.is_supplier_rating : 0;
      $rootScope.is_product_rating = key_value.is_product_rating ? key_value.is_product_rating : 0;

      $rootScope.selected_template = key_value.selected_template ? parseInt(key_value.selected_template) : 0;
      $rootScope.app_banner_width = key_value.app_banner_width ? parseInt(key_value.app_banner_width) : 0;
      $rootScope.order_request = key_value.order_request ? parseInt(key_value.order_request) : 0;
      $rootScope.product_prescription = key_value.product_prescription ? parseInt(key_value.product_prescription) : 0;
      $rootScope.dynamic_home_section = key_value.dynamic_home_section ? parseInt(key_value.dynamic_home_section) : 0;

      $rootScope.no_tax_in_category = key_value.no_tax_in_category ? key_value.no_tax_in_category : 0;
      $rootScope.no_category_images = key_value.no_category_images ? key_value.no_category_images : 0;
      $rootScope.no_banner_section = key_value.no_banner_section ? key_value.no_banner_section : 0;
      $rootScope.no_default_address = key_value.no_default_address ? key_value.no_default_address : 0;
      $rootScope.no_product_quantity = key_value.no_product_quantity ? key_value.no_product_quantity : 0;
      $rootScope.no_subcategory = key_value.no_subcategory ? key_value.no_subcategory : 0;
      $rootScope.is_dine_in = key_value.is_dine_in ? key_value.is_dine_in : 0;
      $rootScope.product_tags = key_value.product_tags ? key_value.product_tags : 0;
      $rootScope.user_id_proof = key_value.user_id_proof ? key_value.user_id_proof : 0;
      $rootScope.disable_supplier_edit_info = key_value.disable_supplier_edit_info ? key_value.disable_supplier_edit_info : 0;
      $rootScope.no_catalogue = key_value.no_catalogue ? key_value.no_catalogue : 0;
      $rootScope.no_food_item_admin = key_value.no_food_item_admin ? key_value.no_food_item_admin : 0;
      $rootScope.food_item_image_optional = key_value.food_item_image_optional ? key_value.food_item_image_optional : 0;
      $rootScope.food_item_desc_optional = key_value.food_item_desc_optional ? key_value.food_item_desc_optional : 0;
      $rootScope.category_desc_optional = key_value.category_desc_optional ? key_value.category_desc_optional : 0;
      $rootScope.no_rating_review = key_value.no_rating_review ? key_value.no_rating_review : 0;
      $rootScope.no_send_notification = key_value.no_send_notification ? key_value.no_send_notification : 0;
      $rootScope.no_user_email = key_value.no_user_email ? key_value.no_user_email : 0;
      $rootScope.no_online_orders = key_value.no_online_orders ? key_value.no_online_orders : 0;
      $rootScope.no_cash_orders = key_value.no_cash_orders ? key_value.no_cash_orders : 0;
      $rootScope.ride_admin_url = key_value.ride_admin_url ? key_value.ride_admin_url : '';
      $rootScope.android_app_url = key_value.android_app_url ? key_value.android_app_url : '';
      $rootScope.ios_app_url = key_value.ios_app_url ? key_value.ios_app_url : '';
      $rootScope.hide_website_url = key_value.hide_website_url ? key_value.hide_website_url : 0;
      $rootScope.allow_agentwallet_to_pay_for_cashorder = key_value.allow_agentwallet_to_pay_for_cashorder ? key_value.allow_agentwallet_to_pay_for_cashorder : 0;
      $rootScope.is_sos_allow = key_value.is_sos_allow ? key_value.is_sos_allow : 0;
      $rootScope.show_status_info_settings = key_value.show_status_info_settings ? key_value.show_status_info_settings : 0;
      $rootScope.enable_user_signature = key_value.enable_user_signature ? key_value.enable_user_signature : 0;

      $rootScope.isProductCustomTabDescriptionEnable = key_value.isProductCustomTabDescriptionEnable ? key_value.isProductCustomTabDescriptionEnable : 0;
      $rootScope.addDocumentsInAgent = key_value.addDocumentsInAgent ? key_value.addDocumentsInAgent : 0;

      $rootScope.footer_type = key_value.footer_type ? parseInt(key_value.footer_type) : 0;

      $rootScope.hide_delivery_radius_vendor = key_value.hide_delivery_radius_vendor ? key_value.hide_delivery_radius_vendor : 0;
      $rootScope.hide_delivery_time_supplier = key_value.hide_delivery_time_supplier ? key_value.hide_delivery_time_supplier : 0;
      $rootScope.hide_promo_commission = key_value.hide_promo_commission ? key_value.hide_promo_commission : 0;
      $rootScope.hide_banner_category_supplier = key_value.hide_banner_category_supplier ? key_value.hide_banner_category_supplier : 0;
      $rootScope.no_website = key_value.no_website ? key_value.no_website : 0;
      $rootScope.disable_name_address_supplier = key_value.disable_name_address_supplier ? key_value.disable_name_address_supplier : 0;
      $rootScope.hide_delivery_charges_supplier = key_value.hide_delivery_charges_supplier ? key_value.hide_delivery_charges_supplier : 0;
      $rootScope.hide_agent_supplier = key_value.hide_agent_supplier ? key_value.hide_agent_supplier : 0;
      $rootScope.is_multicurrency_enable = key_value.is_multicurrency_enable ? key_value.is_multicurrency_enable : 0;
      $rootScope.enable_supplier_in_special_offer = key_value.enable_supplier_in_special_offer ? key_value.enable_supplier_in_special_offer : 0;

      $rootScope.no_supplier_delivery_charge = key_value.no_supplier_delivery_charge ? key_value.no_supplier_delivery_charge : 0;
      $rootScope.no_driver_detail_supplier = key_value.no_driver_detail_supplier ? key_value.no_driver_detail_supplier : 0;
      $rootScope.no_supplier_banner_section = key_value.no_supplier_banner_section ? key_value.no_supplier_banner_section : 0;
      $rootScope.add_variant_supplier = key_value.add_variant_supplier ? key_value.add_variant_supplier : 0;
      $rootScope.not_all_variant_required = key_value.not_all_variant_required ? key_value.not_all_variant_required : 0;
      $rootScope.addABNInAgent = key_value.addABNInAgent ? key_value.addABNInAgent : 0;
      $rootScope.disable_agent_manual_assignment_supplier = key_value.disable_agent_manual_assignment_supplier ? key_value.disable_agent_manual_assignment_supplier : 0;
      $rootScope.is_data_filter_by_country = key_value.is_data_filter_by_country ? key_value.is_data_filter_by_country : 0;

      $rootScope.hide_supplier_branch = key_value.hide_supplier_branch ? key_value.hide_supplier_branch : 0;
      $rootScope.no_supplier_promotion_section = key_value.no_supplier_promotion_section ? parseInt(key_value.no_supplier_promotion_section) : 0;

      $rootScope.wallet_module = key_value.wallet_module ? key_value.wallet_module : 0;
      $rootScope.is_mark_out_of_stock = key_value.is_mark_out_of_stock ? key_value.is_mark_out_of_stock : 0;
      $rootScope.is_abn_business = key_value.is_abn_business ? key_value.is_abn_business : 0;
      $rootScope.hide_supplier_accounting = key_value.hide_supplier_accounting ? key_value.hide_supplier_accounting : 0;
      $rootScope.is_laundry_theme = key_value.is_laundry_theme ? key_value.is_laundry_theme : 0;
      $rootScope.dropoff_buffer = key_value.dropoff_buffer ? key_value.dropoff_buffer : 0;

      $rootScope.is_single_menu = key_value.is_single_menu ? key_value.is_single_menu : 0;

      $rootScope.enable_size_chart_in_product = key_value.enable_size_chart_in_product ? key_value.enable_size_chart_in_product : 0;
      $rootScope.enable_country_of_origin_in_product = key_value.enable_country_of_origin_in_product ? key_value.enable_country_of_origin_in_product : 0;

      $rootScope.is_invoice_print_enable = key_value.is_invoice_print_enable ? key_value.is_invoice_print_enable : 0;
      $rootScope.is_tutorial_screen_enable = key_value.is_tutorial_screen_enable ? key_value.is_tutorial_screen_enable : 0;
      $rootScope.is_vehicle_category_enable = key_value.is_vehicle_category_enable ? key_value.is_vehicle_category_enable : 0;
      $rootScope.show_status_info_settings = key_value.show_status_info_settings ? key_value.show_status_info_settings : 0;
      $rootScope.is_update_price_enable = key_value.is_update_price_enable ? key_value.is_update_price_enable : 0;
      $rootScope.is_nhs_filter_enable = key_value.is_nhs_filter_enable ? key_value.is_nhs_filter_enable : 0;
      $rootScope.is_consider_qty_enable = key_value.is_consider_qty_enable ? key_value.is_consider_qty_enable : 0;
      $rootScope.is_minimum_distance_enable = key_value.is_minimum_distance_enable ? key_value.is_minimum_distance_enable : 0;
      $rootScope.enable_min_order_distance_wise = key_value.enable_min_order_distance_wise ? key_value.enable_min_order_distance_wise : 0;
      $rootScope.show_tags_for_suppliers = key_value.show_tags_for_suppliers ? key_value.show_tags_for_suppliers : 0;
      $rootScope.is_glassdoor_link = key_value.is_glassdoor_link ? key_value.is_glassdoor_link : 0;
      $rootScope.hide_ontheway_delivered_supplier = key_value.hide_ontheway_delivered_supplier ? key_value.hide_ontheway_delivered_supplier : 0;
      $rootScope.survey_monkey_access_token = key_value.survey_monkey_access_token ? key_value.survey_monkey_access_token : '';

      $rootScope.show_supplier_info_settings = key_value.show_supplier_info_settings ? key_value.show_supplier_info_settings : 0;

      $rootScope.is_alternate_about_us = key_value.is_alternate_about_us ? key_value.is_alternate_about_us : 0;
      $rootScope.is_gif =1 ? 1 : 0;

      $rootScope.enable_maroof_password_supplier_reg = key_value.enable_maroof_password_supplier_reg ? key_value.enable_maroof_password_supplier_reg : 0;
      $rootScope.is_variant_product_import = key_value.is_variant_product_import ? key_value.is_variant_product_import : 0;

      $rootScope.is_app_version_enable = key_value.is_app_version_enable ? key_value.is_app_version_enable : 0;

      $rootScope.is_flavor_of_week_enable = key_value.is_flavor_of_week_enable ? key_value.is_flavor_of_week_enable : 0;
      $rootScope.is_delivery_charge_weight_wise_enable = key_value.is_delivery_charge_weight_wise_enable ? key_value.is_delivery_charge_weight_wise_enable : 0;

      $rootScope.is_enable_delivery_type = key_value.is_enable_delivery_type ? key_value.is_enable_delivery_type : 0;
      $rootScope.is_enable_multiple_banner = key_value.is_enable_multiple_banner ? key_value.is_enable_multiple_banner : 0;
      $rootScope.is_enable_orderwise_gateways = key_value.is_enable_orderwise_gateways ? key_value.is_enable_orderwise_gateways : 0;

      $rootScope.allow_agent_request_popup_dynamic = key_value.allow_agent_request_popup_dynamic ? key_value.allow_agent_request_popup_dynamic : 0;

      $rootScope.dynamic_order_type_client_wise = key_value.dynamic_order_type_client_wise ? key_value.dynamic_order_type_client_wise : 0;
      $rootScope.dynamic_order_type_client_wise_delivery = key_value.dynamic_order_type_client_wise_delivery ? key_value.dynamic_order_type_client_wise_delivery : 0;
      $rootScope.dynamic_order_type_client_wise_pickup = key_value.dynamic_order_type_client_wise_pickup ? key_value.dynamic_order_type_client_wise_pickup : 0;
      $rootScope.dynamic_order_type_client_wise_dinein = key_value.dynamic_order_type_client_wise_dinein ? key_value.dynamic_order_type_client_wise_dinein : 0;

      $rootScope.enable_user_vehicle_number = key_value.enable_user_vehicle_number ? key_value.enable_user_vehicle_number : 0;

      $rootScope.enable_item_purchase_limit = key_value.enable_item_purchase_limit ? key_value.enable_item_purchase_limit : 0;
      $rootScope.is_enable_subscription_required = key_value.is_enable_subscription_required ? key_value.is_enable_subscription_required : 0;
      $rootScope.is_enable_max_discount_value = key_value.is_enable_max_discount_value ? key_value.is_enable_max_discount_value : 0;
      $rootScope.disable_supplier_profile_edit = key_value.disable_supplier_profile_edit ? key_value.disable_supplier_profile_edit : 0;

      $rootScope.enable_address_reference = key_value.enable_address_reference ? key_value.enable_address_reference : 0;
      $rootScope.supplier_subscription_revnue_graph = key_value.supplier_subscription_revnue_graph ? key_value.supplier_subscription_revnue_graph : 0;
      $rootScope.cutom_country_code = key_value.cutom_country_code ? key_value.cutom_country_code : 0;

      $rootScope.enable_agent_email_notification = key_value.enable_agent_email_notification ? key_value.enable_agent_email_notification : 0;
      $rootScope.enable_referral_bal_limit = key_value.enable_referral_bal_limit ? key_value.enable_referral_bal_limit : 0;
      $rootScope.enable_agent_leave_notes = key_value.enable_agent_leave_notes ? key_value.enable_agent_leave_notes : 0;
      if ($rootScope.enable_agent_leave_notes) {
        $rootScope.leave_notes_reasons = key_value.enable_agent_leave_notes || ''
      }

      $rootScope.enable_in_out_network = key_value.enable_in_out_network ? key_value.enable_in_out_network : 0;

      $rootScope.enable_cutlery_option = key_value.enable_cutlery_option ? key_value.enable_cutlery_option : 0;

      $rootScope.is_instance_selection = key_value.is_instance_selection ? key_value.is_instance_selection : 0;
      $rootScope.enable_audio_video = key_value.enable_audio_video ? key_value.enable_audio_video : 0;

      $rootScope.enable_food_varients = key_value.enable_food_varients ? key_value.enable_food_varients : 0;
      $rootScope.cat_variant_import_sample_url = key_value.cat_variant_import_sample_url ? key_value.cat_variant_import_sample_url : 0;
      $rootScope.enable_date_of_birth = key_value.enable_date_of_birth ? key_value.enable_date_of_birth : 0;
      $rootScope.dynamic_home_screen_sections = key_value.dynamic_home_screen_sections ? key_value.dynamic_home_screen_sections : 0;
      $rootScope.is_order_types_screen_dynamic = key_value.is_order_types_screen_dynamic ? key_value.is_order_types_screen_dynamic : 0;
      $rootScope.enable_flat_user_service_charge = key_value.enable_flat_user_service_charge ? key_value.enable_flat_user_service_charge : 0;
      $rootScope.is_multicurrency_enable = key_value.is_multicurrency_enable ? key_value.is_multicurrency_enable : 0;
      $rootScope.enable_supplier_in_special_offer = key_value.enable_supplier_in_special_offer ? key_value.enable_supplier_in_special_offer : 0;
      $rootScope.enable_admin_cat_sorting = key_value.enable_admin_cat_sorting ? key_value.enable_admin_cat_sorting : 0;

      $rootScope.enable_product_appointment = key_value.enable_product_appointment ? key_value.enable_product_appointment : 0;
      $rootScope.enable_whatsapp_contact_us = key_value.enable_whatsapp_contact_us ? key_value.enable_whatsapp_contact_us : 0;


      $rootScope.enable_product_allergy = key_value.enable_product_allergy ? key_value.enable_product_allergy : 0;


      $rootScope.enable_geofence_wise_categories = key_value.enable_geofence_wise_categories ? key_value.enable_geofence_wise_categories : 0;
      $rootScope.table_book_mac_theme = parseInt(key_value.table_book_mac_theme) ? key_value.table_book_mac_theme : 0;
      $rootScope.enable_min_loyality_points = key_value.enable_min_loyality_points ? key_value.enable_min_loyality_points : 0;

      $rootScope.enable_product_special_instruction = key_value.enable_product_special_instruction ? key_value.enable_product_special_instruction : 0;
      $rootScope.enable_product_wise_special_instruction = key_value.enable_product_wise_special_instruction ? key_value.enable_product_wise_special_instruction : 0;
      $rootScope.enable_block_time = key_value.enable_block_time ? key_value.enable_block_time : 0;
      $rootScope.enable_zone_geofence = key_value.enable_zone_geofence ? key_value.enable_zone_geofence : 0;
      $rootScope.enable_sequence_wise_supplier = key_value.enable_sequence_wise_supplier ? key_value.enable_sequence_wise_supplier : 0;
      $rootScope.enable_all_supplier_block_status_update = key_value.enable_all_supplier_block_status_update ? key_value.enable_all_supplier_block_status_update : 0;
      $rootScope.enable_all_supplier_scheduling_status_update = key_value.enable_all_supplier_scheduling_status_update ? key_value.enable_all_supplier_scheduling_status_update : 0;
      $rootScope.enable_video_in_banner = key_value.enable_video_in_banner ? key_value.enable_video_in_banner : 0;
      $rootScope.enable_voucher_section = key_value.enable_voucher_section ? key_value.enable_voucher_section : 0;
      $rootScope.is_flash_sale = key_value.is_flash_sale ? key_value.is_flash_sale : 0;
      $rootScope.display_slot_with_difference = key_value.display_slot_with_difference ? key_value.display_slot_with_difference : 0;
      $rootScope.cutom_country_code = key_value.cutom_country_code ? key_value.cutom_country_code : 0;

      $rootScope.enable_block_time = key_value.enable_block_time ? key_value.enable_block_time : 0;
      $rootScope.enable_zone_geofence = key_value.enable_zone_geofence ? key_value.enable_zone_geofence : 0;
      $rootScope.enable_sequence_wise_supplier = key_value.enable_sequence_wise_supplier ? key_value.enable_sequence_wise_supplier : 0;

      $rootScope.enable_no_touch_delivery = key_value.enable_no_touch_delivery ? key_value.enable_no_touch_delivery : 0;
      $rootScope.enable_updation_vendor_approval = key_value.enable_updation_vendor_approval ? key_value.enable_updation_vendor_approval : 0;
      $rootScope.is_supplier_slogan_add_edit = key_value.is_supplier_slogan_add_edit ? key_value.is_supplier_slogan_add_edit : 0;
      $rootScope.inventory_optional = key_value.inventory_optional ? parseInt(key_value.inventory_optional) : 0;
      $rootScope.is_default_order_list = key_value.is_default_order_list ? key_value.is_default_order_list : 0;

      $rootScope.addDocumentsInAgent_DL = key_value.addDocumentsInAgent_DL ? key_value.addDocumentsInAgent_DL : 0;
      $rootScope.addDocumentsInAgent_DL_Images = key_value.addDocumentsInAgent_DL_Images ? key_value.addDocumentsInAgent_DL_Images : 0;


      $rootScope.hide_delivery_fields_for_suppliers = key_value.hide_delivery_fields_for_suppliers ? key_value.hide_delivery_fields_for_suppliers : 0;
      $rootScope.hide_account_payouts = key_value.hide_account_payouts ? key_value.hide_account_payouts : 0;
      $rootScope.show_product_in_supplier_detail = key_value.show_product_in_supplier_detail ? key_value.show_product_in_supplier_detail : 0;


      $rootScope.image_placeholder = 'img/v1_images/back-placeholder.png';
      $rootScope.restriction_view_only_for_restaurant = parseInt(key_value.restriction_view_only_for_restaurant) ? key_value.restriction_view_only_for_restaurant : 0;

      $rootScope.enable_liquor_popup = key_value.enable_liquor_popup ? key_value.enable_liquor_popup : 0;
      $rootScope.enable_default_agent_tip = key_value.enable_default_agent_tip ? key_value.enable_default_agent_tip : 0;
      $rootScope.enable_custom_pages = key_value.enable_custom_pages ? key_value.enable_custom_pages : 0;
      $rootScope.enable_order_amount_for_free_delivery = key_value.enable_order_amount_for_free_delivery ? key_value.enable_order_amount_for_free_delivery : 0;
      $rootScope.add_variant_description = key_value.add_variant_description ? key_value.add_variant_description : 0;
      $rootScope.remove_delivery_charge_supplier = key_value.remove_delivery_charge_supplier ? key_value.remove_delivery_charge_supplier : 0;
      $rootScope.remove_service_fee_supplier = key_value.remove_service_fee_supplier ? key_value.remove_service_fee_supplier : 0;
      $rootScope.enable_order_calendar_supplier = key_value.enable_order_calendar_supplier ? key_value.enable_order_calendar_supplier : 0;

      $rootScope.addFontHKGrotesk = key_value.addFontHKGrotesk ? key_value.addFontHKGrotesk : 0;
      $rootScope.disable_csv_download_supplier = key_value.disable_csv_download_supplier ? key_value.disable_csv_download_supplier : 0;
      $rootScope.disable_csv_download = key_value.disable_csv_download ? key_value.disable_csv_download : 0;

      $rootScope.enable_time_slot_in_zone_geofence = key_value.enable_time_slot_in_zone_geofence ? key_value.enable_time_slot_in_zone_geofence : 0;
      $rootScope.enable_weight_price_rate = key_value.enable_weight_price_rate ? key_value.enable_weight_price_rate : 0;
      $rootScope.enable_sub_category_block = key_value.enable_sub_category_block ? key_value.enable_sub_category_block : 0;
      $rootScope.enable_supplier_add_edit_delete_restriction = key_value.enable_supplier_add_edit_delete_restriction ? key_value.enable_supplier_add_edit_delete_restriction : 0;

      $rootScope.enable_product_calories = key_value.enable_product_calories ? key_value.enable_product_calories : 0;
      $rootScope.enable_manual_user_loyality_update = key_value.enable_manual_user_loyality_update ? key_value.enable_manual_user_loyality_update : 0;
      $rootScope.is_hide_timing_configuration = key_value.is_hide_timing_configuration ? key_value.is_hide_timing_configuration : 0;
      $rootScope.track_agent_supplier = key_value.track_agent_supplier ? key_value.track_agent_supplier : 0;
      $rootScope.enable_custom_orders = key_value.enable_custom_orders ? key_value.enable_custom_orders : 0;
      $rootScope.enable_return_claim_request = key_value.enable_return_claim_request ? key_value.enable_return_claim_request : 0;

      $rootScope.enable_supplier_express_schedule_delivery_provide = key_value.enable_supplier_express_schedule_delivery_provide ? key_value.enable_supplier_express_schedule_delivery_provide : 0;

      $rootScope.enable_contact_us_supplier = key_value.enable_contact_us_supplier ? key_value.enable_contact_us_supplier : 0;
      $rootScope.enable_service_pickup = key_value.enable_service_pickup ? key_value.enable_service_pickup : 0;
      $rootScope.enable_service_for = key_value.enable_service_for ? key_value.enable_service_for : 0;
      $rootScope.show_total_user_order = key_value.show_total_user_order ? key_value.show_total_user_order : 0;
      $rootScope.hide_top_nav_links = key_value.hide_top_nav_links ? key_value.hide_top_nav_links : 0;

      $rootScope.price_decimal_zero = key_value.price_decimal_zero ? key_value.price_decimal_zero : 0;
      if ($rootScope.price_decimal_zero == 1) {
        $rootScope.price_decimal_length = 0;
      }

      $rootScope.number_length = key_value.number_length ? key_value.number_length : 4;
      $rootScope.hide_processing_step = key_value.hide_processing_step ? key_value.hide_processing_step : 0;
      $rootScope.hide_process_complete_status = key_value.hide_process_complete_status ? key_value.hide_process_complete_status : 0;

      $rootScope.new_knockknock_icons = key_value.new_knockknock_icons ? key_value.new_knockknock_icons : 0;
      $rootScope.enable_knock_theme = key_value.enable_knock_theme ? parseInt(key_value.enable_knock_theme) : 0;
      $rootScope.enable_second_theme_color = key_value.enable_second_theme_color ? key_value.enable_second_theme_color : 0;
      $rootScope.display_vendor_availability = key_value.display_vendor_availability ? key_value.display_vendor_availability : 0;
      $rootScope.show_report_total_counts = key_value.show_report_total_counts ? key_value.show_report_total_counts : 0;
      $rootScope.show_user_graph_dash = key_value.show_user_graph_dash ? key_value.show_user_graph_dash : 0;

      $rootScope.hide_top_navbar_supplier = key_value.hide_top_navbar_supplier ? key_value.hide_top_navbar_supplier : 0;
      $rootScope.hide_license_number = key_value.hide_license_number ? key_value.hide_license_number : 0;

      $rootScope.add_sku_product = key_value.add_sku_product ? key_value.add_sku_product : 0;
      $rootScope.show_saudi_investment_number = key_value.show_saudi_investment_number ? key_value.show_saudi_investment_number : 0;
      $rootScope.show_sku_brand_product = key_value.show_sku_brand_product ? key_value.show_sku_brand_product : 0;
      $rootScope.show_product_text = key_value.show_product_text ? key_value.show_product_text : 0;
      $rootScope.user_order_detail_report = key_value.user_order_detail_report ? key_value.user_order_detail_report : 0;

      $rootScope.enable_by_pass_order_confirmation = key_value.enable_by_pass_order_confirmation ? key_value.enable_by_pass_order_confirmation : 0;
      $rootScope.enable_vat_inclusions = key_value.enable_vat_inclusions ? key_value.enable_vat_inclusions : 0;



      $rootScope.enable_notif_ring = key_value.enable_notif_ring ? key_value.enable_notif_ring : 0;
      $rootScope.supplier_category_sequence = key_value.supplier_category_sequence ? key_value.supplier_category_sequence : 0;
      $rootScope.supplier_branch_category_sequence_admin = key_value.supplier_branch_category_sequence_admin ? key_value.supplier_branch_category_sequence_admin : 0;
      $rootScope.enable_supplier_config_closing_day = key_value.enable_supplier_config_closing_day ? key_value.enable_supplier_config_closing_day : 0;

      $rootScope.enable_static_delivery_radius = key_value.enable_static_delivery_radius ? key_value.enable_static_delivery_radius : 0;
      $rootScope.static_delivery_radius = key_value.static_delivery_radius ? key_value.static_delivery_radius : 0;
      $rootScope.enable_cctv = key_value.enable_cctv ? key_value.enable_cctv : 0;

      $rootScope.enable_custom_tax_static = key_value.enable_custom_tax_static ? key_value.enable_custom_tax_static : 0;
      $rootScope.custom_tax_static_value = key_value.custom_tax_static_value ? key_value.custom_tax_static_value : 0;
      $rootScope.enable_fees_estimated_tax_contant = key_value.enable_fees_estimated_tax_contant ? key_value.enable_fees_estimated_tax_contant : 0;
      $rootScope.enable_custom_agent_tip = key_value.enable_custom_agent_tip ? key_value.enable_custom_agent_tip : 0;
      $rootScope.enable_fixed_delivery_charges = key_value.enable_fixed_delivery_charges ? key_value.enable_fixed_delivery_charges : 0;

      $rootScope.enable_order_revenue = key_value.enable_order_revenue ? key_value.enable_order_revenue : 0;

      $rootScope.enable_surge_price = key_value.enable_surge_price ? key_value.enable_surge_price : 0;
      $rootScope.enable_cancel_order_after_confirm = key_value.enable_cancel_order_after_confirm ? key_value.enable_cancel_order_after_confirm : 0;
      $rootScope.enable_services_customize_flow = key_value.enable_services_customize_flow ? key_value.enable_services_customize_flow : 0;

      $rootScope.show_edit_order_description = key_value.show_edit_order_description ? key_value.show_edit_order_description : 0;


      $rootScope.disable_hourly_pricing_in_home_svc = key_value.disable_hourly_pricing_in_home_svc ? key_value.disable_hourly_pricing_in_home_svc : 0;


      $rootScope.is_super_admin = localStorage.getItem('is_superAdmin');

      $rootScope.is_supplier_description = key_value.is_supplier_description ? key_value.is_supplier_description : 0;
      $rootScope.enable_texting_via_phone_number = key_value.enable_texting_via_phone_number ? key_value.enable_texting_via_phone_number : 0;
      $rootScope.order_statuswise_deduction_charges = key_value.order_statuswise_deduction_charges ? key_value.order_statuswise_deduction_charges : 0;
      $rootScope.login_page_disclaimer = key_value.login_page_disclaimer ? key_value.login_page_disclaimer : 0;
      $rootScope.doc_rating_upload = key_value.doc_rating_upload ? key_value.doc_rating_upload : 0;
      $rootScope.enable_instructions_for_driver = key_value.enable_instructions_for_driver ? key_value.enable_instructions_for_driver : 0;
      $rootScope.enable_media_upload_in_supplier_detail = key_value.enable_media_upload_in_supplier_detail ? key_value.enable_media_upload_in_supplier_detail : 0;

      $rootScope.enable_non_veg_filter = key_value.enable_non_veg_filter ? key_value.enable_non_veg_filter : 0;

      $rootScope.enable_create_event_feature = key_value.enable_create_event_feature ? key_value.enable_create_event_feature : 0;
      $rootScope.hide_delivery_options = key_value.hide_delivery_options ? key_value.hide_delivery_options : 0;
      $rootScope.enable_second_logo = key_value.enable_second_logo ? key_value.enable_second_logo : 0;
      $rootScope.show_agent_slots = key_value.show_agent_slots ? key_value.show_agent_slots : 0;
      $rootScope.show_agent_extra_charge = key_value.show_agent_extra_charge ? key_value.show_agent_extra_charge : 0;
      $rootScope.enable_custom_orderId = key_value.enable_custom_orderId ? key_value.enable_custom_orderId : 0;

      $rootScope.hide_report_info_supplier = key_value.hide_report_info_supplier ? key_value.hide_report_info_supplier : 0;
      $rootScope.hide_product_description_image = key_value.hide_product_description_image ? key_value.hide_product_description_image : 0;

      $rootScope.hide_agent_percentage_commission = key_value.hide_agent_percentage_commission ? key_value.hide_agent_percentage_commission : 0;
      $rootScope.enable_driver_date_of_birth = key_value.enable_driver_date_of_birth ? key_value.enable_driver_date_of_birth : 0;
      $rootScope.enable_driver_social_security_no = key_value.enable_driver_social_security_no ? key_value.enable_driver_social_security_no : 0;

      $rootScope.supplier_promotion_section_show = key_value.supplier_promotion_section_show ? key_value.supplier_promotion_section_show : 0;

      $rootScope.hide_driver_edit_option = key_value.hide_driver_edit_option ? key_value.hide_driver_edit_option : 0;



      $rootScope.hide_report_info_supplier = key_value.hide_report_info_supplier ? key_value.hide_report_info_supplier : 0;
      $rootScope.hide_product_description_image = key_value.hide_product_description_image ? key_value.hide_product_description_image : 0;
      $rootScope.display_supplier_doc_name = key_value.display_supplier_doc_name ? key_value.display_supplier_doc_name : 0;

      $rootScope.hide_driver_license_details = key_value.hide_driver_license_details ? key_value.hide_driver_license_details : 0;
      $rootScope.hide_driver_vehicle_details = key_value.hide_driver_vehicle_details ? key_value.hide_driver_vehicle_details : 0;

      $rootScope.enable_account_number = key_value.enable_account_number ? key_value.enable_account_number : 0;
      $rootScope.enable_transist_number = key_value.enable_transist_number ? key_value.enable_transist_number : 0;
      $rootScope.enable_institution_number = key_value.enable_institution_number ? key_value.enable_institution_number : 0;
      $rootScope.hide_user_listing_for_suppliers = key_value.hide_user_listing_for_suppliers ? key_value.hide_user_listing_for_suppliers : 0;


      $rootScope.enable_agent_vehicle_model = key_value.enable_agent_vehicle_model ? key_value.enable_agent_vehicle_model : 0;
      $rootScope.enable_agent_vehicle_maker = key_value.enable_agent_vehicle_maker ? key_value.enable_agent_vehicle_maker : 0;
      $rootScope.enable_agent_vehicle_year = key_value.enable_agent_vehicle_year ? key_value.enable_agent_vehicle_year : 0;
      $rootScope.enable_agent_vehicle_vin = key_value.enable_agent_vehicle_vin ? key_value.enable_agent_vehicle_vin : 0;

      $rootScope.enable_agent_id_proof = key_value.enable_agent_id_proof ? key_value.enable_agent_id_proof : 0;
    

      $rootScope.enable_id_number_in_agent = key_value.enable_id_number_in_agent ? key_value.enable_id_number_in_agent : 0;

      $rootScope.enable_order_desc_price_breakdown = key_value.enable_order_desc_price_breakdown ? key_value.enable_order_desc_price_breakdown : 0;
      $rootScope.product_price_report = key_value.product_price_report ? key_value.product_price_report : 0;
      
      $rootScope.enable_banner_title = key_value.enable_banner_title ? key_value.enable_banner_title : 0;
      
      $rootScope.enable_paystack_gatway_for_supplier_addsubscription = key_value.enable_paystack_gatway_for_supplier_addsubscription ? key_value.enable_paystack_gatway_for_supplier_addsubscription : 0;
      $rootScope.enable_paystack_gatway_for_deletesubscription  = key_value.enable_paystack_gatway_for_deletesubscription ? key_value.enable_paystack_gatway_for_deletesubscription :0;
      $rootScope.hide_chat = key_value.hide_chat ? key_value.hide_chat : 0;

      $rootScope.enable_base_delivery_charge_percentage = key_value.enable_base_delivery_charge_percentage ? key_value.enable_base_delivery_charge_percentage : 0;
      $rootScope.enable_drop_off_options_for_driver = key_value.enable_drop_off_options_for_driver ? key_value.enable_drop_off_options_for_driver : 0;

      if ($rootScope.enable_second_theme_color == 1) {
        if (key_value.element_theme2_color) {
          $rootScope.theme_second_color = key_value.element_theme2_color;
        }
      }

      // Admin Order Create Keys

      $rootScope.enable_admin_order_creation_for_user = key_value.enable_admin_order_creation_for_user ? key_value.enable_admin_order_creation_for_user : 0;

      if ($rootScope.enable_admin_order_creation_for_user == 1) {
        $rootScope.enable_supplier_express_schedule_delivery_provide = key_value.enable_supplier_express_schedule_delivery_provide ? key_value.enable_supplier_express_schedule_delivery_provide : 0;
        $rootScope.timeInterval = settings.bookingFlow[0].interval;
        $rootScope.is_decimal_quantity_allowed = key_value.is_decimal_quantity_allowed ? key_value.is_decimal_quantity_allowed : 0;
        $rootScope.decimalQuantityStep = key_value.decimalQuantityStep ? key_value.decimalQuantityStep : 0;
        $rootScope.enable_custom_gst = key_value.enable_custom_gst ? key_value.enable_custom_gst : 0;
        $rootScope.custom_tax_static_value = key_value.custom_tax_static_value ? key_value.custom_tax_static_value : 0;
        $rootScope.enable_custom_tax_static = key_value.enable_custom_tax_static ? key_value.enable_custom_tax_static : 0;
        $rootScope.custom_tax_value = key_value.custom_tax_value ? key_value.custom_tax_value : 0;
        $rootScope.supplier_service_fee = key_value.supplier_service_fee ? key_value.supplier_service_fee : 0;
        $rootScope.payment_through_wallet_discount = key_value.payment_through_wallet_discount ? key_value.payment_through_wallet_discount : 0;
        $rootScope.loyality_discount_on_product_listing = key_value.loyality_discount_on_product_listing ? key_value.loyality_discount_on_product_listing : 0;
        $rootScope.enable_tax_on_total_amt = key_value.enable_tax_on_total_amt ? key_value.enable_tax_on_total_amt : 0;
        $rootScope.liquor_bottle_tax = key_value.liquor_bottle_tax ? key_value.liquor_bottle_tax : 0;

        $rootScope.hide_addOncharges = key_value.hide_addOncharges ? key_value.hide_addOncharges : 0;
        $rootScope.hide_tax_for_user = key_value.hide_tax_for_user ? key_value.hide_tax_for_user : 0;
        $rootScope.is_dinin = key_value.is_dinin ? key_value.is_dinin : 0;
        $rootScope.enable_multi_supplier_delivery_charge_distance_wise = key_value.enable_multi_supplier_delivery_charge_distance_wise ? key_value.enable_multi_supplier_delivery_charge_distance_wise : 0;
        $rootScope.vendor_status = settings.bookingFlow[0].vendor_status;
      }

      $rootScope.enable_extra_product_service = key_value.enable_extra_product_service ? key_value.enable_extra_product_service : 0;
      $rootScope.restrict_supplier_add_edit_product = key_value.restrict_supplier_add_edit_product ? key_value.restrict_supplier_add_edit_product : 0;
      $rootScope.track_supplier_agent_loc = key_value.track_supplier_agent_loc ? key_value.track_supplier_agent_loc : 0;
      $rootScope.enable_driver_details = key_value.enable_driver_details ? key_value.enable_driver_details : 0;

      $rootScope.enable_kpi = key_value.enable_kpi ? key_value.enable_kpi : 0;
      $rootScope.replace_hash_with_slash = key_value.replace_hash_with_slash ? key_value.replace_hash_with_slash : 0;
      $rootScope.enable_font_size_buttons = key_value.enable_font_size_buttons ? key_value.enable_font_size_buttons : 0;

      $rootScope.enable_extra_content_fields = key_value.enable_extra_content_fields ? key_value.enable_extra_content_fields : 0;

      if ($rootScope.enable_extra_content_fields == 1) {
        $rootScope.custom_page_type = key_value.custom_page_type ? key_value.custom_page_type : 0;
      }
      $rootScope.social_media_icons_horizontally_aligned = key_value.social_media_icons_horizontally_aligned ? key_value.social_media_icons_horizontally_aligned : 0;
      $rootScope.price_surge_with_geo_fencing = key_value.price_surge_with_geo_fencing ? key_value.price_surge_with_geo_fencing : 0;
      $rootScope.show_cancellation_and_refund_policy = key_value.show_cancellation_and_refund_policy ? key_value.show_cancellation_and_refund_policy : 0;
      $rootScope.show_cookie_policy = key_value.show_cookie_policy ? key_value.show_cookie_policy : 0;
      $rootScope.enable_adding_multiplefields_in_web = key_value.enable_adding_multiplefields_in_web ? key_value.enable_adding_multiplefields_in_web : 0;
      $rootScope.choose_slot_to_unavailable = key_value.choose_slot_to_unavailable ? key_value.choose_slot_to_unavailable : 0;
      $rootScope.show_gender_category_dropdown = key_value.show_gender_category_dropdown ? key_value.show_gender_category_dropdown : 0;

      $rootScope.show_no_of_agents = key_value.show_no_of_agents ? key_value.show_no_of_agents : 0;
      $rootScope.hide_minimum_booking_amount = key_value.hide_minimum_booking_amount ? key_value.hide_minimum_booking_amount : 0;
      $rootScope.hide_commission_field_for_Supplier = key_value.hide_commission_field_for_Supplier ? key_value.hide_commission_field_for_Supplier : 0;
      $rootScope.is_auto_confirmation = key_value.is_auto_confirmation ? key_value.is_auto_confirmation : 0;
      $rootScope.enable_edit_order_after_confirm = key_value.enable_edit_order_after_confirm ? key_value.enable_edit_order_after_confirm : 0;
      $rootScope.enable_food_extra_placeholders = key_value.enable_food_extra_placeholders ? key_value.enable_food_extra_placeholders : 0;
      $rootScope.is_wallet_withdraw = key_value.is_wallet_withdraw ? key_value.is_wallet_withdraw : 0;
      $rootScope.variant_object_to_array = key_value.variant_object_to_array ? parseInt(key_value.variant_object_to_array) : 0;
      $rootScope.enable_service_type = key_value.enable_service_type ? key_value.enable_service_type : 0;
      $rootScope.enable_services_order_edit = key_value.enable_services_order_edit ? key_value.enable_services_order_edit : 0;

      $rootScope.minimum_order_fee = key_value.minimum_order_fee ? key_value.minimum_order_fee : 0;
      $rootScope.enable_product_suggestions_cart = key_value.enable_product_suggestions_cart ? key_value.enable_product_suggestions_cart : 0;
      $rootScope.enable_rejection_reasons = key_value.enable_rejection_reasons ? key_value.enable_rejection_reasons : 0;
      if ($rootScope.enable_rejection_reasons) {
        $rootScope.rejection_reasons = key_value.enable_rejection_reasons || '';
      }

      $rootScope.supplier_to_user_video_call = key_value.supplier_to_user_video_call ? key_value.supplier_to_user_video_call : 0;
      $rootScope.enable_google_heatmap = key_value.enable_google_heatmap ? key_value.enable_google_heatmap : 0;

      $rootScope.enable_supplier_doc_download = key_value.enable_supplier_doc_download ? parseInt(key_value.enable_supplier_doc_download) : 0;
      $rootScope.hide_fields_from_vendors = key_value.hide_fields_from_vendors ? parseInt(key_value.hide_fields_from_vendors) : 0;
      $rootScope.hide_agent_info_from_vendor = key_value.hide_agent_info_from_vendor ? parseInt(key_value.hide_agent_info_from_vendor) : 0;
      $rootScope.hide_all_restaurant_option_for_agent = key_value.hide_all_restaurant_option_for_agent ? parseInt(key_value.hide_all_restaurant_option_for_agent) : 0;
      $rootScope.disable_category_csv_upload = key_value.disable_category_csv_upload ? key_value.disable_category_csv_upload : 0;
      $rootScope.enable_refund_request_category = key_value.enable_refund_request_category ? key_value.enable_refund_request_category : 0;
      $rootScope.disable_phoneNo_validation = key_value.disable_phoneNo_validation ? key_value.disable_phoneNo_validation : 0;
      $rootScope.enable_agent_address = key_value.enable_agent_address ? key_value.enable_agent_address : 0;
      $rootScope.enable_liqour_category = key_value.enable_liqour_category ? key_value.enable_liqour_category : 0;
      $rootScope.enable_userid_upload_order_liqour = key_value.enable_userid_upload_order_liqour ? key_value.enable_userid_upload_order_liqour : 0;


      $rootScope.show_supplier_name_in_account_statement = key_value.show_supplier_name_in_account_statement ? parseInt(key_value.show_supplier_name_in_account_statement) : 0;
      $rootScope.enable_search_filter_in_supplier_payout = key_value.enable_search_filter_in_supplier_payout ? parseInt(key_value.enable_search_filter_in_supplier_payout) : 0;
      $rootScope.enable_search_filter_in_driver_payout = key_value.enable_search_filter_in_driver_payout ? parseInt(key_value.enable_search_filter_in_driver_payout) : 0;
      $rootScope.enable_search_filter_in_supplier_ratings = key_value.enable_search_filter_in_supplier_ratings ? parseInt(key_value.enable_search_filter_in_supplier_ratings) : 0;
      $rootScope.diplay_agentID_instead_of_employeeID = key_value.diplay_agentID_instead_of_employeeID ? parseInt(key_value.diplay_agentID_instead_of_employeeID) : 0;
      $rootScope.change_name_to_hygiene_rating = key_value.change_name_to_hygiene_rating ? parseInt(key_value.change_name_to_hygiene_rating) : 0;
      $rootScope.disable_date_filter_in_agent_report = key_value.disable_date_filter_in_agent_report ? parseInt(key_value.disable_date_filter_in_agent_report) : 0;
      $rootScope.enable_add_edit_subscriptin_supplier = key_value.enable_add_edit_subscriptin_supplier ? parseInt(key_value.enable_add_edit_subscriptin_supplier) : 0;
      $rootScope.enable_user_subscriptin_supplier = key_value.enable_user_subscriptin_supplier ? parseInt(key_value.enable_user_subscriptin_supplier) : 0;
      $rootScope.enable_user_delete = key_value.enable_user_delete ? parseInt(key_value.enable_user_delete) : 0;
      $rootScope.enable_supplier_delete = key_value.enable_supplier_delete ? parseInt(key_value.enable_supplier_delete) : 0;
      $rootScope.show_loyalty_amount_in_accounting = key_value.show_loyalty_amount_in_accounting ? parseInt(key_value.show_loyalty_amount_in_accounting) : 0;
      $rootScope.disable_supplier_promo_edit_and_delete = key_value.disable_supplier_promo_edit_and_delete ? parseInt(key_value.disable_supplier_promo_edit_and_delete) : 0;
      $rootScope.disable_delete_product_for_suppliers = key_value.disable_delete_product_for_suppliers ? parseInt(key_value.disable_delete_product_for_suppliers) : 0;
      $rootScope.add_plus_sign_country_code = key_value.add_plus_sign_country_code ? parseInt(key_value.add_plus_sign_country_code) : 0;
      $rootScope.enable_dashboard_block_theme = key_value.enable_dashboard_block_theme ? parseInt(key_value.enable_dashboard_block_theme) : 0;
      $rootScope.enable_subCat_image_upload_optional = key_value.enable_subCat_image_upload_optional ? parseInt(key_value.enable_subCat_image_upload_optional) : 0;
      $rootScope.disable_cancel_order_after_admin_provided_time = key_value.disable_cancel_order_after_admin_provided_time ? parseInt(key_value.disable_cancel_order_after_admin_provided_time) : 0;
      $rootScope.is_gif_image = key_value.is_gif_image ? parseInt(key_value.is_gif_image) : 0;
      $rootScope.enable_loyalty_status_change = key_value.enable_loyalty_status_change ? parseInt(key_value.enable_loyalty_status_change) : 0;
      $rootScope.enable_cancel_reservation_after_confirm = key_value.enable_cancel_reservation_after_confirm ? parseInt(key_value.enable_cancel_reservation_after_confirm) : 0;
      $rootScope.disable_pickup_status_set_by_admin = key_value.disable_pickup_status_set_by_admin ? parseInt(key_value.disable_pickup_status_set_by_admin) : 0; 
      $rootScope.enable_distancewise_agent_commission = key_value.enable_distancewise_agent_commission ? parseInt(key_value.enable_distancewise_agent_commission) : 0; 
      $rootScope.extra_content_section_limit = key_value.extra_content_section_limit ? key_value.extra_content_section_limit : 5;
      $rootScope.show_user_graph_dash_to_admin_only = key_value.show_user_graph_dash_to_admin_only ? parseInt(key_value.show_user_graph_dash_to_admin_only) : 0; 
      $rootScope.disable_supplier_registration_sub_category = key_value.disable_supplier_registration_sub_category ? parseInt(key_value.disable_supplier_registration_sub_category) : 0; 

      $rootScope.disable_supplier_email_edit_info = key_value.disable_supplier_email_edit_info ? key_value.disable_supplier_email_edit_info : 0;
      $rootScope.disable_supplier_address_edit_info = key_value.disable_supplier_address_edit_info ? key_value.disable_supplier_address_edit_info : 0;
      $rootScope.enable_banner_redirection = key_value.enable_banner_redirection ? key_value.enable_banner_redirection : 0;
      $rootScope.show_order_details_in_order_report = key_value.show_order_details_in_order_report ? key_value.show_order_details_in_order_report : 0;
      $rootScope.enable_otp_at_supplier_registration = key_value.enable_otp_at_supplier_registration ? key_value.enable_otp_at_supplier_registration : 0;
      $rootScope.agent_language_id_params = key_value.agent_language_id_params ? key_value.agent_language_id_params : 0;
      $rootScope.enable_dayId_in_supplier_slots_sakado = key_value.enable_dayId_in_supplier_slots_sakado ? key_value.enable_dayId_in_supplier_slots_sakado : 0;
      $rootScope.enable_service_gift_card_by_user = key_value.enable_service_gift_card_by_user ? key_value.enable_service_gift_card_by_user : 0;
      $rootScope.user_image = key_value.logo_url ? key_value.logo_url : null;
      
      

      $rootScope.currentLanguage = localStorage.getItem('lang');

      if (factories.getSettings().key_value.logo_url) {
        $rootScope.app_image = factories.getSettings().key_value.logo_url;
        setTimeout(() => {
          let logo_width = document.getElementById('app_logo') ? $("#app_logo").width() : 0;
          $rootScope.logo_height = logo_width ? (logo_width * 3) / 4 : 0;
        }, 100);
      } else {
        $rootScope.app_image = '';
        $rootScope.logo_data['background'] = factories.getSettings().key_value.header_color;
        $rootScope.logo_data['font_family'] = factories.getSettings().key_value.font_family;
        $rootScope.logo_data['theme_color'] = factories.getSettings().key_value.theme_color;
      }

      if (localStorage.getItem('sub_plan_name')) {
        $rootScope.sub_plan_name = localStorage.getItem('sub_plan_name');
      }

      if (localStorage.getItem('is_own_delivery')) {
        $rootScope.is_own_delivery = !!localStorage.getItem('is_own_delivery');
      }

      if (localStorage.getItem('user_name')) {
        $rootScope.user_name = localStorage.getItem('user_name');
      }

      if (localStorage.getItem('user_image')) {
        $rootScope.user_image = localStorage.getItem('user_image');
      } else {
        $rootScope.user_image = $rootScope.profile_image
      }

      if ($rootScope.profile == 'ADMIN' && $rootScope.client_code == 'sangtini_0746' && localStorage.getItem('fav_icon')) {
        $rootScope.user_image = localStorage.getItem('fav_icon');
      }

      // if (localStorage.getItem('first_login') == 1 && $rootScope.is_db_clone == 0) {
      //   setTimeout(() => {
      //     $("#db_clone_popup").modal('show');
      //   }, 1500);
      //   setTimeout(() => {
      //     localStorage.setItem('first_login', 0);
      //   }, 60000);
      // }
      constants.IMAGE_TYPE = (!$rootScope.is_gif_image ? ['image/jpg', 'image/jpeg', 'image/png', 'application/pdf'] : ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'application/pdf'])

    } else {
      $state.go('NotFound');
    }

    if (localStorage.getItem('total_days')) {
      let days_left = 20 - parseInt(localStorage.getItem('total_days'));
      $rootScope.total_days = days_left > 0 ? `${days_left} ${days_left == 1 ? 'day' : 'days'} left` : 'Expired';
    }

    var afterLogout = function () {
      constants.ACCESSTOKEN = "";
      localStorage.removeItem('RoyoAccessToken');
      localStorage.removeItem('section_data');
      localStorage.removeItem('adminId');
      localStorage.removeItem('is_superAdmin');
      localStorage.removeItem('profile_type');
      localStorage.removeItem('supplier_id');
      localStorage.removeItem('is_branch');
      localStorage.removeItem('branch_type');
      localStorage.removeItem('user_image');
      localStorage.removeItem('supplierSubscription');
      $state.go('login');
    }

    $rootScope.Logout = function () {
      // if (!!localStorage.getItem('business_name')) {
      //   localStorage.removeItem('business_name');
      // }
      services.CONFIRM('You want to logout from this panel.',
        function (isConfirm) {
          if (isConfirm) {
            let type = localStorage.getItem('profile_type');
            if (type === 'ADMIN') {
              services.PUT_DATA({}, API.ADMIN_LOGOUT, function (response) {
                afterLogout();
              });
            } else if (type === 'SUPPLIER') {
              let param_data = {
                languageId: 14,
                accessToken: localStorage.getItem('RoyoAccessToken')
              }
              services.POST_DATA(param_data, API.SUPPLIER_LOGOUT, function (response) {
                afterLogout();
              });
            } else if (type === 'BRANCH') {
              let param_data = {
                languageId: 14,
                accessToken: localStorage.getItem('RoyoAccessToken')
              }
              services.POST_DATA(param_data, API.BRANCH_LOGOUT, function (response) {
                afterLogout();
              });
            } else if (type === 'SHIPPING') {
              let param_data = {
                languageId: 14,
                accessToken: localStorage.getItem('RoyoAccessToken')
              }
              services.POST_DATA(param_data, API.SHIPPING_LOGOUT, function (response) {
                afterLogout();
              });
            }
          }
        });
    }

    $rootScope.permissions = function (section, type) {
      return factories.permissions(section, type);
    }

    $scope.openAgentId = function () {
      $rootScope.agent_unique_id = localStorage.getItem('unique_id');
      $("#agentUniqueId").modal('show');
    }

    $scope.openWebsite = function () {
      if (constants.ACCESSTOKEN) {
        let site_domain = localStorage.getItem('site_domain');
        window.open(site_domain, "_blank");
      }
    }

    $scope.appLink = function (type) {
      if (constants.ACCESSTOKEN) {
        let link = '';
        switch (type) {
          case 'ios':
            link = factories.getSettings().key_value.ios_app_url;
            break;
          case 'android':
            link = factories.getSettings().key_value.android_app_url;
            break;
        }
        window.open(link, "_blank");
      }
    }

    $scope.openRoyoRides = function () {
      if (constants.ACCESSTOKEN) {
        window.open(factories.getSettings().key_value.ride_admin_url, "_blank");
      }
    }

    $rootScope.new_admin_pass = '';
    $rootScope.confirm_new_admin_pass = '';
    $rootScope.passwordReset = function (passwordResetForm, new_admin_pass) {
      if (passwordResetForm.$submitted && passwordResetForm.$invalid) return;
      services.POST_DATA({
        password: new_admin_pass
      }, API.RESET_PASSWORD(), function (response) {
        $("#reset_password_modal").modal('hide');
        setTimeout(() => {
          $("#passSuccess").modal('show');
        }, 600);
      });
    }

    $rootScope.updateUserProfileImg = function () {
      if (!$rootScope.userImage) return;
      let data = {}
      data.accessToken = constants.ACCESSTOKEN;
      data.sectionId = 30
      data.supplierBranchId = JSON.parse(localStorage.getItem('branch_type')).default_branch_id
      data.logo = $scope.branchLogo

      services.POST_FORM_DATA(data, API.UPDATE_BRANCH_PROFILE_IMAGE, function (response) {
        if (response && response.data) {
          $rootScope.user_image = ''
          $rootScope.user_image = response.data.logo
          localStorage.setItem('user_image', response.data.logo)
          $("#edit_user_image").modal('hide');
          factories.successActionPop('Image changed Successfully');
        }
      });
    }

    $rootScope.userImage = ''
    $rootScope.updateUserImage = function (img) {
      $rootScope.userImage = img
    }

    $rootScope.file_to_upload_for_user_image = function (File) {
      var file = File[0];
      if (constants.IMAGE_TYPE.includes(file.type)) {
        if ((file.size / Math.pow(1024, 2)) <= 1) {
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function (event) {
            $scope.$apply(function () {
              $rootScope.userImage = event.target.result;
              $scope.branchLogo = file;

            });
          }
        } else {
          factories.invalidDataPop("Image size must be less than 1mb");
        }
      } else {
        factories.invalidDataPop("Invalid File Type");
      }
    };

    $rootScope.data_country = '';
    $rootScope.changeCountry = function (data_country, flag) {
      $rootScope.data_country = data_country;
      localStorage.setItem('data_country', ($rootScope.data_country.replace('+', '')));
      if (flag) {
        window.location.reload();
      }
    }

    var getCountryData = function () {
      const payload = {
        accessToken: constants.ACCESSTOKEN,
        authSectionId: 42
      }
      services.POST_DATA(payload, '/get_all_countries', function (response) {
        response.data.map(o => {
          o.type = 1
        })
        $rootScope.countryData = [...response.data];

        if ($rootScope.is_data_filter_by_country == 1) {
          $rootScope.countryData.push({
            country_code: response.data[0].country_code,
            country_id: response.data[0].country_id,
            country_name: 'Outside ' + response.data[0].country_name,
            type: 0
          })
        }

        if (response.data.length) {
          let country_code = '';
          country_code = !localStorage.getItem('data_country') ?
            (response.data[0].country_code + ',' + response.data[0].type) :
            ('+' + localStorage.getItem('data_country'));

          $rootScope.changeCountry(country_code, 0);
        }
      });
    };

    if (!!$rootScope.is_data_filter_by_country) {
      getCountryData();
    }

    // $scope.is_notification_blocked = false;
    // var permission = Notification.permission;
    // if (permission == 'denied') {
    //   $scope.is_notification_blocked = true;
    // }

  }
]);