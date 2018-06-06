package by.inventory.inventoryapp.controllers.rest;

import by.inventory.inventoryapp.dao.NomenclatureType;
import by.inventory.inventoryapp.services.NomenclatureTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/nomenclatureType")
public class NomenclatureTypeController {
    private NomenclatureTypeService nomenclatureTypeService;

    @Autowired
    public void setService(NomenclatureTypeService nomenclatureTypeService) {
        this.nomenclatureTypeService = nomenclatureTypeService;
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(method = RequestMethod.GET, produces = "application/json")
    public Iterable<NomenclatureType> getAll() {
        return nomenclatureTypeService.getAll();
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(method = RequestMethod.POST, produces = "application/json")
    public NomenclatureType add(@RequestBody NomenclatureType model) {
        return nomenclatureTypeService.add(model);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces = "application/json")
    public NomenclatureType update(@PathVariable Long id, @RequestBody NomenclatureType model) {
        return nomenclatureTypeService.update(id, model);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = "application/json")
    public void delete(@PathVariable Long id) {
        nomenclatureTypeService.delete(id);
    }
}
