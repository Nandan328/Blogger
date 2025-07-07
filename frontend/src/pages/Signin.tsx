import Heading from "../components/Heading";
import Input from "../components/Input";
import Button from "../components/Button";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Error from "../components/Error";
import Loader from "../components/Loader";
import GoogleSignin from "../components/GoogleSignin";
import supabase from "../supabase/config";

interface signinInputType {
  email: string;
  password: string;
}

const Signin = () => {
  const [signinInputs, setSigninInputs] = useState<signinInputType>({
    email: "",
    password: "",
  });

  const [error, setError] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleGoogleSignin = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${import.meta.env.VITE_CURRENT_URL}`,
        },
      });

      console.log("Google signin data:", data.url);

      if (error) {
        console.error("Google signin error:", error);
        setError(true);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error("Google signin failed:", err);
      setError(true);
      setLoading(false);
    }
  };

  const check = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (signinInputs.email === "" || signinInputs.password === "") {
      setError(true);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: signinInputs.email,
      password: signinInputs.password,
    });

    if (error) {
      console.error("Signin error:", error);
      setErrorMessage(error.message);
      setError(true);
      return;
    }

    setLoading(true);

    if (error) {
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
      <div className="bg-white dark:bg-black">
        <Error message={errorMessage} error={error} setError={setError} />
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
            <p>or</p>
            <GoogleSignin handleGoogleSignin={handleGoogleSignin} />
          </form>
        </div>
      </div>
    </>
  );
};

export default Signin;
