'use strict';

var TypeOfStoragePlaceReportController = function ($scope, PlaceOfStorageApiService, TypeOfStoragePlaceApiService) {
    $scope.getAllTOSP = function () {
        TypeOfStoragePlaceApiService.getAll().then(function (result) {
            $scope.typeOfStoragePlaces = result;
            $scope.SelectTOSP(result[0]);
        });
    };
    $scope.SelectTOSP = function (tosp) {
        $scope.currentTOSP = tosp;
        PlaceOfStorageApiService.getAllByTypeOfStoragePlace($scope.currentTOSP.id).then(function (result) {
            $scope.placesOfStorage = result;
        })
    };

    $scope.getAllTOSP();


};

app.controller('TypeOfStoragePlaceReportController', TypeOfStoragePlaceReportController);