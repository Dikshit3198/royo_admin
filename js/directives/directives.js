/**Royo**/

/**
 * pageTitle - Directive for set Page title - mata title
 */
function pageTitle($rootScope, $timeout) {
    return {
        link: function (scope, element) {
            var listener = function (event, toState, toParams, fromState, fromParams) {
                // Default title - load on Dashboard 1
                var title = 'Royo Apps';
                // Create your own title pattern
                if (toState.data && toState.data.pageTitle) title = 'Royo Apps | ' + toState.data.pageTitle;
                $timeout(function () {
                    element.text(title);
                });
            };
            $rootScope.$on('$stateChangeStart', listener);
        }
    }
}

/**
 * sideNavigation - Directive for run metsiMenu on sidebar navigation
 */
function sideNavigation($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            // Call the metsiMenu plugin and plug it to sidebar navigation
            $timeout(function () {
                element.metisMenu();
            });
        }
    };
}

/**
 * clockPicker - Directive for clock picker plugin
 */
function clockPicker() {
    return {
        restrict: 'A',
        link: function (scope, element) {
            element.clockpicker();
        }
    };
};


Royo.directive('spinLoader', function () {
    return {
        restrict: 'E',
        template: '<div class="spiner-example loading" ng-show="is_loader">' +
            '<div class="sk-spinner sk-spinner-three-bounce"> <div class="sk-bounce1">' +
            '</div><div class="sk-bounce2"></div> <div class="sk-bounce3"></div></div>' +
            '</div>'
    }
});

Royo.directive('watcher', [function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            scope.$watch(attrs.ngModel, function (v) {
                if (v) {
                    //console.log('I has value!');
                    scope.CallFunction();
                } else {
                    //console.log('I has no value :(');
                    scope.CallFunction();
                }
            });
        }
    }
}]);


//number

Royo.directive('productionQty', function () {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs) {
            elm.on('keydown', function (event) {
                if (event.shiftKey) { event.preventDefault(); return false; }
                if ([8, 13, 27, 37, 38, 39, 40, 127].indexOf(event.which) > -1) {
                    return true;
                } else if (event.which >= 48 && event.which <= 57) {
                    return true;
                } else if (event.which >= 96 && event.which <= 105) {
                    return true;
                } else {
                    event.preventDefault();
                    return false;
                }
            });
        }
    }
});

//limit value
Royo.directive("limitTo", [function () {
    return {
        restrict: "A",
        link: function (scope, elem, attrs) {
            var limit = parseInt(attrs.limitTo);
            angular.element(elem).on("keypress", function (e) {
                if (this.value.length == limit) e.preventDefault();
            });
        }
    }
}]);

/**
 * myEnter - Enter press Directive For Inputs
 */
Royo.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});

Royo.directive('capitalizeFirst', function ($parse) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            var capitalize = function (inputValue) {
                if (inputValue === undefined) {
                    inputValue = '';
                }
                var capitalized = inputValue.charAt(0).toUpperCase() +
                    inputValue.substring(1);
                if (capitalized !== inputValue) {
                    modelCtrl.$setViewValue(capitalized);
                    modelCtrl.$render();
                }
                return capitalized;
            }
            modelCtrl.$parsers.push(capitalize);
            capitalize($parse(attrs.ngModel)(scope)); // capitalize initial value
        }
    };
});

// Royo.directive('capitalLetters', function ($parse) {
//     return {
//         require: 'ngModel',
//         link: function (scope, element, attrs, modelCtrl) {
//             var capitalize = function (inputValue) {
//                 if (inputValue === undefined) {
//                     inputValue = '';
//                 }
//                 var capitalized = inputValue.toUpperCase();
//                 if (capitalized !== inputValue) {
//                     modelCtrl.$setViewValue(capitalized);
//                     modelCtrl.$render();
//                 }
//                 return capitalized;
//             }
//             modelCtrl.$parsers.push(capitalize);
//             capitalize($parse(attrs.ngModel)(scope)); // capitalize initial value
//         }
//     };
// });


/**
 * chatSlimScroll - Directive for slim scroll for small chat
 */
function chatSlimScroll($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            $timeout(function () {
                element.slimscroll({
                    height: '234px',
                    railOpacity: 0.4
                });

            });
        }
    };
}

Royo.directive('schrollBottom', function () {
    return {
        scope: {
            schrollBottom: "="
        },
        link: function (scope, element) {
            scope.$watchCollection('schrollBottom', function (newValue) {
                if (newValue) {
                    $(element).scrollTop($(element)[0].scrollHeight);
                }
            });
        }
    }
})


