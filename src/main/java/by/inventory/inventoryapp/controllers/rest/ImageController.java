package by.inventory.inventoryapp.controllers.rest;

import by.inventory.inventoryapp.InventoryApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/image")
public class ImageController {

    private static final String IMG_PREF = "img_";

    @PreAuthorize("hasAuthority('USER')")
    @PostMapping
    public ResponseEntity<?> upload(@RequestParam("id") Long id, @RequestParam("file") MultipartFile uploadfile) {
        try {
            saveUploadedFiles(id, uploadfile);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity("Successfully uploaded - " + "uploadedFileName", HttpStatus.OK);
    }

    private void saveUploadedFiles(Long id, MultipartFile file) throws IOException {
        if (id == null || file.isEmpty()) {
            return;
        }
        byte[] bytes = file.getBytes();
        Path path = Paths.get(InventoryApplication.DOWNLOAD_DIR_IMG + "/" + IMG_PREF + Long.toString(id));
        Files.write(path, bytes);
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(method = RequestMethod.GET, value = "/{imageId}", produces = "image/jpg")
    public byte[] getItemImage(@PathVariable Long imageId) {
        Path fileLocation = Paths.get(InventoryApplication.DOWNLOAD_DIR_IMG + "/" + IMG_PREF + Long.toString(imageId));
        byte[] data = null;
        try {
            data = Files.readAllBytes(fileLocation);
        } catch (Exception e) {

        }
        if (data == null) {
            //TODO : return stub image
        }
        return data;
    }

}
