//package ru.kata.spring.boot_security.demo.controller;
//
//
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.*;
//import ru.kata.spring.boot_security.demo.model.User;
//import ru.kata.spring.boot_security.demo.service.AdminService;
//
//
//@Controller
//@RequestMapping("/admin")
//public class AdminController {
//    private final AdminService adminService;
//
//    public AdminController(AdminService adminService) {
//        this.adminService = adminService;
//    }
//
//    @GetMapping()
//    public String showAllUsers(Model model) {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        User user = (User) authentication.getPrincipal();
//
//        model.addAttribute("newUser", new User());
//        model.addAttribute("user", user);
//        model.addAttribute("users", adminService.findAll());
//        model.addAttribute("allRoles", adminService.findAllRoles());
//        return "admin/admin-page";
//    }
//
//    @PostMapping()
//    public String addUser(@ModelAttribute("user") User user) {
//        adminService.addUser(user);
//        return "redirect:/admin";
//    }
//
//    @PostMapping("/{id}/edit")
//    public String updateUser(@ModelAttribute("user") User user) {
//        adminService.updateUser(user);
//        return "redirect:/admin";
//    }
//
//    @PostMapping("/{id}/delete")
//    public String deleteUser(@PathVariable("id") Long id) {
//        adminService.deleteUserById(id);
//        return "redirect:/admin";
//    }
//}
