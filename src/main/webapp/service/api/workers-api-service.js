'use strict';

var WorkersApiService = function (Restangular) {

    this.getAll = function () {
        return Restangular.all('workers').customGET();
    };

    this.add = function (item) {
        return Restangular.one('workers').customPOST(item);
    };

    this.update = function (item) {
        return Restangular.one('workers', item.id).customPUT(item);
    };

    this.delete = function (itemId) {
        return Restangular.one('workers', itemId).customDELETE();
    };

    return this;
};

app.service('WorkersApiService', WorkersApiService);
WorkersApiService.$inject = ['Restangular'];
