package by.inventory.inventoryapp.repositories;

import by.inventory.inventoryapp.dao.InventoryOperation;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryOperationRepository extends CrudRepository<InventoryOperation, Long> {
    List<InventoryOperation> findByDeletedDataIdIsNullOrderById();

    List<InventoryOperation> findByAppUser_IdAndDeletedDataIsNullOrderById(Long id);

    InventoryOperation findFirstByOrderByIdDesc();
}
