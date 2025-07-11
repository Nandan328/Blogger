import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Blogs from "../components/Blogs";
import NavBar from "../components/NavBar";
import Loader from "../components/Loader";
import CreateButton from "../components/CreateButton";
import supabase from "../supabase/config";

interface Blog {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
  };
  authorImage?: string;
  published: boolean;
  publishedAt: string;
  tags: { name: string }[];
}

const ForYou = () => {
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/login" />;
  }

  const [blogs, setBlogs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<string | null>(null);

  const clicked = (id: string) => {
    navigate(`/blog/${id}`);
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data } = await supabase.auth.getSession();
      const userData = await supabase.auth.getUser();
      setUser(userData.data.user?.user_metadata.avatar_url || null);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/bulk`,
          {
            headers: {
              Token: token,
              Authorization: `Bearer ${data.session?.access_token}`,
            },
          }
        );

        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [token]);

  const [selectedTag, setSelectedTag] = useState("All");

  const tags = [
    "GUIDE",
    "TECH",
    "GAMING",
    "NEWS",
    "LIFESTYLE",
    "EDUCATION",
    "HEALTH",
    "ENTERTAINMENT",
    "SPORTS",
    "TRAVEL",
    "FOOD",
  ];

  const handleTagChange = (tag: string) => () => {
    setSelectedTag(tag);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-white min-h-screen h-fit dark:bg-black dark:text-white">
      <NavBar user={user} />
      <CreateButton />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b  pb-5 mb-6">
          <h1 className="text-2xl font-bold">For You</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Blogs picked for you
          </p>
        </div>
        <div className="sm:flex sm:justify-center overflow-x-auto scrollbar-hide">
          <ul className="flex space-x-2 text-sm">
            <li
              onClick={handleTagChange("All")}
              className="cursor-pointer hover:dark:bg-zinc-800 py-1 px-2 rounded-full"
            >
              All
            </li>
            <li>|</li>
            {tags.map((tag) => (
              <li
                key={tag}
                onClick={handleTagChange(tag)}
                className="cursor-pointer hover:dark:bg-zinc-800 py-1 px-2 rounded-full"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col-reverse items-center">
          {blogs.map((blog: Blog) => {
            if (
              selectedTag !== "All" &&
              !blog.tags.some((tag) => tag.name === selectedTag)
            ) {
              return null;
            }
            return (
              <Blogs
                key={blog.id}
                blog={blog}
                onClick={() => clicked(blog.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ForYou;