Royo.directive('tagInput', function () {
    return {
        restrict: 'E',
        scope: {
            inputTags: '=taglist',
            autocomplete: '=autocomplete'
        },
        link: function ($scope, element, attrs) {
            $scope.defaultWidth = 200;
            $scope.tagText = '';
            $scope.placeholder = attrs.placeholder;
            if ($scope.autocomplete) {
                $scope.autocompleteFocus = function (event, ui) {
                    $(element).find('input').val(ui.item.value);
                    return false;
                };
                $scope.autocompleteSelect = function (event, ui) {
                    $scope.$apply('tagText=\'' + ui.item.value + '\'');
                    $scope.$apply('addTag()');
                    return false;
                };
                $(element).find('input').autocomplete({
                    minLength: 0,
                    source: function (request, response) {
                        var item;
                        return response(function () {
                            var i, len, ref, results;
                            ref = $scope.autocomplete;
                            results = [];
                            for (i = 0, len = ref.length; i < len; i++) {
                                if (window.CP.shouldStopExecution(1)) {
                                    break;
                                }
                                item = ref[i];
                                if (item.toLowerCase().indexOf(request.term.toLowerCase()) !== -1) {
                                    results.push(item);
                                }
                            }
                            window.CP.exitedLoop(1);
                            return results;
                        }());
                    },
                    focus: function (_this) {
                        return function (event, ui) {
                            return $scope.autocompleteFocus(event, ui);
                        };
                    }(this),
                    select: function (_this) {
                        return function (event, ui) {
                            return $scope.autocompleteSelect(event, ui);
                        };
                    }(this)
                });
            }
            $scope.tagArray = function () {
                if ($scope.inputTags === undefined) {
                    return [];
                }
                return $scope.inputTags.filter(function (tag) {
                    return tag !== '';
                });
                // return $scope.inputTags.split(',').filter(function (tag) {
                //     return tag !== '';
                // });
            };
            $scope.addTag = function () {
                var tagArray;
                if ($scope.tagText.length === 0) {
                    return;
                }
                tagArray = $scope.tagArray();
                tagArray.push($scope.tagText);
                $scope.inputTags = tagArray;
                // $scope.inputTags = tagArray.join(',');
                return $scope.tagText = '';
            };
            $scope.deleteTag = function (key) {
                var tagArray;
                tagArray = $scope.tagArray();
                if (tagArray.length > 0 && $scope.tagText.length === 0 && key === undefined) {
                    tagArray.pop();
                } else {
                    if (key !== undefined) {
                        tagArray.splice(key, 1);
                        if (tagArray[key] == "All Users") {
                            $scope.count_users = 0;
                        }
                        else if (tagArray[key] == "All Suppliers") {
                            $scope.count_suppliers = 0;
                        }
                    }
                }
                // return $scope.inputTags = tagArray.join(',');
                return $scope.inputTags = tagArray;
            };
            $scope.$watch('tagText', function (newVal, oldVal) {
                var tempEl;
                if (!(newVal === oldVal && newVal === undefined)) {
                    tempEl = $('<span>' + newVal + '</span>').appendTo('body');
                    $scope.inputWidth = tempEl.width() + 5;
                    if ($scope.inputWidth < $scope.defaultWidth) {
                        $scope.inputWidth = $scope.defaultWidth;
                    }
                    return tempEl.remove();
                }
            });
            element.bind('keydown', function (e) {
                var key;
                key = e.which;
                if (key === 9 || key === 13) {
                    e.preventDefault();
                }
                if (key === 8) {
                    return $scope.$apply('deleteTag()');
                }
            });
            return element.bind('keyup', function (e) {
                var key;
                key = e.which;
                if (key === 9 || key === 13 || key === 188) {
                    e.preventDefault();
                    return $scope.$apply('addTag()');
                }
            });
        },
        template: '<div class=\'tag-input-ctn\'><div class=\'input-tag\' data-ng-repeat="tag in tagArray()">{{tag}}<div class=\'delete-tag\' data-ng-click=\'deleteTag($index)\'>&times;</div></div><input type=\'text\' data-ng-style=\'{width: inputWidth}\' data-ng-model=\'tagText\' placeholder=\'{{placeholder}}\'/></div>'
    };
});

Royo.directive('datetimez', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            element.datetimepicker({
                dateFormat: 'yyyy-MM-dd',
                language: 'en',
                pickTime: false,
                // startDate: '01-11-2013',      // set a minimum date
                // endDate: '01-11-2030'          // set a maximum date
                startDate: '2013-11-01',      // set a minimum date
                endDate: '2030-11-01'          // set a maximum date
            }).on('changeDate', function (e) {
                ngModelCtrl.$setViewValue(e.date);
                scope.$apply();
            });
        }
    };
});

