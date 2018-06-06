'use strict';

var NomenclatureDataService = function () {

    var nomenclatures = [];

    this.getModels = function () {
        return nomenclatures;
    };

    this.setModels = function (models) {
        nomenclatures = models;
    };

    this.update = function (model) {
        for (var i = 0; i < nomenclatures.length; i++) {
            if (nomenclatures[i].id === model.id) {
                nomenclatures[i] = model;
                return;
            }
        }
    };

    this.add = function (model) {
        nomenclatures.push(model);
    };

    this.delete = function (modelId) {
        _.remove(nomenclatures, {
            id: modelId
        })
    };

    return this;
};

app.service('NomenclatureDataService', NomenclatureDataService);