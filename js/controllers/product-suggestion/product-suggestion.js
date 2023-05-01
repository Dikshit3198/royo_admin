Royo.controller('SupplierProductSuggestionsCtrl', ['$scope','$stateParams', 'services', 'factories', 'constants', '$rootScope', 'API', 'pagerService',
  function ($scope, $stateParams,services, factories, constants, $rootScope, API, pagerService) {

    $scope.supplier_id = $stateParams.id;
    $rootScope.$broadcast('supplier_id', { supplier_id: $scope.supplier_id, tab: $stateParams.tab });
    
    $scope.skip = 0;
    $scope.limit = 10;
    $scope.products = [];
    $scope.selected_product = [];
    $scope.suggestedProducts = [];

    $scope.selectedProducts = {};

    $scope.listFilterProducts = function (data) {
        $scope.selected_product_count = 0;
        var params = {};

        params.languageId = 14;
        params.latitude = 1;
        params.longitude = 1;

        // if ($rootScope.profile == 'SUPPLIER') {
            params.supplier_id = $scope.supplier_id;
        // }

        services.GET_DATA(params, API.PRODUCT_FILTERED_LIST, function (response) {
            let products = response.data.product;
            $scope.productList = [];

            products.forEach(col => {
                $scope.productList.push({
                    name: `<strong style='margin-top: 20px'>${col.sub_cat_name}</strong>`,
                    msGroup: true
                })

                col.value.forEach(val => {
                    let obj = {
                        id: val.product_id,
                        name: val.name,
                        img: `<img src='${val.image_path}'>`,
                        ticked: false
                    }

                    if($scope.suggestedProducts.includes(val.product_id)) {
                        obj.ticked = true;
                    }

                    $scope.productList.push(obj);
                })
                
                $scope.productList.push({
                    msGroup: false
                })
            })

        });
    };

    $scope.$on('supplier_data', getSupplierData);
    function getSupplierData($event, data) {
      if (!!data) {
        $scope.suggestedProducts = data.adrvtise_product ? JSON.parse(data.adrvtise_product) : [];
        $scope.listFilterProducts(1);
      }
    }
    

    $scope.assignInventory = function(){
        let products = [];
        if(!$scope.selectedProducts.length) {
            factories.invalidDataPop(`Please select atleast 1 ${factories.localisation().product}`);
            return false;
        }

        $scope.selectedProducts.forEach(prod=>{
            products.push(prod.id);
        })
        var param_data = {
            supplierId : $scope.supplier_id,
            productIds : products 
        };

        services.POST_DATA(param_data, API.ASSIGN_PRODUCT_SUGGESTION, function (response) {
            
            services.SUCCESS_MODAL(true);
          });
    }


}]);

