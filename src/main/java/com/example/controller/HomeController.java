package com.example.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controller for handling home, about, health, and login pages.
 */
@Controller
public class HomeController {

    /**
     * Displays the home page.
     *
     * @param model the model
     * @return the home page view
     */
    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("title", "Bookish Octo Invention");
        model.addAttribute("description", "Advanced Text Analysis and Security Platform");
        return "index";
    }

    /**
     * Displays the about page.
     *
     * @param model the model
     * @return the about page view
     */
    @GetMapping("/about")
    public String about(Model model) {
        model.addAttribute("title", "About - Bookish Octo Invention");
        return "about";
    }

    /**
     * Displays the health check page.
     *
     * @param model the model
     * @return the health check page view
     */
    @GetMapping("/health")
    public String health(Model model) {
        model.addAttribute("title", "Health Check - Bookish Octo Invention");
        model.addAttribute("status", "OK");
        model.addAttribute("timestamp", System.currentTimeMillis());
        return "health";
    }

    /**
     * Displays the login page.
     *
     * @return the login page view
     */
    @GetMapping("/login")
    public String login() {
        return "login";
    }

    /**
     * Displays the quiz page.
     *
     * @return the quiz page view
     */
    @GetMapping("/quiz")
    public String quiz() {
        return "quiz";
    }
}