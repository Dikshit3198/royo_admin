Royo.controller('ProductVariantCtrl', ['$scope', 'services', 'factories', '$stateParams', 'pagerService', '$rootScope', 'API', 'constants',
	function ($scope, services, factories, $stateParams, pagerService, $rootScope, API, constants) {

		$scope.main = {};
		$scope.outputs = {};
		$scope.msr_unit = {};
		$scope.edit = {}; 
		$scope.commission_type = 1;
		$scope.product = {};
		$scope.description = {
			english: "",
			arabic: ""
		};
		$scope.product.commission = 0;
		$scope.product.price_type = 0;
		$scope.selected_sup_cat = {};

		$scope.quantity = '';
		$scope.parent_id = '';
		$scope.selectedVariant = {};
		$scope.variants = [];
		$scope.productData;
		$scope.variantId = '';
		$scope.status = true;

		$scope.read_more_text = '';
		$scope.message = '';
		$scope.addProduct = false;
		$scope.search = '';
		$scope.products = [];
		$scope.dataLoaded = false;
		$scope.skip = 0;
		$scope.limit = 20;
		$scope.is_edit = false;
		$scope.product.quantity = '';
		$scope.is_pricing = false;
		$scope.product_id = '';
		$scope.pricing = {
			price: '',
			discount_price: 0,
			deliveryCharges: '',
			handlingFeeAdmin: '',
			start_date: '',
			end_date: '',
			discount_start_date: '',
			discount_end_date: ''
		};
		$scope.selected_duration = 0;
		$scope.durationArr = [];
		$scope.currentPage = 1;
		$scope.is_discount = false;
		$scope.interval = factories.getSettings().bookingFlow[0].interval;
		$scope.selected_type = factories.productType();
		$scope.price_type = factories.priceType();
		$scope.rental_plan = '';
		$scope.tax = 0;

		if (factories.productType() == 1) {
			$scope.interval = 60;
		} else if ($stateParams.is_product == 0) {
			$scope.interval = factories.getSettings().bookingFlow[0].interval;
		}

		$scope.count_hours = [1];
		$scope.from_timing = [
			[]
		];
		$scope.to_timing = [
			[]
		];

		if (!!$stateParams.flow) {
			$scope.flow_type = parseInt($stateParams.flow);
			$scope.selected_type = factories.productType($scope.flow_type);
			$scope.price_type = factories.priceType($scope.flow_type);
		}

		$scope.from_timing[0] = [{
			name: factories.getTimeFromMins($scope.interval),
			value: $scope.interval
		}];

		var getTiming = function () {
			$scope.from_timing = [
				[]
			];
			$scope.to_timing = [
				[]
			];

			if ([5, 6, 7].includes($rootScope.app_type) && $scope.rental_plan == 1) {
				let i = 1
				while (i <= 30) {
					let obj = {};
					obj.name = i + (i == 1 ? ' day' : ' days');
					obj.value = i;
					$scope.from_timing[0].push(obj);
					i++;
				}
			} else {
				$scope.from_timing[0] = [{
					name: factories.getTimeFromMins($scope.interval),
					value: $scope.interval
				}];

				let i = $scope.interval * 2;
				while (i <= (24 * 60)) {
					let obj = {};
					obj.name = factories.getTimeFromMins(i);
					obj.value = i;
					$scope.to_timing[0].push(obj);
					i += $scope.interval;
				}
			}
		}

		$scope.addMoreHours = function (index) {
			if ($scope.from_hour[index] && $scope.to_hour[index] && $scope.hour_price[index]) {

				if ([5, 6, 7].includes($rootScope.app_type) && $scope.rental_plan == 1) {
					let toArr = $scope.from_timing[index].slice();
					let i = toArr.findIndex(to => {
						return to.value == parseInt($scope.from_hour[index])
					});
					toArr.splice(0, i + 1);
					$scope.from_timing[index + 1] = toArr;
					$scope.count_hours.push(index + 2);

				} else {
					let toArr = $scope.to_timing[index].slice();
					let i = toArr.findIndex(to => {
						return to.value == parseInt($scope.to_hour[index])
					})
					toArr.splice(0, i + 1);
					$scope.to_timing[index + 1] = toArr;
					$scope.from_timing[index + 1] = [{
						name: factories.getTimeFromMins($scope.to_hour[index]),
						value: parseInt($scope.to_hour[index])
					}];
					$scope.count_hours.push(index + 2);
				}

			} else {
				factories.invalidDataPop("Please enter price and duration");
			}
		}

		$scope.changeFrom = function (index) {
			if ([5, 6, 7].includes($rootScope.app_type) && $scope.rental_plan == 1) {
				$scope.to_hour[index] = $scope.from_hour[index];
			}
		}

		var clearInputs = function () {
			$scope.description = {
				english: "",
				arabic: ""
			};
			$scope.outputs = {
				inputs: {},
			};
			$scope.msr_unit = {};
			$scope.product = {};
			$scope.product.quantity = '';
			$scope.product_img1 = '';
			$scope.product_img2 = '';
			$scope.image_file = null;
			fileArr = [];
			$scope.selectedVariant = {};
			$scope.is_discount = false;
		}

		var getUserTypes = function () {
			services.GET_DATA({}, API.LIST_USER_TYPES(), function (response) {
				if (response.data.length) {
					$scope.user_type_prices = [];
					$scope.user_type_prices = (response.data).map(type => {
						return {
							name: type.type_name,
							user_type_id: type.id,
							price: '',
							discount_price: '',
						}
					});
				}
			});
		}
		if (factories.getSettings().key_value.is_user_type == 1 && factories.getSettings().key_value.user_type_check == 1) {
			getUserTypes();
		}

		$scope.changeDuration = function (type) {
			switch (type) {
				case '+':
					$scope.selected_duration += $scope.interval;
					break;
				case '-':
					if ($scope.selected_duration > 0) $scope.selected_duration -= $scope.interval;
					break;
			}
		}

		$scope.getTimeFromMins = function (mins) {
			return factories.getTimeFromMins(mins);
		}

		$scope.changeview = function (value) {
			clearInputs();
			$scope.addProduct = value;
			$scope.is_edit = false;
			$scope.is_pricing = false;
			if (value && !$scope.is_edit) {
				productDetail();
			}
		}

		$scope.productEdit = function (product) {
			$scope.productData = product;
			$scope.multiLanguageId = [];
			$scope.product_id = product.id;
			$scope.is_edit = true;
			$scope.addProduct = true;
			$scope.is_discount = false;
			// $scope.selected_type = product.is_product;
			$scope.product.quantity = product.quantity;
			$scope.product.sku = product.sku;
			$scope.product.commission = product.commission;
			$scope.commission_type = product.commission_type;
			if (product.images.length) $scope.product_img1 = product.images[0].image_path;
			if (product.images.length > 1) $scope.product_img2 = product.images[1].image_path;
			$scope.selected_duration = product.duration;
			for (var i = 0; i < $scope.productData.names.length; i++) {
				$scope.description.english = [$scope.productData.names[0].product_desc].join('');
				$scope.description.arabic = [$scope.productData.names[1].product_desc].join('');
				$scope.msr_unit[i] = $scope.productData.names[i].measuring_unit;
			}
			$scope.rental_plan = product.interval_flag;

			let params = {};
			params.sectionId = 30;
			params.category_id = $scope.productData.category_id ? $scope.productData.category_id : $scope.productData.sub_category_id;
			services.getVariantList($scope, params, function (data) {
				$scope.variants = data;
				data.forEach(variant => {
					variant.variant_values.forEach(val => {
						let i = 0;
						product.variant.forEach(element => {
							if (val.id === element.vaiant_id) {
								val['selected'] = true;
								$scope.selectedVariant[i] = val.id;
							} else {
								val['selected'] = false;
							}
							i++;
						});
					});
				});
			});
		}

		var productDetail = function () {
			let param_data = {};
			param_data.sectionId = 30;
			param_data.product_id = $scope.parent_id;

			services.POST_DATA(param_data, API.GET_PRODUCT_DETAIL(), function (response) {
				$scope.productData = response.data[0];
				if ($scope.productData) {
					for (var i = 0; i < $scope.productData.names.length; i++) {
						$scope.description.english = [$scope.productData.names[0].product_desc].join('');
						$scope.description.arabic = [$scope.productData.names[1].product_desc].join('');
						$scope.msr_unit[i] = $scope.productData.names[i].measuring_unit;
					}

					if ($scope.productData.images.length) {
						($scope.productData.images).forEach(el => {
							switch (el.imageOrder) {
								case 1:
									$scope.product_img1 = el.image_path;
									break;
								case 2:
									$scope.product_img2 = el.image_path;
									break;

							}
						});
					}

					$scope.product.sku = $scope.productData.sku;
					$scope.product.barcode = $scope.productData.bar_code;
					$scope.is_barcode = $scope.productData.is_barcode;

					if ($scope.productData.quantity) {
						$scope.product.quantity = $scope.productData.quantity;
					}
					$scope.rental_plan = $scope.productData.interval_flag;

					let params = {};
					params.sectionId = 30;
					params.category_id = $scope.productData.category_id ? $scope.productData.category_id : $scope.productData.sub_category_id;
					services.getVariantList($scope, params, function (data) {
						$scope.variants = data;
					});
				}
			});
		}

		var getCurrencyList = function () {
			var param_data = {};
			param_data.accessToken = constants.ACCESSTOKEN;
			param_data.sectionId = 30;
			services.POST_DATA(param_data, API.LIST_CURRENCIES(), function (response) {
				let currencyData = response.data;
				$scope.currencies = currencyData;
				$scope.selected_currency = currencyData[0];
			});
		};

		var productList = function (page) {

			var param_data = {};
			param_data.sectionId = 30;
			param_data.product_id = $scope.parent_id;
			param_data.limit = $scope.limit;
			param_data.offset = $scope.skip;
			if ($scope.search) param_data.serachText = $scope.search;
			param_data.serachType = $scope.search ? 1 : 0;

			services.POST_DATA(param_data, API.GET_PRODUCT_VARIANT_LIST(), function (response) {
				let product = response.data;
				if (product && product.products) {
					$scope.count = product.product_count;
					$scope.tax = product.tax;
					$scope.products = product.products;
					$scope.products.map(product => {
						product['name_en'] = product.names[0].name;
						product['desc_en'] = product.names[0].product_desc;
						if (product.price && product.price.length) {
							let regular_price = (product.price).find(el => el.price_type == 0);
							let discount_price = (product.price).find(el => el.price_type == 1);
							product['regular_price'] = regular_price ? (parseFloat(regular_price.price)).toFixed(2) : null;
							product['discount_price'] = discount_price ? (parseFloat(discount_price.price)).toFixed(2) : null;
						}
					});
					$scope.dataLoaded = true;
					$scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
					if ($stateParams.product_id) {
						let product = $scope.products.find(el => {
							return el.id == $stateParams.product_id;
						});
						if (!!product) {
							$scope.productEdit(product);
						}
					}
				}
				getCurrencyList();
			});
		};

		if ($stateParams) {
			$scope.parent_id = $stateParams.id;
			$scope.branch_id = $stateParams.branchId;
			$scope.sup_id = $stateParams.supplierId;
			if ($scope.parent_id && $stateParams.type) {
				$scope.type = $stateParams.type;
				productList(1);
			}
		}

		/*** Image Upload Function ***/
		$scope.files = [];
		var fileArr = [];

		//listen for the file selected event
		$scope.$on("fileSelected", function (event, args) {
			$scope.$apply(function () {
				//add the file object to the scope's files collection
				$scope.files.push(args.file);
			});
		});

		/* Get to be uploading file and set it into a variable and read to show it on view */
		$scope.file_to_upload_for_image = function (File, order) {
			var file = File[0];
			if (constants.IMAGE_TYPE.includes(file.type)) {
				if ((file.size / Math.pow(1024, 2)) <= 7) {
					$scope.image_file = File[0];
					var Obj = {};
					Obj.image = File[0];
					Obj.image_order = order;
					let reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = function (e) {
						$scope.$apply(function () {
							if (order == 1) {
								$scope.product_img1 = e.target.result;
							} else if (order == 2) {
								$scope.product_img2 = e.target.result;
							}
						});
					}
					var index = _.indexOf(_.pluck(fileArr, 'image_order'), Obj.image_order);
					if (index != -1) {
						fileArr[index] = Obj;
					} else {
						fileArr.push(Obj);
					}
				} else {
					factories.invalidDataPop("Image size must be less than 7mb");
				}
			} else {
				factories.invalidDataPop("Invalid File Type");
			}
		};


		var getPrice = function (product) {

			if ($scope.price_type == 1) {
				getTiming();
			}

			$scope.pricing = {
				price: 0,
				discount_price: 0,
				deliveryCharges: 0,
				handlingFeeAdmin: 0,
				start_date: '',
				end_date: '',
				discount_start_date: '',
				discount_end_date: '2099-01-01'
			}

			$scope.is_pricing_edit = false;
			$scope.pricingData = product && product.price ? product.price : [];

			if (product && product.price && product.price.length) {
				$scope.is_pricing_edit = true;
				if (factories.getSettings().key_value.is_user_type == 1 && factories.getSettings().key_value.user_type_check == 1) {
					let regular_price = (product.price).filter(el => el.price_type == 0);
					let discount_price = (product.price).filter(el => el.price_type == 1);
					$scope.user_type_prices.forEach(type => {
						if (regular_price && regular_price.length) {
							let user_price = regular_price.find(p => type.user_type_id == p.user_type_id);
							if (!!user_price) {
								type['price'] = parseFloat(user_price.price);
								type['id'] = user_price.id;
								if (discount_price && discount_price.length && $scope.is_discount) {
									let user_discount_price = discount_price.find(p => type.user_type_id == p.user_type_id);
									if (!!user_discount_price) {
										let discount_price = ((parseFloat(user_price.price) - parseFloat(user_discount_price.price)) / parseFloat(user_price.price)) * 100;
										type['discount_price'] = Math.round(discount_price);
									}
								}
							}
						}
					});

					if (discount_price && discount_price.length && $scope.is_discount) {
						$scope.pricing.discount_end_date = moment(discount_price[0].end_date).format('YYYY-MM-DD');
						setTimeout(() => {
							$scope.discount_end_date_picker.setDate(discount_price[0].end_date);
						}, 200);
					}

				} else {
					let regular_price = (product.price).find(el => el.price_type == 0);
					let discount_price = (product.price).find(el => el.price_type == 1);
					if (!!regular_price) {
						if ($scope.price_type == 0) {
							$scope.pricing = {
								price: parseFloat(regular_price.price),
								deliveryCharges: regular_price.delivery_charges,
								handlingFeeAdmin: regular_price.handling,
							}
						} else if ($scope.price_type == 1) {
							let index = 0;
							$scope.count_hours = [];
							$scope.from_hour = [];
							$scope.to_hour = [];
							$scope.hour_price = [];

							let priceArr = JSON.parse(regular_price.price);
							if (priceArr && priceArr.length) {
								priceArr.forEach(price => {
									$scope.from_hour[index] = parseInt(price.min_hour);
									$scope.to_hour[index] = parseInt(price.max_hour);
									$scope.hour_price[index] = parseInt(price.price_per_hour);
									if (index + 1 < priceArr.length) {
										let to_timings = [];
										let toArr = [];
										to_timings = ($scope.to_timing).slice();
										toArr = (to_timings[index]).slice();
										let i_to = toArr.findIndex(to => {
											return to.value == price.max_hour
										});
										if (i_to > -1) {
											$scope.from_timing[index + 1] = [toArr[i_to]];
											toArr.splice(0, i_to + 1);
											$scope.to_timing[index + 1] = toArr;
										}
									}
									$scope.count_hours.push(index + 1);
									index++;
								});
							}
						}
					}

					if (!!discount_price && product.price.length > 1) {
						let discount_value = 0;
						if (discount_price.pricing_type == 1) {
							let priceArr = JSON.parse(discount_price.price);
							let priceObj = priceArr[0];
							discount_value = ((parseFloat(priceObj.price_per_hour) - parseFloat(priceObj.discount_price)) / parseFloat(priceObj.price_per_hour)) * 100;
						} else {
							discount_value = ((parseFloat(regular_price.price) - parseFloat(discount_price.price)) / parseFloat(regular_price.price)) * 100;
						}
						$scope.pricing.discount_price = Math.round(discount_value);
						$scope.pricing.discount_start_date = moment(discount_price.start_date).format('YYYY-MM-DD');
						$scope.pricing.discount_end_date = moment(discount_price.end_date).format('YYYY-MM-DD');
						if (!!$scope.discount_end_date_picker) {
							setTimeout(() => {
								$scope.discount_end_date_picker.setDate(discount_price.end_date);
							}, 200);
						}
					}
					if ($scope.is_discount && !!discount_price) {
						$scope.pricing_id = discount_price.id;
					} else if (!$scope.is_discount && !!regular_price) {
						$scope.pricing_id = regular_price.id;
					}
				}
			} else {
				if (factories.getSettings().key_value.is_user_type == 1 && factories.getSettings().key_value.user_type_check == 1) {
					$scope.user_type_prices.forEach(el => {
						el.price = 0;
					});
				}
			}
		}

		$scope.editPrice = function (product, is_discount) {
			$("#edit_pricing_modal").modal('show');
			$scope.addProductPriceForm.$setPristine();
			if (is_discount) {
				setTimeout(() => {
					document.getElementById("discount_end_date").value = '';
					$scope.discount_end_date_picker = new Lightpick({
						field: document.getElementById('discount_end_date'),
						minDate: new Date(),
						format: 'DD-MM-YYYY',
						repick: true,
						onSelect: function (date) {
							if (date) {
								$scope.pricing.discount_end_date = date.format('YYYY-MM-DD');
							}
						}
					});
				}, 100);
			}
			$scope.is_discount = is_discount;
			$scope.product_id = product['id'];
			$scope.rental_plan = product.interval_flag;
			// $scope.selected_duration = product.duration;
			// $scope.price_type = product.pricing_type;
			getPrice(product);
		}

		var afterSubmit = function () {
			$scope.is_pricing = true;
			$scope.message = `${factories.localisation().product} has been ${$scope.is_edit ? 'updated' : 'created'} successfully.`
			services.SUCCESS_MODAL(true);
			$scope.is_edit ? getPrice($scope.productData) : getPrice();
		}

		/*** ===================== Submit ===================== ***/
		$scope.submitAdd = function (addVariantForm) {
			let varaintArr = [];
			if (addVariantForm.$submitted && addVariantForm.$invalid) return;

			if (!Object.values($scope.selectedVariant).length) {
				factories.invalidDataPop("Please select a variant");
				return;
			}

			if ($rootScope.not_all_variant_required == 1) {
				Object.values($scope.selectedVariant).forEach(col => {
					if (!!col) {
						varaintArr.push(col);
					}
				})
				if (!varaintArr.length) {
					factories.invalidDataPop("Please select a variant");
					return;
				}
			}

			var Images = [];
			var ImageOrder = [];
			let delete_order = [];
			fileArr.map((el, index) => {
				Images.push(el.image);
				ImageOrder.push(el.image_order);
				if ($scope.is_edit && !!el.image) {
					delete_order.push(el.image_order);
				}
			});

			if ($scope.description.english == "" || $scope.description.arabic == "") {
				factories.invalidDataPop("Product description can not be empty ");
				return false;
			}

			var param_data = {};
			param_data.section_id = 30;
			param_data.categoryId = $scope.productData.category_id;
			param_data.subCategoryId = $scope.productData.sub_category_id;
			param_data.detailedSubCategoryId = $scope.productData.detailed_sub_category_id;
			param_data.name = $scope.productData.names[0].name + '#' + $scope.productData.names[1].name;
			param_data.description = $scope.description.english + "#" + $scope.description.arabic;
			param_data.languageId = $scope.productData.names[0].language_id + '#' + $scope.productData.names[1].language_id;
			param_data.priceUnit = 1;
			param_data.measuringUnit = $scope.productData.names[0].measuring_unit + '#' + $scope.productData.names[1].measuring_unit;
			// param_data.sku = $scope.product.sku;
			param_data.sku = 0;
			if ($scope.barcode) {
				param_data.barCode = $scope.product.barcode;
			} else {
				if ($scope.productData.is_barcode) param_data.barCode = $scope.productData.bar_code;
			}
			param_data.commissionType = 0;
			param_data.commission = 0;
			param_data.pricing_type = 0;
			param_data.commissionPackage = $scope.productData.commission_package;
			param_data.Count = Images.length;
			param_data.image = Images;
			param_data.imageOrder = ImageOrder;
			param_data.quantity = [8, 9, 10].includes($rootScope.app_type) || ($rootScope.app_type > 10 && [8, 9, 10].includes($scope.flow_type)) ? 1000 : $scope.product.quantity;
			param_data.parent_id = $scope.parent_id;
			param_data.variant_id = $rootScope.not_all_variant_required == 0 ? Object.values($scope.selectedVariant) : varaintArr;
			param_data.type = $scope.type;
			param_data.duration = $scope.selected_duration;

			if ($scope.type === 'branch') {
				param_data.branchId = $stateParams.branchId;
			} else if ($scope.type === 'supplier') {
				param_data.supplierId = $stateParams.supplierId;
			}

			if ($scope.is_edit) {
				param_data.deleteOrder = delete_order.join();
				param_data.is_product = 1;
				param_data.productId = $scope.productData.id;
				services.editAdminProduct($scope, param_data, function (data) {
					afterSubmit();
				});
			} else {
				services.addProductVariant($scope, param_data, function (data) {
					$scope.product_id = data.data.productId;
					afterSubmit();
				});
			}
		};

		var discountPrice = function (PRICE_ARR) {
			let price = 0;
			if ($scope.price_type == 1 && PRICE_ARR.length) {
				PRICE_ARR.map(charge => {
					charge['discount_price'] = 0;
					if ($scope.pricing.discount_type == 1) {
						charge['discount_price'] = charge.price_per_hour - (charge.price_per_hour * ($scope.pricing.discount_amount / 100));
					} else {
						charge['discount_price'] = charge.price_per_hour - $scope.pricing.discount_amount;
					}
				});
				price = JSON.stringify(PRICE_ARR);
			} else {
				price = $scope.pricing.price - (($scope.pricing.discount_price * $scope.pricing.price) / 100);
			}
			return price;
		}

		var afterPricing = function () {
			$scope.pricing = {};
			productList(1);
			$scope.changeview(false);
			$("#edit_pricing_modal").modal('hide');
			$scope.message = `${factories.localisation().product} price has been updated successfully.`;
			services.SUCCESS_MODAL(true);
		}

		$scope.submitPricingType = function (type) {
			$scope.selected_pricing_type = type;
		}

		$scope.submitPricing = function (addProductPriceForm) {

			if (addProductPriceForm.$submitted && addProductPriceForm.$invalid) return;

			let is_user_type = factories.getSettings().key_value.is_user_type && factories.getSettings().key_value.user_type_check == 1 ? factories.getSettings().key_value.is_user_type : 0;

			let PRICE_ARR = [];
			if ($scope.price_type == 1) {
				for (let index = 0; index < $scope.hour_price.length; index++) {
					let Obj = {};
					Obj.min_hour = $scope.from_hour[index];
					Obj.max_hour = $scope.to_hour[index];
					Obj.price_per_hour = $scope.hour_price[index];
					PRICE_ARR.push(Obj);
				}
			}

			let param_data = {};
			param_data.section_id = 30;
			param_data.productId = $scope.product_id;
			param_data.handling_fee_admin = $scope.tax;
			param_data.delivery_charges = $scope.pricing.deliveryCharges ? $scope.pricing.deliveryCharges : 0;
			param_data.id = $stateParams.branchId ? $stateParams.branchId : $stateParams.supplierId;
			param_data.start_date = '2000-01-01';
			param_data.end_date = '2099-01-01';
			param_data.offer_type = +$scope.is_discount;
			param_data.pricing_type = $scope.price_type;

			let regular_price = [];
			let discount_price = [];
			if (is_user_type == 1) {
				regular_price = ($scope.pricingData).filter(el => el.price_type == 0);
				discount_price = ($scope.pricingData).filter(el => el.price_type == 1);
			}

			if ($scope.price_type == 1) {
				param_data.price = JSON.stringify(PRICE_ARR);
				param_data.displayPrice = JSON.stringify(PRICE_ARR);
			} else {
				if (is_user_type == 1) {
					let user_type_price = [];
					let user_type_discount_price = [];
					user_type_price = $scope.user_type_prices.map(type => {
						let price_obj = {
							startDate: '2000-01-01',
							offerType: +$scope.is_discount,
							user_type_id: type.user_type_id
						};

						if ($scope.is_pricing_edit && regular_price.length && (!$scope.is_discount || (discount_price.length && $scope.is_discount))) {
							price_obj['productPricingId'] = type.id;
						}
						if ($scope.is_pricing_edit && $scope.is_discount && discount_price.length) {
							price_obj['endDate'] = $scope.pricing.discount_end_date;
							price_obj['price'] = type.price - ((type.discount_price * type.price) / 100);
							price_obj['displayPrice'] = type.price - ((type.discount_price * type.price) / 100);
						} else {
							price_obj['endDate'] = '2099-01-01';
							price_obj['price'] = type.price;
							price_obj['displayPrice'] = type.price;
						}
						return price_obj;
					});

					if ($scope.is_pricing_edit && $scope.is_discount && regular_price.length && !discount_price.length) {
						user_type_discount_price = $scope.user_type_prices.map(type => {
							return {
								discountEndDate: $scope.pricing.discount_end_date,
								discountStartDate: '2000-01-01',
								discountPrice: type.price - ((type.discount_price * type.price) / 100),
								startDate: '2000-01-01',
								endDate: $scope.pricing.discount_end_date,
								offerType: +$scope.is_discount,
								user_type_id: type.user_type_id,
								price: type.price,
								displayPrice: type.price
							}
						});
						param_data.discountPrice = user_type_discount_price;
					}

					param_data.price = user_type_price;
					param_data.displayPrice = 0;
				} else {
					param_data.price = $scope.pricing.price;
					param_data.displayPrice = $scope.pricing.price;
				}
			}

			if ($scope.is_pricing_edit) {
				if ((($scope.pricingData.length < 2 && is_user_type == 0) || (is_user_type == 1 && !discount_price.length && regular_price.length)) && $scope.is_discount) {
					if ($scope.pricing.discount_price > 99) {
						factories.invalidDataPop("Discount cannot be more than 99%");
						return;
					}
					param_data.discountStartDate = '2000-01-01';
					param_data.discountEndDate = $scope.pricing.discount_end_date;
					if (is_user_type == 0) {
						param_data.discountPrice = discountPrice(PRICE_ARR);
					}
					services.addProductPricing($scope, param_data, function (data) {
						afterPricing($scope.selected_pricing_type);
					});
				} else if ((($scope.pricingData.length < 1 && is_user_type == 0) || (is_user_type == 1 && !regular_price.length && !discount_price.length)) && !$scope.is_discount) {
					services.addProductPricing($scope, param_data, function (data) {
						afterPricing($scope.selected_pricing_type);
					});
				} else {
					param_data.productPricingId = $scope.pricing_id ? $scope.pricing_id : 0;
					if ($scope.is_discount) {
						if ($scope.pricing.discount_price > 99) {
							factories.invalidDataPop("Discount cannot be more than 99%");
							return;
						}
						param_data.price = discountPrice(PRICE_ARR);
						param_data.displayPrice = discountPrice(PRICE_ARR);
						param_data.start_date = '2000-01-01';
						param_data.end_date = $scope.pricing.discount_end_date;
					}
					services.editProductPricing($scope, param_data, function (data) {
						afterPricing($scope.selected_pricing_type);
					});
				}
			} else {
				services.addProductPricing($scope, param_data, function (data) {
					afterPricing($scope.selected_pricing_type);
				});
			}
		}

		$scope.deleteProduct = function (Id) {
			services.CONFIRM(`YOU WANT TO DELETE THIS ${factories.localisation().product}`,
				function (isConfirm) {
					if (isConfirm) {
						if (typeof Id == "number") {
							Id = Id.toString();
						}
						var param_data = {};
						param_data.accessToken = constants.ACCESSTOKEN;
						param_data.productId = Id;
						param_data.sectionId = 30;

						services.POST_DATA(param_data, API.DELETE_PRODUCT(), function (response) {
							$scope.message = `${factories.localisation().product} Has Been Deleted Successfully`;
							productList(1);
							services.SUCCESS_MODAL(true);
						});
					}
				});
		};

		$scope.refresh = function () {
			$scope.currentPage = 1;
			$scope.skip = 0;
			productList(1);
		}

		$scope.setPage = function (page) {
			$scope.currentPage = page;
			$scope.skip = $scope.limit * (page - 1);
			productList(page);
		}

		$scope.viewDescription = function (text) {
			$scope.read_more_text = text;
			$("#readMore").modal('show');
		}

	}
]);