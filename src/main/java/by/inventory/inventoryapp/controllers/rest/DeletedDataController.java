package by.inventory.inventoryapp.controllers.rest;

import by.inventory.inventoryapp.dao.DeletedData;
import by.inventory.inventoryapp.services.DeletedDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/deletedData")
public class DeletedDataController {
    private DeletedDataService deletedDataService;

    @Autowired
    public void setService(DeletedDataService deletedDataService) {
        this.deletedDataService = deletedDataService;
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(method = RequestMethod.GET, produces = "application/json")
    public Iterable<DeletedData> getAll() {
        return deletedDataService.getAll();
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(method = RequestMethod.POST, produces = "application/json")
    public DeletedData add(@RequestBody DeletedData model) {
        return deletedDataService.add(model);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces = "application/json")
    public DeletedData update(@PathVariable Long id, @RequestBody DeletedData model) {
        return deletedDataService.update(id, model);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = "application/json")
    public void delete(@PathVariable Long id) {
        deletedDataService.delete(id);
    }
}
