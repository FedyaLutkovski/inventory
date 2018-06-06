package by.inventory.inventoryapp.controllers.rest;

import by.inventory.inventoryapp.dao.WriteOffOperation;
import by.inventory.inventoryapp.services.WriteOffOperationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/writeOffOperation")
public class WriteOffOperationController {
    private WriteOffOperationService writeOffOperationService;

    @Autowired
    public void setService(WriteOffOperationService writeOffOperationService) {
        this.writeOffOperationService = writeOffOperationService;
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(method = RequestMethod.GET, produces = "application/json")
    public Iterable<WriteOffOperation> getAll() {
        return writeOffOperationService.getAll();
    }
}
