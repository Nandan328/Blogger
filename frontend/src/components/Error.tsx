import { useState, useEffect } from "react";

interface ErrorProps {
  message?: string;
  error: boolean;
  setError: (error: boolean) => void;
}

const Error = ({ message, error, setError }: ErrorProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setVisible(true);
      const timeout = setTimeout(() => {
        setVisible(false);
        setError(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [error, setError]);

  if (!error && !visible) return null;

  return (
    <div
      className={`fixed top-4 right-4 bg-red-500 rounded-lg shadow-lg p-4 transform transition-all duration-300 ease-in-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <div className="mb-2">
        <p className="text-white font-medium">{message || "Wrong Inputs"}</p>
      </div>
    </div>
  );
};

export default Error;
