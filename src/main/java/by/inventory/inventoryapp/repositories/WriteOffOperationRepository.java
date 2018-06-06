package by.inventory.inventoryapp.repositories;

import by.inventory.inventoryapp.dao.WriteOffOperation;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WriteOffOperationRepository extends CrudRepository <WriteOffOperation, Long> {
    List<WriteOffOperation> findByDeletedDataIdIsNullOrderById();
    List<WriteOffOperation> findByAppUser_IdAndDeletedDataIsNullOrderById(Long id);
    WriteOffOperation findFirstByOrderByIdDesc();
}
