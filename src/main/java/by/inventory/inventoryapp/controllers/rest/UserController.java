package by.inventory.inventoryapp.controllers.rest;

import by.inventory.inventoryapp.dao.AppUser;
import by.inventory.inventoryapp.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {
    private UserService userService;

    @Autowired
    public void setService(UserService userService) {
        this.userService = userService;
    }


    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(method = RequestMethod.GET, produces = "application/json")
    public Iterable<AppUser> getAll() {
        return userService.getAll();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = "application/json")
    public AppUser getById(@PathVariable Long id) {
        return userService.getById(id);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(method = RequestMethod.POST, produces = "application/json")
    public AppUser add(@RequestBody AppUser model) {
        return userService.add(model);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces = "application/json")
    public AppUser update(@PathVariable Long id, @RequestBody AppUser model) {
        return userService.update(id, model);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = "application/json")
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }
}
