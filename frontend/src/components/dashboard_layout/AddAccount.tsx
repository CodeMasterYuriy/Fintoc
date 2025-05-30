import { useEffect, useState } from "react";
import ButtonPluse from "../common/ButtonPlus";
import { ChileLogo } from "../icons";
import FullScreenLoader from "../common/Loading";
import SuccessBelvoModal from "../dialogs/Success.modal";
import FailBelvoModal from "../dialogs/Fail.modal";

import {
  handleBankAccountClick,
  connectGmail
} from "../../utils/apis/add_account";
import { set } from "zod";

declare global {
  interface Window {
    belvoSDK?: any;
  }
}
export type ModalState = {
  isSucccess: boolean;
  isFalse: boolean;
};

const AddAccount = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const [modal, setModal] = useState<ModalState>({
    isSucccess: false,
    isFalse: false,
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.belvo.io/belvo-widget-1-stable.js";
    script.async = true;

    script.onload = () => {
      console.log("Belvo script loaded successfully.");
    };

    script.onerror = () => {
      setError("Failed to load Belvo script.");
    };

    document.body.appendChild(script);
  }, []);

  return (
    <div className="bg-primary p-8 rounded-l-2xl w-full">
      {loading && <FullScreenLoader />}
      {modal.isSucccess && <SuccessBelvoModal setModal={setModal} />}
      {modal.isFalse && <FailBelvoModal setModal={setModal} />}

      <div id="belvo"></div>

      <div className="bg-white text-ct-grey rounded-full max-w-28 cursor-pointer flex justify-center py-1 items-center gap-2 mt-7">
        <ChileLogo className="w-8 h-8" />
        <p>Chile</p>
      </div>

      <div className="text-white text-[19px] text-md font-semibold my-6">
        Agrega más cuentas
      </div>

      <div className="flex flex-col justify-between items-between mb-7 gap-6">
        {/* <ButtonPluse
          bgColor="primary"
          text="Correo electrónico"
          onClick={() => connectGmail(setLoading, setError)}
        /> */}
        <ButtonPluse
          bgColor="primary"
          text="Cuenta Bancaria"
          onClick={() => handleBankAccountClick(setLoading, setError, setModal)}
        />
        <ButtonPluse
          bgColor="white"
          text="Tarjeta de Crédito"
          onClick={() => alert("Tarjeta de Crédito")}
        />
      </div>

      {loading && <div className="text-white mt-4">Cargando...</div>}
      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};


export default AddAccount;