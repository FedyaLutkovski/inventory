'use strict';

var InventoryController = function ($scope, $uibModal, $state, InventoryOperationApiService,
                                    InventoryOperationDataService, $rootScope, NgTableParams) {

    $scope.getAllInventoryOperation = function () {
        InventoryOperationApiService.getAll().then(function (result) {
            InventoryOperationDataService.setModels(result);
            $scope.inventoryDocuments = InventoryOperationDataService.getModels();
            $scope.inventoryDocumentClick($scope.inventoryDocuments[$scope.inventoryDocuments.length - 1]);
        });
    };
    $scope.inventoryDocumentClick = function (result) {
        if (result) {
            $scope.currentInventoryDocument = result;
            $scope.nomenclatureCards = [];
            result.nomenclatureCardForInventory.forEach(function (nomenclatureCard) {
                if (nomenclatureCard.collectionId === 0) $scope.nomenclatureCards.push(nomenclatureCard);
            });
            $scope.tableNomenclatureCardsParams = new NgTableParams({
                sorting: {inventoryNumber: "asc"},
                count: 25
            }, {counts: [25, 50, 100], dataset: $scope.nomenclatureCards});
            $scope.collections = [];
            $scope.currentInventoryDocument.nomenclatureCardForInventory.forEach(function (nomenclatureCard) {
                if (nomenclatureCard.collectionForInventory) {
                    nomenclatureCard.collectionForInventory.placeOfStorage = nomenclatureCard.placeOfStorage;
                    nomenclatureCard.collectionForInventory.worker = nomenclatureCard.worker;
                    $scope.collections.push(nomenclatureCard.collectionForInventory);
                }
            });
            $scope.collections = uniq($scope.collections);
            $scope.tableCollectionsParams = new NgTableParams({
                sorting: {inventoryNumber: "asc"},
                count: 25
            }, {counts: [25, 50, 100], dataset: $scope.collections});
        }

    };

    $scope.newInventoryClick = function (flag) {
        var currentInventoryDocument = 0;
        if (flag === 1) {
            currentInventoryDocument = $scope.currentInventoryDocument.id;
        }
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'inventoryUpload.html',
            controller: 'InventoryUploadCtrl',
            size: 'm',
            resolve: {
                current: function () {
                    return currentInventoryDocument;
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };

    $scope.collectionClick = function (collection) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'nomenclatureCardIncollection.html',
            controller: 'NomenclatureCardIncollectionCtrl',
            size: 'lg',
            resolve: {
                collection: function () {
                    return collection;
                },
                currentInventoryDocument: function () {
                    return $scope.currentInventoryDocument;
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };

    $scope.$on('updateInventoryOperation', function () {
        $scope.getAllInventoryOperation();
    });
    $rootScope.$broadcast('updateInventoryOperation');
};
app.controller('InventoryController', InventoryController);

app.controller('InventoryUploadCtrl', function ($scope, FileUploader, $uibModalInstance, $rootScope, current,
                                                AuthService) {
    var uploader = $scope.uploader = new FileUploader({
        url: 'inventory/' + current,
        headers: {Authorization: AuthService.getToken()}
    });
    uploader.onCompleteAll = function () {
        $rootScope.$broadcast('updateInventoryOperation');
        $rootScope.$broadcast('alert', {msg: "Обработка файла инвентаризации выполнена", type: "success"});
        $uibModalInstance.close();
    };
    uploader.onErrorItem = function (fileItem, response) {
        var message = response.error + " " + response.status;
        $rootScope.$broadcast('alert', {msg: message, type: "danger"});
    };
    $scope.close = function () {
        $uibModalInstance.close();
    };

});

app.controller('NomenclatureCardIncollectionCtrl', function ($scope, $uibModalInstance, $rootScope, collection,
                                                             currentInventoryDocument, NgTableParams) {
    $scope.collection = collection;
    $scope.nomenclatureCards = [];
    currentInventoryDocument.nomenclatureCardForInventory.forEach(function (nomenclatureCard) {
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