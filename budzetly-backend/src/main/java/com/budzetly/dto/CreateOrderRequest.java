package com.budzetly.dto;

import java.util.List;

public class CreateOrderRequest {

    private String deliveryAddress;

    private List<OrderItemRequest> items;

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(
            String deliveryAddress) {

        this.deliveryAddress = deliveryAddress;
    }

    public List<OrderItemRequest> getItems() {
        return items;
    }

    public void setItems(
            List<OrderItemRequest> items) {

        this.items = items;
    }
}