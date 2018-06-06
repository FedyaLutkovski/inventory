'use strict';

var NomenclatureApiService = function (Restangular) {

    this.getAll = function () {
        return Restangular.all('nomenclature').customGET();
    };

    this.getAllByNomenclatureType = function (nomenclatureTypeid) {
        return Restangular.all('nomenclature/'+nomenclatureTypeid).customGET();
    };

    this.add = function (item) {
        return Restangular.one('nomenclature').customPOST(item);
    };

    this.update = function (item) {
        return Restangular.one('nomenclature', item.id).customPUT(item);
    };

    this.delete = function (itemId) {
        return Restangular.one('nomenclature', itemId).customDELETE();
    };

    return this;
};

app.service('NomenclatureApiService', NomenclatureApiService);
NomenclatureApiService.$inject = ['Restangular'];
