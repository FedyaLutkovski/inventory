package by.inventory.inventoryapp.controllers.rest;

import by.inventory.inventoryapp.dao.InventoryOperation;
import by.inventory.inventoryapp.services.InventoryOperationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/inventory")
public class InventoryOperationController {
    private InventoryOperationService inventoryOperationService;

    @Autowired
    public void setService(InventoryOperationService inventoryOperationService) {
        this.inventoryOperationService = inventoryOperationService;
    }

    @PreAuthorize("hasAuthority('USER')")
    @PostMapping(value = "/{id}")
    public ResponseEntity<?> upload(@PathVariable Long id, @RequestParam("file") MultipartFile uploadfile) {
        try {
            inventoryOperationService.saveUploadedFiles(uploadfile, id);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity("Successfully uploaded - " + "uploadedFileName", HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(method = RequestMethod.GET, produces = "application/json")
    public Iterable<InventoryOperation> getAll() {
        return inventoryOperationService.getAll();
    }


    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(method = RequestMethod.POST, produces = "application/json")
    public InventoryOperation add(@RequestBody InventoryOperation model) {
        return inventoryOperationService.add(model);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces = "application/json")
    public InventoryOperation update(@PathVariable Long id, @RequestBody InventoryOperation model) {
        return inventoryOperationService.update(id, model);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = "application/json")
    public void delete(@PathVariable Long id) {
        inventoryOperationService.delete(id);
    }
}
