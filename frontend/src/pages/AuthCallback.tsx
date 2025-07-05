import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase/config";
import axios from "axios";
import Loader from "../components/Loader";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
        const token = localStorage.getItem("token");
        if (token && token !== "undefined") {
          navigate("/signin");
          return;
        }
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          navigate("/signin");
          return;
        }

        if (data.session?.user) {
          const user = data.session.user;

          const existingUser = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/exists`, {
              params: {
                email: user.email,
              }
            }
          );

          if (existingUser.data.exists) {
            console.log("User already exists:", existingUser.data);
            localStorage.setItem("id", existingUser.data.id);
            localStorage.setItem("token", existingUser.data.token);
            navigate("/");
            return;
          }

          const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/signup`,
            {
              name: user.user_metadata?.full_name || user.email,
              email: user.email,
              password: user.id,
            }
          );
          console.log("Auth callback response:", response.data);
          const token = response.data.token;
          const id = response.data.id;
          localStorage.setItem("id", id);
          localStorage.setItem("token", token);
          localStorage.setItem("user", response.data.profile);
          navigate("/");
        } else {
          navigate("/signin");
        }
      } catch (err) {
        console.error("Auth callback failed:", err);
        navigate("/signin");
      }
    };

    handleAuthCallback();
  }, []);

  return <Loader />;
};

export default AuthCallback;
