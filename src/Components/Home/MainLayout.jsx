import { Outlet } from "react-router-dom";
import BottomNavigation from "./BottomNavigation";
import { useState, createContext, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

export const cityContext = createContext();
const MainLayout = () => {
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <cityContext.Provider value={{ city, latitude, longitude }}>
      <Header city={city} setCity={setCity} />
      <Outlet />
      <Footer />
      <BottomNavigation />
    </cityContext.Provider>
  );
};
export default MainLayout;
