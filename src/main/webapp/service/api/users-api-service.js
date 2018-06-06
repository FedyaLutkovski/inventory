'use strict';

var UsersApiService = function (Restangular) {

    this.getAll = function () {
        return Restangular.all('user').customGET();
    };
    this.add = function (item) {
        return Restangular.one('user').customPOST(item);
    };

    this.update = function (item) {
        return Restangular.one('user', item.id).customPUT(item);
    };

    this.delete = function (itemId) {
        return Restangular.one('user', itemId).customDELETE();
    };

    return this;
};

app.service('UsersApiService', UsersApiService);
UsersApiService.$inject = ['Restangular'];
