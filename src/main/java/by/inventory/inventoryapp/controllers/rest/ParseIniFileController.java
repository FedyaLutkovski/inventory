package by.inventory.inventoryapp.controllers.rest;

import by.inventory.inventoryapp.dao.ParseFile;
import by.inventory.inventoryapp.services.ParseIniFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/parseIniFile")
public class ParseIniFileController {
    private ParseIniFileService parseIniFileService;

    @Autowired
    public void setService(ParseIniFileService parseIniFileService) {
        this.parseIniFileService = parseIniFileService;
    }

    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(method = RequestMethod.GET, produces = "application/json")
    public List<ParseFile> parseAllIniFiles() {
        return parseIniFileService.parser();
    }


    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(method = RequestMethod.POST, produces = "application/json")
    public void importFile(@RequestBody List<ParseFile> model) {
        parseIniFileService.importFile(model);
    }
}
