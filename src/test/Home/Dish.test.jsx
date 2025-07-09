import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Dish from "../../Components/Home/Dish";
import { LocationContext } from "../../Components/Home/HomeComponent";
import axiosInstance from "../../utils/axios";
import MockAdapter from "axios-mock-adapter";

// Mock axios
const mock = new MockAdapter(axiosInstance);

// Dummy location context
const mockContextValue = {
  city: "Hyderabad",
  latitude: 17.385044,
  longitude: 78.486671,
};

// Dish data
const mockDishes = [
  {
    id: 1,
    name: "Pizza",
    description: "Delicious cheese pizza",
    price: 199,
    distanceInKm: 2.5,
    cuisine: "Italian",
    restaurantId: 1,
    restaurantName: "Dominos",
  },
  {
    id: 2,
    name: "Burger",
    description: "Tasty burger",
    price: 149,
    distanceInKm: 1.2,
    cuisine: "American",
    restaurantId: 2,
    restaurantName: "Burger King",
  },
];

describe("Dish Component", () => {
  beforeEach(() => {
    mock.reset();
  });

  test("fetches and displays dishes", async () => {
    mock.onGet("/dishes/search").reply(() => {
      return [200, mockDishes];
    });

    render(
      <LocationContext.Provider value={mockContextValue}>
        <Dish />
      </LocationContext.Provider>
    );

    // Wait for Dish names to be displayed
    for (const dish of mockDishes) {
      await waitFor(() => {
        expect(screen.getByText(dish.name)).toBeInTheDocument();
      });
    }
  });

  test("updates search input and triggers refetch", async () => {
    const filteredDish = [mockDishes[0]];

    mock.onGet("/dishes/search").reply((config) => {
      const { name } = config.params;
      if (name.toLowerCase().includes("pizza")) {
        return [200, filteredDish];
      }
      return [200, mockDishes];
    });

    render(
      <LocationContext.Provider value={mockContextValue}>
        <Dish />
      </LocationContext.Provider>
    );

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText("Pizza")).toBeInTheDocument();
    });

    // Change input
    fireEvent.change(screen.getByPlaceholderText("Search Dishes..."), {
      target: { value: "pizza" },
    });

    // Wait for filtered result
    await waitFor(() => {
      expect(screen.getByText("Pizza")).toBeInTheDocument();
      expect(screen.queryByText("Burger")).not.toBeInTheDocument();
    });
  });
});
