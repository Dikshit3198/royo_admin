Royo.controller('docRatingUploadCtrl', ['$scope', '$rootScope', 'services', 'constants', 'API', 'pagerService', 'factories',
    function ($scope, $rootScope, services, constants, API, pagerService, factories) {

        $scope.product_images = [
            {
                file: ''
            }
        ];

        var getSupplierRatingDocs = function () {
            services.GET_DATA({}, API.LIST_SUPPLIER_RATING_DOCS, function (response) {
                $scope.ratingImageList = response.data;
            });
        }
        getSupplierRatingDocs();

        $scope.uploadPics = function (file) {
            const data = {
                'image': file
            }
            services.POST_FORM_DATA(data, API.UPLOAD_RATING_DOCS, (response) => {
                if (response && response.data) {
                    $scope.product_images.file = "";
                    getSupplierRatingDocs();
                    return response.data;
                }
            })
        };

        $scope.file_to_upload_for_image = function (File) {
            var file = File[0];
            if (constants.IMAGE_TYPE.includes(file.type)) {
                if ((file.size / Math.pow(1024, 2)) <= 7) {
                    $scope.image_file = File[0];
                    var Obj = {};
                    Obj.image = File[0];
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        $scope.$apply(function () {
                            $scope.product_images.file = e.target.result;
                        });
                    }

                } else {
                    factories.invalidDataPop("Image size must be less than 7mb");
                }
            } else {
                factories.invalidDataPop("Invalid File Type");
            }
        };

        $scope.removeImage = function (id) {
            const data = {
                'id': id
            }
            services.POST_DATA(data, API.DELETE_SUPPLIER_RATING_DOCS, (response) => {
                if (response && response.data) {
                    getSupplierRatingDocs();
                    return response.data;
                }

            })
        }

    }]);