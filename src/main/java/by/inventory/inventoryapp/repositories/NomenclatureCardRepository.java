package by.inventory.inventoryapp.repositories;

import by.inventory.inventoryapp.dao.NomenclatureCard;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NomenclatureCardRepository extends CrudRepository<NomenclatureCard, Long> {
    List<NomenclatureCard> findByDeletedDataIdIsNullOrderById();

    List<NomenclatureCard> findByDeletedDataIdIsNullAndCollection_IdOrderById(long collectionId);

    NomenclatureCard findByBarcodeAndDeletedDataIdIsNull(String barcode);

    NomenclatureCard findBySerialNumberAndDeletedDataIdIsNull(String serialNumber);

    NomenclatureCard findByInventoryNumberAndDeletedDataIdIsNull(String inventoryNumber);
}
