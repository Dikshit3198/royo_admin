Royo.controller('OrderCreationCtrl', ['$scope', 'services', '$stateParams', 'API', '$rootScope', 'constants', 'pagerService', 'factories', '$state',
    function ($scope, services, $stateParams, API, $rootScope, constants, pagerService, factories, $state) {

        $scope.supplier_id = $stateParams.sup_id;
        $scope.branch_id = $stateParams.b_id;
        $scope.user_id = $stateParams.user_id;
        $scope.request_id = $stateParams.id;

        $scope.products = [];
        $scope.skip = 0;
        $scope.limit = 20;
        $scope.dataLoaded = false;
        $scope.categories = [];
        $scope.search = '';
        $scope.selected_products = [];
        $scope.product_list = [];
        $scope.order_cost = 0;
        $scope.delivery_charges = 0;
        $scope.handling_admin = 0;
        $scope.payment_type = 1;
        $scope.service_charge = 0;
        $scope.net_total = 0;
        $scope.supplierData = {};
        $scope.is_geo_tax = false;

        var priceCalculation = function () {
            $scope.order_cost = 0;
            $scope.handling_admin = 0;
            $scope.service_charge = 0;
            ;
            $scope.products.forEach(product => {
                $scope.order_cost += parseFloat(product.price) * product.quantity;
                $scope.handling_admin += ((parseFloat(product.price) * product.quantity) * parseFloat(product.handling)) / 100;
            });

            let service_charge = $scope.supplierData.user_service_charge;
            if (service_charge) {
                $scope.service_charge = (service_charge * $scope.order_cost) / 100;
            }

            $scope.net_total = $scope.order_cost + $scope.handling_admin + $scope.service_charge + $scope.delivery_charges;
        }

        var getDeliveryCharges = function () {
            if ($stateParams.lat && $stateParams.lng) {
                let param_data = {
                    source_latitude: $scope.supplierData.latitude,
                    source_longitude: $scope.supplierData.longitude,
                    dest_latitude: $stateParams.lat,
                    dest_longitude: $stateParams.lng
                }
                services.GET_DATA(param_data, API.GOOGLE_DISTANCE, function (response) {
                    let distanceObj = response.data;
                    if (distanceObj && distanceObj['distance']) {
                        // let value = factories.getSettings().key_value.delivery_distance_unit == 1 ? 1609.34 : 1000;
                        // let distance = distanceObj['distance'] / value;
                        let distance = distanceObj['distance'];
                        if (distance > $scope.supplierData.distance_value) {
                            $scope.delivery_charges = $scope.supplierData.base_delivery_charges + ((distance - $scope.supplierData.distance_value) * $scope.supplierData.radius_price);
                        } else {
                            $scope.delivery_charges = $scope.supplierData.base_delivery_charges;
                        }
                        priceCalculation();
                    } else {
                        $scope.delivery_charges = $scope.supplierData.base_delivery_charges;
                    }
                });

                // let latlngA = new google.maps.LatLng($scope.supplierData.latitude, $scope.supplierData.longitude);
                // let latlngB = new google.maps.LatLng($stateParams.lat, $stateParams.lng);
                // let service = new google.maps.DistanceMatrixService();
                // service.getDistanceMatrix(
                //     {
                //         origins: [latlngA],
                //         destinations: [latlngB],
                //         travelMode: google.maps.TravelMode.DRIVING,
                //         unitSystem: google.maps.UnitSystem.METRIC,
                //         avoidHighways: false,
                //         avoidTolls: false,
                //     }, (response, status) => {
                //         if (status === google.maps.GeocoderStatus.OK) {
                //             let distanceArr = response.rows;
                //             let distanceObj = {};
                //             for (let val of distanceArr) {
                //                 distanceObj = (val.elements).find(element => element.status === google.maps.GeocoderStatus.OK);
                //                 if (!!distanceObj) break;
                //             };
                //             $scope.$apply(function () {
                //                 if (distanceObj['distance'] && distanceObj['distance'].value) {
                //                     let value = factories.getSettings().key_value.delivery_distance_unit == 1 ? 1609.34 : 1000;
                //                     let distance = distanceObj['distance'].value / value;
                //                     if(distance > $scope.supplierData.distance_value) {
                //                         $scope.delivery_charges = $scope.supplierData.base_delivery_charges + ((distance - $scope.supplierData.distance_value) * $scope.supplierData.radius_price);
                //                     } else {
                //                         $scope.delivery_charges = $scope.supplierData.base_delivery_charges;
                //                     }
                //                     priceCalculation();
                //                 } else {
                //                     $scope.delivery_charges = $scope.supplierData.base_delivery_charges;
                //                 }
                //             });
                //         }
                //     });
            }
        }

        var deliveryCharge = function () {
            if (factories.getSettings().key_value.delivery_charge_type == 1) {
                $scope.delivery_charges = $scope.supplierData.radius_price;
                priceCalculation();
            } else {
                getDeliveryCharges();
            }
        }

        var geoFencedTax = function () {
            $scope.geofence_tax_data = [];
            let param_data = {
                lat: $stateParams.lat,
                long: $stateParams.lng,
                branchId: $scope.branch_id
            }
            services.GET_DATA(param_data, API.GET_GEOFENCE_TAX, function (response) {
                if (!!response && response.data && response.data.taxData.length) {
                    $scope.is_geo_tax = true;
                    let data = response.data.taxData[0];
                    $scope.delivery_charges = $scope.supplierData.base_delivery_charges + data.delivery_charges;
                    $scope.geo_tax = data.tax;
                    priceCalculation();
                } else {
                    deliveryCharge();
                }
            });
        }

        var getSupplierInfo = function () {
            var param_data = {};
            param_data.accessToken = constants.ACCESSTOKEN;
            param_data.sectionId = 30;
            param_data.supplierId = $scope.supplier_id;
            services.POST_DATA(param_data, API.GET_SUPPLIER_INFO_TAB_DATA(), function (response) {
                if (!!response) {
                    $scope.supplierData = response.data[0];
                    if (factories.getSettings().key_value.is_tax_geofence == 1 && $stateParams.lat && $stateParams.lng) {
                        geoFencedTax();
                    } else {
                        deliveryCharge();
                    }
                }
            });
        }
        getSupplierInfo();

        $scope.changePaymentType = function (payment_type) {
            $scope.payment_type = payment_type;
        }

        $scope.updateProducts = function () {

            if (!$scope.products.length) {
                factories.invalidDataPop(`Please select items`);
                return;
            }

            if ($scope.order_cost < $scope.supplierData.min_order) {
                factories.invalidDataPop(`Sub-Total must be greater than ${$scope.supplierData.min_order}`);
                return;
            }

            let products = [];
            $scope.products.forEach(product => {
                if (product.new) {
                    products.push({
                        price: product.price,
                        quantity: product.quantity,
                        productName: product.name,
                        productId: product.product_id,
                        productDesc: '',
                        imagePath: product.image,
                        branchId: $scope.branch_id,
                        handlingAdmin: product.handling,
                        handlingSupplier: 0
                    });
                }
            });

            if (!products.length) {
                factories.invalidDataPop("Please add data");
                return;
            }

            let param_data = {
                sectionId: 36,
                userId: $scope.user_id,
                branchId: $scope.branch_id,
                zoneOffset: moment().format('Z'),
                selfPickup: 0,
                requestId: $scope.request_id,
                items: products,
                paymentType: $scope.payment_type,
                userServiceCharge: $scope.service_charge,
                deliveryCharge: $scope.delivery_charges,
                presImage1: localStorage.getItem('prescription_request') ? JSON.parse(localStorage.getItem('prescription_request')).pres_img : '',
                presDescription: localStorage.getItem('prescription_request') ? JSON.parse(localStorage.getItem('prescription_request')).pres_desc : '',
            };
            services.POST_DATA(param_data, API.CREATE_ORDER(), function (response) {
                $scope.edit_product = 0;
                localStorage.removeItem('prescription_request');
                $state.go("orders.ordersManager", { status: 0 });
                $scope.msg_description = `Order created successfully`;
                services.SUCCESS_MODAL(true);
            });
        }

        $scope.addProducts = function () {
            $scope.selected_products.forEach(product => {
                if (product.left_quantity) {
                    let similar_product = $scope.products.find(el => el.product_id == product.id);
                    if (!!similar_product) {
                        similar_product.quantity++;
                    } else {
                        $scope.products.push({
                            image: product.images[0].image_path,
                            name: product.name,
                            product_id: product.id,
                            price: product.price ? product.price : 0,
                            variants: product.prod_variants,
                            addons: [],
                            quantity: 1,
                            handling: $scope.is_geo_tax ? $scope.geo_tax : product.handling,
                            left_quantity: product.left_quantity,
                            new: true
                        });
                    }
                }
            });
            priceCalculation();
        }

        $scope.removeProduct = function (index) {
            if ($scope.products[index].new) {
                $scope.products.splice(index, 1);
                priceCalculation();
            } else {
                let param_data = {
                    sectionId: 36,
                    orderId: $scope.orderId,
                    items: [
                        {
                            productId: $scope.products[index].product_id
                        }
                    ]
                }
                services.PUT_DATA(param_data, API.REMOVE_PRODUCT_IN_ORDER(), function (response) {
                    $scope.products.splice(index, 1);
                    priceCalculation();
                    $scope.msg_description = `Product removed`;
                    services.SUCCESS_MODAL(true);
                });
            }
        }

        $scope.increaseQuantity = function (product) {
            if (product.quantity < product.left_quantity) {
                product.quantity++;
                priceCalculation();
            }
        }

        $scope.decreaseQuantity = function (product) {
            if (product.quantity > 1) {
                product.quantity--;
                priceCalculation();
            }
        }

        var getHomeData = function () {
            var param_data = {};
            param_data.accessToken = constants.ACCESSTOKEN;
            param_data.sectionId = 30;
            param_data.supplierId = $scope.supplier_id;

            services.POST_DATA(param_data, API.LIST_SUPPLIER_CATEGORIES(), function (response) {
                let categoryData = response.data;
                $scope.sub_categories = {};
                $scope.det_sub_categories = {};
                categoryData.map((cat) => {
                    cat['id'] = cat.category_id;
                });
                $scope.categories = categoryData;
                $scope.selected_cat = categoryData[0];
                $scope.category_selected = categoryData[0].category_id;
                $scope.onSelectCategory(categoryData[0], false);
            });
        };

        $scope.openProductModal = function () {
            $scope.product_list = [];
            $scope.selected_products = [];
            $("#add_products").modal('show');
            getHomeData();
        }

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
                param_data.supplierId = $scope.supplier_id;
                if (catIndex == 0) {
                    param_data.level = 1;
                }

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
            $scope.product_list = [];
            $scope.count = data['product_count'];
            if (data['products'].length) {
                data['products'].forEach(product => {
                    if (product.price && product.price.length && product.left_quantity) {
                        product['name_en'] = product.names[0].name;
                        product['desc_en'] = product.names[0].product_desc;
                        let regular_price = (product.price).find(el => el.price_type == 0);
                        let discount_price = (product.price).find(el => el.price_type == 1);
                        if (!!discount_price) {
                            product['price'] = discount_price ? (parseFloat(discount_price.price)) : null;
                            product['handling'] = discount_price ? (parseFloat(discount_price.handling)) : 0;
                            product['delivery_charges'] = discount_price.delivery_charges ? parseFloat(discount_price.delivery_charges) : 0;
                        } else {
                            product['price'] = regular_price ? (parseFloat(regular_price.price)) : null;
                            product['handling'] = regular_price ? (parseFloat(regular_price.handling)) : 0;
                            product['delivery_charges'] = regular_price.delivery_charges ? parseFloat(regular_price.delivery_charges) : 0;
                        }
                        $scope.product_list.push(product);
                    }
                });
            }
            $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
        }

        var productList = function (page) {

            let param_data = {};
            param_data.subCategoryId = undefined;
            param_data.detailedSubCategoryId = undefined;

            param_data.section_id = 30;
            param_data.supplierId = $scope.supplier_id;
            param_data.categoryId = $scope.category_selected;
            if ($scope.catIdArr.length > 0) {
                param_data.subCategoryId = $scope.catIdArr[$scope.catIdArr.length - 1];
            }
            param_data.limit = $scope.limit;
            param_data.offset = $scope.skip;
            param_data.serachText = $scope.search;
            param_data.serachType = $scope.search ? 1 : 0;
            param_data.branchId = $scope.branch_id;

            param_data.detailedSubCategoryId = $scope.selected_det_sub_cat.id;
            if (param_data.subCategoryId == undefined) {
                param_data.subCategoryId = param_data.detailedSubCategoryId;
            }

            if (param_data.subCategoryId == undefined && param_data.detailedSubCategoryId == undefined) {
                param_data.detailedSubCategoryId = param_data.categoryId;
                param_data.subCategoryId = param_data.categoryId;
            }

            $scope.dataLoaded = false;
            services.listSupBranchProducts($scope, param_data, function (data) {
                mapPoducts(data, page);
            });
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


    }]);