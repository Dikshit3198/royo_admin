Royo.controller('VoucherCtrl', ['$scope', 'services', 'factories', 'API', 'pagerService', '$rootScope', 'constants', '$translate',
    function ($scope, services, factories, API, pagerService, $rootScope, constants, $translate) {

        $scope.is_add = false;
        $scope.search = '';
        $scope.suppliers = [];
        $scope.categories = [];
        $scope.filteredProducts = [];
        $scope.filteredCategories = [];
        $scope.selected_count = 0;
        $scope.selected_product_count = 0;
        $scope.selected_category_count = 0;
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
        $scope.start_date_filter = '';
        $scope.end_date_filter = '';

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
                    discount_type: 2,
                    discount_price: '',
                    basket_val_MO: '',
                    start_date: '',
                    end_date: '',
                    bear_by: '',
                    discount_percentage_by_admin: '',
                    discount_percentage_by_supplier: '',
                    commission_on: ''
                };
                $scope.resetPackage();
                $scope.initialize(true);

                $scope.validity = '';
                $scope.selected_count = 0;
                $scope.selected_product_count = 0
                $scope.selected_category_count = 0;

                $scope.mark_all = false;
                if ($scope.suppliers.length) {
                    $scope.suppliers.map(sup => {
                        sup['checked'] = false;
                    });
                }

                $scope.markCatProductAll(false, 1);

                if ($scope.filteredProducts.length) {
                    $scope.filteredProducts.map(col => {
                        col['checked'] = false;
                    })
                }

                if ($scope.categories.length) {
                    $scope.categories.map(cat => {
                        cat['checked'] = false;
                    });
                }
                datepicker();

                if (!$scope.suppliers.length) {
                    $scope.listSupplier(null, false);
                }

                if ($rootScope.profile == 'SUPPLIER') {
                    $scope.listFilterCategories();
                    $scope.listFilterProducts();
                }
            } else {
                datepicker_filter();
            }
        }

        $scope.resetPackage = function () {
            $scope.comboOffer = [];
            $scope.selectedCategory = {};
            $scope.selectedCombo = {};
            $scope.selectedSupplier = {};
            $scope.selectedProducts = [];
        }

        //Get promo code list
        var getPromoData = function (page) {
            var params = {};
            params.skip = $scope.skip;
            params.limit = $scope.limit;
            // params.supplierIds = '';
            // params.search = ($scope.search).trim() ? $scope.search : '';
            // if ($scope.sort_by) {
            //     params.order_by = $scope.sort_by;
            // }
            // params.is_all = $scope.user_type;
            // if ($scope.start_date_filter && $scope.end_date_filter) {
            //     params.startDate = $scope.start_date_filter;
            //     params.endDate = $scope.end_date_filter;
            // }

            // if ($rootScope.profile == 'SUPPLIER') {
            //     params['supplier_id'] = $rootScope.active_supplier_id
            // }

            $scope.dataLoaded = false;

            services.GET_DATA(params, API.GET_VOUCHERS, function (response) {
                $scope.promoCodeList = response.data.list;
                $scope.count = response.data.count;
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                $scope.dataLoaded = true;
            });
        };
        getPromoData(1);

        $scope.editPromo = function (promo) {
            console.log('promo', promo);

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
                discount_percentage_by_admin: promo.discount_percentage_by_admin,
                discount_percentage_by_supplier: promo.discount_percentage_by_supplier,
                commission_on: promo.commission_on,
                category: [],
                products: []
            };
            $scope.resetPackage();

            if ($scope.voucher.discount_type == 2) {
                $scope.voucher.buy_x_quantity = promo.promo_buy_x_quantity;
                $scope.voucher.max_buy_x_get = promo.max_buy_x_get;
                $scope.comboOffer = JSON.parse(promo.buy_x_get_x_arr);
                $scope.selectedCombo = $scope.comboOffer[0];
                $scope.selectedSupplier = $scope.selectedCombo.supplier;
                $scope.selectProductArr($scope.selectedSupplier, true);
                $scope.initialize(false);
            }

            if (promo.category_ids) {
                $scope.voucher.category = promo.category_ids.split(',');
            }

            if (promo.product_ids) {
                $scope.voucher.products = promo.product_ids.split(',');
            }

            $scope.validity = `${moment(promo.startDate).format('DD.MM.YYYY')} - ${moment(promo.endDate).format('DD.MM.YYYY')}`;
            $scope.details = JSON.parse(promo.detailsJson);
            datepicker();

            if ($rootScope.profile == 'SUPPLIER') {
                $scope.listFilterCategories();
                $scope.listFilterProducts();
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

                    let x = $scope.suppliers.findIndex(o => o.id == $scope.selectedSupplier.id);
                    if (x > -1) {
                        $scope.suppliers[x].checked = true;
                        $scope.selected_count = 1;
                    }


                } else {
                    let category = $scope.categories.find(cat => {
                        return $scope.details[0].categoryId == cat.id;
                    });
                    if (category && $rootScope.profile != 'SUPPLIER') {
                        $scope.listSupplier(category, false);
                    }
                }
            }


            if ($scope.is_edit && $scope.selected_count) {
                $scope.listFilterCategories();
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
                let categories = response.data;
                categories.splice(0, 1);
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


        $scope.listFilterCategories = function (data) {
            $scope.selected_category_count = 0;
            var params = {};
            params.language_id = 14;

            if ($rootScope.profile == 'SUPPLIER') {
                params.supplier_ids = $rootScope.active_supplier_id + '';
            } else {
                let supplierArr = [];
                $scope.suppliers.forEach(sup => {
                    if (sup.checked) {
                        supplierArr.push(sup.id);
                    }
                });

                if (supplierArr.length) {
                    params.supplier_id = supplierArr.join(',');
                }

            }

            // let params = { supplier_id: params.supplier_ids };
            // params.language_id = localStorage.getItem('lang') != 'en' ? 15 : 14;
            services.GET_DATA(params, API.CATEGORY_LIST(), function (response) {

                let categories = response.data;
                $scope.filteredCategories = categories.filter(o => o.is_assign == 1);
                if ($scope.filteredCategories.length) {
                    $scope.filteredCategories.map(cat => {
                        cat['checked'] = false;

                    });

                    if ($scope.voucher.discount_type == 2) {
                        if ($scope.selectedCategory && Object.keys($scope.selectedCategory).length) {
                            let x = $scope.filteredCategories.findIndex(o => o.id == $scope.selectedCategory.id);
                            if (x > -1) {
                                $scope.selected_category_count = 1;
                                $scope.filteredCategories[x].checked = true;
                                $scope.listFilterProducts();
                            }
                        }
                    }
                }
            });
        };

        $scope.listFilterProducts = function (data) {
            $scope.selected_product_count = 0;
            var params = {};

            params.languageId = 14;
            // params.is_location_disable = 1;
            params.latitude = 1;
            params.longitude = 1;

            // &latitude=30.9774739&longitude=76.5383463&i

            if ($rootScope.profile == 'SUPPLIER') {
                params.supplier_id = $rootScope.active_supplier_id + '';
            } else {
                let supplierArr = [];
                $scope.suppliers.forEach(sup => {
                    if (sup.checked) {
                        supplierArr.push(sup.id);
                    }
                });
                if (supplierArr.length) {
                    params.supplier_id = supplierArr.join(',');
                }

            }

            let categoryArr = []
            $scope.filteredCategories.forEach(cat => {
                if (cat.checked) {
                    categoryArr.push(cat.id);
                }
            });

            if (categoryArr.length) {
                params.category_id = categoryArr.join(',');
            }

            services.GET_DATA(params, API.PRODUCT_FILTERED_LIST, function (response) {
                let products = response.data.product;
                $scope.filteredProducts = [];

                products.forEach(col => {
                    $scope.filteredProducts = [...$scope.filteredProducts, ...col.value];
                })

                if ($scope.filteredProducts.length) {
                    $scope.filteredProducts.map(cat => {
                        cat['checked'] = false;
                    });


                    if ($scope.voucher.discount_type == 2) {
                        for (let i = 0; i < $scope.filteredProducts.length; i++) {
                            if ($scope.selectedProducts.includes($scope.filteredProducts[i].product_id)) {
                                $scope.filteredProducts[i].checked = true;
                                $scope.selected_product_count++;
                            }
                        }
                    }

                }
            });
        };

        if ($rootScope.app_type != 1) {
            listCategories();
        } else if ($rootScope.profile != 'SUPPLIER') {
            $scope.listSupplier(null, false);
        }

        $scope.setBuyXPromoValue = function (buyxValue) {
            let x = parseInt(buyxValue);
            let col = $scope.buyxArr[(x - 1)];
            $scope.voucher.get_x_quantity_label = col.get_label;
            $scope.voucher.get_x_quantity = col.get_value;
        }

        $scope.selectFilterCategory = function (category) {
            $scope.selected_category_count = 0;
            if ($scope.voucher.discount_type == 2) {
                if (!category.checked) {
                    $scope.filteredCategories.forEach(cat => {
                        if (cat.checked) {
                            cat.checked = false;
                        }
                    });
                    $scope.selectedCategory = { id: category.id, name: category.name };
                    $scope.selected_category_count = 1;
                    $scope.selectProductArr($scope.selectedSupplier, false);
                } else {
                    $scope.selectedCategory = {};
                    $scope.selectedProducts = [];
                    $scope.selectProductArr($scope.selectedSupplier, false);

                    $scope.filteredProducts.forEach(prod => {
                        if ($scope.selectedProducts.includes(prod.product_id)) {
                            prod.checked = false;
                        }
                    });

                    $scope.comboOffer = $scope.comboOffer.filter(o => !(o.supplier.id == $scope.selectedSupplier.id && o.category.id == category.id));
                }


                category.checked = !category.checked;

                if ($scope.selected_category_count) {
                    $scope.listFilterProducts();
                }
            }
        }

        $scope.initialize = function (flag) {
            $scope.buyxArr = [];
            for (let i = 0; i < 25; i++) {
                $scope.buyxArr.push({
                    value: (i + 1),
                    label: ($translate.instant('BUY') + ' ' + (i + 1)),
                    get_label: ($translate.instant('GET') + ' ' + (2 * (i + 1))),
                    get_value: (2 * (i + 1))
                })
            }

            if (!flag) {
                console.log('ededdcfdek');
                $scope.voucher.buy_x_quantity = $scope.voucher.max_buy_x_get;
            }
            else {
                $scope.voucher.buy_x_quantity = $scope.buyxArr[0].value;
            }

            $scope.voucher.bear_by = 1;
            $scope.setBuyXPromoValue($scope.voucher.buy_x_quantity + '');
            $scope.markAll(false);
        }

        $scope.comboOffer = [];
        $scope.addToTable = function (product, removeItem) {
            let x = $scope.comboOffer.findIndex(o => (o.supplier.id == $scope.selectedSupplier.id && o.product.id == product.product_id))
            console.log('dfdfgd', x);

            if (x > -1) {
                $scope.comboOffer.splice(x, 1);
            } else {
                let obj = {
                    supplier: { ...$scope.selectedSupplier },
                    category: { ...$scope.selectedCategory },
                    product: { id: product.product_id, name: product.name }
                }
                $scope.comboOffer.push(obj);
            }
        }

        $scope.removeCombo = function (productId, index) {
            $scope.comboOffer.splice(index, 1);
            $scope.filteredProducts.forEach(col => {
                if (col.checked && (col.product_id == productId)) {
                    col.checked = false;
                }
            })
        }

        $scope.selectFilterProduct = function (product) {
            $scope.selected_product_count = 0;

            if ($scope.voucher.discount_type == 2) {
                if (!product.checked) {
                    $scope.addToTable(product);
                } else {
                    $scope.addToTable(product, true);
                }
            }
            product.checked = !product.checked;
            $scope.filteredProducts.forEach(prod => {
                if (prod.checked) {
                    $scope.selected_product_count++;
                }
            });
        }

        $scope.markCatProductAll = function (mark_all, type) {

            if (type == 1) {
                $scope.selected_category_count = 0;
                $scope.mark_category_all = mark_all;

                $scope.filteredCategories.forEach(cat => {
                    cat.checked = mark_all;
                    if (mark_all) {
                        $scope.selected_category_count++;
                    }
                });
            }
            else {
                $scope.selected_product_count = 0;
                $scope.mark_product_all = mark_all;

                $scope.filteredProducts.forEach(prod => {
                    prod.checked = mark_all;
                    if (mark_all) {
                        $scope.selected_product_count++;
                    }
                });
            }
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
            if ($scope.voucher.discount_type == 2) {
                if (!supplier.checked) {
                    $scope.suppliers.forEach(supplier => {
                        if (supplier.checked) {
                            supplier.checked = false;
                        }
                    });

                    $scope.selectedCategory = {};

                    $scope.selectedSupplier = { id: supplier.id, name: supplier.name };
                    $scope.selected_count = 1;
                    $scope.selectProductArr(supplier, true);
                } else {
                    $scope.selectedCategory = {};
                    $scope.selectedProducts = [];
                    $scope.selectProductArr(supplier, true);

                    $scope.filteredProducts.forEach(prod => {
                        if ($scope.selectedProducts.includes(prod.product_id)) {
                            prod.checked = false;
                        }
                    });

                    $scope.comboOffer = $scope.comboOffer.filter(o => o.supplier.id != supplier.id);
                }

            }
            supplier.checked = !supplier.checked;


            if ($scope.selected_count) {
                $scope.listFilterCategories();

                $scope.filteredProducts = [];

            }
        }

        $scope.chooseCategory = function (selected_category) {
            $scope.selected_category = selected_category;
            if ($rootScope.profile != 'SUPPLIER')
                $scope.listSupplier(selected_category, true);
        }

        $scope.selectProductArr = function (supplier, flag) {
            $scope.selectedProducts = [];
            for (let i = 0; i < $scope.comboOffer.length; i++) {
                let o = $scope.comboOffer[i];
                if (o.supplier.id == supplier.id) {
                    if (!!flag && !Object.keys($scope.selectedCategory).length) {
                        $scope.selectedCategory = { ...o.category };
                    }
                    $scope.selectedProducts.push(o.product.id);
                }
            }
        }

        var afterSubmit = function (is_edit) {
            $scope.voucher = {
                type: $rootScope.is_single_vendor,
                name: '',
                desc: '',
                is_first_user: 0,
                no_of_voucher: '',
                no_of_redeem: '',
                discount_type: 2,
                discount_price: '',
                basket_val_MO: '',
                start_date: '',
                end_date: '',
                bear_by: '',
                discount_percentage_by_admin: '',
                discount_percentage_by_supplier: '',
                commission_on: ''
            };
            $scope.is_add = false;
            $scope.currentPage = 1;
            $scope.skip = 0;
            getPromoData(1);
            $scope.message = `Promo code ${is_edit ? 'updated' : 'created'} successfully`;
            services.SUCCESS_MODAL(true);
        }

        $scope.addPromoCode = function (addVoucherForm) {
            let JSON_DATA = [];

            if (!($rootScope.app_type == 1 && $rootScope.is_single_vendor == 1) && $rootScope.profile == 'ADMIN') {
                if (addVoucherForm.$submitted && (addVoucherForm.$invalid || !$scope.voucher.start_date || !$scope.voucher.end_date || !$scope.selected_count)) {
                    return;
                }

                if (!$scope.selected_count) {
                    factories.invalidDataPop(`Please select ${$scope.voucher.type == 1 ? 'categories' : factories.localisation().supplier}`);
                    return;
                }

                if ($scope.voucher.discount_type == 2) {
                    if (!$scope.comboOffer.length) {
                        factories.invalidDataPop(`Please select ${factories.localisation().product}`);
                        return;
                    }
                }

                $scope.promoData = {};
                $scope.promoData.categoryArr = [];
                $scope.promoData.productArr = [];
                $scope.comboOffer.forEach(col => {
                    let supp = col.supplier;
                    let x = JSON_DATA.findIndex(o => o.supplierId == supp.id);
                    if (x < 0) {
                        let data = {
                            'supplierId': supp.id,
                            'supplierName': supp.name
                        }
                        JSON_DATA.push(data);
                    }

                    if (!$scope.promoData.categoryArr.includes(col.category.id)) $scope.promoData.categoryArr.push((col.category.id + ''));
                    $scope.promoData.productArr.push(col.product.id + '');
                })



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
            if ($scope.voucher.is_first_user == 1) {
                addParams.maxUser = "0";
                addParams.perUserCount = "0";
            } else {
                addParams.firstTime = "0";
            }
            addParams.minPrice = $scope.voucher.basket_val_MO;
            addParams.startDate = $scope.voucher.start_date;
            addParams.endDate = $scope.voucher.end_date;

            addParams.details = JSON_DATA;

            $scope.comboOffer.forEach(col => {
                delete col.$$hashKey;
            })

            addParams.buy_x_get_x_arr = JSON.stringify($scope.comboOffer);
            addParams.promo_buy_x_quantity = parseInt($scope.voucher.buy_x_quantity);
            addParams.promo_get_x_quantity = $scope.voucher.get_x_quantity;
            addParams.max_buy_x_get = $scope.voucher.max_buy_x_get;
            addParams.category_ids = $scope.promoData.categoryArr;
            addParams.product_ids = $scope.promoData.productArr;
            addParams.promo_level = '3';


            addParams.discountType = $scope.voucher.discount_type;
            addParams.bear_by = $rootScope.is_single_vendor == 0 ? $scope.voucher.bear_by : 0;

            addParams.commission_on = $rootScope.is_single_vendor == 0 ? $scope.voucher.commission_on : 1;

            if ($scope.is_edit) {
                addParams.id = $scope.voucher_id;
                services.PUT_DATA(addParams, API.EDIT_PROMOS(), function (response) {
                    afterSubmit(true);
                });
            } else {
                addParams.is_voucher = 1;
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
                            $scope.message = 'Promo code deleted successfully';
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
    }
]);
