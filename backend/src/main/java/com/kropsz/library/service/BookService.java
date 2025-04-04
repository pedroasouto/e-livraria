package com.kropsz.library.service;

import com.kropsz.library.entities.Book;

import java.util.List;

public interface BookService {
    List<Book> listBooks();
    Book findBookById(Long id);
    List<Book> filterBooksByGenre(String genre);
    List<Book> searchBooks(String titulo, String autor);
}
