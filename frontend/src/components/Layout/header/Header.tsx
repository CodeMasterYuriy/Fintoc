import { useEffect, useState } from "react";
import Logo from "../../../assets/logo.svg";
import Menu from "./menuButton";

const Header = () => {
  const [menubutton, setCardWidth] = useState(() => {
      const width = window.innerWidth;
      return width > 769 ? true : false;
    });

  const getCardWidth = () => {
    const width = window.innerWidth;
    if (width > 769) return true;
    return false;
  }

  useEffect(() => {
    const handleResize = () => {
      setCardWidth(getCardWidth());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl md:mx-auto flex mx-6 flex-row items-center justify-between pt-4 pb-2 sm:pt-6 sm:pb-4 md:space-y-0">

        <div className="flex items-center space-x-2">
          <img src={Logo} alt="Logo" className="max-w-[50px]"/>
          <span className="font-bold text-xl text-ct-grey">gestiona</span>
        </div>

        {menubutton?
        <nav className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-8">
          <a href="#" className="text-gray-700 hover:text-primary text-lg">Servicios</a>
          <a href="#" className="text-gray-700 hover:text-primary text-lg">Aprende</a>
          <a href="#" className="text-primary font-semibold text-lg">Registro</a>
        </nav>: <Menu />}
      </div>
    </header>
  );
};

export default Header;
