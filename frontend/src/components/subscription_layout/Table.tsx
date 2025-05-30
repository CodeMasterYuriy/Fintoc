import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Cancelsubscription } from '../icons';
import { Unsbscription } from '../icons';
import { Notsubscription } from '../icons';

const transactions = [
  { date: "24/04/25", name: "Netflix", category: "Streaming", amount: "12.990" },
  { date: "24/04/25", name: "Cafetería", category: "Comidas", amount: "12.990" },
  { date: "24/04/25", name: "HBO Max", category: "Streaming", amount: "12.990" },
  { date: "24/04/25", name: "HBO Max", category: "Streaming", amount: "12.990" },
];

const SubscriptionTable = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openIndex !== null &&
        refs.current[openIndex] &&
        !refs.current[openIndex]?.contains(event.target as Node)
      ) {
        setOpenIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openIndex]);

  useEffect(() => {
    if (openIndex !== null) {
      refs.current[openIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [openIndex]);

  return (
    <div className="px-4 sm:px-0">
      <div className="rounded-2xl bg-secondary mt-16">
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
                  className="ml-2 text-[20px] font-medium rounded-full border-2 relative text-primary border-primary px-[3px] cursor-pointer"
                  onClick={() => setOpenIndex(prev => (prev === index ? null : index))}
                >
                  +
                </span>
              </div>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    ref={(el) => (refs.current[index] = el)}
                    key={index}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute top-full right-0 bg-white shadow-lg rounded-lg p-3 w-[230px] z-50"
                  >
                    <div className="text-sm text-ct-grey cursor-pointer py-1 rounded-full border-primary border-2 px-2 hover:bg-primary hover:text-white mb-2 flex gap-2 items-center justify-between">
                      <span>Cancelar Suscripción</span> <Notsubscription className='w-5 h-5 fill-primary' />
                    </div>
                    <div className="text-sm text-ct-grey cursor-pointer py-1 rounded-full border-primary border-2 px-2 hover:bg-primary hover:text-white mb-2 flex gap-2 items-center justify-between">
                      <span>Eliminar Suscripción</span> <Unsbscription className='w-5 h-5 fill-primary' />
                    </div>
                    <div className="text-sm text-ct-grey cursor-pointer py-1 rounded-full border-primary border-2 px-2 hover:bg-primary hover:text-white mb-2 flex gap-2 items-center justify-between">
                      <span>No es una suscripción</span> <Cancelsubscription className='w-5 h-5 fill-primary' />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <button className="mx-auto bg-primary text-white font-semibold px-8 py-2 mt-2 rounded-full hover:bg-purple-800 transition block">
            Agregar Suscripción
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTable;
