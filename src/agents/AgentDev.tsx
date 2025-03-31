import { useState } from "react";
import { sendToDevAgent } from "../api/llm";
import { buildMessageContext } from "../helpers/buildMessageContext";
import { saveJsonToFile } from "../utils/saveToFile";
import { CodeBlock } from "../components/CodeBlock";
import { extractAllCodeBlocks } from "../helpers/extractCodeBlock";
import { labelCodeBlock } from "../helpers/labelCodeBlock";

import { devMemorySnippets } from "../utils/loadMemorySnippets";

export const buildDevAgentPrompt = (goal: string) => {
    return `
  You are a senior React + TypeScript developer. You always follow modern best practices when writing components.
  
  You have access to internal memory components that demonstrate correct patterns for:
  - Accessibility
  - Input handling
  - File uploads with previews
  - API data fetching
  - Form submission with validation
  - Async loading and success/error states
  
  🧠 Memory Components:
  ${devMemorySnippets.map((snippet, i) => `---\nMemory ${i + 1}:\n${snippet}`).join('\n\n')}
  
  ---
  
  🧩 Usage Rules:
  - If the task requires inputs, use **AccessibleFormInput**
  - If the task includes file uploads, use **ImageUploadPreview**
  - If data needs to be fetched, use **ApiFetcher**
  - If submitting forms, follow the structure of **ContactForm**
  - Do not rewrite logic from scratch if a memory component already handles it
  
  ---
  
  📏 Output Requirements:
  - Use **arrow functions** and **function components only**
  - Use **interfaces** to type props
  - Do **not** use React.FC
  - Do not include comments or extra explanation
  - Output a single .tsx component with valid syntax
  
  ---
  
  🛠️ Task:
  ${goal}
    `.trim();
};

export const AgentDev = () => {
    const [goal, setGoal] = useState("");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);
    const [codeBlocks, setCodeBlocks] = useState<{ language: string; code: string }[]>([]);
    const [memory, setMemory] = useState<
        { role: "system" | "user" | "assistant"; content: string }[]
    >([{ role: "system", content: "You are strict about using modern React best practices." }]);

    const handleSaveMemory = () => {
        saveJsonToFile(memory, `agent-session-${Date.now()}.json`);
    };

    const handleRun = async () => {
        if (!goal.trim()) return;

        setLoading(true);
        setOutput("");

        const devPrompt = buildDevAgentPrompt(goal);

        const devContext = buildMessageContext(
            devPrompt,
            memory,
            goal
        );

        const result = await sendToDevAgent(devContext);

        setMemory((prev) => [
            ...prev,
            { role: "user", content: goal },
            { role: "assistant", content: result },
        ]);

        const blocks = extractAllCodeBlocks(result);
        setCodeBlocks(blocks);
        setOutput(result);
        setLoading(false);
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>🧠 Dev Agent</h2>

            <textarea
                placeholder="Paste your prompt here..."
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                rows={14}
                style={{ width: "100%", padding: "1rem", fontFamily: "monospace" }}
            />
            <div style={{ marginTop: "1rem" }}>
                <button onClick={handleRun} disabled={loading}>
                    {loading ? "Thinking..." : "Run Agent"}
                </button>
                <button onClick={handleSaveMemory} style={{ marginLeft: "1rem" }}>
                    Save Session
                </button>
            </div>

            <pre style={{ marginTop: "2rem", background: "#111", color: "#0f0", padding: "1rem" }}>
                {output.replace(/```[\s\S]+?```/, "").trim()}
            </pre>

            {codeBlocks.map((block, index) => {
                const label = labelCodeBlock(block.code, block.language);
                return (
                    <div key={index} style={{ marginTop: "1rem" }}>
                        <div style={{
                            background: "#222",
                            color: "#0ff",
                            padding: "0.25rem 0.75rem",
                            fontSize: "0.8rem",
                            fontFamily: "monospace",
                            borderTopLeftRadius: "6px",
                            borderTopRightRadius: "6px",
                        }}>
                            {label}
                        </div>
                        <CodeBlock language={block.language}>
                            {block.code}
                        </CodeBlock>
                    </div>
                );
            })}
        </div>
    );
};
