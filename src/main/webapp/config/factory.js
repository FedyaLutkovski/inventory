app.factory('httpResponseInterceptor', ['$q', '$injector', function ($q, $injector) {
    return {
        responseError: function (rejection) {
            if (rejection.status === 401) {
                $injector.get('$state').transitionTo('login');
                localStorage.clear();
            }
            return $q.reject(rejection);
        }
    };
}]);

app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('httpResponseInterceptor');
}]);
app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);