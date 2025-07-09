import React from "react";
import { render, screen } from "@testing-library/react";
import RestaurantCard from "../../Components/Home/RestaurantCard";
import { MemoryRouter } from "react-router-dom";

describe("RestaurantCard Component", () => {
  const mockRestaurant = {
    id: 101,
    restaurantName: "Tandoori Flames",
    city: "Bangalore",
    distanceInKm: 2.34789,
  };

  const renderWithRouter = (component) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  test("renders restaurant name, city, and distance", () => {
    renderWithRouter(<RestaurantCard restaurant={mockRestaurant} />);

    expect(screen.getByText("Tandoori Flames")).toBeInTheDocument();
    expect(screen.getByText("Bangalore")).toBeInTheDocument();
    expect(screen.getByText("2.35 km away")).toBeInTheDocument(); // rounded to 2 decimals
  });

  test("renders correct link to restaurant page", () => {
    renderWithRouter(<RestaurantCard restaurant={mockRestaurant} />);

    const linkElement = screen.getByRole("link");
    expect(linkElement).toHaveAttribute(
      "href",
      "/home/restaurant/101/2.34789"
    );
  });
});
