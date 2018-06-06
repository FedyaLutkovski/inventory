package by.inventory.inventoryapp;

import by.inventory.inventoryapp.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;

import java.io.File;
import java.io.FileInputStream;
import java.util.Properties;

@SpringBootApplication
public class InventoryApplication extends SpringBootServletInitializer {
    public static String DOWNLOAD_DIR = "download-dir";
    public static String DOWNLOAD_DIR_IMG = "download-dir-img";
    public static String SIGN_KEY;

    private UserService userService;

    @Autowired
    public void setService(UserService userService) {
        this.userService = userService;
    }

    public static void main(String[] args) {
        SpringApplication.run(InventoryApplication.class, args);
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(InventoryApplication.class);
    }

    @Bean
    CommandLineRunner init() {
        return (String[] args) -> {
            userService.addUserIfNull();
            new File(DOWNLOAD_DIR).mkdir();
            userService.getAll().forEach(user -> {
                new File(DOWNLOAD_DIR + "/" + user.getId()).mkdir();
                new File(DOWNLOAD_DIR + "/" + user.getId() + "/inventory").mkdir();
                new File(DOWNLOAD_DIR + "/" + user.getId() + "/import").mkdir();
            });
            new File(DOWNLOAD_DIR_IMG).mkdir();

//            FileInputStream fis;
//            Properties property = new Properties();
//            fis = new FileInputStream("config.properties");
//            property.load(fis);
//            SIGN_KEY = property.getProperty("signKey");
            SIGN_KEY = "RERE~GNF!@#AUQ^%TX$!EX";
            //TODO: ИСПРАВИТЬ!!!!
        };
    }

}
