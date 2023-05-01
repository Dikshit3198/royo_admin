Royo.controller('uploadCSVCtrl', ['$scope', '$rootScope', '$modalInstance', 'services', 'factories', '$window',
  function ($scope, $rootScope, $modalInstance, services, factories, $window) {
    $scope.is_uploading = false;

    /* Get to be uploading file and set it into a variable and read to show it on view */
    $scope.file_to_upload_for_image = function (File) {
      $scope.FileUploaded = File[0];

      var file = File[0];
      $scope.image_file = File[0];
      var imageType = /text.csv/;
      // if (!file.type.match(imageType)) {
      //
      //     factories.invalidDataPop("Invalid file type selected");
      // }
    };

    $scope.ok = function (stat) {
      $scope.is_loader = 1;

      if (stat == 2) {

        var param_data = {};
        param_data.imagePath = $scope.image_file;
        param_data.cat = $rootScope.catID;
        param_data.subcat = $rootScope.subCatID;
        param_data.detSubcat = $rootScope.detSubCatID;
        services.CSVPricingUpload($scope, param_data, function (data) {
          $scope.is_loader = 0;
          angular.element("input[type='file']").val(null);
          $scope.is_uploading = true;
          factories.successActionPop(data.message);
          $window.location.reload();
        });
      } else {

        var param_data = {};
        param_data.fileName = $scope.image_file;
        param_data.cat = $rootScope.catID;
        param_data.subcat = $rootScope.subCatID;
        param_data.detSubcat = $rootScope.detSubCatID;
        services.CSVProductUpload($scope, param_data, function (data) {
          $scope.is_loader = 0;
          angular.element("input[type='file']").val(null);
          $scope.is_uploading = true;
          factories.successActionPop(data.message);
          $window.location.reload();
        });
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }]);

/**
 * uploadSupplierCSVCtrl - Upload Supplier CSV Controller
 */
Royo.controller('uploadSupplierCSVCtrl', ['$scope', '$rootScope', '$modalInstance', 'services', 'factories', '$window', '$stateParams',
  function ($scope, $rootScope, $modalInstance, services, factories, $window, $stateParams) {

    /* Get to be uploading file and set it into a variable and read to show it on view */
    $scope.file_to_upload_for_image = function (File) {
      $scope.FileUploaded = File[0];

      var file = File[0];
      $scope.image_file = File[0];
      var imageType = /text.csv/;
      // if (!file.type.match(imageType)) {
      //
      //     factories.invalidDataPop("Invalid file type selected");
      // }
    };

    $scope.ok = function (stat) {

      if (stat == 2) {

        var param_data = {};
        param_data.fileName = $scope.image_file;
        param_data.cat = $rootScope.catID;
        param_data.subcat = $rootScope.subCatID;
        param_data.detSubcat = $rootScope.detSubCatID;
        param_data.supplier_id = $stateParams.id;
        services.CSVSupplierPricingUpload($scope, param_data, function (data) {
          angular.element("input[type='file']").val(null);
          factories.successActionPop(data.message);
          $window.location.reload();
        });
      } else {

        var param_data = {};
        param_data.fileName = $scope.image_file;
        param_data.cat = $rootScope.catID;
        param_data.subcat = $rootScope.subCatID;
        param_data.detSubcat = $rootScope.detSubCatID;
        param_data.supplier_id = $stateParams.id;
        services.CSVSupplierProductUpload($scope, param_data, function (data) {
          angular.element("input[type='file']").val(null);
          factories.successActionPop(data.message);
          $window.location.reload();
        });
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }]);
