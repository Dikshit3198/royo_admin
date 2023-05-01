Royo.controller('productReportCtrl', ['$scope', '$rootScope', 'services', 'pagerService', 'API', 'constants', '$window', 'factories',
  function ($scope, $rootScope, services, pagerService, API, constants, $window, factories) {

    $rootScope.active_report_tab = 5;
    $scope.skip = 0;
    $scope.limit = 20;
    $scope.suppliers = [];
    $scope.count = 0;
    $scope.dataLoaded = false;
    $scope.selected_supplier;
    $scope.products = [];
    $scope.is_admin = 0;
    $scope.sort_by = '';
    $scope.supplier_id = '';
    $scope.catIdArr = [];
    $scope.selected_det_sub_cat = '';
    $scope.is_filter_to_list = 0;
    $scope.series = ['Series A'];
    $scope.totalOrders = [];
    $scope.totalRevenue = [];
    $scope.no_orders = true;
    $scope.no_revenue = true;
    $scope.endDate = moment().format("YYYY-MM-DD");
    $scope.startDate = moment($scope.endDate).subtract(6, 'days').format("YYYY-MM-DD");

    var datepicker = function () {
      setTimeout(() => {
        var picker = new Lightpick({
          field: document.getElementById("datepicker_supplier_report"),
          singleDate: false,
          onSelect: function (start, end) {
            if (start && end) {
              $scope.startDate = start.format('YYYY-MM-DD');
              $scope.endDate = end.format('YYYY-MM-DD');
            }
          }
        });
      }, 500);
    }
    datepicker();

    var chartColorSets = function () {
      let backgroundColor = [];
      let hoverBackgroundColor = [];
      let hoverBorderColor = [];

      for (var d = 0; d <= (moment($scope.endDate)).diff(moment($scope.startDate), 'days'); d++) {
        backgroundColor.push($rootScope.primary_color);
        hoverBackgroundColor.push($rootScope.primary_color);
        hoverBorderColor.push($rootScope.primary_color);
      }

      $scope.datasetOverride = {
        backgroundColor: backgroundColor,
        hoverBackgroundColor: hoverBackgroundColor,
        hoverBorderColor: hoverBorderColor
      };
    }

    var chartSettings = function () {
      $scope.options = {
        cornerRadius: 12,
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            }
          }],
          yAxes: [
            {
              id: 'y-axis',
              type: 'linear',
              display: false,
              position: 'left',
              gridLines: {
                display: false
              },
              ticks: {
                beginAtZero: true
              }
            },
          ],
        },
      }

      chartColorSets();
    }

    $scope.sortBy = function (sort_by) {
      $scope.sort_by = sort_by;
    }

    var getSuppliers = function () {
      let params = {
        limit: 0,
        offset: 0,
        is_active: 1,
        search: '',
        is_desc: 0,
        order_by: 0
      }

      if (!!localStorage.getItem('data_country')) {
        let country_data = localStorage.getItem('data_country').split(',');
        params.country_code = country_data[0];
        params.country_code_type = country_data[1];
      }

      services.GET_DATA(params, API.SUPPLIER_LIST, function (response) {
        $scope.suppliers = response.data.suppliersList;
      });
    }
    if ($rootScope.profile === 'ADMIN') {
      getSuppliers();
    }

    $scope.changeSupplier = function (selected_supplier) {
      $scope.supplier_id = selected_supplier ? selected_supplier.id : 0;
    }

    var generateGraph = function (data) {
      chartSettings();

      if (!data.total_revenue && !data.total_product) return;

      for (var d = 0; d <= (moment($scope.endDate)).diff(moment($scope.startDate), 'days'); d++) {
        let date = moment($scope.startDate).add(d, 'days');
        $scope.labels.unshift(moment(date).format("MMM DD"));

        let revenueData = data.total_revenue.find(data => moment(data.created_at).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD"));
        let orderData = data.total_product.find(data => moment(data.created_at).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD"));

        if (!!revenueData) {
          $scope.totalRevenue.unshift((revenueData.revenue).toFixed(2));
        } else {
          $scope.totalRevenue.unshift(0);
        }

        if (!!orderData) {
          $scope.totalOrders.unshift((orderData.total_product).toFixed(2));
        } else {
          $scope.totalOrders.unshift(0);
        }
      }

      $scope.no_orders = $scope.totalOrders.find(data => data) ? false : true;
      $scope.no_revenue = $scope.totalRevenue.find(data => data) ? false : true;

      $scope.totalOrders = $scope.totalOrders.reverse();
      $scope.totalRevenue = $scope.totalRevenue.reverse();
      $scope.labels = $scope.labels.reverse();
    }

    var getReportData = function (page) {
      $scope.labels = [];
      $scope.totalOrders = [];
      $scope.totalRevenue = [];

      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.sectionId = 45;
      param_data.offset = $scope.skip;
      param_data.limit = $scope.limit;
      param_data.is_filter_to_list = $scope.is_filter_to_list;
      if ($scope.sort_by) param_data.sort_by = $scope.sort_by;
      if ($scope.category_selected) param_data.category_id = $scope.category_selected;
      if ($scope.selected_det_sub_cat) param_data.sub_category_id = $scope.selected_det_sub_cat;
      if ($scope.supplier_id) param_data.supplier_id = $scope.supplier_id;
      if ($scope.startDate) param_data.startDate = $scope.startDate;
      if ($scope.endDate) param_data.endDate = $scope.endDate;
      //   param_data.search = ($scope.filter.search).trim() ? $scope.filter.search : '';

      if (localStorage.getItem('profile_type') == 'SUPPLIER') {
        param_data.supplier_id = localStorage.getItem('supplier_id');
      }

      $scope.dataLoaded = false;

      services.POST_DATA(param_data, API.PRODUCT_REPORT(), function (response) {
        $scope.products = response.data.data;
        var sellingPriceList = [];
        var itemCountList = [];
        $scope.products.forEach(product => {
          product['profit'] = ((parseFloat(product.price) - parseFloat(product.making_price)) / parseFloat(product.making_price)) * 100;
          product['price'] = parseFloat(product['price']);
          product['making_price'] = parseFloat(product['making_price']);
          sellingPriceList.push(product.price);
          itemCountList.push(product.product_count);
        });
        $scope.products.forEach(product => {
          product['selling_price_index'] = product.price / Math.max.apply(null, sellingPriceList);
          product['item_count_index'] = product.product_count / Math.max.apply(null, itemCountList);
        });

        $scope.count = response.data.count;
        $scope.pager = pagerService.getPager($scope.count, page, $scope.limit);
        $scope.dataLoaded = true;
        generateGraph(response.data);
      });
    };
    getReportData(1);

    $scope.indexText = function (indexValue) {
      var indexTxt = "";
      if (indexValue >= 0 && indexValue <= 0.2) {
        return indexTxt = "Very Low";
      }
      if (indexValue >= 0.2 && indexValue <= 0.4) {
        return indexTxt = "Low";
      }
      if (indexValue >= 0.4 && indexValue <= 0.6) {
        return indexTxt = "Medium";
      }
      if (indexValue >= 0.6 && indexValue <= 0.8) {
        return indexTxt = "High";
      }
      if (indexValue >= 0.8 && indexValue <= 1) {
        return indexTxt = "Very High";
      }
    }

    $scope.sortColumnBy = function (sortBy, column) {
      if (sortBy == 'up') {
        if (column == 'sellingPrice') {
          $scope.products.sort(function (a, b) { return a.price - b.price });
        }
        if (column == 'itemCount') {
          $scope.products.sort(function (a, b) { return a.product_count - b.product_count });
        }
      }
      if (sortBy == 'down') {
        if (column == 'sellingPrice') {
          $scope.products.sort(function (a, b) { return b.price - a.price });
        }
        if (column == 'itemCount') {
          $scope.products.sort(function (a, b) { return b.product_count - a.product_count });
        }
      }
    }


    $scope.resetFilter = function () {
      $window.location.reload();
    };

    $scope.selectFilter = function () {
      $scope.is_filter_to_list = 1;
      $scope.currentPage = 1;
      $scope.skip = 0;
      getReportData(1);
    };

    $scope.setPage = function (page) {
      $scope.currentPage = page;
      $scope.skip = $scope.limit * (page - 1);
      getReportData(page);
    }

    var getCategories = function () {
      let params = {
        limit: 0,
        offset: 0,
        search: ''
      }
      services.GET_DATA(params, API.ADMIN_CATEGORY_LIST(), function (response) {
        if (response.data && response.data.categories.length) {
          $scope.categories = [];
          let lang_index = localStorage.getItem('lang') != 'en' ? 1 : 0;
          (response.data.categories).forEach(category => {
            if (category.category_id != 1 && category.is_live == 1) {
              category['name'] = category.category_name[lang_index].name;
              category['id'] = category.category_id;
              $scope.categories.push(category);
            }
          });
          // if ($scope.categories.length) {
          //     $scope.selected_cat = $scope.categories[0];
          //     $scope.onSelectCategory($scope.categories[0], false);
          // }
        }
      });
    };
    getCategories();

    $scope.dynamicSubCategories = [];
    $scope.onSelectCategory = function (category, change) {

      if ($rootScope.app_type > 10) {
        $scope.flow_type = category.type;
      }
      $scope.selected_sub_cat = '';
      $scope.selected_det_sub_cat = '';
      $scope.catIdArr = [];
      if (!!category) {
        $scope.selected_cat = category;
      }
      if (category.id) {
        $scope.category_selected = category.id;
        let params = {};
        params.sectionId = 30;
        params.category_id = category.id;
        services.getVariantList($scope, params, function (data) {
          $scope.variants = data;
        });

        $scope.changeSubCatId(category, 0, change);

      }
    };

    $scope.selectedCategory = [];
    $scope.changeSubCatId = function (subCatData, catIndex, change) {
      $scope.selected_det_sub_cat = subCatData.id;
      if (!!subCatData && !!subCatData.id) {
        if (change) {
          $scope.selectedCategory.splice(catIndex, $scope.selectedCategory.length - catIndex);
        }
        let param_data = {};
        param_data.subCatId = subCatData.id;
        param_data.sectionId = 30;
        if (catIndex == 0) {
          param_data.level = 1;
        }
        services.GET_DATA(param_data, API.GET_SUBCATEGORY_DATA(), function (response) {
          let data = response.data;
          if (data.length > 0) {
            if (catIndex == $scope.dynamicSubCategories.length) {
              $scope.dynamicSubCategories.push(data);
            } else {
              $scope.dynamicSubCategories.splice(catIndex, $scope.dynamicSubCategories.length - catIndex);
              $scope.dynamicSubCategories[catIndex] = data;
            }

            if (catIndex > 0) {
              if ($scope.catIdArr.length === catIndex - 1) {
                $scope.catIdArr.push(subCatData.id);
              } else {
                $scope.catIdArr.splice(catIndex, $scope.catIdArr.length - catIndex);
                $scope.catIdArr[catIndex] = subCatData.id;
              }
            }

          } else {
            $scope.dynamicSubCategories.splice(catIndex, $scope.dynamicSubCategories.length - catIndex);
          }
        });
      }
    };

    $scope.downloadCSV = function () {
      var param_data = {};
      param_data.accessToken = constants.ACCESSTOKEN;
      param_data.sectionId = 45;
      param_data.offset = $scope.skip;
      param_data.limit = $scope.limit;
      param_data.is_download = 1;
      
      if ($scope.startDate) param_data.startDate = $scope.startDate;
      if ($scope.endDate) param_data.endDate = $scope.endDate;
      
      services.POST_DATA(param_data, API.PRODUCT_REPORT(), function (response) {
        let dwnld_link = response.data.csvFileLink;
        services.DOWNLOAD_CSV(dwnld_link, 'product');
      });
    };

  }]);
