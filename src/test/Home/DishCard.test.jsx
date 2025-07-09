// src/test/Home/DishCard.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DishCard from "../../Components/Home/DishCard";
import axiosInstance from "../../utils/axios";
import MockAdapter from "axios-mock-adapter";

// Set up mock
const mockAxios = new MockAdapter(axiosInstance);

const mockDish = {
  id: "1",
  name: "Paneer Butter Masala",
  description: "Delicious North Indian curry.",
  price: "220",
  restaurantName: "Punjabi Dhaba",
  restaurantId: "rest-123",
  distanceInKm: 2.5,
  cuisine: "North Indian",
  image: "https://example.com/dish.jpg",
};

describe("DishCard", () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  test("renders dish details correctly", () => {
    render(<DishCard dish={mockDish} />);

    expect(screen.getByText(/Paneer Butter Masala/i)).toBeInTheDocument();
    expect(screen.getByText(/Delicious North Indian curry/i)).toBeInTheDocument();
    expect(screen.getByText(/₹220.00/)).toBeInTheDocument();
    expect(screen.getByText(/Punjabi Dhaba/)).toBeInTheDocument();
    expect(screen.getByText(/2.50 km away/)).toBeInTheDocument();
    expect(screen.getByText(/Cuisine: North Indian/)).toBeInTheDocument();
  });

  test("adds dish to order successfully", async () => {
    mockAxios.onPost(/\/api\/orders\/add.*/).reply(200, { message: "Added to order" });

    render(<DishCard dish={mockDish} />);
    const orderButton = screen.getByLabelText("add to shopping cart");
    fireEvent.click(orderButton);

    await waitFor(() => {
      expect(screen.getByText(/Dish added to Orders/i)).toBeInTheDocument();
    });
  });

  test("shows error if adding to order fails with 400", async () => {
    mockAxios.onPost(/\/api\/orders\/add.*/).reply(400);

    render(<DishCard dish={mockDish} />);
    const orderButton = screen.getByLabelText("add to shopping cart");
    fireEvent.click(orderButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Cannot add items from different restaurants/i)
      ).toBeInTheDocument();
    });
  });

  test("adds dish to favorites successfully", async () => {
    mockAxios.onPost("/api/favourites/save").reply(200, { message: "Added to favourites" });

    render(<DishCard dish={mockDish} />);
    const favButton = screen.getByLabelText("add to favorites");
    fireEvent.click(favButton);

    await waitFor(() => {
      expect(screen.getByText(/Dish added to favourites/i)).toBeInTheDocument();
    });
  });
});
