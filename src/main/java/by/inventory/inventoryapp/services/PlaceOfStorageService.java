package by.inventory.inventoryapp.services;

import by.inventory.inventoryapp.dao.MoveOperation;
import by.inventory.inventoryapp.dao.NomenclatureCard;
import by.inventory.inventoryapp.dao.PlaceOfStorage;
import by.inventory.inventoryapp.repositories.MoveOperationRepository;
import by.inventory.inventoryapp.repositories.PlaceOfStorageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PlaceOfStorageService extends BaseService<PlaceOfStorage> {
    private PlaceOfStorageRepository placeOfStorageRepository;
    private NomenclatureCardService nomenclatureCardService;
    private MoveOperationRepository moveOperationRepository;
    private CollectionService collectionService;
    private UserService userService;

    @Autowired
    public void setService(UserService userService) {
        this.userService = userService;
    }

    @Autowired
    public void setRepository(PlaceOfStorageRepository placeOfStorageRepository) {
        this.placeOfStorageRepository = placeOfStorageRepository;
    }

    @Autowired
    public void setService(NomenclatureCardService nomenclatureCardService) {
        this.nomenclatureCardService = nomenclatureCardService;
    }

    @Autowired
    public void setService(MoveOperationRepository moveOperationRepository) {
        this.moveOperationRepository = moveOperationRepository;
    }

    @Autowired
    public void setService(CollectionService collectionService) {
        this.collectionService = collectionService;
    }

    public Iterable<PlaceOfStorage> getAll() {
        return placeOfStorageRepository.findByDeletedDataIdIsNullOrderById();
    }

    public Iterable<PlaceOfStorage> getAllExceptName(String name) {
        return placeOfStorageRepository.findByNameNotAndDeletedDataIsNullOrderByName(name);
    }

    public PlaceOfStorage findByNomenclatureCardsId(Long id) {
        return placeOfStorageRepository.findByNomenclatureCards_IdAndDeletedDataIsNullOrderByName(id);
    }

    //Для отчетов=================================================================================================
    public Iterable<PlaceOfStorage> getAllByTypeOfStoragePlace(long id) {
        return placeOfStorageRepository.findByTypeOfStoragePlace_IdAndDeletedDataIsNullOrderByName(id);
    }

    public Iterable<PlaceOfStorage> getAllByNomenclature(long id) {
        return placeOfStorageRepository.findByNomenclatureCards_Nomenclature_IdAndDeletedDataIsNull(id);
    }

    //============================================================================================================
    public Iterable<PlaceOfStorage> getAllSeeingParent(Long parent) {
        List<PlaceOfStorage> initialArray = placeOfStorageRepository.findByParentAndDeletedDataIsNullOrderByName(parent);
        initialArray.forEach(placeOfStorage -> {
            List<NomenclatureCard> activeList = new ArrayList<>();
            placeOfStorage.getNomenclatureCards().forEach(nomenclatureCard -> {
                if (nomenclatureCard.getDeletedData() == null) {
                    if (nomenclatureCard.getCollection() != null) {
                        nomenclatureCard.setCollectionId(nomenclatureCard.getCollection().getId());
                    }
                    activeList.add(nomenclatureCard);
                }
            });
            placeOfStorage.getNomenclatureCards().clear();
            placeOfStorage.getNomenclatureCards().addAll(activeList);
        });
        return initialArray;
    }

    public PlaceOfStorage getById(long id) {
        return placeOfStorageRepository.findOne(id);
    }

    public PlaceOfStorage save(PlaceOfStorage model) {
        return placeOfStorageRepository.save(model);
    }

    public PlaceOfStorage add(PlaceOfStorage model) {
        return save(model);
    }

    public PlaceOfStorage update(long id, PlaceOfStorage model) {
        PlaceOfStorage storedModel = getById(id);
        if (storedModel != null) {
            storedModel.setName(model.getName());
            storedModel.setParent(model.getParent());
            storedModel.setTypeOfStoragePlace(model.getTypeOfStoragePlace());
            storedModel.setWorkers(model.getWorkers());
            save(storedModel);
            return getById(id);
        }
        return model;
    }

    public PlaceOfStorage addNomenclatureCard(long id, NomenclatureCard model) {
        PlaceOfStorage storedModel = getById(id);
        if (storedModel != null) {
            storedModel.setNomenclatureCards(model);
            save(storedModel);
        }
        return storedModel;
    }

    private HashSet<Long> collectionsIdInMovedNc(List<NomenclatureCard> model) {
        Map<Long, Long> collections = new HashMap<>();
        HashSet<Long> result = new HashSet<>();
        model.forEach(nomenclatureCard -> {
            if (nomenclatureCard.getCollection() != null) {
                long collectionID = nomenclatureCard.getCollection().getId();
                if (collections.get(collectionID) == null) {
                    collections.put(collectionID, (long) 1);
                } else {
                    collections.put(collectionID, collections.get(collectionID) + 1);
                }
            }
        });
        collections.forEach((k, v) -> {
            Iterable<NomenclatureCard> inBaseNc = nomenclatureCardService.getAllByCollection(k);
            if (inBaseNc.spliterator().getExactSizeIfKnown() == v) {
                result.add(k);
            }
        });
        return result;
    }

    public void moveNomenclatureCard(long id, List<NomenclatureCard> model, long newId) {
        HashSet<Long> collections = collectionsIdInMovedNc(model);
        List<NomenclatureCard> finalList = new ArrayList<>();
        PlaceOfStorage storedModel = getById(id);
        if (storedModel != null && model != null) {
            model.forEach(nomenclatureCard -> {
                int idxnc = storedModel.getNomenclatureCards().indexOf(nomenclatureCard);
                NomenclatureCard existNomenclatureCard = storedModel.getNomenclatureCards().get(idxnc);
                if (nomenclatureCard.getCollection() != null && !collections.contains(nomenclatureCard.getCollection().getId())) {
                    nomenclatureCard.setCollectionId(0);
                    nomenclatureCard.setCollection(null);
                    nomenclatureCardService.update(nomenclatureCard.getId(), nomenclatureCard);
                }
                if (existNomenclatureCard.getCount() == nomenclatureCard.getCount()) {
                    storedModel.deleteNomenclatureCard(nomenclatureCard);
                    addNomenclatureCard(newId, nomenclatureCard);
                } else {
                    existNomenclatureCard.setCount(existNomenclatureCard.getCount() - nomenclatureCard.getCount());
                    nomenclatureCard.setId(null);
                    nomenclatureCard.setSerialNumber(null);
                    nomenclatureCard.setInventoryNumber(null);
                    nomenclatureCard.setBarcode(null);
                    addNomenclatureCard(newId, nomenclatureCardService.add(nomenclatureCard));
                }
                save(storedModel);
                finalList.add(nomenclatureCard);
            });
            if (!finalList.isEmpty()) {
                MoveOperation moveOperation = new MoveOperation();
                moveOperation.setOperationDate(new Date());
                moveOperation.setNomenclatureCards(finalList);
                moveOperation.setPlaceOfStorage(getById(id));
                moveOperation.setNewPlaceOfStorage(getById(newId));
                moveOperation.setAppUser(userService.getCurrentUser());
                if (moveOperationRepository.findFirstByOrderByIdDesc() != null) {
                    moveOperation.setDocumentNumber(moveOperationRepository.findFirstByOrderByIdDesc().getDocumentNumber() + 1);
                } else {
                    long n = 1;
                    moveOperation.setDocumentNumber(n);
                }
                moveOperationRepository.save(moveOperation);

            }
        }
    }
}
