import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Restaurant from "../../Components/Home/Restaurant";
import { LocationContext } from "../../Components/Home/HomeComponent";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axiosInstance from "../../utils/axios";

// Mock axiosInstance BEFORE importing the component
jest.mock("../../utils/axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

// Mock RestaurantCard (isolate it from test)
jest.mock("../../Components/Home/RestaurantCard", () => ({
  __esModule: true,
  default: ({ restaurant }) => <div>{restaurant.name}</div>,
}));

// Reusable render helper
const renderWithContext = (ui, locationValue) => {
  const theme = createTheme();
  return render(
    <LocationContext.Provider value={locationValue}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </LocationContext.Provider>
  );
};

describe("Restaurant Component", () => {
  const mockLocation = {
    city: "Bangalore",
    latitude: 12.9716,
    longitude: 77.5946,
  };

  const mockRestaurants = [
    { id: 1, name: "Spicy Grill" },
    { id: 2, name: "Tandoori House" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders search input", async () => {
    axiosInstance.get.mockResolvedValue({ data: [] });

    renderWithContext(<Restaurant />, mockLocation);

    expect(await screen.findByPlaceholderText(/search restaurants/i)).toBeInTheDocument();
  });

  test("fetches and displays restaurants from API", async () => {
    axiosInstance.get.mockResolvedValue({ data: mockRestaurants });

    renderWithContext(<Restaurant />, mockLocation);

    expect(await screen.findByText("Spicy Grill")).toBeInTheDocument();
    expect(screen.getByText("Tandoori House")).toBeInTheDocument();

    expect(axiosInstance.get).toHaveBeenCalledWith("/restaurants/nearby", {
      params: {
        name: "",
        latitude: mockLocation.latitude,
        longitude: mockLocation.longitude,
        city: mockLocation.city,
      },
    });
  });

  test("updates restaurants on search input", async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: mockRestaurants });

    renderWithContext(<Restaurant />, mockLocation);

    const filteredRestaurants = [{ id: 3, name: "Grill Master" }];
    axiosInstance.get.mockResolvedValueOnce({ data: filteredRestaurants });

    const input = await screen.findByPlaceholderText(/search restaurants/i);
    fireEvent.change(input, { target: { value: "grill" } });

    expect(await screen.findByText("Grill Master")).toBeInTheDocument();

    expect(axiosInstance.get).toHaveBeenLastCalledWith("/restaurants/nearby", {
      params: {
        name: "grill",
        latitude: mockLocation.latitude,
        longitude: mockLocation.longitude,
        city: mockLocation.city,
      },
    });
  });

  test("displays nothing if API returns empty array", async () => {
    axiosInstance.get.mockResolvedValue({ data: [] });

    renderWithContext(<Restaurant />, mockLocation);

    await waitFor(() => {
      expect(screen.queryByText("Spicy Grill")).not.toBeInTheDocument();
    });
  });
});
