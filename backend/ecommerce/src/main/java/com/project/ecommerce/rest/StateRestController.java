package com.project.ecommerce.rest;

import com.project.ecommerce.entity.State;
import com.project.ecommerce.service.StateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class StateRestController {

    private StateService stateService;

    @Autowired
    public StateRestController(StateService stateService){
        this.stateService = stateService;
    }

    @GetMapping("/states")
    public List<State> findStates(@RequestParam("countryCode") String code){
        return stateService.findByCountryCode(code);
    }
}
