interface PublishProps {
    publish: boolean;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Publish = ({publish, onClick} : PublishProps) => {
  return (
    <div className="ml-2 cursor-pointer flex justify-center items-center my-4 rounded" onClick={onClick}>{publish? <p className="bg-red-500 text-center p-1.5 rounded text-black w-full">Unpublish</p>: <p className="bg-green-500 text-center p-1.5 rounded text-black w-full">Publish</p>}</div>
  )
}

export default Publish