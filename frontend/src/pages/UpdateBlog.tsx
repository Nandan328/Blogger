import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import BlogInputs from "../components/BlogInputs";
import supabase from "../supabase/config";

const UpdateBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [publish, setPublish] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");

  useEffect(() => {
    if (!token || !userId) {
      navigate("/login");
    }
  }, [token, userId, navigate]);

  useEffect(() => {
    if (!token) return;

    const fetchBlogDetails = async () => {
      const { data } = await supabase.auth.getSession();
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog?id=${id}`,
          {
            headers: {
              Token: token,
              Authorization: `Bearer ${data.session?.access_token}`,
            },
          }
        );

        const Data = res.data;

        setTitle(Data.title);
        setContent(Data.content);
        setPublish(Data.published);

        setTags(
          Array.isArray(Data.tags)
            ? Data.tags.map((tag: any) =>
                typeof tag === "string" ? tag : tag.name
              )
            : []
        );
      } catch (err) {
        console.error("Error fetching blog details:", err);
        alert("Error fetching blog details");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id, token, navigate]);
  

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handletags = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTags([...tags, e.target.value]);
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const updateBlog = () => {
    if (!title || !content) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    axios
      .put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog?id=${id}`,
        {
          title: title,
          content: content,
          published: publish,
          id: userId,
          tags: tags,
        },
        {
          headers: {
            Token: token,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          navigate(`/blog/${id}`);
        } else {
          alert("Something went wrong");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4 w-full dark:bg-black dark:text-white">
      <h1 className="text-3xl font-bold text-center my-6">Update Blog</h1>
      <form
        className="w-full max-w-2xl"
        onSubmit={(e) => {
          e.preventDefault();
          updateBlog();
        }}
      >
        <BlogInputs
          handleTitle={handleTitle}
          title={title}
          handleContent={handleContent}
          content={content}
          type={"Update"}
          publish={publish}
          handlePublish={setPublish}
          handleTags={handletags}
          tags={tags}
          removeTag={removeTag}
        />
      </form>
    </div>
  );
};

export default UpdateBlog;
