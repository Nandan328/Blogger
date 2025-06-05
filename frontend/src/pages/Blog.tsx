import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Loader from "../components/Loader";
import NavBar from "../components/NavBar";

interface Blog {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
  };
  publishedAt: string;
}

const Blog = () => {

  const id = useParams().id

  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem("token")

  useEffect(() => {
    window.scrollTo(0, 0);
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/blog?id=${id}`,{
      headers:{
        Token: token
      }
    })
      .then((res) => {
        setBlog(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
      })

  },[id, token])

  return (
    <div className="min-h-screen dark:bg-black dark:text-white">
      <NavBar/>
      <div className="px-6 sm:px-10">
        {loading ? 
          <Loader/> : 
            <div className="max-w-3xl mx-auto bg-white dark:bg-black overflow-hidden p-6 sm:p-8">
              <div className="mb-6 border-b pb-5">
                <h1 className="text-3xl sm:text-4xl font-extrabold dark:text-white mb-2">{blog?.title}</h1>
                <p className="text-sm  dark:text-white">
                  Posted on {blog?.publishedAt.substring(0,10)}
                </p>
              </div>
              <div className="mb-8">
                {blog?.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="dark:text-gray-200 mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="flex justify-end pt-4 border-t">
                <p className="italic  dark:text-gray-400">
                  Written by <span className="font-semibold">{blog?.author.name}</span>
                </p>
              </div>
            </div>
        }
      </div>
    </div>
  )
}

export default Blog