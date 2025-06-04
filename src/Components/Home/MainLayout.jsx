import { Outlet } from "react-router-dom";
import BottomNavigation from "./BottomNavigation";
import { useState, createContext } from "react";
import Header from "./Header";
import Footer from "./Footer";

export const cityContext = createContext();
const MainLayout = () => {
  const [city, setCity] = useState("");
  return (
    <cityContext.Provider value={{ city }}>
      <Header city={city} setCity={setCity} />
      <Outlet />
      <Footer />
      <BottomNavigation />
    </cityContext.Provider>
  );
};
export default MainLayout;
