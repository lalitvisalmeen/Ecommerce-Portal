package com.project.ecommerce.rest;

import com.project.ecommerce.entity.Country;
import com.project.ecommerce.service.CountryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class CountryRestController {

    private CountryService countryService;

    public CountryRestController(CountryService countryService){
        this.countryService = countryService;
    }

    @GetMapping("/countries")
    public List<Country> getCountries(){
        return this.countryService.findAllCountries();
    }
}
