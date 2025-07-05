import Button from "./Button";
import Tags from "./Tags";

interface Blog {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
  };
  authorImage?: string;
  publishedAt: string;
  published: boolean;
  tags: { name: string }[];
}

function Blogs({ blog, onClick,edit }: { blog: Blog , onClick: (id: string) => void, edit?: boolean}) {
  const handleClick = (id:string) => {
    window.location.href = `/update/${id}`;
  }
  let content = blog.content.length > 80 ? blog.content.substring(0, 75) + "..." : blog.content;

  content = content.replace(/[#*\-`]/g, '');

  return (
    <div className="w-full max-w-2xl min-w-md my-5 p-4 rounded-lg border cursor-pointer dark:border-zinc-800" 
      onClick={() => onClick(blog.id)}
    >
      <div className="flex items-center justify-between mb-3">
        
        <div className="flex items-center">
          <Avatar name={blog.author.name? blog.author.name: "U"} image={blog.authorImage} />
          <div className="ml-3">
            <h3 className="text-sm font-semibold">{blog.author.name}</h3>
            <span className="font-mono text-xs text-gray-400">{blog.publishedAt.substring(0, 10)}</span>
          </div>
        </div>
          <div className="flex justify-center items-center">
            {edit ? 
            <>
              <Button label="Edit" onClick={(e) => {
                e.stopPropagation()
                handleClick(blog.id)
              }} />
              <div className="ml-2">
                {blog.published ? <div className="p-1.5 bg-green-500 rounded-full"></div> : <div className="p-1.5 bg-red-500 rounded-full"></div>}
              </div>
            </>
            
            : null}
          </div>  
      </div>
      
      <Tags tags={blog.tags.map(tag => tag.name)} />

      <h2 className="text-xl font-bold mb-2">{blog.title}</h2>
      
      <p className="text-gray-600 mb-3 dark:text-gray-300 overflow-clip">
        {content}
      </p>
      
      <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-zinc-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">{Math.ceil(content.length / 1000)} min read</p>
      </div>
    </div>
  );
}

function Avatar({ name, image }: { name: string; image?: string }) {
  return (
    <div className="relative select-none inline-flex items-center justify-center w-8 h-8 overflow-hidden bg-gray-100 rounded-full dark:bg-zinc-800 ring-2 ring-white dark:ring-zinc-700">
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <span className="font-medium text-sm text-center text-gray-600 dark:text-gray-300">
          {name[0].toUpperCase()}
        </span>
      )}
    </div>
  );
}

export default Blogs;
