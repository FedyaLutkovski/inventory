package by.inventory.inventoryapp.controllers.rest;

import by.inventory.inventoryapp.services.FileUploaderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/fileUpload")
public class FileUploaderController {
    private FileUploaderService fileUploaderService;

    @Autowired
    public void setService(FileUploaderService fileUploaderService) {
        this.fileUploaderService = fileUploaderService;
    }

    @PreAuthorize("hasAuthority('USER')")
    @PostMapping
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile uploadfile) {
        try {
            fileUploaderService.saveUploadedFiles(uploadfile);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity("Successfully uploaded - " + "uploadedFileName", HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(method = RequestMethod.DELETE, produces = "application/json")
    public void deleteAllFilesFolder() {
        fileUploaderService.deleteAllFilesFolder();
    }
}