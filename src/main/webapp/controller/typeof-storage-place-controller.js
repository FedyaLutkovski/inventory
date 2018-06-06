'use strict';

var TypeOfStoragePlaceController = function ($scope, $uibModal, TypeOfStoragePlaceApiService,
                                             TypeOfStoragePlaceDataService, NgTableParams) {
    $scope.getAllTypeOfStoragePlaces = function () {
        TypeOfStoragePlaceApiService.getAll().then(function (result) {
            TypeOfStoragePlaceDataService.setModels(result);
            $scope.typeOfStoragePlace = TypeOfStoragePlaceDataService.getModels();
            $scope.table = new NgTableParams({
                sorting: {name: "asc"},
                count: 25
            }, {counts: [25, 50, 100], dataset: $scope.typeOfStoragePlace});
        });
    };

    $scope.TypeOfStoragePlaceTrClick = function (typeOfStoragePlace) {
        $scope.typeOfStoragePlaceNewEdit = {
            id: typeOfStoragePlace.id,
            name: typeOfStoragePlace.name
        };

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'typeOfStoragePlaceEditView.html',
            controller: 'TypeOfStoragePlaceAddEditCtrl',
            size: 'm',
            resolve: {
                typeOfStoragePlace: function () {
                    return $scope.typeOfStoragePlaceNewEdit;
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };

    $scope.TypeOfStoragePlaceAddClick = function () {
        $scope.typeOfStoragePlaceNewEdit = {
            name: ''
        };
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'typeOfStoragePlaceEditView.html',
            controller: 'TypeOfStoragePlaceAddEditCtrl',
            size: 'm',
            resolve: {
                typeOfStoragePlace: function () {
                    return $scope.typeOfStoragePlaceNewEdit;
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };

    $scope.TypeOfStoragePlaceDeleteClick = function (typeOfStoragePlace) {
        $scope.typeOfStoragePlaceNewEdit = {
            id: typeOfStoragePlace.id,
            name: typeOfStoragePlace.name,
            description: typeOfStoragePlace.description
        };
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'typeOfStoragePlaceDeleteView.html',
            controller: 'TypeOfStoragePlaceDeleteCtrl',
            size: 'm',
            resolve: {
                typeOfStoragePlace: function () {
                    return $scope.typeOfStoragePlaceNewEdit;
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };

    $scope.getAllTypeOfStoragePlaces();
    $scope.$on('datasetUpdate', function () {
        $scope.table.reload();
    });

};

app.controller('TypeOfStoragePlaceController', TypeOfStoragePlaceController);

app.controller('TypeOfStoragePlaceAddEditCtrl', function ($scope, $uibModalInstance, TypeOfStoragePlaceApiService,
                                                          typeOfStoragePlace, TypeOfStoragePlaceDataService, $rootScope) {
    $scope.typeOfStoragePlaceNewEdit = typeOfStoragePlace;

    $scope.ok = function (typeOfStoragePlaceNewEdit) {
        if (typeOfStoragePlaceNewEdit.id > 0) {
            TypeOfStoragePlaceApiService.update(typeOfStoragePlaceNewEdit).then(function (typeOfStoragePlaceNewModel) {
                if (typeOfStoragePlaceNewModel != null) {
                    TypeOfStoragePlaceDataService.update(typeOfStoragePlaceNewEdit);
                    $rootScope.$broadcast('datasetUpdate');
                    $rootScope.$broadcast('alert', {msg: "Сохранено успешно!", type: "success"});
                    $uibModalInstance.close($scope.typeOfStoragePlaceNewEdit);
                } else {
                    $rootScope.$broadcast('alert', {
                        msg: "Тип хранилища с таким наименованием уже существует",
                        type: "danger"
                    });
                }
            }, function (reason) {
                var message = reason.data.error + " " + reason.data.status;
                $rootScope.$broadcast('alert', {msg: message, type: "danger"});
            });
        } else {
            TypeOfStoragePlaceApiService.add(typeOfStoragePlaceNewEdit).then(function (typeOfStoragePlaceNewModel) {
                if (typeOfStoragePlaceNewModel != null) {
                    TypeOfStoragePlaceDataService.add(typeOfStoragePlaceNewModel);
                    $rootScope.$broadcast('datasetUpdate');
                    $rootScope.$broadcast('alert', {msg: "Сохранено успешно!", type: "success"});
                    $uibModalInstance.close($scope.typeOfStoragePlaceNewEdit);
                } else {
                    $rootScope.$broadcast('alert', {
                        msg: "Тип хранилища с таким наименованием уже существует",
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
        $scope.typeOfStoragePlaceNewEdit.name = '';
    };
});

app.controller('TypeOfStoragePlaceDeleteCtrl', function ($scope, $uibModalInstance, TypeOfStoragePlaceApiService,
                                                         typeOfStoragePlace, TypeOfStoragePlaceDataService, $rootScope) {
    $scope.typeOfStoragePlaceNewEdit = typeOfStoragePlace;

    $scope.ok = function (id) {
        TypeOfStoragePlaceApiService.delete(id).then(function () {
            TypeOfStoragePlaceDataService.delete(id);
            $rootScope.$broadcast('datasetUpdate');
            $rootScope.$broadcast('alert', {msg: "Удаление прошло успешно!", type: "success"});
            $uibModalInstance.close($scope.typeOfStoragePlaceNewEdit);
        }, function (reason) {
            var message = reason.data.error + " " + reason.data.status;
            $rootScope.$broadcast('alert', {msg: message, type: "danger"});
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.close(false);
        $scope.typeOfStoragePlaceNewEdit.name = '';
    };
});