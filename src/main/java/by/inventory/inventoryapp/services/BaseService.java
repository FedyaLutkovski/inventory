package by.inventory.inventoryapp.services;

import by.inventory.inventoryapp.dao.DeletedData;
import by.inventory.inventoryapp.dao.DeletedModel;
import by.inventory.inventoryapp.repositories.DeletedDataRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Date;

public abstract class BaseService<T extends DeletedModel> {

    private DeletedDataRepository deletedDataRepository;

    @Autowired
    public void setRepository(DeletedDataRepository deletedDataRepository) {
        this.deletedDataRepository = deletedDataRepository;
    }

    public void delete(long id) {
        T model = getById(id);
        if (model == null) {
            return;
        }
        Date dateNow = new Date();
        DeletedData storedModelDelete = new DeletedData();
        storedModelDelete.setDeleteDate(dateNow);
        model.setDeletedData(deletedDataRepository.save(storedModelDelete));
        save(model);
    }

    public abstract T getById(long id);

    public abstract T save(T obj);

}