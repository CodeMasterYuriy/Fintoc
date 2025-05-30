import React, { useEffect, useState } from 'react';
import VariablePieChart from "./PieChart";
import { getBudgetByCategoryThisMonth } from "../../utils/apis/add_account/charts";

type PresupuestoProps = {
  isConnected: boolean;
};

type Transaction = {
  category: string;
  amount: string;
};

const mockup = [
  { category: "Ingreso", amount: "11.500" },
  { category: "Cuenta y Suscripciones", amount: "1.000" },
  { category: "Auto", amount: "2.000" },
  { category: "Farmacia", amount: "700" },
  { category: "Seguro", amount: "1.200" },
  { category: "Vehículo", amount: "2.500" },
  { category: "Salud", amount: "1.500" },
  { category: "Importe", amount: "600" },
];

const Presupuesto: React.FC<PresupuestoProps> = ({ isConnected }) => {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isConnected) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await getBudgetByCategoryThisMonth();
          if (response) {
            // Adjust mapping as per your API response structure
            // const formattedData = response.budget.map(
            //   (item: { category: string; amount: number }) => ({
            //     category: item.category,
            //     amount: item.amount.toLocaleString("es-CL", { minimumFractionDigits: 0 }),
            //   })
            // );
            setTransactions(mockup);
            console.log(transactions);

          } else {
            setTransactions(null);
          }
        } catch (error) {
          console.log("Error fetching recent subscriptions:", error);
          setTransactions(null);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [isConnected]);
  return (
    <div className="rounded-2xl bg-secondary w-full overflow-hidden">
      <div className="bg-ct-grey py-3 text-white text-xl font-bold pl-8">Recientes</div>
      {isConnected ? (
        loading ? (
          <div className="text-center text-black font-semibold text-lg h-[300px] flex items-center justify-center">
            Cargando datos...
          </div>
        ) : transactions ? (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            <div className="h-full flex flex-col justify-between items-between">
              {transactions.map((tx, index) => (
                <div
                  key={index}
                  className="bg-white rounded-full flex justify-between items-center my-3 pl-4"
                >
                  <div className="text-sm sm:text-base">{tx.category}</div>
                  <span className="bg-ct-grey text-white font-bold py-1.5 px-4 text-center rounded-full text-sm sm:text-base max-w-[130px] min-w-[130px]">
                    ${tx.amount}
                  </span>
                </div>
              ))}
            </div>
            <div className="rounded-3xl overflow-hidden h-full flex flex-col">
              <VariablePieChart />
            </div>
          </div>
        ) : (
          <div className="text-center text-black font-semibold text-lg h-[300px] flex flex-col items-center justify-center">
            <p>No hay datos disponibles</p>
            <button className="bg-primary text-white font-semibold px-8 py-2 mt-4 rounded-full hover:bg-hoverColor transition">
              Vincular Cuenta
            </button>
          </div>
        )
      ) : (
        <div className="text-center text-black font-semibold text-lg h-[300px] flex flex-col items-center justify-center">
          <p>Conecta tu cuenta bancaria o tarjeta mediante Belvo</p>
        </div>
      )}
    </div>
  );
};

export default Presupuesto;