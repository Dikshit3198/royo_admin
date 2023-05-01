Royo.controller('ExtraServiceProductsCtrl', ['$scope', '$stateParams', 'services', 'factories', 'API', '$rootScope', '$translate', 'constants', '$state', 'pagerService',
    function ($scope, $stateParams, services, factories, API, $rootScope, $translate, constants, $state, pagerService) {

        $scope.skip = 0;
        $scope.limit = 10;
        $scope.count = 0;
        $scope.currentPage = 1;
        $scope.products = [];
        $scope.search = '';

        $scope.is_add = false;

        $scope.product_image_url = '';

        $scope.sameSerialNo = false
        $scope.serialErrorIndex = 0;


        $scope.changeView = function (val) {
            $scope.is_add = val;
            if (val) {
                $scope.extra_product = {
                    name: '',
                    nameAr: '',
                    price: '',
                    quantity: '',
                    description: '',
                    image: null,
                    serial_no_array: [{
                        serial_no: '',
                        cost_price: null,
                    }],
                    supplier: '',
                    manufacturer: '',
                    model: '',
                    cost_price: '',
                };
                $scope.is_edit = false;
                $scope.addedQuantity = 0;

                $scope.product_image_url = '';
            }
        }

        $scope.getExtraProductList = function (page) {
            let param_data = {};
            param_data.offset = $scope.skip;
            param_data.limit = $scope.limit;

            if ($scope.search)
                param_data.search = $scope.search;

            if ($rootScope.profile == 'SUPPLIER') {
                param_data.id = $rootScope.active_supplier_id;
            }

            $scope.dataLoaded = false;

            services.GET_DATA(param_data, API.GET_EXTRA_PRODUCT(), function (response) {
                if (!!response && response.data) {
                    $scope.products = response.data.result.data;
                    $scope.count = response.data.result.count;
                    $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                }
                $scope.dataLoaded = true;
            });
        }

        $scope.getExtraProductList(1);

        $scope.setPage = function (page) {
            $scope.currentPage = page;
            $scope.skip = $scope.limit * (page - 1);
            $scope.getExtraProductList(page);
        }

        $scope.searchProduct = function (keyEvent) {
            if (keyEvent.which === 13) {
                $scope.search = keyEvent.target.value;
                $scope.skip = 0;
                $scope.getExtraProductList(1);
            }
        }

        $scope.refresh = function () {
            $scope.currentPage = 1;
            $scope.skip = 0;
            $scope.getExtraProductList(1);
        }

        $scope.upload_image = function (File) {
            var file = File[0];
            if (constants.IMAGE_TYPE.includes(file.type)) {
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    $scope.$apply(function () {
                        $scope.uploadImage(File[0], function (err, imageUrl) {
                            $scope.product_image_url = imageUrl;
                        })
                        $scope.extra_product.image = File[0];
                    });
                }
            } else {
                factories.invalidDataPop("Invalid File Type");
            }
        };

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

        $scope.submitProduct = function (addExtraProductForm) {

            if (addExtraProductForm.$submitted && addExtraProductForm.$invalid) return;

            if (!$scope.product_image_url) {
                factories.invalidDataPop("Please select inventory image");
                return false;
            }

            var param_data = {};
            param_data.name = $scope.extra_product.name;
            // param_data.nameAr = $scope.extra_product.nameAr ? $scope.extra_product.nameAr : $scope.extra_product.name;
            param_data.price = $scope.extra_product.price ? $scope.extra_product.price : 0;
            param_data.quantity = $scope.extra_product.quantity;
            param_data.serial = $scope.extra_product.serial_no_array;
            param_data.supplier = $scope.extra_product.supplier;
            param_data.manufacturer = $scope.extra_product.manufacturer;
            param_data.model = $scope.extra_product.model;
            param_data.costprice = $scope.extra_product.cost_price;
            param_data.description = $scope.extra_product.description;

            if (!!$scope.product_image_url) {
                param_data.image = ($scope.product_image_url);
            }

            let api, method;
            if ($scope.is_edit) {
                param_data.id = $scope.extra_product.id;
                api = API.EDIT_EXTRA_PRODUCT;
                method = 'PUT_DATA';
            } else {
                api = API.ADD_EXTRA_PRODUCT;
                method = 'POST_DATA';
            }
            console.log('param_data', param_data);
            services[method](param_data, api, function (response) {
                $scope.message = `${factories.localisation().extra_product} Successfully Added`;
                services.SUCCESS_MODAL(true);
                $scope.getExtraProductList(1);
                $scope.is_add = false;
            });
        }


        $scope.deleteProduct = function (Id) {
            services.CONFIRM(`YOU WANT TO DELETE THIS ${factories.localisation().extra_product}`,
                function (isConfirm) {
                    if (isConfirm) {
                        if (typeof Id == "number") {
                            Id = Id.toString();
                        }

                        Id = '?id=' + Id;
                        $scope.message = `${factories.localisation().extra_product} Has Been Deleted Successfully`;

                        services.DELETE_DATA(Id, API.DELETE_EXTRA_PRODUCT, function (data) {
                            $scope.getExtraProductList(1);
                            services.SUCCESS_MODAL(true);
                        });

                    }
                });
        };


        $scope.editProduct = function (product) {
            $scope.is_edit = true;
            $scope.is_add = true;
            $scope.extra_product = {
                name: product.name,
                price: parseFloat(product.price) || 0,
                quantity: product.quantity,
                description: product.description,
                image: product.image ? product.image : '',
                id: product.id,
                serial_no_array: product.serial_no || [],
                supplier: product.supplier || '',
                manufacturer: product.manufacturer || '',
                model: product.model || '',
                cost_price: parseFloat(product.cost_price) || 0,
            }

            $scope.addedQuantity = product.quantity;
            $scope.product_image_url = product.image ? product.image : '';
        }

        $scope.checkQuantity = function (data) {
            if ($scope.addedQuantity > data) {
                factories.invalidDataPop("Please delete serial no first");
            } else {
                $scope.addedQuantity = data;
            }
        }

        $scope.quantityAllocated = function (id, index) {
            var param_data = {
                id: id + ''
            };
            services.PUT_DATA(param_data, API.UPDATE_QUANTITY, function (response) {
                $scope.extra_product.serial_no_array[index].is_aloted = 1;
                $scope.message = `${factories.localisation().suppliers} status have been updated`;
                services.SUCCESS_MODAL(true);
            });
        }

        $scope.rows = [{ abc: 'serial_no', kkkk: 'cost_price' }];

        $scope.addInventory = function () {
            var id = $scope.rows.length + 1;
            $scope.extra_product.serial_no_array.push({

                serial_no: '',
                cost_price: null,
            });
        };


        $scope.removeInventory = function (row) {
            var index = $scope.rows.indexOf(row);
            $scope.extra_product.serial_no_array.splice(index, 1);
            //$scope.deleteSerial();
        };

        $scope.deleteSerial = function (id, index) {
            services.CONFIRM(`YOU WANT TO DELETE THIS ${factories.localisation().extra_product}`,
                function (isConfirm) {
                    if (isConfirm) {
                        // if (typeof Id == "number") {
                        //     Id = Id.toString();
                        // }
                        var param_data = {
                            serial_id: id
                        };

                        serial_id = '?serial_id=' + id;
                        $scope.message = `${factories.localisation().extra_product} Has Been Deleted Successfully`;

                        services.POST_DATA(param_data, API.DELETE_SERIAL_NUMBER, function (data) {
                            // $scope.getExtraProductList();
                            $scope.extra_product.serial_no_array.splice(index, 1);
                            services.SUCCESS_MODAL(true);
                        });

                    }
                });
        };

        $scope.checkSerialExists = function (value, index) {

            // $scope.serialErrorIndex = index + 1;
            for (i = 0; i < $scope.extra_product.serial_no_array.length; i++) {
                let val = $scope.extra_product.serial_no_array[i].serial_no;
                if (val == value && i != index) {
                    $scope.sameSerialNo = true;
                    $scope.extra_product.serial_no_array[index] = '';
                    setTimeout(() => {
                        $scope.sameSerialNo = false;
                    }, 1000);
                }
            }
        }

    }]);    