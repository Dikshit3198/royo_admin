Royo.controller('CustomAboutUsCtrl', ['$scope', 'services', '$stateParams', '$state', 'API', '$rootScope', 'factories', 'constants', '$interval', '$translate', '$location',
    function ($scope, services, $stateParams, $state, API, $rootScope, factories, constants, $interval, $translate, $location) {

        $scope.notification_open = false;
        $scope.content = {
            title: '',
            description: '',
            mediaType: 'image',
            media: null
        }

        $scope.summernote_config = {
            height: 200,
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'italic', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['table', ['table']],
            ]
        };

        $scope.changeMediaType = function (type) {
            $scope.content.mediaType = type;
        }


        $scope.upload_trade_license = function (File) {
            var file = File[0];
            if (constants.IMAGE_TYPE.includes(file.type)) {
                // if ((file.size / Math.pow(1024, 2)) <= 1) {
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    $scope.$apply(function () {
                        let fileName = file.name.replace(/.[^/.]+$/, '');
                        $scope.content.media = {
                            name: fileName,
                            url: e.target.result,
                            path: file
                        };
                    });
                }
            } else {
                factories.invalidDataPop("Invalid File Type");
            }
        };


        var getuserData = function (page) {
            var param_data = {};
            param_data.type = $scope.type;
            param_data.offset = $scope.skip;
            param_data.limit = $scope.limit;
            // param_data.id = $scope.filter.id;

            $scope.dataLoaded = false;
            services.GET_DATA(param_data, API.GET_CUSTOM_PAGES, function (response) {
                $scope.count = response.data.count;
                $scope.contentData = response.data.list;
                $scope.dataLoaded = true;
                // $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
            });
        };

        $scope.submitContent = function () {
            if ($scope.content.title == '') {
                factories.invalidDataPop("Please enter the title");
                return;
            } else if ($scope.content.description == '') {
                factories.invalidDataPop("Please enter the description");
                return;
            }

            var param_data = {};
            param_data.type = $scope.type;
            param_data.title = $scope.content.title;
            param_data.description = $scope.content.description;
            if ($scope.pageType < 3) {
                param_data.media = $scope.content.media.path;
                param_data.mediaType = $scope.content.mediaType;
            }
            // POST_DATA
            console.log('param_data', param_data);

            services.POST_FORM_DATA(param_data, API.ADD_CUSTOM_PAGES, function (response) {
                $scope.message = 'Content has been added successfully';

                $scope.content = {
                    title: '',
                    description: '',
                    mediaType: 'image',
                    media: null
                }

                getuserData(1);
                services.SUCCESS_MODAL(true);
            });
            // }
        }


        $scope.deleteContent = function (contentId) {
            services.CONFIRM($translate.instant(`You want to delete this Content`),
                function (isConfirm) {
                    if (isConfirm) {
                        services.DELETE_DATA(contentId, API.DELETE_CUSTOM_PAGES, function (response) {
                            // $scope.refresh();

                            getuserData(1);
                            $scope.message = 'Content has been deleted';
                            services.SUCCESS_MODAL(true);
                        });
                    }
                });
        };


        $scope.notificationOpen = function () {
            $scope.notification_open = !$scope.notification_open;
        }

        $scope.setPageType = function (data) {
            console.log(data);
            let value;

            switch (data) {
                case 2:
                    $scope.type = 'how_it_work';
                    break;

                case 3:
                    $scope.type = 'terms';
                    break;

                case 4:
                    $scope.type = 'privacy_policy';
                    break;

                case 5:
                    $scope.type = 'faq';
                    break;

                case 6:
                    $scope.type = 'become_vendor';
                    break;

                case 7:
                    $scope.type = 'become_driver';
                    break;

                default:
                    $scope.type = 'about';
                    break;
            }
        }

        $scope.pageType = parseInt($state.params.type);
        $scope.setPageType($scope.pageType);
        getuserData(1);
        // $scope.$on('active_custom_page', getPageType);
        // function getPageType($event, data) {
        //     console.log('defwe', data);
        //     $scope.setPageType(data);
        // }

    }]);