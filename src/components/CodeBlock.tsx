import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  language: string;
  children: string;
};

export const CodeBlock = ({ language, children }: Props) => {
  return (
    <SyntaxHighlighter
      language={language}
      style={atomDark}
      wrapLines
      customStyle={{
        borderRadius: "8px",
        fontSize: "0.9rem",
        padding: "1rem",
        marginTop: "1rem",
      }}
    >
      {children}
    </SyntaxHighlighter>
  );
};
