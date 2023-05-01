Royo.controller('BrandsCtrl', ['$scope', 'services', 'factories', 'API', 'constants',
  function ($scope, services, factories, API, constants) {

    $scope.files = [];
    $scope.image_file;
    $scope.icon_file;
    $scope.brandData = {
      name: {14: '', 15: ''},
      description: ''
    };
    $scope.is_grid = 1;
    $scope.brands = [];
    $scope.search = '';
    $scope.dataLoaded = false;
    $scope.brand_img = '';
    $scope.is_edit = false;
    $scope.message = '';

    var getBrands = function () {
      let param_data = {};
      param_data.sectionId = 62;
      param_data.offset = 0;
      param_data.limit = 20;

      $scope.dataLoaded = false;
      services.GET_DATA(param_data, API.GET_BRANDS(), function (response) {
        if (response.data.length > 0) {
          $scope.count = response.data.length;
          $scope.brands = response.data;
          $scope.brands.map(brand => {
            (brand.name).forEach(el => {
              if (el.language_id == 14) {
                brand['name_en'] = el.name;
              } else if (el.language_id == 15) {
                brand['name_ar'] = el.name;
              }
            });
          });
        }
        $scope.dataLoaded = true;
      });
    }
    getBrands();

    $scope.refresh = function () {
      getBrands();
    }

    $scope.add = function () {
      $scope.is_edit = false;
      $scope.brandData = {
        name: {14: '', 15: ''},
        description: ''
      };
      $scope.brand_img = '';
    }

    $scope.$on("fileSelected", function (event, args) {
      $scope.$apply(function () {
        $scope.files.push(args.file);
      });
    });

    $scope.file_to_upload_for_image = function (File) {
      $scope.FileUploaded = File[0];
      var file = File[0];
      if (constants.IMAGE_TYPE.includes(file.type)) {
        if ((file.size / Math.pow(1024, 2)) <= 3) {
          $scope.image_file = File[0];
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function (e) {
            $scope.$apply(function () {
              $scope.brand_img = e.target.result;
            });
          }
        } else {
          factories.invalidDataPop("Image size must be less than 3mb");
        }
      } else {
        factories.invalidDataPop("Invalid File Type");
      }
    };

    var afterSubmit = function () {
      getBrands();
      document.getElementById('closeBrandModal').click();
      $scope.message = `${factories.localisation().brand} has been ${$scope.is_edit ? 'updated' : 'added'}`;
      services.SUCCESS_MODAL(true);
    }

    $scope.submitAdd = function (addBrandsForm) {
      if (addBrandsForm.$submitted && addBrandsForm.$invalid) return;
      let param_data = {};
      Object.keys($scope.brandData).forEach(key => {
        let langArr = [];
        let inputObj = $scope.brandData[key];
        inputObj['15'] = inputObj['15'] ? inputObj['15'] : inputObj['14'];
        Object.keys(inputObj).forEach(langId => {
          langArr.push({
            name: inputObj[langId],
            language_id: langId
          });
          param_data[key] = JSON.stringify(langArr);
        });
      });
      delete param_data['description'];
      param_data['file'] = $scope.image_file;
      param_data['sectionId'] = 62;

      if ($scope.is_edit) {
        param_data['id'] = $scope.brand_id;
        services.PUT_FORM_DATA(param_data, API.EDIT_BRANDS, function (response) {
          afterSubmit();
        })
      } else {
        services.POST_FORM_DATA(param_data, API.ADD_BRANDS, function (response) {
          afterSubmit();
        })
      }
    }

    $scope.edit = function (brand) {
      $scope.is_edit = true;
      $scope.brand_img = brand.image;
      $scope.brandData.name = {};
      $scope.brand_id = brand.id;
      $scope.image_file = brand.image;
      (brand.name).forEach(brand => {
        $scope.brandData.name[brand.language_id] = brand.name;
      });
    }

    $scope.deleteBrand = function (brand) {
      services.CONFIRM(`You want to delete this brand`,
        function (isConfirm) {
          if (isConfirm) {
            let param_data = {};
            param_data.sectionId = 62;
            param_data.id = brand.id;
            services.PUT_FORM_DATA(param_data, API.DELETE_BRAND, function (response) {
              $scope.message = `${factories.localisation().brand} has been deleted`;
              services.SUCCESS_MODAL(true);
              getBrands();
            });
          }
        });
    }

  }]);