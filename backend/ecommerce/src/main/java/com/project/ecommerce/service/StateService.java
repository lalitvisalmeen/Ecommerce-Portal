package com.project.ecommerce.service;

import com.project.ecommerce.entity.State;

import java.util.List;

public interface StateService {

    List<State> findByCountryCode(String code);
}
