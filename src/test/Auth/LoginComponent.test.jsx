import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginComponent from "../../Components/Auth/LoginComponent";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

// Mock navigate and axios
jest.mock("axios");
const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("LoginComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders login form elements", () => {
    renderWithRouter(<LoginComponent />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("shows validation errors when submitting empty form", async () => {
    renderWithRouter(<LoginComponent />);
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });
  });

  test("calls login API and navigates on success", async () => {
    axios.post.mockResolvedValue({ data: "mockToken" });

    renderWithRouter(<LoginComponent />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://3.6.206.43:8085/api/users/login",
        {
          email: "test@example.com",
          password: "password123",
        }
      );
      expect(localStorage.getItem("token")).toBe("mockToken");
      expect(mockedUsedNavigate).toHaveBeenCalledWith("/home");
    });
  });

  test("shows error message on login failure", async () => {
    axios.post.mockRejectedValue({
      response: { data: "Invalid credentials" },
    });

    renderWithRouter(<LoginComponent />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  test("navigates to register page on button click", () => {
    renderWithRouter(<LoginComponent />);
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    expect(mockedUsedNavigate).toHaveBeenCalledWith("/register");
  });
});
