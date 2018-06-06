'use strict';

var SubUnitDataService = function () {

    var subUnits = [];

    this.getModels = function () {
        return subUnits;
    };

    this.setModels = function (models) {
        subUnits = models;
    };

    this.update = function (model) {
        for (var i = 0; i < subUnits.length; i++) {
            if (subUnits[i].id === model.id) {
                subUnits[i] = model;
                return;
            }
        }
    };

    this.add = function (model) {
        subUnits.push(model);
    };

    this.delete = function (modelId) {
        _.remove(subUnits, {
            id: modelId
        })
    };

    return this;
};

app.service('SubUnitDataService', SubUnitDataService);