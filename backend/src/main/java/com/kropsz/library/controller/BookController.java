package com.kropsz.library.controller;

import com.kropsz.library.entities.Book;
import com.kropsz.library.service.BookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/library")
public class BookController {

    private BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping()
    public List<Book> listBooks() {
        return bookService.listBooks();
    }

    @GetMapping("/books/search")
    public List<Book> searchBooks(@RequestParam(required = false) String titulo,
                                  @RequestParam(required = false) String autor) {
        return bookService.searchBooks(titulo, autor);
    }

    @GetMapping("/books/genre")
    public List<Book> filterBooksByGenre(@RequestParam String genre) {
        return bookService.filterBooksByGenre(genre);
    }

    @GetMapping("/books/{id}")
    public ResponseEntity<Book> findBookById(@PathVariable Long id) {
        Book book = bookService.findBookById(id);
        if (book != null) {
            return ResponseEntity.ok(book);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}