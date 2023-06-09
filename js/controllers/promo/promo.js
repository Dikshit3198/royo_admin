Royo.controller('PromoCtrl', ['$scope', 'services', 'factories', 'API', 'pagerService', '$translate', '$rootScope', 'constants',
    function ($scope, services, factories, API, pagerService, $translate, $rootScope, constants) {

        $scope.is_add = false;
        $scope.search = '';
        $scope.suppliers = [];
        $scope.categories = [];
        $scope.selected_count = 0;
        $scope.is_edit = false;
        $scope.details = [];
        $scope.dataLoaded = false;
        $scope.message = '';
        $scope.promo_to_display = {
            type: 0,
            array: []
        };
        $scope.validity = '';
        $scope.voucher_id = '';
        $scope.count = 0;
        $scope.skip = 0;
        $scope.limit = 12;
        $scope.currentPage = 1;
        $scope.sort_by = '';
        $scope.user_type = 1;
        $scope.promo_code_type = 0;
        $scope.start_date_filter = '';
        $scope.end_date_filter = '';
        $scope.activeSubscription=true;

        
      var getSubscription = function () {
      var data = {};
      secretdbkey=
      data.secretdbkey = localStorage.getItem('dbKey');
      data.Authorization= constants.ACCESSTOKEN;
      services.GET_DATA(data, API.SUPPLIER_SUBSCRIPTION_PLANS_VALIDITY, function (response) {
        $scope.activeSubscription=response.data.activeSubscription;
   
      });
    };

    if ($rootScope.profile == 'SUPPLIER' && $rootScope.is_subscription_plan == 1){
      getSubscription();
    }


        var datepicker = function () {
            setTimeout(() => {
                document.getElementById("datepicker").value = '';
                var picker1 = new Lightpick({
                    field: document.getElementById("datepicker"),
                    singleDate: false,
                    minDate: new Date(),
                    format: 'DD.MM.YYYY',
                    repick: true,
                    startDate: $scope.is_edit ? moment($scope.voucher.start_date) : '',
                    endDate: $scope.is_edit ? moment($scope.voucher.end_date) : '',
                    onSelect: (start, end) => {
                        $scope.validity = '';
                        if (start && end) {
                            $scope.voucher.start_date = start.format('YYYY-MM-DD');
                            $scope.voucher.end_date = end.format('YYYY-MM-DD');
                            $scope.validity = `${start.format('DD.MM.YYYY')} - ${end.format('DD.MM.YYYY')}`;
                            document.getElementById("datepicker").value = $scope.validity;
                            $scope.$apply();
                        }
                    }
                });
            }, 200);
        }

        var datepicker_filter = function () {
            setTimeout(() => {
                var picker2 = new Lightpick({
                    field: document.getElementById("datepicker_promo"),
                    singleDate: false,
                    format: 'DD.MM.YYYY',
                    repick: true,
                    onSelect: (start, end) => {
                        $scope.start_date_filter = '';
                        $scope.end_date_filter = '';
                        if (start && end) {
                            $scope.start_date_filter = start.format('YYYY-MM-DD');
                            $scope.end_date_filter = end.format('YYYY-MM-DD');
                            $scope.skip = 0;
                            getPromoData(1);
                        }
                    }
                });
            }, 500);
        }
        datepicker_filter();

        $scope.changeView = function (val) {
            $scope.is_add = val;
            $scope.is_edit = false;
            if (val) {
                $scope.voucher = {
                    type: $rootScope.is_single_vendor,
                    name: '',
                    desc: '',
                    is_first_user: 0,
                    no_of_voucher: '',
                    no_of_redeem: '',
                    discount_type: 1,
                    discount_price: '',
                    basket_val_MO: '',
                    start_date: '',
                    end_date: '',
                    bear_by: '',
                    commission_on: '',
                    promo_user_subscription_type: '',
                    max_discount_value: 0
                };
                $scope.validity = '';
                $scope.selected_count = 0;
                $scope.mark_all = false;
                if ($scope.suppliers.length) {
                    $scope.suppliers.map(sup => {
                        sup['checked'] = false;
                    });
                }

                if ($scope.categories.length) {
                    $scope.categories.map(cat => {
                        cat['checked'] = false;
                    });
                }
                datepicker();
            } else {
                datepicker_filter();
            }
        }

        //Get promo code list
        var getPromoData = function (page) {
            var params = {};
            params.offset = $scope.skip;
            params.limit = $scope.limit;
            params.search = ($scope.search).trim() ? $scope.search : '';
            if ($scope.sort_by) {
                params.order_by = $scope.sort_by;
            }
            params.is_all = $scope.user_type;
            params.promo_code_type = $scope.promo_code_type;
            if ($scope.start_date_filter && $scope.end_date_filter) {
                params.startDate = $scope.start_date_filter;
                params.endDate = $scope.end_date_filter;
            }

            if ($rootScope.profile == 'SUPPLIER') {
                params['supplier_id'] = $rootScope.active_supplier_id
            }

            $scope.dataLoaded = false;

            services.POST_DATA(params, API.GET_PROMOS, function (response) {
                $scope.promoCodeList = response.data.data;
                $scope.count = response.data.count;
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                $scope.dataLoaded = true;
            });
        };
        getPromoData(1);

        $scope.editPromo = function (promo) {
            $scope.is_edit = true;
            $scope.is_add = true;
            $scope.voucher_id = promo.id;
            $scope.voucher = {
                type: promo.promoType,
                name: promo.name,
                desc: promo.promoDesc,
                is_first_user: promo.firstTime,
                no_of_voucher: promo.maxUsers,
                no_of_redeem: promo.perUserCount,
                discount_type: promo.discountType,
                discount_price: promo.discountPrice,
                basket_val_MO: promo.minPrice,
                start_date: moment(promo.startDate),
                end_date: moment(promo.endDate),
                bear_by: promo.bear_by,
                commission_on: promo.commission_on,
                promo_user_subscription_type: promo.promo_user_subscription_type,
                max_discount_value: promo.max_discount_value,
            };
            $scope.validity = `${moment(promo.startDate).format('DD.MM.YYYY')} - ${moment(promo.endDate).format('DD.MM.YYYY')}`;
            $scope.details = JSON.parse(promo.detailsJson);
            datepicker();

            if ($rootScope.is_single_vendor == 1) {
                $scope.voucher.type = 1;
            }

            if ($scope.voucher.type == 1) {
                $scope.selected_count = 0;
                $scope.details.forEach(el => {
                    $scope.categories.forEach(cat => {
                        if (el.categoryId == cat.id) {
                            cat.checked = true;
                            $scope.selected_count++;
                        }
                    });
                });
            } else {
                if ($rootScope.app_type == 1) {
                    $scope.selected_count = 0;
                    $scope.details.forEach(el => {
                        $scope.suppliers.forEach(supplier => {
                            if (el.supplierId == supplier.id) {
                                supplier.checked = true;
                                $scope.selected_count++;
                            }
                        });
                    });
                } else {
                    let category = $scope.categories.find(cat => {
                        return $scope.details[0].categoryId == cat.id;
                    });
                    if (category && $rootScope.profile != 'SUPPLIER') {
                        $scope.listSupplier(category, false);
                    }
                }
            }
        }

        $scope.listSupplier = function (categoryData, change) {
            $scope.selected_category = categoryData;
            var params = {};
            params.accessToken = constants.ACCESSTOKEN;
            params.sectionId = 40;
            if ($rootScope.app_type != 1) {
                params.categoryId = categoryData.id;
            }

            services.POST_DATA(params, API.LIST_SUPPLIERS, function (sup_response) {
                $scope.suppliers = sup_response.data;
                if ($scope.suppliers.length) {
                    $scope.suppliers.map(supp => {
                        supp['checked'] = false;
                    });
                }
                if ($scope.is_edit && !change && $rootScope.app_type != 1) {
                    $scope.selected_count = 0;
                    $scope.details.forEach(el => {
                        $scope.suppliers.forEach(supplier => {
                            if (el.supplierId == supplier.id) {
                                supplier.checked = true;
                                $scope.selected_count++;
                            }
                        });
                    });
                }
            });
        };

        var listCategories = function () {
            var params = {};
            params.accessToken = constants.ACCESSTOKEN;
            params.sectionId = 30;

            services.POST_DATA(params, API.GET_CATEGORIES, function (response) {
                console.log(response)
                // let categories = response.data;
                let categories = response.data.filter((res) => {
                    return res.name != "Generic"
                });

                //categories.splice(0, 1);
                $scope.categories = categories;
                if ($scope.categories.length) {
                    $scope.categories.map(cat => {
                        cat['checked'] = false;
                    });
                }
                if ($scope.categories.length && $rootScope.is_single_vendor == 0) {
                    $scope.selected_category = categories[0];
                    if ($rootScope.profile != 'SUPPLIER')
                        $scope.listSupplier(categories[0], false);
                }
            });
        };


        if ($rootScope.app_type != 1) {
            listCategories();
        } else if ($rootScope.profile != 'SUPPLIER') {
            $scope.listSupplier(null, false);
        }

        $scope.markAll = function (mark_all) {
            $scope.mark_all = mark_all;
            $scope.selected_count = 0;
            if ($scope.voucher.type == 1) {
                $scope.categories.forEach(cat => {
                    cat.checked = mark_all;
                    if (mark_all) {
                        $scope.selected_count++;
                    }
                });
            } else {
                $scope.suppliers.forEach(sup => {
                    sup.checked = mark_all;
                    if (mark_all) {
                        $scope.selected_count++;
                    }
                });
            }
        }

        $scope.selectCategory = function (category) {
            $scope.selected_count = 0;
            category.checked = !category.checked;
            $scope.categories.forEach(cat => {
                if (cat.checked) {
                    $scope.selected_count++;
                }
            });
        }

        $scope.selectSupplier = function (supplier) {
            $scope.selected_count = 0;
            supplier.checked = !supplier.checked;
            $scope.suppliers.forEach(supplier => {
                if (supplier.checked) {
                    $scope.selected_count++;
                }
            });
        }

        $scope.chooseCategory = function (selected_category) {
            $scope.selected_category = selected_category;
            if ($rootScope.profile != 'SUPPLIER')
                $scope.listSupplier(selected_category, true);
        }

        var afterSubmit = function (is_edit) {
            $scope.voucher = {
                type: $rootScope.is_single_vendor,
                name: '',
                desc: '',
                is_first_user: 0,
                no_of_voucher: '',
                no_of_redeem: '',
                discount_type: 1,
                discount_price: '',
                basket_val_MO: '',
                start_date: '',
                end_date: '',
                bear_by: '',
                commission_on: '',
                promo_user_subscription_type: '',
                max_discount_value: 0
            };
            $scope.is_add = false;
            $scope.currentPage = 1;
            $scope.skip = 0;
            getPromoData(1);
            $scope.message = `${$translate.instant('Promo code')} ${is_edit ? $translate.instant('updated') : $translate.instant('created')} ${$translate.instant('successfully')}`;
            services.SUCCESS_MODAL(true);
        }

        $scope.addPromoCode = function (addPromoForm) {
            let JSON_DATA = [];
            if (!($rootScope.app_type == 1 && $rootScope.is_single_vendor == 1) && $rootScope.profile == 'ADMIN') {
                if (addPromoForm.$submitted && (addPromoForm.$invalid || !$scope.voucher.start_date || !$scope.voucher.end_date || !$scope.selected_count)) {
                    return;
                }

                if(((new Date($scope.voucher.start_date)).getTime()) > ((new Date($scope.voucher.end_date)).getTime())) {
                    factories.warningDataPop($translate.instant(`Invalid date range`));
                    return;
                }

                if (!$scope.selected_count) {
                    factories.invalidDataPop(`Please select ${$scope.voucher.type == 1 ? 'categories' : factories.localisation().supplier}`);
                    return;
                }

                if ($scope.voucher.type == 1) {
                    $scope.categories.forEach(cat => {
                        if (cat.checked) {
                            JSON_DATA.push({
                                'supplierId': 0,
                                'categoryId': cat.id,
                                'supplierName': '',
                                'categoryName': cat.name
                            });
                        }
                    });
                } else {
                    $scope.suppliers.forEach(supp => {
                        if (supp.checked) {
                            let data = {
                                'supplierId': supp.id,
                                'supplierName': supp.name,
                            }
                            if ($rootScope.app_type != 1) {
                                data.categoryId = $scope.selected_category.id;
                                data.categoryName = $scope.selected_category.name
                            }
                            JSON_DATA.push(data);
                        }
                    });
                }

            } else {
                data = {
                    'supplierId': $rootScope.single_vendor_id,
                    'supplierName': 'a'
                }
                if ($rootScope.profile == 'SUPPLIER') {
                    data['supplierId'] = $rootScope.active_supplier_id;
                }
                JSON_DATA.push(data);
            }

            var addParams = {};
            addParams.promoType = $scope.voucher.type;
            addParams.name = $scope.voucher.name;
            addParams.desc = $scope.voucher.desc;
            addParams.promoCode = $scope.voucher.name;
            addParams.firstTime = $scope.voucher.is_first_user;
            addParams.maxUser = $scope.voucher.no_of_voucher;
            addParams.perUserCount = $scope.voucher.no_of_redeem;
            addParams.promo_user_subscription_type = $scope.voucher.promo_user_subscription_type;
            if ($scope.voucher.is_first_user == 1) {
                addParams.maxUser = "0";
                addParams.perUserCount = "0";
            } else {
                addParams.firstTime = "0";
            }
            addParams.minPrice = $scope.voucher.basket_val_MO;
            addParams.startDate = $scope.voucher.start_date;
            addParams.endDate = $scope.voucher.end_date;
            addParams.discountPrice = $scope.voucher.discount_price;
            addParams.details = JSON_DATA;
            addParams.discountType = $scope.voucher.discount_type;
            addParams.bear_by = $rootScope.is_single_vendor == 0 ? $scope.voucher.bear_by : 0;
            addParams.commission_on = $rootScope.is_single_vendor == 0 ? $scope.voucher.commission_on : 1;

            if ($rootScope.is_enable_max_discount_value == 1) {
                addParams.max_discount_value = $scope.voucher.max_discount_value
            }

            if ($scope.is_edit) {
                addParams.id = $scope.voucher_id;
                services.PUT_DATA(addParams, API.EDIT_PROMOS(), function (response) {
                    afterSubmit(true);
                });
            } else {
                services.POST_DATA(addParams, API.ADD_PROMO, function (response) {
                    afterSubmit(false);
                });
            }
        }

        $scope.deletePromo = function (Id) {
            services.CONFIRM(`You want to delete this promo`,
                function (isConfirm) {
                    if (isConfirm) {
                        var params = {};
                        params.id = Id;
                        services.POST_DATA(params, API.DELETE_PROMO, function (response) {
                            $scope.message = `${$translate.instant('Promo code deleted successfully')}`;
                            services.SUCCESS_MODAL(true);
                            $scope.skip = 0;
                            getPromoData(1);
                        });
                    }
                });
        };

        $scope.openCategorySupplier = function (promo) {
            $("#viewPromo").modal('show');
            $scope.promo_to_display.type = promo.promoType;
            $scope.promo_to_display.array = JSON.parse(promo.detailsJson);
        }

        $scope.setPage = function (page) {
            if ($scope.currentPage !== page) {
                $scope.currentPage = page;
                $scope.skip = $scope.limit * (page - 1);
                getPromoData(page);
            }
        }

        $scope.searchPromo = function (keyEvent) {
            if (keyEvent.which === 13) {
                $scope.search = keyEvent.target.value;
                $scope.skip = 0;
                getPromoData(1);
            }
        }

        $scope.selectSortBy = function (sort_by) {
            $scope.sort_by = sort_by;
            $scope.skip = 0;
            getPromoData(1);
        }

        $scope.selectUserType = function (user_type) {
            $scope.user_type = user_type;
            $scope.sort_by = '';
            $scope.skip = 0;
            getPromoData(1);
        }
        $scope.selectPromoCodeType = function (promo_code_type) {
            $scope.promo_code_type = promo_code_type;
            $scope.sort_by = '';
            $scope.skip = 0;
            getPromoData(1);
        }
    }
]);
