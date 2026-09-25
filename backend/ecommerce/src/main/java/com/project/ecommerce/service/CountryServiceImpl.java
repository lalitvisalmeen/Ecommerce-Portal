package com.project.ecommerce.service;

import com.project.ecommerce.dao.CountryRepository;
import com.project.ecommerce.entity.Country;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CountryServiceImpl implements CountryService{

    private CountryRepository countryRepository;

    @Autowired
    public CountryServiceImpl(CountryRepository countryRepository){
        this.countryRepository = countryRepository;
    }
    @Override
    public List<Country> findAllCountries() {
        return countryRepository.findAll();
    }
}
