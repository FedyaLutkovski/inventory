package by.inventory.inventoryapp.services;

import by.inventory.inventoryapp.InventoryApplication;
import by.inventory.inventoryapp.dao.AppUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.applet.AppletStub;
import java.io.*;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;

@Service
public class FileUploaderService {
    private UserService userService;

    @Autowired
    public void setService(UserService userService) {
        this.userService = userService;
    }

    public void saveUploadedFiles(MultipartFile file) throws IOException {
        if (!file.getContentType().equals("application/vnd.ms-excel")) {
            BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream(), "WINDOWS-1251"));
            Path path = Paths.get(InventoryApplication.DOWNLOAD_DIR + "/" + userService.getCurrentUser().getId() + "/import/" + file.getOriginalFilename());
            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(String.valueOf(path)), "UTF-8"));
            int c;
            while ((c = br.read()) != -1) {
                bw.write((char) c);
            }
            br.close();
            bw.close();
        } else {
            byte[] fileBytes = file.getBytes();
            String rootPath = InventoryApplication.DOWNLOAD_DIR + "/" + userService.getCurrentUser().getId() + "/import/" + file.getOriginalFilename();
            File newFile = new File(rootPath);
            BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(newFile));
            stream.write(fileBytes);
            stream.close();
        }
    }

    public void deleteAllFilesFolder() {
        for (File file : Objects.requireNonNull(new File(InventoryApplication.DOWNLOAD_DIR + "/" + userService.getCurrentUser().getId() + "/import/").listFiles()))
            if (file.isFile()) file.delete();
    }
}
