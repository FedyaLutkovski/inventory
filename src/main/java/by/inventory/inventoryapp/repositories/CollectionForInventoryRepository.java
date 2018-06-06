package by.inventory.inventoryapp.repositories;

import by.inventory.inventoryapp.dao.CollectionForInventory;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollectionForInventoryRepository extends CrudRepository<CollectionForInventory, Long> {
    List<CollectionForInventory> findByDeletedDataIdIsNullOrderById();
}
