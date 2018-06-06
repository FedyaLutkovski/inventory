'use strict';

var NomenclatureTypeApiService = function (Restangular) {

    this.getAll = function () {
        return Restangular.all('nomenclatureType').customGET();
    };

    this.add = function (item) {
        return Restangular.one('nomenclatureType').customPOST(item);
    };

    this.update = function (item) {
        return Restangular.one('nomenclatureType', item.id).customPUT(item);
    };

    this.delete = function (itemId) {
        return Restangular.one('nomenclatureType', itemId).customDELETE();
    };

    return this;
};

app.service('NomenclatureTypeApiService', NomenclatureTypeApiService);
NomenclatureTypeApiService.$inject = ['Restangular'];
