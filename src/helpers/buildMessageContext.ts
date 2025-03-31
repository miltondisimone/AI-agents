export const buildMessageContext = (
    systemPrompt: string,
    memory: { role: "system" | "user" | "assistant"; content: string }[],
    newInput: string
  ) => {
    return [
      { role: "system" as const, content: systemPrompt },
      ...memory,
      { role: "user" as const, content: newInput },
    ];
  };
  