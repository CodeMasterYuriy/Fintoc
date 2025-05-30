import { Vector } from "../icons";
import { Cancel } from "../icons";

const TopSection = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) => {
  return (
    <div className='w-full grid grid-cols-12 gap-8'>
        <div className='w-full sm:col-span-5 col-span-12 flex gap-4 px-4 sm:px-0 items-end'>
            <button
            onClick={() => setActiveTab("current")}
            className={`py-2 px-4 h-10 rounded-full text-[15px] sm:text-xl ${
            activeTab === "current"
              ? "bg-primary text-white hover:bg-hoverColor"
              : "bg-secondary text-primary hover:text-hoverColor"
            }`}>
                Próximos Cobros
            </button>
            <button
            onClick={() => setActiveTab("previous")}
            className={`py-2 px-4 h-10 rounded-full text-[15px] sm:text-xl ${
            activeTab === "previous"
              ? "bg-primary text-white hover:bg-hoverColor"
              : "bg-secondary text-primary hover:text-hoverColor"
            }`}
            >
                Ver Todo
            </button>
      </div>

        {activeTab === "current" ? (
        <>
          <div className="sm:col-span-1 hidden sm:block"></div>

          <div className='w-full sm:col-span-6 col-span-12 px-4 sm:px-0 sm:pl-[40px]'>
            <div className='flex flex-col gap-3 bg-gradient-main rounded-3xl px-4 py-4 sm:px-10'>
                <p className='text-[#0D99FF] sm:text-right text-center text-[16px] w-full sm:text-[20px] font-bold'>¿Deseas bajar tus cobros de servicios?</p>
                <p className='text-white sm:text-right text-center text-[16px] w-full sm:text-xl font-bold'>Nuestros expertos pueden negociar </p>
                <p className='text-white sm:text-right text-center text-[16px] w-full sm:text-xl font-bold'>por ti a un mejor precio. </p>

                <div className='flex justify-between sm:px-0 items-end px-5'>
                    <div className=''><Vector className="sm:w-16 sm:h-16 w-12 h-12"/></div>

                    <button className='rounded-full max-h-16 py-2 sm:px-5 px-5 bg-secondary hover:bg-white text-primary font-bold sm:text-[17px] text-[15px]'>
                      ¡Lo quiero!
                    </button>
                </div>
            </div>
          </div>
          </>
        ):(
          <>
            <div className="sm:col-span-1 hidden sm:block"></div>
            <div className='w-full sm:col-span-6 col-span-12 px-4 sm:px-0 sm:pl-[55px]'>
                <div className='flex flex-col gap-3 bg-gradient-main rounded-3xl px-4 py-4 sm:px-10'>
                    <p className='text-[#0D99FF] sm:text-right text-center text-[16px] w-full sm:text-[20px] font-bold'>¿Quieres cancelar una suscripción?</p>
                    <p className='text-white sm:text-right text-center text-[16px] w-full sm:text-xl font-bold'>Nuestro equipo puede ayudarte.</p>

                    <div className='flex justify-between px-6 sm:px-0 items-end'>
                        <div className=''><Cancel className="sm:w-16 sm:h-16 w-12 h-12"/></div>

                        <button className='rounded-full max-h-16 py-2 sm:px-5 px-5 bg-secondary hover:bg-white text-primary font-bold sm:text-[17px] text-[15px]'>
                            Quiero Cancelar
                        </button>
                    </div>
                </div>
            </div>
          </>
        )}

    </div>
  );
};

export default TopSection;
