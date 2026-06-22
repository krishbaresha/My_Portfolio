'use client';

import { useState, useRef, useEffect } from 'react';
import { Terminal, ShieldAlert } from 'lucide-react';

interface LogLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success';
}

export default function InteractiveTerminal() {
  const [history, setHistory] = useState<LogLine[]>([
    { text: 'Krish Shell v1.0.4 initialized.', type: 'success' },
    { text: 'Type "help" for a list of available command directives.', type: 'output' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const focusInput = () => {
    if (inputRef.current) inputRef.current.focus();
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputValue.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...history, { text: `visitor@krishbaresha:~$ ${inputValue}`, type: 'input' as const }];
    setInputValue('');

    switch (cmd) {
      case 'help':
        newHistory.push({
          text: 'Available Commands:\n  about    - Learn more about Krish\n  skills   - Core technical capabilities\n  projects - View selected repositories\n  socials  - Connect on social platforms\n  secret   - Initialize system bypass\n  clear    - Clear terminal screen',
          type: 'output',
        });
        break;
      case 'about':
        newHistory.push({
          text: 'Krish Baresha is an AI Engineer and Creative Full Stack Developer. Currently pursuing a BS in Computer Science at University of Sindh, specializing in high-performance web systems and browser automation agents.',
          type: 'output',
        });
        break;
      case 'skills':
        newHistory.push({
          text: 'Technical Skill Spheres:\n  - Frontend: Next.js 15, TypeScript, Tailwind CSS, GSAP, Framer Motion\n  - Systems: Node.js, Express, REST & GraphQL APIs, Postgres, Redis\n  - Intelligence: OpenAI & Gemini APIs, LangChain, RAG, PGVector\n  - Infrastructure: AWS, Supabase, Docker, Vercel',
          type: 'output',
        });
        break;
      case 'projects':
        newHistory.push({
          text: 'Primary Case Studies:\n  - Neuro-Flow: A cognitive LLM workflow automation pipeline\n  - Immersive 3D Engine: Interactive browser WebGL renders\n  - Agentic Runner: High-frequency Puppeteer actions & scraper nodes',
          type: 'output',
        });
        break;
      case 'socials':
        newHistory.push({
          text: 'GitHub: github.com/krishbaresha\nLinkedIn: linkedin.com/in/krishbaresha\nTwitter: x.com/krishbaresha',
          type: 'success',
        });
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'secret':
        newHistory.push({
          text: 'ACCESS GRANTED. ERROR: Core gravity systems overloaded. Initiating digital particles bypass... (Just kidding, thanks for exploring!)',
          type: 'success',
        });
        break;
      default:
        newHistory.push({
          text: `Command not found: "${cmd}". Type "help" for a list of valid directories.`,
          type: 'error',
        });
        break;
    }

    setHistory(newHistory);
  };

  return (
    <div 
      onClick={focusInput}
      className="w-full rounded-2xl glass-panel border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl overflow-hidden font-mono text-xs text-zinc-300 flex flex-col h-[350px] relative cursor-text select-text"
    >
      {/* Scanline Effect overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.03),transparent_80%)]" />
      
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5 select-none">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
          <Terminal className="w-3.5 h-3.5 text-accent-purple" />
          Secure Shell Term
        </div>
        <div className="w-12" />
      </div>

      {/* Screen Log Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5 no-scrollbar leading-relaxed">
        {history.map((line, idx) => (
          <div 
            key={idx} 
            className={`whitespace-pre-wrap ${
              line.type === 'input' 
                ? 'text-white' 
                : line.type === 'error' 
                ? 'text-red-400 flex items-start gap-1.5' 
                : line.type === 'success' 
                ? 'text-emerald-400' 
                : 'text-zinc-400'
            }`}
          >
            {line.type === 'error' && <ShieldAlert className="w-3.5 h-3.5 mt-0.5 shrink-0" />}
            {line.text}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleCommand} className="flex items-center gap-2 p-4 border-t border-white/5 bg-black/40">
        <span className="text-accent-purple font-semibold select-none">visitor@krishbaresha:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-white focus:ring-0 p-0 font-mono text-xs placeholder:text-zinc-700"
          placeholder="type a command..."
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </form>
    </div>
  );
}
