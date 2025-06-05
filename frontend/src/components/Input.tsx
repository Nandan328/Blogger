import { ChangeEvent } from 'react';

interface InputProps {
  label: string;
  type: string;
  placeholder: string;
  value?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({label, type, placeholder, value, onChange}:InputProps) => {
  return (
    <div className="flex flex-col w-full my-2">
      <label >{label}</label>
      <input className="border-1 rounded p-2 px-3" type={type} placeholder={placeholder} value={value} onChange={onChange}/>
    </div>
  );
}

export default Input