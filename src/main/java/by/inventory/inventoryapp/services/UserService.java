package by.inventory.inventoryapp.services;

import by.inventory.inventoryapp.dao.AppUser;
import by.inventory.inventoryapp.dao.UserRole;
import by.inventory.inventoryapp.repositories.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService extends BaseService<AppUser> {

    private AppUserRepository appUserRepository;

    @Autowired
    public void setRepository(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    @Override
    public AppUser getById(long id) {
        AppUser appUser = appUserRepository.findOne(id);
        if (appUser != null) {
            return appUser;
        } else {
            return null;
        }
    }

    @Override
    public AppUser save(AppUser model) {
        return appUserRepository.save(model);
    }

    public AppUser findOneByUsername(String userName) {
        return appUserRepository.findOneByUsernameAndDeletedDataIsNull(userName);
    }

    public List<AppUser> getAll() {
        return appUserRepository.findByDeletedDataIdIsNullOrderById();
    }

    public String encode(String pass) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.encode(pass);
    }

    public boolean passwordVerification(String pass, String dbPassword) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        if (passwordEncoder.matches(pass, dbPassword)) {
            return true;
        } else {
            return false;
        }
    }

    public AppUser add(AppUser model) {
        AppUser check = appUserRepository.findByUsernameAndDeletedDataIsNull(model.getUsername().trim());
        if (check != null) {
            return null;
        } else {
            model.setPassword(encode(model.getPassword()));
            if (model.getRoles().spliterator().getExactSizeIfKnown() < 1) {
                List<UserRole> userRoles = new ArrayList<>();
                userRoles.add(UserRole.WITHOUTRIGHTS);
                model.setRoles(userRoles);
            }
            return save(model);
        }
    }

    public AppUser update(long id, AppUser model) {
        AppUser check = appUserRepository.findByUsernameAndDeletedDataIsNull(model.getUsername().trim());
        if (check != null && !check.getId().equals(model.getId())) {
            return null;
        } else {
            AppUser storedModel = getById(id);
            if (storedModel != null) {
                storedModel.setName(model.getName());
                if (model.getPassword() != null) {
                    storedModel.setPassword(encode(model.getPassword()));
                }
                storedModel.setUsername(model.getUsername());
                storedModel.setRoles(model.getRolesEnum());
                save(storedModel);
                return getById(id);
            }
            return model;
        }
    }

    public void addUserIfNull() {
        if (appUserRepository.findAll().spliterator().getExactSizeIfKnown() < 1) {
            AppUser user = new AppUser();
            user.setName("Fedya Lutkovskij");
            user.setUsername("admin");
            user.setPassword(encode("Ghzybr~19gg38"));
            List<UserRole> userRoles = new ArrayList<>();
            userRoles.add(UserRole.ADMIN);
            userRoles.add(UserRole.USER);
            user.setRoles(userRoles);
            appUserRepository.save(user);
        }
    }

    public AppUser getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Object obj = auth.getPrincipal();
        String username = "";
        if (obj instanceof UserDetails) {
            username = ((UserDetails) obj).getUsername();
        } else {
            username = obj.toString();
        }
        return appUserRepository.findByUsernameAndDeletedDataIsNull(username);
    }

}
