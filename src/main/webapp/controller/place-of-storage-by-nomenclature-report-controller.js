'use strict';

var PlaceOfStorageByNomenclatureReportController = function ($scope, PlaceOfStorageApiService, $stateParams) {
    $scope.getAllPlacesOfStorage = function (nomenclature) {
        PlaceOfStorageApiService.getAllByNomenclature(nomenclature.id).then(function (result) {
            $scope.placesOfStorage = result;
        });
    };
    $scope.getAllPlacesOfStorage($stateParams.nomenclature)
};

app.controller('PlaceOfStorageByNomenclatureReportController', PlaceOfStorageByNomenclatureReportController);