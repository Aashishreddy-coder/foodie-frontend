import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Header from "../../Components/Home/Header";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { MemoryRouter } from "react-router-dom";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Header Component", () => {
  const theme = createTheme();
  const cities = ["Hyderabad", "Chennai", "Mumbai", "Bangalore"];

  const setup = (city = "", setCity = jest.fn()) => {
    return render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <Header city={city} setCity={setCity} />
        </ThemeProvider>
      </MemoryRouter>
    );
  };

  test("renders title and city dropdown", () => {
    setup();
    expect(screen.getByText(/Crave Corner/i)).toBeInTheDocument();
    expect(screen.getByText("Select City")).toBeInTheDocument();
  });

  test("renders all city options", async () => {
    setup();
    const dropdown = screen.getByRole("combobox");
    fireEvent.mouseDown(dropdown);
    cities.forEach((city) => {
      expect(screen.getByText(city)).toBeInTheDocument();
    });
  });

  test("calls setCity on selecting a city", async () => {
    const mockSetCity = jest.fn();
    setup("", mockSetCity);
    const dropdown = screen.getByRole("combobox");
    fireEvent.mouseDown(dropdown);
    const bangaloreOption = screen.getByText("Bangalore");
    fireEvent.click(bangaloreOption);
    await waitFor(() => {
      expect(mockSetCity).toHaveBeenCalledWith("Bangalore");
    });
  });

  test("opens and closes user menu", () => {
    setup();
    const iconButtons = screen.getAllByRole("button");
    const avatarButton = iconButtons[iconButtons.length - 1]; // Last button is AccountCircleIcon
    fireEvent.click(avatarButton);
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Profile/i));
    // Profile menu closes silently — we just ensure click doesn't crash
  });

  test("logout clears token and redirects to login", () => {
    localStorage.setItem("token", "dummy-token");
    setup();
    const iconButtons = screen.getAllByRole("button");
    const avatarButton = iconButtons[iconButtons.length - 1];
    fireEvent.click(avatarButton);
    fireEvent.click(screen.getByText(/Logout/i));
    expect(localStorage.getItem("token")).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
