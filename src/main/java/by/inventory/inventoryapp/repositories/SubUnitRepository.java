package by.inventory.inventoryapp.repositories;

import by.inventory.inventoryapp.dao.SubUnit;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubUnitRepository extends CrudRepository <SubUnit, Long> {
    List<SubUnit> findByDeletedDataIdIsNullOrderByName();
    SubUnit findByNameAndDeletedDataIsNull(String name);
}
