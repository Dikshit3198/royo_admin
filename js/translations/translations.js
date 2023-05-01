/**
 * Royo Translations
 */
function config($translateProvider) {

    $translateProvider
    .useStaticFilesLoader({
        prefix: '/js/translations/locales/',
        suffix: '.json'
    }) 
    .useSanitizeValueStrategy('sanitizeParameters')    
    .preferredLanguage('en');
}

Royo.config(config)
