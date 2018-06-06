'use strict';

var TypeOfStoragePlaceDataService = function () {

    var typeOfStoragePlaces = [];

    this.getModels = function () {
        return typeOfStoragePlaces;
    };

    this.setModels = function (models) {
        typeOfStoragePlaces = models;
    };

    this.update = function (model) {
        for (var i = 0; i < typeOfStoragePlaces.length; i++) {
            if (typeOfStoragePlaces[i].id === model.id) {
                typeOfStoragePlaces[i] = model;
                return;
            }
        }
    };

    this.add = function (model) {
        typeOfStoragePlaces.push(model);
    };

    this.delete = function (modelId) {
        _.remove(typeOfStoragePlaces, {
            id: modelId
        })
    };

    return this;
};

app.service('TypeOfStoragePlaceDataService', TypeOfStoragePlaceDataService);