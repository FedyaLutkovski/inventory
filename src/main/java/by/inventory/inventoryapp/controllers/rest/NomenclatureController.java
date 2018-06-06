package by.inventory.inventoryapp.controllers.rest;

import by.inventory.inventoryapp.dao.Nomenclature;
import by.inventory.inventoryapp.services.NomenclatureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/nomenclature")
public class NomenclatureController {
    private NomenclatureService nomenclatureService;

    @Autowired
    public void setService(NomenclatureService nomenclatureService) {
        this.nomenclatureService = nomenclatureService;
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(method = RequestMethod.GET, produces = "application/json")
    public Iterable<Nomenclature> getAll() {
        return nomenclatureService.getAll();
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/{nomenclatureType}", method = RequestMethod.GET, produces = "application/json")
    public Iterable<Nomenclature> getAllByNomenclatureType(@PathVariable Long nomenclatureType) {
        return nomenclatureService.getAllByNomenclatureType(nomenclatureType);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(method = RequestMethod.POST, produces = "application/json")
    public Nomenclature add(@RequestBody Nomenclature model) {
        return nomenclatureService.add(model);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces = "application/json")
    public Nomenclature update(@PathVariable Long id, @RequestBody Nomenclature model) {
        return nomenclatureService.update(id, model);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = "application/json")
    public void delete(@PathVariable Long id) {
        nomenclatureService.delete(id);
    }
}
