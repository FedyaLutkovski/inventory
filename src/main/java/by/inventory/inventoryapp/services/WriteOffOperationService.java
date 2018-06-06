package by.inventory.inventoryapp.services;

import by.inventory.inventoryapp.dao.WriteOffOperation;
import by.inventory.inventoryapp.repositories.WriteOffOperationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WriteOffOperationService {
    private WriteOffOperationRepository writeOffOperationRepository;
    private UserService userService;

    @Autowired
    public void setService(UserService userService) {
        this.userService = userService;
    }

    @Autowired
    public void setRepository(WriteOffOperationRepository writeOffOperationRepository) {
        this.writeOffOperationRepository = writeOffOperationRepository;
    }

    public Iterable<WriteOffOperation> getAll() {
        if (userService.getCurrentUser().getRoles().indexOf("ADMIN") > -1) {
            return writeOffOperationRepository.findByDeletedDataIdIsNullOrderById();
        } else {
            return writeOffOperationRepository.findByAppUser_IdAndDeletedDataIsNullOrderById(userService.getCurrentUser().getId());
        }
    }

    public WriteOffOperation getById(long id) {
        return writeOffOperationRepository.findOne(id);
    }
}
