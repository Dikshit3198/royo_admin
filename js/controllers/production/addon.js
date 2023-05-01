
Royo.controller('AddonCtrl', ['$scope', 'services', '$stateParams', 'API', 'factories', 'pagerService', 'constants', '$rootScope', '$translate',
    function ($scope, services, $stateParams, API, factories, pagerService, constants, $rootScope, $translate) {

        $scope.search = '';
        $scope.addon_product_id = $stateParams.product_id;
        $scope.addonsList = [];
        $scope.dataLoaded = false;
        $scope.message = '';
        $scope.is_add = false;
        $scope.addon = {};
        $scope.is_edit = false;
        $scope.add_on_id = '';
        $scope.addon_types = [];
        $scope.selection_type = '';
        $scope.submitted = false;
        $scope.addonAssignment = false;
        $scope.isAddonChecked = false;

        $scope.supplier_id = $stateParams.sup_id;
        $scope.branch_id = $stateParams.b_id;
        $scope.skip = 0;
        $scope.limit = 20;
        $scope.dataLoaded = false;
        $scope.categories = [];
        $scope.search = '';
        $scope.selected_products = [];
        $scope.product_list = [];
        $scope.level = parseInt($stateParams.level);
        $scope.is_liquor = parseInt($stateParams.type);

        $scope.init = function () {
            $scope.addon.types =
                [
                    {
                        name: '',
                        name_ml: '',
                        price: 0,
                        bottle_count: 0,
                        is_default: false
                    }
                ];
            $scope.addon.name = '';
            $scope.addon.name_ml = '';
            $scope.addon.min_adds_on = 0;
            $scope.addon.max_adds_on = 0;
            $scope.addon.is_multiple = '0';
            $scope.addon.addon_limit = '';
            $scope.addon.isMandatory = false;
            $scope.addon.bottle_count = 0;
            $scope.is_add = true;
            $scope.is_edit = false;
            $scope.submitted = false;
        }

        var getAddOns = function () {
            let params = {
                product_id: $scope.addon_product_id,
                sectionId: 30
            }
            $scope.dataLoaded = false;

            services.GET_DATA(params, API.GET_ADD_ONS(), function (data) {
                $scope.addonsList = data.data;
                $scope.addonsList.map(data => {
                    data.bData = data.bData;
                    (data.bData).forEach(p => {
                        p.quantity = Number(p.quantity)
                        p.price = parseFloat(p.price);
                    });
                    data['checked'] = false;
                });
                $scope.dataLoaded = true;
            });
        }
        getAddOns();

        $scope.refresh = function () {
            getAddOns();
        }

        $scope.addType = function () {
            $scope.addon.types.push({
                name: '',
                name_ml: '',
                price: 0,
                quantity: 1,
                bottle_count: 0,
                is_default: false
            });
        }

        $scope.resetSelection = function (is_multiple) {
            $scope.submitted = false;
            if ($scope.is_edit) {
                if ($scope.selection_type == is_multiple) {
                    $scope.addon.types = $scope.addon_types;
                } else {
                    $scope.addon.types =
                        [
                            {
                                name: '',
                                name_ml: '',
                                price: 0,
                                quantity: 1,
                                bottle_count: 0,
                                is_default: false
                            }
                        ];
                }
            } else {
                $scope.addon.types =
                    [
                        {
                            name: '',
                            name_ml: '',
                            price: 0,
                            quantity: 1,
                            bottle_count: 0,
                            is_default: false
                        }
                    ];
            }
        }

        $scope.checkIsDefault = function (types, index) {
            let i = 0;
            types.forEach(element => {
                if (i === index) {
                    element.is_default = true;
                } else {
                    element.is_default = false;
                }
                i++;
            });
        }

        $scope.addOnEdit = function (addon) {
            $scope.add_on_id = addon.id;
            $scope.addon = {
                types: [],
                name: addon.name,
                name_ml: addon.names.length ? addon.names[1].name : addon.name,
                min_adds_on: addon.min_adds_on,
                max_adds_on: addon.max_adds_on || addon.addon_limit,
                is_multiple: addon.is_multiple,
                addon_limit: addon.addon_limit,
                isMandatory: addon.is_multiple == 0 ? !!addon.is_mandatory : (addon.min_adds_on > 0 ? true : false)
            };

            (addon.bData).slice().map(el => {
                $scope.addon.types.push({
                    name: el.names.length ? el.names[0].name : el.name,
                    name_ml: el.names.length ? el.names[1].name : el.name,
                    price: parseFloat(el.price),
                    is_default: !!+(el.is_default),
                    quantity: el.quantity,
                    id: el.id,
                    bottle_count: el.bottle_count > 0 ? parseInt(el.bottle_count) : el.bottle_count = 0            
                });
            });
            $scope.addon_types = ($scope.addon.types).slice();
            $scope.selection_type = addon.is_multiple;
            $scope.is_add = true;
            $scope.is_edit = true;
            $scope.submitted = false;
        }

        $scope.deleteType = function (type, index) {
            if (type.id) {
                let param_data = {
                    type_id: type.id,
                    sectionId: 30
                };
                services.POST_DATA(param_data, API.ADD_ON_TYPE_DELETE(), function (response) {
                    $scope.addon.types.splice(index, 1);
                });
            } else {
                $scope.addon.types.splice(index, 1);
            }
        }

        var afterSubmit = function () {
            $("#addOnModal").modal('hide');
            getAddOns();
            if ($scope.is_edit) {
                $scope.message = $translate.instant('Customization updated successfully');
            } else {
                $scope.message = $translate.instant('Customization created successfully');
            }
            services.SUCCESS_MODAL(true);
        }

        $scope.createAddOn = function (addOnForm) {
           
            $scope.submitted = true;
            if (addOnForm.$invalid) return;

            if ($scope.addon.max_adds_on == 0 && $scope.addon.is_multiple == 1) {
                factories.invalidDataPop($translate.instant("Max Selection can not be 0"));
                return;
            }

            if ($scope.addon.types.length) {
                ($scope.addon.types).map(type => {
                    type.is_default = +type.is_default;
                    type.name_ml = type.name_ml ? type.name_ml : type.name;
                    type.price = parseFloat(type.price);
                    type.bottle_count = type.bottle_count > 0 ?  parseInt(type.bottle_count) :  type.bottle_count = 0;                
                });
            }
            let param_data = {
                product_id: $scope.addon_product_id,
                sectionId: 30,
                types: $scope.addon.types,
                name: $scope.addon.name,
                name_ml: $scope.addon.name_ml ? $scope.addon.name_ml : $scope.addon.name,
                min_adds_on: $scope.addon.min_adds_on || +$scope.addon.isMandatory || 0,
                max_adds_on: $scope.addon.max_adds_on || 0,
                addon_limit: $scope.addon.max_adds_on || 0,
                is_mandatory: +$scope.addon.isMandatory,
                is_multiple: +$scope.addon.is_multiple,
            };

            if (param_data.min_adds_on > param_data.max_adds_on && param_data.is_multiple != 0) {
                factories.invalidDataPop('Minimum Selection must be less or equal than the Maximum Selection');
                return;
            }
            if ($rootScope.addon_type_quantity == 1) {
                let addOnQuantity = 0;
                $scope.addon.types.forEach(item => {
                    addOnQuantity += item.quantity
                });

                if (param_data.max_adds_on > addOnQuantity) {
                    factories.invalidDataPop($translate.instant(`Maximum Selection cannot be greater than total quantuty of types`));
                    return;
                }
                if (param_data.min_adds_on > addOnQuantity) {
                    factories.invalidDataPop($translate.instant(`Minimum Selection cannot be greater than total quantuty of types`));
                    return;
                }
            }

            if ($scope.is_edit) {
                param_data.id = ($scope.add_on_id).toString();
                services.PUT_DATA(param_data, API.EDIT_ADD_ON(), function (data) {
                    afterSubmit();
                });
            } else {
                services.POST_DATA(param_data, API.CREATE_ADD_ON(), function (data) {
                    afterSubmit();
                });
            }
        }

        $scope.deleteAddOn = function (addon) {
            services.CONFIRM($translate.instant('You want to delete this customization'),
                function (isConfirm) {
                    if (isConfirm) {
                        let param_data = {
                            add_on_id: addon.id,
                            sectionId: 30
                        };
                        services.POST_DATA(param_data, API.DELETE_ADD_ONS(), function (response) {
                            let addon_index = $scope.addonsList.findIndex(el => el.id === addon.id);
                            $scope.addonsList.splice(addon_index, 1);
                            $scope.message = $translate.instant('Customization deleted Successfully');
                            services.SUCCESS_MODAL(true);
                        });
                    }
                });
        }

        $scope.setTypeDefaultQuantiy = function (type) {
            type.quantity = 1
            type.price = 0
        }


        /************************** Addon Assignment ***************************/

        $scope.assignAddon = function () {
            $scope.addonAssignment = !$scope.addonAssignment;
        }

        $scope.check = function (addon) {
            addon.checked = !addon.checked;
            $scope.isAddonChecked = $scope.addonsList.some(el => el.checked);
        }

        $scope.productSelection = function () {
            $scope.product_list = [];
            $scope.selected_products = [];
            $("#add_products").modal('show');
            getHomeData();
        }

        var getHomeData = function () {
            $scope.sub_categories = {};
            $scope.det_sub_categories = {};
            $scope.categories = [];
            if ($scope.level == 1) {
                var param_data = {};
                param_data.accessToken = constants.ACCESSTOKEN;
                param_data.sectionId = 30;
                param_data.supplierId = $scope.supplier_id;
                services.POST_DATA(param_data, API.LIST_SUPPLIER_CATEGORIES(), function (response) {
                    let categoryData = response.data;
                    categoryData.map((cat) => {
                        cat['id'] = cat.category_id;
                    });
                    $scope.categories = categoryData;
                    $scope.selected_cat = categoryData[0];
                    $scope.onSelectCategory(categoryData[0], false);
                });
            } else {
                let params = {
                    limit: 0,
                    offset: 0,
                    search: ''
                }
                services.GET_DATA(params, API.ADMIN_CATEGORY_LIST(), function (response) {
                    if (response.data && response.data.categories.length) {
                        $scope.categories = [];
                        (response.data.categories).forEach(category => {
                            if (category.category_id != 1) {
                                category['name'] = category.category_name[0].name;
                                category['id'] = category.category_id;
                                $scope.categories.push(category);
                            }
                        });
                        if ($scope.categories.length) {
                            $scope.selected_cat = $scope.categories[0];
                            $scope.onSelectCategory($scope.selected_cat, false);
                        }
                    }
                });
            }
        };

        $scope.dynamicSubCategories = [];
        $scope.onSelectCategory = function (category, change) {
            $scope.selected_products = [];
            $scope.category_selected = category.id;
            $scope.selected_sub_cat = '';
            $scope.selected_det_sub_cat = {};
            $scope.catIdArr = [];
            if (category.id) {
                $scope.changeSubCatId(category, 0, change);
            }
        };

        $scope.selectedCategory = [];
        $scope.changeSubCatId = function (subCatData, catIndex, change) {
            $scope.selected_products = [];
            $scope.selected_det_sub_cat = subCatData;
            if (!!subCatData && !!subCatData.id) {
                if (change) {
                    $scope.selectedCategory.splice(catIndex, $scope.selectedCategory.length - catIndex);
                }
                let param_data = {};
                param_data.subCatId = subCatData.id;
                param_data.sectionId = 30;
                if ($scope.level == 1) {
                    param_data.supplierId = $scope.supplier_id;
                }
                if (catIndex == 0) {
                    param_data.level = 1;
                }
                $scope.products = [];
                services.GET_DATA(param_data, API.GET_SUBCATEGORY_DATA(), function (response) {
                    let data = response.data;
                    if (data.length > 0) {
                        if (catIndex == $scope.dynamicSubCategories.length) {
                            $scope.dynamicSubCategories.push(data);
                        } else {
                            $scope.dynamicSubCategories.splice(catIndex, $scope.dynamicSubCategories.length - catIndex);
                            $scope.dynamicSubCategories[catIndex] = data;
                        }
                        if (catIndex > 0) {
                            if ($scope.catIdArr.length === catIndex - 1) {
                                $scope.catIdArr.push(subCatData.id);
                            } else {
                                $scope.catIdArr.splice(catIndex, $scope.catIdArr.length - catIndex);
                                $scope.catIdArr[catIndex] = subCatData.id;
                            }
                        }
                    } else {
                        $scope.dynamicSubCategories.splice(catIndex, $scope.dynamicSubCategories.length - catIndex);
                        productList(1);
                    }
                });
            }
        };


        $scope.selectProduct = function (product) {
            let index = $scope.selected_products.findIndex(p => p.id == product.id);
            if (index > -1) {
                $scope.selected_products.splice(index, 1);
            } else {
                $scope.selected_products.push(product);
            }
        }

        var mapPoducts = function (data, page) {
            $scope.dataLoaded = true;
            $scope.count = data['product_count'];
            $scope.product_list = data['products'];
            if ($scope.product_list.length) {
                $scope.product_list.map(product => {
                    product['name_en'] = product.names[0].name;
                    product['desc_en'] = product.names[0].product_desc;
                    if (product.price && product.price.length) {
                        let regular_price = (product.price).find(el => el.price_type == 0);
                        let discount_price = (product.price).find(el => el.price_type == 1);
                        if (!!discount_price) {
                            product['price'] = discount_price ? (parseFloat(discount_price.price)) : null;
                        } else {
                            product['price'] = regular_price ? (parseFloat(regular_price.price)) : null;
                        }
                    }
                });
                let p_index = $scope.product_list.findIndex(el => el.id == $scope.addon_product_id);
                if (p_index > -1) {
                    $scope.product_list.splice(p_index, 1);
                }
            }
            $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
        }

        var productList = function (page) {

            let param_data = {};
            param_data.subCategoryId = undefined;
            param_data.detailedSubCategoryId = undefined;
            param_data.section_id = 30;
            param_data.categoryId = $scope.category_selected;
            if ($scope.catIdArr.length > 0) {
                param_data.subCategoryId = $scope.catIdArr[$scope.catIdArr.length - 1];
            }
            param_data.limit = $scope.limit;
            param_data.offset = $scope.skip;
            param_data.serachText = $scope.search;
            param_data.serachType = $scope.search ? 1 : 0;

            param_data.detailedSubCategoryId = $scope.selected_det_sub_cat.id;
            if (param_data.subCategoryId == undefined) {
                param_data.subCategoryId = param_data.detailedSubCategoryId;
            }
            if (param_data.subCategoryId == undefined && param_data.detailedSubCategoryId == undefined) {
                param_data.detailedSubCategoryId = param_data.categoryId;
                param_data.subCategoryId = param_data.categoryId;
            }
            $scope.dataLoaded = false;
            if ($scope.level == 1) {
                param_data.supplierId = $scope.supplier_id;
                param_data.branchId = $scope.branch_id;
                services.listSupBranchProducts($scope, param_data, function (data) {
                    mapPoducts(data, page);
                });
            } else {
                services.listProducts($scope, param_data, function (data) {
                    mapPoducts(data, page);
                });
            }
        };


        $scope.searchProduct = function (keyEvent) {
            if (keyEvent.which === 13) {
                $scope.search = keyEvent.target.value;
                $scope.currentPage = 1;
                $scope.skip = 0;
                productList(1);
            }
        }

        $scope.setPage = function (page) {
            $scope.currentPage = page;
            $scope.skip = $scope.limit * (page - 1);
            productList(page);
        }

        $scope.addProducts = function () {
            let productIds = [];
            let addsOnIds = [];

            $scope.selected_products.forEach(el => {
                productIds.push(el.id);
            });

            $scope.addonsList.forEach(el => {
                if (el.checked) {
                    addsOnIds.push(el.id);
                }
            });

            if (!addsOnIds.length) {
                factories.invalidDataPop($translate.instant(`Please select customizations`));
                return;
            }

            if (!productIds.length) {
                factories.invalidDataPop(`${$translate.instant('Please select')} ${factories.localisation().products}`);
                return;
            }

            let params = {
                sectionId: 30,
                addsOnIds: addsOnIds,
                productIds: productIds
            }

            services.POST_DATA(params, API.ASSIGN_ADDONS(), function (data) {
                if (data) {
                    $("#add_products").modal('hide');
                    $scope.message = `${$translate.instant('Customization assigned to selected')} ${factories.localisation().products} ${$translate.instant('Successfully')}`;
                    services.SUCCESS_MODAL(true);
                    $scope.addonAssignment = false;
                    $scope.isAddonChecked = false;
                    $scope.addonsList.forEach(el => {
                        el.checked = false;
                    });
                }
            });
        }

    }]);