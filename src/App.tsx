import { useState } from 'react';
import './App.css'
import { AgentDev } from './agents/AgentDev'
import { AgentReviewer } from "./agents/AgentReviewer";
import { AgentPM } from './agents/AgentPM';

const App = () => {
  const [mode, setMode] = useState<'duo' | 'reviewer' | 'pm'>('duo');
  return (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setMode('duo')}
          style={{ marginRight: '1rem', fontWeight: mode === 'duo' ? 'bold' : 'normal' }}
        >
          🧠 Dev Mode
        </button>
        <button
          onClick={() => setMode('reviewer')}
          style={{ fontWeight: mode === 'reviewer' ? 'bold' : 'normal' }}
        >
          🧪 Reviewer Mode
        </button>
        <button
          onClick={() => setMode('pm')}
          style={{ marginLeft: '1rem', fontWeight: mode === 'pm' ? 'bold' : 'normal' }}
        >
          ✏️ PM Mode
        </button>
      </div>
      {mode === "duo" && <AgentDev />}
      {mode === "reviewer" && <AgentReviewer />}
      {mode === "pm" && <AgentPM />}
    </>
  )
}

export default App
