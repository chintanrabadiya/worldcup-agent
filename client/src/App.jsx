import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

const API_URL = '/api/chat';

const SUGGESTED_PROMPTS = [
  "I'm a Mexico fan flying from Toronto with a $3,000 CAD budget. Plan me a 10-day trip to see 2 Mexico games.",
  "Find all Argentina matches and tell me the cheapest city to watch them from New York.",
  "Where can I watch Canada play? I want to stay under $2,000 USD total for 5 nights.",
  "Plan a World Cup final trip from London — include all costs for 3 nights in New York.",
  "I love Brazil. What's the best city combo to see 2 matches on a mid-range budget?",
  "Compare attending a match in Dallas vs Mexico City — which is better value from Chicago?",
];

const HEADER_EMOJI = '⚽';

function TypingIndicator() {
  return (
    <div style={styles.bubbleRow('assistant')}>
      <div style={styles.avatar('assistant')}>🤖</div>
      <div style={{ ...styles.bubble('assistant'), padding: '14px 18px' }}>
        <div style={styles.dots}>
          <span style={{ ...styles.dot, animationDelay: '0s' }} />
          <span style={{ ...styles.dot, animationDelay: '0.18s' }} />
          <span style={{ ...styles.dot, animationDelay: '0.36s' }} />
        </div>
      </div>
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={styles.bubbleRow(msg.role)}>
      {!isUser && <div style={styles.avatar('assistant')}>🤖</div>}
      <div style={styles.bubble(msg.role)}>
        {isUser ? (
          <span style={{ fontSize: 15, lineHeight: 1.6 }}>{msg.content}</span>
        ) : (
          <div style={styles.markdown}>
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        )}
      </div>
      {isUser && <div style={styles.avatar('user')}>🙋</div>}
    </div>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        `# Welcome to the World Cup 2026 Fan Trip Planner ⚽\n\nI'm your AI agent powered by **Gemini** and **MongoDB**. I can:\n\n- 📅 Find match schedules for any team or city\n- 🏟️ Get venue details for all 16 host cities\n- 💰 Calculate your full trip budget (flights, hotel, tickets, food)\n- ✈️ Build a complete personalised trip plan\n\nTell me your favourite team, your departure city, and your budget — I'll do the rest!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = useCallback(
    async (text) => {
      const msg = (text || input).trim();
      if (!msg || loading) return;

      setInput('');
      setError(null);
      const userMsg = { role: 'user', content: msg };
      const newHistory = [...messages, userMsg];
      setMessages(newHistory);
      setLoading(true);

      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: msg,
            history: newHistory.slice(1).map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `Server error ${res.status}`);
        }

        const data = await res.json();
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } catch (err) {
        setError(err.message);
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `❌ Sorry, something went wrong: ${err.message}\n\nMake sure the server is running and your API keys are set.` },
        ]);
      } finally {
        setLoading(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    },
    [input, messages, loading]
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: `# Welcome back! ⚽\n\nI'm ready to plan your World Cup 2026 trip. Tell me your team, city, and budget!`,
      },
    ]);
    setError(null);
  };

  return (
    <div style={styles.root}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={{ fontSize: 28 }}>{HEADER_EMOJI}</span>
          <div>
            <div style={styles.headerTitle}>World Cup 2026 Fan Trip Planner</div>
            <div style={styles.headerSub}>Powered by Gemini AI + MongoDB Atlas</div>
          </div>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.badge('gemini')}>Gemini 2.5</span>
          <span style={styles.badge('mongo')}>MongoDB</span>
          <button style={styles.clearBtn} onClick={clearChat} title="New chat">
            ↺ New chat
          </button>
        </div>
      </header>

      {/* Messages */}
      <main style={styles.main}>
        <div style={styles.messageList}>
          {messages.map((m, i) => (
            <Message key={i} msg={m} />
          ))}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Suggested prompts — only show when no user messages yet */}
        {messages.length === 1 && !loading && (
          <div style={styles.suggestions}>
            <p style={styles.suggestLabel}>Try one of these:</p>
            <div style={styles.suggestGrid}>
              {SUGGESTED_PROMPTS.map((p, i) => (
                <button key={i} style={styles.suggestBtn} onClick={() => sendMessage(p)}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Input */}
      <footer style={styles.footer}>
        {error && <div style={styles.errorBanner}>{error}</div>}
        <div style={styles.inputRow}>
          <textarea
            ref={inputRef}
            style={styles.textarea}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me to plan your World Cup trip… e.g. 'Mexico fan, $2k budget, flying from Toronto'"
            rows={1}
            disabled={loading}
          />
          <button
            style={{ ...styles.sendBtn, opacity: loading || !input.trim() ? 0.5 : 1 }}
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            title="Send"
          >
            {loading ? '...' : '➤'}
          </button>
        </div>
        <p style={styles.footerNote}>
          Match data from MongoDB Atlas · Budget estimates are approximate · Buy tickets at{' '}
          <a href="https://www.fifa.com/tickets" target="_blank" rel="noopener noreferrer" style={{ color: '#4caf50' }}>
            fifa.com/tickets
          </a>
        </p>
      </footer>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
        .markdown-body { width: 100%; box-sizing: border-box; }
        .markdown-body h1 { font-size: 1.2em; margin: 0 0 10px; color: #e0e0e0; }
        .markdown-body h2 { font-size: 1.05em; margin: 14px 0 6px; color: #c8e6c9; border-bottom: 1px solid #2a2a2a; padding-bottom: 4px; }
        .markdown-body h3 { font-size: 1em; margin: 10px 0 4px; color: #b0bec5; }
        .markdown-body p { margin: 0 0 8px; line-height: 1.65; }
        .markdown-body ul, .markdown-body ol { margin: 4px 0 10px 0; padding-left: 0px; box-sizing: border-box; }
        .markdown-body li { margin: 4px 0; line-height: 1.6; padding-left: 2px; }
        .markdown-body li > ul, .markdown-body li > ol { margin: 2px 0; }
        .markdown-body strong { color: #fff; }
        .markdown-body em { color: #aaa; }
        .markdown-body code { background: rgba(255,255,255,0.1); padding: 1px 5px; border-radius: 4px; font-size: 0.9em; }
        .markdown-body a { color: #4caf50; }
        .markdown-body hr { border: none; border-top: 1px solid #2a2a2a; margin: 10px 0; }
        textarea { resize: none; overflow: hidden; }
      `}</style>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: '#0a0a0a',
    color: '#f0f0f0',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    background: '#111',
    borderBottom: '1px solid #222',
    flexShrink: 0,
    flexWrap: 'wrap',
    gap: 10,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontWeight: 700,
    fontSize: 16,
    color: '#fff',
  },
  headerSub: {
    fontSize: 12,
    color: '#777',
    marginTop: 1,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: (type) => ({
    fontSize: 11,
    fontWeight: 600,
    padding: '3px 8px',
    borderRadius: 20,
    background: type === 'gemini' ? '#1a237e' : '#1b5e20',
    color: type === 'gemini' ? '#90caf9' : '#a5d6a7',
    border: `1px solid ${type === 'gemini' ? '#283593' : '#2e7d32'}`,
  }),
  clearBtn: {
    background: 'transparent',
    border: '1px solid #333',
    color: '#888',
    padding: '4px 10px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 12,
  },
  main: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 0',
    display: 'flex',
    flexDirection: 'column',
  },
  messageList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    maxWidth: 820,
    margin: '0 auto',
    width: '100%',
    padding: '0 16px',
  },
  bubbleRow: (role) => ({
    display: 'flex',
    flexDirection: role === 'user' ? 'row-reverse' : 'row',
    alignItems: 'flex-end',
    gap: 10,
  }),
  avatar: (role) => ({
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: role === 'user' ? '#1565c0' : '#1b5e20',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    flexShrink: 0,
  }),
  bubble: (role) => ({
    maxWidth: '80%',
    padding: '12px 16px',
    borderRadius: role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
    background: role === 'user' ? '#1565c0' : '#161616',
    border: role === 'user' ? 'none' : '1px solid #222',
    fontSize: 15,
    lineHeight: 1.6,
    overflow: 'hidden',
  }),
  markdown: {
    className: 'markdown-body',
  },
  dots: {
    display: 'flex',
    gap: 5,
    alignItems: 'center',
    height: 20,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: '#4caf50',
    display: 'inline-block',
    animation: 'bounce 1.2s ease-in-out infinite',
  },
  suggestions: {
    maxWidth: 820,
    margin: '24px auto 0',
    padding: '0 16px',
    width: '100%',
  },
  suggestLabel: {
    fontSize: 12,
    color: '#555',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  suggestGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 8,
  },
  suggestBtn: {
    background: '#111',
    border: '1px solid #2a2a2a',
    color: '#aaa',
    padding: '10px 14px',
    borderRadius: 10,
    fontSize: 13,
    textAlign: 'left',
    cursor: 'pointer',
    lineHeight: 1.45,
    transition: 'border-color 0.15s, color 0.15s',
  },
  footer: {
    background: '#0f0f0f',
    borderTop: '1px solid #1e1e1e',
    padding: '12px 16px 8px',
    flexShrink: 0,
  },
  errorBanner: {
    background: '#1c0a0a',
    border: '1px solid #5c1616',
    color: '#f88',
    padding: '8px 12px',
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 10,
  },
  inputRow: {
    display: 'flex',
    gap: 10,
    alignItems: 'flex-end',
    maxWidth: 820,
    margin: '0 auto',
    width: '100%',
  },
  textarea: {
    flex: 1,
    background: '#161616',
    border: '1px solid #2e2e2e',
    borderRadius: 12,
    color: '#f0f0f0',
    padding: '12px 16px',
    fontSize: 15,
    outline: 'none',
    fontFamily: 'inherit',
    lineHeight: 1.5,
    maxHeight: 140,
  },
  sendBtn: {
    background: '#2e7d32',
    border: 'none',
    color: '#fff',
    width: 44,
    height: 44,
    borderRadius: 12,
    fontSize: 18,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'opacity 0.15s',
  },
  footerNote: {
    fontSize: 11,
    color: '#444',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 820,
    margin: '8px auto 0',
  },
};
