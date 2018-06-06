'use strict';

var TypeOfStoragePlaceApiService = function (Restangular) {

    this.getAll = function () {
        return Restangular.all('typeOfStoragePlace').customGET();
    };

    this.add = function (item) {
        return Restangular.one('typeOfStoragePlace').customPOST(item);
    };

    this.update = function (item) {
        return Restangular.one('typeOfStoragePlace', item.id).customPUT(item);
    };

    this.delete = function (itemId) {
        return Restangular.one('typeOfStoragePlace', itemId).customDELETE();
    };

    return this;
};

app.service('TypeOfStoragePlaceApiService', TypeOfStoragePlaceApiService);
TypeOfStoragePlaceApiService.$inject = ['Restangular'];
