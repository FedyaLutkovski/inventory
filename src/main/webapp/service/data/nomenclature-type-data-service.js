'use strict';

var NomenclatureTypeDataService = function () {

    var nomenclatureType = [];

    this.getModels = function () {
        return nomenclatureType;
    };

    this.setModels = function (models) {
        nomenclatureType = models;
    };

    this.update = function (model) {
        for (var i = 0; i < nomenclatureType.length; i++) {
            if (nomenclatureType[i].id === model.id) {
                nomenclatureType[i] = model;
                return;
            }
        }
    };

    this.add = function (model) {
        nomenclatureType.push(model);
    };

    this.delete = function (modelId) {
        _.remove(nomenclatureType, {
            id: modelId
        })
    };

    return this;
};

app.service('NomenclatureTypeDataService', NomenclatureTypeDataService);