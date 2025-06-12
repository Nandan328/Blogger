import { RotatingLines } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="bg-white dark:bg-black absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
      <RotatingLines
        visible={true}
        width="40"
        strokeWidth="5"
        strokeColor="#808080"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
      />
    </div>
  );
}

export default Loader