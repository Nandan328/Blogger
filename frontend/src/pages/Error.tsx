import { Navigate } from "react-router-dom"

const Error = () => {

    const token = localStorage.getItem('token')

    if (!token) {
        return <Navigate to="/signin" />
    }

  return (
    <div className="h-screen flex justify-center items-center text-3xl dark:bg-black dark:text-white">
        404 Page Not Found
    </div>
  )
}

export default Error