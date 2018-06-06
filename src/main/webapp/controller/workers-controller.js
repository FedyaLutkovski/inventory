'use strict';

var WorkersController = function ($scope, $uibModal, WorkersApiService, WorkersDataService, SubUnitApiService, NgTableParams) {
    $scope.getAllWorkers = function () {
        WorkersApiService.getAll().then(function (result) {
            WorkersDataService.setModels(result);
            $scope.workers = WorkersDataService.getModels();
            $scope.table = new NgTableParams({
                sorting: {surname: "asc"},
                count: 25
            }, {counts: [25, 50, 100], dataset: $scope.workers});
        });
    };
    $scope.WorkersTrClick = function (workers) {
        $scope.workersNewEdit = {
            id: workers.id,
            surname: workers.surname,
            name: workers.name,
            patronymic: workers.patronymic,
            phone: workers.phone,
            subUnit: workers.subUnit,
            description: workers.description
        };

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'workersEditView.html',
            controller: 'WorkersAddEditCtrl',
            size: 'm',
            resolve: {
                workers: function () {
                    return $scope.workersNewEdit;
                },
                subUnits: function () {
                    return SubUnitApiService.getAll();
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };

    $scope.WorkersAddClick = function () {
        $scope.workersNewEdit = {
            surname: '',
            name: '',
            patronymic: '',
            phone: '',
            description: ''
        };
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'workersEditView.html',
            controller: 'WorkersAddEditCtrl',
            size: 'm',
            resolve: {
                workers: function () {
                    return $scope.workersNewEdit;
                },
                subUnits: function () {
                    return SubUnitApiService.getAll();
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };

    $scope.WorkersDeleteClick = function (workers) {
        $scope.workersNewEdit = {
            id: workers.id,
            surname: workers.surname,
            name: workers.name,
            patronymic: workers.patronymic,
            phone: workers.phone,
            subUnit: workers.subUnit
        };
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'workersDeleteView.html',
            controller: 'WorkersDeleteCtrl',
            size: 'm',
            resolve: {
                workers: function () {
                    return $scope.workersNewEdit;
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };
    $scope.$on('datasetUpdate', function () {
        $scope.table.reload();
    });
    $scope.getAllWorkers();

};

app.controller('WorkersController', WorkersController);

app.controller('WorkersAddEditCtrl', function ($scope, $uibModalInstance, WorkersApiService, workers,
                                               WorkersDataService, $rootScope, subUnits) {
    $scope.workersNewEdit = workers;
    $scope.subUnits = subUnits;
    $scope.ok = function (workersNewEdit) {
        if (workersNewEdit.id > 0) {
            WorkersApiService.update(workersNewEdit).then(function () {
                WorkersDataService.update(workersNewEdit);
                $rootScope.$broadcast('alert', {msg: "Сохранено успешно!", type: "success"});
                $rootScope.$broadcast('datasetUpdate');
                $uibModalInstance.close($scope.workersNewEdit);
            }, function (reason) {
                var message = reason.data.error + " " + reason.data.status;
                $rootScope.$broadcast('alert', {msg: message, type: "danger"});
            });
        } else {
            WorkersApiService.add(workersNewEdit).then(function (workersNewModel) {
                WorkersDataService.add(workersNewModel);
                $rootScope.$broadcast('alert', {msg: "Сохранено успешно!", type: "success"});
                $rootScope.$broadcast('datasetUpdate');
                $uibModalInstance.close($scope.workersNewEdit);
            }, function (reason) {
                var message = reason.data.error + " " + reason.data.status;
                $rootScope.$broadcast('alert', {msg: message, type: "danger"});
            });
        }
    };

    $scope.cancel = function () {
        $uibModalInstance.close(false);
        $scope.workersNewEdit.name = '';
        $scope.workersNewEdit.surname = '';
        $scope.workersNewEdit.ptronymic = '';
        $scope.workersNewEdit.phone = '';
        $scope.workersNewEdit.description = '';
    };
});

app.controller('WorkersDeleteCtrl', function ($scope, $rootScope, $uibModalInstance, WorkersApiService, workers, WorkersDataService) {
    $scope.workersNewEdit = workers;

    $scope.ok = function (id) {
        WorkersApiService.delete(id).then(function () {
            WorkersDataService.delete(id);
            $rootScope.$broadcast('alert', {msg: "Удаление прошло успешно!", type: "success"});
            $rootScope.$broadcast('datasetUpdate');
            $uibModalInstance.close($scope.workersNewEdit);
        }, function (reason) {
            var message = reason.data.error + " " + reason.data.status;
            $rootScope.$broadcast('alert', {msg: message, type: "danger"});
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.close(false);
        $scope.workersNewEdit.name = '';
        $scope.workersNewEdit.surname = '';
        $scope.workersNewEdit.ptronymic = '';
        $scope.workersNewEdit.phone = '';
        $scope.workersNewEdit.description = '';
    };
});