package com.budzetly.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    /*
     * Seller's EarnProfile at the time of purchase.
     * This makes it easy to find the seller's orders.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "earn_profile_id", nullable = false)
    private EarnProfile earnProfile;

    @Column(nullable = false)
    private String productName;

    @Column(nullable = false)
    private Double priceAtPurchase;

    @Column(nullable = false)
    private Integer quantity;

    public Long getId() {
        return id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public EarnProfile getEarnProfile() {
        return earnProfile;
    }

    public void setEarnProfile(EarnProfile earnProfile) {
        this.earnProfile = earnProfile;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Double getPriceAtPurchase() {
        return priceAtPurchase;
    }

    public void setPriceAtPurchase(Double priceAtPurchase) {
        this.priceAtPurchase = priceAtPurchase;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}