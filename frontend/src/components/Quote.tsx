const Quote = () => {
  return (
    <div className="bg-slate-200 text-black h-screen flex flex-col justify-center items-center font-mono text-left px-10 dark:bg-zinc-900 dark:text-slate-50">
      <div>
        <h1 className="max-w-md font-extrabold text-xl py-1">
          "The only way to do great work is to love what you do. If you haven't
          found it yet, keep looking."
        </h1>
        <p className="text-sm">Copilot</p>
        <p className="text-zinc-400 text-xs dark:text-zinc-500 ">CHATBOT</p>
      </div>
    </div>
  );
};

export default Quote;
