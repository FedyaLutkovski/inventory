package by.inventory.inventoryapp.services;

import by.inventory.inventoryapp.dao.TypeOfStoragePlace;
import by.inventory.inventoryapp.repositories.TypeOfStoragePlaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class TypeOfStoragePlaceService extends BaseService<TypeOfStoragePlace> {
    private TypeOfStoragePlaceRepository typeOfStoragePlaceRepository;

    @Autowired
    public void setRepository(TypeOfStoragePlaceRepository typeOfStoragePlaceRepository) {
        this.typeOfStoragePlaceRepository = typeOfStoragePlaceRepository;
    }

    public Iterable<TypeOfStoragePlace> getAll() {
        return typeOfStoragePlaceRepository.findByDeletedDataIdIsNullOrderByName();
    }

    public TypeOfStoragePlace findByName(String name) {
        return typeOfStoragePlaceRepository.findByNameAndDeletedDataIsNull(name.trim());
    }

    public TypeOfStoragePlace getById(long id) {
        return typeOfStoragePlaceRepository.findOne(id);
    }

    public TypeOfStoragePlace save(TypeOfStoragePlace model) {
        return typeOfStoragePlaceRepository.save(model);
    }

    public TypeOfStoragePlace add(TypeOfStoragePlace model) {
        TypeOfStoragePlace check = findByName(model.getName());
        if (check != null) {
            return null;
        } else {
            return save(model);
        }
    }

    public TypeOfStoragePlace update(long id, TypeOfStoragePlace model) {
        TypeOfStoragePlace check = findByName(model.getName());
        if (check != null && !check.getId().equals(model.getId())) {
            return null;
        } else {
            TypeOfStoragePlace storedModel = getById(id);
            if (storedModel != null) {
                storedModel.setName(model.getName());
                save(storedModel);
                return getById(id);
            }
            return model;
        }
    }

}
