'use strict';

var InventoryOperationDataService = function () {

    var inventoryOperations = [];

    this.getModels = function () {
        return inventoryOperations;
    };

    this.setModels = function (models) {
        models.forEach(function (model) {
            model.nomenclatureCardForInventory.forEach(function (nomenclatureCard) {
                if (nomenclatureCard.collectionForInventory) {
                    nomenclatureCard.collectionId = nomenclatureCard.collectionForInventory.id;
                } else {
                    nomenclatureCard.collectionId = 0;
                }
            })
        });
        inventoryOperations = models;
    };

    this.update = function (model) {
        for (var i = 0; i < inventoryOperations.length; i++) {
            if (inventoryOperations[i].id === model.id) {
                inventoryOperations[i] = model;
                return;
            }
        }
    };

    this.add = function (model) {
        inventoryOperations.push(model);
    };

    this.delete = function (modelId) {
        _.remove(inventoryOperations, {
            id: modelId
        })
    };

    return this;
};

app.service('InventoryOperationDataService', InventoryOperationDataService);