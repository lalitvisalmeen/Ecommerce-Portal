package com.project.ecommerce.service;

import com.project.ecommerce.dao.StateRepository;
import com.project.ecommerce.entity.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StateServiceImpl implements StateService {
    private StateRepository stateRepository;

    @Autowired
    public StateServiceImpl(StateRepository stateRepository){
        this.stateRepository = stateRepository;
    }


    @Override
    public List<State> findByCountryCode(String code) {
        return stateRepository.findByCountryCode(code);
    }
}
