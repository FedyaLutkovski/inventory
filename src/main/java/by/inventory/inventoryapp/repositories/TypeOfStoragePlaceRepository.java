package by.inventory.inventoryapp.repositories;

import  by.inventory.inventoryapp.dao.TypeOfStoragePlace;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TypeOfStoragePlaceRepository extends CrudRepository<TypeOfStoragePlace, Long>{
    List<TypeOfStoragePlace> findByDeletedDataIdIsNullOrderByName();
    TypeOfStoragePlace findByNameAndDeletedDataIsNull(String name);
}
