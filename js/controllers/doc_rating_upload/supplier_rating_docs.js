Royo.controller('supplierRatingDocsCtrl', ['$scope', '$rootScope', 'services', 'constants', 'API', 'pagerService', 'factories', '$stateParams',
    function ($scope, $rootScope, services, constants, API, pagerService, factories, $stateParams) {

        $scope.tabStatus = 1;
        $rootScope.tab = $stateParams.tab;
        $scope.supplierId = $stateParams.supplierId;
        $scope.ratingDescription = "";
        $scope.ratingDate = "";
        $scope.ratingImageList = [];

        var datepicker = function () {
            $scope.showSlots = false;
            setTimeout(() => {
                // $scope.ratingDate = moment();
                var picker = new Lightpick({
                    field: document.getElementById("datepicker"),
                    // minDate: moment(),
                    startDate: !!$scope.ratingDate ? moment(new Date($scope.ratingDate)) : moment(),
                    onSelect: function (start) {

                        if (start) {
                            $scope.ratingDate = start.format('YYYY-MM-DD');
                        } else if (!start) {

                            picker.hide();
                            $scope.ratingDate = '';
                        }
                    }
                });
            }, 500);
        }
        
        $scope.getRatingDetails = function () {
            var param_data = {};
            param_data.id = $scope.supplierId;

            services.POST_DATA(param_data, API.GET_SUPPLIER_RATING_DETAILS, function (response) {
                if(!!response && response.data){
                $scope.ratingDescription = response.data[0].hygiene_image_description;
                $scope.ratingDate = response.data[0].hygiene_rating_time;
                let x = $scope.ratingImageList.findIndex(o => o.image == response.data[0].image);
                if(x>-1) {
                    $scope.selectedIndex = x;
                }
                datepicker();
            }
            });
        }
        
        $scope.getSupplierRatingDocs = function () {
            services.GET_DATA({}, API.LIST_SUPPLIER_RATING_DOCS, function (response) {
                $scope.ratingImageList = response.data;
                $scope.getRatingDetails();
            });
        }
        $scope.getSupplierRatingDocs();

        $scope.selectedImageData = function (imageData, index) {
            $scope.selected_image_id = imageData.id;
            $scope.selectedIndex = index;
        }

        $scope.postRatingData = function () {
            var param_data = {};
            param_data.id = $scope.supplierId;
            param_data.hygiene_image = $scope.selected_image_id;
            param_data.hygiene_image_description = $scope.ratingDescription || "";
            param_data.hygiene_rating_time = $scope.ratingDate || "";

            services.POST_DATA(param_data, API.ADD_SUPPLIER_RATING_DETAILS, function (response) {
                services.SUCCESS_MODAL(true);
            });
        }

        

    }]);