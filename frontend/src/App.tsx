import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Sigin from "./pages/Signin"
import Signup from "./pages/Signup"
import ForYou from "./pages/ForYou"
import Blog from "./pages/Blog"
import Error from "./pages/Error"
import CreateBlog from "./pages/CreateBlog"
import Profile from "./pages/Profile"
import UpdateBlog from "./pages/UpdateBlog"

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/signin" element={<Sigin/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/blog/:id" element={<Blog/>}/>
          <Route path="/create-blog" element={<CreateBlog />} />
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/" element={<ForYou/>}/>
          <Route path="/update/:id" element={<UpdateBlog />} />
          <Route path="*" element={<Error/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
