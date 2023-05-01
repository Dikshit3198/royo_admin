Royo.controller('BannersCtrl', ['$scope', 'services', 'factories', 'constants', '$rootScope', '$translate', 'API', 'pagerService',
  function ($scope, services, factories, constants, $rootScope, $translate, API, pagerService) {

    $scope.is_add = false;
    $scope.suppliers = [];
    $scope.categories = [];
    $scope.branches = [];
    $scope.banners = [];
    $scope.selected_supplier_count = 0;
    $scope.check_all = false;
    $scope.redirection_type = 1;
    $scope.banner = {
      name: '',
      name_other: '',
      order: 1,
      website_image: '',
      phone_image: '',
      start_date: '',
      end_date: '',
      isBottom: 0,
    }
    $scope.selected_category = '';
    $scope.selected_supplier = '';
    $scope.selected_branch = '';
    $scope.website_image = null;
    $scope.phone_image = null;
    $scope.is_edit = false;
    $scope.banner_id = '';
    $scope.search = '';
    $scope.message = '';
    $scope.dataLoaded = false;
    $scope.validity = '';
    $scope.count = 0;
    $scope.skip = 0;
    $scope.limit = 12;
    $scope.currentPage = 1;
    $scope.banner_validity = 0;

    $scope.is_default_banners = false;
    $scope.defaultBanners = [];
    $scope.selected_default_banner = '';
    $scope.default_banner_image = '';

    $scope.changeRedirection = function (type) {
      $scope.banner.flow_banner_type = type;
    }

    $scope.changeBannerType = function (type) {
      $scope.banner.is_video = type;
    }

    $scope.banner_limit = 0;
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


    var datepicker = function () {
      setTimeout(() => {
        const picker = new Lightpick({
          field: document.getElementById("datepicker"),
          singleDate: false,
          minDate: new Date(),
          format: 'DD.MM.YYYY',
          repick: true,
          startDate: $scope.is_edit ? moment($scope.banner.start_date) : '',
          endDate: $scope.is_edit ? moment($scope.banner.end_date) : '',
          onSelect: function (start, end) {
            if (start && end) {
              $scope.banner.start_date = start.format('YYYY-MM-DD');
              $scope.banner.end_date = end.format('YYYY-MM-DD');
              $scope.validity = `${start.format('DD.MM.YYYY')} - ${end.format('DD.MM.YYYY')}`;
              $scope.$apply();
            }
          }
        });
      }, 500);
    }

    var webImageCropper = function (file) {
      setTimeout(() => {
        const image = document.getElementById('web_image');
        $scope.cropper_web = new Cropper(image, {
          aspectRatio: 4 / 1,
          viewMode: 2,
          minCropBoxHeight: 150,
          crop(event) {
            $scope.cropper_web.getCroppedCanvas({
              minWidth: 900,
              minHeight: 225,
              imageSmoothingQuality: 'high'
            }).toBlob((blob) => {
              $scope.$apply(function () {
                $scope.banner.website_image = new File([blob], file['name']);
              });
            })
          },
        });
      }, 500);
    }

    $scope.chooseWebBanner = function () {
      $('#web_banner_input').trigger('click');
    }

    var appImageCropper = function (file) {
      let aspect_ratio = '4/2';
      let cropper_dimensions = {
        minWidth: 400,
        minHeight: 200,
        maxWidth: 800,
        maxHeight: 400,
        imageSmoothingQuality: 'high'
      }
      if ($rootScope.app_banner_width == 1 && $rootScope.app_type == 1) {
        aspect_ratio = '0.9/1';
        cropper_dimensions.minWidth = 132;
        cropper_dimensions.minHeight = 146;
        cropper_dimensions.maxWidth = 500;
        cropper_dimensions.maxHeight = 555;
      }
      setTimeout(() => {
        const image = document.getElementById('app_image');
        $scope.cropper_app = new Cropper(image, {
          aspectRatio: aspect_ratio,
          viewMode: 2,
          minCropBoxHeight: 120,
          crop(event) {
            $scope.cropper_app.getCroppedCanvas(cropper_dimensions).toBlob((blob) => {
              $scope.$apply(function () {
                $scope.banner.phone_image = new File([blob], file['name']);
              });
            })
          },
        });
      }, 500);
    }

    $scope.chooseAppBanner = function () {
      $('#app_banner_input').trigger('click');
    }

    var clearInputs = function () {
      $scope.banner = {
        name: '',
        name_other: '',
        order: '',
        website_image: '',
        phone_image: '',
        start_date: '',
        end_date: '',
        isBottom: 0,
        flow_banner_type: 2,
        is_video: 0,
      }
      $scope.website_image = null;
      $scope.phone_image = null;
      $scope.validity = '';
      $scope.redirection_type = 1;
    }

    $scope.changeView = function (val) {
      $scope.is_add = val;
      $scope.is_edit = false;
      if (val) {
        $scope.banner_validity = 0;
        clearInputs();
      }
    }

    $scope.editBanner = function (banner) {
      $scope.selected_banner = banner;
      $scope.is_add = true;
      $scope.is_edit = true;
      $scope.banner_id = banner.id;
      $scope.banner = {
        name: banner.names[0] ? banner.names[0].name : '',
        name_other: banner.names[1] ? banner.names[1].name : '',
        order: 1,
        website_image: banner.website_image,
        phone_image: banner.phone_image,
        flow_banner_type: banner.flow_banner_type,
        is_video: banner.is_video,
        start_date: moment(banner.start_date).format('YYYY-MM-DD'),
        end_date: moment(banner.end_date).format('YYYY-MM-DD'),
        isBottom: banner.is_bottom,
      }
      $scope.phone_image = !banner.is_video ? banner.phone_image : banner.phone_video;
      $scope.website_image = !banner.is_video ? banner.website_image : banner.website_video;


      if ($rootScope.profile == 'ADMIN') {
        $scope.selected_supplier = $scope.suppliers.find(supp => supp.id == banner.supplier_id);
      } else {
        $scope.selected_supplier = { id: $rootScope.active_supplier_id }
      }
      $scope.validity = `${moment(banner.start_date).format('DD.MM.YYYY')} - ${moment(banner.end_date).format('DD.MM.YYYY')}`;
      if (banner.start_date && banner.start_date != '0000-00-00 00:00:00' && banner.end_date && banner.end_date != '0000-00-00 00:00:00') {
        $scope.banner_validity = 1;
        datepicker();
      } else {
        $scope.banner_validity = 0;
      }

      $scope.changeSupplier($scope.selected_supplier);
    }

    var getCategoryData = function (Id) {
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.sectionId = 30;
      param_data.supplierId = Id;

      services.POST_DATA(param_data, API.LIST_SUPPLIER_CATEGORIES(), function (response) {
        let categoryData = response.data;
        $scope.categories = categoryData;
        if ($scope.is_edit) {
          $scope.selected_category = $scope.categories.find(cat => cat.category_id == $scope.selected_banner.category_id);
        } else {
          $scope.selected_category = categoryData[0];
        }
      });
    };

    var getSupplierBranch = function (Id) {
      var param = {};
      param.accessToken = constants.ACCESSTOKEN;
      param.sectionId = 31;
      param.supplierId = Id;

      services.POST_DATA(param, API.LIST_BRANCHES(), function (response) {
        let branchData = response.data;
        if ($scope.selected_supplier.is_multibranch == 1) {
          $scope.branches = branchData;
        } else {
          $scope.branches = [branchData[0]];
        }
        if ($scope.is_edit) {
          let selected_branch = $scope.branches.find(branch => branch.id == $scope.selected_banner.branch_id);
          $scope.selected_branch = selected_branch ? selected_branch : branchData[0];
        } else {
          $scope.selected_branch = branchData[0];
        }
      });
    }

    //Call Get Home Page Data Service
    var getHomeData = function () {
      let params = {
        limit: 0,
        offset: 0,
        is_active: 1,
        search: '',
        is_desc: 0,
        order_by: 0
      }

      if (!!localStorage.getItem('data_country')) {
        let country_data = localStorage.getItem('data_country').split(',');
        params.country_code = country_data[0];
        params.country_code_type = country_data[1];
      }

      services.GET_DATA(params, API.SUPPLIER_LIST, function (response) {
        $scope.suppliers = response.data.suppliersList;
        $scope.selected_supplier = $scope.suppliers[0];
        getCategoryData($scope.suppliers[0].id);
        getSupplierBranch($scope.suppliers[0].id);
      });
    };

    if ($rootScope.profile == 'ADMIN') {
      getHomeData();
    } else {
      getCategoryData($scope.active_supplier_id);
      getSupplierBranch($scope.active_supplier_id);
    }

    $scope.changeSupplier = function (val) {
      $scope.selected_supplier = val;
      getCategoryData(val.id);
      getSupplierBranch(val.id)
    };

    $scope.changeBranch = function (val) {
      $scope.selected_branch = val;
    };

    $scope.changeCat = function (val) {
      $scope.selected_category = val;
    };

    $scope.changeBannerPosition = function (isBottom) {
      $scope.banner.isBottom = isBottom;
    }

    var getBanners = function (page) {
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.sectionId = 33;
      param_data.advertisementType = 0;
      param_data.offset = $scope.skip;
      param_data.limit = $scope.limit;
      param_data.search = ($scope.search).trim() ? $scope.search : '';

      if ($rootScope.profile == 'SUPPLIER') {
        param_data['supplier_id'] = $rootScope.active_supplier_id;
      }

      $scope.dataLoaded = false;

      services.POST_DATA(param_data, API.GET_BANNER(), function (response) {
        $scope.banners = response.data.list;
        let lang_index = localStorage.getItem('lang') != 'en' ? 1 : 0;
        $scope.banners.map(banner => {
          banner.name = banner.names.length ? banner.names[lang_index].name : banner.name;
        });
        $scope.count = response.data.count;
        $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
        $scope.dataLoaded = true;
        if (localStorage.getItem('banner_limit')) {
          $scope.banner_limit = (Number)(localStorage.getItem('banner_limit'));
        }
      });
    }
    getBanners(1);

    $scope.$on("fileSelected", function (event, args) {
      $scope.$apply(function () {
        $scope.files.push(args.file);
      });
    });

    /* Get to be uploading file and set it into a variable and read to show it on view */
    $scope.file_to_upload_for_image_web = function (File) {

      // if ($scope.banner.website_image) {
      //   $scope.$apply(function () {
      //     $scope.website_image = '';
      //     $scope.banner.website_image = '';
      //     $scope.cropper_web.clear();
      //   });
      // }
      var file = File[0];
      if (!file) return;

      if ($scope.banner.is_video) {
        $scope.file_to_upload_for_doc(file, 1);
        return false;
      }
      if (constants.IMAGE_TYPE.includes(file.type)) {
        if ((file.size / Math.pow(1024, 2)) <= 2) {
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function (e) {
            $scope.$apply(function () {
              $scope.website_image = e.target.result;
              $scope.banner.website_image = file;
              // setTimeout(() => {
              //   let myImg = document.querySelector("#web_image");
              //   let realWidth = myImg.naturalWidth;
              //   let realHeight = myImg.naturalHeight;
              //   if (realHeight < 225 || realWidth < 900) {
              //     $scope.$apply(function () {
              //       $scope.website_image = '';
              //       $scope.banner.website_image = '';
              //     });
              //     factories.invalidDataPop("Please choose image with correct dimensions");
              //     return;
              //   } else {
              //     webImageCropper(file);
              //   }
              // }, 200);
            });
          }
        } else {
          factories.invalidDataPop($translate.instant('Image size must be less than 2mb'));
        }
      } else {
        factories.invalidDataPop($translate.instant('Invalid File Type'));
      }
    };

    $scope.file_to_upload_for_doc = function (File, type) {
      if (['video/mp4', 'video/avi', 'video/wmv', 'video/mpeg'].includes(File.type)) {
        if ((File.size / Math.pow(1024, 2)) <= 10) {

          const data = {
            'file': File
          }

          services.POST_FORM_DATA(data, API.UPLOAD_IMAGE, (response) => {
            if (response && response.data) {
              console.log('dcfdc', response.data);
              if (type == 1) {
                $scope.website_image = response.data;
                $scope.banner.website_image = response.data;
              } else {
                $scope.phone_image = response.data
                $scope.banner.phone_image = response.data
              }
              // return callback(null, response.data)
            }
          })
        } else {
          factories.invalidDataPop($translate.instant("Image size must be less than 10mb"));
        }
      } else {
        factories.invalidDataPop($translate.instant("Invalid File Type, supported types: mp4, avi, wmv, mpeg"));
      }
    };

    /* Get to be uploading file and set it into a variable and read to show it on view */
    $scope.file_to_upload_for_image_phone = function (File) {
      // if ($scope.banner.phone_image) {
      //   $scope.$apply(function () {
      //     $scope.phone_image = '';
      //     $scope.banner.phone_image = '';
      //     $scope.cropper_app.clear();
      //   });
      // }
      var file = File[0];
      if (!file) return;

      if ($scope.banner.is_video) {
        $scope.file_to_upload_for_doc(file, 2);
        return false;
      }

      if (constants.IMAGE_TYPE.includes(file.type)) {
        if ((file.size / Math.pow(1024, 2)) <= 1) {
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function (e) {
            $scope.$apply(function () {
              $scope.phone_image = e.target.result;
              $scope.banner.phone_image = file;
              // setTimeout(() => {
              //   let myImg = document.querySelector("#app_image");
              //   let realWidth = myImg.naturalWidth;
              //   let realHeight = myImg.naturalHeight;
              //   let wd = 400;
              //   let ht = 200;
              //   if ($rootScope.app_banner_width == 1 && $rootScope.app_type == 1) {
              //     ht = 132;
              //     wd = 146
              //   }
              //   if (realHeight < ht || realWidth < wd) {
              //     $scope.$apply(function () {
              //       $scope.phone_image = '';
              //       $scope.banner.phone_image = '';
              //     });
              //     factories.invalidDataPop("Please choose image with correct dimensions");
              //     return;
              //   } else {
              //     appImageCropper(file);
              //   }
              // }, 200);
            });
          }
        } else {
          factories.invalidDataPop($translate.instant("Image size must be less than 1mb"));
        }
      } else {
        factories.invalidDataPop($translate.instant("Invalid File Type"));
      }
    };

    var afterSubmit = function (is_edit) {
      $scope.is_add = false;
      $scope.currentPage = 1;
      $scope.skip = 0;
      getBanners(1);
      $scope.message = `${$translate.instant('Banner')} ${is_edit ? $translate.instant('updated') : $translate.instant('created')} ${$translate.instant('Successfully')}`;
      services.SUCCESS_MODAL(true);
    }

    $scope.submitBannerAd = function (addBannerForm) {
      if (addBannerForm.$submitted && (addBannerForm.$invalid || ((!$scope.banner.start_date || !$scope.banner.end_date) && $scope.banner_validity == 1))) {
        return;
      }

      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.sectionId = 33;
      param_data.supplierId = $rootScope.is_single_vendor == 1 ? $rootScope.single_vendor_id : $scope.selected_supplier.id;
      param_data.categoryId = $scope.selected_category.category_id;
      param_data.branch_id = $rootScope.is_multiple_branch == 1 ? $scope.selected_branch.id : $rootScope.supplier_branch_id;
      param_data.name = `${$scope.banner.name}#${$scope.banner.name_other ? $scope.banner.name_other : $scope.banner.name}`;
      param_data.languageId = '14#15';
      param_data.order = $scope.banner.order;

      if (!$scope.banner.is_video) {
        param_data.phone_image = $scope.banner.phone_image;
        param_data.website_image = $scope.banner.website_image;
      } else {
        param_data.phone_video = $scope.banner.phone_image;
        param_data.website_video = $scope.banner.website_image;
        // param_data.phone_image = null;
        // param_data.website_image = null;
      }
      param_data.startDate = $scope.banner.start_date;
      param_data.endDate = $scope.banner.end_date;
      param_data.flow_banner_type = $scope.banner.flow_banner_type;

      param_data.is_video = $scope.banner.is_video;
      param_data.activeStatus = 1;
      param_data.isBottom = $scope.banner.isBottom;


      if ($rootScope.profile == 'SUPPLIER') {
        param_data.supplierId = $rootScope.active_supplier_id;
      }

      if ($scope.is_edit) {
        param_data.banner_id = $scope.banner_id;
        services.POST_FORM_DATA(param_data, API.EDIT_BANNER(), function (response) {
          afterSubmit(true);
        });
      } else {
        services.POST_FORM_DATA(param_data, API.ADD_BANNER(), function (response) {
          afterSubmit(false);
        });
      }
    };

    $scope.delete = function (banner) {
      services.CONFIRM(`You want to delete this banner`,
        function (isConfirm) {
          if (isConfirm) {
            let param_data = {};
            param_data.accessToken = constants.ACCESSTOKEN;
            param_data.sectionId = 33;
            param_data.id = banner.id;

            services.POST_DATA(param_data, API.DELETE_BANNER(), function (response) {
              $scope.message = `${$translate.instant('Banner has been deleted succeffully')}`;
              $scope.currentPage = 1;
              $scope.skip = 0;
              getBanners(1);
              services.SUCCESS_MODAL(true);
            });
          }
        });
    }

    $scope.setPage = function (page) {
      if ($scope.currentPage !== page) {
        $scope.currentPage = page;
        $scope.skip = $scope.limit * (page - 1);
        getBanners(page);
      }
    }

    $scope.searchBanner = function (keyEvent) {
      if (keyEvent.which === 13) {
        $scope.search = keyEvent.target.value;
        $scope.skip = 0;
        getBanners(1);
      }
    }

    $scope.viewDefault = function () {
      $scope.is_default_banners = !$scope.is_default_banners;
      if ($scope.is_default_banners) {
        getDefaultBanners();
      } else {
        $scope.currentPage = 1;
        $scope.skip = 0;
        getBanners(1);
      }
    }

    var getDefaultBanners = function () {
      $scope.defaultBanners = [];
      let key_value = factories.getSettings().key_value;
      if (key_value) {
        let banners = {
          banner_one: key_value.banner_one,
          banner_two: key_value.banner_two,
          banner_three: key_value.banner_three,
          banner_four: key_value.banner_four,
          banner_five: key_value.banner_five || '',
          banner_six: key_value.banner_six || '',
          banner_seven: key_value.banner_seven || '',
          banner_eight: key_value.banner_eight || '',
          banner_nine: key_value.banner_nine || '',
          banner_ten: key_value.banner_ten || '',

        }

        Object.keys(banners).forEach(key => {
          $scope.defaultBanners.push({
            key: key,
            value: banners[key],
            file: ''
          });
        });
      }
    }

    $scope.selectDefaultBanner = function (banner) {
      $scope.selected_default_banner = banner;
    }

    $scope.editDefaultBanner = function () {
      let payload = {};
      payload[$scope.selected_default_banner.key] = $scope.selected_default_banner.file;
      services.POST_FORM_DATA(payload, API.UPDATE_DEFAULT_BANNER, function (response) {
        let localSettings = localStorage.getItem('settings_data') ? JSON.parse(localStorage.getItem('settings_data')) : '';
        if (localSettings && localSettings.key_value) {
          (localSettings.key_value)[$scope.selected_default_banner.key] = response.data.banner_link;
          localStorage.setItem('settings_data', JSON.stringify(localSettings));
          getDefaultBanners();
        }
        $("#updateDefaultBanner").modal('hide');
        $scope.message = `${$translate.instant('Banner has been updated succeffully')}`;
        services.SUCCESS_MODAL(true);
      });
    }

    $scope.file_to_upload_for_default_banner = function (File) {
      var file = File[0];
      if (constants.IMAGE_TYPE.includes(file.type)) {
        if ((file.size / Math.pow(1024, 2)) <= 5) {
          $scope.selected_default_banner.file = File[0];
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function (e) {
            $scope.$apply(function () {
              $scope.default_banner_image = e.target.result;
              $("#updateDefaultBanner").modal('show');
            });
          }
        } else {
          factories.invalidDataPop($translate.instant("Image size must be less than 5mb"));
        }
      } else {
        factories.invalidDataPop($translate.instant("Invalid File Type"));
      }
    }

    $scope.changeValidity = function (banner_validity) {
      // $scope.banner_validity = banner_validity;
      // if ($scope.banner_validity == 0) {
      //   // $scope.banner.start_date = moment(new Date()).format("YYYY-MM-DD");
      //   // var endDate = new Date().setDate(new Date().getDate() + 10000);
      //   // $scope.banner.end_date = moment(endDate).format("YYYY-MM-DD")
      //   // $scope.validity = '';

      //   // changes for banner with no validity
      //   $scope.banner.start_date = '0000-00-00 00:00:00'; // moment(new Date()).format("YYYY-MM-DD");
      //   // var endDate = new Date().setDate(new Date().getDate() + 10000);
      //   $scope.banner.end_date = '0000-00-00 00:00:00'; // moment(endDate).format("YYYY-MM-DD")
      //   $scope.validity = '';
      //   console.log('banner', $scope.banner);
      // } else {
      //   datepicker();
      // }
      $scope.banner_validity = banner_validity;
      if ($scope.banner_validity == 0) {
        $scope.banner.start_date = moment(new Date()).format("YYYY-MM-DD");
        var endDate = new Date().setDate(new Date().getDate() + 10000);
        $scope.banner.end_date = moment(endDate).format("YYYY-MM-DD")
        $scope.validity = '';
      } else {
        $scope.validity = `${moment($scope.banner.start_date).format('DD.MM.YYYY')} - ${moment($scope.banner.end_date).format('DD.MM.YYYY')}`;
        datepicker();
      }
    }

  }]);
