app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
        .state('/', {
            url: "/",
            views: {
                'mainView': {
                    templateUrl: 'view/components/home.tpl.html',
                    data: "USER"
                }
            }
        })
        .state('login', {
            url: '/login',
            views: {
                'mainView': {
                    templateUrl: 'view/login.html'
                }
            }
        })
        .state('/.access-denied', {
            templateUrl: 'view/access-denied.html'
        })
        .state('register', {
            url: '/register',
            views: {
                'content@': {
                    templateUrl: 'view/register.html',
                    controller: 'RegisterController'
                }
            }
        })
        .state('/.subUnits', {
            templateUrl: "view/subUnits.html",
            data: "USER"
        })
        .state('/.workers', {
            templateUrl: "view/workers.html",
            data: "USER"
        })
        .state('/.typeOfStoragePlace', {
            templateUrl: "view/typeOfStoragePlace.html",
            data: "USER"
        })
        .state('/.placeOfStorage', {
            templateUrl: "view/placeOfStorage.html",
            data: "USER"
        })
        .state('/.nomenclatureType', {
            templateUrl: "view/nomenclatureType.html",
            data: "USER"
        })
        .state('/.nomenclature', {
            templateUrl: "view/nomenclature.html",
            data: "USER"
        })
        .state('/.uploadFile', {
            templateUrl: "view/uploadFile.html",
            data: "USER"
        })
        .state('/.parseIniFile', {
            templateUrl: "view/parseIniFile.html",
            data: "USER"
        })
        .state('/.inventory', {
            templateUrl: "view/inventory.html",
            data: "USER"
        })
        .state('/.moveOperation', {
            templateUrl: "view/moveOperation.html",
            data: "USER"
        })
        .state('/.writeOffOperation', {
            templateUrl: "view/writeOffOperation.html",
            data: "USER"
        })
        .state('/.users', {
            templateUrl: "view/users.html",
            data: "ADMIN"
        })
        .state('/.nomenclatureCardReport', {
            templateUrl: "view/reports/nomenclatureCardReports.html",
            data: "USER"
        })
        .state('/.placeOfStorageReport', {
            templateUrl: "view/reports/placeOfStorageReport.html",
            data: "USER"
        })
        .state('/.typeOfStoragePlaceReport', {
            templateUrl: "view/reports/typeOfStoragePlaceReport.html",
            data: "USER"
        })
        .state('/.placeOfStorageByNomenclatureReport', {
            templateUrl: "view/reports/placeOfStorageByNomenclatureReport.html",
            data: "USER",
            params: {
                nomenclature: null
            }
        })
    ;

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('');
    $locationProvider.hashPrefix('');

});
