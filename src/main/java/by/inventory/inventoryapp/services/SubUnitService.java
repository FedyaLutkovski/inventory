package by.inventory.inventoryapp.services;

import by.inventory.inventoryapp.dao.PlaceOfStorage;
import by.inventory.inventoryapp.dao.SubUnit;
import by.inventory.inventoryapp.dao.TypeOfStoragePlace;
import by.inventory.inventoryapp.repositories.SubUnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubUnitService extends BaseService<SubUnit> {
    private SubUnitRepository subUnitRepository;
    private PlaceOfStorageService placeOfStorageService;
    private TypeOfStoragePlaceService typeOfStoragePlaceService;
    private Boolean flag;

    @Autowired
    public void setRepository(TypeOfStoragePlaceService typeOfStoragePlaceService) {
        this.typeOfStoragePlaceService = typeOfStoragePlaceService;
    }

    @Autowired
    public void setRepository(SubUnitRepository subUnitRepository) {
        this.subUnitRepository = subUnitRepository;
    }

    @Autowired
    public void setRepository(PlaceOfStorageService placeOfStorageService) {
        this.placeOfStorageService = placeOfStorageService;
    }

    public Iterable<SubUnit> getAll() {
        return subUnitRepository.findByDeletedDataIdIsNullOrderByName();
    }

    public SubUnit getById(long id) {
        return subUnitRepository.findOne(id);
    }

    public SubUnit save(SubUnit model) {
        return subUnitRepository.save(model);
    }

    public SubUnit add(SubUnit model) {
        if (model != null) {
            SubUnit check = subUnitRepository.findByNameAndDeletedDataIsNull(model.getName().trim());
            if (check != null) {
                return null;
            } else {
                return save(model);
            }
        } else return null;
    }

    public SubUnit update(long id, SubUnit model) {
        SubUnit check = subUnitRepository.findByNameAndDeletedDataIsNull(model.getName().trim());
        if (check != null && !check.getId().equals(model.getId())) {
            return null;
        } else {
            SubUnit storedModel = getById(id);
            if (storedModel != null) {
                storedModel.setName(model.getName());
                return save(storedModel);
            }
            return model;
        }
    }

    public void addPlaceOfStorageBySubUnit() {
        List<PlaceOfStorage> placeOfStorages = (List<PlaceOfStorage>) placeOfStorageService.getAll();
        TypeOfStoragePlace typeOfStoragePlace = typeOfStoragePlaceService.findByName("Подразделение");
        if (typeOfStoragePlace == null) {
            TypeOfStoragePlace newTypeOfStoragePlace = new TypeOfStoragePlace();
            newTypeOfStoragePlace.setName("Подразделение");
            typeOfStoragePlace = typeOfStoragePlaceService.add(newTypeOfStoragePlace);
        }
        List<SubUnit> subUnits = (List<SubUnit>) getAll();
        TypeOfStoragePlace finalTypeOfStoragePlace = typeOfStoragePlace;
        subUnits.forEach(subUnit -> {
            flag = true;
            placeOfStorages.forEach(placeOfStorage -> {
                if (placeOfStorage.getName().equals(subUnit.getName())) flag = false;
            });
            if (flag) {
                PlaceOfStorage newPlaceOfStorage = new PlaceOfStorage();
                newPlaceOfStorage.setName(subUnit.getName());
                newPlaceOfStorage.setParent((long) 0);
                newPlaceOfStorage.setTypeOfStoragePlace(finalTypeOfStoragePlace);
                placeOfStorageService.add(newPlaceOfStorage);
            }
        });
    }


}
