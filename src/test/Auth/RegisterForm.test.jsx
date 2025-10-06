// src/test/Auth/RegisterForm.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterForm from "../../Components/Auth/RegisterForm";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

jest.mock("axios");

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

beforeAll(() => {
  // Prevent scrollIntoView from throwing during tests
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

describe("RegisterForm", () => {
  test("renders form fields and submits valid data", async () => {
    axios.post.mockResolvedValueOnce({ data: "User Registered" });

    renderWithRouter(<RegisterForm />);

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: "Password@1" },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "Password@1" },
    });
    fireEvent.change(screen.getByLabelText(/Phone/i), {
      target: { value: "9876543210" },
    });
    fireEvent.change(screen.getByLabelText(/Address/i), {
      target: { value: "123 Main Street, City" },
    });

    const file = new File(["(⌐□_□)"], "profile.png", { type: "image/png" });
    const fileInput = screen.getByTestId("image-upload");
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://3.6.206.43:8085/api/users/register",
        expect.any(FormData)
      );
    });
  });

  test("shows error messages when required fields are empty", async () => {
    renderWithRouter(<RegisterForm />);

    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Please confirm your password/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Phone number is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Address is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Profile image is required/i)
      ).toBeInTheDocument();
    });
  });
});
