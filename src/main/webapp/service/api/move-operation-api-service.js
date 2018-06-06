'use strict';

var MoveOperationApiService = function (Restangular) {

    this.getAll = function () {
        return Restangular.all('moveOperation').customGET();
    };

    return this;
};

app.service('MoveOperationApiService', MoveOperationApiService);
MoveOperationApiService.$inject = ['Restangular'];