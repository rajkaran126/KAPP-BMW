import { useState, useCallback } from 'react';
import { chatAPI } from '../utils/api';

/**
 * Custom hook for AI chatbot functionality
 */
export const useChatbot = () => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Welcome to KAPP-BMW AUTOMOBILE! I\'m your AI assistant. How can I help you explore our BMW collection today?',
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendMessage = useCallback(async (userMessage) => {
        if (!userMessage.trim()) return;

        // Add user message to chat
        const newUserMessage = { role: 'user', content: userMessage };
        setMessages((prev) => [...prev, newUserMessage]);
        setIsLoading(true);
        setError(null);

        try {
            // Prepare conversation history (last 5 messages for context)
            const conversationHistory = messages.slice(-5).map((msg) => ({
                role: msg.role,
                content: msg.content,
            }));

            // Call API
            const response = await chatAPI.sendMessage(userMessage, conversationHistory);

            // Add assistant response
            const assistantMessage = { role: 'assistant', content: response.reply };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (err) {
            console.error('Chat error:', err);
            setError('Failed to get response. Please try again.');

            // Add error message to chat
            const errorMessage = {
                role: 'assistant',
                content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [messages]);

    const clearMessages = useCallback(() => {
        setMessages([
            {
                role: 'assistant',
                content: 'Welcome to KAPP-BMW AUTOMOBILE! I\'m your AI assistant. How can I help you explore our BMW collection today?',
            },
        ]);
        setError(null);
    }, []);

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        clearMessages,
    };
};

export default useChatbot;
