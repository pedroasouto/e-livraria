package com.kropsz.library.controller;

import com.kropsz.library.controller.dto.PagamentosDto;
import com.kropsz.library.controller.dto.UserDTO;
import com.kropsz.library.controller.dto.UserLogin;
import com.kropsz.library.entities.Pagamentos;
import com.kropsz.library.service.PagamentoService;
import com.kropsz.library.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/v1/user")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private PagamentoService pagamentoService;

    @PostMapping("/create")
    public ResponseEntity<Void> createUser(@RequestBody UserDTO userDTO) {
        userService.saveUser(userDTO);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<Void> loginUser(@RequestBody UserLogin userLogin) {
        userService.loginUser(userLogin);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/checkout")
    public void checkout(@RequestBody PagamentosDto pagamentosDto) {
        userService.checkout(pagamentosDto);
    }

    @GetMapping("/pagamentos/{email}")
    public ResponseEntity<Optional<List<Pagamentos>>> findAllByEmail(@PathVariable String email) {
        return ResponseEntity.ok(pagamentoService.findAllByEmail(email));
    }
}
