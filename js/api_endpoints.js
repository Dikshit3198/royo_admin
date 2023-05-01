Royo.service('API', ['$rootScope', function ($rootScope) {

    var API_BY_PROFILE = function (admin, supplier, shipping) {
        // return localStorage.getItem('profile_type') === 'SUPPLIER' || localStorage.getItem('profile_type') === 'BRANCH' ? supplier : admin;

        let profile_type = localStorage.getItem('profile_type');
        let api = '';
        switch (profile_type) {
            case 'ADMIN':
                api = admin;
                break;
            case 'SUPPLIER':
                api = supplier;
                break;
            case 'BRANCH':
                api = supplier;
                break;
            case 'SHIPPING':
                api = shipping;
                break;
            default:
                api = admin;
                break;
        }
        return api;
    }

    /**************** API ENDPOINTS ****************/

    this.LOGIN = ($scope) => {
        // return $scope.profile_type === 'ADMIN' ? '/admin_login' : ($scope.is_branch ? '/branch_login' : '/supplier_login');
        return $scope.profile_type === 'ADMIN' ? '/v1/admin/login' : ($scope.profile_type === 'SHIPPING' ? '/delivery_company/login' : ($scope.is_branch ? '/branch_login' : '/supplier_login'));
    };

    this.FORGOT_PASSWORD = ($scope) => {
        return $scope.profile_type === 'ADMIN' ? '/forgot_password' : ($scope.profile_type === 'BRANCH' ? '/supplier_branch_forget_password' : '/supplier_forget_password');
    };

    this.REGISTER_DELIVERY_COMPANY = '/register_delivery_company';

    this.CREATE_DELIVERY_COMPANY = '/admin/register_delivery_company';

    this.LIST_DELIVERY_COMPANY = '/admin/list_delivery_companies';

    this.BLOCK_DELIVERY_COMPANY = '/admin/block_unblock_delivery_company';

    this.VERIFY_DELIVERY_COMPANY = '/admin/verify_delivery_company';

    this.ASSIGN_DELIVERY_COMPANY_TO_SUPPLIER = '/admin/assign_delivery_company_to_supplier';

    this.ADMIN_LOGOUT = '/admin/logout';

    this.SUPPLIER_LOGOUT = '/supplier_logout';

    this.BRANCH_LOGOUT = '/supplier_branch_logout';

    this.SHIPPING_LOGOUT = '/delivery_company/logout';



    this.DASHBOARD = () => { return API_BY_PROFILE('/v2/admin/dashboard', '/v2/supplier/dashboard', '/delivery_company/dashboard'); };

    this.GET_HOME_DATA = () => { return API_BY_PROFILE('/get_admin_home_data', '/get_supplier_home_data'); };

    this.ADD_CATEGORY = () => { return API_BY_PROFILE('/add_category', '/add_category_by_supplier'); };

    this.EDIT_CATEGORY = () => { return API_BY_PROFILE('/edit_category', '/edit_category_by_supplier'); };

    this.AGENT_ACC_TO_AREA = () => { return API_BY_PROFILE('/admin/agent_according_area', '/supplier/agent_according_area', '/delivery_company/agent_list'); };

    this.ASSIGN_AGENT = () => { return API_BY_PROFILE('/admin/booking/assignment', '/supplier/booking/assignment', '/delivery_company/booking/assignment'); };

    this.GET_SUBCATEGORIES = () => { return API_BY_PROFILE('/list_subcategories', '/list_subcategories_by_supplier'); };

    this.GET_DET_SUBCATEGORIES = () => { return API_BY_PROFILE('/list_detailed_sub_categories', '/list_detailed_sub_category_by_supplier'); };

    this.ADD_SUBCATEGORY = () => { return API_BY_PROFILE('/add_sub_category', '/add_sub_category_by_supplier'); };

    this.EDIT_SUBCATEGORY = () => { return API_BY_PROFILE('/edit_sub_category', '/edit_sub_category_by_supplier'); };

    this.GET_AGENT_REPORT = () => { return API_BY_PROFILE('/agent_report', '/supplier_agent_report'); };

    this.GET_BRANDS = () => { return API_BY_PROFILE('/admin/brand_list', '/supplier/brand_list'); };

    this.GET_CAT_BRANDS = () => { return API_BY_PROFILE('/admin/brand_list_cat', '/supplier/brand_list_cat'); };

    this.ADD_VARIANT = () => { return API_BY_PROFILE('/admin/add_variant', '/supplier/add_variant'); };

    this.EDIT_VARIANT = () => { return API_BY_PROFILE('/admin/update_variant_value', '/supplier/update_variant_value'); };

    this.CATEGORY_LIST = () => { return API_BY_PROFILE('/category_list?access_type=admin', '/category_list?access_type=supplier'); };

    this.ADD_AGENT = () => { return API_BY_PROFILE('/admin/agent_create', '/supplier/agent_create', '/delivery_company/agent_create'); };

    this.EDIT_AGENT = () => { return API_BY_PROFILE('/admin/agent_update', '/supplier/agent_update', '/delivery_company/agent_update'); };

    this.GET_AGENT_LIST = () => { return API_BY_PROFILE('/admin/agent_list', '/supplier/agent_list', '/delivery_company/agent_list'); };

    this.AGGENT_SERVICE_UNASSIGNMENT = () => { return API_BY_PROFILE('/admin/service/unassignment', '/supplier/service/unassignment'); };

    this.GET_SERVICE_ASSIGNED_LIST = () => { return API_BY_PROFILE('/admin/service/assignedList', '/supplier/service/assignedList'); };

    this.AGENT_SERVICE_ASSIGNMENT = () => { return API_BY_PROFILE('/admin/service/assignment', '/supplier/service/assignment'); };

    this.GET_AGENT_TOKEN = () => { return API_BY_PROFILE('/admin/agent_token', '/supplier/agent_token'); };

    this.GET_AGENT_AVAILABILITY = () => { return API_BY_PROFILE('/admin/get_agent_availability', '/supplier/get_agent_availability'); };

    this.SET_AGENT_AVAILABILITY = () => { return API_BY_PROFILE('/admin/agent_set_availability', '/supplier/agent_set_availability'); };

    this.UPDATE_AGENT_AVAILABILITY = () => { return API_BY_PROFILE('/admin/agent_update_availability', '/supplier/agent_update_availability'); };

    this.DELETE_AGENT_TIME_SLOT = () => { return API_BY_PROFILE('/admin/delete_agent_time_slots', '/supplier/delete_agent_time_slots'); };

    this.GET_PRODUCT_DETAIL = () => { return API_BY_PROFILE('/admin/product_detail', '/supplier/product_detail'); };

    this.CREATE_ADD_ON = () => { return API_BY_PROFILE('/admin/product_adds_on/create', '/supplier/product_adds_on/create'); };

    this.EDIT_ADD_ON = () => { return API_BY_PROFILE('/admin/product_adds_on/update', '/supplier/product_adds_on/update'); };

    this.GET_ADD_ONS = () => { return API_BY_PROFILE('/admin/product_adds_on/get', '/supplier/product_adds_on/get'); };

    this.GET_SUBCATEGORY_DATA = () => { return API_BY_PROFILE('/sub_category_data', '/supplier/sub_category_data'); };

    this.DELETE_PRODUCT = () => { return API_BY_PROFILE('/delete_product', '/delete_product_by_supplier'); };

    this.LIST_SUPPLIER_CATEGORIES = () => { return API_BY_PROFILE('/list_supplier_categories', '/list_supplier_category'); };

    this.BLOCK_UNBLOCK_AGENT = () => { return API_BY_PROFILE('/admin/block_unlblock_agent', '/supplier/block_unlblock_agent', '/delivery_company/block_unlblock_agent'); };

    this.DELETE_AGENT = () => { return API_BY_PROFILE('/admin/delete_agent', '/supplier/delete_agent', '/delivery_company/delete_agent'); };

    this.RESET_AGENT_PASSWORD = () => { return API_BY_PROFILE('/admin/reset_agent_password', '/supplier/reset_agent_password', '/delivery_company/reset_agent_password'); };

    this.LIST_CURRENCIES = () => { return API_BY_PROFILE('/list_currencies', '/list_currencies_in_supplier'); };

    this.GET_USER_REPORT = () => { return API_BY_PROFILE('/user_report', '/supplier_user_report'); };

    this.GET_ORDER_REPORT = () => { return API_BY_PROFILE('/order_report', '/supplier_order_report'); };

    this.GET_ORDER_LIST = () => { return API_BY_PROFILE('/v2/admin_order_list', '/v2/supplier_order_list', '/delivery_company_order_list'); };

    this.GET_ORDER_DESCRIPTION = () => { return API_BY_PROFILE('/v2/order_description', '/v2/supplier_order_description', '/delivery_company_order_description'); };


    this.GET_CUSTOM_ORDER_LIST = '/admin/custom_order/list';
    this.GET_CUSTOM_ORDER_DETAILS = '/admin/custom_order_detail';


    this.CONFIRM_REJECT_CUSTOM_ORDER = '/admin/custom_order/change_status';

    this.ASSIGN_AGENT_CUSTOM_ORDER = '/admin/custom_order/assignment';

    // this.GET_CUSTOM_ORDER_DESCRIPTION = () => { return API_BY_PROFILE('/v2/order_description', '/v2/supplier_order_description', '/delivery_company_order_description'); };




    this.UPDATE_SUPPLIER_INFO = () => { return API_BY_PROFILE('/v1/get_supplier_sub_info_tab1', '/save_supplier_profile_extranet_tab1'); };

    this.GET_PRODUCT_VARIANT_LIST = () => { return API_BY_PROFILE('/admin/product_variant_list', '/supplier/product_variant_list'); };

    this.ACCOUNT_PAYABLE_LIST = () => { return API_BY_PROFILE('/v1/account_payable_list', '/supplier_account_payable_list'); };

    this.ACCOUNT_RECEIVABLE_LIST = () => { return API_BY_PROFILE('/account_receivable_list', '/supplier_account_receivable_list'); };

    this.ACCOUNT_STATEMENT_LIST = () => { return API_BY_PROFILE('/admin_account_statement', '/supplier_account_statement'); };

    this.PAY_AMOUNT = () => { return API_BY_PROFILE('/account_payament', '/supplier_account_payament'); };

    this.DELETE_SUB_CAT = () => { return API_BY_PROFILE('/delete_category', '/delete_category_by_supplier'); };

    this.DELETE_ADD_ONS = () => { return API_BY_PROFILE('/admin/product_adds_on/delete', '/supplier/product_adds_on/delete'); };

    this.ADD_ON_TYPE_DELETE = () => { return API_BY_PROFILE('/admin/product_adds_on_type/delete', '/supplier/product_adds_on_type/delete'); };

    this.REMOVE_PRICE = () => { return API_BY_PROFILE('/delete_pricing', '/delete_pricing_by_supplier'); };

    this.ADMIN_CATEGORY_LIST = () => { return API_BY_PROFILE('/admin/get_categories_list', '/supplier/get_categories_list'); };

    this.UPDATE_SUPPLIER_CONFIG = () => { return API_BY_PROFILE('/update_supplier_summary', '/updated_supplier_summary'); };

    this.GET_SUPPLIER_CONFIG = () => { return API_BY_PROFILE('/get_supplier_summary', '/fetch_supplier_summary'); };

    this.GET_ALL_QUESTIONS_DETAIL = () => { return API_BY_PROFILE('/getAllQuestionsDetailByCategoryId', '/supplier/getAllQuestionsDetailByCategoryId'); };

    this.ADD_EDIT_QUESTIONS = () => { return API_BY_PROFILE('/addAndEditQuestionsByCategory', '/supplier/addAndEditQuestionsByCategory'); };

    this.DELETE_QUESTION = () => { return API_BY_PROFILE('/deleteQuestionsByQuestionIds', '/supplier/deleteQuestionsByQuestionIds'); };

    this.ADD_BRANDS_TO_CATEGORY = () => { return API_BY_PROFILE('/admin/add_brand_to_cat', '/supplier/add_brand_to_cat'); };

    this.RESET_PASSWORD = () => { return API_BY_PROFILE('/admin/reset_password', '/supplier/reset_password'); };

    this.BLOCK_CATEGORY = () => { return API_BY_PROFILE('/block_category', '/block_category_by_supplier'); };

    this.GET_LANGUAGE_DATA = () => { return API_BY_PROFILE('/get_languages', '/get_languages_in_supplier'); };

    this.DELETE_BRANCH_PRODUCT = () => { return API_BY_PROFILE('/delete_supplier_branch_product', '/delete_supplier_branch_product_by_supplier'); };

    this.MAKE_PRODUCT_UNAVAILABLE = () => { return API_BY_PROFILE('/admin/product/unavailable', '/supplier/product/unavailable') };

    this.DELETE_SUPPLIER_PRODUCT = () => { return API_BY_PROFILE('/delete_supplier_product', '/delete_product_by_supplier'); };

    this.ASSIGN_PRODUCTS_TO_BRANCH = () => { return API_BY_PROFILE('/assign_product_to_supplier_branch', '/assign_product_to_supplier_branch_by_supplier'); };

    this.ASSIGN_PRODUCTS = () => { return API_BY_PROFILE('/assign_product_to_supplier', '/assign_product_of_admin_by_supplier'); };

    this.GET_SUPPLIER_INFO_TAB_DATA = () => { return API_BY_PROFILE('/get_supplier_info_tab1', '/get_supplierExtranet_info_tab1'); };

    this.DELETE_BRAND_FROM_CATEGORY = () => { return API_BY_PROFILE('/admin/delete_brand_from_cat', '/supplier/delete_brand_from_cat'); };

    this.UPLOAD_SUPPLIER_IMAGES = () => { return API_BY_PROFILE('/save_supplier_image_2', '/save_supplier_extranet_image_2'); };

    this.UPLOAD_SUPPLIER_COVER_IMAGES = '/admin/update_supplier_cover_images';

    this.GET_SUPPLIER_BRANCHES = () => { return API_BY_PROFILE('/get_supplier_info_tab2', '/get_supplier_extranet_info_tab2'); };

    this.UPDATE_BRANCH_STATUS = () => { return API_BY_PROFILE('/change_branch_status', '/change_supplier_extranet_branch_status'); };

    this.ADD_BRANCH = () => { return API_BY_PROFILE('/add_branch', '/add_branch_supplier_extranet'); };

    this.DELETE_BRANCH = () => { return API_BY_PROFILE('/delete_branch', '/delete_supplier_extranet_branch'); };

    this.CONFIRM_REJECT_ORDER = () => { return API_BY_PROFILE('/confirm_pending_order_by_admin', '/confirm_pending_order_by_supplier', '/confirm_pending_order_by_delivery_company'); };

    this.SHIPPED_UPDATE_ORDER = () => { return API_BY_PROFILE('/order_shipped_by_admin', '/order_shipped_by_supplier', '/order_shipped_by_delivery_company'); };

    this.NEARBY_UPDATE_ORDER = () => { return API_BY_PROFILE('/order_nearby_by_admin', '/order_nearby_by_supplier', '/order_nearby_delivery_company'); };

    this.DELIVERED_UPDATE_ORDER = () => { return API_BY_PROFILE('/order_delivered_by_admin', '/order_delivered_by_supplier', '/order_delivered_by_delivery_company'); };

    this.IN_PROGRESS_UPDATE_ORDER = () => { return API_BY_PROFILE('/order_progress_by_admin', '/order_progress_by_supplier', '/order_progress_by_delivery_company'); };

    this.LIST_BRANCHES = () => { return API_BY_PROFILE('/list_branches', '/list_supplier_branch'); };

    this.DELETE_VARIANT = () => { return API_BY_PROFILE('/admin/delete_variant', '/supplier/delete_variant'); };

    this.DELETE_VARIANT_VALUE = () => { return API_BY_PROFILE('/admin/delete_variant_value', '/supplier/delete_variant_value'); };

    this.ORDER_REQUEST = () => { return API_BY_PROFILE('/admin/order/request', '/supplier/order/request'); };

    this.ADD_PRODUCT_IN_ORDER = () => { return API_BY_PROFILE('/admin/order/add_items', '/supplier/order/add_items'); };

    this.REMOVE_PRODUCT_IN_ORDER = () => { return API_BY_PROFILE('/admin/order/remove_items', '/supplier/order/remove_items'); };

    this.CREATE_ORDER = () => { return API_BY_PROFILE('/admin/order/create', '/supplier/order/create'); };

    this.LIST_GIFT_CARDS = () => { return API_BY_PROFILE('/admin/gift/list', '/supplier/gift/list'); };

    this.ADD_GIFT_CARDS = () => { return API_BY_PROFILE('/admin/gift/add', '/supplier/gift/add'); };

    this.UPDATE_GIFT_CARDS = () => { return API_BY_PROFILE('/admin/gift/update', '/supplier/gift/update'); };

    this.DELETE_GIFT_CARDS = () => { return API_BY_PROFILE('/admin/gift/delete', '/supplier/gift/delete'); };

    this.SCHEDULE_DELIVERY = () => { return API_BY_PROFILE('/admin/order/update_delivery_date', '/supplier/order/update_delivery_date'); };

    this.LIST_RETURN_REQUESTS = () => { return API_BY_PROFILE('/admin/order/return_request', '/supplier/order/return_request'); };

    this.UPDATE_RETURN_REQUEST_STATUS = () => { return API_BY_PROFILE('/admin/order/return_status', '/supplier/order/return_status'); };

    this.ADD_SUPPLIER_GEOFENCE_AREA = () => { return API_BY_PROFILE('/admin/add_supplier_area', '/supplier/add_supplier_area'); };

    this.UPDATE_SUPPLIER_GEOFENCE_AREA = () => { return API_BY_PROFILE('/admin/update_supplier_area', '/supplier/update_supplier_area'); };

    this.DELETE_SUPPLIER_GEOFENCE_AREA = () => { return API_BY_PROFILE('/admin/delete_supplier_area', '/supplier/delete_supplier_area'); };

    this.LIST_SUPPLIER_GEOFENCE_AREAs = () => { return API_BY_PROFILE('/admin/list_supplier_area', '/supplier/list_supplier_area'); };

    this.AGENT_ASSIGNMENT_FOR_ORDER_RETURN = () => { return API_BY_PROFILE('/admin/returnbooking/assignment', '/supplier/returnbooking/assignment'); };

    this.OREDER_REQUEST_REJECT = () => { return API_BY_PROFILE('/admin/order/request_reject', '/supplier/order/request_reject'); };

    this.ADMIN_SUPPLIER_PRODUCT_IMPORT = () => { return API_BY_PROFILE('/v1/admin/supplier/product/import', '/v1/supplier/product/import'); };

    this.DRIVER_ACCOUNT_PAYABLE_LIST = () => { return API_BY_PROFILE('/v1/driver_account_payable_list', '/supplier_driver_account_payable_list'); };

    this.DRIVER_ACCOUNT_STATEMENT_LIST = () => { return API_BY_PROFILE('/driver_account_statement', '/supplier_driver_account_statement'); };

    this.DRIVER_PAY__ACCOUNT = () => { return API_BY_PROFILE('/driver_account_payament', '/supplier_driver_account_payament'); };

    this.LIST_USER_TYPES = () => { return API_BY_PROFILE('/admin/list_user_types', '/supplier/list_user_types'); };

    this.ASSIGN_ADDONS = () => { return API_BY_PROFILE('/admin/product/adds_on_copy', '/supplier/product/adds_on_copy'); };

    this.EDIT_PROMOS = () => { return API_BY_PROFILE('/admin/updatePromo', '/supplier/updatePromo'); };

    this.EDIT_BANNER = () => { return API_BY_PROFILE('/admin/update_banner_advertisement', '/supplier/update_banner_advertisement'); };

    this.ADD_BANNER = () => { return API_BY_PROFILE('/add_banner_advertisement', '/add_banner_advertisement_by_supplier'); };

    this.DELETE_BANNER = () => { return API_BY_PROFILE('/delete_advertisement_new', '/delete_advertisement_new_by_supplier'); };

    this.GET_BANNER = () => { return API_BY_PROFILE('/list_advertisements', '/list_advertisements_by_supplier'); };

    this.GET_NOTIFICATIONS = () => { return API_BY_PROFILE('/get_all_admin_notification', '/get_all_supplier_notification'); };

    this.GET_SCHEDULING_SLOTS = () => { return API_BY_PROFILE('/admin/get_supplier_availability', '/supplier/get_supplier_availability'); };

    this.SET_SCHEDULING_SLOTS = () => { return API_BY_PROFILE('/admin/supplier_set_availability', '/supplier/supplier_set_availability'); };

    this.UPDATE_SCHEDULING_SLOTS = () => { return API_BY_PROFILE('/admin/supplier_update_availability', '/supplier/supplier_update_availability'); };

    this.DELETE_SCHEDULING_SLOTS = () => { return API_BY_PROFILE('/admin/delete_supplier_slots', '/supplier/delete_supplier_slots'); };

    this.ADD_GEOFENCE_SCHEDULING_SLOTS = () => { return API_BY_PROFILE('/admin/add_supplier_order_geofence', '/supplier/add_supplier_order_geofence'); };

    this.UPDATE_GEOFENCE_SCHEDULING_SLOTS = () => { return API_BY_PROFILE('/admin/update_supplier_order_geofence', '/supplier/update_supplier_order_geofence'); };

    this.LIST_GEOFENCE_SCHEDULING_SLOTS = () => { return API_BY_PROFILE('/admin/list_supplier_order_geofence', '/supplier/list_supplier_order_geofence'); };

    this.DELETE_GEOFENCE_SCHEDULING_SLOTS = () => { return API_BY_PROFILE('/admin/delete_supplier_order_geofence', '/supplier/delete_supplier_order_geofence'); };

    this.ADD_SUPPLIER_TABLE = () => { return API_BY_PROFILE('/admin/add_supplier_table', '/supplier/add_supplier_table'); };

    this.UPDATE_SUPPLIER_TABLE = () => { return API_BY_PROFILE('/admin/update_supplier_table', '/supplier/update_supplier_table'); };

    this.LIST_SUPPLIER_TABLE = () => { return API_BY_PROFILE('/admin/list_supplier_tables', '/supplier/list_supplier_tables'); };

    this.DELETE_SUPPLIER_TABLE = () => { return API_BY_PROFILE('/admin/delete_supplier_table', '/supplier/delete_supplier_table'); };

    this.GENERATE_QR_SUPPLIER_TABLE = () => { return API_BY_PROFILE('/admin/add_table_qr_code', '/supplier/add_table_qr_code'); };

    this.GET_TABLE_BOOKINGS = () => { return API_BY_PROFILE('/admin/user_booking_requests', '/supplier/user_booking_requests'); };

    this.UPDATE_TABLE_BOOKING_REQUEST = () => { return API_BY_PROFILE('/admin/update_table_booking_requests', '/supplier/update_table_booking_requests'); };

    this.ASSIGN_TABLE_TO_USER = () => { return API_BY_PROFILE('/admin/assign_table_to_user', '/supplier/assign_table_to_user'); };

    this.UPDATE_BOOKING_TABLE = () => { return API_BY_PROFILE('/admin/update_table_number', '/supplier/update_table_number'); };

    this.UPDATE_AGENT_STATUS = () => { return API_BY_PROFILE('/admin/available/status', '/supplier/available/status', '/delivery_company/available/status'); };

    this.GET_USER_SUBSCRIPTION_PLANS = () => { return API_BY_PROFILE('/admin/list_user_subscription_plans', '/supplier/list_user_subscription_plans'); };

    this.DHL_SHIPMENT = () => { return API_BY_PROFILE('/admin/dhl/add_shipment', '/supplier/dhl/add_shipment'); };

    this.TRACK_DHL_SHIPMENT = () => { return API_BY_PROFILE('/admin/dhl/shipment/track', '/supplier/dhl/shipment/track'); };

    this.GET_PERMISSIONS = () => { return API_BY_PROFILE('/v1/admin/get_admin_sections_data', '/v1/supplier/get_supplier_sections_data'); };

    this.SAVE_PERMISSIONS = () => { return API_BY_PROFILE('/v1/admin/assign_or_revoke_sections', '/v1/supplier/assign_or_revoke_sections'); };

    this.ADD_ADMIN = () => { return API_BY_PROFILE('/add_admin', '/add_subsupplier_by_supplier'); };

    this.ADMIN_LIST = () => { return API_BY_PROFILE('/admin/sub_admin_list', '/list_supplier_admins'); };

    this.CHANGE_ADMIN_STATUS = () => { return API_BY_PROFILE('/make_admin_active_or_inactive', '/change_supplier_admin_status'); };

    this.PRODUCT_REPORT = () => { return API_BY_PROFILE('/admin_products_report', '/supplier_products_report'); };

    this.ORDER_GRAPHICAL_REPORT = () => { return API_BY_PROFILE('/order_graphical_report', '/supplier_order_graphical_report'); };

    this.ADMIN_PRODUCT_RATING_LIST = () => { return API_BY_PROFILE('/admin/product/rating_list', '/supplier/product/rating_list'); };

    this.PRODUCT_REPORT = () => { return API_BY_PROFILE('/admin_products_report', '/supplier_products_report'); };

    this.ORDER_GRAPHICAL_REPORT = () => { return API_BY_PROFILE('/order_graphical_report', '/supplier_order_graphical_report '); };

    this.GET_CHAT_LIST = () => { return API_BY_PROFILE('/get_admin_chat_list', '/get_supplier_chat_list'); };

    this.BLOCK_PRODUCT_RATING = () => { return API_BY_PROFILE('/admin/block/product_rating', 'supplier/block/product_rating'); };

    this.GET_FEATURES = '/cbl/clientAdmin/getFeature';

    this.SET_FEATURES = '/cbl/clientAdmin/setFeature';

    this.SET_DOMAIN = '/cbl/clientAdmin/addDomain';

    this.UPDATE_PAYMENT_STATUS = '/cbl/clientAdmin/featureStatus';

    this.UPDATE_ADMIN_SETTINGS = '/admin/addSettings';

    this.GET_BASIC_SETTINGS = '/admin/settings_list';

    this.GET_COUNTRIES = '/admin/list_country_codes';

    this.DELETE_COUNTRYCODE = '/admin/delete_country_code'

    this.SET_COUNTRIES = '/admin/add_update_country_code';

    this.GET_DEFAULT_ADDRESS = '/admin/default_address/list';

    this.UPDATE_DEFAULT_ADDRESS = '/admin/default_ddress/update';

    this.ADD_DEFAULT_ADDRESS = '/admin/default_ddress/add';

    this.GET_USERS = '/get_users';

    this.GET_SETTINGS = '/getSettings';

    this.GET_DB_KEY = '/v1/common/secret_key';

    this.ADD_BRANDS = '/admin/add_brand';

    this.EDIT_BRANDS = '/admin/update_brand';

    this.DELETE_BRAND = '/admin/delete_brand';

    this.DELETE_SUB_ADMIN = '/admin/delete_admin';

    this.CHANGE_SUPPLIER_STATUS = '/active_or_inactive_supplier';

    this.GET_ADMIN_DATA = '/get_admin_data_to_view';

    this.UPDATE_ADMIN_ACCESS = '/assign_or_revoke_section';

    this.GET_CATEGORIES = '/list_all_categories';

    this.DELETE_PROMO = '/deletePromo';

    this.DEACTIVATE_PROMO = '/deactivePromo';

    this.START_PROMO = '/startPromo';

    this.ADD_PROMO = '/addPromo';

    this.LIST_PROMO_USER = '/listPromoUser';

    this.GET_PROMOS = '/listPromo';

    this.SUPPLIER_FORGOT_PASSWORD = '/supplier_forget_password';

    this.GET_PACKAGE_LIST = '/get_package_listing';

    this.UPDATE_USER_LOYALTY = '/update_user_loyalty';

    this.UPDATE_USER_STATUS = '/active_deactive_user';

    this.SUPPLIER_PRODUCT_LIST = '/supplier_product_list';

    this.SUPPLIER_REPORT = '/supplier_report';

    this.LIST_SUPPLIERS = '/list_suppliers';

    this.CONFIRM_PAYMENT_STATUS = '/admin/update_order_payment_status'

    this.LIST_SUPPLIER_SUB_CATEGORIES = '/listSupplierSubCat';

    this.LIST_ALL_SUB_CATEGORIES = "/list_all_subcategories";

    this.DELETE_SUPPLIER_CATEGORY = "/delete_supplier_category";

    this.ADD_SUPPLIER_CATEGORY = "/v1/add_category_of_supplier";

    this.REGISTER_SUPPLIER = "/v2/reg_supplier_directly";
    this.REGISTER_MAROOF_SUPPLIER = "/v3/reg_supplier_directly";

    this.LIST_SUB_DET_CATEGORIES = "/list_sub_and_detailed_categories";

    this.SEND_PUSH = "/send_push_to_customer";

    this.LIST_SUPPLIERS_FOR_SETTINGS = "/list_suppliers_for_settings";

    this.LIST_USERS_FOR_SETTINGS = "/list_users_for_settings";

    this.SEND_EMAIL = "/send_system_email";

    this.ADD_ADMIN_PRODUCT = [5, 6, 7].includes($rootScope.app_type) ? "/v1/add_product" : "/add_product";

    this.SUPPLIER_LIST = "/admin/supplier_listing";

    this.UPDATE_TERMINOLOGIES = "/admin/update_terminologies";

    this.ADD_TERMS_AND_PRIVACY = "/admin/add_termsConditions";

    this.LIST_TERMS_AND_PRIVACY = "/list_termsConditions";

    this.UPDATE_PLACEHOLDERS = "/admin/update_placeHolders";

    this.UPDATE_PLACEHOLDERS_V1 = "/v1/admin/update_placeHolders";

    this.AGENT_TIPS = "/admin/list_agent_tips";

    this.ADD_AGENT_TIPS = "/admin/add_agent_tips";

    this.GET_CANCELLATION_POLICY_DATA = '/admin/cancellation_policy_details';

    this.UPDATE_CANCELLATION_POLICY_DATA = '/admin/update_cancellation_policy';

    this.UPLOAD_RATING_DOCS = '/admin/upload_hygiene_image';

    this.LIST_SUPPLIER_RATING_DOCS = '/admin/get_hygiene_image';

    this.DELETE_SUPPLIER_RATING_DOCS = '/admin/delete_hygiene_image';

    this.ADD_SUPPLIER_RATING_DETAILS = '/admin/update_hygiene';

    this.GET_SUPPLIER_RATING_DETAILS = '/admin/get_hygiene_info';

    this.LIST_SUPPLIER_NAMES = '/list_supplier_names';

    this.ADD_DESCRIPTION_SECTIONS = '/admin/add_description_sections';

    this.PICKUP_DELIVERY_APP_BANNERS = '/admin/pickup_delivery_banner_update';

    this.UPDATE_USER_TYPES = '/admin/update_user_types';

    this.DELETE_USER_TYPE = '/admin/delete_user_types';

    this.ADD_USER_TYPE = '/admin/add_user_types';

    this.DEACTIVATE_USER_TYPE = '/admin/deactivate_user_types';

    this.ACTIVATE_USER_TYPE = '/admin/activate_user_types';

    this.UPDATE_USER_DETAILS = '/admin/edit_user_details';

    this.REST_USER_PASSWORD = '/admin/reset_user_password';

    this.ADMIN_PRODUCT_IMPORT = '/v1/admin/product/import';

    this.PRODUCT_IMPORT = '/admin/product/import';

    this.ADD_PAYMENT_GATEWAY_LOCATION = '/admin/add_payment_gateway_location';

    this.LIST_PAYMENT_GATEWAY_LOCATION = '/admin/list_payment_gateway_location';

    this.DELETE_PAYMENT_GATEWAY_LOCATION = '/admin/delete_payment_gateway_location';

    this.UPDATE_PAYMENT_GATEWAY_LOCATION = '/admin/update_payment_gateway_location';

    this.LIST_SUBCATEGORIES = '/common/get_sub_categories';

    this.GET_GEOFENCE_TAX = '/common/geofencing_tax';

    this.ADMIN_SUPPLIER_RATING_LIST = '/admin/supplier/rating_list';

    this.ADMIN_BLOCK_SUPPLIER_RATING = '/admin/block/supplier_rating';

    this.SUPPLIER_REGISTER = '/common/supplier_register'

    this.ADMIN_DELETE_SUBSCRIPTION_PLAN = '/admin/delete_subscription_plan';

    this.ADMIN_UPDATE_SUBSCRIPTION_PLAN = '/admin/update_subscription_plan';

    this.ADMIN_CREATE_SUBSCRIPTION_PLAN = '/admin/create_subscription_plan';

    this.ADMIN_LIST_SUBSCRIPTION_PLANS = '/admin/list_subscription_plans';

    this.ADMIN_ALL_PERMISSIONS = '/admin/get_all_permissions';

    this.SUPPLIER_SUBSCRIPTION_PLANS = '/supplier/list_subscription_plans';

    this.SUPPLIER_STRIP_SESSIONID = '/supplier/stripSessionId';

    this.SUPPLIER_SUBSCRIPTION_CANCEL = '/supplier/subscription/cancel';

    this.MUMYBENE_PAYMENT_STATUS = '/mumybene_payment_status';

    this.MUMYBENE_REVERSE_PAYMENT = '/mumybene_reverse_payment';

    this.MUMYBENE_ACCOUNT_BALANCE = '/mumybene_account_balance';

    this.ADMIN_SUPPLIER_SUBSCRIPTIONS = '/admin/supplier_subscriptions';

    this.UPDATE_DEFAULT_BANNER = '/admin/update_default_banner';

    this.UPLOAD_IMAGE = '/user/order/addReceipt';

    this.CLONE_DB = '/cbl/clientAdmin/cloneDb';

    this.ADMIN_USER_WALLET_TRANSACTIONS = '/admin/user_wallet/transactions';

    this.ADMIN_ADD_MONEY_TO_WALLET = '/admin/wallet/add_money_to_user';

    this.ADMIN_ADD_MONEY_TO_AGENT_WALLET = '/admin/wallet/add_money_to_agent';

    this.ADMIN_AGENT_WALLET_TXN_LIST = '/agent/wallet/transactions';

    this.CREATE_USER_SUBSCRIPTION_PLAN = () => { return API_BY_PROFILE('/admin/create_user_subscription_plan', '/supplier/create_user_subscription_plan'); };
    this.UPDATE_USER_SUBSCRIPTION_PLAN = () => { return API_BY_PROFILE('/admin/update_user_subscription_plan', '/supplier/update_user_subscription_plan'); };
    this.ADMIN_ASSIGN_BENEFITS_TO_PLAN = () => { return API_BY_PROFILE('/admin/assign_benefits_to_plan', '/supplier/assign_benefits_to_plan'); };

    // this.CREATE_USER_SUBSCRIPTION_PLAN = '/admin/create_user_subscription_plan';
    // this.UPDATE_USER_SUBSCRIPTION_PLAN = '/admin/update_user_subscription_plan';
    // this.ADMIN_ASSIGN_BENEFITS_TO_PLAN = '/admin/assign_benefits_to_plan';

    this.GET_USER_SUBSCRIPTION_BENEFITS = '/admin/list_user_subscription_benefits';


    this.ADMIN_REMOVE_BENEFITS_FROM_PLAN = '/admin/remove_benefits_from_plan';

    this.ADMIN_UPDATE_USER_SUBSCRIPTION_PLAN = '/admin/update_user_subscription_plan';

    this.SUPPLIER_PAYOUT_REQUEST = '/supplier_payout_request';

    this.SUPPLIER_PAYOUT_REQUEST_LIST = '/get_supplier_payout_request_list';

    this.AGENT_PAYOUT_REQUEST_LIST = '/get_agents_payout_request_list';

    this.ADMIN_ACCEPT_REJECT_PAYOUT_REQUEST = '/accept_reject_payout_request';

    this.CREATE_LOYALTY = '/admin/loyality/create';

    this.UPDATE_LOYALTY = '/admin/loyality/update';

    this.LIST_LOYALTY = '/admin/loyality/list';

    this.DELETE_LOYALTY = '/admin/loyality/delete';

    this.GET_CHAT = '/getChat';

    this.UPDATE_BRANCH_PROFILE_IMAGE = "/add_logo_supplier_branch";

    this.GET_FEEDBACK = "/get_feedbacks";

    this.DELETE_FEEDBACK = "/delete_feedbacks";

    this.EDIT_FEEDBACK_SUGGESTION = "/edit_feedback"

    this.ADD_SUGGESTIONS = "/add_suggestions";

    this.LIST_SUGGESTIONS = "/get_suggestions";

    this.DELETE_BLOCK_SUGGESTIONS = "/delete_block_suggestions";

    this.EDIT_SUGGESTIONS = "/edit_suggestions";

    this.APPROVE_SUGGESTIONS = "/approve_new_suggestions";

    this.SUBMIT_SUPPLIER_FEEDBACK = '/add_feedback';

    this.GET_USER_SUGGESTIONS = '/get_user_suggestions';

    this.ADMIN_ACCEPT_REJECT_PAYOUT_REQUEST = '/accept_reject_payout_request';

    this.UPDATE_BRANCH_PROFILE_IMAGE = "/add_logo_supplier_branch";

    this.UPDATE_BRANCH_PROFILE_IMAGE = "/add_logo_supplier_branch";

    this.UPDATE_CLIENT_INFO = '/common/customer/updateinfo';

    this.GET_SURVEY_CODE = '/admin/survey/getCode';

    this.GET_SURVEY_ACCESS_TOKEN = '/admin/survey/getAccessToken';

    this.GET_SURVEY_DET_LIST = '/admin/survey/get';

    this.GET_SURVEY_CATEGORIES = '/admin/survey_categories/get';

    this.GET_SURVEY_TEMPLATES = '/admin/survey_templates/get';

    this.GET_SURVEY_PAGES = '/admin/survey_page/get';

    this.GET_SURVEY_PAGE_QUESTION = '/admin/survey_page_question/get';

    this.GET_SURVEY_RESPONSE = '/admin/survey_response/get';

    this.GET_SURVEY_RESPONSE_BULK = '/admin/survey_response_bulk/get';

    this.GET_SURVEY_COLLECTOR_RESPONSE = '/admin/collector_response/get';

    this.GET_SURVEY_COLLECTOR_RESPONSE_BULK = '/admin/collector_response_bulk/get';

    this.SUBSCRIPTION_REPORT = '/user_subscription_report';

    this.ADMIN_REPORT_LIST = '/admin/list_reports';

    this.ADMIN_POST_DELETE = '/admin/post/delete';

    this.WALLET_APPROVAL = '/admin/wallet/approve';

    this.ADMIN_POST_DELETE = '/admin/post/delete';

    this.ADMIN_SOS_LIST = '/admin/sos_alert_notifications_listing';

    this.USER_SUBSCRIPTION_REVENUE_REPORT = '/user_subscription_revenue_report';

    this.SUPPLIER_SUBSCRIPTION_REVENUE_REPORT = '/supplier_subscription_revenue_report';

    this.GOOGLE_DISTANCE = '/user/google/matrix';

    this.POS_IMPORT = '/admin/pos/importInventory';
    this.POS_IMPORT_SUPPLIER = '/supplier/pos/importInventory'

    this.ADD_VEHICLE_CATEGORY = '/common/add_category_for_agents';

    this.LIST_VEHICLE_CATEGORY = '/admin/list_category_for_agents';

    this.DELETE_VEHICLE_CATEGORY = '/common/delete_category_for_agents';

    this.UPDATE_SUPPLIER_PWD = '/admin/update_supplier_password';

    this.EDIT_ORDER_PRICE = '/admin/order/amount_update_with_receipt';

    this.ASSIGN_TO_SHIPROCKET = '/admin/ship_rocket/add_shipment';

    this.TRACK_TO_SHIPROCKET = '/admin/ship_rocket/shipment/track';

    this.ADD_ORDER_DISTANCE = '/admin/add_supplier_min_distance_price';

    this.GET_ORDER_DISTANCE_LIST = '/admin/list_supplier_min_distance_price';

    this.DELETE_ORDER_DISTANCE = '/admin/delete_supplier_min_distance_price';

    this.ADD_TAG_FOR_SUPPLIER = '/admin/add_tags_for_supplier';

    this.GET_SUPPLIER_TAG_LIST = '/admin/list_tags_for_supplier';

    this.DELETE_SUPPLIER_TAG = '/admin/delete_tag_for_supplier';

    this.UPDATE_SUPPLIER_TAG = '/admin/update_tags_for_supplier';

    this.GET_TAGS_BY_SUPPLIER_ID = '/admin/list_tags_by_supplier_id';

    this.ASSIGN_TAGS_TO_SUPPLIER = '/admin/assign_tag_for_supplier';

    this.GET_AGENT_ACTIVE_ORDER_LIST = '/admin/agent_order_list';

    this.UPDATE_USER_APP_VERSION = '/admin/update_user_app_version';

    this.SUPPLIER_VARIANT_PRODUCT_IMPORT = '/v1/admin/supplier/variant_product/import';

    this.ADD_POS_KEYS = '/admin_add_pos_keys';

    this.POS_KEYS_LIST = '/admin_list_pos_keys';

    this.ADD_EDIT_FLAVOR_OF_WEEK = '/admin/add_update_flavor_supplier';

    this.CHANGE_SOS_STATUS = '/admin/update_sos_notification_status';

    this.GET_ORDER_WEIGHT_LIST = '/admin/list_weight_wise_delivery_charge';

    this.DELETE_ORDER_WEIGHT = '/admin/delete_weight_wise_delivery_charge'

    this.ADD_ORDER_WEIGHT = '/admin/update_weight_wise_delivery_charge';

    this.DELETE_ORDERWISE_GATEWAYS = '/admin/delete_order_wise_gateways';

    this.ADD_ORDERWISE_GATEWAYS = '/admin/add_order_wise_gateways';

    this.UPDATE_ORDERWISE_GATEWAYS = '/admin/update_order_wise_gateways';

    this.GET_ORDERWISE_GATEWAYS = '/admin/list_order_wise_gateways';

    this.GET_AGENT_LIST_FOR_SETTINGS = '/list_agents_for_settings';

    this.GET_MESSAGE_ID = '/getChatMessageId';

    this.ADMIN_IMPORT_VARIENT = '/admin/variant/import';

    this.AGENT_SUPPLIER_LISTING = '/admin/all/supplier_listing';

    this.DELIVERY_MODE_UPDATE = '/admin/pickup/status';
    this.DRIVER_IN_OUT_TIMINGS = '/admin/agent/in_out_timings'
    this.DRIVER_IN_OUT_TIMINGS = '/admin/agent/in_out_timings';

    this.UPDATE_PRODUCT_OFFERS = '/admin/update_supplier_products_offer';

    this.GET_CURRENCY_LIST = '/admin/currency/list';
    this.ADD_CURRENCY = '/admin/currency/add';
    this.UPDATE_CURRENCY = '/admin/currency/update';
    this.DELETE_CURRENCY = '/admin/currency/delete';

    this.ADMIN_CAT_SORTING = '/admin/update_category_sequence';

    this.SUPPLIER_ON_OFF = '/admin/update_supplier_availibity_onoff';

    this.GET_DELIVERY_COMPANY_INFO = () => { return API_BY_PROFILE('/admin/delivery_company/profile', '', '/delivery_company/profile'); };

    this.UPDATE_DELIVERY_COMPANY_INFO = () => { return API_BY_PROFILE('/admin/update_delivery_company', '', '/update_delivery_company'); };

    this.LIST_CATEGORY_GEOFENCE_AREA = '/admin/list_categories_geofence';

    this.ADD_CATEGORY_GEOFENCE_AREA = '/admin/add_category_geofence';

    this.UPDATE_CATEGORY_GEOFENCE_AREA = '/admin/update_category_geofence';

    this.DELETE_CATEGORY_GEOFENCE_AREA = '/admin/delete_category_geofence';

    this.SUPPLIER_BUY_SUBSCRIPTION = '/supplier/buy_subscription_plan';

    this.APPROVE_SUPPLIER_SUBSCRIPTION = '/admin/approve_supplier_subscription';

    this.SUPPLIER_IMPORT = '/admin/supplier/import';

    this.GET_AGENT_BLOCK_TIME = '/admin/get_agent_block_times';
    this.DELETE_AGENT_BLOCK_TIME = '/admin/delete_agents_block_time';
    this.SET_AGENT_BLOCK_TIME = '/admin/set_agents_block_time';
    this.VIEW_BLOCK_TIME_ACCEPTED_AGENTS = '/admin/get_block_time_accepted_agents'

    this.ADD_ZONE_GEOFENCE = '/admin/add_geofence';
    this.UPDATE_ZONE_GEOFENCE = '/admin/update_geofence';
    this.DELETE_ZONE_GEOFENCE = '/admin/delete_geofence';
    this.GET_LIST_ZONE_GEOFENCE = '/admin/list_geofence';
    this.ASSIGN_UNASSIGN_ZONE_GEOFENCE = '/admin/assign_unassign_geofence_to_supplier';
    this.ACTIVE_DEACTIVE_ZONE_GEOFENCE = '/admin/active_deactivate_geofence_area'

    this.GET_VOUCHERS = '/user/voucher_codes';

    this.UPDATE_SUPPLIER_SEQUENCE = '/admin/update_supplier_sequence';

    this.PRODUCT_FILTERED_LIST = '/v1/supplier/product_list';

    this.SUPPLIER_SCHEDULE_UPDATE = '/admin/active_deactive_supplier_scheduling';
    this.SUPPLIER_BLOCK_UPDATE = '/admin/block_unblock_all_suppliers';
    this.UPDATE_SUPPLIER_SEQUENCE = '/admin/update_supplier_sequence';

    this.SUPPLIER_UPDATION_REQUEST = '/supplier/updation_request';
    this.SUPPLIER_UPDATION_REQUEST_LIST = '/admin/list_supplier_updation_requests';
    this.UPDATION_REQUESTS = '/supplier/updation_requests';
    this.APPROVE_UPDATION_REQUEST = '/admin/approve_supplier_updation_request';

    this.PRODUCT_UPDATION_REQUESTS = '/admin/product_updation_requests';
    this.PRODUCT_UPDATION_REQUESTS_BY_PRODUCT_ID = '/supplier/product_updation_request';
    this.APPROVE_PRODUCT_UPDATION_REQUEST = '/admin/approve_product_updation_request';

    this.ADD_CUSTOM_PAGES = '/admin/pages';
    this.GET_CUSTOM_PAGES = '/admin/pages';
    this.DELETE_CUSTOM_PAGES = '/admin/pages/';

    this.UPDATE_FCM_TOKEN = () => { return API_BY_PROFILE('/update_fcm_token', '/supplier/update_fcm_token'); };

    this.CHECK_PRODUCT_LIST = '/v1/check_product_list';
    this.ADD_TO_CART = '/admin/add_to_cart';
    this.UPDATE_CART_INFO = '/admin/update_cart_info';
    this.GENERATE_ORDER = '/admin/genrate_order';
    this.GET_AGENT_KEYS = '/admin/get_agent_keys';
    this.GET_AGENT_SLOTS = '/agent/available/slots';


    this.UPDATE_RETURN_REQUEST_CLAIM_STATUS = '/admin/order/retun/claimed'

    this.SEND_CONTACT_EMAIL = "/common/send_email";


    this.ADD_UPDATE_CCTV = "/admin/add_update_cctv";
    this.CCTC_LISTING = "/admin/cctv_list";
    this.DELETE_CCTV = "/admin/delete_cctv";

    this.CANCEL_ORDER_AFTER_CONFIRMATION = () => { return API_BY_PROFILE('/cancel_order_by_admin', '/cancel_order_by_supplier', '/delivery_company_order_description'); };



    this.SEND_TEXT = "/v1/send_system_sms";


    this.ADD_EXTRA_PRODUCT = '/admin/add_extra_product'
    this.EDIT_EXTRA_PRODUCT = '/admin/update_extra_product_quantity'
    this.DELETE_EXTRA_PRODUCT = '/admin/delete_extra_product';

    this.GET_SUPPLIER_EXTRA_PRODUCT = '/admin/supplier_extra_product_list';
    this.GET_EXTRA_PRODUCT = () => { return API_BY_PROFILE('/admin/extra_product_list', '/supplier/extra_product_list'); };
    this.UPDATE_ORDER_EXTRA_PRODUCT = () => { return API_BY_PROFILE('/admin/update_order_with/extra_products', '/supplier/update_order_with/extra_products'); };

    this.KPI_DETAILS = '/v2/admin/kpi';

    this.GET_ALL_SUPPLIER_AGENT_LOCATION = '/admin/supplier_agent_listing';


    this.SUPPLIER_ADD_EVENT = '/supplier/add_event';
    this.GET_EVENT_LISTING = '/supplier/events';
    this.GET_INVITED_EVENT_LISTING = '/supplier/invited-events';
    this.DELETE_SUPPLIER_EVENT = '/supplier/delete-event';
    this.UPDATE_SUPPLIER_EVENT = '/supplier/update_event';
    this.APPROVE_SUPPLIER_EVENT_BY_ADMIN = '/supplier/approve-event';
    this.JOIN_EVENT_BY_SUPPLIER = '/supplier/join-event';

    this.ADD_UPDATE_EVENT_ITEMS = '/supplier/add-update-event-food';
    this.EVENT_ITEMS_LISTING = '/supplier/event-food';
    this.REMOVE_EVENT_ITEMS = '/supplier/add-remove-event-food-item';
    this.ADD_REMOVE_EVENT_ITEMS = '/supplier/add-food-item';


    this.UPDATE_QUANTITY = '/admin/is_alot';

    this.LIST_GEOFENCE_SURGE = '/list_geofence_surge';
    this.ADD_GEOFENCE_SURGE = '/add_geofence_surge';
    this.UPDATE_GEOFENCE_SURGE = '/update_geofence_surge';
    this.DELETE_GEOFENCE_SURGE = '/delete_geofence_surge';
    this.ASSIGN_INVENTORY_SUPPLIER = '/admin/assign_extra_product_to_suppliers';
    this.DELETE_SERIAL_NUMBER = '/admin/delete_serial_number';
    this.ASSIGN_INVENTORY_AGENT = '/admin/assign_extra_product_to_agent';

    this.ADMIN_AGENT_RATING_LIST = '/admin/agent_rating_list';
    this.ADMIN_BLOCK_AGENT_RATING = '/admin/block_agent_review';

    this.CUSTOMER_WITHDRAW_REQUEST_LIST = '/customer/withdraw_request_list';

    this.CUSTOMER_WITHDRAW_REQUEST_ACTION = '/customer/withdraw_request_action';

    this.GET_CATEGORY_DETAIL = '/categoryListing_by_category_id'

    this.GET_INVENTORY_REPORT = () => { return API_BY_PROFILE('/admin/extra_product_report'); };

    this.ASSIGN_PRODUCT_SUGGESTION = '/admin/assignSuggestionProducts';
    this.ADMIN_SUPPLIER_PRODUCT_IMPORT_WITHOUT_CATEGORY = () => { return API_BY_PROFILE('/v2/admin/supplier/product/import', '/v2/supplier/product/import'); };

    this.ZOOM_AUTH = '/zoom_auth';
    this.CREATE_ZOOM_MEETING = '/zoom_create_meeting';

    this.DELETE_USER = '/admin/delete_user';
    this.DELETE_SUPPLIER = '/admin/delete_supplier';

    this.UPDATE_LOYALTY_STATUS = '/admin/loyality/block_unblock';

    this.LIST_SUPPLIER_DOCUMENTS = '/get_supplier_media';

    this.UPLOAD_SUPPLIER_DOCUMENTS = '/upload_supplier_media';

    this.DELETE_SUPPLIER_DOCUMENTS = '/delete_supplier_media';

    this.SUPPLIER_SUBSCRIPTION_PLANS_VALIDITY = '/supplier/subscriptionValidtity';


}]);
