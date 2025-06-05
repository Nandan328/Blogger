import Button from "./Button";

const NavBar = () => {

  const user = localStorage.getItem("user")?.toUpperCase() || "U";

  const signout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("id")
    window.location.href = "/signin"
  }

  return (
    <div className="bg-white sticky top-0 z-50 h-16 flex justify-between items-center px-5 shadow-md dark:bg-black dark:shadow-white dark:shadow-sm">
      <div className="flex items-center">
        <a href="/" className="text-xl font-bold dark:text-white">Blogger </a>
      </div>
      <div className="flex items-center ">
        <Button label="Signout" onClick={signout}/>
        <a href="/profile" className="ml-2">
          <div className="relative select-none inline-flex items-center justify-center w-8 h-8 overflow-hidden bg-gray-100 rounded-full dark:bg-zinc-800 ring-2 ring-white dark:ring-zinc-700">
            <span className="font-medium text-sm text-center text-gray-600 dark:text-gray-300">{user[0].toUpperCase()}</span>
          </div>
        </a>
        
      </div>
    </div>
  );
}

export default NavBar;