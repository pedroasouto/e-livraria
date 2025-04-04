package com.kropsz.library.entities;

import java.util.ArrayList;
import java.util.List;

public class Carrinho {

    private List<Book> books = new ArrayList<>();

    public Carrinho(List<Book> books) {
        this.books = books;
    }

    public List<Book> getBooks() {
        return books;
    }

    public void setBooks(List<Book> books) {
        this.books = books;
    }
}
