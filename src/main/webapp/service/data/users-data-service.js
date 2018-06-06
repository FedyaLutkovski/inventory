'use strict';

var UsersDataService = function () {

    var users = [];

    this.getModels = function () {
        return users;
    };

    this.setModels = function (models) {
        users = models;
    };

    this.update = function (model) {
        for (var i = 0; i < users.length; i++) {
            if (users[i].id === model.id) {
                users[i] = model;
                return;
            }
        }
    };

    this.add = function (model) {
        users.push(model);
    };

    this.delete = function (modelId) {
        _.remove(users, {
            id: modelId
        })
    };

    return this;
};

app.service('UsersDataService', UsersDataService);