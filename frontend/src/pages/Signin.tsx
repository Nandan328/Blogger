import Quote from "../components/Quote";
import Heading from "../components/Heading";
import Input from "../components/Input";
import Button from "../components/Button";
import { useState } from "react";
import { siginInputType } from "@nandan_k/medium-common";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Error from "../components/Error";
import Loader from "../components/Loader";

const Signin = () => {
  const [signinInputs, setSigninInputs] = useState<siginInputType>({
    email: "",
    password: "",
  });

  const [error, setError] = useState(false);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const check = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (signinInputs.email === "" || signinInputs.password === "") {
      setError(true);
      return;
    }

    setLoading(true);

    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/signin`,
        signinInputs
      )
      .then((res) => {
        const token = res.data.token;
        const id = res.data.id;
        localStorage.setItem("id", id);
        localStorage.setItem("token", token);
        localStorage.setItem("user", res.data.profile);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="grid bg-white dark:bg-black sm:grid-cols-2 ">
        <Error error={error} setError={setError} />
        <div className="bg-white dark:bg-black text-black dark:text-white h-screen flex flex-col justify-center items-center">
          <Heading
            label="Login to your account"
            message="Don't have an account? "
            redirect="signup"
          />
          <form
            onSubmit={check}
            className="flex flex-col justify-center items-center w-full max-w-sm"
          >
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              onChange={(e) => {
                setSigninInputs({
                  ...signinInputs,
                  email: e.target.value,
                });
              }}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              onChange={(e) => {
                setSigninInputs({
                  ...signinInputs,
                  password: e.target.value,
                });
              }}
            />
            <Button label="Signin" onClick={check} />
          </form>
        </div>
        <div className=" hidden sm:block">
          <Quote />
        </div>
      </div>
    </>
  );
};

export default Signin;
