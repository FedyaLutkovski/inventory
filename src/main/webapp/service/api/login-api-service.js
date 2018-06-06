'use strict';

var LoginApiService = function (Restangular) {

    this.login = function (user) {
        return Restangular.one('login').customPOST(user);
    };

    this.registration = function (item) {
        return Restangular.one('login/registration').customPOST(item);
    };

    return this;
};

app.service('LoginApiService', LoginApiService);
WorkersApiService.$inject = ['Restangular'];
