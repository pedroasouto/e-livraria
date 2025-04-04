package com.kropsz.library.controller.dto;

import lombok.*;

@NoArgsConstructor
public class UserDTO {
    private String name;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    private String email;
    private String senha;

    public UserDTO(String name, String email, String senha) {
        this.name = name;
        this.email = email;
        this.senha = senha;
    }
}
