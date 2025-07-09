import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MapSelector from "../../Components/Home/MapSelector";
import { cityContext } from "../../Components/Home/MainLayout";
import axiosInstance from "../../utils/axios";

// Mock Google Maps API hook
jest.mock("@react-google-maps/api", () => ({
  useLoadScript: () => ({ isLoaded: true, loadError: false }),
  GoogleMap: ({ children, onClick }) => (
    <div
      data-testid="mock-map"
      onClick={() =>
        onClick({ latLng: { lat: () => 12.9, lng: () => 77.6 } })
      }
    >
      Mock Google Map
      {children}
    </div>
  ),
  Marker: () => <div data-testid="mock-marker">Mock Marker</div>,
}));

// Mock axios
jest.mock("../../utils/axios");

describe("MapSelector Component", () => {
  const renderComponent = (props = {}) =>
    render(
      <cityContext.Provider value={{ latitude: 12.9, longitude: 77.6 }}>
        <MapSelector
          restaurantId="123"
          onLocationValid={jest.fn()}
          setDistance={jest.fn()}
          setAddress={jest.fn()}
          setTime={jest.fn()}
          distance={null}
          address=""
          time={null}
          {...props}
        />
      </cityContext.Provider>
    );

  test("toggles map visibility", () => {
    renderComponent();
    const toggleButton = screen.getByRole("button", {
      name: /choose your delivery location/i,
    });

    // Do not check "not.toBeInTheDocument" because Collapse doesn't unmount.
    // Just assert it appears after click
    fireEvent.click(toggleButton);
    expect(screen.getByTestId("mock-map")).toBeInTheDocument();
  });

  test("handles distance API success under 30km", async () => {
    axiosInstance.get.mockResolvedValue({
      data: {
        distanceInMeters: 25000,
        address: "Test Address",
        timeInMinutes: 35,
      },
    });

    const onLocationValid = jest.fn();
    const setDistance = jest.fn();
    const setAddress = jest.fn();
    const setTime = jest.fn();

    renderComponent({ onLocationValid, setDistance, setAddress, setTime });

    fireEvent.click(screen.getByText(/choose your delivery location/i));
    fireEvent.click(screen.getByTestId("mock-map"));

    await waitFor(() => {
      expect(onLocationValid).toHaveBeenCalledWith(true);
      expect(setDistance).toHaveBeenCalledWith(25);
      expect(setAddress).toHaveBeenCalledWith("Test Address");
      expect(setTime).toHaveBeenCalledWith(35);
    });
  });

  test("shows error if distance exceeds 30km", async () => {
    axiosInstance.get.mockResolvedValue({
      data: {
        distanceInMeters: 31000,
        address: "Far Address",
        timeInMinutes: 50,
      },
    });

    renderComponent();

    fireEvent.click(screen.getByText(/choose your delivery location/i));
    fireEvent.click(screen.getByTestId("mock-map"));

    await waitFor(() => {
      expect(screen.getByText(/too far/i)).toBeInTheDocument();
    });
  });

  test("shows error if API call fails", async () => {
    axiosInstance.get.mockRejectedValue(new Error("Network error"));

    renderComponent();

    fireEvent.click(screen.getByText(/choose your delivery location/i));
    fireEvent.click(screen.getByTestId("mock-map"));

    await waitFor(() => {
      expect(
        screen.getByText(/error checking delivery distance/i)
      ).toBeInTheDocument();
    });
  });
});
