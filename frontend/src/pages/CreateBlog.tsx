import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BlogInputs from "../components/BlogInputs";

const CreateBlog = () => {

  const token = localStorage.getItem("token")

  const id = localStorage.getItem("id")

  const navigate = useNavigate()

  if(!token || !id) {
    navigate("/login")
  }

  const [title, setTitle] = useState<string>("")

  const [content, setContent] = useState<string>("")

  const [publish, setPublish] = useState<boolean>(false)

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleContext = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)  
  }
  
  const create = () => {
    if(!title || !content) {
      alert("Please fill all fields")
      return
    }
    
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/blog`,{
        title : title,
        content : content,
        published : publish,
        authorId : id
      }, {
        headers: {
          "Token": token
        }
    }).then((res) => {
      if(res.status === 200) {
        alert("Blog created successfully")
        navigate("/")
      } else {
        alert("Something went wrong")
      }
    }
    ).catch((err) => {
      console.log(err)
      alert("Something went wrong")
    })
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4 w-full dark:bg-black dark:text-white">
      <h1 className="text-3xl font-bold text-center my-6">Create Blog</h1>

      <form className="w-full max-w-2xl" action={create}>
        <BlogInputs handleTitle={handleTitle} handleContent={handleContext} type={"Create"} publish={publish} handlePublish={setPublish}/>
        
      </form>
    </div>
  );
};

export default CreateBlog;
