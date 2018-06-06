'use strict';

var UploadController = function ($scope, FileUploader, $state, UploadApiService,AuthService) {
    var uploader = $scope.uploader = new FileUploader({
        url: 'fileUpload',
        headers: {Authorization: AuthService.getToken()}

    });
    $scope.ImportIniFileClick = function () {
        $state.go('/.parseIniFile');
    }
    UploadApiService.delete();
};
app.controller('UploadController', UploadController);