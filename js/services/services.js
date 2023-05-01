/**
 * Services & Factories - Services and Factories for Admin Panel
 */

Royo.service('services', ['$http', '$rootScope', 'constants', 'factories', '$state', 'API', '$translate',
    function ($http, $rootScope, constants, factories, $state, API, $translate) {

        $rootScope.$on('unauthorized', logOut);
        function logOut($event) {
            constants.ACCESSTOKEN = "";
            localStorage.removeItem('RoyoAccessToken');
            localStorage.removeItem('section_data');
            localStorage.removeItem('adminId');
            localStorage.removeItem('is_superAdmin');
            localStorage.removeItem('profile_type');
            localStorage.removeItem('supplier_id');
            localStorage.removeItem('is_branch');
            localStorage.removeItem('branch_type');
            localStorage.removeItem('is_head_branch');
            localStorage.removeItem('supplierSubscription');
            $state.go('login');
        };

        var imageExists = function (url, callback) {
            var img = new Image();
            img.onload = function () { callback(true); };
            img.onerror = function () { callback(false); };
            img.src = url;
        }

        $rootScope.compressImage = function (imageUrl, imgSize, noCrop) {
            // debugger
            if (imageUrl) {
                let image = imageUrl.match(/\/([^\/?#]+)[^\/]*$/) ? (imageUrl.match(/\/([^\/?#]+)[^\/]*$/))[1] : null;
                if (image) {
                    let size = imgSize.split('x');
                    // https://royo.imgix.net
                    let imageLink = `${constants.IMAGE_URL}/${image}?w=${size[0]}&h=${size[1]}${!noCrop ? '&fit=crop' : ''}&auto=format`;
                    return imageUrl.startsWith('https://royostaging1.imgix.net') ? imageLink : imageUrl;
                }
            }
        }

        this.GET_AGENT_DATA = function (param_data, api, header, callback) {
            $http({
                method: 'GET',
                url: constants.AGENT_BASEURL + api,
                contentType: 'application/json',
                params: param_data,
                headers: header,
            }).then(function (response) {
                let data = response.data;
                if (!!data && [4, 200].includes(data.statusCode)) {
                    callback(data);
                } else {
                    if (!!data && data.message) factories.invalidDataPop(data.message);
                    else factories.invalidDataPop('Server Error');
                }
            }, function (error) {
                factories.invalidDataPop("We are working on it, will be back after some time ");
            });
        }

        this.POST_AGENT_DATA = function (data, api, callback) {
            $http({
                method: 'POST',
                url: constants.AGENT_BASEURL + api,
                contentType: 'application/json',
                data: data
            }).then(function (response) {
                let data = response.data;
                if (!!data && [4, 200].includes(data.status)) {
                    callback(data);
                } else {
                    if (!!data && data.message) factories.invalidDataPop(data.message);
                    else factories.invalidDataPop('Server Error');
                }
            }, function (error) {
                factories.invalidDataPop("We are working on it, will be back after some time ");
            });
        }

        this.DELETE_DATA = function (data, api, callback) {
            $http({
                method: 'DELETE',
                url: constants.BASEURL + api + data,
                contentType: 'application/json',
                data: data
            }).then(function (response) {
                let data = response.data;
                if (!!data && [4, 200].includes(data.status)) {
                    callback(data);
                } else {
                    if (!!data && data.message) factories.invalidDataPop(data.message);
                    else factories.invalidDataPop('Server Error');
                }
            }, function (error) {
                factories.invalidDataPop("We are working on it, will be back after some time ");
            });
        }

        this.POST_DATA = function (data, api, callback) {
            $http({
                method: 'POST',
                url: constants.BASEURL + api,
                contentType: 'application/json',
                data: data
            }).then(function (response) {
                let data = response.data;
                if (!!data && [4, 200].includes(data.status)) {
                    callback(data);
                } else {
                    if (!!data && data.message) factories.invalidDataPop($translate.instant(data.message));
                    else factories.invalidDataPop('Server Error');
                }
            }, function (error) {
                factories.invalidDataPop("We are working on it, will be back after some time ");
            });
        }

        this.POST_FORM_DATA = function (data, api, callback) {
            let form_data = new FormData();
            for (let key in data) {
                if ($rootScope.addDocumentsInAgent == 1 && key == 'addAgentDocument') {
                    // let i = 0;
                    // data[key].forEach(col => {
                    //     form_data.append(key + '[' + i + ']', col);
                    //     i++;
                    // })

                    for (var i = 0; i < data.addAgentDocument.length; i++) {
                        //add each file to the form data and iteratively name them
                        form_data.append("addAgentDocument[]", data.addAgentDocument[i]);
                    }
                } else {
                    form_data.append(key, data[key]);
                }
            }
            $http({
                method: "POST",
                url: constants.BASEURL + api,
                headers: { 'Content-Type': undefined },
                data: form_data
            }).then(function (response) {
                let data = response.data;
                if (!!data && [4, 200].includes(data.status)) {
                    callback(data);
                } else {
                    if (!!data && data.message) factories.invalidDataPop($translate.instant(data.message));
                    else factories.invalidDataPop('Server Error');
                }
            }, function (error) {
                factories.invalidDataPop("We are working on it, will be back after some time ");
            });
        }

        this.GET_DATA = function (param_data, api, callback) {
            $http({
                method: 'GET',
                url: constants.BASEURL + api,
                contentType: 'application/json',
                params: param_data
            }).then(function (response) {
                let data = response.data;
                if (!!data && [4, 200].includes(data.status)) {
                    callback(data);
                } else {
                    if (!!data && data.message) factories.invalidDataPop(data.message);
                    else factories.invalidDataPop('Server Error');
                }
            }, function (error) {
                factories.invalidDataPop("We are working on it, will be back after some time ");
            });
        }

        this.PUT_DATA = function (data, api, callback) {
            $http({
                method: 'PUT',
                url: constants.BASEURL + api,
                contentType: 'application/json',
                data: data
            }).then(function (response) {
                let data = response.data;
                if (!!data && [4, 200].includes(data.status)) {
                    callback(data);
                } else {
                    if (!!data && data.message) factories.invalidDataPop(data.message);
                    else factories.invalidDataPop('Server Error');
                }
            }, function (error) {
                factories.invalidDataPop("We are working on it, will be back after some time ");
            });
        }

        this.PUT_FORM_DATA = function (data, api, callback) {
            let form_data = new FormData();
            for (let key in data) {
                form_data.append(key, data[key]);
            }
            $http({
                method: "PUT",
                url: constants.BASEURL + api,
                headers: { 'Content-Type': undefined },
                data: form_data,
            }).then(function (response) {
                let data = response.data;
                if (!!data && [4, 200].includes(data.status)) {
                    callback(data);
                } else {
                    if (!!data && data.message) factories.invalidDataPop(data.message);
                    else factories.invalidDataPop('Server Error');
                }
            }, function (error) {
                factories.invalidDataPop("We are working on it, will be back after some time ");
            });
        };

        this.GET_ONBOARDING_DATA = function (params_data, url, show_error_page, callback) {
            $http({
                method: 'GET',
                url: constants.ONBOARDING_BASE_API_URL + url,
                contentType: 'application/json',
                params: params_data
            }).then(function (response) {
                let data = response.data;
                if (data.statusCode == 200) {
                    callback(data);
                } else {
                    if (show_error_page) {
                        $state.go('NotFound');
                    }
                    factories.invalidDataPop(data.message);
                }
            }, function (error) {
                if (show_error_page) {
                    $state.go('NotFound');
                } else {
                    factories.invalidDataPop("We are working on it, will be back after some time ");
                }
            });
        }

        this.POST_ONBOARDING_DATA = function (data, url, show_error_page, callback) {
            $http({
                method: 'POST',
                url: constants.ONBOARDING_BASE_API_URL + url,
                contentType: 'application/json',
                data: data
            }).then(function (response) {
                let data = response.data;
                if (data.statusCode == 200) {
                    callback(data);
                } else {
                    if (show_error_page) {
                        $state.go('NotFound');
                    }
                    factories.invalidDataPop(data.message);
                }
            }, function (error) {
                if (show_error_page) {
                    $state.go('NotFound');
                } else {
                    factories.invalidDataPop("We are working on it, will be back after some time ");
                }
            });
        }

        this.PUT_ONBOARDING_DATA = function (data, url, show_error_page, callback) {
            $http({
                method: 'PUT',
                url: constants.ONBOARDING_BASE_API_URL + url,
                contentType: 'application/json',
                data: data
            }).then(function (response) {
                let data = response.data;
                if (data.statusCode == 200) {
                    callback(data);
                } else {
                    if (show_error_page) {
                        $state.go('NotFound');
                    }
                    factories.invalidDataPop(data.message);
                }
            }, function (error) {
                if (show_error_page) {
                    $state.go('NotFound');
                } else {
                    factories.invalidDataPop("We are working on it, will be back after some time ");
                }
            });
        }

        this.GET_SETTINGS = function (callback) {
            $http({
                method: 'GET',
                url: constants.BASEURL + API.GET_SETTINGS,
                contentType: 'application/json',
                data: {}
            }).then(function (response) {
                let data = response.data;
                if (data.status == 200) {
                    callback(data.data);
                } else {
                    factories.invalidDataPop(data.message);
                    $state.go('NotFound');
                }
            }, function (error) {
                $state.go('NotFound');
                factories.invalidDataPop("We are working on it, will be back after some time ");
            });
        };

        this.CONFIRM = function (text, callback) {
            swal({
                title: $translate.instant(`${factories.localisation().Are_you_sure}`),
                text: $translate.instant(`${text}`),
                type: $rootScope.enable_knock_theme == 1 ? null : "warning",
                showCancelButton: true,
                confirmButtonColor: $rootScope.primary_color,
                confirmButtonText: $translate.instant('YES'),
                cancelButtonText: $translate.instant('NO'),
                closeOnConfirm: true,
                closeOnCancel: true,
                imageUrl: $rootScope.enable_knock_theme == 1 ? 'img/web-pannel-assets/alert.png' : null,
                customClass: $rootScope.enable_knock_theme == 1 ? "custom_theme" : ""
            }, function (isConfirm) {
                if (isConfirm) {
                    callback(isConfirm);
                }
                else {
                    callback(false);
                }
            });
        };

        this.DOWNLOAD_CSV = function (uri, filename) {
            var link = document.createElement('a');
            link.setAttribute("download", filename + '.csv');
            link.setAttribute("href", uri);
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
                document.body.removeChild(link);
            }, 500);
        }

        this.toast = function (text) {
            const Toast = swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            })

            Toast.fire({
                icon: 'success',
                title: 'Signed in successfully'
            })
        }

        this.SUCCESS_MODAL = function (show) {
            let access = show;
            $rootScope.$on("loader_hide", function () {
                if (access) {
                    $("#successModal").modal('show');
                    setTimeout(() => {
                        $("#successModal").modal('hide');
                    }, 1500);
                    access = false;
                }
            });
        }

        this.getLanguagesData = function ($scope, callback) {
            var data = {};
            data.accessToken = constants.ACCESSTOKEN;
            let api = '';
            if ($rootScope.profile == 'ADMIN') {
                api = '/get_languages';
            } else if ($rootScope.profile === 'SUPPLIER' || $rootScope.profile === 'BRANCH') {
                api = '/get_languages_in_supplier';
            }
            $http({
                method: 'POST',
                url: constants.BASEURL + api,
                contentType: 'application/json',
                data: data
            }).then(function (response) {
                let data = response.data;
                if (data.status == constants.SUCCESS) {
                    callback(data.data);
                } else {
                    factories.invalidAccessPop(data.message);
                }
            }, function (error) {
                factories.invalidDataPop("We are working on it, will be back after some time ");
            });
        };

        this.getLangDataWithHash = function ($scope, productData, callback) {

            var countries_with_lang = [];
            var finalData = {
                nameData: "",
                langData: ""
            };

            if (!productData['1']) {
                productData['1'] = productData['0'];
            }
            for (var c = 0; c < Object.keys(productData).length; c++) {

                var countries = [];
                var object_param = Object.keys(productData)[c];
                var single_cat = productData[object_param];
                countries.push(single_cat);
                if ($rootScope.replace_hash_with_slash == 1) {
                    countries_with_lang.push(countries.toString() + "=");
                } else {
                    countries_with_lang.push(countries.toString() + "#");
                }

            }

            String.prototype.replaceAll = function (str1, str2, ignore) {
                return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"),
                    (ignore ? "gi" : "g")), (typeof (str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
            }

            var countries_data_without_rep = countries_with_lang.toString().slice(0, -1);
            if ($rootScope.replace_hash_with_slash == 1) {
                var final_countries_data = countries_data_without_rep.replace(/=,/g, "=");
            } else {
                var final_countries_data = countries_data_without_rep.replace(/#,/g, "#");
            }

            // var final_countries_data = final_countries_data_temp.replaceAll(",", "#");
            // console.log(final_countries_data);
            var lang_ids_Str = $scope.lang_ids.toString();

            var final_lang_ids_temp = lang_ids_Str.replace(/#,/g, "#");
            var final_lang_ids = final_lang_ids_temp.replaceAll(",", "#");

            finalData.nameData = final_countries_data;
            finalData.langData = final_lang_ids;
            callback(finalData);
        };

        this.addAdminProduct = function ($scope, param_data, callback) {

            var formData = new FormData();
            formData.append("accessToken", constants.ACCESSTOKEN);
            formData.append("sectionId", param_data.section_id);
            formData.append("categoryId", param_data.categoryId);
            formData.append("subCategoryId", param_data.subCategoryId);
            formData.append("detailedSubCategoryId", param_data.detailedSubCategoryId);
            formData.append("name", param_data.name);
            formData.append("languageId", param_data.languageId);
            formData.append("description", param_data.description);
            formData.append("priceUnit", param_data.priceUnit);
            formData.append("measuringUnit", param_data.measuringUnit);
            formData.append("sku", param_data.sku);
            formData.append("commissionType", param_data.commissionType);
            formData.append("commissionPackage", param_data.commissionPackage);
            formData.append("commission", param_data.commission);
            formData.append("pricing_type", param_data.pricing_type);
            formData.append("barCode", param_data.barCode);
            formData.append("count", param_data.Count);
            formData.append("imageOrder", param_data.imageOrder);
            formData.append("quantity", param_data.quantity);
            formData.append("payment_after_confirmation", param_data.payment_after_confirmation);
            formData.append("cart_image_upload", param_data.cart_image_upload);
            formData.append("is_barcode", param_data.is_barcode);
            if ($rootScope.replace_hash_with_slash == 1) {
                formData.append("split_name_slash", param_data.split_name_slash)
            }

            if (!!param_data.brand_id) formData.append("brand_id", param_data.brand_id);
            formData.append("is_product", param_data.is_product);
            if (param_data.is_product == 0 || $rootScope.is_product_weight == 1) {
                formData.append("duration", param_data.duration);
            }
            if (param_data.is_product == 1) {
                param_data.variant_id.forEach(data => {
                    formData.append("variant_id[]", data);
                });
            }

            if (param_data.service_for && $rootScope.show_gender_category_dropdown == 1) {
                formData.append("service_for", param_data.service_for);
            }

            for (var i = 0; i < param_data.image.length; i++) {
                //add each file to the form data and iteratively name them
                formData.append("image[]", param_data.image[i]);
            }

            if ([5, 6, 7].includes($rootScope.app_type)) {
                formData.append("interval_flag", param_data.interval_flag);
            }

            let api = [5, 6, 7].includes($rootScope.app_type) ? '/v1/add_product' : '/add_product';

            $http({
                method: "POST",
                url: constants.BASEURL + api,
                headers: {
                    'Content-Type': undefined,
                    'Authorization': constants.ACCESSTOKEN,
                    'secretdbkey': constants.SECRET_DBKEY
                },
                data: formData,

            }).then(function (response) {
                let data = response.data;

                $scope.is_loader = 0;
                if (data.status == constants.SUCCESS) {
                    callback(data);
                } else {
                    factories.invalidDataPop(data.message);
                }
            }, function (error) {
                $scope.is_loader = 0;
                factories.invalidDataPop("We are working on it, will be back after some time ");
            });
        };

        this.addProductVariant = function ($scope, param_data, callback) {

            var formData = new FormData();
            formData.append("accessToken", constants.ACCESSTOKEN);
            formData.append("sectionId", param_data.section_id);
            formData.append("categoryId", param_data.categoryId);
            formData.append("subCategoryId", param_data.subCategoryId);
            formData.append("detailedSubCategoryId", param_data.detailedSubCategoryId);
            formData.append("name", param_data.name);
            formData.append("languageId", param_data.languageId);
            formData.append("description", param_data.description);
            formData.append("priceUnit", param_data.priceUnit);
            formData.append("measuringUnit", param_data.measuringUnit);
            formData.append("sku", param_data.sku);
            formData.append("commissionType", param_data.commissionType);
            formData.append("commissionPackage", param_data.commissionPackage);
            formData.append("commission", param_data.commission);
            formData.append("pricing_type", param_data.pricing_type);
            formData.append("barCode", param_data.barCode);
            formData.append("count", param_data.Count);
            formData.append("imageOrder", param_data.imageOrder);
            formData.append("quantity", param_data.quantity);
            formData.append("parent_id", param_data.parent_id);
            formData.append("duration", param_data.duration);

            if ($scope.type === 'branch') {
                formData.append("branchId", param_data.branchId);
            } else if ($scope.type === 'supplier') {
                formData.append("supplierId", param_data.supplierId);
            }

            console.log(param_data.variant_id)
            param_data.variant_id.forEach(data => {
                formData.append("variant_id[]", data);
            })

            var api = '';
            if ($rootScope.profile == 'ADMIN') {
                switch (param_data.type) {
                    case 'supplier':
                        api = '/add_supplier_product';
                        break;
                    case 'admin':
                        api = '/add_product';
                        break;
                    case 'branch':
                        api = '/add_supplier_branch_product'
                        break;
                }
            } else if ($rootScope.profile === 'SUPPLIER' || $rootScope.profile === 'BRANCH') {
                switch (param_data.type) {
                    case 'supplier':
                        api = '/add_product_by_supplier';
                        break;
                    case 'branch':
                        api = '/add_supplier_branch_product_by_supplier'
                        break;
                }
            }

            for (var i = 0; i < param_data.image.length; i++) {
                //add each file to the form data and iteratively name them
                formData.append("image[]", param_data.image[i]);
            }

            $http({
                method: "POST",
                url: constants.BASEURL + api,
                headers: {
                    'Content-Type': undefined,
                    'Authorization': constants.ACCESSTOKEN,
                    'secretdbkey': constants.SECRET_DBKEY
                },
                data: formData,

            }).then(function (response) {
                let data = response.data;
                $scope.is_loader = 0;
                if (data.status == constants.SUCCESS) {
                    callback(data);
                } else {
                    factories.invalidDataPop(data.message);
                }
            }, function (error) {
                $scope.is_loader = 0;
                factories.invalidDataPop("We are working on it, will be back after some time ");
            });
        };

        this.editAdminProduct = function ($scope, param_data, callback) {

            var formData = new FormData();
            formData.append("accessToken", constants.ACCESSTOKEN);
            formData.append("sectionId", param_data.section_id);
            formData.append("productId", param_data.productId);
            formData.append("multiLanguageId", param_data.multiLanguageId);
            formData.append("categoryId", param_data.categoryId);
            formData.append("subCategoryId", param_data.subCategoryId);
            formData.append("detailedSubCategoryId", param_data.detailedSubCategoryId);
            formData.append("name", param_data.name);
            formData.append("languageId", param_data.languageId);
            formData.append("description", param_data.description);
            formData.append("priceUnit", param_data.priceUnit);
            formData.append("measuringUnit", param_data.measuringUnit);
            formData.append("sku", param_data.sku);
            formData.append("commissionType", param_data.commissionType);
            formData.append("commissionPackage", param_data.commissionPackage);
            formData.append("commission", param_data.commission);
            formData.append("barCode", param_data.barCode);
            formData.append("count", param_data.Count);
            formData.append("imagePath", param_data.imagePath);
            formData.append("deleteOrder", param_data.deleteOrder);
            formData.append("imageOrder", param_data.imageOrder);
            formData.append("quantity", param_data.quantity);
            formData.append("brand_id", param_data.brand_id);
            formData.append("pricing_type", param_data.pricing_type);
            formData.append("is_product", param_data.is_product);
            formData.append("payment_after_confirmation", param_data.payment_after_confirmation);
            formData.append("cart_image_upload", param_data.cart_image_upload);
            formData.append("is_barcode", param_data.is_barcode);
            if ($rootScope.replace_hash_with_slash == 1) {
                formData.append("split_name_slash", param_data.split_name_slash)
            }

            if (param_data.making_price != undefined) formData.append("making_price", param_data.making_price);
            if (param_data.product_tags != undefined) formData.append("product_tags", param_data.product_tags);
            if (param_data.is_product == 0 || $rootScope.is_product_weight == 1) {
                formData.append("duration", param_data.duration);
            }
            if ([5, 6, 7].includes($rootScope.app_type)) {
                formData.append("interval_flag", param_data.interval_flag);
            }

            if (param_data.recipe_pdf) {
                formData.append("recipe_pdf", param_data.recipe_pdf);
            }

            if (param_data.variant_id) {
                formData.append("variant", JSON.stringify(param_data.variant_id));
            }

            for (var i = 0; i < param_data.image.length; i++) {
                formData.append("image[]", param_data.image[i]);
            }

            if ($rootScope.isProductCustomTabDescriptionEnable) {
                if (!!param_data['product_desc'] && param_data['product_desc'].length) {
                    param_data['product_desc'].forEach(col => {
                        formData.append(col.label, col.value);
                    })
                }
            }
            if (param_data.Size_chart_url) {
                formData.append("Size_chart_url", param_data.Size_chart_url);
            }
            if (param_data.country_of_origin) {
                formData.append("country_of_origin", param_data.country_of_origin);
            }

            if (param_data.purchase_limit) {
                formData.append("purchase_limit", param_data.purchase_limit);
            }
            if (param_data.is_subscription_required) {
                formData.append("is_subscription_required", param_data.is_subscription_required);
            }
            if (param_data.is_allergy_product) {
                formData.append("is_allergy_product", param_data.is_allergy_product);
                formData.append("allergy_description", param_data.allergy_description);
            }
            if (param_data.is_updation_vendor_request) {
                formData.append("is_updation_vendor_request", param_data.is_updation_vendor_request);
            }

            if (param_data.is_non_veg) {
                formData.append("is_non_veg", param_data.is_non_veg);
            }

            if (param_data.is_special_instruction) {
                formData.append("is_special_instruction", param_data.is_special_instruction);
            }

            if (param_data.is_appointment) {
                formData.append("is_appointment", param_data.is_appointment);
            }


            if (param_data.updationRequestId) {
                formData.append("updationRequestId", param_data.updationRequestId);
            }
            if (param_data.calories) {
                formData.append("calories", param_data.calories);
            }
            if (param_data.service_for && $rootScope.show_gender_category_dropdown == 1) {
                formData.append("service_for", param_data.service_for);
            }

            let api = '';
            if ($rootScope.profile == 'ADMIN') {
                api = '/edit_product';
            } else if ($rootScope.profile === 'SUPPLIER' || $rootScope.profile === 'BRANCH') {
                api = '/edit_product_by_supplier';
            }

            $http({
                method: "POST",
                url: constants.BASEURL + api,
                headers: {
                    'Content-Type': undefined,
                    'Authorization': constants.ACCESSTOKEN,
                    'secretdbkey': constants.SECRET_DBKEY
                },
                data: formData,

            }).then(function (response) {
                let data = response.data;
                $scope.is_loader = 0;
                if (data.status == constants.SUCCESS) {
                    callback(data);
                } else {
                    factories.invalidDataPop(data.message);
                }
            }, function (error) {
                $scope.is_loader = 0;
                factories.invalidDataPop("We are working on it, will be back after some time ");
            });
        };

        this.getVariantList = function ($scope, param_data, callback) {
            var data = {};
            data.sectionId = param_data.sectionId;
            data.category_id = param_data.category_id;

            let api = '';
            if ($rootScope.profile == 'ADMIN') {
                api = '/admin/variant_list';
            } else if ($rootScope.profile === 'SUPPLIER' || $rootScope.profile === 'BRANCH') {
                api = '/supplier/variant_list';
            }

            $http({
                method: 'POST',
                url: constants.BASEURL + api,
                contentType: 'application/json',
                headers: { 'Authorization': constants.ACCESSTOKEN, 'secretdbkey': constants.SECRET_DBKEY },
                data: data
            }).then(function (response) {
                let data = response.data;
                $scope.is_loader = 0;
                if (data.status == 200) {
                    callback(data.data);
                } else {
                    factories.invalidDataPop(data.message);
                }
            }, function (error) {
                $scope.is_loader = 0;
                factories.invalidDataPop("We are working on it, will be back after some time ");
            });
        };

        this.listSupplierProducts = function ($scope, param_data, callback) {

            var data = {};
            data.accessToken = constants.ACCESSTOKEN;
            data.sectionId = param_data.section_id;
            data.supplierId = param_data.supplierId;
            data.categoryId = param_data.categoryId;
            data.subCategoryId = param_data.subCategoryId;
            data.detailedSubCategoryId = param_data.detailedSubCategoryId;
            data.limit = param_data.limit;
            data.offset = param_data.offset;
            data.serachText = param_data.serachText;
            data.serachType = param_data.serachType;

            let api = '';
            if ($rootScope.profile == 'ADMIN') {
                api = '/list_supplier_products';
            } else if ($rootScope.profile === 'SUPPLIER' || $rootScope.profile === 'BRANCH') {
                api = '/product_info';
            }

            $http({
                method: 'POST',
                url: constants.BASEURL + api,
                contentType: 'application/json',
                data: data
            }).then(function (response) {
                let data = response.data;
                $scope.is_loader = 0;
                if (data.status == constants.SUCCESS) {
                    callback(data.data);
                } else {

                    factories.invalidDataPop(data.message);
                }
            }, function (error) {
                $scope.is_loader = 0;
                factories.invalidDataPop("We are working on it, will be back after some time ");
            });
        };

        this.addSupplierProduct = function ($scope, param_data, callback) {

            var formData = new FormData();
            formData.append("accessToken", constants.ACCESSTOKEN);
            formData.append("sectionId", param_data.section_id);
            formData.append("categoryId", param_data.categoryId);
            formData.append("subCategoryId", param_data.subCategoryId);
            formData.append("detailedSubCategoryId", param_data.detailedSubCategoryId);
            formData.append("supplierId", param_data.supplierId);
            formData.append("name", param_data.name);
            formData.append("languageId", param_data.languageId);
            formData.append("description", param_data.description);
            formData.append("priceUnit", param_data.priceUnit);
            formData.append("measuringUnit", param_data.measuringUnit);
            formData.append("sku", param_data.sku);
            formData.append("commissionType", param_data.commissionType);
            formData.append("commissionPackage", param_data.commissionPackage);
            formData.append("commission", param_data.commission);
            formData.append("pricing_type", param_data.pricing_type);
            formData.append("barCode", param_data.barCode);
            formData.append("count", param_data.Count);
            formData.append("imageOrder", param_data.imageOrder);
            formData.append("quantity", param_data.quantity);
            formData.append("brand_id", param_data.brand_id);
            formData.append("is_product", param_data.is_product);
            formData.append("payment_after_confirmation", param_data.payment_after_confirmation);
            formData.append("cart_image_upload", param_data.cart_image_upload);
            formData.append("is_barcode", param_data.is_barcode);
            if (param_data.making_price != undefined) formData.append("making_price", param_data.making_price);
            if (param_data.product_tags != undefined) formData.append("product_tags", param_data.making_price);

            if (param_data.is_product == 0 || $rootScope.is_product_weight == 1) {
                formData.append("duration", param_data.duration);
            }
            if (param_data.is_product == 1) {
                param_data.variant_id.forEach(data => {
                    formData.append("variant_id[]", data);
                });
            }

            for (var i = 0; i < param_data.image.length; i++) {
                //add each file to the form data and iteratively name them
                formData.append("image[]", param_data.image[i]);
            }

            if ([5, 6, 7].includes($rootScope.app_type)) {
                formData.append("interval_flag", param_data.interval_flag);
            }

            let api = '';
            if ($rootScope.profile == 'ADMIN') {
                api = '/v1/add_supplier_product';
            } else if ($rootScope.profile === 'SUPPLIER' || $rootScope.profile === 'BRANCH') {
                api = '/v1/add_product_by_supplier';
            }

            $http({
                method: "POST",
                url: constants.BASEURL + api,
                headers: {
                    'Content-Type': undefined,
                    'Authorization': constants.ACCESSTOKEN,
                    'secretdbkey': constants.SECRET_DBKEY
                },
                data: formData,

            }).then(function (response) {
                let data = response.data;
                $scope.is_loader = 0;
                if (data.status == constants.SUCCESS) {
                    callback(data);
                } else {
                    factories.invalidDataPop(data.message);
                }
            }, function (error) {
                $scope.is_loader = 0;
                factories.invalidDataPop("We are working on it, will be back after some time ");
            });
        };

        this.addProductPricing = function ($scope, param_data, callback) {

            var data = {};
            data.accessToken = constants.ACCESSTOKEN;
            data.sectionId = param_data.section_id;
            data.productId = param_data.productId;
            data.startDate = param_data.start_date;
            data.endDate = param_data.end_date;
            data.price = param_data.price;
            data.displayPrice = param_data.displayPrice;
            data.handlingFeeAdmin = param_data.handling_fee_admin;
            data.handlingFeeSupplier = 0;
            data.isUrgent = 0;
            data.urgentPrice = 0;
            data.commission = 0;
            data.deliveryCharges = param_data.delivery_charges;
            data.urgentType = 0;
            data.commissionType = 0;
            data.houseCleaningPrice = 0;
            data.beautySaloonPrice = 0;
            data.offerType = param_data.offer_type;
            data.pricing_type = param_data.pricing_type;
            data.type = 0;
            data.minOrder = 0;
            data.chargesBelowMinOrder = 0;
            data.areaId = 0;
            data.discountPrice = param_data.discountPrice;
            data.discountStartDate = param_data.discountStartDate;
            data.discountEndDate = param_data.discountEndDate;
            data.id = param_data.id;
            // if (param_data.productPricingId) {
            //     data.productPricingId = param_data.productPricingId;
            // }



            if (param_data.item_rate) {
                data.item_rate = param_data.item_rate;
            }


            let api = '';
            if ($rootScope.profile == 'ADMIN') {
                api = '/add_product_pricing_by_admin';
            } else if ($rootScope.profile === 'SUPPLIER' || $rootScope.profile === 'BRANCH') {
                api = '/add_product_pricing_by_supplier';
            }

            $http({
                method: 'POST',
                url: constants.BASEURL + api,
                contentType: 'application/json',
                data: data
            }).then(function (response) {
                let data = response.data;
                $scope.is_loader = 0;
                if (data.status == constants.SUCCESS) {
                    callback(data);
                } else {
                    $scope.is_disabled_add = 0;
                    factories.invalidDataPop(data.message);
                }
            }, function (error) {
                $scope.is_loader = 0;
                factories.invalidDataPop("We are working on it, will be back after some time ");
            });
        };

        this.editProductPricing = function ($scope, param_data, callback) {

            var data = {};
            data.accessToken = constants.ACCESSTOKEN;
            data.sectionId = param_data.section_id;
            data.productId = param_data.productId;
            data.startDate = param_data.start_date;
            data.endDate = param_data.end_date;
            data.price = param_data.price;
            data.displayPrice = param_data.displayPrice;
            data.handlingFeeAdmin = param_data.handling_fee_admin;
            data.handlingFeeSupplier = 0;
            data.isUrgent = 0;
            data.urgentPrice = 0;
            data.commission = 0;
            data.deliveryCharges = param_data.delivery_charges;
            data.urgentType = 0;
            data.commissionType = 0;
            data.houseCleaningPrice = 0;
            data.beautySaloonPrice = 0;
            data.offerType = param_data.offer_type;
            data.type = 0;
            data.minOrder = 0;
            data.chargesBelowMinOrder = 0;
            data.areaId = 0;
            data.id = param_data.id;
            data.productPricingId = param_data.productPricingId;
            data.pricing_type = param_data.pricing_type;

            if (param_data.item_rate) {
                data.item_rate = param_data.item_rate;
            }

            let api = '';
            if ($rootScope.profile == 'ADMIN') {
                api = '/edit_pricing';
            } else if ($rootScope.profile === 'SUPPLIER' || $rootScope.profile === 'BRANCH') {
                api = '/edit_pricing_by_supplier';
            }

            $http({
                method: 'POST',
                url: constants.BASEURL + api,
                contentType: 'application/json',
                data: data
            }).then(function (response) {
                let data = response.data;
                $scope.is_loader = 0;
                if (data.status == constants.SUCCESS) {
                    callback(data);
                } else {
                    factories.invalidDataPop(data.message);
                }
            }, function (error) {
                $scope.is_loader = 0;
                factories.invalidDataPop("We are working on it, will be back after some time ");
            });
        };

        this.listBranchProducts = function ($scope, param_data, callback) {

            var data = {};
            data.accessToken = constants.ACCESSTOKEN;
            data.sectionId = param_data.section_id;
            data.branchId = param_data.branchId;
            data.limit = param_data.limit;
            data.offset = param_data.offset;

            let api = '';
            if ($rootScope.profile == 'ADMIN') {
                api = '/v1/list_supplier_branch_products';
            } else if ($rootScope.profile === 'SUPPLIER' || $rootScope.profile === 'BRANCH') {
                api = '/v1/list_supplier_branch_products_by_supplier';
            }

            $http({
                method: 'POST',
                url: constants.BASEURL + api,
                contentType: 'application/json',
                data: data
            }).then(function (response) {
                let data = response.data;
                $scope.is_loader = 0;
                if (data.status == constants.SUCCESS) {
                    callback(data.data);
                } else {

                    factories.invalidDataPop(data.message);
                }
            }, function (error) {
                $scope.is_loader = 0;
                factories.invalidDataPop("We are working on it, will be back after some time ");
            });
        };

        this.addBranchProduct = function ($scope, param_data, callback) {

            var formData = new FormData();
            formData.append("accessToken", constants.ACCESSTOKEN);
            formData.append("sectionId", param_data.section_id);
            formData.append("branchId", param_data.branchId);
            formData.append("categoryId", param_data.categoryId);
            formData.append("subCategoryId", param_data.subCategoryId);
            formData.append("detailedSubCategoryId", param_data.detailedSubCategoryId);
            formData.append("name", param_data.name);
            formData.append("languageId", param_data.languageId);
            formData.append("measuringUnit", param_data.measuringUnit);
            formData.append("description", param_data.description);
            formData.append("priceUnit", param_data.priceUnit);
            formData.append("sku", param_data.sku);
            formData.append("commissionType", param_data.commissionType);
            formData.append("commissionPackage", param_data.commissionPackage);
            formData.append("commission", param_data.commission);
            formData.append("pricing_type", param_data.pricing_type);
            formData.append("barCode", param_data.barCode);
            formData.append("count", param_data.Count);
            formData.append("imageOrder", param_data.imageOrder);
            formData.append("quantity", param_data.quantity);
            formData.append("payment_after_confirmation", param_data.payment_after_confirmation);
            formData.append("cart_image_upload", param_data.cart_image_upload);
            formData.append("is_barcode", param_data.is_barcode);
            if ($rootScope.replace_hash_with_slash == 1) {
                formData.append("split_name_slash", param_data.split_name_slash)
            }
            if (param_data.making_price != undefined) formData.append("making_price", param_data.making_price);
            if (param_data.product_tags != undefined) formData.append("product_tags", param_data.making_price);
            if (param_data.brand_id) formData.append("brand_id", param_data.brand_id);
            formData.append("is_product", param_data.is_product);
            if (param_data.is_product == 0 || $rootScope.is_product_weight == 1) {
                formData.append("duration", param_data.duration);
            }
            if (param_data.is_product == 1) {
                param_data.variant_id.forEach(data => {
                    formData.append("variant_id[]", data);
                });
            }

            if (param_data.Size_chart_url) {
                formData.append("Size_chart_url", param_data.Size_chart_url);
            }
            if (param_data.country_of_origin) {
                formData.append("country_of_origin", param_data.country_of_origin);
            }

            if (param_data.purchase_limit) {
                formData.append("purchase_limit", param_data.purchase_limit);
            }
            if (param_data.is_subscription_required) {
                formData.append("is_subscription_required", param_data.is_subscription_required);
            }

            if (param_data.is_non_veg) {
                formData.append("is_non_veg", param_data.is_non_veg);
            }
            if (param_data.is_special_instruction) {
                formData.append("is_special_instruction", param_data.is_special_instruction);
            }

            if (param_data.is_allergy_product) {
                formData.append("is_allergy_product", param_data.is_allergy_product);
                formData.append("allergy_description", param_data.allergy_description);
            }

            if (param_data.is_updation_vendor_request) {
                formData.append("is_updation_vendor_request", param_data.is_updation_vendor_request);
            }



            if (param_data.is_appointment) {
                formData.append("is_appointment", param_data.is_appointment);
            }

            if (param_data.calories) {
                formData.append("calories", param_data.calories);
            }

            for (var i = 0; i < param_data.image.length; i++) {
                //add each file to the form data and iteratively name them
                formData.append("image[]", param_data.image[i]);
            }

            if ([5, 6, 7].includes($rootScope.app_type)) {
                formData.append("interval_flag", param_data.interval_flag);
            }

            if (param_data.recipe_pdf) {
                console.log(param_data.recipe_pdf)

                formData.append("recipe_pdf", param_data.recipe_pdf);
            }

            if ($rootScope.isProductCustomTabDescriptionEnable) {
                if (!!param_data['product_desc'] && param_data['product_desc'].length) {
                    param_data['product_desc'].forEach(col => {
                        formData.append(col.label, col.value);
                    })
                }
            }

            if (param_data.service_for && $rootScope.show_gender_category_dropdown == 1) {
                formData.append("service_for", param_data.service_for);
            }

            let api = '';
            if ($rootScope.profile == 'ADMIN') {
                api = '/v1/add_supplier_branch_product';
            } else if ($rootScope.profile === 'SUPPLIER' || $rootScope.profile === 'BRANCH') {
                api = '/v1/add_supplier_branch_product_by_supplier';
            }

            $http({
                method: "POST",
                url: constants.BASEURL + api,
                headers: {
                    'Content-Type': undefined,
                    'Authorization': constants.ACCESSTOKEN,
                    'secretdbkey': constants.SECRET_DBKEY
                },
                data: formData,

            }).then(function (response) {
                let data = response.data;
                $scope.is_loader = 0;
                if (data.status == constants.SUCCESS) {
                    callback(data);
                } else {
                    factories.invalidDataPop(data.message);
                }
            }, function (error) {
                $scope.is_loader = 0;
                factories.invalidDataPop("We are working on it, will be back after some time ");
            });
        };

        this.listProducts = function ($scope, param_data, callback) {

            var data = {};
            data.accessToken = constants.ACCESSTOKEN;
            data.sectionId = param_data.section_id;
            data.categoryId = param_data.categoryId;
            data.subCategoryId = param_data.subCategoryId;
            data.detailedSubCategoryId = param_data.detailedSubCategoryId;
            data.limit = param_data.limit;
            data.offset = param_data.offset;
            data.serachText = param_data.serachText;
            data.serachType = param_data.serachType;
            if (param_data.language_id) {
                data.language_id = param_data.language_id;
            }

            let api = '';
            if ($rootScope.profile == 'ADMIN') {
                api = '/list_products';
            } else if ($rootScope.profile === 'SUPPLIER' || $rootScope.profile === 'BRANCH') {
                api = '/list_admin_products';
            }

            $http({
                method: 'POST',
                url: constants.BASEURL + api,
                contentType: 'application/json',
                data: data
            }).then(function (response) {
                let data = response.data;
                if (data.status == constants.SUCCESS) {
                    callback(data.data);
                } else {
                    factories.invalidDataPop(data.message);
                }
            }, function (error) {
                factories.invalidDataPop("We are working on it, will be back after some time ");
            });
        };

        this.listSupBranchProducts = function ($scope, param_data, callback) {

            var data = {};
            data.accessToken = constants.ACCESSTOKEN;
            data.sectionId = param_data.section_id;
            data.branchId = param_data.branchId;
            data.categoryId = param_data.categoryId;
            data.subCategoryId = param_data.subCategoryId;
            data.detailedSubCategoryId = param_data.detailedSubCategoryId;
            data.limit = param_data.limit;
            data.offset = param_data.offset;
            data.serachText = param_data.serachText;
            data.serachType = param_data.serachType;
            if (param_data.tagText) data.tagText = param_data.tagText;

            data.language_id = param_data.language_id

            let api = '';
            if ($rootScope.profile == 'ADMIN') {
                if (!$rootScope.variant_object_to_array) {
                    api = '/v1/list_supplier_branch_products';
                }
                else {
                    api = '/list_supplier_branch_products';
                }

            } else if ($rootScope.profile === 'SUPPLIER' || $rootScope.profile === 'BRANCH') {
                if (!$rootScope.variant_object_to_array) {
                    api = '/v1/list_supplier_branch_products_by_supplier';
                }
                else {
                    api = '/list_supplier_branch_products_by_supplier';
                }
            }

            $http({
                method: 'POST',
                url: constants.BASEURL + api,
                contentType: 'application/json',
                data: data
            }).then(function (response) {
                let data = response.data;
                $scope.is_loader = 0;
                if (data.status == constants.SUCCESS) {
                    callback(data.data);
                } else {
                    factories.invalidDataPop(data.message);
                }
            }, function (error) {
                $scope.is_loader = 0;
                factories.invalidDataPop("We are working on it, will be back after some time ");
            });
        };

        this.supplierMaroofRegistertion = function ($scope, param_data, callback) {
            var formData = new FormData();
            formData.append("accessToken", constants.ACCESSTOKEN);
            formData.append("categoryIds", param_data.categoryIds);
            formData.append("supplierName", param_data.supplierName);
            formData.append("supplierAddress", param_data.supplierAddress);
            formData.append("supplierMobileNo", param_data.supplierMobileNo);
            formData.append("supplierEmail", param_data.supplierEmail);
            formData.append("latitude", param_data.latitude);
            formData.append("longitude", param_data.longitude);
            formData.append("is_multibranch", param_data.is_multibranch);
            formData.append("self_pickup", param_data.self_pickup);
            formData.append("country_code", param_data.country_code);
            formData.append("iso", param_data.iso);
            formData.append("supplierNameOl", param_data.supplierNameOl);
            formData.append("commission", param_data.commission);
            formData.append("pickupCommision", param_data.pickupCommision);
            formData.append("supplier_tags", param_data.supplier_tags);
            formData.append("authSectionId", 36);


            if ($rootScope.enable_business_name == 1) {
                formData.append('business_name', param_data.business_name);
            }
            if ($rootScope.enable_rfc_number == 1) {
                formData.append('rfc', param_data.rfc);
            }
            if ($rootScope.enable_trade_name == 1) {
                formData.append('trade_name', param_data.trade_name);
            }

            if (param_data.home_chef_orignal_name) {
                formData.append("home_chef_orignal_name", param_data.home_chef_orignal_name);
            }
            if (param_data.home_address) {
                formData.append("home_address", param_data.home_address);
            }
            if (param_data.license_issue_date) {
                formData.append("license_issue_date", param_data.license_issue_date);
            }
            if (param_data.license_end_date) {
                formData.append("license_end_date", param_data.license_end_date);
            }
            if (param_data.license_document) {
                formData.append("license_document", param_data.license_document);
            }
            if (param_data.license_number) {
                formData.append("license_number", param_data.license_number);
            }

            if ($rootScope.enable_maroof_password_supplier_reg == 1) {
                formData.append("cr_number", param_data.cr_number);
                formData.append("id_number", param_data.id_number);
                // formData.append("password", param_data.supplierpassword);
            }

            if (param_data.description) {
                formData.append("description", param_data.description);
            }

            if (param_data.trade_license) {
                formData.append("trade_license", param_data.trade_license);
            }
            if (param_data.photo_identification) {
                formData.append("photo_identification", param_data.photo_identification);
            }
            if (param_data.account_number) {
                formData.append("account_number", param_data.account_number);
            }
            if (param_data.transit_number) {
                formData.append("transit_number", param_data.transit_number);
            }
            if (param_data.institution_number) {
                formData.append("institution_number", param_data.institution_number);
            }

            if ($rootScope.enable_otp_at_supplier_registration == 1) {
                formData.append("otpStatus", param_data.otpStatus);
            }

            if ($rootScope.enable_maroof_password_supplier_reg == 1 && param_data.maroof_image) {
                formData.append("maroof_image", param_data.maroof_image);
                }

            var api = '/v3/reg_supplier_directly';

            $http({
                method: "POST",
                url: constants.BASEURL + api,
                headers: {
                    'Content-Type': undefined,
                    'secretdbkey': constants.SECRET_DBKEY
                },
                data: formData,

            }).then(function (response) {
                let data = response;

                $scope.is_loader = 0;
                if (data) {
                    callback(data);
                } else {
                    factories.invalidDataPop(data.message);
                }
            }, function (error) {
                $scope.is_loader = 0;
                factories.invalidDataPop("We are working on it, will be back after some time ");
            });
        };

        this.changeSupplierCatOrder = function (param_data, callback) {
            $http({
                method: 'POST',
                url: constants.BASEURL + '/order_by_category_of_supplier',
                contentType: 'application/json',
                data: param_data
            }).then(function (response) {
                let data = response.data;
                if (!!data && [4, 200].includes(data.status)) {
                    callback(data);
                } else {
                    if (data.message) factories.invalidDataPop(data.message);
                }
            }, function (error) {
                factories.invalidDataPop("We are working on it, will be back after some time ");
            });
        }

        this.changeSupplierCatOrderBySupplier = function (param_data, callback) {
            $http({
                method: 'POST',
                url: constants.BASEURL + '/order_by_category_by_supplier',
                contentType: 'application/json',
                data: param_data
            }).then(function (response) {
                let data = response.data;
                if (!!data && [4, 200].includes(data.status)) {
                    callback(data);
                } else {
                    if (data.message) factories.invalidDataPop(data.message);
                }
            }, function (error) {
                factories.invalidDataPop("We are working on it, will be back after some time ");
            });
        }

        this.supplierRegistertion = function ($scope, param_data, callback) {

            var formData = new FormData();
            // formData.append("accessToken", constants.ACCESSTOKEN);
            formData.append("categoryIds", param_data.categoryIds);
            formData.append("supplierName", param_data.supplierName);
            formData.append("supplierAddress", param_data.supplierAddress);
            formData.append("supplierMobileNo", param_data.supplierMobileNo);
            formData.append("supplierEmail", param_data.supplierEmail);
            formData.append("latitude", param_data.latitude);
            formData.append("longitude", param_data.longitude);
            formData.append("is_multibranch", param_data.is_multibranch);
            formData.append("self_pickup", param_data.self_pickup);
            formData.append("country_code", param_data.country_code);
            formData.append("iso", param_data.iso);
            formData.append("is_dine_in", param_data.is_dine_in);
            if ($rootScope.enable_business_name == 1) {
                formData.append('business_name', param_data.business_name);
            }
            if ($rootScope.enable_rfc_number == 1) {
                formData.append('rfc', param_data.rfc);
            }
            if ($rootScope.enable_trade_name == 1) {
                formData.append('trade_name', param_data.trade_name);
            }

            if (param_data.home_chef_orignal_name) {
                formData.append("home_chef_orignal_name", param_data.home_chef_orignal_name);
            }
            if (param_data.home_address) {
                formData.append("home_address", param_data.home_address);
            }
            if (param_data.license_issue_date) {
                formData.append("license_issue_date", param_data.license_issue_date);
            }
            if (param_data.license_end_date) {
                formData.append("license_end_date", param_data.license_end_date);
            }
            if (param_data.license_document) {
                formData.append("license_document", param_data.license_document);
            }
            if (param_data.license_number) {
                formData.append("license_number", param_data.license_number);
            }

            if ($rootScope.enable_maroof_password_supplier_reg == 1) {
                formData.append("cr_number", param_data.cr_number);
                formData.append("id_number", param_data.id_number);
                formData.append("password", param_data.supplierpassword);
            }

            if (param_data.description) {
                formData.append("description", param_data.description);
            }

            for (var i = 0; i < param_data.documents.length; i++) {
                //add each file to the form data and iteratively name them
                formData.append("documents[]", param_data.documents[i]);
            }
            if (param_data.trade_license) {
                formData.append("trade_license", param_data.trade_license);
            }
            if (param_data.photo_identification) {
                formData.append("photo_identification", param_data.photo_identification);
            }
            if (param_data.account_number) {
                formData.append("account_number", param_data.account_number);
            }
            if (param_data.transit_number) {
                formData.append("transit_number", param_data.transit_number);
            }
            if (param_data.institution_number) {
                formData.append("institution_number", param_data.institution_number);
            }

            if ($rootScope.enable_otp_at_supplier_registration == 1) {
                formData.append("otpStatus", param_data.otpStatus);
            }

            if ($rootScope.enable_maroof_password_supplier_reg == 1 && param_data.maroof_image) {
                formData.append("maroof_image", param_data.maroof_image);
                }

            var api = '/common/supplier_register';

            $http({
                method: "POST",
                url: constants.BASEURL + api,
                headers: {
                    'Content-Type': undefined,
                    'secretdbkey': constants.SECRET_DBKEY
                },
                data: formData,

            }).then(function (response) {
                let data = response;

                $scope.is_loader = 0;
                if (data) {
                    callback(data);
                } else {
                    factories.invalidDataPop(data.message);
                }
            }, function (error) {
                $scope.is_loader = 0;
                factories.invalidDataPop("We are working on it, will be back after some time ");
            });
        };
        this.resendSupplierOtpRequest = function ($scope, obj, callback) {

            var formData = {};
                formData.supplierEmail = obj.supplierEmail;
                formData.supplierMobileNo = obj.supplierMobileNo;
                formData.country_code = obj.country_code
                var api = '/v2/reg_supplier_directly_resend_otp';
    
                $http({
                    method: "GET",
                    url: constants.BASEURL + api,
                    headers: {
                        'secretdbkey': constants.SECRET_DBKEY
                    },
                    params: formData,
    
                }).then(function (response) {
                    let data = response;
    
                    $scope.is_loader = 0;
                    // if (data) {
                        callback(data);
                    // } else {
                    //     factories.invalidDataPop('Please retry');
                    // }
                }, function (error) {
                    $scope.is_loader = 0;
                    factories.invalidDataPop("We are working on it, will be back after some time ");
                });
            };
        this.supplierOtpRequest = function ($scope, obj, callback) {

        var formData = {};
            formData.mobileNo = obj.mobileNo;
            formData.verifyotp = obj.verifyotp;
            var api = '/v2/reg_supplier_directly_verify';

            $http({
                method: "GET",
                url: constants.BASEURL + api,
                headers: {
                    'secretdbkey': constants.SECRET_DBKEY
                },
                params: formData,

            }).then(function (response) {
                let data = response;

                $scope.is_loader = 0;
                // if (data) {
                    callback(data);
                // } else {
                //     factories.invalidDataPop('Please retry');
                // }
            }, function (error) {
                $scope.is_loader = 0;
                factories.invalidDataPop("We are working on it, will be back after some time ");
            });
        };

        this.changeBranchProdutOrder = function (param_data, callback) {
            $http({
                method: 'POST',
                url: constants.BASEURL + '/order_by_supplier_branch_product',
                contentType: 'application/json',
                data: param_data
            }).then(function (response) {
                let data = response.data;
                if (!!data && [4, 200].includes(data.status)) {
                    callback(data);
                } else {
                    if (data.message) factories.invalidDataPop(data.message);
                }
            }, function (error) {
                factories.invalidDataPop("We are working on it, will be back after some time ");
            });
        }
    }]);

Royo.factory('factories', ['$state',
    function ($state) {

        var factory = {};

        factory.getSettings = function () {
            let settings = JSON.parse(localStorage.getItem('settings_data'));
            settings.featureData = JSON.parse(localStorage.getItem('featureData'));
            if (!!settings) {
                return settings;
            } else {
                $state.go('NotFound');
            }
        }

        factory.IsJsonString = function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }

        factory.permissions = function (section, type) {
            if (!!localStorage.getItem('section_data') && (localStorage.getItem('is_subscription_plan') == 0 || localStorage.getItem('profile_type') == 'ADMIN')) {
                const permissions = JSON.parse(localStorage.getItem('section_data'));
                const is_super_admin = localStorage.getItem('is_superAdmin');
                if (is_super_admin == 0) {
                    let permission = permissions.find(el => (el.section_category_name).toLowerCase() === section.toLowerCase());
                    if (!!permission) {
                        let sub_secton = (permission.admin_section).find(el => (el.section_name).toLowerCase() === type.toLowerCase());
                        if (!!sub_secton) {
                            return sub_secton.is_assign;
                        } else return 0;
                    } else return 0;
                } else return 1;
            } else if (localStorage.getItem('is_subscription_plan') == 1 && localStorage.getItem('profile_type') == 'SUPPLIER') {
                if (['promotions', 'catalogue', 'product', 'banners'].includes(section)) {
                    // if (localStorage.getItem('is_subscription_plan') != 1) {
                    //     return 0;
                    // }
                    if (!localStorage.getItem('supplierSubscription')) return 0;
                    const plan = JSON.parse(localStorage.getItem('supplierSubscription'))[0];
                    if (!plan.is_approved) return 0;

                    const permission = plan.permissions.find(el => (el.permission_name).toLowerCase() === section.toLowerCase());
                    if (!!permission) {
                        let permissionType = permission.permissionTypes.find(el => (el.permission_type_name).toLowerCase() == type.toLowerCase());
                        if (!!permissionType) {
                            return permissionType.is_active;
                        } else return 0;
                    } else return 0;
                } else return 1;
            } else return 1;
        }

        factory.getTimeFromMins = function (mins) {
            let hours = Math.floor(mins / 60);
            let remainingMinutes = mins % 60;
            if (hours < 10) {
                hours = '0' + hours;
            }
            if (remainingMinutes < 10) {
                remainingMinutes = '0' + remainingMinutes;
            }
            return hours + ":" + remainingMinutes;
        }

        factory.localisation = function (is_original = false, type = -1) {
            let settings = factory.getSettings();
            if (settings) {
                const app_type = type > -1 ? type : settings.screenFlow[0].app_type;
                const is_single_vendor = settings.screenFlow[0].is_single_vendor;

                let terminologies = {};
                let englishTerminlogies = {}
                if ((settings.key_value).terminology) {
                    let terms = JSON.parse((settings.key_value).terminology);
                    englishTerminlogies = terms.english;
                    if (localStorage.getItem('lang') === 'en') {
                        terminologies = terms.english;
                    } else {
                        terminologies = terms.other;
                    }
                }

                let obj = {
                    product: 'PRODUCT',
                    supplier: 'SUPPLIER',
                    subCategories: 'SUB CATEGORIES',
                    agent: 'AGENT',
                    brand: 'BRAND',
                    catalogue: 'CATALOGUE',
                    order: 'ORDER',
                    products: 'PRODUCTS',
                    suppliers: 'SUPPLIERS',
                    agents: 'AGENTS',
                    brands: 'BRANDS',
                    orders: 'ORDERS',
                    category: 'CATEGORY',
                    categories: 'CATEGORIES',

                    payment: 'PAYMENT',
                    cash: 'CASH',
                    total_revenue: 'TOTAL REVENUE',
                    prescription_value: 'PRESCRIPTION',
                    instruction: 'INSTRUCTIONS',

                    promotions: 'PROMOTIONS',
                    promo_code: 'PROMO CODE',

                    voucher: 'VOUCHER',
                    vouchers: 'VOUCHERS',

                    product_file_upload: 'File Upload',
                    delivery_timing: 'DELIVERY TIMINGS',
                    others_tab: 'Others',

                    search_for: 'Search For',
                    unserviceable: 'UnServiceable',

                    wishlist: 'Wishlist',
                    recommended_supplier: `Recommended Suppliers For You`,
                    complete_address: 'Complete Address',
                    cod: 'Cash On Delivery',
                    customizable: 'Customizable',
                    deliveryTo: 'Delivery To',
                    tax: 'Tax',

                    tip: 'Tip',
                    proceed: 'Proceed',
                    selfpickup: 'Self Pickup',
                    inventory: 'Inventory',

                    dashboard_pending: `Pending`,
                    dashboard_active: `Active`,
                    payment_type: `PAYMENT TYPE`,
                    flow_type_Food: 'Food',
                    flow_type_Ecommerce: 'Ecommerce',
                    flow_type_HomeService: 'HomeService',

                    download_app_text: `Download Our Apps`,
                    nationality: `Nationality`,
                    select_prescription_to_upload: "Select Prescription to upload",
                    choose: 'Choose',
                    done: 'Done',
                    revenue_detail: 'Revenue Details',
                    revenue: 'Revenue',
                    delivery_tab: 'Delivery',
                    timings: 'Timings',
                    wallet: 'Wallet',
                    loyalty_points: "Loyalty Points",
                    no_cart_data: "No Cart Data",
                    subscription: 'Subscription',
                    subscription_plans: 'Subscription Plans',
                    my_subscription: 'My Subscription',
                    cuisines: 'Cuisines',
                    license_number: 'License Number',
                    user: 'USER',
                    users: 'USERS',
                    razor_pay: 'Razor Pay',
                    braintree: 'Braintree',
                    restaurant_service_charge: 'Restaurant Service Charge',
                    service_charge: 'Restaurant Service Charge',
                    what_are_u_looking_for: "What are you looking for",
                    top_restaurants_near_you: "Top restaurants near you",
                    best_sellers: "Best Sellers",
                    tags: "Tags",
                    others: "Others",
                    preparation_time: 'PREPARATION TIME',
                    special_offers: 'Special Offers',
                    flavor_of_the_week: 'Flavor of the Week',
                    become_a_flavor: 'Become a Flavor',
                    delivery_date: 'Delivered On',
                    id_no: 'ID No.',
                    upload_documents: 'UPLOAD DOCUMENTS',
                    terms_and_conditions: 'Terms And Conditions',
                    privacy_policy: 'Privacy Policy',
                    about_us: 'About Us',
                    faq: 'FAQ',
                    cash_on_pickup: 'Cash On Pickup',
                    delivery_company: 'Shipping Panel', // 'Delivery Company',
                    delivery_companies: 'Shipping Panel', // 'Delivery Companies'
                    tip_for_driver: 'Tip For Driver',
                    documents: 'DOCUMENTS',
                    user_subscription: 'User Subscription',
                    trade_license: 'Trade/Commercial License',
                    photo_identification: 'Photo Identification',
                    flat: 'FLAT',
                    addon_types: 'TYPES',
                    addon_title: 'TITLE',
                    rate_title: 'Rating Wise',
                    rating_filter_no: "No",
                    rating_filter_yes: "Yes",
                    assign_by: 'Assign By',
                    promo_applicable_to: 'PROMO APPLICABLE ON',
                    extra_product: 'Inventory', //'Extra Product',
                    extra_products: 'Inventory', // 'Extra Product'
                    event_product_assignment: 'Event Item Assignment',
                    dine_in: 'Dine-In',
                    register_supplier: 'Register As Supplier',
                    admin_online_orders: 'TO ADMIN FOR CASH ORDERS',
                    pay_to_restaurant: 'Pay to restaurant',
                    pay_to_compnay: 'Pay to company',
                    accept_our: 'ACCEPT OUR',
                    You_want_to_delete_this_promo :'You want to delete this promo',
                    Are_you_sure:"Are you sure?",
                    received:"Received",
                    outstanding:"Outstanding",
                    user_settlement: "user", 
                    table: 'TABLE',
                    seating_capacity: 'SEATING CAPACITY'
                };

                switch (app_type) {
                    case 1:
                        obj.product = 'FOOD ITEM';
                        obj.supplier = 'RESTAURANT';
                        obj.subCategories = 'SUB CUISINE';
                        obj.agent = 'DELIVERY BOY';
                        obj.catalogue = 'MENU';
                        obj.products = 'FOOD ITEMS';
                        obj.suppliers = is_single_vendor == 1 ? 'MY PROFILE' : 'RESTAURANTS';
                        obj.agents = 'DELIVERY BOYS';
                        obj.product_file_upload = 'RECIPE UPLOAD';
                        obj.recommended_supplier = `Recommended Restaurants For You`;
                        break;
                    case 3:
                        obj.product = 'ITEM';
                        obj.supplier = 'STORE';
                        obj.agent = 'DELIVERY BOY';
                        obj.catalogue = 'GROCERY';
                        obj.products = 'ITEMS';
                        obj.suppliers = is_single_vendor == 1 ? 'MY PROFILE' : 'STORES';
                        obj.agents = 'DELIVERY BOYS';
                        obj.recommended_supplier = `Recommended Stores For You`;
                        break;
                    case 5: case 6: case 7:
                        obj.product = 'VEHICLE';
                        obj.agent = 'DRIVER';
                        obj.catalogue = 'ADD SERVICE';
                        obj.order = 'BOOKING';
                        obj.products = 'VEHICLES';
                        obj.agents = 'DRIVERS';
                        obj.orders = 'BOOKINGS';
                        break;
                    case 8: case 9: case 10:
                        obj.product = 'SERVICE';
                        obj.supplier = 'SERVICE PROVIDER';
                        obj.catalogue = 'ADD SERVICE';
                        obj.order = 'BOOKING'
                        obj.products = 'SERVICES';
                        obj.suppliers = is_single_vendor == 1 ? 'MY PROFILE' : 'SERVICE PROVIDERS';
                        obj.orders = 'BOOKINGS';
                        obj.recommended_supplier = `Recommended Service Providers For You`;
                        obj.delivered_orders = 'Booked Services';
                        obj.cancelled_orders = 'Customer Cancelled Bookings';
                        obj.delivery_date = 'Booking Completed On';
                        break;
                }


                obj.emptyCartMsg = `Please Select ${(englishTerminlogies['product'] ? englishTerminlogies['product'] : obj.product).toLowerCase()}.`
                obj.assign_selected_product = `Assign selected ${(englishTerminlogies['product'] ? englishTerminlogies['product'] : obj.product).toLowerCase()}`;
                obj.dashboard_pending_orders = `pending ${obj.orders.toLowerCase()}`;
                obj.dashboard_active_orders = `active ${obj.orders.toLowerCase()}`;
                obj.delivered_orders = `delivered ${obj.orders.toLowerCase()}`;
                obj.cancelled_orders = `customer cancelled ${obj.orders.toLowerCase()}`;
                obj.account_user_id = `${obj.user.toLowerCase()} ID`;

                obj.approved_suppliers = `approved ${(englishTerminlogies['suppliers'] ? englishTerminlogies['suppliers'] : obj.suppliers).toLowerCase()}`;
                obj.unapproved_suppliers = `unapproved ${(englishTerminlogies['suppliers'] ? englishTerminlogies['suppliers'] : obj.suppliers).toLowerCase()}`;
                obj.supplier_detail = `${(englishTerminlogies['supplier'] ? englishTerminlogies['supplier'] : obj.supplier).toLowerCase()} detail`;
                obj.delivery_company_detail = `${(englishTerminlogies['delivery_company'] ? englishTerminlogies['delivery_company'] : obj.delivery_company).toLowerCase()} detail`;

                obj.order_id = `${obj.order.toLowerCase()} No`;
                obj.order_price = `${obj.order.toLowerCase()} price`;
                obj.order_date = `${obj.order.toLowerCase()} placed on`;
                obj.branch_product_assignment = `branch ${(englishTerminlogies['product'] ? englishTerminlogies['product'] : obj.product).toLowerCase()} assignment`;
                obj.branch_products = `branch ${(englishTerminlogies['products'] ? englishTerminlogies['products'] : obj.products).toLowerCase()}`;
                obj.product_name = `${(englishTerminlogies['product'] ? englishTerminlogies['product'] : obj.product).toLowerCase()} name`;
                obj.order_detail = `${obj.order.toLowerCase()} detail`;
                obj.order_expected_date = `expected ${obj.order.toLowerCase()} date`;
                obj.product_report = `${(englishTerminlogies['product'] ? englishTerminlogies['product'] : obj.product).toLowerCase()} report`;
                obj.supplier_report = `${(englishTerminlogies['supplier'] ? englishTerminlogies['supplier'] : obj.supplier).toLowerCase()} report`;
                obj.total_orders = `Total ${obj.orders.toLowerCase()}`;
                obj.product_description = `${obj.product.toLowerCase()} Description`;

                obj.pending_orders = `pending ${obj.orders.toLowerCase()}`;
                obj.completed_orders = `completed ${obj.orders.toLowerCase()}`;

                obj.minimum_order_amount = `Minimum ${obj.order.toLowerCase()} amount`;
                obj.view_order = `view ${obj.order.toLowerCase()}`;
                // obj.supplier_detail = `${obj.supplier.toLowerCase()} detail`;
                obj.product_list = `${(englishTerminlogies['product'] ? englishTerminlogies['product'] : obj.product).toLowerCase()} list`;

                obj.order_confirmation = `${obj.order.toLowerCase()} confirmation`;
                obj.order_rejection_reason = `${obj.order.toLowerCase()} Rejection Reason`;

                obj.to_agents_for_orders = `to ${englishTerminlogies['agents'].toLowerCase()} for ${obj.orders.toLowerCase()}`;
                obj.consider_product_qty = `consider ${obj.product.toLowerCase()} quantity`;
                obj.chat_with_supplier = `chat with ${(englishTerminlogies['supplier'] || obj.supplier).toLowerCase()}`;
                obj.add_agent = `add ${(englishTerminlogies['agent'] || obj.agent).toLowerCase()}`;
                obj.agent_tips = `${(englishTerminlogies['agent'] || obj.agent).toLowerCase()} tips`;
                obj.track_all_agents = `track all ${(englishTerminlogies['agents'] || obj.agents).toLowerCase()}`;
                obj.active_agent = `active ${(englishTerminlogies['agents'] || obj.agent).toLowerCase()}`;
                obj.set_supplier_of_the_week = `set ${(englishTerminlogies['supplier'] || obj.supplier).toLowerCase()} of the week`;

                obj.agent_report = `${obj.agent} REPORT`;
                obj.order_report = `${obj.order} REPORT`;
                obj.order_amount = `${obj.order} AMOUNT`;
                obj.order_amount_net = `${obj.order} NET AMOUNT`;
                obj.order_delivery_date = `${obj.order} DELIVERY DATE`;
                obj.customer_payment_id = `CUSTOMER ${obj.payment} ID`;
                obj.customer_payment_reference_no = `CUSTOMER ${obj.payment} REFERENCE NO`;
                obj.customer_payment_source = `CUSTOMER ${obj.payment} SOURCE`;
                obj.supplier_online_orders = `TO ${(englishTerminlogies['supplier'] ? englishTerminlogies['supplier'] : obj.supplier).toUpperCase()} FOR ONLINE ORDERS`;

                obj.suppliers_near_you = `${obj.supplier.toLowerCase()} near you`;
                obj.supplier_service_fee = `${obj.supplier.toLowerCase()} service fee`;

                if (!is_original) {
                    Object.keys(terminologies).forEach(key => {
                        if (!!obj[key] && !!terminologies[key]) {
                            obj[key] = terminologies[key];
                        }
                    });
                }

                return obj;
            }
        }

        factory.productType = function (type = -1) {
            let settings = factory.getSettings();
            if (settings) {
                const app_type = type > -1 ? type : settings.screenFlow[0].app_type;
                let is_product = 1;
                switch (app_type) {
                    case 1: case 2: case 3: case 4:
                        is_product = 1;
                        break;
                    case 5: case 6: case 7: case 8: case 9: case 10:
                        is_product = 0;
                        break;
                }
                return is_product;
            }
        }

        factory.priceType = function () {
            let settings = factory.getSettings();
            if (settings) {
                const app_type = settings.screenFlow[0].app_type;
                let price_type = 0;
                switch (app_type) {
                    case 1: case 2: case 3: case 4:
                        price_type = 0;
                        break;
                    case 5: case 6: case 7: case 8: case 9: case 10:
                        price_type = 1;
                        break;
                }
                return price_type;
            }
        }

        /*************** Category Flows **************/
        //Category>Pl
        //Category>Pl>PickUpTime
        //Category>SubCategory>Pl
        //Category>SubCategory>Suppliers>SupplierInfo>Pl
        //Category>SubCategory>Suppliers>SupplierInfo>SubCategory>Pl
        //Category>Suppliers>SupplierInfo>SubCategory>Pl
        //Category>Suppliers>SupplierInfo>Pl
        //Category>PickUpTime>Suppliers>SupplierInfo>LaundryOrder
        //Category>PickUpTime>Suppliers>SupplierInfo>Pl
        //Category>PickUpTime>Suppliers>SupplierInfo>SubCategory>Pl
        //Category>PackageSL>PackageSI>PackageProducts

        factory.categoryFlow = function () {
            let settings = factory.getSettings();
            if (settings) {
                const app_type = settings.screenFlow[0].app_type;
                const is_single_vendor = settings.screenFlow[0].is_single_vendor;
                let flow = '';

                switch (app_type) {
                    case 1: case 3:
                        flow = is_single_vendor ? 'Category>Pl' : 'Category>Suppliers>SupplierInfo>SubCategory>Pl';
                        break;
                    case 4: case 8: case 9: case 10: case 5: case 6: case 7:
                        flow = is_single_vendor ? 'Category>SubCategory>Pl' : 'Category>Suppliers>SupplierInfo>SubCategory>Pl';
                        break;
                    case 2:
                        flow = 'Category>SubCategory>Pl';
                        break;
                    default:
                        flow = is_single_vendor ? 'Category>SubCategory>Pl' : 'Category>Suppliers>SupplierInfo>SubCategory>Pl';
                        break;
                }
                return flow;
            }
        }

        factory.getFinalNameOfFile = function (doc_name) {
            let file = doc_name.split('/').pop();
            let file_name = file.split('.')[0];
            let arr = file_name.split('_');
            let name = file_name.replace(`${arr.shift()}_`, '');
            return name;
        }

        factory.warningDataPop = function (message) {
            swal({
                title: "",
                text: message + " !",
                type: "warning",
                showCancelButton: false,
                confirmButtonColor: 'var(--primary-color)',
                confirmButtonText: "Ok",
                closeOnConfirm: true
            });
        };

        factory.successActionPop = function (message) {
            swal({
                title: "Successfull ..",
                text: message + " !",
                type: "success",
                showCancelButton: false,
                confirmButtonText: "Ok",
                closeOnConfirm: true
            });
        };

        factory.invalidDataPop = function (message) {

            swal({
                title: "",
                text: message + " !",
                type: "warning",
                showCancelButton: false,
                confirmButtonColor: 'var(--primary-color)', // "#36838a",
                confirmButtonText: "Ok",
                closeOnConfirm: true
            });

        };

        return factory;
    }]);

Royo.service('AuthInterceptor', function ($rootScope, constants) {
    var service = this;
    service.request = function (config) {
        const access_token = localStorage.getItem('RoyoAccessToken');
        const db_key = localStorage.getItem('dbKey');
        if (access_token) {
            config.headers.Authorization = access_token;
        }
        if (db_key) {
            config.headers.secretdbkey = db_key;
        }
        config.headers['Accept-Language'] = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en';

        return config;
    };
    service.responseError = function (response) {
        if (response.status === 401) {
            $rootScope.$broadcast('unauthorized');
        }
        return response;
    };
})

Royo.service('httpInterceptor', function ($q, $rootScope, $log) {
    var numLoadings = 0;

    return {
        request: function (config) {
            numLoadings++;
            // Show loader
            $rootScope.$broadcast("loader_show");
            return config || $q.when(config)
        },
        response: function (response) {
            setTimeout(() => {
                if ((--numLoadings) === 0) {
                    $rootScope.$broadcast("loader_hide");
                }
            }, 500);
            let res = response.data;
            if (res.status === 2 && res.message === 'You are logged in on some other machine, please log in back') {
                $rootScope.$broadcast('unauthorized');
            }
            return response || $q.when(response);
        },
        responseError: function (response) {
            setTimeout(() => {
                if (!(--numLoadings)) {
                    // Hide loader
                    $rootScope.$broadcast("loader_hide");
                }
            }, 500);
            return $q.reject(response);
        }
    };
})


Royo.service('pagerService', function () {
    this.getPager = function (totalItems, currentPage = 1, pageSize = 10) {

        // calculate total pages
        var totalPages = Math.ceil(totalItems / pageSize);

        // ensure current page isn't out of range
        if (currentPage < 1) {
            currentPage = 1;
        } else if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        var startPage, endPage;
        if (totalPages <= 5) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 3) {
                startPage = 1;
                endPage = 5;
            } else if (currentPage + 2 >= totalPages) {
                startPage = totalPages - 4;
                endPage = totalPages;
            } else {
                startPage = currentPage - 2;
                endPage = currentPage + 2;
            }
        }

        // calculate start and end item indexes
        let startIndex = (currentPage - 1) * pageSize;
        let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
        // create an array of pages to ng-repeat in the pager control
        let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }
});

// App.factory("LS", function($window, $rootScope) {
//     return {
//         setData: function (key , val) {
//             $window.localStorage && $window.localStorage.setItem(key , val);
//             return this;
//         },
//         getData: function (key) {
//             return $window.localStorage && $window.localStorage.getItem(key);
//         }
//     };
// });
