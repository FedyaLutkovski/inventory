package by.inventory.inventoryapp.repositories;

import by.inventory.inventoryapp.dao.AppUser;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppUserRepository extends CrudRepository<AppUser, Long> {
    AppUser findOneByUsernameAndDeletedDataIsNull(String username);

    List<AppUser> findByDeletedDataIdIsNullOrderById();

    AppUser findByUsernameAndDeletedDataIsNull(String username);
}
