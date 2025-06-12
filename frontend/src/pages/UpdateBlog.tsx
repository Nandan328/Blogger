import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import BlogInputs from "../components/BlogInputs";

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
    if (token) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/blog?id=${id}`, {
          headers: {
            Token: token,
          },
        })
        .then((res) => {
          setTitle(res.data.title);
          setContent(res.data.content);
          setPublish(res.data.published);
          setTags(
            Array.isArray(res.data.tags)
              ? res.data.tags.map((tag: any) =>
                  typeof tag === "string" ? tag : tag.name
                )
              : []
          );
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          alert("Error fetching blog details");
          navigate("/");
        });
    }
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
          alert("Blog updated successfully");
          navigate(`/blog/${id}`);
        } else {
          alert("Something went wrong");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong");
      });
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 w-full dark:bg-black dark:text-white">
      <h1 className="text-3xl font-bold text-center my-6">Update Blog</h1>

      {loading ? (
        <Loader />
      ) : (
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
      )}
    </div>
  );
};

export default UpdateBlog;
