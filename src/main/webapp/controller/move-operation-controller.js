'use strict';

var MoveOperationController = function ($scope, $uibModal, $state, MoveOperationApiService,
                                        MoveOperationDataService, $rootScope, NgTableParams) {

    $scope.getAllMoveOperation = function () {
        MoveOperationApiService.getAll().then(function (result) {
            MoveOperationDataService.setModels(result);
            $scope.moveOperationDocuments = MoveOperationDataService.getModels();
            $scope.moveOperationDocumentClick($scope.moveOperationDocuments[$scope.moveOperationDocuments.length - 1]);
        });
    };
    $scope.moveOperationDocumentClick = function (result) {
        if (result) {
            $scope.currentMoveOperationDocument = result;
            $scope.nomenclatureCards = [];
            result.nomenclatureCards.forEach(function (nomenclatureCard) {
                if (nomenclatureCard.collectionId === 0) $scope.nomenclatureCards.push(nomenclatureCard);
            });
            $scope.tableNomenclatureCardsParams = new NgTableParams({
                sorting: {inventoryNumber: "asc"},
                count: 25
            }, {counts: [25, 50, 100], dataset: $scope.nomenclatureCards});
            $scope.collections = [];
            $scope.currentMoveOperationDocument.nomenclatureCards.forEach(function (nomenclatureCard) {
                if (nomenclatureCard.collection) {
                    $scope.collections.push(nomenclatureCard.collection);
                }
            });
            $scope.collections = uniq($scope.collections);
            $scope.tableCollectionsParams = new NgTableParams({
                sorting: {inventoryNumber: "asc"},
                count: 25
            }, {counts: [25, 50, 100], dataset: $scope.collections});
        }

    };

    $scope.collectionClick = function (collection) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'nomenclatureCardIncollection.html',
            controller: 'MoveCardInCollectionCtrl',
            size: 'lg',
            resolve: {
                collection: function () {
                    return collection;
                },
                currentMoveOperationDocument: function () {
                    return $scope.currentMoveOperationDocument;
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };

    $scope.getAllMoveOperation();
};
app.controller('MoveOperationController', MoveOperationController);

app.controller('MoveCardInCollectionCtrl', function ($scope, $uibModalInstance, $rootScope, collection,
                                                             currentMoveOperationDocument, NgTableParams) {
    $scope.collection = collection;
    $scope.nomenclatureCards = [];
    currentMoveOperationDocument.nomenclatureCards.forEach(function (nomenclatureCard) {
        if (nomenclatureCard.collectionId === collection.id) $scope.nomenclatureCards.push(nomenclatureCard);
    });
    $scope.tableNomenclatureCardsInCollectionParams = new NgTableParams({
        sorting: {'nomenclature.name': "asc"},
        count: 10
    }, {counts: [5, 10, 20], dataset: $scope.nomenclatureCards});
    $scope.close = function () {
        $uibModalInstance.close();
    };

});