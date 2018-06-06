package by.inventory.inventoryapp.services;

import by.inventory.inventoryapp.dao.MoveOperation;
import by.inventory.inventoryapp.repositories.MoveOperationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MoveOperationService {
    private MoveOperationRepository moveOperationRepository;
    private UserService userService;

    @Autowired
    public void setService(UserService userService) {
        this.userService = userService;
    }

    @Autowired
    public void setRepository(MoveOperationRepository moveOperationRepository) {
        this.moveOperationRepository = moveOperationRepository;
    }

    public Iterable<MoveOperation> getAll() {
        if (userService.getCurrentUser().getRoles().indexOf("ADMIN") > -1) {
            return moveOperationRepository.findByDeletedDataIdIsNullOrderById();
        } else {
            return moveOperationRepository.findByAppUser_IdAndDeletedDataIsNullOrderById(userService.getCurrentUser().getId());
        }
    }

    public MoveOperation getById(long id) {
        return moveOperationRepository.findOne(id);
    }
}
