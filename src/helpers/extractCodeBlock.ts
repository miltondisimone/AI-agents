export const extractAllCodeBlocks = (text: string) => {
    const regex = /```(\w*)\n([\s\S]+?)```/g;
    const matches = [...text.matchAll(regex)];
  
    if (!matches.length) return [];
  
    return matches.map((match) => ({
      language: match[1] || "typescript",
      code: match[2],
    }));
  };