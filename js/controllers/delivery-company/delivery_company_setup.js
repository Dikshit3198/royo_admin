Royo.controller('DeliveryCompanyProfileSetupCtrl', ['$scope', '$rootScope', 'services', 'factories', 'API', 'constants',
  function ($scope, $rootScope, services, factories, API, constants) {

    $scope.tab = 1;
    $scope.logo = '';
    $scope.cover_image = '';
    $scope.company_id = '';
    $scope.status = 0;
    $scope.message = '';
    $scope.cover_to_upload = '';
    $scope.is_multi_branch = 0;
    $scope.branch_id = 0;
    $scope.is_cover_video = false;
    $scope.dine_in = 0;
    $scope.is_scheduled = 0;
    $scope.documents = [];

    $scope.resetPwd_obj = {
      password: '',
    }

    var getCompanyInfo = function () {
      var param_data = {};
    //   param_data.accessToken = constants.ACCESSTOKEN;
    //   param_data.sectionId = 30;
    //   param_data.supplierId = $scope.company_id;
      param_data.delivery_company_id = $scope.company_id;

      services.GET_DATA(param_data, API.GET_DELIVERY_COMPANY_INFO(), function (response) {
        let companyData = response.data;
        $rootScope.companyData = companyData;
        $scope.status = companyData.is_block;
        // $scope.logo = companyData[0].logo;
        // $scope.is_scheduled = companyData[0].is_scheduled;
        // $scope.cover_image = companyData[0].images[0] ? companyData[0].images[0].image_path : '';
        // if ($scope.cover_image.split('.').pop() === 'mp4') {
        //   $scope.is_cover_video = true;
        // } else {
        //   $scope.is_cover_video = false;
        // }
        if (companyData.documents) {
          $scope.documents = (companyData.documents).split('#');
        }
        $rootScope.$broadcast('company_data', companyData);
        // if (document.getElementById("cover_image")) {
        //   let cover_width = document.getElementById("cover_image").offsetWidth;
        //   let cover_height = cover_width * (1 / 6);
        //   document.getElementById("cover_image").style.height = `${cover_height}px`;
        // }
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

    $scope.$on('company_id', getCompanyData);
    function getCompanyData($event, data) {
      $scope.company_id = data.company_id;
      $scope.tab = data.tab;
      getCompanyInfo();
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
            factories.invalidDataPop("Invalid file type selected");
          } else {
            var data = {};
            data.accessToken = constants.ACCESSTOKEN;
            data.sectionId = 22;
            data.supplierId = $scope.company_id;
            data.deleteImage = $scope.logo ? JSON.stringify([1]) : JSON.stringify([]);
            data.logo = $scope.image_file;
            services.POST_FORM_DATA(data, API.UPLOAD_SUPPLIER_IMAGES(), function (response) {
              $scope.msg_txt = 'Logo Image Updated Successfully';
              services.SUCCESS_MODAL(true);
            });
          }
        } else {
          factories.invalidDataPop("Image size must be less than 3mb");
        }
      } else {
        factories.invalidDataPop("Invalid File Type");
      }
    };

    $scope.uploadCoverImage = function () {
      var data = {};
      data.accessToken = constants.ACCESSTOKEN;
      data.sectionId = 22;
      data.supplierId = $scope.company_id;
      data.deleteImage = $scope.cover_image ? JSON.stringify([1]) : JSON.stringify([]);
      data.image1 = $scope.cover_image_file;
      services.POST_FORM_DATA(data, API.UPLOAD_SUPPLIER_IMAGES(), function (response) {
        $('#cover_image_modal').modal('hide');
        // $scope.cropper_web.destroy();
        $scope.cover_image = response.data[0].image;
        $scope.msg_txt = 'Cover Image Updated Successfully';
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
          factories.invalidDataPop("Image size must be less than 3mb");
        }
      } else if (['video/mp4', 'video/avi', 'video/wmv', 'video/mpeg'].includes(file.type)) {
        if ((file.size / Math.pow(1024, 2)) <= 10) {
          $scope.is_cover_video = true;
          var data = {};
          data.accessToken = constants.ACCESSTOKEN;
          data.sectionId = 22;
          data.supplierId = $scope.company_id;
          data.deleteImage = $scope.cover_image ? JSON.stringify([1]) : JSON.stringify([]);
          data.image1 = file;
          services.POST_FORM_DATA(data, API.UPLOAD_SUPPLIER_IMAGES(), function (response) {
            if (response && response.data) {
              $scope.cover_image = response.data[0].image;
              $scope.msg_txt = 'Cover Video Updated Successfully';
              services.SUCCESS_MODAL(true);
            }
          });
        } else {
          factories.invalidDataPop("Image size must be less than 10mb");
        }
      } else {
        factories.invalidDataPop("Invalid File Type, supported types: mp4, avi, wmv, mpeg");
      }
    };

    $scope.closeModal = function () {
      $scope.cropper_web.destroy();
    }

    $scope.activateCompany = function (status) {
      var param_data = {};
      param_data.id = $scope.company_id;
      param_data.is_block = +status;
      
      services.POST_DATA(param_data, API.BLOCK_DELIVERY_COMPANY, function (response) {
        $scope.msg_txt = `${factories.localisation().delivery_company} ${!status ? 'Unblocked' : 'Blocked'} Successfully`;
        services.SUCCESS_MODAL(true);
        getCompanyInfo();
      });
    }

    $scope.stripeMerchantAccount = function () {
      if (factories.getSettings().key_value.create_stripe_connect_account) {
        const redirectUrl = factories.getSettings().key_value.create_stripe_connect_account + `&user_id=${$scope.company_id}&state=${$scope.company_id}-${localStorage.getItem('dbKey')}-1`;
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
      params['company_id'] = $scope.company_id;
      services.POST_DATA(params, API.UPDATE_SUPPLIER_PWD, function (response) {
        $scope.resetPwd_obj.password = '';
        $("#supplier_reset_pwd").modal('hide');
        $scope.message = 'Password has been changed';
        services.SUCCESS_MODAL(true);
      });
    }

  }]);