import Heading from "../components/Heading";
import Input from "../components/Input";
import Button from "../components/Button";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Error from "../components/Error";
import GoogleSignin from "../components/GoogleSignin";
import supabase from "../supabase/config";

interface signupInputType {
  name: string;
  email: string;
  password: string;
}

const Signup = () => {
  const [signupInputs, setSignupInputs] = useState<signupInputType>({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const handleGoogleSignin = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `http://localhost:5173/auth/callback`,
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

  const check = async () => {
    if (
      signupInputs.name === "" ||
      signupInputs.email === "" ||
      signupInputs.password === ""
    ) {
      setError(true);
      return;
    } else {
      const { error } = await supabase.auth.signUp({
        email: signupInputs.email,
        password: signupInputs.password,
        options: {
          data: {
            displayName: signupInputs.name,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setError(true);
        return;
      }

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
      <div className="bg-white dark:bg-black">
        <Error message={errorMessage} error={error} setError={setError} />
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
            <p>or</p>
            <GoogleSignin handleGoogleSignin={handleGoogleSignin} />
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
