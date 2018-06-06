'use strict';

var WriteOffOperationDataService = function () {

    var writeOffOperations = [];

    this.getModels = function () {
        return writeOffOperations;
    };

    this.setModels = function (models) {
        models.forEach(function (model) {
            model.nomenclatureCards.forEach(function (nomenclatureCard) {
                if (nomenclatureCard.collection) {
                    nomenclatureCard.collectionId = nomenclatureCard.collection.id;
                } else {
                    nomenclatureCard.collectionId = 0;
                }
            })
        });
        writeOffOperations = models;
    };

    this.update = function (model) {
        for (var i = 0; i < writeOffOperations.length; i++) {
            if (writeOffOperations[i].id === model.id) {
                writeOffOperations[i] = model;
                return;
            }
        }
    };

    this.add = function (model) {
        writeOffOperations.push(model);
    };

    this.delete = function (modelId) {
        _.remove(writeOffOperations, {
            id: modelId
        })
    };

    return this;
};

app.service('WriteOffOperationDataService', WriteOffOperationDataService);