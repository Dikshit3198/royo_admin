Royo.controller('LoyaltyCtrl', ['$scope', '$rootScope', 'constants', 'services', 'API', 'pagerService', 'factories','$translate',
    function ($scope, $rootScope, constants, services, API, pagerService, factories, $translate) {

        $scope.count = 0;
        $scope.skip = 0;
        $scope.limit = 12;
        $scope.currentPage = 1;
        $scope.loyalties = [];
        $scope.loyalty = {
            name: '',
            description: '',
            categoryData: [],
            totalLoyalityPoints: '',
            isForAllCategory: 1,
            perPointOrderAmount: '',
            perPointAmount: '',
            perPointAmountType: 1,
            file: ''
        }
        $scope.loyalty_image = '';
        $scope.is_add = false;
        $scope.is_edit = false;
        $scope.dataLoaded = false;
        $scope.suppliers = [];
        $scope.selected_supplier = [];
        $scope.categories = [];
        $scope.selected_category = [];


        var clearInputs = function () {
            $scope.loyalty = {
                name: '',
                description: '',
                isForAllCategory: 1,
                categoryData: [],
                totalLoyalityPoints: '',
                perPointOrderAmount: '',
                perPointAmount: '',
                perPointAmountType: 1,
                file: ''
            }
            $scope.loyalty_image = '';
            $scope.selected_supplier = [];
            $scope.categories = [];
            $scope.selected_category = [];
        }

        $scope.changeView = function (val) {
            $scope.is_add = val;
            $scope.is_edit = false;
            if (val) {
                clearInputs();
            }
        }

        // var getCategoryData = function (Id, index) {
        //     var param_data = {};
        //     param_data.accessToken = constants.ACCESSTOKEN;
        //     param_data.sectionId = 30;
        //     param_data.supplierId = Id;
        //     services.POST_DATA(param_data, API.LIST_SUPPLIER_CATEGORIES(), function (response) {
        //         $scope.categories[index] = response.data;
        //     });
        // };

        var getSupplier = function () {
            let params = {
                limit: 0,
                offset: 0,
                is_active: 1,
                search: '',
                is_desc: 0,
                order_by: 0
            }
            services.GET_DATA(params, API.SUPPLIER_LIST, function (response) {
                $scope.suppliers = response.data.suppliersList;
            });
        };

        if ($rootScope.profile == 'ADMIN') {
            getSupplier();
        }

        var getLoyalty = function (page) {
            let params = {
                offset: $scope.skip,
                limit: $scope.limit,
                sectionId: 40
            }
            $scope.dataLoaded = false;
            services.GET_DATA(params, API.LIST_LOYALTY, function (response) {
                if (response) {
                    $scope.count = response.data.countData[0].totalCount;
                    $scope.loyalties = response.data.levelData;
                }
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                $scope.dataLoaded = true;
            });
        }
        getLoyalty(1);

        $scope.setPage = function (page) {
            if ($scope.currentPage !== page) {
                $scope.currentPage = page;
                $scope.skip = $scope.limit * (page - 1);
                getLoyalty(page);
            }
        }

        $scope.changeForCategory = function (type) {
            $scope.loyalty.isForAllCategory = type;
            if (type == 1) {
                $scope.loyalty.categoryData = [];
            } else {
                $scope.loyalty.categoryData = [{ category_id: '', supplier_id: '', discount_price: 0, price_type: 1 }];
                $scope.categories = [[]];
                $scope.selected_supplier = [];
                $scope.selected_category = [];
            }
        }

        $scope.changeSupplier = function (val, index) {
            ($scope.loyalty.categoryData[index]).supplier_id = val.id;
            $scope.categories[index] = val.category_data;
            console.log($scope.loyalty.categoryData[index])
        };

        $scope.changeCat = function (val, index) {
            ($scope.loyalty.categoryData[index]).category_id = val.category_id;
        };

        $scope.addCat = function () {
            $scope.loyalty.categoryData.push({ category_id: '', supplier_id: '', discount_price: 0, price_type: 1 });
            $scope.categories.push([]);
        }

        $scope.removeCat = function (index) {
            $scope.loyalty.categoryData.splice(index, 1);
            $scope.selected_supplier.splice(index, 1);
            $scope.selected_category.splice(index, 1);
            $scope.categories.splice(index, 1);
        }

        $scope.editLoyalty = function (loyalty) {
            $scope.is_add = true;
            $scope.is_edit = true;
            $scope.selected_loyalty = loyalty;
            $scope.loyalty = {
                sectionId: 40,
                name: loyalty.name,
                description: loyalty.description,
                isForAllCategory: loyalty.is_for_all_category,
                categoryData: loyalty.categoryData,
                totalLoyalityPoints: loyalty.total_loyality_points,
                perPointOrderAmount: loyalty.per_point_order_amount,
                perPointAmount: loyalty.per_point_amount,
                perPointAmountType: loyalty.per_point_amount_type,
                file: loyalty.image
            };
            $scope.loyalty_image = loyalty.image;

            if (loyalty.is_for_all_category == 0) {
                $scope.categories = [];
                $scope.selected_supplier = [];
                $scope.selected_category = [];
                if (loyalty.categoryData.length) {
                    (loyalty.categoryData).forEach(el => {
                        let sup = $scope.suppliers.find(s => s.id == el.supplier_id);
                        if (!!sup) {
                            $scope.selected_supplier.push(sup);
                            $scope.categories.push(sup.category_data);
                            let cat = (sup.category_data).find(c => c.category_id == el.category_id);
                            if (!!cat) $scope.selected_category.push(cat);
                        }
                    });
                    
                }
            }

        }

        var afterSubmit = function () {
            $scope.is_add = false;
            $scope.currentPage = 1;
            $scope.skip = 0;
            getLoyalty(1);
            $scope.message = `${$translate.instant('Loyalty')} ${$scope.is_edit ? $translate.instant('updated') : $translate.instant('created')} ${$translate.instant('successfully')}`;
            services.SUCCESS_MODAL(true);
        }

        $scope.createLoyalty = function (addLoyaltyForm) {
            if (addLoyaltyForm.$submitted && addLoyaltyForm.$invalid) {
                return;
            }

            let params = {
                sectionId: 40,
                name: $scope.loyalty.name,
                description: $scope.loyalty.description,
                isForAllCategory: $scope.loyalty.isForAllCategory,
                categoryData: JSON.stringify($scope.loyalty.categoryData),
                totalLoyalityPoints: $scope.loyalty.totalLoyalityPoints,
                perPointOrderAmount: $scope.loyalty.perPointOrderAmount,
                perPointAmount: $scope.loyalty.perPointAmount,
                perPointAmountType: $scope.loyalty.perPointAmountType,
                file: $scope.loyalty.file
            }

            if ($scope.is_edit) {
                params.id = $scope.selected_loyalty.id
                services.PUT_FORM_DATA(params, API.UPDATE_LOYALTY, function (response) {
                    if (response) {
                        afterSubmit();
                    }
                });
            } else {
                services.POST_FORM_DATA(params, API.CREATE_LOYALTY, function (response) {
                    if (response) {
                        afterSubmit();
                    }
                });
            }
        }

        $scope.chooseWebBanner = function () {
            $('#loyalty_banner_input').trigger('click');
        }

        $scope.$on("fileSelected", function (event, args) {
            $scope.$apply(function () {
                $scope.files.push(args.file);
            });
        });

        $scope.file_to_upload_for_loyalty = function (File) {
            var file = File[0];
            if (!file) return;
            if (constants.IMAGE_TYPE.includes(file.type)) {
                if ((file.size / Math.pow(1024, 2)) <= 1) {
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        $scope.$apply(function () {
                            $scope.loyalty_image = e.target.result;
                            $scope.loyalty.file = file;
                        });
                    }
                } else {
                    factories.invalidDataPop($translate.instant("Image size must be less than 1mb"));
                }
            } else {
                factories.invalidDataPop($translate.instant("Invalid File Type"));
            }
        };

        $scope.deleteLoyalty = function (loyalty) {
            services.CONFIRM(`You want to delete this loyalty card`,
                function (isConfirm) {
                    if (isConfirm) {
                        let param_data = {};
                        param_data.sectionId = 40;
                        param_data.id = loyalty.id;
                        services.PUT_DATA(param_data, API.DELETE_LOYALTY, function (response) {
                            $scope.message = `${$translate.instant('Loyalty card has been deleted succeffully')}`;
                            $scope.currentPage = 1;
                            $scope.skip = 0;
                            getLoyalty(1);
                            services.SUCCESS_MODAL(true);
                        });
                    }
                });
        }

        $scope.changeLoyaltyStatus = function (status, id) {
            var param_data = {};
            param_data.sectionId = 40;
            param_data.id = id;
            param_data.is_block = +(!status);

            services.PUT_DATA(param_data, API.UPDATE_LOYALTY_STATUS, function (data) {
                $scope.currentPage = 1;
                $scope.skip = 0;
                getLoyalty(1);
                $scope.message = `${$translate.instant('Loyalty card status updated successfully')}`;
                services.SUCCESS_MODAL(true);
            });
        }

    }]);