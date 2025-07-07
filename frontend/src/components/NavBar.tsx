import Button from "./Button";

const NavBar = ({ user }: { user: string | null }) => {
  const signout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    window.location.href = "/signin";
  };

  return (
    <div className="bg-white sticky top-0 z-50 h-16 flex justify-between items-center px-5 shadow-md dark:bg-black dark:shadow-white dark:shadow-sm">
      <div className="flex items-center">
        <a href="/" className="text-xl font-bold dark:text-white">
          Blogger{" "}
        </a>
      </div>
      <div className="flex items-center ">
        <Button label="Signout" onClick={signout} />
        <a href="/profile" className="ml-2">
          <Avatar user={user} />
        </a>
      </div>
    </div>
  );
};

const Avatar = ({ user }: { user: string | null }) => {
  return (
    <div className="relative select-none inline-flex items-center justify-center w-8 h-8 overflow-hidden bg-gray-100 rounded-full dark:bg-zinc-800 ring-2 ring-white dark:ring-zinc-700">
      {user ? (
        <img
          src={user}
          alt="User Avatar"
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <span className="text-md text-center text-gray-600 dark:text-gray-300">
          {"U"}
        </span>
      )}
    </div>
  );
};

export default NavBar;
