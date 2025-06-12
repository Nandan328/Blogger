import Quote from "../components/Quote";
import Heading from "../components/Heading";
import Input from "../components/Input";
import Button from "../components/Button";
import { sigunInputType } from "@nandan_k/medium-common";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const Signup = () => {
  const [signupInputs, setSignupInputs] = useState<sigunInputType>({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const check = () => {
    if (
      signupInputs.name === "" ||
      signupInputs.email === "" ||
      signupInputs.password === ""
    ) {
      alert("Please enter all the fields");
      return;
    } else {
      setLoading(true);
      axios
        .post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/signup`,
          signupInputs
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
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="grid bg-white dark:bg-black sm:grid-cols-2">
        <div className="bg-white dark:bg-black text-black dark:text-white h-screen flex flex-col justify-center items-center">
          <Heading
            label="Create an account"
            message="Alreafy have an Account? "
            redirect="signin"
          />
          <form
            action={check}
            className="flex flex-col justify-center items-center w-full max-w-sm"
          >
            <Input
              label="Name"
              type="text"
              placeholder="Enter your name"
              onChange={(e) => {
                setSignupInputs({
                  ...signupInputs,
                  name: e.target.value,
                });
              }}
            />
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              onChange={(e) => {
                setSignupInputs({
                  ...signupInputs,
                  email: e.target.value,
                });
              }}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              onChange={(e) => {
                setSignupInputs({
                  ...signupInputs,
                  password: e.target.value,
                });
              }}
            />
            <Button label="Signup" onClick={() => {}} />
          </form>
        </div>
        <div className="invisible sm:visible">
          <Quote />
        </div>
      </div>
    </>
  );
};

export default Signup;
