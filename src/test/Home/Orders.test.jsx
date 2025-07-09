import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Orders from "../../Components/Home/Orders";
import { cityContext } from "../../Components/Home/MainLayout";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Custom mock for axios with .create() and interceptors
jest.mock("axios", () => {
  const mockAxios = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    create: function () {
      return this;
    },
  };
  return mockAxios;
});

import axios from "axios";

// Mock MapSelector with auto-valid location
jest.mock("../../Components/Home/MapSelector", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: ({ onLocationValid }) => {
      React.useEffect(() => {
        onLocationValid(true);
      }, [onLocationValid]);
      return <div data-testid="mock-map-selector">Mock Map Selector</div>;
    },
  };
});

// Sample mock data
const mockOrder = {
  id: 1,
  userEmail: "test@example.com",
  restaurantId: 101,
  paymentStatus: "Pending",
  totalAmount: 300,
  items: [
    {
      dishId: "d1",
      dishName: "Paneer Tikka",
      price: "150.00",
      quantity: 2,
    },
  ],
};

const mockRestaurant = {
  restaurantName: "Tandoori Flames",
};

// Utility to render with context and theme
const renderWithThemeAndContext = (ui) => {
  const theme = createTheme();
  return render(
    <cityContext.Provider value={{ latitude: 12.9716, longitude: 77.5946 }}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </cityContext.Provider>
  );
};

describe("Orders Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("fetches and displays order and restaurant details", async () => {
    axios.get.mockImplementation((url) => {
      if (url === "/api/orders/get") {
        return Promise.resolve({ data: { data: mockOrder } });
      }
      if (url === "/restaurants/101") {
        return Promise.resolve({ data: mockRestaurant });
      }
      return Promise.reject(new Error("not found"));
    });

    renderWithThemeAndContext(<Orders />);

    expect(await screen.findByText(/Your Orders/i)).toBeInTheDocument();
    expect(await screen.findByText(/Paneer Tikka/i)).toBeInTheDocument();

    const orderIdElement = screen.getByText(/Order ID:/i);
    expect(orderIdElement.closest("p")).toHaveTextContent("Order ID: 1");

    expect(screen.getByText(/Restaurant: Tandoori Flames/)).toBeInTheDocument();
    expect(screen.getByText(/Payment Status:/)).toHaveTextContent("Pending");
  });

  test("handles quantity increment and decrement", async () => {
    axios.get.mockImplementation((url) => {
      if (url === "/api/orders/get") {
        return Promise.resolve({ data: { data: mockOrder } });
      }
      if (url === "/restaurants/101") {
        return Promise.resolve({ data: mockRestaurant });
      }
      return Promise.reject(new Error("not found"));
    });

    axios.put.mockResolvedValue({ data: { data: mockOrder } });

    renderWithThemeAndContext(<Orders />);

    const incrementButton = await screen.findByText("+");
    fireEvent.click(incrementButton);

    await waitFor(() =>
      expect(axios.put).toHaveBeenCalledWith(
        `/api/orders/update?dishId=d1&action=increment`
      )
    );

    const decrementButton = screen.getByText("-");
    fireEvent.click(decrementButton);

    await waitFor(() =>
      expect(axios.put).toHaveBeenCalledWith(
        `/api/orders/update?dishId=d1&action=decrement`
      )
    );
  });

  test("initiates payment on button click with valid location", async () => {
    axios.get.mockImplementation((url) => {
      if (url === "/api/orders/get") {
        return Promise.resolve({ data: { data: mockOrder } });
      }
      if (url === "/restaurants/101") {
        return Promise.resolve({ data: mockRestaurant });
      }
      return Promise.reject(new Error("not found"));
    });

    const mockSession = {
      sessionUrl: "https://mock-payment.com/session",
    };

    axios.post.mockResolvedValue({ data: mockSession });

    // Mock window.location.replace
    delete window.location;
    window.location = { replace: jest.fn() };

    renderWithThemeAndContext(<Orders />);

    const payButton = await screen.findByRole("button", {
      name: /Pay ₹300.00/i,
    });

    fireEvent.click(payButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/payment/checkout", expect.any(Object));
      expect(window.location.replace).toHaveBeenCalledWith(mockSession.sessionUrl);
    });
  });
});
