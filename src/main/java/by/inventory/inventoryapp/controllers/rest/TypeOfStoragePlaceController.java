package by.inventory.inventoryapp.controllers.rest;

import by.inventory.inventoryapp.dao.TypeOfStoragePlace;
import by.inventory.inventoryapp.services.TypeOfStoragePlaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/typeOfStoragePlace")
public class TypeOfStoragePlaceController {
    private TypeOfStoragePlaceService typeOfStoragePlaceService;

    @Autowired
    public void setService(TypeOfStoragePlaceService typeOfStoragePlaceService) {
        this.typeOfStoragePlaceService = typeOfStoragePlaceService;
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(method = RequestMethod.GET, produces = "application/json")
    public Iterable<TypeOfStoragePlace> getAll() {
        return typeOfStoragePlaceService.getAll();
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(method = RequestMethod.POST, produces = "application/json")
    public TypeOfStoragePlace add(@RequestBody TypeOfStoragePlace model) {
        return typeOfStoragePlaceService.add(model);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces = "application/json")
    public TypeOfStoragePlace update(@PathVariable Long id, @RequestBody TypeOfStoragePlace model) {
        return typeOfStoragePlaceService.update(id, model);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = "application/json")
    public void delete(@PathVariable Long id) {
        typeOfStoragePlaceService.delete(id);
    }
}
