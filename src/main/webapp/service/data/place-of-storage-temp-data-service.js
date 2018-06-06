'use strict';

var PlaceOfStorageTempDataService = function () {

    var placeOfStorageTempDataService = [];

    this.getModels = function () {
        return placeOfStorageTempDataService;
    };

    this.setModels = function (models) {
        placeOfStorageTempDataService = models;
    };

    return this;
};

app.service('PlaceOfStorageTempDataService', PlaceOfStorageTempDataService);