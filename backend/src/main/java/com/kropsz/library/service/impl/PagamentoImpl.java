package com.kropsz.library.service.impl;

import com.kropsz.library.controller.dto.PagamentosDto;
import com.kropsz.library.entities.Pagamentos;
import com.kropsz.library.repository.PagamentosRepository;
import com.kropsz.library.service.PagamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PagamentoImpl implements PagamentoService {

    @Autowired
    private PagamentosRepository pagamentoRepository;

    @Override
    public Optional<List<Pagamentos>> findAllByEmail(String email) {
        return Optional.ofNullable(pagamentoRepository.findAllByEmail(email).orElseThrow(
                () -> new RuntimeException("Nenhum pagamento encontrado para o email: " + email)));
    }
}
