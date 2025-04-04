package com.kropsz.library.entities;

import com.kropsz.library.entities.enums.FormaPagamento;
import jakarta.persistence.*;

import java.time.LocalDate;


@Table(name = "TB_PAGAMENTOS")
@Entity
public class Pagamentos {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    @Column(name = "username")
    private String user;
    private String email;
    @Transient
    private Carrinho carrinho;
    private Double valorTotal;
    private LocalDate dataPagamento;

    @Enumerated(EnumType.STRING)
    private FormaPagamento formaPagamento;

    public Pagamentos(long id, String user, String email, Carrinho carrinho, Double valorTotal, FormaPagamento formaPagamento, LocalDate dataPagamento) {
        this.id = id;
        this.user = user;
        this.email = email;
        this.carrinho = carrinho;
        this.valorTotal = valorTotal;
        this.formaPagamento = formaPagamento;
        this.dataPagamento = dataPagamento;
    }

    public Pagamentos() {

    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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

    public Carrinho getCarrinho() {
        return carrinho;
    }

    public void setCarrinho(Carrinho carrinho) {
        this.carrinho = carrinho;
    }

    public Double getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(Double valorTotal) {
        this.valorTotal = valorTotal;
    }

    public FormaPagamento getFormaPagamento() {
        return formaPagamento;
    }

    public void setFormaPagamento(FormaPagamento formaPagamento) {
        this.formaPagamento = formaPagamento;
    }

    public LocalDate getDataPagamento() {
        return dataPagamento;
    }

    public void setDataPagamento(LocalDate dataPagamento) {
        this.dataPagamento = dataPagamento;
    }
}

