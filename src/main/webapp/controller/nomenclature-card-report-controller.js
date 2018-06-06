'use strict';

var NomenclatureCardReportController = function ($scope, NomenclatureCardApiService) {
    $scope.getAllNomenclatureCard = function () {
        NomenclatureCardApiService.getAll().then(function (result) {
            $scope.nomenclatureCards = result;
            $scope.collections = [];
            $scope.nomenclatureCards.forEach(function (value) {
                if (value.collection) {
                    $scope.collections.push(value.collection);
                }
            });
            $scope.collections = uniq($scope.collections);
        });
    };

    $scope.getAllNomenclatureCard();


};

app.controller('NomenclatureCardReportController', NomenclatureCardReportController);