package by.inventory.inventoryapp.controllers.rest;

import by.inventory.inventoryapp.dao.SubUnit;
import by.inventory.inventoryapp.services.SubUnitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/subUnit")
public class SubUnitController {
    private SubUnitService subUnitService;

    @Autowired
    public void setService(SubUnitService subUnitService) {
        this.subUnitService = subUnitService;
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(method = RequestMethod.GET, produces = "application/json")
    public Iterable<SubUnit> getAll() {
        return subUnitService.getAll();
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/addPlaceOfStorage", method = RequestMethod.POST, produces = "application/json")
    public void addPlaceOfStorageBySubUnit() {
        subUnitService.addPlaceOfStorageBySubUnit();
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(method = RequestMethod.POST, produces = "application/json")
    public SubUnit add(@RequestBody SubUnit model) {
        return subUnitService.add(model);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces = "application/json")
    public SubUnit update(@PathVariable Long id, @RequestBody SubUnit model) {
        return subUnitService.update(id, model);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = "application/json")
    public void delete(@PathVariable Long id) {
        subUnitService.delete(id);
    }
}
//ентити где?