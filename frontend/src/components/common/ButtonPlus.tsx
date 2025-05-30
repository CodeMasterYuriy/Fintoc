type ButtonPluseProps = {
  bgColor?: string;
  text: string;
  onClick: () => void;
};

const ButtonPluse = ({ bgColor = "primary", text, onClick }: ButtonPluseProps) => {
  return (
    <button
      onClick={onClick} // <-- this must be present
      className={`bg-${bgColor} text-${bgColor === "white" ? "primary" : "white"} w-full flex items-center justify-between px-[8px] py-2 rounded-full font-light text-sm border-2`}
    >
      <span className="text-[16px]">{text}</span>
      <span className={`ml-4 text-[20px] font-medium rounded-full border-2 border-${bgColor === "white" ? "primary" : "white"} px-[3px]`}>
        +
      </span>
    </button>
  );
};

export default ButtonPluse;
