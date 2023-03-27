package ru.kata.spring.boot_security.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping("/user")
    public String getUserPage() {
        return "user/user-page";
    }

    @GetMapping("/admin")
    public String getAdminPage() {
        return "admin/admin-page";
    }
}
