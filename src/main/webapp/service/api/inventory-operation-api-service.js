'use strict';

var InventoryOperationApiService = function (Restangular) {

    this.getAll = function () {
        return Restangular.all('inventory').customGET();
    };

    this.add = function (item) {
        return Restangular.one('inventory').customPOST(item);
    };

    this.update = function (item) {
        return Restangular.one('inventory', item.id).customPUT(item);
    };

    this.delete = function (itemId) {
        return Restangular.one('inventory', itemId).customDELETE();
    };

    return this;
};

app.service('InventoryOperationApiService', InventoryOperationApiService);
WorkersApiService.$inject = ['Restangular'];