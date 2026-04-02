package se.dykservice.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    @GetMapping(value = {"/kalkylator", "/boka", "/boka/**", "/status", "/status/**", "/verkstad", "/verkstad/**"})
    public String forward() {
        return "forward:/index.html";
    }
}
