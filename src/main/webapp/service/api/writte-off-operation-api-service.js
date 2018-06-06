'use strict';

var WriteOffOperationApiService = function (Restangular) {

    this.getAll = function () {
        return Restangular.all('writeOffOperation').customGET();
    };

    return this;
};

app.service('WriteOffOperationApiService', WriteOffOperationApiService);
WriteOffOperationApiService.$inject = ['Restangular'];