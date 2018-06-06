package by.inventory.inventoryapp.repositories;

import by.inventory.inventoryapp.dao.Collection;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollectionRepository extends CrudRepository<Collection, Long> {
    List<Collection> findByDeletedDataIdIsNullOrderById();

    Collection findByBarcodeAndDeletedDataIdIsNull(String barcode);

    Collection findBySerialNumberAndDeletedDataIdIsNull(String serialNumber);

    Collection findByInventoryNumberAndDeletedDataIdIsNull(String inventoryNumber);
}
