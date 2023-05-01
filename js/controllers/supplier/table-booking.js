Royo.controller('TableBookingCtrl', ['$scope', '$rootScope', 'constants', 'services', 'API', 'pagerService', 'factories', '$stateParams', '$translate',
    function ($scope, $rootScope, constants, services, API, pagerService, factories, $stateParams, $translate) {

        $rootScope.tab = $stateParams.tab;
        $scope.supplierId = $stateParams.id;
        $scope.branchId = $stateParams.b_id;
        $rootScope.$broadcast('supplier_id', { supplier_id: $stateParams.id, tab: $stateParams.tab });

        $scope.tables = [];
        $scope.selectedTable = '';
        $scope.table = {
            supplier_id: $scope.supplierId,
            branch_id: $scope.branchId,
            table_number: '',
            table_name: '',
            seating_capacity: ''
        };
        $scope.selectedQRCode = '';
        $scope.dataLoaded = false;
        $scope.is_edit = false;
        $scope.count = 0;
        $scope.skip = 0;
        $scope.limit = 20;
        $scope.currentPage = 1;

        var getTables = function (page) {
            let param_data = {
                limit: $scope.limit,
                offset: $scope.skip,
                supplier_id: $scope.supplierId,
                branch_id: $scope.branchId
            }
            $scope.dataLoaded = false;
            services.GET_DATA(param_data, API.LIST_SUPPLIER_TABLE(), function (response) {
                if (response) {
                    $scope.tables = response.data.list;
                    $scope.count = response.data.count;
                }
                $scope.dataLoaded = true;
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
            });
        }
        getTables(1);

        $scope.refresh = function () {
            $scope.count = 0;
            $scope.skip = 0;
            $scope.currentPage = 1;
            getTables(1);
        }

        $scope.setPage = function (page) {
            if ($scope.currentPage !== page) {
                $scope.currentPage = page;
                $scope.skip = $scope.limit * (page - 1);
                getTables(page);
            }
        }

        $scope.addModal = function () {
            $scope.is_edit = false;
            $("#addTable").modal('show');
        }

        $scope.editTable = function (table) {
            $scope.is_edit = true;
            $scope.selectedTable = table;
            $scope.table.table_number = table.table_number;
            $scope.table.table_name = table.table_name;
            $scope.table.seating_capacity = table.seating_capacity;
            $("#addTable").modal('show');
        }

        var afterSubmit = function () {
            $scope.is_edit = false;
            $scope.message = `${$translate.instant('Table Has Been')} ${$scope.is_edit ? $translate.instant('Updated') : $translate.instant('Added')} ${$translate.instant('Successfully')}`;
            services.SUCCESS_MODAL(true)
            $scope.refresh();
            $("#addTable").modal('hide');
        }

        $scope.submitAdd = function (addTableForm) {
            if (addTableForm.$submitted && addTableForm.$invalid) return;
            if ($scope.is_edit) {
                let params = {
                    id: $scope.selectedTable.id,
                    table_number: $scope.table.table_number,
                    table_name: $scope.table.table_name,
                    seating_capacity: $scope.table.seating_capacity
                }
                services.POST_DATA(params, API.UPDATE_SUPPLIER_TABLE(), function (response) {
                    afterSubmit();
                });
            } else {
                services.POST_DATA($scope.table, API.ADD_SUPPLIER_TABLE(), function (response) {
                    afterSubmit();
                });
            }
        }

        $scope.deleteTable = function (table) {
            services.CONFIRM($translate.instant(`You want to delete this table`),
                function (isConfirm) {
                    if (isConfirm) {
                        let param_data = {
                            id: table.id,
                        };
                        services.POST_DATA(param_data, API.DELETE_SUPPLIER_TABLE(), function (response) {
                            $scope.message = `${$translate.instant('Table deleted')}`;
                            services.SUCCESS_MODAL(true);
                            $scope.refresh();
                        });
                    }
                });
        }

        $scope.generateQRCode = function (table) {
            let qr_code = `https://chart.googleapis.com/chart?chs=177x177&cht=qr&chl={s_id: ${$scope.supplierId}, b_id: ${$scope.branchId}, table_id: ${table.id}, table_name: ${table.table_name}, capacity: ${table.seating_capacity}, table_number: ${table.table_number}}`;
            $scope.selectedQRCode = qr_code;
            let param_data = {
                id: table.id,
                qr_code: qr_code
            }
            services.POST_DATA(param_data, API.GENERATE_QR_SUPPLIER_TABLE(), function (response) {
                $scope.message = `${$translate.instant('QR Code Generated')}`;
                services.SUCCESS_MODAL(true);
                $("#qrCode").modal('show');
                $scope.refresh();
            });
        }

        $scope.openQR = function (table) {
            $scope.selectedQRCode = table.qr_code;
            $("#qrCode").modal('show');
        }


        $scope.downloadQRCode = function () {
            var link = document.createElement('a');
            link.href = $scope.selectedQRCode;
            link.target = '_blank';
            link.download = 'qrcode.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

    }]);