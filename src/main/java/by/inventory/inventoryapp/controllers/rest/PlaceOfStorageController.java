package by.inventory.inventoryapp.controllers.rest;

import by.inventory.inventoryapp.dao.NomenclatureCard;
import by.inventory.inventoryapp.dao.PlaceOfStorage;
import by.inventory.inventoryapp.services.PlaceOfStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/placeOfStorage")
public class PlaceOfStorageController {
    private PlaceOfStorageService placeOfStorageService;

    @Autowired
    public void setService(PlaceOfStorageService placeOfStorageService) {
        this.placeOfStorageService = placeOfStorageService;
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(method = RequestMethod.GET, produces = "application/json")
    public Iterable<PlaceOfStorage> getAll() {
        return placeOfStorageService.getAll();
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "exceptName/{name}", method = RequestMethod.GET, produces = "application/json")
    public Iterable<PlaceOfStorage> getAllExceptName(@PathVariable String name) {
        return placeOfStorageService.getAllExceptName(name);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/tosp/{id}", method = RequestMethod.GET, produces = "application/json")
    public Iterable<PlaceOfStorage> getAllByTypeOfStoragePlace(@PathVariable Long id) {
        return placeOfStorageService.getAllByTypeOfStoragePlace(id);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/nomenclature/{id}", method = RequestMethod.GET, produces = "application/json")
    public Iterable<PlaceOfStorage> getAllByNomenclature(@PathVariable Long id) {
        return placeOfStorageService.getAllByNomenclature(id);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/{parent}", method = RequestMethod.GET, produces = "application/json")
    public Iterable<PlaceOfStorage> getAllSeeingParent(@PathVariable Long parent) {
        return placeOfStorageService.getAllSeeingParent(parent);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/getById/{id}", method = RequestMethod.GET, produces = "application/json")
    public PlaceOfStorage getPlaceOfStorageById(@PathVariable Long id) {
        return placeOfStorageService.getById(id);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(method = RequestMethod.POST, produces = "application/json")
    public PlaceOfStorage add(@RequestBody PlaceOfStorage model) {
        return placeOfStorageService.add(model);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces = "application/json")
    public PlaceOfStorage update(@PathVariable Long id, @RequestBody PlaceOfStorage model) {
        return placeOfStorageService.update(id, model);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/addNomenclatureCard/{id}", method = RequestMethod.PUT, produces = "application/json")
    public PlaceOfStorage addNomenclatureCard(@PathVariable Long id, @RequestBody NomenclatureCard model) {
        return placeOfStorageService.addNomenclatureCard(id, model);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/moveNomenclatureCard/{id}/{newId}", method = RequestMethod.POST, produces = "application/json")
    public void moveNomenclatureCard(@PathVariable Long id, @PathVariable Long newId, @RequestBody List<NomenclatureCard> model) {
        placeOfStorageService.moveNomenclatureCard(id, model, newId);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = "application/json")
    public void delete(@PathVariable Long id) {
        placeOfStorageService.delete(id);
    }
}
