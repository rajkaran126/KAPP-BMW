import { useState, useRef, useEffect } from 'react';
import { useChatbot } from '../../hooks/useChatbot';

/**
 * Animated Glass Chat Panel
 * AI-powered chatbot interface with dark luxury styling
 */
export default function ChatPanel({ isOpen, onClose }) {
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);
    const { messages, isLoading, sendMessage } = useChatbot();

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (inputMessage.trim() && !isLoading) {
            sendMessage(inputMessage);
            setInputMessage('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-28 right-8 z-50 w-96 h-[500px] 
                    animate-slide-up origin-bottom-right">
            {/* Glass Panel Container */}
            <div className="w-full h-full glass-light rounded-2xl overflow-hidden 
                      shadow-2xl border border-bmw-blue/30 
                      flex flex-col">
                {/* Header */}
                <div className="gradient-bmw px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">BMW AI Assistant</h3>
                            <p className="text-white/70 text-xs">Always here to help</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 
                       transition-colors flex items-center justify-center text-white"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] px-4 py-3 rounded-2xl ${msg.role === 'user'
                                        ? 'bg-bmw-blue text-white rounded-br-sm'
                                        : 'bg-graphite-light text-gray-200 rounded-bl-sm'
                                    }`}
                            >
                                <p className="text-sm leading-relaxed">{msg.content}</p>
                            </div>
                        </div>
                    ))}

                    {/* Loading Indicator */}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-graphite-light px-4 py-3 rounded-2xl rounded-bl-sm">
                                <div className="flex space-x-2">
                                    <div className="w-2 h-2 bg-bmw-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-bmw-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-bmw-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <form onSubmit={handleSend} className="p-4 border-t border-white/10">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Ask about BMW models..."
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 rounded-xl bg-graphite-light
                         border border-white/10 focus:border-bmw-blue
                         text-white placeholder-gray-500
                         outline-none transition-colors
                         disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !inputMessage.trim()}
                            className="px-6 py-3 rounded-xl gradient-bmw
                         text-white font-semibold
                         hover:shadow-lg hover:shadow-bmw-blue/50
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-300
                         hover:scale-105 active:scale-95"
                        >
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
