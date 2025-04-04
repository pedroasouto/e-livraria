package com.kropsz.library.service.impl;


import com.kropsz.library.controller.dto.PagamentosDto;
import com.kropsz.library.controller.dto.UserDTO;
import com.kropsz.library.controller.dto.UserLogin;
import com.kropsz.library.entities.Book;
import com.kropsz.library.entities.Carrinho;
import com.kropsz.library.entities.Pagamentos;
import com.kropsz.library.entities.User;
import com.kropsz.library.repository.BookRepository;
import com.kropsz.library.repository.PagamentosRepository;
import com.kropsz.library.repository.UserRepository;
import com.kropsz.library.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private PagamentosRepository pagamentosRepository;


    @Override
    public void saveUser(UserDTO user) {
        userRepository.save(new User(user.getName(), user.getEmail(), user.getSenha()));
    }

    @Override
    public void loginUser(UserLogin user) {
        Optional<User> userLogin = userRepository.findByEmailAndSenha(user.getEmail(), user.getSenha());
        if (userLogin.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado");
        }
    }

    @Override
    public void checkout(PagamentosDto pagamentosDto) {
        Pagamentos pagamentos = new Pagamentos();
        pagamentos.setUser(pagamentosDto.getUser());
        pagamentos.setEmail(pagamentosDto.getEmail());
        pagamentos.setCarrinho(pagamentosDto.getCarrinho());
        pagamentos.setFormaPagamento(pagamentosDto.getFormaPagamento());
        pagamentos.setValorTotal(pagamentosDto.getValorTotal());
        pagamentos.setDataPagamento(LocalDate.now());
        pagamentosRepository.save(pagamentos);
    }
}
