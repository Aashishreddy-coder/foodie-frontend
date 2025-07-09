// Favorites.test.jsx
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Favorites from "../../Components/Home/Favorites";
import { cityContext } from "../../Components/Home/MainLayout";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axiosInstance from "../../utils/axios";

// Mock axiosInstance
jest.mock("../../utils/axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockContext = {
  latitude: 12.9716,
  longitude: 77.5946,
};

const mockFavorites = [
  { id: 1, dishId: 101 },
  { id: 2, dishId: 102 },
];

const mockDishes = [
  {
    id: 101,
    name: "Pasta",
    description: "Cheesy pasta",
    price: 250,
    restaurantName: "Italiano",
    distanceInKm: 2.5,
    cuisine: "Italian",
    image: "pasta.jpg",
  },
  {
    id: 102,
    name: "Burger",
    description: "Spicy chicken burger",
    price: 180,
    restaurantName: "Burger Hut",
    distanceInKm: 1.8,
    cuisine: "American",
    image: "burger.jpg",
  },
];

const renderWithContext = (ui) => {
  const theme = createTheme();
  return render(
    <cityContext.Provider value={mockContext}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </cityContext.Provider>
  );
};

describe("Favorites Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders no favorites message when dishDetails is empty", async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: [] });

    renderWithContext(<Favorites />);

    expect(await screen.findByText(/no favorite dishes found/i)).toBeInTheDocument();
  });

  test("renders favorite dishes correctly", async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: mockFavorites });
    axiosInstance.get.mockImplementation((url) => {
      if (url.includes("/dishes/")) {
        const dishId = parseInt(url.split("/")[2]);
        const dish = mockDishes.find((d) => d.id === dishId);
        return Promise.resolve({ data: dish });
      }
      return Promise.resolve({ data: [] });
    });

    renderWithContext(<Favorites />);

    expect(await screen.findByText("Pasta")).toBeInTheDocument();
    expect(screen.getByText("Burger")).toBeInTheDocument();
  });

  test("handles delete favorite success", async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: mockFavorites });
    axiosInstance.get.mockResolvedValueOnce({ data: mockDishes[0] });
    axiosInstance.get.mockResolvedValueOnce({ data: mockDishes[1] });
    axiosInstance.delete.mockResolvedValueOnce({});

    renderWithContext(<Favorites />);

    const deleteButtons = await screen.findAllByLabelText("delete favorite");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/dish removed from favourites/i)).toBeInTheDocument();
    });
  });

  test("handles delete favorite failure", async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: mockFavorites });
    axiosInstance.get.mockResolvedValueOnce({ data: mockDishes[0] });
    axiosInstance.get.mockResolvedValueOnce({ data: mockDishes[1] });
    axiosInstance.delete.mockRejectedValueOnce(new Error("Delete failed"));

    renderWithContext(<Favorites />);

    const deleteButtons = await screen.findAllByLabelText("delete favorite");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/failed to delete favorite/i)).toBeInTheDocument();
    });
  });
});
