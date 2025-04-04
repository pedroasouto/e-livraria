package com.kropsz.library.repository;

import com.kropsz.library.entities.Pagamentos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PagamentosRepository extends JpaRepository<Pagamentos, Long> {

    Optional<List<Pagamentos>> findAllByEmail(String email);
}
