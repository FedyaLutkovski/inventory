package by.inventory.inventoryapp.services;

import by.inventory.inventoryapp.dao.CollectionForInventory;
import by.inventory.inventoryapp.repositories.CollectionForInventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CollectionForInventoryService extends BaseService<CollectionForInventory> {
    private CollectionForInventoryRepository collectionForInventoryRepository;

    @Autowired
    public void setRepository(CollectionForInventoryRepository collectionForInventoryRepository) {
        this.collectionForInventoryRepository = collectionForInventoryRepository;
    }


    public Iterable<CollectionForInventory> getAll() {
        return collectionForInventoryRepository.findByDeletedDataIdIsNullOrderById();
    }

    public CollectionForInventory getById(long id) {
        return collectionForInventoryRepository.findOne(id);
    }

    public CollectionForInventory save(CollectionForInventory model) {
        return collectionForInventoryRepository.save(model);
    }

    public CollectionForInventory add(CollectionForInventory model) {
        return save(model);
    }

}
