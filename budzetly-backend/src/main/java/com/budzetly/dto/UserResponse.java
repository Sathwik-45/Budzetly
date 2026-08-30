package com.budzetly.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;

}