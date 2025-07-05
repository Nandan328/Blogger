import Input from "./Input";
import Button from "./Button";
import Publish from "./Publish";
import Tags from "./Tags";
// import MDEditor from "@uiw/react-md-editor";
import React from "react";

interface BlogInputs {
  handleTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title?: string;
  handleContent: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  content?: string;
  type: string;
  publish: boolean;
  handlePublish: (e: boolean) => void;
  handleTags: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  tags: string[];
  removeTag: (tag: string) => void;
}

const BlogInputs = ({
  handleTitle,
  title,
  handleContent,
  content,
  type,
  publish,
  handlePublish,
  handleTags,
  tags,
  removeTag,
}: BlogInputs) => {

  const allTags = [
    "GUIDE",
    "TECH",
    "GAMING",
    "NEWS",
    "LIFESTYLE",
    "EDUCATION",
    "HEALTH",
    "ENTERTAINMENT",
    "SPORTS",
    "TRAVEL",
    "FOOD"
  ];

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

      <Tags tags={tags} removeTag={removeTag} />

      <div>
        <select
          name="tags"
          id="tags"
          value=""
          onChange={handleTags}
          className="dark:bg-black dark:text-white border rounded-full p-1"
        >
          <option value="" selected className="text-sm">
            Select tags
          </option>
          {allTags.map((tag) => {
            if (!tags.includes(tag)) {
              return (
                <option key={tag} value={tag} className="text-sm">
                  {tag}
                </option>
              );
            }
            return null;
          })}
        </select>
      </div>

      <div className="flex flex-col w-full">
        <label htmlFor="content" className="mb-1 font-bold">
          Content <span className="text-xs font-medium">(Markdown supported)</span>
        </label>
        {/* <MDEditor 
          value={content}
          onChange={(value) => handleContent(value || "")}
        /> */}
        <textarea
          id="content"
          placeholder="Enter blog content"
          className="border px-3 py-2 rounded-md min-h-[300px] w-full"
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
};

export default BlogInputs;
