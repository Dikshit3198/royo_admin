Royo.controller('SupplierDeliveryCompanyCtrl', ['$scope', '$rootScope', 'factories', 'services', '$stateParams', '$state', 'API', 'constants',
    function ($scope, $rootScope, factories, services, $stateParams, $state, API, constants) {

        $scope.deliveryCompanyData = [];
        $scope.is_assigned = false;
        $scope.settings = factories.getSettings();
        $scope.message = '';
        $scope.dataLoaded = false;
        $scope.supplier_id = $stateParams.id;
        $scope.query = '';

        $scope.changeView = function (val) {
            $scope.is_assigned = val;
            $scope.deliveryCompanyData = [];
            getCategories(!val);
        }

        $rootScope.$broadcast('supplier_id', {
            supplier_id: $scope.supplier_id,
            tab: $stateParams.tab
        });

        var getCategories = function (is_supplier) {
            let params = {
                supplier_id: $scope.supplier_id,
                skip: 0,
                limit: 300
            };
            // params.language_id = localStorage.getItem('lang') != 'en' ? 15 : 14;
            services.GET_DATA(params, API.LIST_DELIVERY_COMPANY, function (data) {
                let companies = data.data.list;
                companies = companies.filter(o=> (o.is_block == 1 && o.is_verified == 1));
                
                $scope.selectedIds = [];
                if (companies.length) {
                    if (!is_supplier) {
                        (companies).map(col => {
                            col['checked'] = col['is_assigned'];
                            if(col['is_assigned']) {
                                $scope.selectedIds.push(col.id)
                            }
                        });
                        $scope.deliveryCompanyData = [...companies];
                    } else {
                        $scope.deliveryCompanyData = [...companies];
                    }
                }
            });
        };
        if ($stateParams.multi_b == 1 && factories.getSettings().key_value.branch_flow == 1) {
            $scope.is_multi_branch = 1;
            $scope.changeView(true);
        } else {
            getCategories(true);
        }

        $scope.selectedIds = []
        $scope.selectedDeliveryCompanyForAssignment = function(data) {
            data.checked = !data.checked;
            if(data.checked) {
                $scope.selectedIds.push(data.id);
            } else {
                let x = $scope.selectedIds.findIndex(o => o == data.id);
                if(x > -1) {
                    $scope.selectedIds.splice(x, 1);
                }
            }                    
        }

        $scope.assignDeliveryCompany = function() {

            let selectedArr = [];
            let obj = {};
            $scope.deliveryCompanyData.forEach(col => {
                if(col.checked) {
                    obj = {
                        delivery_company_id: col.id,
                        supplier_id: $scope.supplier_id
                    }
                    selectedArr.push(obj);
                }
            })
            console.log(selectedArr);
            
            var param_data = {};
            param_data.supplierDeliveryCompanyIds = selectedArr;

            services.POST_DATA(param_data, API.ASSIGN_DELIVERY_COMPANY_TO_SUPPLIER, function (response) {
                // $scope.message = `${selectedArr.length ? 'Delivery Company' : 'Delivery Companies'} assigned successfully`;
                $scope.message = `${selectedArr.length ? 'Shipping Panel' : 'Shipping Panel'} assigned successfully`;
                services.SUCCESS_MODAL(true);
                $scope.changeView(false);
            });
    
        }
    }]);