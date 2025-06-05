import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Blogs from "../components/Blogs";
import NavBar from "../components/NavBar";
import Loader from "../components/Loader";
import CreateButton from "../components/CreateButton";

interface Blog {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
  };
  published: boolean;
  publishedAt: string;
}

const ForYou = () => {
  const token = localStorage.getItem("token"); 

  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/login" />;
  }
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const clicked = (id: string) => {
    navigate(`/blog/${id}`);
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/bulk`, {
        headers: {
          Token: token,
        },
      })
      .then((res) => {
        setBlogs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  return (
    <div className="bg-white min-h-screen h-fit dark:bg-black dark:text-white">
      <NavBar />
      <CreateButton />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b  pb-5 mb-6">
          <h1 className="text-2xl font-bold">For You</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Blogs picked for you
          </p>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="flex flex-col-reverse items-center">
            {blogs.map((blog: Blog) => (
              <Blogs
                key={blog.id}
                blog={blog}
                onClick={() => clicked(blog.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForYou;
