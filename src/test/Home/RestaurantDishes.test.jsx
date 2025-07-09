// RestaurantDishes.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RestaurantDishes from "../../Components/Home/RestaurantDishes";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";

// Mock axiosInstance BEFORE importing the component
jest.mock("../../utils/axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

// Mock useParams from react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    restaurantId: "42",
    distance: "2.5",
  }),
}));

// Mock DishCard component
jest.mock("../../Components/Home/DishCard", () => ({
  __esModule: true,
  default: ({ dish }) => <div>{dish.name}</div>,
}));

const mockDishes = [
  { id: 1, name: "Paneer Butter Masala" },
  { id: 2, name: "Chicken Biryani" },
];

const renderWithTheme = (ui) => {
  const theme = createTheme();
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe("RestaurantDishes Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders search input", async () => {
    const axiosInstance = require("../../utils/axios").default;
    axiosInstance.get.mockResolvedValueOnce({ data: [] });

    renderWithTheme(<RestaurantDishes />);
    expect(await screen.findByPlaceholderText(/search dishes/i)).toBeInTheDocument();
  });

  test("fetches and displays dishes from API", async () => {
    const axiosInstance = require("../../utils/axios").default;
    axiosInstance.get.mockResolvedValueOnce({ data: mockDishes });

    renderWithTheme(<RestaurantDishes />);

    // Wait for dishes to appear
    expect(await screen.findByText("Paneer Butter Masala")).toBeInTheDocument();
    expect(screen.getByText("Chicken Biryani")).toBeInTheDocument();

    expect(axiosInstance.get).toHaveBeenCalledWith("/dishes/restaurant/42?distanceInKm=2.5");
  });

  test("filters dishes based on search input", async () => {
    const axiosInstance = require("../../utils/axios").default;
    axiosInstance.get.mockResolvedValueOnce({ data: mockDishes });

    renderWithTheme(<RestaurantDishes />);

    const input = await screen.findByPlaceholderText(/search dishes/i);
    fireEvent.change(input, { target: { value: "paneer" } });

    expect(await screen.findByText("Paneer Butter Masala")).toBeInTheDocument();
    expect(screen.queryByText("Chicken Biryani")).not.toBeInTheDocument();
  });

  test("shows nothing if no dishes match search", async () => {
    const axiosInstance = require("../../utils/axios").default;
    axiosInstance.get.mockResolvedValueOnce({ data: mockDishes });

    renderWithTheme(<RestaurantDishes />);

    const input = await screen.findByPlaceholderText(/search dishes/i);
    fireEvent.change(input, { target: { value: "no-match" } });

    await waitFor(() => {
      expect(screen.queryByText("Paneer Butter Masala")).not.toBeInTheDocument();
      expect(screen.queryByText("Chicken Biryani")).not.toBeInTheDocument();
    });
  });
});
