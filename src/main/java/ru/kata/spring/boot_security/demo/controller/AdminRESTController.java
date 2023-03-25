package ru.kata.spring.boot_security.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.AdminService;
import ru.kata.spring.boot_security.demo.util.UserNotCreatedException;
import ru.kata.spring.boot_security.demo.util.UserNotFoundException;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
public class AdminRESTController {
    private final AdminService adminService;

    public AdminRESTController(AdminService adminService) {
        this.adminService = adminService;
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
    public ResponseEntity<HttpStatus> addUser(@RequestBody @Valid User user, BindingResult bindingResult) {

        checkValidationErrors(bindingResult);

        adminService.addUser(user);
        return ResponseEntity.ok(HttpStatus.OK);
    }
    @PutMapping("/{id}/edit")
    public ResponseEntity<HttpStatus> updateUser(@RequestBody @Valid User user, BindingResult bindingResult) {

        checkValidationErrors(bindingResult);
        adminService.updateUser(user);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable("id") Long id) {
        adminService.deleteUserById(id);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @ExceptionHandler
    private ResponseEntity<String> catchUserNotFoundException(UserNotFoundException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler
    private ResponseEntity<String> catchUserNotCreatedException(UserNotCreatedException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    private void checkValidationErrors(BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            StringBuilder errorMsg = new StringBuilder();

            List<FieldError> errors = bindingResult.getFieldErrors();
            for (FieldError error : errors) {
                errorMsg.append(error.getField())
                        .append(" - ").append(error.getDefaultMessage())
                        .append("; ");
            }

            throw new UserNotCreatedException(errorMsg.toString());
        }
    }
}
