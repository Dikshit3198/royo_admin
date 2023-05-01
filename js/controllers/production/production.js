
Royo.controller('ProductionCtrl', ['$scope', '$rootScope', 'factories', 'services', 'constants', '$translate', '$state', 'API', '$timeout',
    function ($scope, $rootScope, factories, services, constants, $translate, $state, API, $timeout) {

        $scope.categoryData = [];
        $scope.selected_parentIndex = 0;
        $scope.selected_childIndex = 0;
        $scope.products = [];
        $scope.category_selected = '';
        $scope.is_product = true;
        $scope.dataLoaded = false;
        $scope.generic_category = [];
        $scope.profileType = $rootScope.profile
        $scope.selectedCat = [];
        $scope.branch_data = localStorage.getItem('branch_type') ? JSON.parse(localStorage.getItem('branch_type')) : null;
        $scope.isCsv = false;
        $scope.selectedCsv = {};
        $scope.settings = factories.getSettings();

        $scope.orderedCat = []
        $scope.orderedCatProduct = []
        $scope.isProductOrder = false
        $scope.allProducts = []
        $scope.query = ''
        $scope.orderList = 'name'
        $scope.items = [];

        $scope.categoryOrders = [];
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


        var getCategories = function () {
            let params = $rootScope.profile === 'SUPPLIER' || $rootScope.profile === 'BRANCH' ? { supplier_id: $rootScope.active_supplier_id } : {};
            params.language_id = localStorage.getItem('lang') != 'en' ? 15 : 14;
            services.GET_DATA(params, API.CATEGORY_LIST(), function (response) {
                if (response.data.length) {
                    let categories = []
                    if ($rootScope.profile === 'SUPPLIER' || $rootScope.profile === 'BRANCH') {
                        response.data.forEach(cat => {
                            if (cat.is_assign == 1) {
                                categories.push(cat);
                            }
                        });
                    } else {
                        categories = response.data;
                    }
                    let generic_index = categories.findIndex(el => el.id == 1);
                    if (generic_index > -1) {
                        $scope.generic_category = categories.splice(generic_index, 1);
                    }
                    $scope.categoryData = [{ arr: categories, name: factories.localisation().categories }];
                    let category = _.first(categories);

                    if (!!category) {
                        if (category.sub_category.length > 0) {
                            $scope.selectCat(0, 0, category);
                        } else {
                            $scope.category_selected = category.id;
                            getProducts();
                        }
                    }
                } else {
                    $scope.categoryData = [{ arr: [], name: factories.localisation().categories }];
                }
                if ($rootScope.enable_admin_cat_sorting == 1) {
                    $scope.categoryData[0].arr.sort((a, b) => a.sequence_no - b.sequence_no);
                }


            });
        };
        getCategories();

        var getProducts = function () {
            let param_data = {};
            param_data.section_id = 30;
            param_data.categoryId = $scope.category_selected;

            if ($scope.selectedCat.length > 0) {
                param_data.subCategoryId = $scope.selectedCat[$scope.selectedCat.length - 1];
                if ($scope.selectedCat.length > 1) {
                    param_data.subCategoryId = $scope.selectedCat[$scope.selectedCat.length - 2];
                    param_data.detailedSubCategoryId = $scope.selectedCat[$scope.selectedCat.length - 1];
                }
            }

            if (param_data.subCategoryId == undefined) {
                param_data.subCategoryId = param_data.categoryId;
            }
            if (param_data.detailedSubCategoryId == undefined && param_data.subCategoryId) {
                param_data.detailedSubCategoryId = param_data.subCategoryId;
            }
            if (param_data.subCategoryId == undefined && param_data.detailedSubCategoryId == undefined) {
                param_data.detailedSubCategoryId = param_data.categoryId;
                param_data.subCategoryId = param_data.categoryId;
            }
            $scope.dataLoaded = false;
            param_data.limit = 100;
            param_data.offset = 0;
            param_data.serachText = "";
            param_data.serachType = 0;
            param_data.language_id = localStorage.getItem('lang') != 'en' ? 15 : 14;
            param_data.branchId = 0;

            if (($rootScope.profile === 'ADMIN' && $scope.settings.screenFlow[0].is_single_vendor == 1) || $rootScope.profile === 'SUPPLIER' || $rootScope.profile === 'BRANCH') {
                param_data.supplierId = $rootScope.profile === 'SUPPLIER' || $rootScope.profile === 'BRANCH' ? $rootScope.active_supplier_id : $scope.settings.supplier_id;
                if ($scope.branch_data) {
                    param_data.branchId = $scope.branch_data.default_branch_id;
                    services.listSupBranchProducts($scope, param_data, function (data) {
                        $scope.products = data.products;

                        let lang_index = localStorage.getItem('lang') != 'en' ? 1 : 0;
                        $scope.products.map(product => {
                            product['name_en'] = product.names[lang_index] ? product.names[lang_index].name : '';
                            product['desc_en'] = product.names[lang_index] ? product.names[lang_index].product_desc : '';
                        });
                        $scope.dataLoaded = true;
                    });
                }
                //  else {
                //     services.listSupplierProducts($scope, param_data, function (data) {
                //         $scope.products = data.products;
                //         $scope.dataLoaded = true;
                //     });
                // }
            } else {
                services.listProducts($scope, param_data, function (data) {
                    $scope.products = data.products;

                    let lang_index = localStorage.getItem('lang') != 'en' ? 1 : 0;
                    $scope.products.map(product => {
                        product['name_en'] = product.names[lang_index] ? product.names[lang_index].name : '';
                        product['desc_en'] = product.names[lang_index] ? product.names[lang_index].product_desc : '';
                    });
                    $scope.dataLoaded = true;
                }); 
                
            }
        }

        $scope.toProduct = function (type, id) {
            let params = {};
            params.cat_id = $scope.category_selected;
            if ($scope.selectedCat.length) {
                params.sub_cat_ids = $scope.selectedCat.join();
            }

            if ($rootScope.profile === 'ADMIN' && $rootScope.is_single_vendor == 1) {
                params.id = $scope.settings.supplier_id;
                params.level = 0;

                // if ($scope.branch_data && $scope.branch_data.is_multibranch == 0) {
                if ($scope.branch_data) {
                    params['multi_b'] = $scope.branch_data.is_multibranch;
                    params['b_id'] = $scope.branch_data.default_branch_id;
                }
                $state.go('production.supplierProducts', params);
                setTimeout(() => {
                    $rootScope.$broadcast('is_sup_product_add_edit', { type: type, product_id: id });
                }, 500);
            } else if ($rootScope.profile === 'SUPPLIER' || $rootScope.profile === 'BRANCH') {
                params.id = $rootScope.active_supplier_id;
                params.level = 0;
                // if ($scope.settings.screenFlow[0].is_multiple_branch == 0) {
                //     params.b_id = $scope.settings.supplier_branch_id;
                // }
                // if ($scope.branch_data && $scope.branch_data.is_multibranch == 0) {
                if ($scope.branch_data) {
                    params['multi_b'] = $scope.branch_data.is_multibranch;
                    params['b_id'] = $scope.branch_data.default_branch_id;
                }
                $state.go('production.supplierProducts', params);
                setTimeout(() => {
                    $rootScope.$broadcast('is_sup_product_add_edit', { type: type, product_id: id });
                }, 1200);
            } else {
                $state.go('production.products', params);
                setTimeout(() => {
                    $rootScope.$broadcast('is_product_add_edit', { type: type, product_id: id });
                }, 1200);
            }
        }

        $scope.selectCat = function (parentIndex, childIndex, category) {
            if ($rootScope.is_single_menu) $scope.toProduct('ADD');
            $scope.is_product = false;
            $scope.selected_parentIndex = parentIndex;
            $scope.selected_childIndex = childIndex;
            $scope.products = [];
            if (parentIndex == 0) {
                $scope.category_selected = category.id;
                $scope.selectedCat = [];
            }
            $scope.categoryData.splice(parentIndex + 1, $scope.categoryData.length);
            $scope.selectedCat.splice(parentIndex + 1, $scope.selectedCat.length);

            if (parentIndex > 0) {
                if (!!$scope.selectedCat[parentIndex - 1]) {
                    $scope.selectedCat[parentIndex - 1] = category.id;
                    if ($scope.selectedCat.length > parentIndex) {
                        $scope.selectedCat.splice(parentIndex, $scope.selectedCat.length - 1)
                    }
                } else {
                    $scope.selectedCat.push(category.id);
                }
            }

            if (!!category.sub_category && category.sub_category.length) {
                if (parentIndex != 0) {
                    $scope.selectedCat.push(category.id);
                }
                let obj = {
                    arr: category.sub_category,
                    name: category.name,
                    id: category.id
                }
                $scope.categoryData.push(obj);
            } else {
                $scope.is_product = true;
                getProducts();
            }
        }

        $scope.addEditCat = function (path, params, type) {
            $state.go(path, params);
            // setTimeout(() => {
                // $rootScope.$broadcast('is_cat_add_edit', type);
            // }, 500);
            $timeout(function(){
                $rootScope.$broadcast('is_cat_add_edit', type);
            });
        }

        $scope.listSubCat = function (parentIndex, create_new, type) {
            let sub_cat_ids = [];
            $scope.categoryData.map((cat, index) => {
                if (parentIndex > 0 && cat.id && ((index < parentIndex && !create_new) || (index <= parentIndex + 1 && create_new) || type =='EDIT')) {
                    sub_cat_ids.push(cat.id);
                }
            });
            let params = {
                sub_cat_ids: sub_cat_ids.join(),
                cat_id: $scope.category_selected
            }
            $state.go('production.subCategory', params);
        }

        $scope.addEditSubCat = function (parentIndex, type, create_new, subCatId) {
            $scope.listSubCat(parentIndex, create_new, type);
            setTimeout(() => {
                $rootScope.$broadcast('is_sub_cat_add_edit', type, subCatId);
            }, 600);
        }

        $scope.genericProducts = function () {
            $scope.category_selected = $scope.generic_category[0].id;
            $scope.toProduct('LIST');
        }

        $scope.downloadSampleFile = () => {
            const a = document.createElement('a');
            document.body.appendChild(a);
            if ($rootScope.is_single_vendor == 1) {
                a.href = $rootScope.app_type == 1 ? $scope.settings.key_value.supplier_import_url_v1 : $scope.settings.key_value.supplier_import_url_v2;
            } else {
                a.href = $rootScope.app_type == 1 ? $scope.settings.key_value.product_import_url_v1 : $scope.settings.key_value.product_import_url_v2;
            }
            a.setAttribute('style', 'display: none');
            a.download = 'Product-Csv';
            a.click();
            document.body.removeChild(a);
        }

        $scope.removeCsv = () => {
            $scope.selectedCsv = null;
            $scope.isCsv = false;
            var upload = document.getElementById('upload');
            upload.value = null;
        }

        $scope.uploadCsv = () => {
            if (!$scope.isCsv) { return; }
            var param_data = {
                "file": $scope.selectedCsv,
                "sectionId": 30,
                "serviceType": $scope.settings.screenFlow[0].app_type,
            }

            let api = '';
            if ($rootScope.profile == 'SUPPLIER' || $rootScope.is_single_vendor == 1) {
                param_data.supplierId = $rootScope.is_single_vendor == 1 ? $rootScope.single_vendor_id : localStorage.getItem('supplier_id');
                param_data.branchId = JSON.parse(localStorage.getItem('branch_type')).default_branch_id;
                api = API.ADMIN_SUPPLIER_PRODUCT_IMPORT();
            } else {
                api = API.ADMIN_PRODUCT_IMPORT;
            }

            services.POST_FORM_DATA(param_data, api, function (response) {
                var csvCloseBtn = document.getElementById('close-csv-btn');
                csvCloseBtn.click();
                $scope.message = `${$translate.instant('File Successfully Uploaded')}`;
                services.SUCCESS_MODAL(true);
                getCategories();
            });
        }

        var upload = document.getElementById('upload');
        function onFile() {
            file = upload.files[0];
            $scope.selectedCsv = file;
            $scope.$apply(function () {
                $scope.selectedCsv = file;
                $scope.isCsv = true;
            });
            name = file.name.replace(/.[^/.]+$/, '');
        }

        upload.addEventListener('dragenter', function (e) {
            upload.parentNode.className = 'area dragging';
        }, false);

        upload.addEventListener('dragleave', function (e) {
            upload.parentNode.className = 'area';
        }, false);

        upload.addEventListener('drop', function (e) {
            onFile();
        }, false);

        upload.addEventListener('change', function (e) {
            onFile();
        }, false);


        $scope.setCatOrder = function (data) {
            $scope.isProductOrder = false
            $scope.selectedCatOrder = data
            $scope.allCategories = []
            $scope.allCategories = data.arr
            $scope.items = []
            data.arr.forEach(item => {
                $scope.items.push(item.name)
            });
            $scope.orderedCat = [];
        }


        $scope.SubmitCatSequence = function () {
            $scope.orderedCat = []
            $scope.items.forEach(item => {
                let cat = {}
                $scope.allCategories.forEach(cat => {
                    if (cat.name == item) {
                        $scope.orderedCat.push(cat)
                    }
                })
            })
            let catOrder = []
            for (let i = 0; i <= $scope.orderedCat.length - 1; i++) {
                var obj = {};
                if ($rootScope.enable_admin_cat_sorting != 1) {
                    obj = {
                        categoryId: $scope.selectedCatOrder.parent_cat ? $scope.selectedCatOrder.parent_cat.id : $scope.orderedCat[i].id,
                        subCategoryId: $scope.selectedCatOrder.parent_cat ? $scope.orderedCat[i].id : 0,
                        detailSubCategoryId: 0,
                        order_no: 0
                    }
                    if (i < 9) {
                        obj.order_no = Number($scope.selectedCatOrder.parent_cat ? ($scope.selectedCatOrder.parent_cat.order_no + '.' + '0' + (i + 1)) : '0' + i + 1)
                    } else {
                        obj.order_no = Number($scope.selectedCatOrder.parent_cat ? ($scope.selectedCatOrder.parent_cat.order_no + '.' + (i + 1)) : i + 1)
                    }
                }
                else {
                    obj = {
                        id: $scope.selectedCatOrder.parent_cat ? $scope.selectedCatOrder.parent_cat.id : $scope.orderedCat[i].id,
                        sequence_no: 0
                    }
                    if (i < 9) {
                        obj.sequence_no = Number($scope.selectedCatOrder.parent_cat ? ($scope.selectedCatOrder.parent_cat.order_no + '.' + '0' + (i + 1)) : '0' + i + 1)
                    } else {
                        obj.sequence_no = Number($scope.selectedCatOrder.parent_cat ? ($scope.selectedCatOrder.parent_cat.order_no + '.' + (i + 1)) : i + 1)
                    }
                }
                catOrder.push(obj)
            }
            if ($rootScope.enable_admin_cat_sorting != 1) {
                let method = 'changeSupplierCatOrder';
                let param_data = {
                    accessToken: constants.ACCESSTOKEN,
                    sectionId: 22,
                    // supplierId: $rootScope.single_vendor_id,
                    categoryOrder: catOrder,
                    isSubCat: $scope.selectedCatOrder.parent_cat ? true : false
                }
                if ($rootScope.supplier_category_sequence == 1 && $rootScope.profile === 'SUPPLIER') {
                    param_data['supplierId'] = localStorage.getItem('supplier_id');
                    method = 'changeSupplierCatOrderBySupplier';
                } else {
                    param_data['supplierId'] = $rootScope.single_vendor_id;
                }

                services[method](param_data, function (data) {
                    if (data) {
                        document.getElementById('closeCatOrder').click()
                        getCategories()
                    }
                })
            }
            else {
                let param_data = {
                    categoryOrders: catOrder
                }
                services.POST_DATA(param_data, API.ADMIN_CAT_SORTING, function (response) {
                    if (response) {
                        document.getElementById('closeCatOrder').click()
                        getCategories()
                    }
                })
            }
        }

        var getAllProducts = function () {
            $scope.is_product = true;
            let param_data = {};
            param_data.section_id = 30;
            param_data.categoryId = $scope.category_selected;
            param_data.supplierId = $scope.supplier_id;
            param_data.limit = $scope.totalProducts < 10 ? 10 : $scope.totalProducts;
            param_data.offset = 0;
            param_data.serachText = '';
            param_data.serachType = 0;
            if ($scope.selectedCat.length > 0) {
                param_data.subCategoryId = $scope.selectedCat[0];
                param_data.detailedSubCategoryId = $scope.selectedCat[1];
            }
            if (param_data.subCategoryId == undefined) {
                param_data.subCategoryId = param_data.detailedSubCategoryId;
            }
            if (param_data.detailedSubCategoryId == undefined && param_data.subCategoryId) {
                param_data.detailedSubCategoryId = param_data.subCategoryId;
            }
            if (param_data.subCategoryId == undefined && param_data.detailedSubCategoryId == undefined) {
                param_data.detailedSubCategoryId = param_data.categoryId;
                param_data.subCategoryId = param_data.categoryId;
            }

            $scope.dataLoaded = false;
            param_data['branchId'] = $scope.branch_data.default_branch_id;
            services.listSupBranchProducts($scope, param_data, function (data) {
                $scope.allProducts = data.products;
                $scope.dataLoaded = true;
                $scope.isProductOrder = true
                $scope.selectedCatProduct = data
                $scope.items = []
                $scope.allProducts.forEach(item => {
                    $scope.items.push(item.name + '.' + item.id)
                })
                document.getElementById('OpenProductOrder').click()
                $scope.orderedCatProduct = []
            }); 
        }

        $scope.setProductOrder = function () {
            getAllProducts();
        }

        $scope.SubmitProductSequence = function () {
            $scope.orderedCatProduct = []
            $scope.items.forEach(item => {
                let cat = {}
                $scope.products.forEach(product => {
                    if (product.id == item.split('.')[1]) {
                        $scope.orderedCatProduct.push(product)
                    }
                })
            })
            let productOrder = []
            for (let i = 0; i <= $scope.orderedCatProduct.length - 1; i++) {
                let obj = {
                    product_id: $scope.orderedCatProduct[i].id,
                    order_no: i + 1
                }
                productOrder.push(obj)
            }
            let param_data = {}
            param_data.accessToken = constants.ACCESSTOKEN,
                param_data.sectionId = 30;
            param_data.categoryId = $scope.category_selected;
            // param_data.supplierId = $scope.supplier_id;
            param_data['branchId'] = $scope.branch_data.default_branch_id;
            if ($scope.selectedCat.length > 0) {
                param_data.subCategoryId = $scope.selectedCat[0];
                param_data.detailedSubCategoryId = $scope.selectedCat[1];
            }
            if (param_data.subCategoryId == undefined) {
                param_data.subCategoryId = param_data.detailedSubCategoryId;
            }
            if (param_data.detailedSubCategoryId == undefined && param_data.subCategoryId) {
                param_data.detailedSubCategoryId = param_data.subCategoryId;
            }
            if (param_data.subCategoryId == undefined && param_data.detailedSubCategoryId == undefined) {
                param_data.detailedSubCategoryId = param_data.categoryId;
                param_data.subCategoryId = param_data.categoryId;
            }
            param_data.productOrder = productOrder
            services.changeBranchProdutOrder(param_data, function (data) {
                if (data) {
                    document.getElementById('closeProductOrder').click()
                    getSupplierProducts()
                }
            })
        }

        $scope.onPosReuqest = function () {
            $scope.dataLoaded = true;
            services.GET_DATA({}, API.POS_IMPORT, function (response) {
                $scope.dataLoaded = false;
                $scope.message = `${$translate.instant('SUCCESS')}`;
                services.SUCCESS_MODAL(true);
            });
        }

    }]);
