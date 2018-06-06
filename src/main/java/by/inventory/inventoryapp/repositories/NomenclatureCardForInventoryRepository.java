package by.inventory.inventoryapp.repositories;

import by.inventory.inventoryapp.dao.NomenclatureCardForInventory;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NomenclatureCardForInventoryRepository extends CrudRepository<NomenclatureCardForInventory, Long> {
    List<NomenclatureCardForInventory> findByDeletedDataIdIsNullOrderById();
}
