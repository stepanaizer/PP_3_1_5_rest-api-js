package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.AdminService;

import java.util.HashSet;
import java.util.Set;

@Controller
@RequestMapping("/admin")
public class AdminController {
    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping()
    public String printAllUsers(Model model) {
        model.addAttribute("users", adminService.findAll());
        return "admin/users";
    }

    @GetMapping("/{id}")
    public String printUser(@PathVariable("id") Long id, Model model) {
        model.addAttribute("user", adminService.findById(id));
        return "admin/user";
    }

    @GetMapping("/new")
    public String newUser(@ModelAttribute("user") User user) {
        return "admin/new";
    }

    @PostMapping()
    public String addDefaultUser(@ModelAttribute("user") User user) {
        adminService.addDefaultUser(user);
        return "redirect:/admin";
    }
    @GetMapping("/{id}/edit")
    public String editUser(Model model, @PathVariable("id") Long id) {
        User user = adminService.findById(id);
        Set<Role> roles = new HashSet<>(adminService.findAllRoles());

        model.addAttribute("user", user);
        model.addAttribute("allRoles", roles);

        return "admin/editUser";
    }

    @PostMapping("/{id}/edit")
    public String updateUser(@ModelAttribute("user") User user) {
        adminService.updateUser(user);
        return "redirect:/admin";
    }

    @PostMapping("/{id}/delete")
    public String deleteUser(@PathVariable("id") Long id) {
        adminService.deleteUserById(id);
        return "redirect:/admin";
    }
}
