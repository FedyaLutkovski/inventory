'use strict';

var ParseIniFileDataService = function () {

    var iniFile = [];

    this.getModels = function () {
        return iniFile;
    };

    this.setModels = function (models) {
        iniFile = models;
    };

    this.update = function (model) {
        for (var i = 0; i < iniFile.length; i++) {
            if (iniFile[i].id === model.id) {
                iniFile[i].name = model.name;
                iniFile[i].workerName = model.workerName;
                iniFile[i].workerSurname = model.workerSurname;
                iniFile[i].workerPatronymic = model.workerPatronymic;
                iniFile[i].workerDescription = model.workerDescription;
                iniFile[i].value = model.value;
                iniFile[i].parent = model.parent;
                return;
            }
        }
    };

    return this;
};

app.service('ParseIniFileDataService', ParseIniFileDataService);