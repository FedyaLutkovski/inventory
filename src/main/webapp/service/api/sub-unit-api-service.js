'use strict';

var SubUnitApiService = function (Restangular) {

    this.getAll = function () {
        return Restangular.all('subUnit').customGET();
    };

    this.add = function (item) {
        return Restangular.one('subUnit').customPOST(item);
    };

    this.addPlaceOfStorageBySubUnit = function () {
        return Restangular.one('subUnit/addPlaceOfStorage/').customPOST();
    };

    this.update = function (item) {
        return Restangular.one('subUnit', item.id).customPUT(item);
    };

    this.delete = function (itemId) {
        return Restangular.one('subUnit', itemId).customDELETE();
    };

    return this;
};

app.service('SubUnitApiService', SubUnitApiService);
SubUnitApiService.$inject = ['Restangular'];
