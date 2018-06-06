'use strict';

var NomenclatureController = function ($scope, $uibModal, NomenclatureApiService, NomenclatureDataService,
                                       NomenclatureTypeApiService, NgTableParams) {
    $scope.getAllNomenclature = function () {
        NomenclatureApiService.getAll().then(function (result) {
            NomenclatureDataService.setModels(result);
            $scope.nomenclatures = NomenclatureDataService.getModels();
            $scope.table = new NgTableParams({
                sorting: {name: "asc"},
                count: 25
            }, {counts: [25, 50, 100], dataset: $scope.nomenclatures});
        });
    };
    $scope.getAllByNomenclatureType = function (nomenclatureTypeId) {
        NomenclatureApiService.getAllByNomenclatureType(nomenclatureTypeId).then(function (result) {
            NomenclatureDataService.setModels(result);
            $scope.nomenclatures = NomenclatureDataService.getModels();
            $scope.table = new NgTableParams({
                sorting: {name: "asc"},
                count: 25
            }, {counts: [25, 50, 100], dataset: $scope.nomenclatures});
        });
    };
    $scope.getAllNomenclatureType = function () {
        NomenclatureTypeApiService.getAll().then(function (result) {
            $scope.selectedNomenclatureType = [];
            $scope.nomenclatureTypes = result;
            $scope.nomenclatureTypes.unshift({id: 0, name: "Показать всё"});
            $scope.selectedNomenclatureType.value = $scope.nomenclatureTypes[0];
        });
    };
    $scope.selectNomenclatureType = function () {
        if ($scope.selectedNomenclatureType.value) {
            if ($scope.selectedNomenclatureType.value.id === 0) {
                $scope.getAllNomenclature();
            } else {
                $scope.getAllByNomenclatureType($scope.selectedNomenclatureType.value.id);
            }
        }
    };
    $scope.NomenclatureTrClick = function (nomenclature) {
        $scope.nomenclatureNewEdit = {
            id: nomenclature.id,
            name: nomenclature.name,
            description: nomenclature.description,
            image: nomenclature.image,
            nomenclatureType: nomenclature.nomenclatureType
        };
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'nomenclatureEditView.html',
            controller: 'NomenclatureAddEditCtrl',
            size: 'm',
            resolve: {
                nomenclature: function () {
                    return $scope.nomenclatureNewEdit;
                },
                nomenclatureTypes: function () {
                    return NomenclatureTypeApiService.getAll();
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };

    $scope.NomenclatureAddClick = function () {
        $scope.nomenclatureNewEdit = {
            name: '',
            description: '',
            image: '',
            nomenclatureType: $scope.selectedNomenclatureType.value
        };
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'nomenclatureEditView.html',
            controller: 'NomenclatureAddEditCtrl',
            size: 'm',
            resolve: {
                nomenclature: function () {
                    return $scope.nomenclatureNewEdit;
                },
                nomenclatureTypes: function () {
                    return NomenclatureTypeApiService.getAll();
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };

    $scope.NomenclatureDeleteClick = function (nomenclature) {
        $scope.nomenclatureNewEdit = {
            id: nomenclature.id,
            name: nomenclature.name,
            description: nomenclature.description,
            image: nomenclature.image,
            nomenclatureType: nomenclature.nomenclatureType
        };
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'nomenclatureDeleteView.html',
            controller: 'NomenclatureDeleteCtrl',
            size: 'm',
            resolve: {
                nomenclature: function () {
                    return $scope.nomenclatureNewEdit;
                }
                ,
                nomenclatureTypes: function () {
                    return NomenclatureTypeApiService.getAll();
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };
    $scope.getAllNomenclatureType();
    $scope.getAllNomenclature();
    $scope.$on('nomenclatureUpdate', function () {
        $scope.selectNomenclatureType();
    });
    $scope.$on('datasetUpdate', function () {
        $scope.table.reload();
    });

};

app.controller('NomenclatureController', NomenclatureController);

app.controller('NomenclatureAddEditCtrl', function ($scope, $uibModalInstance, NomenclatureApiService, nomenclature,
                                                    $rootScope, NomenclatureDataService, nomenclatureTypes, $state) {
    if (nomenclature.nomenclatureType.id === 0) nomenclature.nomenclatureType = null;
    $scope.nomenclatureNewEdit = nomenclature;
    $scope.nomenclatureTypes = nomenclatureTypes;
    $scope.ok = function (nomenclatureNewEdit) {
        //TODO: костыль, для работы без изображний
        nomenclatureNewEdit.image = null;
        //
        if (nomenclatureNewEdit.id > 0) {
            NomenclatureApiService.update(nomenclatureNewEdit).then(function (nomenclatureNewModel) {
                if (nomenclatureNewModel != null) {
                    $rootScope.$broadcast('nomenclatureUpdate');
                    $rootScope.$broadcast('datasetUpdate');
                    $rootScope.$broadcast('alert', {msg: "Сохранено успешно!", type: "success"});
                    $uibModalInstance.close($scope.nomenclatureNewEdit);
                } else {
                    $rootScope.$broadcast('alert', {
                        msg: "Такая номенклатура уже существует",
                        type: "danger"
                    });
                }
            }, function (reason) {
                var message = reason.data.error + " " + reason.data.status;
                $rootScope.$broadcast('alert', {msg: message, type: "danger"});
            });
        } else {
            NomenclatureApiService.add(nomenclatureNewEdit).then(function (nomenclatureNewModel) {
                if (nomenclatureNewModel != null) {
                    NomenclatureDataService.add(nomenclatureNewModel);
                    $rootScope.$broadcast('datasetUpdate');
                    $rootScope.$broadcast('alert', {msg: "Сохранено успешно!", type: "success"});
                    $uibModalInstance.close($scope.nomenclatureNewEdit);
                } else {
                    $rootScope.$broadcast('alert', {
                        msg: "Такая номенклатура уже существует",
                        type: "danger"
                    });
                }
            }, function (reason) {
                var message = reason.data.error + " " + reason.data.status;
                $rootScope.$broadcast('alert', {msg: message, type: "danger"});
            });
        }
    };

    $scope.cancel = function () {
        $uibModalInstance.close(false);
        $scope.nomenclatureNewEdit.name = '';
        $scope.nomenclatureNewEdit.description = '';
        $scope.nomenclatureNewEdit.image = '';
    };

    $scope.PlaceOfStorageByNomenclatureReport = function () {
        $uibModalInstance.close(false);
        $state.go('/.placeOfStorageByNomenclatureReport', {nomenclature: nomenclature});
    };
});

app.controller('NomenclatureDeleteCtrl', function ($rootScope, $scope, $uibModalInstance, NomenclatureApiService,
                                                   nomenclature, NomenclatureDataService) {
    $scope.nomenclatureNewEdit = nomenclature;
    $scope.ok = function (id) {
        NomenclatureApiService.delete(id).then(function () {
            NomenclatureDataService.delete(id);
            $rootScope.$broadcast('datasetUpdate');
            $rootScope.$broadcast('alert', {msg: "Удаление прошло успешно!", type: "success"});
            $uibModalInstance.close($scope.nomenclatureNewEdit);
        }, function (reason) {
            var message = reason.data.error + " " + reason.data.status;
            $rootScope.$broadcast('alert', {msg: message, type: "danger"});
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.close(false);
        $scope.nomenclatureNewEdit.name = '';
        $scope.nomenclatureNewEdit.description = '';
        $scope.nomenclatureNewEdit.image = '';
    };
});