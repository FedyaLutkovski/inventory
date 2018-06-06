'use strict';

var PlaceOfStorageDataService = function () {

    var placesOfStorage = [];
    var allSeeingId = [];
    var allNomenclatureCardsId = [];

    function sortJSON(data, key, way) {
        return data.sort(function (a, b) {
            var x = a[key];
            var y = b[key];
            if (way === '123') {
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            }
            if (way === '321') {
                return ((x > y) ? -1 : ((x < y) ? 1 : 0));
            }
        });
    }

    function searchForUpdates(arrayForWork, model) {
        arrayForWork.forEach(function (item) {
            if (item.id === model.id) {
                if (item.parent === model.parent) {
                    item.name = model.name;
                    item.typeOfStoragePlace = model.typeOfStoragePlace;
                    item.workers = model.workers;
                } else {
                    item.name = model.name;
                    item.typeOfStoragePlace = model.typeOfStoragePlace;
                    item.workers = model.workers;
                    removeModel(model.id, placesOfStorage);
                    model.nodes = item.nodes;
                    searchNewParent(model, placesOfStorage);
                }
            } else {
                if (item.nodes) {
                    searchForUpdates(item.nodes, model);
                }
            }
        });
    }

    function searchNewParent(model, placesOfStorage) {
        placesOfStorage.forEach(function (item) {
            if (item.id === model.parent) {
                item.nodes.push(model);
            } else {
                if (item.nodes) {
                    searchNewParent(model, item.nodes);
                }
            }
        });
    }

    function searchForAdd(arrayForWork, model) {
        if (model.parent === 0) {
            arrayForWork.push(model);
        } else {
            arrayForWork.forEach(function (item) {
                if (item.id === model.parent) {
                    item.nodes.push(model);
                } else {
                    if (item.nodes) {
                        searchForAdd(item.nodes, model);
                    }
                }
            });
        }
    }

    function removeModel(id, placesOfStorage) {
        placesOfStorage.forEach(function (item) {
            if (item.id === id) {
                _.remove(placesOfStorage, {
                    id: id
                })
            } else {
                if (item.nodes) {
                    removeModel(id, item.nodes);
                }
            }
        });
    }

    function sortAlljson() {
        placesOfStorage = sortJSON(placesOfStorage, 'name', '123');
        placesOfStorage.forEach(function (item) {
            if (item.nodes) {
                item.nodes = sortJSON(item.nodes, 'name', '123');
            }
        });
    }

    function deleteModelWithChild(id, placesOfStorage) {
        placesOfStorage.forEach(function (item) {
            if (item.id === id) {
                allSeeingId.push(item.id);
                item.nomenclatureCards.forEach(function (nomenclatureCard) {
                    allNomenclatureCardsId.push(nomenclatureCard.id);
                })
                if (item.nodes) {
                    deleteAllChild(item.nodes);
                }
            } else {
                if (item.nodes) {
                    deleteModelWithChild(id, item.nodes);
                }
            }
        });
    }

    function deleteAllChild(nodes) {
        if (nodes) {
            nodes.forEach(function (item) {
                allSeeingId.push(item.id);
                item.nomenclatureCards.forEach(function (nomenclatureCard) {
                    allNomenclatureCardsId.push(nomenclatureCard.id);
                })
                if (item.nodes) {
                    deleteAllChild(item.nodes);
                }
            });
        }
    }

    function addNomenclatureCardInPlaceOfStorage(model, placeOfStorageId, arrayForWork) {
        if (model) {
            arrayForWork.forEach(function (item) {
                if (item.id === placeOfStorageId) {
                    item.nomenclatureCards.push(model);
                } else {
                    if (item.nodes) {
                        addNomenclatureCardInPlaceOfStorage(model, placeOfStorageId, item.nodes);
                    }
                }
            });
        }
    }

    function updateNomenclatureCardInPlaceOfStorage(model, arrayForWork) {
        var flag = false;
        if (model) {
            arrayForWork.forEach(function (item) {
                item.nomenclatureCards.forEach(function (nomenclatureCard) {
                    if (nomenclatureCard.id === model.id) {
                        nomenclatureCard.barcode = model.barcode;
                        nomenclatureCard.inventoryNumber = model.inventoryNumber;
                        nomenclatureCard.serialNumber = model.serialNumber;
                        nomenclatureCard.receiptDate = model.receiptDate;
                        nomenclatureCard.count = model.count;
                        nomenclatureCard.guarantee = model.guarantee;
                        nomenclatureCard.nomenclature = model.nomenclature;
                        nomenclatureCard.collection = model.collection;
                        if (model.collection) {
                            nomenclatureCard.collectionId = model.collection.id;
                        } else {
                            nomenclatureCard.collectionId = 0;
                        }
                        flag = true;
                    }
                });
                if (!flag && item.nodes) {
                    updateNomenclatureCardInPlaceOfStorage(model, item.nodes);
                }
            });
        }
    }

    function deleteNomenclatureCardInPlaceOfStorage(id, arrayForWork) {
        var flag = false;
        if (id) {
            arrayForWork.forEach(function (item) {
                item.nomenclatureCards.forEach(function (nomenclatureCard) {
                    if (nomenclatureCard.id === id) {
                        _.remove(item.nomenclatureCards, {
                            id: id
                        })
                        flag = true;
                    }
                });
                if (!flag && item.nodes) {
                    deleteNomenclatureCardInPlaceOfStorage(id, item.nodes);
                }
            });
        }
    }

    this.getModels = function () {
        return placesOfStorage;
    };

    this.setModels = function (models) {
        placesOfStorage = models;
    };

    this.update = function (model) {
        searchForUpdates(placesOfStorage, model);
        sortAlljson();
    };

    this.add = function (model, parentModel) {
        searchForAdd(placesOfStorage, model);
        sortAlljson();
    };

    this.delete = function (id) {
        removeModel(id, placesOfStorage);
    };

    this.searchSeeingId = function (id) {
        allSeeingId = [];
        allNomenclatureCardsId = [];
        deleteModelWithChild(id, placesOfStorage);
        var temp = {allSeeingId: allSeeingId, allNomenclatureCardsId: allNomenclatureCardsId};
        return (temp);
    };
    this.addNomenclatureCard = function (model, placeOfStorageId) {
        addNomenclatureCardInPlaceOfStorage(model, placeOfStorageId, placesOfStorage);
    };
    this.updateNomenclatureCard = function (model) {
        updateNomenclatureCardInPlaceOfStorage(model, placesOfStorage);
    };
    this.deleteNomenclatureCard = function (id) {
        deleteNomenclatureCardInPlaceOfStorage(id, placesOfStorage);
    };


    return this;
};

app.service('PlaceOfStorageDataService', PlaceOfStorageDataService);