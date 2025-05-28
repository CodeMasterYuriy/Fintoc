import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, LogOut_primary, Perfil, Premium_primary, Setting_Strocke } from '../icons';
import { useAppStore } from "../../store";
import { useNavigate } from "react-router-dom";

type SettingProps = {
  onClick?: (action: string) => void;
};

export const SettingPopover: React.FC<SettingProps> = ({ onClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const { authUser, logout } = useAppStore.authStore.getState();
  const navigator = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-2 rounded-full hover:bg-[#a7bbe0] transition"
        aria-label="Toggle Settings"
      >
        <Setting_Strocke className="w-7 h-7 text-primary" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-72 bg-white rounded-2xl p-6 z-50 shadow-xl border border-gray-100"
          >
            <div className="flex flex-col gap-3">
              <button className="flex items-center justify-between px-4 py-2 rounded-lg hover:bg-blue-50 transition text-primary font-medium" onClick={() => navigator('/profile')}>
                <span>Perfil</span>
                <Perfil className="text-xl" />
              </button>
              <button className="flex items-center justify-between px-4 py-2 rounded-lg hover:bg-blue-50 transition text-primary font-medium">
                <span>Cuentas Vinculadas</span>
                <Link className="text-xl" />
              </button>
              <button className="flex items-center justify-between px-4 py-2 rounded-lg hover:bg-blue-50 transition text-primary font-medium" onClick={() => navigator('/membership')}>
                <span>Ser Premium</span>
                <Premium_primary className="text-xl" />
              </button>
            </div>
            <div className="border-t my-4" />
            <div className="flex items-center justify-between px-4 cursor-pointer rounded-lg hover:bg-blue-50" onClick={() => logout(navigator)}>
              <span className="text-primary font-medium">Cerrar Sesión</span>
              <button
                className="p-2 rounded-full transition"
                aria-label="Cerrar Sesión"
              >
                <LogOut_primary className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

};
