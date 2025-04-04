package com.kropsz.library.service;


import com.kropsz.library.controller.dto.PagamentosDto;
import com.kropsz.library.controller.dto.UserDTO;
import com.kropsz.library.controller.dto.UserLogin;
import com.kropsz.library.entities.Pagamentos;
import com.kropsz.library.entities.User;

public interface UserService {

    void saveUser(UserDTO user);

    void loginUser(UserLogin user);

    void checkout(PagamentosDto pagamentos);

}
