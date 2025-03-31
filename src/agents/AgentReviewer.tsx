import { useState } from "react";
import { buildMessageContext } from "../helpers/buildMessageContext";
import { sendToReviewerAgent } from "../api/llm";
import { reviewerMemorySnippets } from "../utils/loadMemorySnippets";

export const buildReviewerPrompt = (code: string) => {
    return `
  You are a senior React + TypeScript code reviewer.
  
  Your job is to review the code below and suggest improvements **only if necessary**.
  
  You are trained with internal code standards and best practices provided below. Use them as your primary reference.
  
  ---
  
  🧠 Reviewer Memory:
  ${reviewerMemorySnippets.map((snippet, i) => `--- Memory ${i + 1} ---\n${snippet}`).join('\n\n')}
  
  ---
  
  🔍 When reviewing:
  - Focus only on real issues or clear violations of best practices
  - Do not suggest changes that are not supported by memory or common sense
  - Be strict about accessibility and React.FC usage
  - If everything looks good, respond with: "✅ This component follows best practices."
  - If you suggest a code change, the new code must actually reflect your suggestions
  - Keep your feedback short, specific, and developer-friendly
  
  ---
  
  📦 Code to review:
  \`\`\`tsx
  ${code}
  \`\`\`
  `.trim();
};

export const AgentReviewer = () => {
    const [reviewInput, setReviewInput] = useState("");
    const [reviewResult, setReviewResult] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReview = async () => {
        if (!reviewInput.trim()) return;
        setLoading(true);
        setReviewResult("");

        const reviewerPrompt = buildReviewerPrompt(reviewInput)

        const reviewerContext = buildMessageContext(
            reviewerPrompt,
            [],
            `Please review and improve this component:\n\n${reviewInput}`
        );

        const reviewed = await sendToReviewerAgent(reviewerContext);
        setReviewResult(reviewed);
        setLoading(false);
    };

    return (
        <div>
            <h2>🧚‍♂️ Code Reviewer</h2>
            <textarea
                placeholder="Paste your component code here..."
                value={reviewInput}
                onChange={(e) => setReviewInput(e.target.value)}
                rows={14}
                style={{ width: "100%", padding: "1rem", fontFamily: "monospace" }}
            />
            <button
                style={{ marginTop: "1rem" }}
                onClick={handleReview}
                disabled={loading}
            >
                {loading ? "Reviewing..." : "🔍 Review Code"}
            </button>

            {reviewResult && (
                <pre style={{ marginTop: "1rem", background: "#111", color: "#0f0", padding: "1rem" }}>
                    {reviewResult}
                </pre>
            )}
        </div>
    );
};