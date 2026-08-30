package com.budzetly.dto;

public class EarnRegistrationRequest {

    private String businessName;

    private String description;

    private String location;

    public String getBusinessName() {

        return businessName;
    }

    public void setBusinessName(
            String businessName) {

        this.businessName = businessName;
    }

    public String getDescription() {

        return description;
    }

    public void setDescription(
            String description) {

        this.description = description;
    }

    public String getLocation() {

        return location;
    }

    public void setLocation(
            String location) {

        this.location = location;
    }
}