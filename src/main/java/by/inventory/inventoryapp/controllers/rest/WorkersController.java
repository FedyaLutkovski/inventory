package by.inventory.inventoryapp.controllers.rest;

import by.inventory.inventoryapp.dao.Workers;
import by.inventory.inventoryapp.services.WorkersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/workers")
public class WorkersController {
    private WorkersService workersService;

    @Autowired
    public void setService(WorkersService workersService) {
        this.workersService = workersService;
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(method = RequestMethod.GET, produces = "application/json")
    public Iterable<Workers> getAll() {
        return workersService.getAll();
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(method = RequestMethod.POST, produces = "application/json")
    public Workers add(@RequestBody Workers model) {
        return workersService.add(model);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces = "application/json")
    public Workers update(@PathVariable Long id, @RequestBody Workers model) {
        return workersService.update(id, model);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = "application/json")
    public void delete(@PathVariable Long id) {
        workersService.delete(id);
    }
}
