import { Link } from "react-router-dom";

interface HeadingInputs {
  label: string;
  message: string;
  redirect: string;
}

const Heading = ({label, message, redirect} : HeadingInputs) => {
  return (
    <div className="text-center py-5">
      <h1 className="text-3xl py-2">{label}</h1>
      <span className="text-zinc-500">
        {message}
        <Link className="underline" to={`/${redirect}`}>
          {redirect}
        </Link>
      </span>
    </div>
  );
}

export default Heading