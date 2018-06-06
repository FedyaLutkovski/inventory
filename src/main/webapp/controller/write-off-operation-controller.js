'use strict';

var WriteOffOperationController = function ($scope, $uibModal, $state, WriteOffOperationApiService,
                                            WriteOffOperationDataService, $rootScope, NgTableParams) {

    $scope.getAllWriteOffOperation = function () {
        WriteOffOperationApiService.getAll().then(function (result) {
            WriteOffOperationDataService.setModels(result);
            $scope.writeOffOperationDocuments = WriteOffOperationDataService.getModels();
            $scope.writeOffOperationDocumentClick($scope.writeOffOperationDocuments[$scope.writeOffOperationDocuments.length - 1]);
        });
    };
    $scope.writeOffOperationDocumentClick = function (result) {
        if (result) {
            $scope.currentWriteOffOperationDocument = result;
            $scope.nomenclatureCards = [];
            result.nomenclatureCards.forEach(function (nomenclatureCard) {
                if (nomenclatureCard.collectionId === 0) $scope.nomenclatureCards.push(nomenclatureCard);
            });
            $scope.tableNomenclatureCardsParams = new NgTableParams({
                sorting: {inventoryNumber: "asc"},
                count: 25
            }, {counts: [25, 50, 100], dataset: $scope.nomenclatureCards});
            $scope.collections = [];
            $scope.currentWriteOffOperationDocument.nomenclatureCards.forEach(function (nomenclatureCard) {
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
            controller: 'WriteOffCardInCollectionCtrl',
            size: 'lg',
            resolve: {
                collection: function () {
                    return collection;
                },
                currentWriteOffOperationDocument: function () {
                    return $scope.currentWriteOffOperationDocument;
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };

    $scope.getAllWriteOffOperation();
};
app.controller('WriteOffOperationController', WriteOffOperationController);

app.controller('WriteOffCardInCollectionCtrl', function ($scope, $uibModalInstance, $rootScope, collection,
                                                         currentWriteOffOperationDocument, NgTableParams) {
    $scope.collection = collection;
    $scope.nomenclatureCards = [];
    currentWriteOffOperationDocument.nomenclatureCards.forEach(function (nomenclatureCard) {
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