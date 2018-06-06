package by.inventory.inventoryapp.config;

import by.inventory.inventoryapp.InventoryApplication;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class
JWTFilter extends GenericFilterBean {
    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String AUTHORITIES_KEY = "roles";

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain filterChain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        String authHeader = request.getHeader(AUTHORIZATION_HEADER);
        if (authHeader == null || !authHeader.startsWith("inventory-web-client-")) {
            //TODO : strings config
            ((HttpServletResponse) res).sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid Authorization header.");
        } else {
            try {
                String token = authHeader.substring(21);
                Claims claims = Jwts.parser().setSigningKey(InventoryApplication.SIGN_KEY).parseClaimsJws(token).getBody();
                request.setAttribute("claims", claims);
                if (getAuthentication(claims) != null) {
                    SecurityContextHolder.getContext().setAuthentication(getAuthentication(claims));
                    filterChain.doFilter(req, res);
                } else
                    ((HttpServletResponse) res).sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
            } catch (SignatureException e) {
                ((HttpServletResponse) res).sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
            }

        }
    }

    private Authentication getAuthentication(Claims claims) {
        Date expiredDate = new Date(claims.get("token_expiration_date", Long.class));
        if (expiredDate.after(new Date())) {
            List<SimpleGrantedAuthority> authorities = new ArrayList<>();
            List<String> roles = (List<String>) claims.get(AUTHORITIES_KEY);
            for (String role : roles) {
                authorities.add(new SimpleGrantedAuthority(role));
            }
            User principal = new User(claims.getSubject(), "", authorities);
            UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                    principal, "", authorities);
            return usernamePasswordAuthenticationToken;
        } else
            return null;

    }
}
