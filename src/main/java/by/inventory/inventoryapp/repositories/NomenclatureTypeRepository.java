package by.inventory.inventoryapp.repositories;

import by.inventory.inventoryapp.dao.NomenclatureType;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NomenclatureTypeRepository extends CrudRepository<NomenclatureType, Long>{
    List<NomenclatureType> findByDeletedDataIdIsNullOrderByName();
    NomenclatureType findByNameAndDeletedDataIsNull(String name);
}
