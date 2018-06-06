package by.inventory.inventoryapp.services;

import by.inventory.inventoryapp.dao.DeletedData;
import by.inventory.inventoryapp.repositories.DeletedDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DeletedDataService {
    private DeletedDataRepository deletedDataRepository;

    @Autowired
    public void setRepository(DeletedDataRepository deletedDataRepository) {
        this.deletedDataRepository = deletedDataRepository;
    }

    public Iterable<DeletedData> getAll() {
        return deletedDataRepository.findAll();
    }

    public DeletedData getById(Long id) {
        return deletedDataRepository.findOne(id);
    }

    public DeletedData save(DeletedData model) {
        return deletedDataRepository.save(model);
    }

    public DeletedData add(DeletedData model) {
        DeletedData storedModel = new DeletedData();
        storedModel.setDeleteDate(model.getDeleteDate());
        return save(storedModel);
    }

    public DeletedData update(long id, DeletedData model) {
        DeletedData storedModel = getById(id);
        storedModel.setDeleteDate(model.getDeleteDate());
        save(storedModel);
        return getById(id);
    }

    public void delete(Long id) {
        deletedDataRepository.delete(id);
    }
}
