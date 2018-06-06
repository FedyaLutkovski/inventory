package by.inventory.inventoryapp.repositories;

import by.inventory.inventoryapp.dao.PlaceOfStorage;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlaceOfStorageRepository extends CrudRepository<PlaceOfStorage, Long> {
    List<PlaceOfStorage> findByDeletedDataIdIsNullOrderById();

    List<PlaceOfStorage> findByParentAndDeletedDataIsNullOrderByName(Long parent);

    List<PlaceOfStorage> findByTypeOfStoragePlace_IdAndDeletedDataIsNullOrderByName(Long id);

    PlaceOfStorage findByNomenclatureCards_IdAndDeletedDataIsNullOrderByName(Long id);

    List<PlaceOfStorage> findByNomenclatureCards_Nomenclature_IdAndDeletedDataIsNull(Long id);

    PlaceOfStorage findByNameAndDeletedDataIsNull(String name);

    List<PlaceOfStorage> findByNameNotAndDeletedDataIsNullOrderByName(String name);

}

