import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Icon, ICONS } from './UIComponents';

export default function AIAgentWidget() {
    const [isOpen, setIsOpen] = useState(false);
    
    // Load chat history from localStorage memory
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('lluvia_chat_history');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { console.error('Error parsing memory'); }
        }
        return [{ role: 'assistant', content: "Hi there! I'm LLUVIA, your friendly AI assistant. Ask me anything, or ask me to automate a task for you!" }];
    });
    
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const endOfMessagesRef = useRef(null);

    // Save chat history to localStorage memory strictly when it changes
    useEffect(() => {
        localStorage.setItem('lluvia_chat_history', JSON.stringify(messages));
    }, [messages]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        const newMessages = [...messages, { role: 'user', content: userMsg }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/api/chat', {
                message: userMsg,
                conversationHistory: messages
            });

            if (res.data && res.data.reply) {
                setMessages([...newMessages, { role: 'assistant', content: res.data.reply }]);
            } else {
                setMessages([...newMessages, { role: 'assistant', content: 'Connection error. No reply received.' }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            const serverDetail = error.response?.data?.detail ? ` (${error.response.data.detail})` : '';
            setMessages([...newMessages, { role: 'assistant', content: `Sorry, I encountered an error communicating with the server.${serverDetail}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end pointer-events-none">
            
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-96 rounded-[2rem] glass-panel border border-blue-500/20 shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in slide-in-from-bottom-8 duration-500 pointer-events-auto flex flex-col"
                    style={{ background: 'linear-gradient(160deg, rgba(16,20,40,0.9) 0%, rgba(5,5,15,0.95) 100%)', backdropFilter: 'blur(25px)' }}>
                    
                    {/* Header */}
                    <div className="p-5 border-b border-white/10 relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                                    <Icon path={ICONS.spark} size={20} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm tracking-wide">LLUVIA</h3>
                                    <p className="text-blue-400/80 text-[10px] uppercase tracking-wider font-semibold">Friendly Chatbot</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => {
                                    if(window.confirm("Start a new conversation? This will clear LLUVIA's memory.")) {
                                        localStorage.removeItem('lluvia_chat_history');
                                        setMessages([{ role: 'assistant', content: "Hi there! I'm LLUVIA, ready for a new conversation!" }]);
                                    }
                                }} title="New Conversation" className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors mr-1">
                                    <Icon path={ICONS.refresh} size={16} />
                                </button>
                                <button onClick={() => setIsOpen(false)} title="Close" className="text-gray-400 hover:text-white bg-white/5 hover:bg-red-500/80 p-2 rounded-full transition-colors">
                                    <Icon path={ICONS.close} size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 p-5 max-h-[22rem] overflow-y-auto custom-scrollbar flex flex-col gap-4 min-h-0">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3.5 rounded-2xl text-[13px] leading-relaxed relative ${
                                    msg.role === 'user' 
                                        ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg rounded-br-sm' 
                                        : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-sm shadow-inner'
                                }`}>
                                    {/* Small tail decoration */}
                                    <div className={`absolute bottom-0 w-3 h-3 ${msg.role === 'user' ? '-right-1.5' : '-left-1.5'} overflow-hidden`}>
                                        <div className={`w-full h-full transform ${msg.role === 'user' ? '-skew-x-12 bg-indigo-700' : 'skew-x-12 bg-white/5 border-l border-b border-white/10'}`} />
                                    </div>
                                    <p className="relative z-10 whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-2 rounded-bl-sm">
                                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-75"></span>
                                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse delay-150"></span>
                                </div>
                            </div>
                        )}
                        <div ref={endOfMessagesRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-white/5 bg-black/20">
                        <form onSubmit={handleSend} className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Chat with LLUVIA..."
                                className="w-full bg-[#0a0f1d] border border-white/10 text-white text-sm rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:border-blue-500/50 shadow-inner placeholder-gray-600"
                                disabled={isLoading}
                            />
                            <button 
                                type="submit" 
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 p-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                <Icon path={ICONS.send} size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Toggle FAB */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-[0_10px_40px_rgba(37,99,235,0.6)] cursor-pointer group pointer-events-auto transition-transform hover:scale-110 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}>
                <div className="absolute inset-0 rounded-full border border-blue-300/50 scale-[1.1] opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity" />
                <Icon path={isOpen ? ICONS.close : ICONS.spark} size={28} className={!isOpen ? "group-hover:rotate-12 transition-transform" : "rotate-90 transition-transform"} />
            </button>
        </div>
    );
}
