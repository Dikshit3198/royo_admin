/*** Royo Modules ***/
(function () {

    Royo = angular.module('Royo', [
        'ui.router',                    // Routing
        'oc.lazyLoad',                  // ocLazyLoad
        'ngSanitize',                   // Html Binding
        'pascalprecht.translate',       // Angular Translate
        'ngCsv',
        'chart.js',
        'ngCookies',
        'ui.sortable',
        'isteven-multi-select',
        'mwl.calendar',
        'ui.router.state.events'
    ])
})();

