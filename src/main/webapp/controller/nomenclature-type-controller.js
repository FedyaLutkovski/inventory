'use strict';

var NomenclatureTypeController = function ($scope, $uibModal, NomenclatureTypeApiService, NomenclatureTypeDataService,
                                           NgTableParams) {
    $scope.getAllNomenclatureType = function () {
        NomenclatureTypeApiService.getAll().then(function (result) {
            NomenclatureTypeDataService.setModels(result);
            $scope.nomenclatureTypes = NomenclatureTypeDataService.getModels();
            $scope.table = new NgTableParams({
                sorting: {name: "asc"},
                count: 25
            }, {counts: [25, 50, 100], dataset: $scope.nomenclatureTypes});
        });
    };
    $scope.NomenclatureTypeTrClick = function (nomenclatureType) {
        $scope.nomenclatureTypeNewEdit = {
            id: nomenclatureType.id,
            name: nomenclatureType.name
        };

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'nomenclatureTypeEditView.html',
            controller: 'NomenclatureTypeAddEditCtrl',
            size: 'm',
            resolve: {
                nomenclatureType: function () {
                    return $scope.nomenclatureTypeNewEdit;
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };

    $scope.NomenclatureTypeAddClick = function () {
        $scope.nomenclatureTypeNewEdit = {
            name: ''
        };
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'nomenclatureTypeEditView.html',
            controller: 'NomenclatureTypeAddEditCtrl',
            size: 'm',
            resolve: {
                nomenclatureType: function () {
                    return $scope.nomenclatureTypeNewEdit;
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };

    $scope.NomenclatureTypeDeleteClick = function (nomenclatureType) {
        $scope.nomenclatureTypeNewEdit = {
            id: nomenclatureType.id,
            name: nomenclatureType.name
        };
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'nomenclatureTypeDeleteView.html',
            controller: 'NomenclatureTypeDeleteCtrl',
            size: 'm',
            resolve: {
                nomenclatureType: function () {
                    return $scope.nomenclatureTypeNewEdit;
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };
    $scope.$on('datasetUpdate', function () {
        $scope.table.reload();
    });
    $scope.getAllNomenclatureType();

};

app.controller('NomenclatureTypeController', NomenclatureTypeController);

app.controller('NomenclatureTypeAddEditCtrl', function ($scope, $uibModalInstance, NomenclatureTypeApiService,
                                                        nomenclatureType, NomenclatureTypeDataService, $rootScope) {
    $scope.nomenclatureTypeNewEdit = nomenclatureType;

    $scope.ok = function (nomenclatureTypeNewEdit) {
        if (nomenclatureTypeNewEdit.id > 0) {
            NomenclatureTypeApiService.update(nomenclatureTypeNewEdit).then(function (nomenclatureTypeNewModel) {
                if (nomenclatureTypeNewModel != null) {
                    NomenclatureTypeDataService.update(nomenclatureTypeNewEdit);
                    $rootScope.$broadcast('datasetUpdate');
                    $rootScope.$broadcast('alert', {msg: "Сохранено успешно!", type: "success"});
                    $uibModalInstance.close($scope.nomenclatureTypeNewEdit);
                } else {
                    $rootScope.$broadcast('alert', {
                        msg: "Тип номенклатуры с таким наименованием уже существует",
                        type: "danger"
                    });
                }
            }, function (reason) {
                var message = reason.data.error + " " + reason.data.status;
                $rootScope.$broadcast('alert', {msg: message, type: "danger"});
            });
        } else {
            NomenclatureTypeApiService.add(nomenclatureTypeNewEdit).then(function (nomenclatureTypeNewModel) {
                if (nomenclatureTypeNewModel != null) {
                    NomenclatureTypeDataService.add(nomenclatureTypeNewModel);
                    $rootScope.$broadcast('datasetUpdate');
                    $rootScope.$broadcast('alert', {msg: "Сохранено успешно!", type: "success"});
                    $uibModalInstance.close($scope.nomenclatureTypeNewEdit);
                } else {
                    $rootScope.$broadcast('alert', {
                        msg: "Подразделение с таким наименованием уже существует",
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
        $scope.nomenclatureTypeNewEdit.name = '';
    };
});

app.controller('NomenclatureTypeDeleteCtrl', function ($scope, $uibModalInstance, NomenclatureTypeApiService,
                                                       nomenclatureType, NomenclatureTypeDataService, $rootScope) {
    $scope.nomenclatureTypeNewEdit = nomenclatureType;

    $scope.ok = function (id) {
        NomenclatureTypeApiService.delete(id).then(function () {
            NomenclatureTypeDataService.delete(id);
            $rootScope.$broadcast('datasetUpdate');
            $rootScope.$broadcast('alert', {msg: "Удаление прошло успешно!", type: "success"});
            $uibModalInstance.close($scope.nomenclatureTypeNewEdit);
        }, function (reason) {
            var message = reason.data.error + " " + reason.data.status;
            $rootScope.$broadcast('alert', {msg: message, type: "danger"});
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.close(false);
        $scope.nomenclatureTypeNewEdit.name = '';
    };
});