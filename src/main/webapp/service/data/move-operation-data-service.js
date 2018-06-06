'use strict';

var MoveOperationDataService = function () {

    var moveOperations = [];

    this.getModels = function () {
        return moveOperations;
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
        moveOperations = models;
    };

    this.update = function (model) {
        for (var i = 0; i < moveOperations.length; i++) {
            if (moveOperations[i].id === model.id) {
                moveOperations[i] = model;
                return;
            }
        }
    };

    this.add = function (model) {
        moveOperations.push(model);
    };

    this.delete = function (modelId) {
        _.remove(moveOperations, {
            id: modelId
        })
    };

    return this;
};

app.service('MoveOperationDataService', MoveOperationDataService);