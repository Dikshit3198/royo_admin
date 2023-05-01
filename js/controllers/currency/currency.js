Royo.controller('AdminCurrencyCtrl', ['$scope', '$rootScope', '$stateParams', 'services', 'API', 'pagerService', 'constants', 'factories',
    function ($scope, $rootScope, $stateParams, services, API, pagerService, constants, factories) {


        $rootScope.tab = $stateParams.tab;
        $scope.supplier_id = $stateParams.supplierId;
        $rootScope.$broadcast('supplier_id', { supplier_id: $stateParams.supplierId, tab: $stateParams.tab });


        $scope.skip = 0;
        $scope.limit = 20;
        $scope.search = '';
        $scope.count = 0;
        $scope.currencyList = [];
        $scope.dataLoaded = false;
        $scope.supplier_id = '';

        $scope.admin_currency = {
            currencyName: '',
            currencySymbol: '',
            conversion_rate: 0,
            currency_description: '',
            country_name: ''
        }

        $scope.selectedCurrency = {};
        $scope.is_updating = false;

        var getCurrency = function (page) {
            $stateParams
            // var data = {
            //     limit: $scope.limit,
            //     skip: $scope.skip
            // };
            var data = {};
            $scope.dataLoaded = false;
            services.GET_DATA(data, API.GET_CURRENCY_LIST, function (response) {
                $scope.currencyList = response.data;
                $scope.count = response.data.count;
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                $scope.dataLoaded = true;
            });
        };
        getCurrency(1);

        $scope.setPage = function (page) {
            $scope.currentPage = page;
            $scope.skip = $scope.limit * (page - 1);
            getCurrency(page);
        }



        $scope.addCurrency = function (addCurrencyForm) {
            if (addCurrencyForm.$invalid) return;
            var addParams = $scope.admin_currency

            if ($scope.is_updating) {
                addParams.id = $scope.selectedCurrency.id;
                updateCurrency(addParams);
            }
            else {
                addCurrency(addParams);
            }

        }

        var addCurrency = function (addParams) {
            services.POST_DATA(addParams, API.ADD_CURRENCY, function (response) {
                $scope.message = `Currency has been added!`;
                addCurrencyForm.$submitted = false;
                onSave();
                services.SUCCESS_MODAL(true);
            });
        }
        var updateCurrency = function (addParams) {
            services.PUT_DATA(addParams, API.UPDATE_CURRENCY, function (response) {
                $scope.message = `Currency has been updated!`;
                onSave();
                addCurrencyForm.$submitted = false;
                services.SUCCESS_MODAL(true);
            });
        }

        var onSave = function () {
            $scope.is_updating = false;
            $scope.dataLoaded = true;
            $("#addCurrencyRef").modal('hide');
            getCurrency(1);
            $scope.admin_currency = {
                currencyName: '',
                currencySymbol: '',
                conversion_rate: '',
                currency_description: '',
                country_name: ''
            }
        }


        $scope.deleteCurrency = function (currency) {
            var data = {
                id: currency.id
            }
            services.POST_DATA(data, API.DELETE_CURRENCY, function (response) {
                getCurrency(1);
                $scope.dataLoaded = true;
                $scope.message = `Currecny has been deleted!`;
                services.SUCCESS_MODAL(true);
            });
        }

        $scope.updateCurrency = function (currency) {
            $scope.selectedCurrency = currency;
            $scope.is_updating = true;
            $scope.admin_currency = {
                currencyName: currency.currency_name,
                currencySymbol: currency.currency_symbol,
                conversion_rate: currency.conversion_rate,
                currency_description: currency.currency_description,
                country_name: currency.country_name
            }
            $("#addCurrencyRef").modal('show');

        }


    }]);