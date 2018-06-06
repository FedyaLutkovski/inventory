package by.inventory.inventoryapp.controllers.rest;

import by.inventory.inventoryapp.dao.NomenclatureCard;
import by.inventory.inventoryapp.dao.UnicBarcodeInventorySerial;
import by.inventory.inventoryapp.services.NomenclatureCardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/nomenclatureCard")
public class NomenclatureCardController {
    private NomenclatureCardService nomenclatureCardService;

    @Autowired
    public void setService(NomenclatureCardService nomenclatureCardService) {
        this.nomenclatureCardService = nomenclatureCardService;
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(method = RequestMethod.GET, produces = "application/json")
    public Iterable<NomenclatureCard> getAll() {
        return nomenclatureCardService.getAll();
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "unicBarcodeInventorySerial", method = RequestMethod.POST, produces = "application/json")
    public UnicBarcodeInventorySerial unicBarcodeInventorySerial(@RequestBody NomenclatureCard model) {
        return nomenclatureCardService.unicBarcodeInventorySerial(model);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "getAllByCollection/{collectionId}", method = RequestMethod.GET, produces = "application/json")
    public Iterable<NomenclatureCard> getAllByCollection(@PathVariable Long collectionId) {
        return nomenclatureCardService.getAllByCollection(collectionId);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(method = RequestMethod.POST, produces = "application/json")
    public NomenclatureCard add(@RequestBody NomenclatureCard model) {
        return nomenclatureCardService.add(model);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces = "application/json")
    public NomenclatureCard update(@PathVariable Long id, @RequestBody NomenclatureCard model) {
        return nomenclatureCardService.update(id, model);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/writeOff/{placeOfStorageId}", method = RequestMethod.POST, produces = "application/json")
    public void add(@PathVariable Long placeOfStorageId, @RequestBody List<NomenclatureCard> model) {
        nomenclatureCardService.writeOff(model, placeOfStorageId);
    }

}
