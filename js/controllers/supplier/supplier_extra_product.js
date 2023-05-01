Royo.controller('SupplierInventoryCtrl', ['$scope','$stateParams', 'services', 'factories', 'constants', '$rootScope', 'API', 'pagerService',
  function ($scope, $stateParams,services, factories, constants, $rootScope, API, pagerService) {

    $scope.supplier_id = $stateParams.id;
    $rootScope.$broadcast('supplier_id', { supplier_id: $scope.supplier_id, tab: $stateParams.tab });
    $scope.limit = 10;
    $scope.products = [];
    $scope.selected_product = [];
    $scope.supplierData = {};

    $scope.getExtraProductList = function (page) {
        let param_data = {};
        param_data.offset = 0;
        param_data.limit = 500;
        param_data.id = $scope.supplier_id;

        services.GET_DATA(param_data, API.GET_SUPPLIER_EXTRA_PRODUCT, function (response) {
            if (!!response && response.data) {
                $scope.products 
                let inventoryArr = response.data.result.data;
                if($scope.supplierData.length){
                  extra_product = $scope.supplierData.split(',');
                  inventoryArr.forEach(prod=>{

                    $scope.products.push({
                      name: `<strong style='margin-top: 20px'><u>${prod.name}</u></strong>`,
                      msGroup: true
                    })
                    prod.aloted_serial_no.forEach(alloted=> {
                      $scope.products.push({
                        id: alloted.id,
                        name: alloted.serial_no,
                        ticked: false
                    });
                    })

                    prod.not_aloted_serial_no.forEach(nonAlloted=> {
                      $scope.products.push({
                        id: nonAlloted.id,
                        name: nonAlloted.serial_no,
                        ticked: false
                    });
                    })
                  //  aloted_serial_no
                   
                    //  if(extra_product.includes(prod.id + '')){
                    //      prod.ticked = true;
                    //      $scope.selected_product.push(prod);
                    //  }
                     
                    $scope.products.push({
                      msGroup: false
                  })
                  })

                  //   let extra_product = $scope.supplierData.split(',');
                  //  $scope.products.forEach(prod=>{
                  //     if(extra_product.includes(prod.id + '')){
                  //         prod.ticked = true;
                  //         $scope.selected_product.push(prod);
                  //     }
                  //  })
                }
            }
            $scope.dataLoaded = true;
        });
    }

    $scope.$on('supplier_data', getSupplierData);
    function getSupplierData($event, data) {
      if (!!data) {
        $scope.supplierData = data.extra_product_id || [];
        $scope.getExtraProductList(1);
        //console.log("kkk",$scope.supplierData);
      }
    }
    

    $scope.assignInventory = function(){
        $scope.extra_product = [];
        // console.log("kk",$scope.selected_product)
        $scope.selected_product.forEach(prod=>{
             $scope.extra_product.push(prod.id);
        })
        var param_data = {
            id : $scope.supplier_id,
            extra_product : $scope.extra_product.join(',')
        };
        // console.log("jjj",$scope.extra_product);
          services.PUT_DATA(param_data, API.ASSIGN_INVENTORY_SUPPLIER, function (response) {
            
            services.SUCCESS_MODAL(true);
          });
    }

}]);