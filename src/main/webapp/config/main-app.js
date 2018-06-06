var app = angular.module('app', [
    'ui.router',
    'restangular',
    'ngAnimate',
    'ui.bootstrap',
    'ui.router.stateHelper',
    'ngStorage',
    'ui.tree',
    'angularFileUpload',
    'ngMessages',
    'ui.select',
    'ngSanitize',
    'ngTable'
])

    .run(function (AuthService, $rootScope, $state,$http) {
        if (!AuthService.getToken()) {
            AuthService.setToken(localStorage.getItem('token'));
            AuthService.setUser(JSON.parse(localStorage.getItem('user')));
            $http.defaults.headers.common['Authorization'] = AuthService.getToken();
        }
        $rootScope.$on('$stateChangeStart', function (event, toState, $http) {
            if (!AuthService.getUser()) {
                if (toState.name !== 'login' && toState.name !== 'register') {
                    event.preventDefault();
                    $state.go('login');
                }
            } else {
                if (toState.data) {
                    var hasAccess = false;
                    AuthService.getUser().roles.forEach(function (role) {
                        if (toState.data === role) {
                            hasAccess = true;
                        }
                    });
                    if (!hasAccess) {
                        event.preventDefault();
                        $state.go('/.access-denied');
                    }

                }
            }
        }, function (reason) {
            var message = reason.data.error + " " + reason.data.status;
            $rootScope.$broadcast('alert', {msg: message, type: "danger"});
        });
    });
