package com.kropsz.library.service.impl;

import com.kropsz.library.entities.Book;
import com.kropsz.library.repository.BookRepository;
import com.kropsz.library.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookServiceImpl implements BookService {

    @Autowired
    private BookRepository bookRepository;

    @Override
    public List<Book> listBooks() {
        return bookRepository.findAll();
    }

    @Override
    public Book findBookById(Long id) {
        return bookRepository.findById(id).orElse(null);
    }

    @Override
    public List<Book> filterBooksByGenre(String genre) {
        return bookRepository.findByGenero(genre);
    }

    @Override
    public List<Book> searchBooks(String titulo, String autor) {
        if ((titulo == null || titulo.isEmpty()) && (autor == null || autor.isEmpty())) {
            return List.of();
        }
        if (titulo == null) {
            titulo = "";
        }
        if (autor == null) {
            autor = "";
        }
        return bookRepository.findByTituloContainingIgnoreCaseOrAutorContainingIgnoreCase(titulo, autor);
    }
}