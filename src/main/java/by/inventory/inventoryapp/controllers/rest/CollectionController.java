package by.inventory.inventoryapp.controllers.rest;
import by.inventory.inventoryapp.dao.Collection;
import by.inventory.inventoryapp.dao.UnicBarcodeInventorySerial;
import by.inventory.inventoryapp.services.CollectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/collection")
public class CollectionController {
    private CollectionService collectionService;

    @Autowired
    public void setService(CollectionService collectionService) {
        this.collectionService = collectionService;
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "unicBarcodeInventorySerial", method = RequestMethod.POST, produces = "application/json")
    public UnicBarcodeInventorySerial unicBarcodeInventorySerial(@RequestBody Collection model) {
        return collectionService.unicBarcodeInventorySerial(model);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(method = RequestMethod.GET, produces = "application/json")
    public Iterable<Collection> getAll() {
        return collectionService.getAll();
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(method = RequestMethod.POST, produces = "application/json")
    public Collection add(@RequestBody Collection model) {
        return collectionService.add(model);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces = "application/json")
    public Collection update(@PathVariable Long id, @RequestBody Collection model) {
        return collectionService.update(id, model);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = "application/json")
    public void delete(@PathVariable Long id) {
        collectionService.delete(id);
    }
}