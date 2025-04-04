package com.kropsz.library.controller.dto;

import com.kropsz.library.entities.Carrinho;
import com.kropsz.library.entities.enums.FormaPagamento;
import lombok.*;

import java.io.Serializable;


public class PagamentosDto{
    String user;
    String email;
    Double valorTotal;
    Carrinho carrinho;
    FormaPagamento formaPagamento;

    public PagamentosDto(String user, String email, Double valorTotal, Carrinho carrinho, FormaPagamento formaPagamento) {
        this.user = user;
        this.email = email;
        this.valorTotal = valorTotal;
        this.carrinho = carrinho;
        this.formaPagamento = formaPagamento;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Double getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(Double valorTotal) {
        this.valorTotal = valorTotal;
    }

    public Carrinho getCarrinho() {
        return carrinho;
    }

    public void setCarrinho(Carrinho carrinho) {
        this.carrinho = carrinho;
    }

    public FormaPagamento getFormaPagamento() {
        return formaPagamento;
    }

    public void setFormaPagamento(FormaPagamento formaPagamento) {
        this.formaPagamento = formaPagamento;
    }
}