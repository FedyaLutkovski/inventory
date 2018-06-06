package by.inventory.inventoryapp.repositories;

import by.inventory.inventoryapp.dao.Nomenclature;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface NomenclatureRepository extends CrudRepository<Nomenclature, Long> {
    List<Nomenclature> findByDeletedDataIdIsNullOrderByNomenclatureType();

    List<Nomenclature> findByNomenclatureType_IdAndDeletedDataIdIsNullOrderByNomenclatureType(Long nomenclatureType);

    Nomenclature findByNameAndDeletedDataIsNull(String name);

}
