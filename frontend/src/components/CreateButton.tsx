import { useNavigate } from "react-router-dom"


const CreateButton = () => {

    const navigate = useNavigate()
    
    const handelClick = () => {
        navigate('/create-blog')
    }

  return (
    <div className="fixed bottom-5 right-5">
        <button onClick={handelClick} className="bg-black cursor-pointer text-lg dark:bg-white text-white w-10 h-10 dark:text-black rounded-full">✒️</button>
    </div>
  )
}

export default CreateButton