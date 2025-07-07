import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import NavBar from "../components/NavBar";
import MarkDown from "../components/MarkDown";
import supabase from "../supabase/config";

interface Blog {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
  };
  authorImage?: string;
  publishedAt: string;
  tags: { name: string }[];
}

const Blog = () => {
  const id = useParams().id;

  const [blog, setBlog] = useState<Blog | null>(null);

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        window.scrollTo(0, 0);

        const { data } = await supabase.auth.getSession();
        const userData = await supabase.auth.getUser();
        setUser(userData.data.user?.user_metadata.avatar_url || null);
        const accessToken = data.session?.access_token;
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog?id=${id}`,
          {
            headers: {
              Token: token,
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setBlog(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, token]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen dark:bg-black dark:text-white">
      <NavBar user={user} />
      <div className="px-6 sm:px-10">
        <div className="max-w-3xl mx-auto bg-white dark:bg-black overflow-hidden p-6 sm:p-8">
          <div className="mb-6 border-b pb-5">
            <h1 className="text-3xl sm:text-4xl font-extrabold dark:text-white mb-2">
              {blog?.title}
            </h1>
            <p className="text-sm dark:text-white">
              Posted on {blog?.publishedAt.substring(0, 10)}
            </p>
          </div>
          <div className="flex mb-1">
            <h1 className="text-sm flex">
              Tags:
              <ul>
                {blog?.tags.map((tag) => (
                  <li key={tag.name} className="inline-block mb-2 mr-2">
                    <span className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded-full dark:bg-zinc-800 dark:text-gray-300">
                      {tag.name}
                    </span>
                  </li>
                ))}
              </ul>
            </h1>
          </div>

          <div className="mb-4 pt-4 border-t">
            {blog?.content.split("\n").map((paragraph, index) => {
              return <MarkDown key={index} content={paragraph} />;
            })}
          </div>
          <div className="flex justify-end pt-4 border-t">
            <p className="italic  dark:text-gray-400">
              Written by{" "}
              <span className="font-semibold">{blog?.author.name}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
