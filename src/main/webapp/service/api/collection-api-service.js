'use strict';

var CollectionApiService = function (Restangular) {

    this.getAll = function () {
        return Restangular.all('collection').customGET();
    };
    this.unicBarcodeInventorySerial = function (item) {
        return Restangular.one('collection/unicBarcodeInventorySerial').customPOST(item);
    };

    this.add = function (item) {
        return Restangular.one('collection').customPOST(item);
    };

    this.update = function (item) {
        return Restangular.one('collection', item.id).customPUT(item);
    };

    this.delete = function (itemId) {
        return Restangular.one('collection', itemId).customDELETE();
    };

    return this;
};

app.service('CollectionApiService', CollectionApiService);
CollectionApiService.$inject = ['Restangular'];