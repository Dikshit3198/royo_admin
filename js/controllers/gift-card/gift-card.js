Royo.controller('GiftCardCtrl', ['$scope', 'services', 'factories', 'API', 'pagerService', '$rootScope', 'constants',
    function ($scope, services, factories, API, pagerService, $rootScope, constants) {

        $scope.skip = 0;
        $scope.limit = 20;
        $scope.count = 0;
        $scope.gift_cards = [];
        $scope.dataLoaded = false;
        $scope.is_add = false;
        $scope.is_edit = false;
        $scope.gift_card_id = '';

        $scope.init = function () {
            $scope.gift = {
                names: [
                    { name: '', language_id: 14 },
                    { name: '', language_id: 15 }
                ],
                description: '',
                price: 0,
                price_type: 1,
                from_date: '',
                to_date: '',
                sectionId: 40,
                offset: moment().format('Z'),
                quantity: '',
                percentage_value: 0,
                // file: ''
            };
            $scope.validity = '';
        }

        var datepicker = function () {
            setTimeout(() => {
                document.getElementById("datepicker").value = '';
                var picker1 = new Lightpick({
                    field: document.getElementById("datepicker"),
                    singleDate: false,
                    minDate: new Date(),
                    format: 'DD.MM.YYYY',
                    repick: true,
                    startDate: $scope.is_edit ? moment($scope.gift.from_date) : '',
                    endDate: $scope.is_edit ? moment($scope.gift.to_date) : '',
                    onSelect: (start, end) => {
                        $scope.validity = '';
                        if (start && end) {
                            $scope.gift.from_date = start.format('YYYY-MM-DD');
                            $scope.gift.to_date = end.format('YYYY-MM-DD');
                            $scope.validity = `${start.format('DD.MM.YYYY')} - ${end.format('DD.MM.YYYY')}`;
                            document.getElementById("datepicker").value = $scope.validity;
                            $scope.$apply();
                        }
                    }
                });
            }, 200);
        }

        $scope.changeView = function (val) {
            $scope.is_add = val;
            $scope.is_edit = false;
            if (val) {
                $scope.init();
                datepicker();
            }
        }

        var getGiftCards = function (page) {
            let params = {
                limit: $scope.limit,
                sectionId: 40,
                offset: $scope.skip
            }
            $scope.dataLoaded = false;
            services.GET_DATA(params, API.LIST_GIFT_CARDS(), function (response) {
                console.log(response)
                $scope.gift_cards = response.data.gift;
                $scope.count = response.data.count;
                $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
                $scope.dataLoaded = true;
            });
        }
        getGiftCards(1);

        $scope.setPage = function (page) {
            $scope.currentPage = page;
            $scope.skip = $scope.limit * (page - 1);
            getGiftCards(page);
        }

        var afterSubmit = function (is_edit) {
            $scope.is_add = false;
            $scope.skip = 0;
            getGiftCards(1);
            $scope.message = `Gift Card ${is_edit ? 'updated' : 'created'} successfully`;
            services.SUCCESS_MODAL(true);
        }

        $scope.addGiftCard = function (addGiftCardForm) {
            if (addGiftCardForm.$submitted && (addGiftCardForm.$invalid || !$scope.gift.from_date || !$scope.gift.to_date)) {
                return;
            }

            let form_data = { ...$scope.gift };
            form_data.names = JSON.stringify($scope.gift.names);

            if ($scope.is_edit) {
                    form_data['id'] = $scope.gift_card_id;
                services.PUT_FORM_DATA(form_data, API.UPDATE_GIFT_CARDS(), function (response) {
                    afterSubmit(true);
                });
            } else {
                services.POST_FORM_DATA(form_data, API.ADD_GIFT_CARDS(), function (response) {
                    afterSubmit(false);
                });
            }
        }

        $scope.deleteGiftCard = function (Id) {
            services.CONFIRM(`You want to delete this gift card`,
                function (isConfirm) {
                    if (isConfirm) {
                        var params = {};
                        params.id = Id;
                        params.sectionId = 40
                        services.PUT_DATA(params, API.DELETE_GIFT_CARDS(), function (response) {
                            $scope.message = 'Gift Card deleted successfully';
                            services.SUCCESS_MODAL(true);
                            $scope.skip = 0;
                            getGiftCards(1);
                        });
                    }
                });
        };


        $scope.editGiftCard = function(gift) {
            $scope.is_edit = true;
            $scope.is_add = true;
            $scope.gift_card_id = gift.id;
            $scope.gift = {
                names: gift.names,
                description: gift.description,
                price: gift.price,
                price_type: gift.price_type,
                from_date: moment(gift.from_date),
                to_date: moment(gift.to_date),
                quantity: gift.quantity,
                percentage_value: gift.percentage_value,
            };
            $scope.validity = `${moment(gift.from_date).format('DD.MM.YYYY')} - ${moment(gift.to_date).format('DD.MM.YYYY')}`;
            datepicker();
        }


    }]);