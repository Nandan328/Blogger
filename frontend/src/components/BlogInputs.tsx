import Input from "./Input"
import Button from "./Button"
import Publish from "./Publish";

interface BlogInputs {
    handleTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
    title?: string;
    handleContent: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    content?: string;
    type: string
    publish: boolean
    handlePublish: (e: boolean) => void
}

const BlogInputs = ({handleTitle, title, handleContent, content, type, publish, handlePublish} : BlogInputs) => {
  return (
    <>
      <div>
        <Input
          label="Title"
          type="text"
          placeholder="Enter title"
          onChange={handleTitle}
          value={title}
        />
      </div>

      <div className="flex flex-col w-full">
        <label htmlFor="content" className="mb-1 font-bold">
          Content
        </label>
        <textarea
          id="content"
          placeholder="Enter blog content"
          className="border px-3 py-2 rounded-md min-h-[400px] w-full"
          onChange={handleContent}
          value={content}
        />
      </div>
      <div className="my-6 grid grid-cols-5">
        <div className="col-span-4">
          <Button label={type} onClick={() => {}} />
        </div>
        
        <Publish publish={publish} onClick={() => handlePublish(!publish)} />
      </div>
    </>
  );
}

export default BlogInputs