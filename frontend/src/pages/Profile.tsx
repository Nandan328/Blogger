import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Blogs from "../components/Blogs";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";

interface User {
  name: string;
  email: string;
  id: string;
}

interface Blog {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
  };
  publishedAt: string;
  published: boolean;
}

const Profile = () => {
  const id = localStorage.getItem("id");

  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !id) {
      navigate("/signin");
    }
  }, [token, id, navigate]);

  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    id: "",
  });

  const [blogs, setBlogs] = useState<Blog[]>([]);

  const [loading, setLoading] = useState(true);

  const [updated, setUpdated] = useState(false);

  const handelClick = (id: string) => {
    window.location.href = `/blog/${id}`;
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      axios
        .delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/blog?id=${id}`, {
          headers: {
            Token: token,
          },
        })
        .then(() => {
          setUpdated(!updated);
          setBlogs(blogs.filter((blog) => blog.id !== id));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user?id=${id}`, {
        headers: {
          Token: token,
        },
      })
      .then((res) => {
        setUser(res.data.user);
        setBlogs(res.data.blogs);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [updated, id, token]);

  return (
    <div className=" min-h-screen w-full dark:bg-black dark:text-white">
      <NavBar />
      {loading ? (
        <Loader />
      ) : (
        <div className="flex mt-5 items-center justify-evenly flex-col w-full h-full">
          <div className="w-full max-w-2xl flex flex-col justify-center items-center">
            <Avatar name={user.name} />
            <h1 className="text-4xl font-bold capitalize text-center mt-5 mb-2">
              {" "}
              {user.name}{" "}
            </h1>
            <p className="text-gray-500 text-sm font-semibold mb-1">
              {user.email}
            </p>
            <p className="text-gray-500 text-sm font-semibold">
              {" "}
              {blogs.length} Blogs
            </p>
          </div>
          <div>
            {blogs.map((blog) => (
              <div key={blog.id} className="flex justify-between items-center">
                <Blogs
                  key={blog.id}
                  blog={blog}
                  onClick={() => {
                    handelClick(blog.id);
                  }}
                  edit={true}
                />
                <button className="ml-3" onClick={() => handleDelete(blog.id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0,0,256,256"
                    className="cursor-pointer hover:text-red-500"
                  >
                    <g fill="currentColor">
                      <g transform="scale(2,2)">
                        <path d="M49,1c-1.66,0 -3,1.34 -3,3c0,1.66 1.34,3 3,3h30c1.66,0 3,-1.34 3,-3c0,-1.66 -1.34,-3 -3,-3zM24,15c-7.17,0 -13,5.83 -13,13c0,7.17 5.83,13 13,13h77v63c0,9.37 -7.63,17 -17,17h-40c-9.37,0 -17,-7.63 -17,-17v-52c0,-1.66 -1.34,-3 -3,-3c-1.66,0 -3,1.34 -3,3v52c0,12.68 10.32,23 23,23h40c12.68,0 23,-10.32 23,-23v-63.35937c5.72,-1.36 10,-6.50062 10,-12.64062c0,-7.17 -5.83,-13 -13,-13zM24,21h80c3.86,0 7,3.14 7,7c0,3.86 -3.14,7 -7,7h-80c-3.86,0 -7,-3.14 -7,-7c0,-3.86 3.14,-7 7,-7zM50,55c-1.66,0 -3,1.34 -3,3v46c0,1.66 1.34,3 3,3c1.66,0 3,-1.34 3,-3v-46c0,-1.66 -1.34,-3 -3,-3zM78,55c-1.66,0 -3,1.34 -3,3v46c0,1.66 1.34,3 3,3c1.66,0 3,-1.34 3,-3v-46c0,-1.66 -1.34,-3 -3,-3z"></path>
                      </g>
                    </g>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function Avatar({ name }: { name: string }) {
  return (
    <div className="relative select-none inline-flex items-center justify-center w-20 h-20 overflow-hidden bg-gray-100 rounded-full dark:bg-zinc-800 ring-2 ring-white dark:ring-zinc-700">
      <span className="font-medium text-4xl text-center text-gray-600 dark:text-gray-300">
        {name[0].toUpperCase()}
      </span>
    </div>
  );
}

export default Profile;
