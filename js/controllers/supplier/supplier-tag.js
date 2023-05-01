Royo.controller('SupplierTagsCtrl', ['$scope', '$rootScope', '$stateParams', 'services', 'API', 'pagerService', 'constants', 'factories',
    function ($scope, $rootScope, $stateParams, services, API, pagerService, constants, factories) {


        $rootScope.tab = $stateParams.tab;
        $scope.supplier_id = $stateParams.supplierId;
        $rootScope.$broadcast('supplier_id', { supplier_id: $stateParams.supplierId, tab: $stateParams.tab });


        $scope.skip = 0;
        $scope.limit = 20;
        $scope.search = '';
        $scope.count = 0;
        $scope.supplierTagsList = [];
        $scope.dataLoaded = false;
        $scope.supplier_id = '';
        $scope.supplier_tag = {
            name: '',
            tag_image: ''
        }
        $scope.currentPage = 1;

        $scope.is_updating = false;
        $scope.is_assiging = false;

        $scope.mark_all = false;

        $scope.selectedTagList = [];


        var getTags = function (page) {
            if ($stateParams.supplierId) {
                getSupplierTagsBy_Id(page);
            }
            else {
                getSupplierTags(page);
            }
        }


        var getSupplierTags = function (page) {
            var data = {
                limit: $scope.limit, 
                skip: $scope.skip,
            };
            $scope.dataLoaded = false;
            services.GET_DATA(data, API.GET_SUPPLIER_TAG_LIST, function (response) {
                $scope.dataLoaded = true;
                if (response) {
                    $scope.supplierTagsList = response.data.list;
                    $scope.count = response.data.count;
                    $scope.supplierTagsList.forEach(element => {
                        element['checked'] = false;
                    });
                }
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
            });
        };

        var getSupplierTagsBy_Id = function (page) {
            var data = {
                limit: $scope.limit,
                skip: $scope.skip,
                supplier_id: $stateParams.supplierId
            };
            $scope.is_assiging = true;
            $scope.dataLoaded = false;
            services.GET_DATA(data, API.GET_TAGS_BY_SUPPLIER_ID, function (response) {
                $scope.dataLoaded = true;
                if (response) {
                    $scope.supplierTagsList = response.data.list;
                    $scope.count = response.data.count;
                    $scope.supplierTagsList.forEach(element => {
                        if (element.is_assigned) {
                            element['checked'] = true;
                            $scope.selectedTagList.push(element.id);
                        }
                        else {
                            element['checked'] = false;
                        }
                    });
                }
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
            });
        };

        getTags(1);



        $scope.setPage = function (page) {
            if ($scope.currentPage !== page) {
                $scope.currentPage = page;
                $scope.skip = $scope.limit * (page - 1);
                getTags(page);
            }
        }


        $scope.file_to_upload_for_supplier_tag = function (File) {
            var file = File[0];
            if (constants.IMAGE_TYPE.includes(file.type)) {
                if ((file.size / Math.pow(1024, 2)) <= 1) {
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        $scope.$apply(function () {
                            $scope.uploadImage(File[0], function (err, imageUrl) {
                                $scope.supplier_tag.tag_image = imageUrl;
                            })
                        });
                    }
                } else {
                    factories.invalidDataPop("Image size must be less than 1mb");
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



        $scope.addSupplierTag = function (tagForm) {
            if (tagForm.$invalid) return;
            var addParams = {};
            addParams.name = $scope.supplier_tag.name;
            addParams.tag_image = $scope.supplier_tag.tag_image;
            services.POST_DATA(addParams, API.ADD_TAG_FOR_SUPPLIER, function (response) {
                $scope.dataLoaded = true;
                $("#tagFormRef").modal('hide');
                getSupplierTags(1);
                $scope.message = `Tag has been added!`;
                $scope.order_distance.distance = '';
                $scope.order_distance.price = '';
                tagForm.$submitted = false;
                services.SUCCESS_MODAL(true);
            });
        }

        $scope.changeView = function (view) {
            $scope.is_updating = false;
            // $scope.tagForm.$setPristine();
            $scope.supplier_tag = {
                name: '',
                tag_image: ''
            }
        }

        $scope.openUpdateTag = function (tag) {
            $("#tagFormRef").modal('show');
            $scope.supplier_tag.id = tag.id;
            $scope.supplier_tag.name = tag.name;
            $scope.supplier_tag.tag_image = tag.tag_image;
            $scope.is_updating = true;
        }

        $scope.updateSupplierTag = function (tagForm) {
            if (tagForm.$invalid) return;
            var addParams = {};
            addParams.name = $scope.supplier_tag.name;
            addParams.tag_image = $scope.supplier_tag.tag_image;
            addParams.id = $scope.supplier_tag.id;
            services.POST_DATA(addParams, API.UPDATE_SUPPLIER_TAG, function (response) {
                $scope.dataLoaded = true;
                $("#tagFormRef").modal('hide');
                getSupplierTags(1);
                $scope.message = `Tag has been updated!`;
                $scope.order_distance.distance = '';
                $scope.order_distance.price = '';
                tagForm.$submitted = false;
                services.SUCCESS_MODAL(true);
            });
        }



        $scope.deleteSupplierTag = function (tag) {
            var data = {
                id: tag.id
            }
            services.POST_DATA(data, API.DELETE_SUPPLIER_TAG, function (response) {
                getSupplierTags(1);
                $scope.dataLoaded = true;
                $scope.message = `Tag has been deleted!`;
                services.SUCCESS_MODAL(true);
            });
        }


        $scope.selectTag = function (tag) {
            tag.checked = !tag.checked;
            var findTag = $scope.supplierTagsList.find(x => x.id == tag.id);
            $scope.supplierTagsList.forEach(element => {
                if (element.id == findTag.id) {
                    element['checked'] = tag.checked;
                    if (tag.checked) {
                        $scope.selectedTagList.push(findTag.id);
                    }
                    else {
                        const index = $scope.selectedTagList.indexOf(findTag.id);
                        if (index > -1) {
                            $scope.selectedTagList.splice(index, 1);
                        }
                    }
                }
            });
        }

        $scope.markAll = function (index) {
            if (!$scope.mark_all) {
                $scope.selectedTagList = [];
                $scope.supplierTagsList.forEach(element => {
                    element['checked'] = true;
                    $scope.selectedTagList.push(element.id);
                });
                $scope.mark_all = true;
            }
            else {
                $scope.supplierTagsList.forEach(element => {
                    element['checked'] = false;
                });
                $scope.selectedTagList = [];
                $scope.mark_all = false;
            }
        }

        $scope.assignTags = function () {
            var data = {
                supplier_id: $stateParams.supplierId,
                tag_ids: $scope.selectedTagList
            }
            services.POST_DATA(data, API.ASSIGN_TAGS_TO_SUPPLIER, function (response) {
                getTags(1);
                $scope.dataLoaded = true;
                $scope.message = `Tags has been assigned!`;
                services.SUCCESS_MODAL(true);
            });
        }


    }]);
