'use strict';

var UploadApiService = function (Restangular) {

    this.delete = function () {
        return Restangular.one('fileUpload').customDELETE();
    };

    return this;
};
app.service('UploadApiService', UploadApiService);
UploadApiService.$inject = ['Restangular'];
