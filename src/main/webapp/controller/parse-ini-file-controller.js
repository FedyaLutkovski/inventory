'use strict';

var ParseIniFileController = function ($scope, $uibModal, ParseIniFileApiService, ParseIniFileDataService,
                                       PlaceOfStorageApiService) {
    $scope.getParseIniFile = function () {
        ParseIniFileApiService.getParsingIniFile().then(function (result) {
            ParseIniFileDataService.setModels(result);
            $scope.placesOfStorage = ParseIniFileDataService.getModels();
            $scope.placesOfStorageClick($scope.placesOfStorage[0]);
            $scope.selectedPlaceOfStorage = [];
            $scope.selectedDevices = [];
            $scope.checkAllPlacesOfStorageClick();
        });
    };

    $scope.placesOfStorageClick = function (value) {
        $scope.data = value;
        checkAllSelectorStatus();
    };

    // работа чекбокса=============================================
    function checkAllSelectorStatus() {
        var i = 0;
        if ($scope.selectedDevices) {
            angular.forEach($scope.data.device, function (item) {
                var idx = $scope.selectedDevices.indexOf(item);
                if (idx >= 0) {
                    i++;
                }
            });
        }
        if ($scope.data.device.length === i) {
            $scope.selectAllDevices = true;
        } else {
            $scope.selectAllDevices = false;
        }
    };

    $scope.existPlaceOfStorage = function (item) {
        return $scope.selectedPlaceOfStorage.indexOf(item) > -1;
    };
    $scope.existDevices = function (item) {
        return $scope.selectedDevices.indexOf(item) > -1;
    };

    $scope.ToggleDevices = function (item) {
        var idx = $scope.selectedDevices.indexOf(item);
        if (idx > -1) {
            $scope.selectedDevices.splice(idx, 1);
        } else {
            $scope.selectedDevices.push(item);
        }
        checkAllSelectorStatus();
    };

    $scope.TogglePlaceOfStroage = function (item) {
        var idx = $scope.selectedPlaceOfStorage.indexOf(item);
        if (idx > -1) {
            $scope.selectedPlaceOfStorage.splice(idx, 1);
            $scope.selectAllPlacesOfStorage = false;
        } else {
            $scope.selectedPlaceOfStorage.push(item);
            if ($scope.selectedPlaceOfStorage.length === $scope.placesOfStorage.length) {
                $scope.selectAllPlacesOfStorage = true;
            }
        }
    };

    $scope.checkAllPlacesOfStorageClick = function () {
        if (!$scope.selectAllPlacesOfStorage) {
            $scope.selectAllPlacesOfStorage = true;
            $scope.selectAllDevices = true;
            angular.forEach($scope.placesOfStorage, function (item) {
                var idx = $scope.selectedPlaceOfStorage.indexOf(item);
                if (idx >= 0) {
                    return true;
                } else {
                    $scope.selectedPlaceOfStorage.push(item);
                    angular.forEach(item.device, function (value) {
                        $scope.selectedDevices.push(value);
                    });
                }
            });

        } else {
            $scope.selectAllPlacesOfStorage = false;
            $scope.selectedPlaceOfStorage = [];
            $scope.selectAllDevices = false;
            $scope.selectedDevices = [];
        }
    };

    $scope.checkAllDevicesClick = function () {
        if (!$scope.selectAllDevices) {
            $scope.selectAllDevices = true;
            angular.forEach($scope.data.device, function (item) {
                var idx = $scope.selectedDevices.indexOf(item);
                if (idx >= 0) {
                    return true;
                } else {
                    $scope.selectedDevices.push(item);
                }
            });
        } else {
            angular.forEach($scope.data.device, function (item) {
                var idx = $scope.selectedDevices.indexOf(item);
                if (idx >= 0) {
                    $scope.selectedDevices.splice(idx, 1);
                }
            });
            $scope.selectAllDevices = false;
        }
    };
    //========================================================

    $scope.PlaceOfStorageClick = function (placeOfStorage) {
        $scope.placeOfStorageNewEdit = {
            id: placeOfStorage.id,
            name: placeOfStorage.name,
            workerName: placeOfStorage.workerName,
            workerSurname: placeOfStorage.workerSurname,
            workerPatronymic: placeOfStorage.workerPatronymic,
            workerDescription: placeOfStorage.workerDescription,
            parent: placeOfStorage.parent,
            device: placeOfStorage.device
        };

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'placeOfStorageEditView.html',
            controller: 'PlaceOfStorageEditCtrl',
            size: 'm',
            resolve: {
                placeOfStorage: function () {
                    return $scope.placeOfStorageNewEdit;
                },
                parents: function () {
                    return PlaceOfStorageApiService.getAll();
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };
    $scope.DeviceClick = function (device, placeOfStorage) {
        $scope.deviceNewEdit = {
            id: device.id,
            type: device.type,
            name: device.name,
            count: parseFloat(device.count)
        };

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'deviceEditView.html',
            controller: 'DeviceEditCtrl',
            size: 'm',
            resolve: {
                device: function () {
                    return $scope.deviceNewEdit;
                },
                placesOfStorage: function () {
                    return placeOfStorage
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };

    $scope.SendToServer = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'sendToServer.html',
            controller: 'SendToServerCtrl',
            size: 'm',
            resolve: {
                selectedPlaceOfStorage: function () {
                    return $scope.selectedPlaceOfStorage;
                },
                selectedDevices: function () {
                    return $scope.selectedDevices;
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };

    $scope.getParseIniFile();

};
app.controller('ParseIniFileController', ParseIniFileController);

app.controller('PlaceOfStorageEditCtrl', function ($scope, $uibModalInstance, placeOfStorage, parents,
                                                   ParseIniFileDataService) {
    $scope.placeOfStorageNewEdit = placeOfStorage;
    $scope.parents = parents;
    $scope.ok = function (placeOfStorageNewEdit) {
        ParseIniFileDataService.update(placeOfStorageNewEdit);
        $uibModalInstance.close($scope.placeOfStorageNewEdit);
    };

    $scope.cancel = function () {
        $uibModalInstance.close(false);
    };
});

app.controller('DeviceEditCtrl', function ($scope, $uibModalInstance, device,
                                           ParseIniFileDataService, placesOfStorage) {
    $scope.deviceNewEdit = device;
    $scope.ok = function (deviceNewEdit) {
        for (var i = 0; i < placesOfStorage.device.length; i++) {
            if (placesOfStorage.device[i].id === deviceNewEdit.id) {
                placesOfStorage.device[i].name = deviceNewEdit.name;
                placesOfStorage.device[i].count = deviceNewEdit.count;
                placesOfStorage.device[i].type = deviceNewEdit.type;
            }
        }
        ParseIniFileDataService.update(placesOfStorage);
        $uibModalInstance.close($scope.deviceNewEdit);
    };

    $scope.cancel = function () {
        $uibModalInstance.close(false);
    };
});

app.controller('SendToServerCtrl', function ($scope, $state, $uibModalInstance, selectedPlaceOfStorage, selectedDevices,
                                             ParseIniFileApiService, $rootScope) {
    $scope.ok = function () {
        if (selectedPlaceOfStorage.length > 0) {
            selectedPlaceOfStorage.forEach(function (placeOfStorage) {
                if (placeOfStorage.parent != 0) {
                    placeOfStorage.parent = placeOfStorage.parent["id"];
                }
                var resultDevices = [];
                placeOfStorage.device.forEach(function (value, i) {
                    if (selectedDevices.indexOf(value) > -1) {
                        resultDevices.push(value);
                    }
                });
                placeOfStorage.device = resultDevices;
            });
            ParseIniFileApiService.add(JSON.parse(angular.toJson(selectedPlaceOfStorage))).then(function () {
                $state.go('/.placeOfStorage');
                $uibModalInstance.close(false);
            }, function (reason) {
                var message = reason.data.error + " " + reason.data.status;
                $rootScope.$broadcast('alert', {msg: message, type: "danger"});
            })
        }
    };

    $scope.cancel = function () {
        $uibModalInstance.close(false);
    };
});