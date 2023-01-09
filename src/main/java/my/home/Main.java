package my.home;

import my.home.web.Application;
import org.springframework.boot.SpringApplication;

import java.io.IOException;

public class Main {

    public static void main(String[] args) throws IOException {
        SpringApplication.run(Application.class, args);
    }
}
