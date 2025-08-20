
"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { type GenerationResult } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { askAiAboutCode } from "@/app/actions";
import { Send, Loader2, User, Bot } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface ResultsChatProps {
    results: GenerationResult;
}

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export function ResultsChat({ results }: ResultsChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isPending, startTransition] = useTransition();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isPending) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        startTransition(async () => {
            const answer = await askAiAboutCode({
                question: input,
                codeContext: {
                    genesisBlockCode: results.genesisBlockCode,
                    networkConfigurationFile: results.networkConfigurationFile,
                    readmeContent: results.readmeContent,
                    installScript: results.installScript,
                }
            });
            const assistantMessage: Message = { role: 'assistant', content: answer };
            setMessages(prev => [...prev, assistantMessage]);
        });
    };

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);


    return (
        <div className="bg-card/50 rounded-lg border border-border p-4 h-[500px] flex flex-col">
            <ScrollArea className="flex-grow mb-4 pr-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center text-muted-foreground pt-10">
                            <Bot className="mx-auto h-10 w-10 mb-2" />
                            <p className="font-semibold">Ask me anything about your project!</p>
                            <p className="text-sm">For example: "How do I compile the code?" or "What is the block reward?"</p>
                        </div>
                    )}
                    {messages.map((message, index) => (
                        <ChatMessage key={index} message={message} />
                    ))}
                    {isPending && (
                        <div className="flex items-start gap-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 flex-shrink-0">
                                <Bot className="h-5 w-5 text-primary" />
                            </div>
                            <div className="bg-muted rounded-lg p-3">
                                <Loader2 className="animate-spin h-5 w-5 text-muted-foreground" />
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question about your generated code..."
                    disabled={isPending}
                />
                <Button type="submit" disabled={!input.trim() || isPending} size="icon">
                    <Send />
                </Button>
            </form>
        </div>
    );
}


function ChatMessage({ message }: { message: Message }) {
    const isUser = message.role === 'user';
    const [safeHtml, setSafeHtml] = useState('');

    useEffect(() => {
        if (message.role === 'assistant') {
            if (typeof window !== 'undefined') {
                const unsafeHtml = marked.parse(message.content) as string;
                setSafeHtml(DOMPurify.sanitize(unsafeHtml));
            }
        }
    }, [message.content, message.role]);

    return (
        <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}>
             {!isUser && (
                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 flex-shrink-0">
                    <Bot className="h-5 w-5 text-primary" />
                </div>
             )}
            <div className={`max-w-[80%] rounded-lg p-3 ${isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
               {isUser ? (
                 <p>{message.content}</p>
               ) : (
                 <div className="prose prose-sm prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: safeHtml }} />
               )}
            </div>
             {isUser && (
                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 flex-shrink-0">
                    <User className="h-5 w-5 text-accent" />
                </div>
             )}
        </div>
    )
}
