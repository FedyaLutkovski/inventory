'use strict';

var PlaceOfStorageReportController = function ($scope, PlaceOfStorageApiService, PlaceOfStorageDataService) {
    $scope.getAllPlacesOfStorage = function () {
        PlaceOfStorageApiService.getAll().then(function (result) {
            PlaceOfStorageDataService.setModels(result);
            $scope.placesOfStorage = PlaceOfStorageDataService.getModels();
            $scope.currentPlaceOfStorage = $scope.placesOfStorage[0];
            $scope.SelectPOS($scope.currentPlaceOfStorage);
        });
    };
    $scope.SelectPOS = function (placeOfStorage) {
        $scope.nomenclatureCards = placeOfStorage.nomenclatureCards;
        $scope.collections = [];
        $scope.nomenclatureCards.forEach(function (value) {
            PlaceOfStorageDataService.updateNomenclatureCard(value);
            if (value.collection) {
                $scope.collections.push(value.collection);
            }
        });
        $scope.collections = uniq($scope.collections);
    };

    $scope.getAllPlacesOfStorage();


};

app.controller('PlaceOfStorageReportController', PlaceOfStorageReportController);