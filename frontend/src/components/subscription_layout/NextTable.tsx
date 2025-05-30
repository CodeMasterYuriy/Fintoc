import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Cancelsubscription, Unsbscription, Notsubscription } from '../icons';

const transactions = [
  { date: "24/04/25", name: "Netflix", category: "Streaming", amount: "12.990" },
  { date: "24/04/25", name: "Cafetería", category: "Comidas", amount: "12.990" },
  { date: "24/04/25", name: "HBO Max", category: "Streaming", amount: "12.990" },
];

const transactions1 = [
  { date: "24/04/25", name: "Netflix", category: "Streaming", amount: "12.990" },
  { date: "24/04/25", name: "HBO Max", category: "Streaming", amount: "12.990" },
];

const NextSubscriptionTable = () => {
  const [openIndexBlock1, setOpenIndexBlock1] = useState<number | null>(null);
  const [openIndexBlock2, setOpenIndexBlock2] = useState<number | null>(null);

  // Use array refs for each block, to allow scrollIntoView per item dropdown open
  const refsBlock1 = useRef<(HTMLDivElement | null)[]>([]);
  const refsBlock2 = useRef<(HTMLDivElement | null)[]>([]);

  // Handle outside click to close any open dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if clicked inside any open dropdown panel
      const clickedInsideBlock1 =
        openIndexBlock1 !== null &&
        refsBlock1.current[openIndexBlock1] &&
        refsBlock1.current[openIndexBlock1]?.contains(event.target as Node);
      const clickedInsideBlock2 =
        openIndexBlock2 !== null &&
        refsBlock2.current[openIndexBlock2] &&
        refsBlock2.current[openIndexBlock2]?.contains(event.target as Node);

      if (!clickedInsideBlock1 && !clickedInsideBlock2) {
        setOpenIndexBlock1(null);
        setOpenIndexBlock2(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openIndexBlock1, openIndexBlock2]);

  // Scroll into view when opening dropdown in Block 1
  useEffect(() => {
    if (openIndexBlock1 !== null) {
      refsBlock1.current[openIndexBlock1]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [openIndexBlock1]);

  // Scroll into view when opening dropdown in Block 2
  useEffect(() => {
    if (openIndexBlock2 !== null) {
      refsBlock2.current[openIndexBlock2]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [openIndexBlock2]);

  const renderDropdown = (ref: React.RefObject<HTMLDivElement>) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className="absolute top-full right-0 bg-white shadow-lg rounded-lg p-3 w-[230px] z-50"
    >
      <div className="text-sm text-ct-grey cursor-pointer py-1 rounded-full border-primary border-2 px-2 hover:bg-primary hover:text-white mb-2 flex gap-2 items-center justify-between">
        <span>Cancelar Suscripción</span> <Notsubscription className="w-5 h-5 fill-primary" />
      </div>
      <div className="text-sm text-ct-grey cursor-pointer py-1 rounded-full border-primary border-2 px-2 hover:bg-primary hover:text-white mb-2 flex gap-2 items-center justify-between">
        <span>Eliminar Suscripción</span> <Unsbscription className="w-5 h-5 fill-primary" />
      </div>
      <div className="text-sm text-ct-grey cursor-pointer py-1 rounded-full border-primary border-2 px-2 hover:bg-primary hover:text-white mb-2 flex gap-2 items-center justify-between">
        <span>No es una suscripción</span> <Cancelsubscription className="w-5 h-5 fill-primary" />
      </div>
    </motion.div>
  );

  return (
    <div className="px-4 sm:px-0">
      {/* First Block */}
      <div className="rounded-2xl bg-secondary w-full overflow-visible mt-16">
        <div className="bg-ct-grey py-3 text-white text-xl font-bold pl-8 rounded-tl-xl rounded-tr-xl">
          Suscripciones
        </div>
        <div className="w-full text-left text-sm p-4">
          <div className="text-ct-grey font-semibold border-b-2 border-gray-500 grid grid-flow-col text-center">
            <div className="py-2">Empresa</div>
            <div className="py-2">Fecha de cobro</div>
            <div className="py-2">Cuenta</div>
            <div className="py-2">Monto</div>
          </div>

          {transactions.map((tx, index) => (
            <div className="relative" key={index}>
              <div className="flex justify-between items-center">
                <div className="bg-white rounded-full grid grid-flow-col text-center my-3 items-center flex-1">
                  <div>{tx.date}</div>
                  <div>{tx.name}</div>
                  <div>{tx.category}</div>
                  <div>
                    <span className="bg-ct-grey text-white font-bold py-1.5 w-full rounded-full inline-block">
                      ${tx.amount}
                    </span>
                  </div>
                </div>

                <span
                  className="ml-2 text-[20px] font-medium rounded-full border-2 text-primary border-primary px-[3px] cursor-pointer"
                  onClick={() =>
                    setOpenIndexBlock1((prev) => (prev === index ? null : index))
                  }
                >
                  +
                </span>
              </div>

              <AnimatePresence>
                {openIndexBlock1 === index &&
                  renderDropdown({
                    current: refsBlock1.current[index] || null,
                    // We need to assign the ref properly, so let's fix in the next line
                  } as React.RefObject<HTMLDivElement>)}
              </AnimatePresence>

              {/* Assign ref properly to dropdown */}
              {openIndexBlock1 === index && (
                <AnimatePresence>
                  <motion.div
                    ref={(el) => (refsBlock1.current[index] = el)}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute top-full right-0 bg-white shadow-lg rounded-lg p-3 w-[230px] z-50"
                  >
                    <div className="text-sm text-ct-grey cursor-pointer py-1 rounded-full border-primary border-2 px-2 hover:bg-primary hover:text-white mb-2 flex gap-2 items-center justify-between">
                      <span>Cancelar Suscripción</span>{" "}
                      <Notsubscription className="w-5 h-5 fill-primary" />
                    </div>
                    <div className="text-sm text-ct-grey cursor-pointer py-1 rounded-full border-primary border-2 px-2 hover:bg-primary hover:text-white mb-2 flex gap-2 items-center justify-between">
                      <span>Eliminar Suscripción</span>{" "}
                      <Unsbscription className="w-5 h-5 fill-primary" />
                    </div>
                    <div className="text-sm text-ct-grey cursor-pointer py-1 rounded-full border-primary border-2 px-2 hover:bg-primary hover:text-white mb-2 flex gap-2 items-center justify-between">
                      <span>No es una suscripción</span>{" "}
                      <Cancelsubscription className="w-5 h-5 fill-primary" />
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          ))}
          <button className="mx-auto bg-primary text-white font-semibold px-8 py-2 mt-3 rounded-full hover:bg-purple-800 transition block">
            Agregar Suscripción
          </button>
        </div>

      </div>

      {/* Second Block */}
      <div className="rounded-2xl bg-secondary w-full overflow-visible mt-16">
        <div className="bg-ct-grey py-3 text-white text-xl font-bold pl-8 rounded-tl-xl rounded-tr-xl">
          Servicio
        </div>
        <div className="w-full text-left text-sm p-4">
          <div className="text-ct-grey font-semibold border-b-2 border-gray-500 grid grid-flow-col text-center">
            <div className="py-2">Empresa</div>
            <div className="py-2">Fecha de cobro</div>
            <div className="py-2">Cuenta</div>
            <div className="py-2">Monto</div>
          </div>

          {transactions1.map((tx, index) => (
            <div className="relative" key={index}>
              <div className="flex justify-between items-center">
                <div className="bg-white rounded-full grid grid-flow-col text-center my-3 items-center flex-1">
                  <div>{tx.date}</div>
                  <div>{tx.name}</div>
                  <div>{tx.category}</div>
                  <div>
                    <span className="bg-ct-grey text-white font-bold py-1.5 w-full rounded-full inline-block">
                      ${tx.amount}
                    </span>
                  </div>
                </div>

                <span
                  className="ml-2 text-[20px] font-medium rounded-full border-2 text-primary border-primary px-[3px] cursor-pointer"
                  onClick={() =>
                    setOpenIndexBlock2((prev) => (prev === index ? null : index))
                  }
                >
                  +
                </span>
              </div>

              <AnimatePresence>
                {openIndexBlock2 === index &&
                  renderDropdown({
                    current: refsBlock2.current[index] || null,
                  } as React.RefObject<HTMLDivElement>)}
              </AnimatePresence>

              {/* Assign ref properly to dropdown */}
              {openIndexBlock2 === index && (
                <AnimatePresence>
                  <motion.div
                    ref={(el) => (refsBlock2.current[index] = el)}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute top-full right-0 bg-white shadow-lg rounded-lg p-3 w-[230px] z-50"
                  >
                    <div className="text-sm text-ct-grey cursor-pointer py-1 rounded-full border-primary border-2 px-2 hover:bg-primary hover:text-white mb-2 flex gap-2 items-center justify-between">
                      <span>Cancelar Suscripción</span>{" "}
                      <Notsubscription className="w-5 h-5 fill-primary" />
                    </div>
                    <div className="text-sm text-ct-grey cursor-pointer py-1 rounded-full border-primary border-2 px-2 hover:bg-primary hover:text-white mb-2 flex gap-2 items-center justify-between">
                      <span>Eliminar Suscripción</span>{" "}
                      <Unsbscription className="w-5 h-5 fill-primary" />
                    </div>
                    <div className="text-sm text-ct-grey cursor-pointer py-1 rounded-full border-primary border-2 px-2 hover:bg-primary hover:text-white mb-2 flex gap-2 items-center justify-between">
                      <span>No es una suscripción</span>{" "}
                      <Cancelsubscription className="w-5 h-5 fill-primary" />
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          ))}

          <button className="mx-auto bg-primary text-white font-semibold px-8 py-2 mt-3 rounded-full hover:bg-purple-800 transition block">
              Agregar Servicio
            </button>
        </div>

      </div>
    </div>
  );
};

export default NextSubscriptionTable;
