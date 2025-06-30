import { FadeLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="bg-white dark:bg-black absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
      <FadeLoader
        color="#4b4b4b"
        height={15}
        width={5}
        radius={2}
        margin={2}
        speedMultiplier={1.5}
        className="dark:text-white"
      />
    </div>
  );
}

export default Loader