import ReactMarkdown from "react-markdown";

function MarkDown({ content }: { content: string }) {
  return (
    <div className="prose dark:prose-invert">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

export default MarkDown;
