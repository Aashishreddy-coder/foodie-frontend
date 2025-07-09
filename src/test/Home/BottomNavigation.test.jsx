import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BottomNavigationComponent from "../../Components/Home/BottomNavigation";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { MemoryRouter } from "react-router-dom";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Utility render function with theme + router
const renderWithProviders = (ui) => {
  const theme = createTheme();
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </MemoryRouter>
  );
};

describe("BottomNavigationComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all navigation actions", () => {
    renderWithProviders(<BottomNavigationComponent />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByText("Delivery")).toBeInTheDocument();
  });

  test("navigates to correct route on click", () => {
    renderWithProviders(<BottomNavigationComponent />);

    fireEvent.click(screen.getByText("Orders"));
    expect(mockNavigate).toHaveBeenCalledWith("orders");

    fireEvent.click(screen.getByText("Favorites"));
    expect(mockNavigate).toHaveBeenCalledWith("favorites");

    fireEvent.click(screen.getByText("Delivery"));
    expect(mockNavigate).toHaveBeenCalledWith("delivery");

    fireEvent.click(screen.getByText("Home"));
    expect(mockNavigate).toHaveBeenCalledWith("home");
  });
});
