package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.example")
@EnableJpaRepositories("com.example")
public class BookishOctoInventionApplication {

    public static void main(String[] args) {
        SpringApplication.run(BookishOctoInventionApplication.class, args);
    }
}