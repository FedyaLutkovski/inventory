'use strict';

var NomenclatureCardApiService = function (Restangular) {

    this.getAll = function () {
        return Restangular.all('nomenclatureCard').customGET();
    };

    this.unicBarcodeInventorySerial = function (item) {
        return Restangular.one('nomenclatureCard/unicBarcodeInventorySerial').customPOST(item);
    };

    this.getAllByCollection = function (collectionId) {
        return Restangular.all('nomenclatureCard/getAllByCollection/' + collectionId).customGET();
    };
    this.getByBarcode = function (barcode) {
        return Restangular.all('nomenclatureCard/barcode/' + barcode).customGET();
    };
    this.getByInventoryNumber = function (inventoryNumber) {
        return Restangular.all('nomenclatureCard/inventoryNumber/' + inventoryNumber).customGET();
    };
    this.getBySerialNumber = function (serialNumber) {
        return Restangular.all('nomenclatureCard/serialNumber/' + serialNumber).customGET();
    };
    this.add = function (item) {
        return Restangular.one('nomenclatureCard').customPOST(item);
    };
    this.update = function (item) {
        return Restangular.one('nomenclatureCard', item.id).customPUT(item);
    };

    this.writeOff = function (item, placesOfStorageId) {
        return Restangular.one('nomenclatureCard/writeOff/' + placesOfStorageId).customPOST(item);
    };

    this.delete = function (itemId) {
        return Restangular.one('nomenclatureCard', itemId).customDELETE();
    };

    return this;
};

app.service('NomenclatureCardApiService', NomenclatureCardApiService);
NomenclatureCardApiService.$inject = ['Restangular'];
