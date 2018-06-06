package by.inventory.inventoryapp.repositories;

import by.inventory.inventoryapp.dao.Workers;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkersRepository extends CrudRepository<Workers, Long> {
    List<Workers> findByDeletedDataIdIsNullOrderById();
}
