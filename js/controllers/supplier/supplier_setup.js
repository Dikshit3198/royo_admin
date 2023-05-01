Royo.controller('SupplierProfileSetupCtrl', ['$scope', '$rootScope', 'services', 'factories', '$translate' ,'API', 'constants',
  function ($scope, $rootScope, services, factories, $translate, API, constants) {

    $scope.tab = 1;
    $scope.logo = '';
    $scope.cover_image = '';
    $scope.supplier_id = '';
    $scope.status = 0;
    $scope.message = '';
    $scope.cover_to_upload = '';
    $scope.is_multi_branch = 0;
    $scope.branch_id = 0;
    $scope.is_cover_video = false;
    $scope.dine_in = 0;
    $scope.is_scheduled = 0;
    $scope.documents = [];

    $scope.banner_images = [];

    $scope.is_add_more = false;


    $scope.resetPwd_obj = {
      password: '',
    }
    $scope.documentTypeArray = [];

    var getSupplierInfo = function () {
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.sectionId = 30;
      param_data.supplierId = $scope.supplier_id;

      services.POST_DATA(param_data, API.GET_SUPPLIER_INFO_TAB_DATA(), function (response) {
        let supplierData = response.data;
        $rootScope.supplierData = supplierData[0];
        $scope.is_multi_branch = supplierData[0].is_multibranch;
        $scope.branch_id = supplierData[0].default_branch_id;
        $scope.status = supplierData[0].is_active;
        $scope.logo = supplierData[0].logo;
        $scope.dine_in = supplierData[0].is_dine_in;
        $scope.is_scheduled = supplierData[0].is_scheduled;
        $scope.cover_image = supplierData[0].images[0] ? supplierData[0].images[0].image_path : '';

        supplierData[0].images.forEach((element, index) => {
          $scope.banner_images.push(element.image_path);
        });
        if ($scope.banner_images.length < 3) {
          $scope.is_add_more = true;
        }

        if ($scope.cover_image.split('.').pop() === 'mp4') {
          $scope.is_cover_video = true;
        } else {
          $scope.is_cover_video = false;
        }
        if (supplierData[0].documents) {
          $scope.documents = (supplierData[0].documents).split('#');

          $scope.documents.forEach(docs => {
            let name = '';
            name = factories.getFinalNameOfFile(docs);
            let urlType = docs.split('.').pop();

            if (['mp4', 'avi', 'wmv', 'mpeg'].includes(urlType)) {
              $scope.documentTypeArray.push({
                imageUrl: '',
                videoUrl: docs,
                name: name || ''
              })
            } else if (['pdf'].includes(urlType)) {
              $scope.documentTypeArray.push({
                imageUrl: '',
                videoUrl: '',
                url: docs,
                type: 2,
                name: name || ''
              })
            } else {
              $scope.documentTypeArray.push({
                imageUrl: docs,
                videoUrl: '',
                name: name || ''
              })
            }
          })
        }

        $rootScope.$broadcast('supplier_data', supplierData[0]);
        if (document.getElementById("cover_image")) {
          let cover_width = document.getElementById("cover_image").offsetWidth;
          let cover_height = cover_width * (1 / 6);
          document.getElementById("cover_image").style.height = `${cover_height}px`;
        }
      });
    }

    $scope.$on('is_multibranch', getBranchType);
    function getBranchType($event, data) {
      $scope.is_multi_branch = data;
    }

    $scope.$on('is_scheduled', getScheduled);
    function getScheduled($event, data) {
      $scope.is_scheduled = data;
    }

    $scope.$on('supplier_id', getSupplierData);
    function getSupplierData($event, data) {
      $scope.supplier_id = data.supplier_id;
      $scope.tab = data.tab;
      getSupplierInfo();
    }

    $scope.$on("fileSelected", function (event, args) {
      $scope.$apply(function () {
        $scope.files.push(args.file);
      });
    });

    $scope.file_to_upload_for_image = function (File) {
      var file = File[0];
      if (constants.IMAGE_TYPE.includes(file.type)) {
        if ((file.size / Math.pow(1024, 2)) <= 3) {
          var reader = new FileReader();
          reader.onload = function (event) {
            $scope.logo = event.target.result;
            $scope.$apply()
          }
          reader.readAsDataURL(File[0]);
          $scope.image_file = File[0];
          var imageType = /image.*/;
          if (!file.type.match(imageType)) {
            factories.invalidDataPop($translate.instant("Invalid file type selected"));
          } else {
            var data = {};
            data.accessToken = constants.ACCESSTOKEN;
            data.sectionId = 22;
            data.supplierId = $scope.supplier_id;
            data.deleteImage = $scope.logo ? JSON.stringify([1]) : JSON.stringify([]);
            data.logo = $scope.image_file;
            if ($rootScope.enable_updation_vendor_approval == 1 && $rootScope.profile == 'SUPPLIER') {
              $rootScope.supplierData['logo'] = data.logo;
              $rootScope.$broadcast('supplier_data', $rootScope.supplierData);
            }
            else {
              services.POST_FORM_DATA(data, API.UPLOAD_SUPPLIER_IMAGES(), function (response) {
                $scope.msg_txt = `${$translate.instant('Logo Image Updated Successfully')}`;
                services.SUCCESS_MODAL(true);
              });
            }
          }
        } else {
          factories.invalidDataPop($translate.instant("Image size must be less than 3mb"));
        }
      } else {
        factories.invalidDataPop($translate.instant("Invalid File Type"));
      }
    };

    $scope.uploadCoverImage = function () {
      var data = {};
      data.accessToken = constants.ACCESSTOKEN;
      data.sectionId = 22;
      data.supplierId = $scope.supplier_id;
      data.deleteImage = $scope.cover_image ? JSON.stringify([1]) : JSON.stringify([]);
      data.image1 = $scope.cover_image_file;
      services.POST_FORM_DATA(data, API.UPLOAD_SUPPLIER_IMAGES(), function (response) {
        $('#cover_image_modal').modal('hide');
        // $scope.cropper_web.destroy();
        $scope.cover_image = response.data[0].image;
        $scope.msg_txt = `${$translate.instant('Cover Image Updated Successfully')}`;
        services.SUCCESS_MODAL(true);
        $rootScope.supplierData['cover_image'] = $scope.cover_image;
        $rootScope.$broadcast('supplier_data', $rootScope.supplierData);
      });
    }




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

    $scope.file_to_upload_for_image_banners = function (File, index) {
      var file = File[0];
      if (constants.IMAGE_TYPE.includes(file.type)) {
        if ((file.size / Math.pow(1024, 2)) <= 1) {
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function (e) {
            $scope.$apply(function () {
              $scope.uploadImage(File[0], function (err, imageUrl) {
                if ($scope.banner_images[index]) {
                  $scope.banner_images[index] = imageUrl;
                }
                else {
                  $scope.banner_images.push(imageUrl);
                }
                if ($scope.banner_images.length >= 3) {
                  $scope.is_add_more = false;
                }
              })
            });
          }
        } else {
          factories.invalidDataPop($translate.instant("Image size must be less than 1mb"));
        }
      } else {
        factories.invalidDataPop($translate.instant("Invalid File Type"));
      }
    };

    $scope.openBannerImg = function () {
      $('#supplier_banner_images_ref').modal('show');
    }
    $scope.onAddNew = function () {
      $scope.is_add_more = true;
    }
    $scope.uploadBannerImg = function () {
      var data = {};
      data.accessToken = constants.ACCESSTOKEN;
      data.sectionId = 22;
      data.supplier_id = $scope.supplier_id;
      data.supplier_images = $scope.banner_images;
      services.POST_DATA(data, API.UPLOAD_SUPPLIER_COVER_IMAGES, function (response) {
        $('#supplier_banner_images_ref').modal('hide');
        $scope.msg_txt = `${$translate.instant('Banner Images Updated Successfully')}`;
        services.SUCCESS_MODAL(true);
      });
    }

    var webImageCropper = function (file) {
      setTimeout(() => {
        const image = document.getElementById('supp_cover_img');
        $scope.cropper_web = new Cropper(image, {
          aspectRatio: 6 / 1,
          viewMode: 2,
          minCropBoxHeight: 90,
          crop(event) {
            $scope.cropper_web.getCroppedCanvas({
              minWidth: 900,
              minHeight: 150,
              imageSmoothingQuality: 'high'
            }).toBlob((blob) => {
              $scope.$apply(function () {
                $scope.cover_image_file = new File([blob], file['name']);
              });
            })
          },
        });
      }, 400);
    }

    $scope.file_to_upload_for_sup_image = function (File) {
      // if ($scope.cover_to_upload) {
      //   $scope.$apply(function () {
      //     $scope.cover_to_upload = '';
      //     $scope.cover_image_file = '';
      //     $scope.cropper_web.clear();
      //   });
      // }
      var file = File[0];
      if (!file) return;
      if (constants.IMAGE_TYPE.includes(file.type)) {
        if ((file.size / Math.pow(1024, 2)) <= 3) {
          $scope.is_cover_video = false;

          $scope.cover_image_file = file;

          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function (e) {
            $scope.$apply(function () {
              $scope.cover_to_upload = e.target.result;
              $('#cover_image_modal').modal('show');
            });
            //   var image = new Image();
            //   image.src = e.target.result;
            //   image.onload = function () {
            //     if (image.height < 150 || image.width < 900) {
            //       $scope.cover_to_upload = '';
            //       $scope.cover_image_file = '';
            //       factories.invalidDataPop("Image dimensions must be atleast 900 X 150");
            //       return;
            //     } else {
            //       $('#cover_image_modal').modal('show');
            //       $scope.$apply(function () {
            //         $scope.cover_to_upload = e.target.result;
            //         webImageCropper(file);
            //       });
            //     }
            //   };
          }
        } else {
          factories.invalidDataPop($translate.instant("Image size must be less than 3mb"));
        }
      } else if (['video/mp4', 'video/avi', 'video/wmv', 'video/mpeg'].includes(file.type)) {
        if ((file.size / Math.pow(1024, 2)) <= 10) {
          $scope.is_cover_video = true;
          var data = {};
          data.accessToken = constants.ACCESSTOKEN;
          data.sectionId = 22;
          data.supplierId = $scope.supplier_id;
          data.deleteImage = $scope.cover_image ? JSON.stringify([1]) : JSON.stringify([]);
          data.image1 = file;
          services.POST_FORM_DATA(data, API.UPLOAD_SUPPLIER_IMAGES(), function (response) {
            if (response && response.data) {
              $scope.cover_image = response.data[0].image;
              $scope.msg_txt = `${$translate.instant('Cover Video Updated Successfully')}`;
              services.SUCCESS_MODAL(true);
            }
          });
        } else {
          factories.invalidDataPop($translate.instant("Image size must be less than 10mb"));
        }
      } else {
        factories.invalidDataPop($translate.includes("Invalid File Type, supported types: mp4, avi, wmv, mpeg"));
      }
    };

    $scope.closeModal = function () {
      // $scope.cropper_web.destroy();
    }

    $scope.activateRegSupplier = function (status) {
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.supplierId = $scope.supplier_id;
      param_data.authSectionId = 22;
      param_data.status = +(!status);

      services.POST_DATA(param_data, API.CHANGE_SUPPLIER_STATUS, function (response) {
        $scope.msg_txt = `${$translate.instant('Supplier')} ${!status ? $translate.instant('Unblocked') : $translate.instant('Blocked')} Successfully`;
        services.SUCCESS_MODAL(true);
        getSupplierInfo();
      });
    }

    $scope.stripeMerchantAccount = function () {
      if (factories.getSettings().key_value.create_stripe_connect_account) {
        const redirectUrl = factories.getSettings().key_value.create_stripe_connect_account + `&user_id=${$scope.supplier_id}&state=${$scope.supplier_id}-${localStorage.getItem('dbKey')}-1`;
        window.open(redirectUrl, '_blank');
      }
    }


    $scope.openResetPwd = function () {
      $scope.tab = 8;
      $("#supplier_reset_pwd").modal('show');
    }


    $scope.updateSupplierPwd = function (updatePwdForm) {
      if (updatePwdForm.$submitted && updatePwdForm.$invalid) return;
      var params = $scope.resetPwd_obj;
      params['supplier_id'] = $scope.supplier_id;
      services.POST_DATA(params, API.UPDATE_SUPPLIER_PWD, function (response) {
        $scope.resetPwd_obj.password = '';
        $("#supplier_reset_pwd").modal('hide');
        $scope.message = `${$translate.instant('Password has been changed')}`;
        services.SUCCESS_MODAL(true);
      });
    }

    $scope.downloadFile = (file) => {
      const a = document.createElement('a');
      document.body.appendChild(a);
      
      if (!!file.imageUrl)
        a.href = file.imageUrl;
      if (!!file.videoUrl)
        a.href = file.videoUrl;
      if (!!file.url && file.type == 2)
        a.href = file.url;
      // a.target = '_blank';
      a.setAttribute('style', 'display: none');
      a.download = `${file.name}`;
      a.click();
      document.body.removeChild(a);
    }


  }]);