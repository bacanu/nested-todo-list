import markdownIt from "markdown-it";
import hljs from "highlight.js"
import { useEffect, useState } from "react";

let markdown = markdownIt({
  html: true,
  linkify: true,
  highlight: function (str: any, lang: any) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }

    return ''; // use external default escaping
  },
  typographer: true
})

type Props = {
  content: string,
};

const MarkdownBlock: React.FC<Props> = ({ content }) => {
  const [md, setMd] = useState('')

  useEffect(() => {
    setMd(markdown.render(content))
  }, [content])

  return (
    <div dangerouslySetInnerHTML={{__html: md}} />
  );
};

export default MarkdownBlock;