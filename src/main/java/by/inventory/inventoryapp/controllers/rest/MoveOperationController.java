package by.inventory.inventoryapp.controllers.rest;

import by.inventory.inventoryapp.dao.MoveOperation;
import by.inventory.inventoryapp.services.MoveOperationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/moveOperation")
public class MoveOperationController {
    private MoveOperationService moveOperationService;

    @Autowired
    public void setService(MoveOperationService moveOperationService) {
        this.moveOperationService = moveOperationService;
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(method = RequestMethod.GET, produces = "application/json")
    public Iterable<MoveOperation> getAll() {
        return moveOperationService.getAll();
    }
}