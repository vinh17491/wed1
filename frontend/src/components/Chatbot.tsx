import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { chatApi } from '../api';
import i18n from '../i18n';
import './Chatbot.css';

interface Message {
  id: number; role: 'bot' | 'user'; content: string; timestamp: Date;
}

const MAX_MESSAGES = 100;

export default function Chatbot() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'bot', content: "👋 Hi! I'm an AI assistant for this portfolio. Ask me anything about skills, projects, or experience!", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  const isMounted = useRef(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const msgIdRef = useRef(1); // monotonic counter for unique IDs

  useEffect(() => {
    return () => {
      isMounted.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (open) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typing, open]);

  const send = useCallback(async () => {
    if (!input.trim() || typing) return;

    // Cancel any in-flight request
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    msgIdRef.current += 1;
    const userMsg: Message = { id: msgIdRef.current, role: 'user', content: input, timestamp: new Date() };
    
    setMessages(m => [...m, userMsg].slice(-MAX_MESSAGES));
    const q = input;
    setInput('');
    setTyping(true);

    try {
      const res = await chatApi.send(q, i18n.language);
      if (!isMounted.current) return;
      
      msgIdRef.current += 1;
      const botMsg: Message = {
        id: msgIdRef.current,
        role: 'bot',
        content: res.data.data?.message || 'Sorry, I could not process that.',
        timestamp: new Date()
      };
      setMessages(m => [...m, botMsg].slice(-MAX_MESSAGES));
    } catch (err: unknown) {
      if (!isMounted.current) return;
      // Don't show error for aborted requests
      if (err instanceof Error && err.name === 'AbortError') return;
      if (err && typeof err === 'object' && 'code' in err && (err as any).code === 'ERR_CANCELED') return;

      msgIdRef.current += 1;
      setMessages(m => [...m, {
        id: msgIdRef.current, role: 'bot' as const,
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }].slice(-MAX_MESSAGES));
    } finally {
      if (isMounted.current) {
        setTyping(false);
      }
    }
  }, [input, typing]);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <button className="chatbot__toggle" onClick={() => setOpen(o => !o)} aria-label="Open chat">
        {open ? (
          <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round"/></svg>
        ) : (
          <svg width="22" height="22" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeLinecap="round" strokeLinejoin="round"/></svg>
        )}
      </button>

      {open && (
        <div className="chatbot__window">
          <div className="chatbot__header">
            <div className="chatbot__header-info">
              <div className="chatbot__avatar">🤖</div>
              <div>
                <h3>{t('chat.title')}</h3>
                <p>{typing ? t('chat.typing') : 'Online'}</p>
              </div>
            </div>
            <button className="chatbot__close" onClick={() => setOpen(false)}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round"/></svg>
            </button>
          </div>

          <div className="chatbot__messages">
            {messages.map(msg => (
              <div key={msg.id} className={`chatbot__message chatbot__message--${msg.role}`}>
                <div className="chatbot__bubble">{msg.content}</div>
                <div className="chatbot__timestamp">{formatTime(msg.timestamp)}</div>
              </div>
            ))}
            {typing && (
              <div className="chatbot__message chatbot__message--bot">
                <div className="chatbot__typing">
                  <div className="chatbot__typing-dot" />
                  <div className="chatbot__typing-dot" />
                  <div className="chatbot__typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot__input-area">
            <input
              id="chatbot-input"
              className="chatbot__input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder={t('chat.placeholder')}
            />
            <button
              id="chatbot-send"
              className="chatbot__send"
              onClick={send}
              disabled={!input.trim() || typing}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
