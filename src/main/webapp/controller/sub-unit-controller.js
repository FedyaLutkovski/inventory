'use strict';

var SubUnitController = function ($scope, $uibModal, SubUnitApiService, SubUnitDataService, NgTableParams) {
    $scope.getAllSubUnits = function () {
        SubUnitApiService.getAll().then(function (result) {
            SubUnitDataService.setModels(result);
            $scope.subUnits = SubUnitDataService.getModels();
            $scope.table = new NgTableParams({
                sorting: {name: "asc"},
                count: 25
            }, {counts: [25, 50, 100], dataset: $scope.subUnits});
        });
    };
    $scope.SubUnitTrClick = function (subUnit) {
        $scope.subUnitNewEdit = {
            id: subUnit.id,
            name: subUnit.name
        };

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'subUnitEditView.html',
            controller: 'SubUnitAddEditCtrl',
            size: 'm',
            resolve: {
                subUnit: function () {
                    return $scope.subUnitNewEdit;
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };

    $scope.SubUnitAddClick = function () {
        $scope.subUnitNewEdit = {
            name: ''
        };
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'subUnitEditView.html',
            controller: 'SubUnitAddEditCtrl',
            size: 'm',
            resolve: {
                subUnit: function () {
                    return $scope.subUnitNewEdit;
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };

    $scope.SubUnitDeleteClick = function (subUnit) {
        $scope.subUnitNewEdit = {
            id: subUnit.id,
            name: subUnit.name
        };
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'subUnitDeleteView.html',
            controller: 'SubUnitDeleteCtrl',
            size: 'm',
            resolve: {
                subUnit: function () {
                    return $scope.subUnitNewEdit;
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };

    $scope.PlaceOfStorageAddClick = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'placeOfStorageAdd.html',
            controller: 'PlaceOfStorageAddCtrl',
            size: 'm'
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };

    $scope.$on('datasetUpdate', function () {
        $scope.table.reload();
    });
    $scope.getAllSubUnits();

};

app.controller('SubUnitController', SubUnitController);

app.controller('SubUnitAddEditCtrl', function ($rootScope, $scope, $uibModalInstance, SubUnitApiService, subUnit, SubUnitDataService) {
    $scope.subUnitNewEdit = subUnit;

    $scope.ok = function (subUnitNewEdit) {
        if (subUnitNewEdit.id > 0) {
            SubUnitApiService.update(subUnitNewEdit).then(function (subUnitNewModel) {
                if (subUnitNewModel != null) {
                    SubUnitDataService.update(subUnitNewEdit);
                    $rootScope.$broadcast('datasetUpdate');
                    $rootScope.$broadcast('alert', {msg: "Сохранено успешно!", type: "success"});
                    $uibModalInstance.close($scope.subUnitNewEdit);
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
        } else {
            SubUnitApiService.add(subUnitNewEdit).then(function (subUnitNewModel) {
                if (subUnitNewModel != null) {
                    SubUnitDataService.add(subUnitNewModel);
                    $rootScope.$broadcast('datasetUpdate');
                    $rootScope.$broadcast('alert', {msg: "Сохранено успешно!", type: "success"});
                    $uibModalInstance.close($scope.subUnitNewEdit);
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
        $scope.subUnitNewEdit.name = '';
    };
});

app.controller('SubUnitDeleteCtrl', function ($scope, $rootScope, $uibModalInstance, SubUnitApiService, subUnit, SubUnitDataService) {
    $scope.subUnitNewEdit = subUnit;

    $scope.ok = function (id) {
        SubUnitApiService.delete(id).then(function () {
            SubUnitDataService.delete(id);
            $rootScope.$broadcast('alert', {msg: "Удаление прошло успешно!", type: "success"});
            $rootScope.$broadcast('datasetUpdate');
            $uibModalInstance.close($scope.subUnitNewEdit);
        }, function (reason) {
            var message = reason.data.error + " " + reason.data.status;
            $rootScope.$broadcast('alert', {msg: message, type: "danger"});
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.close(false);
        $scope.subUnitNewEdit.name = '';
    };
});

app.controller('PlaceOfStorageAddCtrl', function ($scope, $rootScope, $uibModalInstance, SubUnitApiService) {
    $scope.ok = function () {
        SubUnitApiService.addPlaceOfStorageBySubUnit().then(function () {
            $rootScope.$broadcast('alert', {msg: "Новые места хранения успешно созданы!", type: "success"});
            $uibModalInstance.close();
        }, function (reason) {
            var message = reason.data.error + " " + reason.data.status;
            $rootScope.$broadcast('alert', {msg: message, type: "danger"});
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.close(false);
    };
});