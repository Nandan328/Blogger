interface ButtonProps {
    label: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = ({label, onClick}: ButtonProps) => {
  return (
    <div className="w-full my-4">
      <button onClick={onClick} className="bg-black cursor-pointer dark:bg-white text-white p-1.5 dark:text-black rounded w-full">
        {label}
      </button>
    </div>
  );
}

export default Button