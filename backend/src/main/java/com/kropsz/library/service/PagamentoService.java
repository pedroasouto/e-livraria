package com.kropsz.library.service;

import com.kropsz.library.entities.Pagamentos;

import java.util.List;
import java.util.Optional;

public interface PagamentoService {
    Optional<List<Pagamentos>> findAllByEmail(String email);
}
