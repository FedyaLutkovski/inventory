'use strict';

// Оставляет в массиве только уникальные элементы
function uniq(a) {
    var used = {};
    return a.filter(function (obj) {
        return obj.id in used ? 0 : (used[obj.id] = 1);
    });
}

var PlaceOfStorageController = function ($scope, $rootScope, PlaceOfStorageApiService, PlaceOfStorageDataService, $uibModal, TypeOfStoragePlaceApiService, WorkersApiService,
                                         NomenclatureCardApiService, NomenclatureApiService, PlaceOfStorageTempDataService) {
    $scope.remove = function (scope) {
        scope.remove();
    };
// блок поиска ============================================================================
    $scope.findByName = function (item) {
        return (!($scope.query.length > 0 &&
            item.name.toUpperCase().indexOf($scope.query.toUpperCase()) < 0))
    };

    $scope.findByWorker = function (item) {
        if ($scope.query.length > 0 && item.workers) {
            var worker = item.workers.surname + " " + item.workers.name + " " + item.workers.patronymic;
            return (!($scope.query && worker.toUpperCase().indexOf($scope.query.toUpperCase()) < 0))
        }
    };

    $scope.findByBarcodeInNomenclatureCards = function (nomenclatureCard) {
        if ($scope.query.length > 0 && nomenclatureCard.barcode) return (nomenclatureCard.barcode.toUpperCase().indexOf($scope.query.toUpperCase()) > -1);
    };

    $scope.findByBarcodeInCollections = function (collection) {
        if ($scope.query.length > 0 && collection.barcode) return (collection.barcode.toUpperCase().indexOf($scope.query.toUpperCase()) > -1);
    };

    $scope.findByInventoryInNomenclatureCards = function (nomenclatureCard) {
        if ($scope.query.length > 0 && nomenclatureCard.inventoryNumber) return (nomenclatureCard.inventoryNumber.toUpperCase().indexOf($scope.query.toUpperCase()) > -1);
    };

    $scope.findByInventoryInCollections = function (collection) {
        if ($scope.query.length > 0 && collection.inventoryNumber) return (collection.inventoryNumber.toUpperCase().indexOf($scope.query.toUpperCase()) > -1);
    };

    $scope.findByBarcode = function (item) {
        var flag = false;
        item.nomenclatureCards.forEach(function (nomenclatureCard) {
            if (!flag && $scope.findByBarcodeInNomenclatureCards(nomenclatureCard)) {
                flag = true;
            }
            if (!flag && nomenclatureCard.collection && $scope.findByBarcodeInCollections(nomenclatureCard.collection)) {
                flag = true;
            }
        });
        return flag;
    };

    $scope.findByInventory = function (item) {
        var flag = false;
        item.nomenclatureCards.forEach(function (nomenclatureCard) {
            if (!flag && $scope.findByInventoryInNomenclatureCards(nomenclatureCard)) {
                flag = true;
            }
            if (!flag && nomenclatureCard.collection && $scope.findByInventoryInCollections(nomenclatureCard.collection)) {
                flag = true;
            }
        });
        return flag;
    };

    $scope.visible = function (item) {
        var flag = true;
        if ($scope.query.length > 0) {
            flag = false;
            if (($scope.findByName(item) || $scope.findByBarcode(item) || $scope.findByWorker(item) ||
                    $scope.findByInventory(item)) && !flag) {
                flag = true;
                $scope.queryArray = [];
                if (item.nodes) $scope.visibleNodes(item.nodes);
            }
            if (!flag && item.nodes) {
                item.nodes.forEach(function (node) {
                    if (!flag) {
                        flag = $scope.visible(node);
                    }
                });
            }

            if (!flag && $scope.queryArray.indexOf(item.name) > -1) {
                flag = true;
            }
        }
        return flag;
    };

    $scope.visibleNodes = function (nodes) {
        nodes.forEach(function (node) {
            if ($scope.queryArray.indexOf(node.name) < 0 && $scope.query.length > 0) $scope.queryArray.push(node.name);
            if (node.nodes) $scope.visibleNodes(node.nodes);
        })
    };

    $scope.findNodes = function () {
        $scope.expandAll();
    };
// =====================================================================================================================
    $scope.toggleClick = function (scope) {
        var nodeData = scope.$modelValue;
        if (nodeData.nodes == null) {
            $scope.getAllHeir(nodeData);
        }
    }

    $scope.collapseAll = function () {
        $scope.$broadcast('angular-ui-tree:collapse-all');
    };

    $scope.expandAll = function () {
        $scope.$broadcast('angular-ui-tree:expand-all');
    };
    $scope.getAllPlaceOfStorageOnlyParent = function () {
        PlaceOfStorageApiService.getAllSeeingParent(0).then(function (result) {
            if (result.length > 0) {
                $scope.data = result;
                PlaceOfStorageDataService.setModels($scope.data);
                $scope.PlaceOfStorageClick(result[0]);
                $scope.getAllHeir($scope.data);
            }
        });
    };

    $scope.getAllHeir = function (nodeData) {
        nodeData.forEach(function (item) {
            if (item.nodes == null) {
                PlaceOfStorageApiService.getAllSeeingParent(item.id).then(function (result) {
                    item.nodes = result;
                    $scope.getAllHeir(item.nodes);
                });
            }
        });
    };

    $scope.PlaceOfStorageAddClick = function (parentModel) {
        if (parentModel) {
            PlaceOfStorageApiService.getPlaceOfStorageById(parentModel.id).then(function (result) {
                $scope.placeOfStorageNewEdit.parent = result;
            });
        }
        $scope.placeOfStorageNewEdit = {
            name: ''
        };
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'placeOfStorageEditView.html',
            controller: 'PlaceOfStorageAddEditCtrl',
            size: 'm',
            resolve: {
                placeOfStorage: function () {
                    return $scope.placeOfStorageNewEdit;
                },
                typesOfStoragePlace: function () {
                    return TypeOfStoragePlaceApiService.getAll();
                },
                workers: function () {
                    return WorkersApiService.getAll();
                },
                parents: function () {
                    return PlaceOfStorageApiService.getAllExceptName($scope.currentPlaceOfStorage.name);
                },
                nomenclatureCards: function () {
                    return [];
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };

    $scope.PlaceOfStorageEditClick = function (placeOfStrorage) {
        $scope.currentPlaceOfStorage = placeOfStrorage;
        PlaceOfStorageApiService.getPlaceOfStorageById(placeOfStrorage.parent).then(function (result) {
            $scope.placeOfStorageNewEdit.parent = result;
        });
        $scope.placeOfStorageNewEdit = {
            id: placeOfStrorage.id,
            name: placeOfStrorage.name,
            typeOfStoragePlace: placeOfStrorage.typeOfStoragePlace,
            workers: placeOfStrorage.workers,
            nodes: placeOfStrorage.nodes
        };
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'placeOfStorageEditView.html',
            controller: 'PlaceOfStorageAddEditCtrl',
            size: 'm',
            resolve: {
                placeOfStorage: function () {
                    return $scope.placeOfStorageNewEdit;
                },
                typesOfStoragePlace: function () {
                    return TypeOfStoragePlaceApiService.getAll();
                },
                workers: function () {
                    return WorkersApiService.getAll();
                },
                parents: function () {
                    return PlaceOfStorageApiService.getAllExceptName($scope.currentPlaceOfStorage.name);
                },
                nomenclatureCards: function () {
                    return placeOfStrorage.nomenclatureCards;
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };

    $scope.PlaceOfStorageDeleteClick = function (scope) {
        var placeOfStorage = scope.$modelValue;
        $scope.placeOfStorageNewEdit = {
            id: placeOfStorage.id,
            name: placeOfStorage.name
        };
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'placeOfStorageDeleteView.html',
            controller: 'PlaceOfStorageDeleteCtrl',
            size: 'm',
            resolve: {
                placeOfStorage: function () {
                    return $scope.placeOfStorageNewEdit;
                },
                collections: function () {
                    return $scope.collections;
                },
                nomenclatureCards: function () {
                    return $scope.nomenclatureCards;
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };

    $scope.AddSubItemClick = function (scope) {
        var model = scope.$modelValue;
        $scope.PlaceOfStorageAddClick(model);
    };


    $scope.PlaceOfStorageClick = function (placeOfStrorage) {
        $scope.currentPlaceOfStorage = placeOfStrorage;
        $scope.nomenclatureCards = placeOfStrorage.nomenclatureCards;
        $scope.collections = [];
        $scope.nomenclatureCards.forEach(function (value) {
            if (value.collection) {
                $scope.collections.push(value.collection);
            }
        });
        $scope.collections = uniq($scope.collections);
        PlaceOfStorageTempDataService.setModels(placeOfStrorage);
        $rootScope.$broadcast('nomenclatureCardsCollectionsUpdated');
    };


    $scope.NomenclatureCardAddClick = function () {
        $scope.nomenclatureCardNewEdit = {
            barcode: '',
            inventoryNumber: '',
            serialNumber: '',
            receiptDate: '',
            count: 1,
            guarantee: '',
            nomenclature: '',
            serviceDate: ''
        };
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'nomenclatureCardEditView.html',
            controller: 'NomenclatureCardAddEditCtrl',
            size: 'm',
            resolve: {
                nomenclatureCard: function () {
                    return $scope.nomenclatureCardNewEdit;
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };
    $scope.NomenclatureCardTrClick = function (nomenclatureCard) {
        $scope.nomenclatureCardNewEdit = {
            id: nomenclatureCard.id,
            barcode: nomenclatureCard.barcode,
            collection: nomenclatureCard.collection,
            inventoryNumber: nomenclatureCard.inventoryNumber,
            serialNumber: nomenclatureCard.serialNumber,
            receiptDate: nomenclatureCard.receiptDate,
            count: nomenclatureCard.count,
            guarantee: nomenclatureCard.guarantee,
            nomenclature: nomenclatureCard.nomenclature,
            serviceDate: nomenclatureCard.serviceDate
        };

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'nomenclatureCardEditView.html',
            controller: 'NomenclatureCardAddEditCtrl',
            size: 'm',
            resolve: {
                nomenclatureCard: function () {
                    return $scope.nomenclatureCardNewEdit;
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };

    $scope.NomenclatureCardDeleteClick = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'nomenclatureCardDeleteView.html',
            controller: 'NomenclatureCardDeleteCtrl',
            size: 'm',
            resolve: {
                selectedNomenclatureCards: function () {
                    return JSON.parse(angular.toJson($scope.selectedNomenclatureCardsInCollection.concat($scope.selectedNomenclatureCardsWithoutCollection)));
                },
                selectedCollections: function () {
                    return $scope.selectedCollections;
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };
    // работа чекбокса
    $scope.existInCollection = function (item) {
        return $scope.selectedNomenclatureCardsInCollection.indexOf(item) > -1;
    };
    $scope.existCollections = function (item) {
        return $scope.selectedCollections.indexOf(item) > -1;
    };
    $scope.existWithoutCollection = function (item) {
        return $scope.selectedNomenclatureCardsWithoutCollection.indexOf(item) > -1;
    };

    function checkForSelection(collectionId) {
        var inNomenclature = 0;
        var inCollection = 0;
        angular.forEach($scope.nomenclatureCards, function (nomenclatureCard) {
            if (nomenclatureCard.collectionId === collectionId) inNomenclature++;
        });
        angular.forEach($scope.selectedNomenclatureCardsInCollection, function (nomenclatureCard) {
            if (nomenclatureCard.collectionId === collectionId) inCollection++;
        });
        if (inNomenclature === inCollection) return true;
        else return false;
    }

    function checkForCheckAllStatus() {
        var count = $scope.selectedNomenclatureCardsInCollection.length + $scope.selectedNomenclatureCardsWithoutCollection.length;
        if (count === $scope.nomenclatureCards.length) return true;
        else return false;
    }

    $scope.ToggleNomenclatureCardInCollectionClick = function (item, collection) {
        var idx = $scope.selectedNomenclatureCardsInCollection.indexOf(item);
        if (idx > -1) {
            $scope.selectedNomenclatureCardsInCollection.splice(idx, 1);
            $scope.selectAll = false;
        } else {
            $scope.selectedNomenclatureCardsInCollection.push(item);
        }
        if (checkForSelection(collection.id)) $scope.selectedCollections.push(collection)
        else {
            idx = $scope.selectedCollections.indexOf(collection);
            $scope.selectedCollections.splice(idx, 1);
        }
        $scope.selectAll = checkForCheckAllStatus();
    };

    $scope.ToggleNomenclatureCardWithoutCollectionClick = function (item) {
        var idx = $scope.selectedNomenclatureCardsWithoutCollection.indexOf(item);
        if (idx > -1) {
            $scope.selectedNomenclatureCardsWithoutCollection.splice(idx, 1);
            $scope.selectAll = false;
        } else {
            $scope.selectedNomenclatureCardsWithoutCollection.push(item);
        }
        $scope.selectAll = checkForCheckAllStatus();
    };

    $scope.checkAll = function () {
        if (!$scope.selectAll) {
            $rootScope.$broadcast('nomenclatureCardsCollectionsUpdated');
            angular.forEach($scope.collections, function (collection) {
                $scope.checkAllCollection(collection);
            });
            $scope.selectAll = true;
            angular.forEach($scope.nomenclatureCards, function (item) {
                if (item.collectionId === 0) {
                    var idx = $scope.selectedNomenclatureCardsWithoutCollection.indexOf(item);
                    if (idx >= 0) {
                        return true;
                    } else {
                        $scope.selectedNomenclatureCardsWithoutCollection.push(item);
                    }
                }
            });
        } else {
            $rootScope.$broadcast('nomenclatureCardsCollectionsUpdated');
        }
    };

    $scope.checkAllCollection = function (collection) {
        var idx = $scope.selectedCollections.indexOf(collection);
        if (idx > -1) {
            $scope.selectedCollections.splice(idx, 1);
        } else {
            $scope.selectedCollections.push(collection);
        }
        if ($scope.selectedCollections.indexOf(collection) > -1) {
            angular.forEach($scope.nomenclatureCards, function (item) {
                if (item.collectionId === collection.id) {
                    var idx = $scope.selectedNomenclatureCardsInCollection.indexOf(item);
                    if (idx >= 0) {
                        return true;
                    } else {
                        $scope.selectedNomenclatureCardsInCollection.push(item);
                    }
                }
            });
        } else {
            angular.forEach($scope.nomenclatureCards, function (item) {
                if (item.collectionId === collection.id) {
                    var idx = $scope.selectedNomenclatureCardsInCollection.indexOf(item);
                    if (idx >= 0) {
                        $scope.selectAll = false;
                        $scope.selectedNomenclatureCardsInCollection.splice(idx, 1);
                    }
                }
            });
        }
        $scope.selectAll = checkForCheckAllStatus();
    };

    //Добавление карточки номенклатуры в существующую коллекцию
    $scope.addNomenclatureCardInExistCollectionClick = function () {
        $scope.nomenclatureCardNewEdit = $scope.selectedNomenclatureCardsWithoutCollection;
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'addNomenclatureCardInExistCollectionView.html',
            controller: 'NomenclatureCardEditForUpdateCollectionCtrl',
            size: 'm',
            resolve: {
                nomenclatureCard: function () {
                    return $scope.nomenclatureCardNewEdit;
                },
                collections: function () {
                    return $scope.collections;
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };

    //Удаление карточки номенклатуры из коллекции
    $scope.deleteNomenclatureCardFromExistCollectionClick = function () {
        $scope.nomenclatureCardNewEdit = $scope.selectedNomenclatureCardsInCollection;
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'deleteNomenclatureCardfromCollectionView.html',
            controller: 'NomenclatureCardEditForUpdateCollectionCtrl',
            size: 'm',
            resolve: {
                nomenclatureCard: function () {
                    return $scope.nomenclatureCardNewEdit;
                },
                collections: function () {
                    return $scope.collections;
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };

    //Добавление коллекции
    $scope.CollectionAddClick = function () {
        $scope.nomenclatureCardNewEdit = $scope.selectedNomenclatureCardsWithoutCollection;
        $scope.collectionNewEdit = {
            name: '',
            barcode: '',
            inventoryNumber: '',
            serialNumber: '',
            buildDate: '',
            guarantee: '',
            serviceDate:''
        };
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'collectionEditView.html',
            controller: 'CollectionAddEditCtrl',
            size: 'm',
            resolve: {
                nomenclatureCard: function () {
                    return $scope.nomenclatureCardNewEdit;
                },
                collection: function () {
                    return $scope.collectionNewEdit;
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };
    //Редактирование коллекции
    $scope.CollectionEditClick = function (collection) {
        $scope.collectionNewEdit = {
            id: collection.id,
            name: collection.name,
            barcode: collection.barcode,
            inventoryNumber: collection.inventoryNumber,
            serialNumber: collection.serialNumber,
            buildDate: collection.buildDate,
            guarantee: collection.guarantee,
            serviceDate:collection.serviceDate
        };
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'collectionEditView.html',
            controller: 'CollectionAddEditCtrl',
            size: 'm',
            resolve: {
                nomenclatureCard: function () {
                    return NomenclatureCardApiService.getAllByCollection(collection.id);
                },
                collection: function () {
                    return $scope.collectionNewEdit;
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };
    //Перемещение номенклатуры
    $scope.NomenclatureCardMoveClick = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'moveNomenclatureCardView.html',
            controller: 'MoveNomenclatureCardCtrl',
            size: 'm',
            resolve: {
                finalArr: function () {
                    return $scope.selectedNomenclatureCardsInCollection.concat($scope.selectedNomenclatureCardsWithoutCollection);
                },
                placesOfStorage: function () {
                    return PlaceOfStorageApiService.getAll();
                }
            }
        }).result.then(function () {
        }, function (res) {
        });  // Избовляет от ошибки в консоли "Possibly unhandled rejection: backdrop click"
    };

    $scope.queryArray = [];
    $scope.query = "";
    $scope.getAllPlaceOfStorageOnlyParent();
    $scope.$on('getAllPlaceOfStorageOnlyParent', function () {
        $scope.getAllPlaceOfStorageOnlyParent();
    });
    $scope.$on('nomenclatureCardsCollectionsUpdated', function () {
        $scope.selectedNomenclatureCardsInCollection = [];
        $scope.selectedNomenclatureCardsWithoutCollection = [];
        $scope.selectedCollections = [];
        $scope.selectAll = false;
    });
    $scope.$on('collectionsUpdate', function () {
        $scope.PlaceOfStorageClick(PlaceOfStorageTempDataService.getModels());
    });
    $scope.$on('setFirstPlaceOfStorage', function () {
        if ($scope.data.length > 0) {
            $scope.PlaceOfStorageClick($scope.data[0]);
        } else {
            $scope.collections = [];
            $scope.nomenclatureCards = [];
        }
    });
    $rootScope.$broadcast('nomenclatureCardsCollectionsUpdated');
};
app.controller('PlaceOfStorageController', PlaceOfStorageController);

app.controller('PlaceOfStorageAddEditCtrl', function ($scope, $uibModalInstance, PlaceOfStorageApiService,
                                                      placeOfStorage, PlaceOfStorageDataService, $rootScope,
                                                      typesOfStoragePlace, workers, parents, nomenclatureCards) {
    $scope.placeOfStorageNewEdit = placeOfStorage;
    $scope.workers = workers;
    $scope.typesOfStoragePlace = typesOfStoragePlace;
    $scope.parents = parents;
    $scope.ok = function (placeOfStorageNewEdit) {
        if (placeOfStorageNewEdit.parent) {
            placeOfStorageNewEdit.parent = placeOfStorageNewEdit.parent.id;
        } else {
            placeOfStorageNewEdit.parent = 0;
        }
        if (placeOfStorageNewEdit.id > 0) {
            placeOfStorageNewEdit.nodes = [];
            PlaceOfStorageApiService.update(placeOfStorageNewEdit).then(function (placeOfStorageNewModel) {
                if (placeOfStorageNewModel != null) {
                    placeOfStorageNewEdit.nomenclatureCards = nomenclatureCards;
                    PlaceOfStorageDataService.update(placeOfStorageNewEdit);
                    $rootScope.$broadcast('alert', {msg: "Сохранено успешно!", type: "success"});
                    $uibModalInstance.close($scope.placeOfStorageNewEdit);
                } else {
                    $rootScope.$broadcast('alert', {
                        msg: "Место хранения с таким наименованием уже существует",
                        type: "danger"
                    });
                }
            }, function (reason) {
                var message = reason.data.error + " " + reason.data.status;
                $rootScope.$broadcast('alert', {msg: message, type: "danger"});
            });
        } else {
            PlaceOfStorageApiService.add(placeOfStorageNewEdit).then(function (placeOfStorageNewModel) {
                if (placeOfStorageNewModel != null) {
                    placeOfStorageNewModel.nodes = [];
                    placeOfStorageNewModel.nomenclatureCards = nomenclatureCards;
                    PlaceOfStorageDataService.add(placeOfStorageNewModel);
                    $rootScope.$broadcast('alert', {msg: "Сохранено успешно!", type: "success"});
                    $uibModalInstance.close($scope.placeOfStorageNewEdit);
                } else {
                    $rootScope.$broadcast('alert', {
                        msg: "Место хранения с таким наименованием уже существует",
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
        $scope.placeOfStorageNewEdit.name = '';
    };
});

app.controller('PlaceOfStorageDeleteCtrl', function ($scope, $rootScope, $uibModalInstance, PlaceOfStorageApiService,
                                                     placeOfStorage, PlaceOfStorageDataService,
                                                     NomenclatureCardApiService, CollectionApiService, collections,
                                                     nomenclatureCards) {
    $scope.placeOfStorageNewEdit = placeOfStorage;
    $scope.ok = function (id) {
        var temp = PlaceOfStorageDataService.searchSeeingId(id);
        temp.allSeeingId.forEach(function (item) {
            PlaceOfStorageApiService.delete(item).then(function () {
                PlaceOfStorageDataService.delete(item);
                $rootScope.$broadcast('setFirstPlaceOfStorage');
                $rootScope.$broadcast('alert', {msg: "Удаление прошло успешно!", type: "success"});
            }, function (reason) {
                var message = reason.data.error + " " + reason.data.status;
                $rootScope.$broadcast('alert', {msg: message, type: "danger"});
            });
        });
        if (nomenclatureCards.length > 0) {
            NomenclatureCardApiService.writeOff(JSON.parse(angular.toJson(nomenclatureCards)), id).then(function () {
                if (collections.length > 0) {
                    collections.forEach(function (collection) {
                        CollectionApiService.delete(collection.id);
                    });
                }
                $rootScope.$broadcast('alert', {msg: "Списание прошло успешно!", type: "success"});
            }, function (reason) {
                var message = reason.data.error + " " + reason.data.status;
                $rootScope.$broadcast('alert', {msg: message, type: "danger"});
            });
        }
        $uibModalInstance.close(false);
    };
    $scope.cancel = function () {
        $uibModalInstance.close(false);
        $scope.placeOfStorageNewEdit.name = '';
    };
});

app.controller('NomenclatureCardAddEditCtrl', function ($scope, $uibModalInstance, NomenclatureCardApiService,
                                                        nomenclatureCard, $rootScope,
                                                        NomenclatureTypeApiService, NomenclatureApiService,
                                                        PlaceOfStorageApiService, PlaceOfStorageTempDataService,
                                                        PlaceOfStorageDataService) {
    $scope.nomenclatureCardNewEdit = nomenclatureCard;
    $scope.selectedNomenclatureType = [];
    if ($scope.nomenclatureCardNewEdit.receiptDate === "") {
        $scope.nomenclatureCardNewEdit.receiptDate = new Date();
    }
    if ($scope.nomenclatureCardNewEdit.nomenclature) {
        $scope.selectedNomenclatureType.value = $scope.nomenclatureCardNewEdit.nomenclature.nomenclatureType;
        NomenclatureApiService.getAllByNomenclatureType($scope.nomenclatureCardNewEdit.nomenclature.nomenclatureType.id).then(function (result) {
            $scope.nomenclatures = result;
        });
    } else {
        NomenclatureApiService.getAll().then(function (result) {
            $scope.nomenclatures = result;
        });
    }
    $scope.ok = function (nomenclatureCardNewEdit) {
        NomenclatureCardApiService.unicBarcodeInventorySerial(JSON.parse(angular.toJson(nomenclatureCardNewEdit))).then(function (result) {
            if (!result.barcode && !result.inventory && !result.serial) {
                if (nomenclatureCardNewEdit.id > 0) {
                    NomenclatureCardApiService.update(nomenclatureCardNewEdit).then(function () {
                        PlaceOfStorageDataService.updateNomenclatureCard(nomenclatureCardNewEdit);
                        $uibModalInstance.close($scope.nomenclatureCardNewEdit);
                        $rootScope.$broadcast('alert', {msg: "Сохранено успешно!", type: "success"});
                    }, function (reason) {
                        var message = reason.data.error + " " + reason.data.status;
                        $rootScope.$broadcast('alert', {msg: message, type: "danger"});
                    });
                } else {
                    NomenclatureCardApiService.add(nomenclatureCardNewEdit).then(function (nomenclatureCardNewModel) {
                        PlaceOfStorageApiService.addNomenclatureCard(nomenclatureCardNewModel, PlaceOfStorageTempDataService.getModels().id).then(function (value) {
                            PlaceOfStorageDataService.addNomenclatureCard(nomenclatureCardNewModel, PlaceOfStorageTempDataService.getModels().id);
                            $rootScope.$broadcast('alert', {msg: "Сохранено успешно!", type: "success"});
                        });
                        $uibModalInstance.close($scope.nomenclatureCardNewEdit);
                    }, function (reason) {
                        var message = reason.data.error + " " + reason.data.status;
                        $rootScope.$broadcast('alert', {msg: message, type: "danger"});
                    });
                }
            } else {
                if (result.serial != false) {
                    $rootScope.$broadcast('alert', {
                        msg: "Указанный серийный номер уже присутствует в системе",
                        type: "danger"
                    });
                }
                if (result.inventory != false) {
                    $rootScope.$broadcast('alert', {
                        msg: "Указанный инвентарный номер уже присутствует в системе",
                        type: "danger"
                    });
                }
                if (result.barcode != false) {
                    $rootScope.$broadcast('alert', {
                        msg: "Указанный barcode уже присутствует в системе",
                        type: "danger"
                    });
                }
            }
        }, function (reason) {
            var message = reason.data.error + " " + reason.data.status;
            $rootScope.$broadcast('alert', {msg: message, type: "danger"});
        });
    };
    NomenclatureTypeApiService.getAll().then(function (result) {
        $scope.nomenclatureTypes = result;
        $scope.nomenclatureTypes.unshift({id: 0, name: "Показать всё"});
        if (!$scope.selectedNomenclatureType.value) {
            $scope.selectedNomenclatureType.value = $scope.nomenclatureTypes[0];
        }

    });

    $scope.cancel = function () {
        $uibModalInstance.close(false);
        $scope.nomenclatureCardNewEdit.barcode = '';
        $scope.nomenclatureCardNewEdit.inventoryNumber = '';
        $scope.nomenclatureCardNewEdit.serialNumber = '';
        $scope.nomenclatureCardNewEdit.receiptDate = '';
        $scope.nomenclatureCardNewEdit.count = '';
        $scope.nomenclatureCardNewEdit.guarantee = '';
    };
    $scope.selectNomenclatureType = function () {
        if ($scope.selectedNomenclatureType.value && $scope.selectedNomenclatureType.value.id === 0) {
            $scope.getAllNomenclature();
        } else {
            $scope.getAllByNomenclatureType($scope.selectedNomenclatureType.value.id);
        }
    };
    $scope.getAllNomenclature = function () {
        NomenclatureApiService.getAll().then(function (result) {
            $scope.nomenclatures = result;
        });
    };
    $scope.getAllByNomenclatureType = function (nomenclatureTypeId) {
        NomenclatureApiService.getAllByNomenclatureType(nomenclatureTypeId).then(function (result) {
            $scope.nomenclatures = result;
        });
    };

})
;

app.controller('NomenclatureCardDeleteCtrl', function ($scope, $rootScope, $uibModalInstance, NomenclatureCardApiService,
                                                       PlaceOfStorageDataService, PlaceOfStorageTempDataService,
                                                       selectedNomenclatureCards, selectedCollections, CollectionApiService) {
    $scope.nomenclatureCards = JSON.parse(angular.toJson(selectedNomenclatureCards));
    $scope.ok = function () {
        if ($scope.nomenclatureCards.length > 0) {
            var collectionsId = [];
            NomenclatureCardApiService.writeOff(JSON.parse(angular.toJson($scope.nomenclatureCards)), PlaceOfStorageTempDataService.getModels().id).then(function () {
                $scope.nomenclatureCards.forEach(function (nomenclatureCard, idx) {
                    if (nomenclatureCard.count === selectedNomenclatureCards[idx].count) {
                        PlaceOfStorageDataService.deleteNomenclatureCard(nomenclatureCard.id);
                    } else {
                        nomenclatureCard.count = selectedNomenclatureCards[idx].count - nomenclatureCard.count;
                        PlaceOfStorageDataService.updateNomenclatureCard(nomenclatureCard);
                        selectedCollections.forEach(function (collection) {
                            if (nomenclatureCard.collectionId === collection.id) {
                                collectionsId.push(collection.id);
                            }
                        });
                    }
                });
                if (selectedCollections.length > 0) {
                    selectedCollections.forEach(function (collection) {
                        var idx = collectionsId.indexOf(collection.id);
                        if (idx < 0) {
                            CollectionApiService.delete(collection.id);
                        }
                    });
                }
                $rootScope.$broadcast('collectionsUpdate');
                $rootScope.$broadcast('alert', {msg: "Списание прошло успешно!", type: "success"});
            }, function (reason) {
                var message = reason.data.error + " " + reason.data.status;
                $rootScope.$broadcast('alert', {msg: message, type: "danger"});
            });
        }
        $rootScope.$broadcast('nomenclatureCardsCollectionsUpdated');
        $uibModalInstance.close($scope.nomenclatureCards);
    };

    $scope.cancel = function () {
        $uibModalInstance.close(false);
    };
});

app.controller('NomenclatureCardEditForUpdateCollectionCtrl', function ($scope, $uibModalInstance, NomenclatureCardApiService,
                                                                        nomenclatureCard, $rootScope,
                                                                        collections, PlaceOfStorageDataService,
                                                                        CollectionApiService) {
    $scope.collections = collections;
    $scope.selectedCollection = [];
    $scope.ok = function (selectedCollection) {
        nomenclatureCard.forEach(function (value) {
            var collectionId = value.collectionId;
            value = JSON.parse(angular.toJson(value));
            if (!selectedCollection) {
                selectedCollection = null;
            } else {
                value.inventoryNumber = null;
                value.barcode = null;
            }
            value.collection = selectedCollection;
            NomenclatureCardApiService.update(value).then(function () {
                PlaceOfStorageDataService.updateNomenclatureCard(value);
                NomenclatureCardApiService.getAllByCollection(collectionId).then(function (nomenclatureCards) {
                    if (nomenclatureCards.length === 0) {
                        CollectionApiService.delete(collectionId);
                    }
                });
                $rootScope.$broadcast('collectionsUpdate');
            });
        });
        $rootScope.$broadcast('alert', {msg: "Операция прошла успешно!", type: "success"});
        $rootScope.$broadcast('nomenclatureCardsCollectionsUpdated');
        $uibModalInstance.close($scope.nomenclatureCardNewEdit);
    };

    $scope.cancel = function () {
        $uibModalInstance.close(false);
    };

});

app.controller('CollectionAddEditCtrl', function ($scope, $uibModalInstance, NomenclatureCardApiService,
                                                  nomenclatureCard, $rootScope, collection, PlaceOfStorageDataService,
                                                  CollectionApiService) {
    $scope.collectionNewEdit = collection;
    if ($scope.collectionNewEdit.buildDate === "") {
        $scope.collectionNewEdit.buildDate = new Date();
    }

    function updateNomenclatureCard(collection) {
        nomenclatureCard.forEach(function (value) {
            value = JSON.parse(angular.toJson(value));
            value.inventoryNumber = null;
            value.barcode = null;
            value.collection = collection;
            NomenclatureCardApiService.update(value).then(function () {
                PlaceOfStorageDataService.updateNomenclatureCard(value);
                $rootScope.$broadcast('collectionsUpdate');
            });
        });
    }

    $scope.ok = function (collectionNewEdit) {
        CollectionApiService.unicBarcodeInventorySerial(JSON.parse(angular.toJson(collectionNewEdit))).then(function (result) {
            if (!result.barcode && !result.inventory && !result.serial) {
                if (collectionNewEdit.id > 0) {
                    CollectionApiService.update(collectionNewEdit).then(function () {
                        updateNomenclatureCard(collectionNewEdit);
                        $uibModalInstance.close($scope.collectionNewEdit);
                        $rootScope.$broadcast('alert', {msg: "Сохранено успешно!", type: "success"});
                    }, function (reason) {
                        var message = reason.data.error + " " + reason.data.status;
                        $rootScope.$broadcast('alert', {msg: message, type: "danger"});
                    });
                } else {
                    CollectionApiService.add(collectionNewEdit).then(function (collectionNewModel) {
                        updateNomenclatureCard(collectionNewModel);
                        $uibModalInstance.close($scope.collectionNewEdit);
                        $rootScope.$broadcast('alert', {msg: "Сохранено успешно!", type: "success"});
                    }, function (reason) {
                        var message = reason.data.error + " " + reason.data.status;
                        $rootScope.$broadcast('alert', {msg: message, type: "danger"});
                    });
                }
                $rootScope.$broadcast('nomenclatureCardsCollectionsUpdated');
            } else {
                if (result.serial != false) {
                    $rootScope.$broadcast('alert', {
                        msg: "Указанный серийный номер уже присутствует в системе",
                        type: "danger"
                    });
                }
                if (result.inventory != false) {
                    $rootScope.$broadcast('alert', {
                        msg: "Указанный инвентарный номер уже присутствует в системе",
                        type: "danger"
                    });
                }
                if (result.barcode != false) {
                    $rootScope.$broadcast('alert', {
                        msg: "Указанный barcode уже присутствует в системе",
                        type: "danger"
                    });
                }
            }
        }, function (reason) {
            var message = reason.data.error + " " + reason.data.status;
            $rootScope.$broadcast('alert', {msg: message, type: "danger"});
        });
    };
    $scope.cancel = function () {
        $uibModalInstance.close(false);
    };

});

app.controller('MoveNomenclatureCardCtrl', function ($scope, $rootScope, $uibModalInstance, placesOfStorage,
                                                     PlaceOfStorageTempDataService, PlaceOfStorageApiService,
                                                     PlaceOfStorageDataService, finalArr) {
    $scope.placesOfStorage = placesOfStorage;
    $scope.placeOfStorage = [];
    $scope.finalArr = JSON.parse(angular.toJson(finalArr));
    $scope.placesOfStorageId = PlaceOfStorageTempDataService.getModels().id;
    $scope.ok = function (newPlaceOfStorage) {
        $rootScope.$broadcast('nomenclatureCardsCollectionsUpdated');
        PlaceOfStorageApiService.moveNomenclatureCard(JSON.parse(angular.toJson($scope.finalArr)), $scope.placesOfStorageId, newPlaceOfStorage.id).then(function () {
            $scope.finalArr.forEach(function (nomenclatureCard, idx) {
                if (nomenclatureCard.count === finalArr[idx].count) {
                    PlaceOfStorageDataService.deleteNomenclatureCard(nomenclatureCard.id);
                } else {
                    var count = nomenclatureCard.count;
                    nomenclatureCard.count = finalArr[idx].count - nomenclatureCard.count;
                    PlaceOfStorageDataService.updateNomenclatureCard(nomenclatureCard);
                    nomenclatureCard.count = count;
                }
                PlaceOfStorageDataService.addNomenclatureCard(nomenclatureCard, newPlaceOfStorage.id);
            });
            $rootScope.$broadcast('getAllPlaceOfStorageOnlyParent');
            $rootScope.$broadcast('alert', {msg: "Перемещение прошло успешно!", type: "success"});
        }, function (reason) {
            var message = reason.data.error + " " + reason.data.status;
            $rootScope.$broadcast('alert', {msg: message, type: "danger"});
        });
        $uibModalInstance.close($scope.collectionNewEdit);
    };
    $scope.cancel = function () {
        $uibModalInstance.close(false);
    };
});
