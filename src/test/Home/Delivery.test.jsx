// Delivery.test.jsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Delivery from "../../Components/Home/Delivery";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axiosInstance from "../../utils/axios";
import { useSearchParams } from "react-router-dom";

// Mock axiosInstance
jest.mock("../../utils/axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    put: jest.fn(),
  },
}));

// Mock useSearchParams
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useSearchParams: jest.fn(),
}));

const renderWithTheme = (ui) => {
  const theme = createTheme();
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe("Delivery Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("displays 'No deliveries found' if no deliveries", async () => {
    axiosInstance.get.mockResolvedValue({ data: [] });
    useSearchParams.mockReturnValue([{ get: () => null }]);

    renderWithTheme(<Delivery />);

    await waitFor(() => {
      expect(
        screen.getByText(/No deliveries found/i)
      ).toBeInTheDocument();
    });
  });

  test("displays error alert if API call fails", async () => {
    axiosInstance.get.mockRejectedValue({ response: { data: { message: "Server Error" } } });
    useSearchParams.mockReturnValue([{ get: () => null }]);

    renderWithTheme(<Delivery />);

    await waitFor(() => {
      expect(screen.getByText("Server Error")).toBeInTheDocument();
    });
  });

  test("renders pending and completed deliveries", async () => {
    const mockPending = [
      {
        id: 1,
        deliveryStatus: "PENDING",
        deliveryTime: new Date(Date.now() + 60000).toISOString(),
        restaurantName: "Mock Restaurant",
        deliveryAddress: "123 Main St",
        distance: 5,
        time: 30,
        items: JSON.stringify([{ dishName: "Pizza", price: 200, quantity: 1 }]),
      },
    ];

    const mockCompleted = [
      {
        ...mockPending[0],
        id: 2,
        deliveryStatus: "COMPLETED",
      },
    ];

    axiosInstance.get.mockImplementation((url) => {
      if (url.includes("PENDING")) return Promise.resolve({ data: mockPending });
      if (url.includes("COMPLETED")) return Promise.resolve({ data: mockCompleted });
      return Promise.resolve({ data: {} });
    });

    useSearchParams.mockReturnValue([{ get: () => null }]);

    renderWithTheme(<Delivery />);

    expect(await screen.findByText("#1")).toBeInTheDocument();
    expect(await screen.findByText("#2")).toBeInTheDocument();
  });

  test("moves delivery to completed if time passed", async () => {
    const pastTime = new Date(Date.now() - 60000).toISOString();
    const mockPending = [
      {
        id: 3,
        deliveryStatus: "PENDING",
        deliveryTime: pastTime,
        restaurantName: "Time Tester",
        deliveryAddress: "Past Lane",
        distance: 2,
        time: 5,
        items: JSON.stringify([{ dishName: "Burger", price: 100, quantity: 2 }]),
      },
    ];

    axiosInstance.get.mockImplementation((url) => {
      if (url.includes("PENDING")) return Promise.resolve({ data: mockPending });
      if (url.includes("COMPLETED")) return Promise.resolve({ data: [] });
      return Promise.resolve({ data: {} });
    });
    axiosInstance.put.mockResolvedValue({});

    useSearchParams.mockReturnValue([{ get: () => null }]);

    renderWithTheme(<Delivery />);

    await waitFor(() => {
      expect(axiosInstance.put).toHaveBeenCalledWith(
        "/delivery/3/status?status=completed"
      );
    });
  });

  test("handles invalid JSON in items gracefully", async () => {
    const mockPending = [
      {
        id: 4,
        deliveryStatus: "PENDING",
        deliveryTime: new Date().toISOString(),
        restaurantName: "Invalid JSON Restaurant",
        deliveryAddress: "Broken JSON Lane",
        distance: 1,
        time: 10,
        items: "invalid-json",
      },
    ];

    axiosInstance.get.mockImplementation((url) => {
      if (url.includes("PENDING")) return Promise.resolve({ data: mockPending });
      if (url.includes("COMPLETED")) return Promise.resolve({ data: [] });
      return Promise.resolve({ data: {} });
    });

    useSearchParams.mockReturnValue([{ get: () => null }]);

    renderWithTheme(<Delivery />);

    expect(await screen.findByText(/Unable to load item details/i)).toBeInTheDocument();
  });
});
