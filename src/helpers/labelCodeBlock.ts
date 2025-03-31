export const labelCodeBlock = (code: string, language: string): string => {
    // Look for function or component names
    const nameMatch =
      code.match(/function\s+([a-zA-Z0-9_]+)/) ||
      code.match(/const\s+([a-zA-Z0-9_]+)\s*=\s*\(/) ||
      code.match(/export\s+default\s+function\s+([a-zA-Z0-9_]+)/);
  
    const name = nameMatch?.[1] ?? "snippet";
    const ext = language === "bash" ? "sh" : language || "txt";
  
    return `${name}.${ext}`;
  };