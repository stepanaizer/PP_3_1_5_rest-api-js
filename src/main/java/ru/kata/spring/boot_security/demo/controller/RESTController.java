package ru.kata.spring.boot_security.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.AdminService;



import java.util.List;

@RestController
@RequestMapping("/api/users")
public class RESTController {
    private final AdminService adminService;

    public RESTController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/im")
    public ResponseEntity<User> getAuthenticatedUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok()
                .body(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> findUser(@PathVariable Long id) {
        return ResponseEntity.ok()
                .body(adminService.findById(id));
    }

    @GetMapping()
    public ResponseEntity<List<User>> findAllUsers() {
        return ResponseEntity.ok()
                .body(adminService.findAll());
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Role>> findAllRoles() {
        return ResponseEntity.ok()
                .body(adminService.findAllRoles());
    }

    @PostMapping()
    public ResponseEntity<HttpStatus> addUser(@RequestBody User user) {
        adminService.addUser(user);
        return ResponseEntity.ok(HttpStatus.OK);
    }
    @PutMapping()
    public ResponseEntity<HttpStatus> updateUser(@RequestBody User user) {
        adminService.updateUser(user);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable Long id) {
        adminService.deleteUserById(id);
        return ResponseEntity.ok(HttpStatus.OK);
    }
}
