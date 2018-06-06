package by.inventory.inventoryapp.repositories;

import by.inventory.inventoryapp.dao.DeletedData;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeletedDataRepository extends CrudRepository<DeletedData, Long> {
}
