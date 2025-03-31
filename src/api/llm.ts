export const sendMessageToModel = async (
  model: string,
  messages: { role: "user" | "assistant" | "system"; content: string }[]
): Promise<string> => {
  const response = await fetch("http://192.168.1.131:11434/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
    }),
  });

  const data = await response.json();
  return data.message.content;
};

export const sendToDevAgent = (messages: any[]) => sendMessageToModel("deepseek-coder:33b", messages);
export const sendToReviewerAgent = (messages: any[]) => sendMessageToModel("codellama:13b-instruct", messages);
export const sendToPMAgent = (messages: any[]) => sendMessageToModel("mixtral:8x7b", messages);