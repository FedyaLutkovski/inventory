'use strict';

var PlaceOfStorageApiService = function (Restangular, AuthService) {

    this.getAll = function () {
        return Restangular.all('placeOfStorage').customGET();
    };

    this.getAllExceptName = function (name) {
        return Restangular.all('placeOfStorage/exceptName/' + name).customGET();
    };

    this.getAllSeeingParent = function (parentId) {
        return Restangular.all('placeOfStorage/' + parentId).customGET();
    };

    this.getAllByTypeOfStoragePlace = function (id) {
        return Restangular.all('placeOfStorage/tosp/' + id).customGET();
    };

    this.getAllByNomenclature = function (id) {
        return Restangular.all('placeOfStorage/nomenclature/' + id).customGET();
    };

    this.getPlaceOfStorageById = function (id) {
        return Restangular.all('placeOfStorage/getById/' + id).customGET();
    };

    this.add = function (item) {
        return Restangular.one('placeOfStorage').customPOST(item);
    };

    this.update = function (item) {
        return Restangular.one('placeOfStorage', item.id).customPUT(item);
    };

    this.addNomenclatureCard = function (item, placeOfStorageId) {
        return Restangular.one('placeOfStorage/addNomenclatureCard/', placeOfStorageId).customPUT(item);
    };
    this.moveNomenclatureCard = function (item, placeOfStorageId, newPlaceOfStorageId) {
        return Restangular.one('placeOfStorage/moveNomenclatureCard/' + placeOfStorageId + '/' + newPlaceOfStorageId).customPOST(item);
    };

    this.delete = function (itemId) {
        return Restangular.one('placeOfStorage', itemId).customDELETE();
    };

    return this;
};

app.service('PlaceOfStorageApiService', PlaceOfStorageApiService);
PlaceOfStorageApiService.$inject = ['Restangular', 'AuthService'];
