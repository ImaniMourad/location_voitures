package com.location.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Welcome to the Location Application!";
    }

    @GetMapping("/alan/about")
    public String about() {
        return 6 + " is the number of the day!";
    }
}
