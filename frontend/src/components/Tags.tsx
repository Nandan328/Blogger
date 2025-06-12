interface TagsProps {
  tags: string[];
  removeTag?: (tag: string) => void;
}

export default function Tags({ tags, removeTag }: TagsProps) {
  return (
    <div className="flex m-2">
      <h1 className="text-md">Tags: </h1>
      <ul>
        {tags.map((tag) => (
          <li key={tag} className="inline-block mr-2">
            {removeTag ? (
              <span
                onClick={() => removeTag(tag)}
                className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded-full dark:bg-zinc-800 dark:text-gray-300 hover:bg-red-700 cursor-pointer"
              >
                {tag}
              </span>
            ) : (
              <span className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded-full dark:bg-zinc-800 dark:text-gray-300">
                {tag}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
