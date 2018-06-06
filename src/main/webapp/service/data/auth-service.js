'use strict';
var AuthService = function () {
    var user = null;
    var token = null;

    this.getUser = function () {
        return user;
    };

    this.setUser = function (model) {
        user = model;
    };

    this.setToken = function (model) {
        token = model;
    };

    this.getToken = function () {
        if (token === null) {
            return '';
        }
        return token;
    };

    return this;
};
app.service('AuthService', AuthService);