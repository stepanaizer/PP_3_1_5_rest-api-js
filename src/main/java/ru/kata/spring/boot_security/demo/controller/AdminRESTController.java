package ru.kata.spring.boot_security.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.AdminService;



import java.util.List;

@RestController
@RequestMapping("/api")
public class AdminRESTController {
    private final AdminService adminService;

    public AdminRESTController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/user")
    public User showUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        System.out.println(user);
        return user;
    }

    @GetMapping("/{id}")
    public User findUser(@PathVariable("id") Long id) {
        return adminService.findById(id);
    }

    @GetMapping("/users")
    public List<User> findAllUsers() {
        return adminService.findAll();
    }

    @GetMapping("/roles")
    public List<Role> findAllRoles() {
        return adminService.findAllRoles();
    }

    @PostMapping("/new")
    public ResponseEntity<HttpStatus> addUser(@RequestBody User user) {
        adminService.addUser(user);
        return ResponseEntity.ok(HttpStatus.OK);
    }
    @PutMapping("/{id}/edit")
    public ResponseEntity<HttpStatus> updateUser(@RequestBody User user) {
        adminService.updateUser(user);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable("id") Long id) {
        adminService.deleteUserById(id);
        return ResponseEntity.ok(HttpStatus.OK);
    }

}