Royo.directive('promoCodeId', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                var transformedInput = text.replace(/[^a-zA-Z0-9_-]/g, '');
                if (transformedInput !== text) {
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                }

                return transformedInput;  // or return Number(transformedInput)
            }

            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});


Royo.directive("loader", function ($rootScope) {
    return function ($scope, element, attrs) {
        $scope.$on("loader_show", function () {
            return element.show();
        });
        return $scope.$on("loader_hide", function () {
            return element.hide();
        });
    };
});

Royo.directive('successModal', function () {
    return {
        restrict: 'E',
        scope: {
            'message': '='
        },
        transclude: true,
        template:
            `<div class="modal" id="successModal">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-body">
          
                  <div class="modhead" style="border: none;">
                    <button type="button" class="close" data-dismiss="modal"><img src="img/v1_images/ic_cross.svg"></button>
                  </div>
          
                  <div class="modbody" style="border: none;">
                    <div class="success">
                      <img src="img/v1_images/illustration.svg">
                      <h2 class="bold">{{'SUCCESSFULL' | translate}}</h2>
                      <p class="message">{{message | translate}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>`
    }
});

Royo.directive('readMore', function () {
    return {
        restrict: 'E',
        scope: {
            'text': '=',
            'label': '='
        },
        transclude: true,
        template:
            `<div class="modal" id="readMore">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-body">
          
                  <div class="modhead" style="border: none;">
                    <h1 style="margin-bottom: -20px; text-align: center">{{label ? label : 'Description' | translate}}</h1>
                    <button type="button" class="close" data-dismiss="modal"><img src="img/v1_images/ic_cross.svg"></button>
                  </div>
          
                  <div class="modbody" style="border: none;">
                    <div class="success">
                      <p style="height: 320px;overflow: auto;" ng-bind-html="text | toTrusted">{{text}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>`
    }
});

Royo.directive('ngRightClick', function ($parse) {
    return function (scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function (event) {
            scope.$apply(function () {
                event.preventDefault();
                fn(scope, { $event: event });
            });
        });
    };
});

Royo.directive('integers', function () {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs, ctrl) {
            elm.on('keydown', function (event) {

                if (event.which == 64 || event.which == 16) {
                    // numbers  
                    return false;
                } if ([8, 13, 27, 37, 38, 39, 40, 110].indexOf(event.which) > -1) {
                    // backspace, enter, escape, arrows  
                    return true;
                } else if (event.which >= 48 && event.which <= 57) {
                    // numbers  
                    return true;
                } else if (event.which >= 96 && event.which <= 105) {
                    // numpad number  
                    return true;
                } else if ([46, 110, 190].indexOf(event.which) > -1) {
                    // dot and numpad dot  
                    return true;
                } else {
                    event.preventDefault();
                    return false;
                }
            });
        }
    }
});

Royo.directive("equal", function () {
    return {
        require: "ngModel",
        scope:
        {
            confirmPassword: "=equal"
        },
        link: function (scope, element, attributes, modelVal) {
            modelVal.$validators.equal = function (val) {
                return val == scope.confirmPassword;
            };
            scope.$watch("confirmPassword", function () {
                modelVal.$validate();
            });
        }
    };
});

Royo.directive('preventEnterPress', function () {
    return {
        link: function (scope, element, attrs) {
            element.keypress(function (e) {
                if (e.keyCode == 13) {
                    e.preventDefault();
                    return;
                }
            });
        }
    }
});

Royo.directive('convertToNumber', function() {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {                
            ngModel.$parsers.push(function(val) {                    
                return parseInt(val, 10);
            });
            ngModel.$formatters.push(function (val) {                    
                return '' + val;
            });
        }
    };
});

Royo.directive('noSpecialChar', function() {
    function link(scope, elem, attrs, ngModel) {
         ngModel.$parsers.push(function(viewValue) {
           var reg = /^[^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./]*$/;
           // if view values matches regexp, update model value
           if (viewValue.match(reg)) {
             return viewValue;
           }
           // keep the model value as it is
           var transformedValue = ngModel.$modelValue;
           ngModel.$setViewValue(transformedValue);
           ngModel.$render();
           return transformedValue;
         });
     }

     return {
         restrict: 'A',
         require: 'ngModel',
         link: link
     };      
 });
/**
 *
 * Pass all functions into module
 */

Royo.directive('pageTitle', pageTitle);
Royo.directive('sideNavigation', sideNavigation);
Royo.directive('clockPicker', clockPicker);
Royo.directive('chatSlimScroll', chatSlimScroll);
