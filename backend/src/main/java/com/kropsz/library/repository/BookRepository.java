package com.kropsz.library.repository;

import com.kropsz.library.entities.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findByGenero(String genero);
    List<Book> findByTituloContainingIgnoreCaseOrAutorContainingIgnoreCase(String titulo, String autor);
}