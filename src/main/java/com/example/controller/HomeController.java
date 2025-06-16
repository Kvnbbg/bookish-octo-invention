package com.example.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("title", "Bookish Octo Invention");
        model.addAttribute("description", "Advanced Text Analysis and Security Platform");
        return "index";
    }

    @GetMapping("/about")
    public String about(Model model) {
        model.addAttribute("title", "About - Bookish Octo Invention");
        return "about";
    }

    @GetMapping("/health")
    public String health(Model model) {
        model.addAttribute("title", "Health Check - Bookish Octo Invention");
        model.addAttribute("status", "OK");
        model.addAttribute("timestamp", System.currentTimeMillis());
        return "health";
    }
}