package by.inventory.inventoryapp.repositories;

import by.inventory.inventoryapp.dao.MoveOperation;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MoveOperationRepository extends CrudRepository<MoveOperation, Long> {
    List<MoveOperation> findByDeletedDataIdIsNullOrderById();

    List<MoveOperation> findByAppUser_IdAndDeletedDataIsNullOrderById(Long id);

    MoveOperation findFirstByOrderByIdDesc();
}
