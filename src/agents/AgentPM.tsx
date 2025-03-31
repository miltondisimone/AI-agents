import { useState } from "react";
import { sendToPMAgent } from "../api/llm";
import { buildMessageContext } from "../helpers/buildMessageContext";
import { saveJsonToFile } from "../utils/saveToFile";

export const AgentPM = () => {
    const [goal, setGoal] = useState("");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);
    const [memory, setMemory] = useState<
        { role: "system" | "user" | "assistant"; content: string }[]
    >([{ role: "system", content: "You are a helpful Product Manager that creates tasks in JIRA format, always including acceptance criteria." }]);

    const handleSaveMemory = () => {
        saveJsonToFile(memory, `pm-session-${Date.now()}.json`);
    };

    const handleRun = async () => {
        if (!goal.trim()) return;

        setLoading(true);
        setOutput("");

        const prompt = `
      Your task is to convert the user's goal into a properly formatted JIRA ticket.

      Requirements:
      - Start with a clear summary/title.
      - Include a detailed description.
      - Provide acceptance criteria using bullet points.
      - Use plain, concise language (no code or technical implementation details).
      - Output only the ticket content.
    `;

        const context = buildMessageContext(prompt, memory, goal);
        const result = await sendToPMAgent(context);

        setMemory((prev) => [
            ...prev,
            { role: "user", content: goal },
            { role: "assistant", content: result },
        ]);

        setOutput(result);
        setLoading(false);
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>📋 PM Agent</h2>
            <textarea
                placeholder="Paste your component code here..."
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                rows={14}
                style={{ width: "100%", padding: "1rem", fontFamily: "monospace" }}
            />
            <div style={{ marginTop: "1rem" }}>
                <button onClick={handleRun} disabled={loading}>
                    {loading ? "Generating..." : "Generate Ticket"}
                </button>
                <button onClick={handleSaveMemory} style={{ marginLeft: "1rem" }}>
                    Save Session
                </button>
            </div>
            <pre style={{ marginTop: "2rem", background: "#111", color: "#0f0", padding: "1rem" }}>
                {output}
            </pre>
        </div>
    );
};