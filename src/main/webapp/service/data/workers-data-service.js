'use strict';

var WorkersDataService = function () {

    var workers = [];

    this.getModels = function () {
        return workers;
    };

    this.setModels = function (models) {
        workers = models;
    };

    this.update = function (model) {
        for (var i = 0; i < workers.length; i++) {
            if (workers[i].id === model.id) {
                workers[i] = model;
                return;
            }
        }
    };

    this.add = function (model) {
        workers.push(model);
    };

    this.delete = function (modelId) {
        _.remove(workers, {
            id: modelId
        })
    };

    return this;
};

app.service('WorkersDataService', WorkersDataService);