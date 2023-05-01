Royo.controller('supplierMediaUploadCtrl', ['$scope', '$rootScope', 'services', 'constants', 'API', 'pagerService', 'factories', '$stateParams',
    function ($scope, $rootScope, services, constants, API, pagerService, factories, $stateParams) {

        $scope.supplierId = $stateParams.supplierId;
        $scope.media_type = {
            is_video: 0
        };
        $scope.product_images = [
            {
                file: ''
            }
        ];

        var getSupplierRatingDocs = function () {
            const data = {
                'supplier_id': $scope.supplierId
            }
            services.GET_DATA(data, API.LIST_SUPPLIER_DOCUMENTS, function (response) {
                $scope.ratingImageList = response.data;
            });
        }
        getSupplierRatingDocs();

        $scope.uploadPics = function (file) {
            const data = {
                'image': file,
                'is_video': $scope.media_type.is_video,
                'supplier_id': $scope.supplierId
            }
            console.log('hey!', data);
            services.POST_FORM_DATA(data, API.UPLOAD_SUPPLIER_DOCUMENTS, (response) => {
                if (response && response.data) {
                    $scope.product_images.file = "";
                    getSupplierRatingDocs();
                    return response.data;
                }
            })
        };

        $scope.file_to_upload_for_image = function (File) {
            var file = File[0];
            console.log('qwerty',$scope.media_type.is_video);
            if ($scope.media_type.is_video) {
                $scope.file_to_upload_for_doc(file);
                return false;
              }

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

        $scope.file_to_upload_for_doc = function (File) {
            if (['video/mp4', 'video/avi', 'video/wmv', 'video/mpeg'].includes(File.type)) {
              if ((File.size / Math.pow(1024, 2)) <= 10) {
                $scope.image_file = File;
                var Obj = {};
                Obj.image = File[0];
                let reader = new FileReader();
                reader.readAsDataURL(File);
                reader.onload = function (e) {
                    $scope.$apply(function () {
                        $scope.product_images.file = e.target.result;
                    });
                }
              } else {
                factories.invalidDataPop("Video size must be less than 10mb");
              }
            } else {
              factories.invalidDataPop("Invalid File Type, supported types: mp4, avi, wmv, mpeg");
            }
          };

        $scope.removeImage = function (id) {
            const data = {
                'id': id,
                'supplier_id': $scope.supplierId
            }
            services.POST_DATA(data, API.DELETE_SUPPLIER_DOCUMENTS, (response) => {
                if (response && response.data) {
                    getSupplierRatingDocs();
                    return response.data;
                }

            })
        }

        $scope.changeMediaType = function (type) {
            $scope.media_type.is_video = type;
            $scope.product_images.file = "";
          }

    }]);