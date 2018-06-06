package by.inventory.inventoryapp.controllers.rest;

import by.inventory.inventoryapp.InventoryApplication;
import by.inventory.inventoryapp.dao.AppUser;
import by.inventory.inventoryapp.services.UserService;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/login")
public class LoginController {

    private UserService userService;

    @Autowired
    public void setService(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> login(@RequestBody AppUser user) throws IOException {
        String token = null;
        AppUser appUser = userService.findOneByUsername(user.getUsername());
        Map<String, Object> tokenMap = new HashMap<String, Object>();
        if (userService.passwordVerification(user.getPassword(), appUser.getPassword())) {
            Map<String, Object> tokenData = new HashMap<>();
            tokenData.put("roles", appUser.getRoles());
            tokenData.put("username", user.getUsername());
            tokenData.put("token_create_date", new Date().getTime());
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.HOUR, 480);
            tokenData.put("token_expiration_date", calendar.getTime());
            JwtBuilder jwtBuilder = Jwts.builder();
            jwtBuilder.setExpiration(calendar.getTime());
            jwtBuilder.setClaims(tokenData);
            token = jwtBuilder.setSubject(user.getUsername()).signWith(SignatureAlgorithm.HS512, InventoryApplication.SIGN_KEY).compact();
            tokenMap.put("token", token);
            tokenMap.put("user", appUser);
            return new ResponseEntity<>(tokenMap, HttpStatus.OK);
        } else {
            tokenMap.put("token", null);
            return new ResponseEntity<>(tokenMap, HttpStatus.UNAUTHORIZED);
        }

    }

    @RequestMapping(value = "/registration", method = RequestMethod.POST, produces = "application/json")
    public AppUser add(@RequestBody AppUser model) {
        return userService.add(model);
    }

}
